import { CommonModule, formatCurrency } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { PanelFilterComponent } from 'src/app/components/filter/panel-filter/panel-filter.component';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { PanelFilterModel } from 'src/app/model/components/filter.model';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { ProductService } from 'src/app/services/setup-data/product.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-invoice',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        GridComponent,
        InputTextModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
        PanelFilterComponent,
    ],
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FromPelanggan = false;

    QueryParams: any = null;

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

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add',
            icon: 'pi pi-plus'
        },
        {
            id: 'retrigger_job_invoice',
            title: 'Rerun Job Invoice',
            icon: 'pi pi-play-circle'
        },
        {
            id: 'retrigger_job_message',
            title: 'Rerun Job Message',
            icon: 'pi pi-whatsapp'
        },
    ];

    @ViewChild('GridComps') GridComps!: GridComponent;
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

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FilterPelanggan$ = new Subject();

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _invoiceService: InvoiceService,
        private _paymentService: PaymentService,
        private _productService: ProductService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _settingCompanyService: SettingCompanyService,
        private _authenticationService: AuthenticationService,
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
                        optionValue: 'id_pelanggan',
                        customField: {
                            title: 'full_name',
                            subtitle: 'pelanggan_code',
                            description: 'alamat'
                        },
                    },
                    value: '',
                    onFilter: (args: any) => {
                        this.FilterPelanggan$.next(args);
                    },
                    onChange: (args: any) => {
                        if (args) {
                            if (!args.product_id) {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'warning', summary: 'Oops', detail: 'Pelanggan Ini Belum Berlanggan Produk Apapun' });
                            } else {
                                this.FormComps.FormGroup.get('id_pelanggan_product')?.setValue(args.id_pelanggan_product);
                                this.FormComps.FormGroup.get('id_product')?.setValue(args.product_id);
                                this.FormComps.FormGroup.get('product_name')?.setValue(args.product_name);
                                this.FormComps.FormGroup.get('price')?.setValue(args.product_price);
                                this.countSubtotalForm();
                            }
                        } else {
                            this.FormComps.FormGroup.get('id_product')?.setValue(null);
                            this.FormComps.FormGroup.get('product_name')?.setValue(null);
                            this.FormComps.FormGroup.get('price')?.setValue(0);
                            this.FormComps.FormGroup.get('diskon_percentage')?.setValue(0);
                            this.FormComps.FormGroup.get('diskon_rupiah')?.setValue(0);
                            this.FormComps.FormGroup.get('pajak')?.setValue(0);
                            this.FormComps.FormGroup.get('admin_fee')?.setValue(0);
                            this.FormComps.FormGroup.get('total')?.setValue(0);
                            this.countSubtotalForm();
                        }
                    }
                },
                {
                    id: 'invoice_date',
                    label: 'Tagihan Bulan',
                    required: true,
                    type: 'monthpicker',
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getTanggalJatuhTempo(args);
                        } else {
                            this.FormComps.FormGroup.get('due_date')?.setValue("");
                        }
                    }
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
                    label: 'Notes',
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
                    onChange: (args: any) => {
                        if (args) {
                            const price = this.FormComps.FormGroup.get('price')?.value;
                            this.FormComps.FormGroup.get('diskon_rupiah')?.setValue(price * (args / 100));
                            this.countSubtotalForm();
                        }
                    }
                },
                {
                    id: 'diskon_rupiah',
                    label: 'Diskon (Rp. )',
                    required: false,
                    type: 'number',
                    value: 0,
                    onChange: (args: any) => {
                        if (args) {
                            const price = this.FormComps.FormGroup.get('price')?.value;
                            this.FormComps.FormGroup.get('diskon_percentage')?.setValue(((args / price) * 100).toFixed(2));
                            this.countSubtotalForm();
                        }
                    }
                },
                {
                    id: 'pajak',
                    label: 'Pajak',
                    required: false,
                    type: 'number',
                    value: 0,
                    onChange: (args: any) => {
                        if (args) {
                            this.countSubtotalForm();
                        }
                    }
                },
                {
                    id: 'admin_fee',
                    label: 'Biaya Admin',
                    required: false,
                    type: 'number',
                    value: 0,
                    onChange: (args: any) => {
                        if (args) {
                            this.countSubtotalForm();
                        }
                    }
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
            class: 'grid-rows-6 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FilterPelanggan$
            .pipe(
                takeUntil(this.Destroy$),
                map((result: any) => result.filter),
                debounceTime(500),
                distinctUntilChanged()
            ).subscribe((result) => {
                if (result.length) {
                    this.getAllPelanggan({ full_name: result }, true);
                }
            })
    }

    ngOnInit(): void {
        this.getAll({ invoice_date: new Date() });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.checkQueryParams();

            setTimeout(() => {
                this.getAllProduct();
                // this.getAllPelanggan();
                this.getSettingCompany();
            }, 1000);
        }, 100);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private checkQueryParams() {
        const queryParams = this._activatedRoute.snapshot.queryParams;
        if (Object.keys(queryParams).length) {
            this.FromPelanggan = true;
            this.QueryParams = queryParams;

            if (queryParams['state'] == 'add') {
                this.PageState = 'form';
                this.ButtonNavigation = [];
            }

            if (queryParams['state'] == 'edit') {
                this._invoiceService
                    .getById(queryParams['id_invoice'])
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this.onRowDoubleClicked(result.data);
                        }
                    })
            }
        } else {
            this.FromPelanggan = false;
        }
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
        this.GridComps.onExportExcel();
    }

    private resetQueryParams(obj: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
    }

    private getAll(query?: any) {
        setTimeout(() => {
            console.log("query get all =>", query);
        }, 1000);

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

    private getAllPelanggan(query?: any, refresh_state?: boolean) {
        this._pelangganService
            .getAll(query, refresh_state)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_pelanggan')
                    this.FormProps.fields[index].dropdownProps.options = result.data;

                    this._activatedRoute
                        .queryParams
                        .pipe(takeUntil(this.Destroy$))
                        .subscribe((result) => {
                            if (result && result['state'] == 'add') {
                                this.FormComps.FormGroup.get('id_pelanggan')?.setValue(parseInt(result['id_pelanggan']));
                            };
                        });
                }
            });
    }

    private getSettingCompany() {
        const userData = this._authenticationService.getUserData();

        this._settingCompanyService
            .getById(userData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.SettingCompany = result.data;
                }
            });
    }

    private getTanggalJatuhTempo(invoice_date: Date) {
        const queryDate = new Date(invoice_date);
        const day = this.SettingCompany.tagihan_jatuh_tempo;
        const year = queryDate.getFullYear();
        const month = queryDate.getMonth();

        // Handling December case properly
        const dueDate = new Date(year, month, day, 0, 0, 0);

        this.FormComps.FormGroup.get('due_date')?.setValue(
            this._utilityService.onFormatDate(dueDate, 'yyyy-MM-DD HH:mm:ss')
        );

        this.FormComps.FormGroup.get('notes')?.setValue(
            `${this.FormComps.FormGroup.get('product_name')?.value} - ${this._utilityService.onFormatDate(dueDate, 'yyyy-MM-DD')}`
        );
    }

    private countSubtotalForm() {
        let price = this.FormComps.FormGroup.get('price')?.value,
            diskon_rupiah = this.FormComps.FormGroup.get('diskon_rupiah')?.value,
            pajak = this.FormComps.FormGroup.get('pajak')?.value,
            admin_fee = this.FormComps.FormGroup.get('admin_fee')?.value;

        let total = price - diskon_rupiah + pajak + admin_fee;
        this.FormComps.FormGroup.get('total')?.setValue(total);
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };

        if (data.id == 'retrigger_job_invoice') {
            this._invoiceService
                .retriggerJobInvoice()
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Job Generate Invoice Telah Berjalan' })
                    }
                })
        };

        if (data.id == 'retrigger_job_message') {
            this._invoiceService
                .retriggerJobSendMessage()
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Job Send Message Telah Berjalan' })
                    }
                })
        };
    }

    handleBackToList() {
        if (this.FromPelanggan) {
            this._router.navigateByUrl(`/pelanggan?id_pelanggan=${this.QueryParams.id_pelanggan || this.FormComps.FormGroup.get('id_pelanggan')?.value}`);
        } else {
            this.FormComps.onResetForm();

            setTimeout(() => {
                this.PageState = 'list';
                this.FormState = 'insert';
                this.ButtonNavigation = [
                    {
                        id: 'add',
                        title: 'Add',
                        icon: 'pi pi-plus'
                    },
                    {
                        id: 'retrigger_job_invoice',
                        title: 'Rerun Job Invoice',
                        icon: 'pi pi-play-circle'
                    },
                    {
                        id: 'retrigger_job_message',
                        title: 'Rerun Job Message',
                        icon: 'pi pi-whatsapp'
                    },
                ];

                this.getAll(this.GridQueryParams);
            }, 100);
        }

    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        this.getAllPelanggan({ full_name: args.full_name }, true);
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            args.invoice_date = new Date(args.invoice_date);
            this.getTanggalJatuhTempo(args.invoice_date);
            this.FormComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Deleted data can not be reverted',
                header: 'Are you sure?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Yes, sure',
                rejectIcon: "none",
                rejectLabel: 'No, back',
                accept: () => {
                    this.deleteData(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }

        if (args.type == 'kirim pesan tagihan') {
            this._invoiceService
                .sendMessage(args.data.id_invoice)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Pesan Whatsapp Berhasil Dikirim' })
                    }
                })
        };

        if (args.type == 'kirim pesan lunas') {
            if (args.data.id_payment) {
                this._paymentService
                    .sendMessage(args.data.id_payment)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Pesan Whatsapp Berhasil Dikirim' })
                        }
                    })
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Tagihan Belum Dibayarkan' })
            }
        };
    }

    saveData(data: any) {
        delete data.id_invoice;
        delete data.product_name;
        data.invoice_date = new Date(this._utilityService.onFormatDate(new Date(data.invoice_date), 'yyyy-MM-DD')).toISOString();
        data.due_date = new Date(this._utilityService.onFormatDate(new Date(data.due_date), 'yyyy-MM-DD')).toISOString();
        data.diskon_percentage = parseFloat(data.diskon_percentage);

        this._invoiceService
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
        data.invoice_date = new Date(this._utilityService.onFormatDate(new Date(data.invoice_date), 'yyyy-MM-DD')).toISOString();
        data.due_date = new Date(this._utilityService.onFormatDate(new Date(data.due_date), 'yyyy-MM-DD')).toISOString();
        data.diskon_percentage = parseFloat(data.diskon_percentage);

        this._invoiceService
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

    private deleteData(data: any) {
        this._invoiceService
            .delete(data.id_invoice)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getAll(this.GridQueryParams);
                }
            })
    }

}
