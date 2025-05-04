import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LoggingService } from 'src/app/services/management-user/logging.service';

@Component({
    selector: 'app-log-message-invoice',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
    ],
    templateUrl: './log-message-invoice.component.html',
    styleUrl: './log-message-invoice.component.scss'
})
export class LogMessageInvoiceComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'no_ref', headerName: 'No. Invoice', },
            { field: 'full_name', headerName: 'Pelanggan', },
            { field: 'alamat', headerName: 'Alamat', },
            { field: 'product_name', headerName: 'Produk', },
            { field: 'price', headerName: 'Total', format: 'currency' },
            { field: 'additional_info', headerName: 'Additional Info', format: 'html' },
            { field: 'sent_at', headerName: 'Waktu Kirim', format: 'date' },
            { field: 'resent_at', headerName: 'Waktu Kirim Ulang', format: 'date' },
            { field: 'status', headerName: 'Status' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Kirim Ulang'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'full_name',
        searchPlaceholder: 'Find Nama User Here',
    };
    GridSelectedData: any;

    constructor(
        private _loggingService: LoggingService,
    ) { }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._loggingService
            .getLogActivity()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'kirim ulang') {
            this._loggingService
                .resentMessage(args.data.id_invoice)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                    }
                });
        }
    }
}
