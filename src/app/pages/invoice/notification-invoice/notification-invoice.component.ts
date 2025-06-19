import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { PanelFilterComponent } from 'src/app/components/filter/panel-filter/panel-filter.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { PanelFilterModel } from 'src/app/model/components/filter.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { ProductService } from 'src/app/services/setup-data/product.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-notification-invoice',
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        InputTextModule,
        DashboardComponent,
        PanelFilterComponent,
    ],
    templateUrl: './notification-invoice.component.html',
    styleUrl: './notification-invoice.component.scss'
})
export class NotificationInvoiceComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    First = 0;

    AdvancedFilterProps: PanelFilterModel.FilterDatasource[] = [
        {
            id: 'invoice_number',
            label: 'No. Tagihan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: ''
        },
        {
            id: 'invoice_date',
            label: 'Periode',
            type: PanelFilterModel.TypeFilter.MONTHPICKER,
            value: '',
            date_format: 'MM yy'
        },
        {
            id: 'pelanggan_code',
            label: 'Kode Pelanggan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: '',
        },
        {
            id: 'full_name',
            label: 'Nama Pelanggan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: '',
        },
        {
            id: 'product_name',
            label: 'Product',
            type: PanelFilterModel.TypeFilter.SELECT,
            value: '',
            select_props: {
                options: [],
                optionName: 'product_name',
                optionValue: 'product_name'
            }
        },
        {
            id: 'invoice_status',
            label: 'Status',
            type: PanelFilterModel.TypeFilter.SELECT,
            value: '',
            select_props: {
                options: [
                    { name: 'PENDING', value: 'PENDING' },
                    { name: 'PAID', value: 'PAID' },
                    { name: 'CANCEL', value: 'CANCEL' },
                ],
                optionName: 'name',
                optionValue: 'value'
            }
        },
    ];

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Back',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'reset',
            title: 'Reset Selection',
            icon: 'pi pi-refresh'
        },
        {
            id: 'send',
            title: 'Send Message Batch',
            icon: 'pi pi-whatsapp'
        },
    ];

    @ViewChild('GridComps') GridComps!: Table;
    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500 text-xs', width: '200px' },
            { field: 'invoice_date', headerName: 'Periode', class: 'text-xs', width: '150px' },
            { field: 'pelanggan_code', headerName: 'Kode Pelanggan', class: 'text-xs', width: '200px' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs', width: '300px' },
            { field: 'product_name', headerName: 'Produk', class: 'text-xs', width: '250px' },
            { field: 'total', headerName: 'Subtotal', format: 'currency', class: 'text-end text-xs', width: '150px' },
            { field: 'invoice_status', headerName: 'Status', class: 'text-center text-xs', width: '100px' },
            { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-xs', width: '150px' },
            { field: 'payment_date', headerName: 'Tgl. Bayar', class: 'text-xs', format: 'datetime', width: '200px' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail', 'Kirim Pesan Tagihan', 'Kirim Pesan Lunas'],
        showPaging: true,
        showSearch: false,
        showSort: true,
        defaultRows: 50,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'invoice_date',
                placeholder: 'Cari Periode Tagihan Disini',
                type: 'monthpicker',
            },
            {
                id: 'id_pelanggan',
                placeholder: 'Cari Pelanggan Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'full_name',
                    optionValue: 'id_pelanggan',
                    customField: {
                        title: 'full_name',
                        subtitle: 'pelanggan_code',
                        description: 'alamat'
                    }
                }
            },
            {
                id: 'invoice_number',
                placeholder: 'Cari No. Tagihan Disini',
                type: 'text'
            },
        ],
    };
    GridSelectedData: any;
    GridQueryParams: any;

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _invoiceService: InvoiceService,
        private _productService: ProductService,
    ) { }

    ngOnInit(): void {
        this.getAll({ invoice_date: new Date() });
        this.getAllProduct();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query?: any) {
        this.GridQueryParams = query;

        this._invoiceService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'MMMM yyyy')
                        }
                    });
                }
            });
    }

    private getAllProduct() {
        this._productService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.AdvancedFilterProps.findIndex(item => item.id == 'product_name')
                    this.AdvancedFilterProps[index].select_props!.options = result.data;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/tagihan");
        };

        if (data.id == 'reset') {
            this.GridSelectedData = [];
        };

        if (data.id == 'send') {
            if (this.GridSelectedData.length) {
                const payload = {
                    data: this.GridSelectedData.map((item: any) => {
                        return {
                            id_invoice: item.id_invoice
                        }
                    })
                };

                this._invoiceService
                    .sendMessageBatch(payload)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Pesan Berhasil Terkirim' });
                        }
                    })

            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Tidak ada data yang dipilih' });
            }
        };
    }

    private resetQueryParams(obj: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
    }

    handleFilterGridInvoice(args: any) {
        this.GridQueryParams = this.resetQueryParams(args);
        this.getAll(this.GridQueryParams);
    }

    handleSearchGridInvoice(search: string) {
        let query = {
            ...this.GridQueryParams
        };

        if (search) {
            query.search = search;
            this.GridQueryParams = query;
        } else {
            delete this.GridQueryParams.search;
        }

        this.getAll(this.GridQueryParams);
    }

    handleExportGridInvoice() {
    }

}
