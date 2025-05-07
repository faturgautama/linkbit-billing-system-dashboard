import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
    selector: 'app-invoice-digital',
    standalone: true,
    imports: [],
    templateUrl: './invoice-digital.component.html',
    styleUrl: './invoice-digital.component.scss'
})
export class InvoiceDigitalComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    InvoiceDigital: string = "<p>Sedang memuat invoice digital...</p>";

    constructor(
        private _socket: Socket,
        private _sanitizer: DomSanitizer,
        private _activatedRoute: ActivatedRoute,
        private _invoiceService: InvoiceService,
        private _messageService: MessageService,
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
        this._invoiceService
            .getInvoiceDigital(token)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.InvoiceDigital = result.data;
                }
            })
    }
}
