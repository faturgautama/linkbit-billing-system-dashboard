import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { environment } from 'src/environments/environment';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
    selector: 'app-print-out-pos',
    standalone: true,
    imports: [
        CommonModule,
        QRCodeModule,
    ],
    templateUrl: './print-out-pos.component.html',
    styleUrl: './print-out-pos.component.scss'
})
export class PrintOutPosComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PaymentDatasource: any;

    QrCode: string = "";

    BackUrl = "/pembayaran";

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _utilityService: UtilityService,
        private _paymentService: PaymentService,
        private _settingCompanyService: SettingCompanyService,
    ) { }

    ngOnInit(): void {
        const id_payment = this._activatedRoute.snapshot.queryParams['id_payment'];
        this.getById(id_payment);

        if (this._activatedRoute.snapshot.queryParams['id_pelanggan']) {
            this.BackUrl = `/pelanggan?id_pelanggan=${this._activatedRoute.snapshot.queryParams['id_pelanggan']}`
        } else {
            this.BackUrl = '/pembayaran';
        };

        window.addEventListener('afterprint', () => { this._router.navigateByUrl(this.BackUrl); });
    }

    ngOnDestroy(): void {
        window.removeEventListener('afterprint', () => { this._router.navigate([this.BackUrl]); });
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getById(id_payment: number) {
        this._paymentService
            .getById(id_payment)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("result =>", result);

                    this.PaymentDatasource = {
                        invoice_number: result.data.invoice_number,
                        create_at: `${result.data.user_create}-${result.data.payment_method}/${this._utilityService.onFormatDate(new Date(), 'HH:mm:ss DD/MM/yyyy')}`,
                        full_name: result.data.full_name,
                        pelanggan_code: result.data.pelanggan_code,
                        alamat: result.data.alamat,
                        product_name: result.data.product_name,
                        invoice_date: this._utilityService.onFormatDate(new Date(result.data.invoice_date), 'MMM yyyy'),
                        due_date: this._utilityService.onFormatDate(new Date(result.data.due_date), 'DD MMM yyyy'),
                        price: formatCurrency(result.data.price, 'EN', 'Rp. '),
                        admin_fee: formatCurrency(result.data.admin_fee, 'EN', 'Rp. '),
                        total: formatCurrency(result.data.total, 'EN', 'Rp. '),
                        invoice_status: result.data.invoice_status,
                    };

                    this.QrCode = `${environment.checkoutUrl}/invoice-digital?token=${result.data.token}`;

                    // setTimeout(() => {
                    //     window.print();
                    // }, 1000);
                }
            });
    }
}
