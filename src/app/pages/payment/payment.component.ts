import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500' },
            { field: 'invoice_date', headerName: 'Tagihan Bulan', },
            { field: 'pelanggan_code', headerName: 'Kode Pelanggan', },
            { field: 'full_name', headerName: 'Pelanggan', },
            { field: 'product_name', headerName: 'Produk', },
            { field: 'payment_date', headerName: 'Tgl. Bayar', format: 'date' },
            { field: 'payment_method', headerName: 'Metode Bayar', },
            { field: 'payment_amount', headerName: 'Total Bayar', format: 'currency', class: 'text-end' },
            { field: 'payment_status', headerName: 'Status', class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'invoice_date',
                placeholder: 'Cari Tgl. Tagihan Disini',
                type: 'monthpicker',
            },
            {
                id: 'invoice_number',
                placeholder: 'Cari No. Tagihan Disini',
                type: 'text'
            },
        ],
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _paymentService: PaymentService,
        private _utilityService: UtilityService,
    ) {
        this.FormProps = {
            id: 'form_tagihan',
            fields: [
                {
                    id: 'id_invoice',
                    label: 'Id Invoice',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_pelanggan_product',
                    label: 'Id Pelanggan Product',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_product',
                    label: 'Id Product',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'product_name',
                    label: 'Product Name',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_pelanggan',
                    label: 'Pelanggan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'full_name',
                        optionValue: 'id_pelanggan'
                    },
                    value: '',
                },
                {
                    id: 'invoice_date',
                    label: 'Tagihan Bulan',
                    required: true,
                    type: 'monthpicker',
                    value: '',
                },
                {
                    id: 'due_date',
                    label: 'Tgl. Jatuh Tempo',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'product_name',
                    label: 'Nama Layanan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'notes',
                    label: 'Tagihan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'price',
                    label: 'Harga',
                    required: true,
                    type: 'number',
                    value: '',
                    readonly: true
                },
                {
                    id: 'diskon_percentage',
                    label: 'Diskon (%)',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'diskon_rupiah',
                    label: 'Diskon (Rp. )',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'pajak',
                    label: 'Pajak',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'admin_fee',
                    label: 'Biaya Admin',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'total',
                    label: 'Subtotal',
                    required: false,
                    type: 'number',
                    value: 0,
                    readonly: true
                },
                {
                    id: 'unique_code',
                    label: 'Kode Unik',
                    required: false,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-12 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query?: any) {
        this._paymentService
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

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Add',
                    icon: 'pi pi-plus'
                }
            ];

            this.getAll();
        }, 100);
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            setTimeout(() => {
                args.invoice_date = new Date(args.invoice_date);
                this.FormComps.FormGroup.patchValue(args);
            }, 500);
        }, 100);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveData(data: any) {
        delete data.id_invoice;
        delete data.product_name;
        data.invoice_date = new Date(this._utilityService.onFormatDate(new Date(data.invoice_date), 'yyyy-MM-DD'));
        data.due_date = new Date(data.due_date).toISOString();
        data.diskon_percentage = parseFloat(data.diskon_percentage);

        this._paymentService
            .create(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                    this.handleBackToList();
                }
            })
    }

    updateData(data: any) {
        delete data.product_name;
        data.invoice_date = new Date(this._utilityService.onFormatDate(new Date(data.invoice_date), 'yyyy-MM-DD'));
        data.due_date = new Date(data.due_date).toISOString();
        data.diskon_percentage = parseFloat(data.diskon_percentage);

        this._paymentService
            .update(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.handleBackToList();
                }
            })
    }
}
