import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-invoice-digital',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
    ],
    templateUrl: './invoice-digital.component.html',
    styleUrl: './invoice-digital.component.scss'
})
export class InvoiceDigitalComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    InvoiceDigital: any;

    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'payment_date', headerName: 'Tanggal', class: 'text-sm', format: 'date' },
            { field: 'payment_amount', headerName: 'Jumlah', format: 'currency', class: 'text-sm', },
            { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-sm', },
            { field: 'notes', headerName: 'Layanan', class: 'text-sm', },
            { field: 'user_entry', headerName: 'Diterima Oleh', class: 'text-sm', },
        ],
        dataSource: [],
        height: "auto",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: false,
        customSearchProps: [],
    };

    constructor(
        private _socket: Socket,
        private _sanitizer: DomSanitizer,
        private _activatedRoute: ActivatedRoute,
        private _invoiceService: InvoiceService,
        private _paymentService: PaymentService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        const token = this._activatedRoute.snapshot.queryParams['token'];

        if (token) {
            this.getDetailInvoice(token);
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
                    this.InvoiceDigital = {
                        invoice_number: result.data.invoice_number,
                        create_at: this._utilityService.onFormatDate(new Date(result.data.create_at), 'DD MMM yyyy HH:mm'),
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

                    this.GridProps.dataSource = result.data.payment ? [
                        {
                            payment_date: result.data.payment.payment_date,
                            payment_amount: result.data.payment.payment_amount,
                            payment_method: result.data.payment.payment_method,
                            notes: result.data.payment.invoice.notes,
                            user_entry: result.data.payment.user_entry,
                        }
                    ] : []
                }
            })
    }
}
