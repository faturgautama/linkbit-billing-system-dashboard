import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { QRCodeModule } from 'angularx-qrcode';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        QRCodeModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
    ],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    IsSandboxMode = environment.sandbox;

    Logo = this._sanitizer.bypassSecurityTrustResourceUrl('https://linkbit.net.id/assets/img/logo-linkbit.png');;

    InvoiceDatasource: any;

    PaymentMethodDatasource: any[] = [];
    SelectedPaymentMethod: any;

    DetailPayment: any;
    IsPaymentGenerated: boolean = false;
    IsPaymentSuccess: boolean = false;

    constructor(
        private _socket: Socket,
        private _sanitizer: DomSanitizer,
        private _activatedRoute: ActivatedRoute,
        private _paymentService: PaymentService,
        private _messageService: MessageService,
    ) { }

    ngOnInit(): void {
        const token = this._activatedRoute.snapshot.queryParams['token'];

        if (token) {
            this.getDetailInvoice(token);
            this.listenSocket();
        }
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDetailInvoice(token: string) {
        this._paymentService
            .getFromToken(token)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.InvoiceDatasource = result.data;
                    this.IsPaymentGenerated = result.data.is_payment_generated;
                    this.IsPaymentSuccess = result.data.invoice_status == 'PAID';
                    this.DetailPayment = result.data.payment;
                    !this.IsPaymentSuccess && this.getPaymentMethod(token, this.IsPaymentGenerated);
                }
            })
    }

    private getPaymentMethod(token: string, setSelectedPaymentMethod: boolean) {
        this._paymentService
            .getAllPaymentMethod(token)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.PaymentMethodDatasource = result.data;

                    if (setSelectedPaymentMethod) {
                        const index = this.PaymentMethodDatasource.findIndex(item => item.payment_method_code == this.DetailPayment.payment_method);
                        this.SelectedPaymentMethod = this.PaymentMethodDatasource[index];
                    }
                }
            })
    }

    changePaymentMethod() {
        const token = this._activatedRoute.snapshot.queryParams['token'];

        this._paymentService
            .changePaymentMethod(token)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.getDetailInvoice(token);
                }
            })
    }

    createPayment(data: any) {
        this.SelectedPaymentMethod = data;

        const payload = {
            payment_token: this._activatedRoute.snapshot.queryParams['token'],
            payment_method_type: data.payment_method_type,
            payment_method_code: data.payment_method_code,
            payment_amount: this.InvoiceDatasource.total,
        };

        this._paymentService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    const token = this._activatedRoute.snapshot.queryParams['token'];

                    if (token) {
                        this.getDetailInvoice(token);
                    }
                } else {

                }
            })
    }

    private listenSocket() {
        const token = this._activatedRoute.snapshot.queryParams['token'];

        this._socket
            .fromEvent('get_payment_status_now')
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                console.log("socket body =>", result);

                if (result.token == token) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', detail: 'Payment Success', summary: 'You have completed the payment, thank you!' });
                    this.getDetailInvoice(token);
                }
            })
    }

    copyToClipboard(value: string) {
        navigator.clipboard.writeText(value).then(() => {
            console.log('Copied to clipboard:', value);
            this._messageService.add({ severity: 'success', summary: 'Copied!', detail: 'Copied to clipboard' })
        }).catch(err => {
            console.error('Failed to copy!', err);
        });
    }

    handleBackToHome() {
        window.location.href = "https://linkbit.net.id/";
    }
}
