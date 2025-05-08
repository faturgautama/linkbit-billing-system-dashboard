import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { GroupPelangganService } from 'src/app/services/setup-data/group-pelanggan.service';
import { ProductService } from 'src/app/services/setup-data/product.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { SettingPelangganProductComponent } from './setting-pelanggan-product/setting-pelanggan-product.component';

@Component({
    selector: 'app-pelanggan',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        TabMenuModule,
        SettingPelangganProductComponent,
    ],
    templateUrl: './pelanggan.component.html',
    styleUrl: './pelanggan.component.scss'
})
export class PelangganComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' | 'set_paket' = 'list';

    ActiveTab: 'active' | 'inactive' = 'active';

    UserData = this._authenticationService.getUserData();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add',
            icon: 'pi pi-plus'
        },
        {
            id: 'unduh',
            title: 'Unduh Contoh Format Import',
            icon: 'pi pi-download'
        },
        {
            id: 'import',
            title: 'Import',
            icon: 'pi pi-file-import'
        },
        {
            id: 'set_paket',
            title: 'Set Paket Pelanggan',
            icon: 'pi pi-cog'
        },
    ];

    @ViewChild('GridHistoryTagihanComps') GridHistoryTagihanComps!: GridComponent;
    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'pelanggan_code', headerName: 'Kode Pelanggan', class: 'text-sky-500 font-semibold' },
            { field: 'full_name', headerName: 'Nama Pelanggan', },
            { field: 'product_name', headerName: 'Layanan', },
            { field: 'whatsapp', headerName: 'No. Whatsapp', },
            { field: 'alamat', headerName: 'Alamat', width: '25%' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Change Status', 'Detail', 'Produk Layanan'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: true,
        customSearchProps: [],
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    GridHistoryTagihanProps: GridModel.IGrid = {
        id: 'GridHistoryTagihan',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500' },
            { field: 'invoice_date', headerName: 'Tagihan Bulan', },
            { field: 'product_name', headerName: 'Produk', },
            { field: 'total', headerName: 'Subtotal', format: 'currency', class: 'text-end' },
            { field: 'invoice_status', headerName: 'Status', class: 'text-center' },
            { field: 'payment_date', headerName: 'Tgl. Bayar', format: 'date' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Print', 'Detail', 'Delete', 'Kirim Pesan Tagihan', 'Kirim Pesan Lunas', 'Add Pembayaran Cash'],
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
    };

    FormProductPelangganProps: FormModel.IForm;
    @ViewChild('FormProductPelangganComps') FormProductPelangganComps!: DynamicFormComponent;

    ShowDialogProduct = false;

    ShowDialogImport = false;

    @ViewChild('SettingPaketComps') SettingPaketComps!: SettingPelangganProductComponent;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _productService: ProductService,
        private _messageService: MessageService,
        private _invoiceService: InvoiceService,
        private _utilityService: UtilityService,
        private _paymentService: PaymentService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
        private _groupPelangganService: GroupPelangganService,
        private _settingCompanyService: SettingCompanyService,
    ) {
        this.FormProps = {
            id: 'form_setup_pelanggan',
            fields: [
                {
                    id: 'id_pelanggan',
                    label: 'Id Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_setting_company',
                    label: 'Setting Company',
                    required: false,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'company_name',
                        optionValue: 'id_setting_company'
                    },
                    hidden: false
                },
                {
                    id: 'full_name',
                    label: 'Nama Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'pelanggan_code',
                    label: 'Kode Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'email',
                    label: 'Email',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_group_pelanggan',
                    label: 'Group Pelanggan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'group_pelanggan',
                        optionValue: 'id_group_pelanggan'
                    },
                },
                {
                    id: 'phone',
                    label: 'No. Handphone',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'whatsapp',
                    label: 'No. Whatsapp',
                    required: true,
                    type: 'text',
                    value: '',

                },
                {
                    id: 'identity_number',
                    label: 'No. Identitas',
                    required: false,
                    type: 'text',
                    value: '',
                    mask: '0000-0000-0000-0000',
                },
                {
                    id: 'subscribe_start_date',
                    label: 'Tgl. Pemasangan',
                    required: true,
                    type: 'date',
                    value: new Date(),
                },
                {
                    id: 'pic_name',
                    label: 'Nama PIC',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'notes',
                    label: 'Notes',
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

        this.FormProductPelangganProps = {
            id: 'form_setup_pelanggan_product',
            fields: [
                {
                    id: 'id_pelanggan',
                    label: 'Id Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'id_product',
                    label: 'Produk Layanan',
                    required: false,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'product_name',
                        optionValue: 'id_product'
                    },
                    onChange: (args) => {
                        if (args) {
                            this.FormProductPelangganComps.FormGroup.get('price')?.setValue(args.price);
                            this.FormProductPelangganComps.FormGroup.get('invoice_cycle')?.setValue(args.invoice_cycle);
                            this.FormProductPelangganComps.FormGroup.get('days_before_send_invoice')?.setValue(args.days_before_send_invoice);
                        }
                    }
                },
                {
                    id: 'start_date',
                    label: 'Tgl. Mulai Berlangganan',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'price',
                    label: 'Harga',
                    required: true,
                    type: 'number',
                    value: '',
                },

                {
                    id: 'invoice_cycle',
                    label: 'Siklus Tagihan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Setiap Bulan', value: 'MONTHLY' },
                            { name: '3 Bulan', value: '3 MONTH' },
                            { name: '6 Bulan', value: '6 MONTH' },
                            { name: 'Tahunan ', value: 'YEARLY' },
                        ],
                        optionName: 'name',
                        optionValue: 'value'
                    },
                    value: '',
                },
                {
                    id: 'days_before_send_invoice',
                    label: 'Penerbitan Invoice Setiap Tanggal',
                    required: true,
                    type: 'number',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllProduct();
        this.getAllGroupPelanggan();
        this.getAllSettingCompany();

        const index = this.FormProps.fields.findIndex(item => item.id == 'id_setting_company');

        if (this.UserData.company_type == 'KANTOR PUSAT') {
            this.FormProps.fields[index].hidden = false;
            this.GridProps.customSearchProps = [
                {
                    id: 'id_setting_company',
                    placeholder: 'Cari Setting Company Disini',
                    type: 'dropdown',
                    dropdownProps: {
                        options: [],
                        optionName: 'company_name',
                        optionValue: 'id_setting_company'
                    }
                },
                {
                    id: 'full_name',
                    placeholder: 'Cari Nama Pelanggan Disini',
                    type: 'text'
                },
                {
                    id: 'pelanggan_code',
                    placeholder: 'Cari Kode Pelanggan Disini',
                    type: 'text'
                },
            ];
        } else {
            this.FormProps.fields[index].hidden = true;
            this.GridProps.customSearchProps = [
                {
                    id: 'full_name',
                    placeholder: 'Cari Nama Pelanggan Disini',
                    type: 'text'
                },
                {
                    id: 'pelanggan_code',
                    placeholder: 'Cari Kode Pelanggan Disini',
                    type: 'text'
                },
            ];
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.checkQueryParams();
        }, 100);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private checkQueryParams() {
        const queryParams = this._activatedRoute.snapshot.queryParams;

        if (queryParams && queryParams['id_pelanggan']) {
            this._pelangganService
                .getById(queryParams['id_pelanggan'])
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this.GridSelectedData = result.data;
                        this.onRowDoubleClicked(result.data);
                    }
                })
        }
    }

    handleChangeTab(state: 'active' | 'inactive') {
        this.ActiveTab = state;
        this.getAll();
    }

    private getAll(query?: any) {
        query = {
            ...query,
            id_setting_company: this.UserData.id_setting_company
        }

        if (this.ActiveTab == 'active') {
            query = {
                ...query,
                is_active: true
            };

            this.GridProps.isCustomSearch = true;
            this.GridProps.showSearch = true;

            this._pelangganService
                .getAll(query, true)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                    }
                });
        } else {
            this.GridProps.isCustomSearch = false;
            this.GridProps.showSearch = false;

            this._pelangganService
                .getAllInactive(this.UserData.id_setting_company)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                    }
                });
        }
    }

    private getAllInvoice(query?: any) {
        this._invoiceService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridHistoryTagihanProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'MMMM yyyy')
                        }
                    });
                }
            });
    }

    private getAllGroupPelanggan() {
        this._groupPelangganService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_group_pelanggan');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    private getAllSettingCompany() {
        this._settingCompanyService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_setting_company');
                    this.FormProps.fields[index].dropdownProps.options = result.data;

                    if (this.UserData.company_type == 'KANTOR PUSAT') {
                        this.GridProps.customSearchProps![0]!.dropdownProps!.options = result.data;
                    }
                }
            });
    }

    private getAllProduct() {
        this._productService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProductPelangganProps.fields.findIndex(item => item.id == 'id_product');
                    this.FormProductPelangganProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'set_paket') {
            this.PageState = 'set_paket';
            this.ButtonNavigation = [
                {
                    id: 'back',
                    title: 'Kembali',
                    icon: 'pi pi-chevron-left'
                },
                {
                    id: 'save_set_paket',
                    title: 'Simpan',
                    icon: 'pi pi-save'
                },
            ];
        };

        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];

            setTimeout(() => {
                if (this.UserData) {
                    this.FormComps.FormGroup.get('id_setting_company')?.setValue(this.UserData.id_setting_company);
                }

                this.FormComps.FormGroup.get('subscribe_start_date')?.setValue(new Date());
            }, 500);
        };

        if (data.id == 'unduh') {
            this._pelangganService.getFileTemplate();
        };

        if (data.id == 'import') {
            this.ShowDialogImport = true;
        };

        if (data.id == 'back') {
            this.handleBackToList();
        };

        if (data.id == 'save_set_paket') {
            const payload = {
                pelanggan: this.SettingPaketComps.selectedItems.map(item => item.id_pelanggan),
                ...this.SettingPaketComps.FormComps.FormGroup.value
            };

            this._pelangganService
                .updateManyProductPelanggan(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Setting Paket Pelanggan Berhasil Disimpan' });
                        this.handleBackToList();
                    }
                })
        };
    }

    handleBackToList() {
        this._router.navigateByUrl("/pelanggan");

        if (this.PageState == 'form') {
            this.FormComps.onResetForm();
        }

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
                    id: 'unduh',
                    title: 'Unduh Contoh Format Import',
                    icon: 'pi pi-download'
                },
                {
                    id: 'import',
                    title: 'Import',
                    icon: 'pi pi-file-import'
                },
                {
                    id: 'set_paket',
                    title: 'Set Paket Pelanggan',
                    icon: 'pi pi-cog'
                },
            ];

            const queryParams = {
                id_setting_company: this.UserData.id_setting_company,
                is_active: this.ActiveTab == 'active' ? true : false
            }

            this.getAll(queryParams);
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
            args.phone = args.phone;
            args.whatsapp = args.whatsapp;
            args.subscribe_start_date = new Date(args.subscribe_start_date);
            this.FormComps.FormGroup.patchValue(args);
            this.getAllInvoice({ id_pelanggan: args.id_pelanggan });
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'change status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Pelanggan status will be changed',
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
            this.ButtonNavigation = [];
            this.onRowDoubleClicked(args.data);
        }

        if (args.type == 'produk layanan') {
            this.ShowDialogProduct = true;

            setTimeout(() => {
                this.FormProductPelangganComps.FormGroup.patchValue({
                    id_pelanggan: args.data.id_pelanggan,
                    id_product: args.data.product_id,
                    start_date: args.data.product_start_date ? new Date(args.data.product_start_date) : new Date(),
                    price: args.data.product_price,
                    days_before_send_invoice: args.data.product_days_before_send_invoice,
                    invoice_cycle: args.data.product_invoice_cycle,
                });
            }, 1000);
        }
    }

    saveData(data: any) {
        delete data.id_pelanggan;
        delete data.is_active;

        data.phone = data.phone ? this._utilityService.onFormatPhoneNumber(data.phone) : "";
        data.whatsapp = data.whatsapp ? this._utilityService.onFormatPhoneNumber(data.whatsapp) : "";

        this._pelangganService
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
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Data will be updated',
            header: 'Are you sure?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-warning p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Yes, sure',
            rejectIcon: "none",
            rejectLabel: 'No, back',
            accept: () => {
                data.phone = data.phone ? this._utilityService.onFormatPhoneNumber(data.phone) : "";
                data.whatsapp = data.whatsapp ? this._utilityService.onFormatPhoneNumber(data.whatsapp) : "";

                this._pelangganService
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
        });
    }

    private deleteData(data: any) {
        this._pelangganService
            .delete(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    const queryParams = {
                        id_setting_company: this.UserData.id_setting_company,
                        is_active: this.ActiveTab == 'active' ? true : false
                    }

                    this.getAll(queryParams);
                }
            })
    }

    handleExportHistoryTagihan() {
        this.GridHistoryTagihanComps.onExportExcel();
    }

    handleUpdateProductPelanggan(data: any) {
        this._pelangganService
            .updateProductPelanggan(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.ShowDialogProduct = false;
                    const queryParams = {
                        id_setting_company: this.UserData.id_setting_company,
                        is_active: this.ActiveTab == 'active' ? true : false
                    }

                    this.getAll(queryParams);
                }
            })
    }

    handleGoToAddInvoice(id_pelanggan: number) {
        this._router.navigateByUrl(`/tagihan?state=add&id_pelanggan=${id_pelanggan}`);
    }

    handleGoToAddPaymentCash(id_pelanggan: number) {
        this._router.navigateByUrl(`/tagihan?state=add&id_pelanggan=${id_pelanggan}`);
    }

    onToolbarClickedHistoryInvoice(args: any): void {
        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data will deleted and can not be reverted',
                header: 'Are you sure?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Yes, sure',
                rejectIcon: "none",
                rejectLabel: 'No, back',
                accept: () => {
                    this._invoiceService
                        .delete(args.data.id_invoice)
                        .pipe(takeUntil(this.Destroy$))
                        .subscribe((result) => {
                            if (result.status) {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                                this.getAllInvoice({ id_pelanggan: args.id_pelanggan });
                            }
                        })
                }
            });
        };

        if (args.type == 'detail') {
            this._router.navigateByUrl(`/tagihan?state=edit&id_invoice=${args.data.id_invoice}`);
        };

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

        if (args.type == 'add pembayaran cash') {
            this._router.navigateByUrl(`/pembayaran?state=cash&id_invoice=${args.data.id_invoice}&id_pelanggan=${args.data.id_pelanggan}`);
        };

        if (args.type == 'print') {
            if (args.data.payment_status == 'PAID') {
                this._router.navigateByUrl(`/print-out/pos?id_payment=${args.data.id_payment}&id_pelanggan=${args.data.id_pelanggan}`)
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Invoice ini belum lunas' });
            }
        }
    }

    importData() {
        const el = document.getElementById('fileInput') as any;

        const formData = new FormData();
        formData.append('file', el.files[0]);

        this._pelangganService
            .import(formData)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data imported succesfully' });
                    el.value = "";
                    this.ShowDialogImport = false;
                    this.getAll();
                }
            })
    }

}
