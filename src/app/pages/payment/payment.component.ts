import { CommonModule, formatCurrency } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
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
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FromPelanggan = false;

    QueryParams: any;

    UserData = this._authenticationService.getUserData();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add Payment Cash',
            icon: 'pi pi-plus'
        },
    ];

    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500 text-xs' },
            { field: 'invoice_date', headerName: 'Periode', class: 'text-xs' },
            { field: 'pelanggan_code', headerName: 'Kode Plgn', class: 'text-xs' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs' },
            { field: 'alamat', headerName: 'Alamat', class: 'text-xs' },
            { field: 'product_name', headerName: 'Produk', class: 'text-xs' },
            { field: 'payment_date', headerName: 'Tgl. Bayar', format: 'date', class: 'text-xs' },
            { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-xs' },
            { field: 'payment_amount', headerName: 'Total Bayar', format: 'currency', class: 'text-start text-xs' },
            { field: 'payment_status', headerName: 'Status', class: 'text-center text-xs' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Print', 'Detail', 'Edit', 'Cancel'],
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
    GridQueryParams: any;

    FormState: 'insert' | 'update' | 'detail' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FormDetailProps: FormModel.IForm;
    @ViewChild('FormDetailComps') FormDetailComps!: DynamicFormComponent;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _paymentService: PaymentService,
        private _utilityService: UtilityService,
        private _invoiceService: InvoiceService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
        private _settingCompanyService: SettingCompanyService,
    ) {
        this.FormProps = {
            id: 'form_tagihan',
            fields: [
                {
                    id: 'id_pelanggan',
                    label: 'Pilih Pelanggan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'full_name',
                        optionValue: 'id_pelanggan',
                        customField: {
                            title: 'full_name',
                            subtitle: 'pelanggan_code',
                            description: 'alamat'
                        }
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this.getAllInvoice(args.id_pelanggan);
                        }
                    }
                },
                {
                    id: 'id_invoice',
                    label: 'Pilih Invoice',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'invoice_number',
                        optionValue: 'id_invoice',
                        customField: {
                            title: 'invoice_number',
                            subtitle: 'product_name',
                            description: 'notes'
                        }
                    },
                    onChange: (args: any) => {
                        if (args) {
                            const payload = {
                                invoice_date: this._utilityService.onFormatDate(new Date(args.invoice_date), 'MMM yyyy'),
                                due_date: this._utilityService.onFormatDate(new Date(args.due_date), 'DD-MM-yyyy'),
                                product_name: args.product_name,
                                total: formatCurrency(args.total, 'EN', 'Rp. '),
                                payment_date: new Date(),
                                payment_amount: args.total,
                            };
                            this.FormComps.FormGroup.patchValue(payload);
                        }
                    }
                },
                {
                    id: 'invoice_date',
                    label: 'Tagihan Bulan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
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
                    id: 'total',
                    label: 'Sub Total',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'payment_date',
                    label: 'Tgl. Pembayaran',
                    required: true,
                    type: 'date',
                    value: "",
                },
                {
                    id: 'payment_amount',
                    label: 'Jumlah Pembayaran',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'id_payment_method_manual',
                    label: 'Payment Method',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'payment_method',
                        optionValue: 'id_payment_method_manual'
                    }
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormDetailProps = {
            id: 'form_tagihan_edit',
            fields: [
                {
                    id: 'full_name',
                    label: 'Nama Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'invoice_number',
                    label: 'No. Invoice',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'invoice_date',
                    label: 'Tagihan Bulan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
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
                    id: 'total',
                    label: 'Sub Total',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'payment_date',
                    label: 'Tgl. Pembayaran',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'payment_amount',
                    label: 'Jumlah Pembayaran',
                    required: true,
                    type: 'number',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'id_payment_method_manual',
                    label: 'Payment Method',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'payment_method',
                        optionValue: 'id_payment_method_manual'
                    }
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        if (this.UserData.company_type == 'MITRA') {
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Add Payment',
                    icon: 'pi pi-plus'
                },
            ]
        } else {
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Add Payment Cash',
                    icon: 'pi pi-plus'
                },
            ]
        }

        this.getAll({ invoice_date: new Date() });
        this.getAllPelanggan();
        this.getAllPaymentMethodManual();
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
        if (Object.keys(queryParams).length) {
            this.FromPelanggan = true;
            this.QueryParams = queryParams;

            if (queryParams['state'] == 'cash') {
                this.PageState = 'form';
                this.ButtonNavigation = [];

                this.getAllInvoice(this.QueryParams.id_pelanggan, true, this.QueryParams.id_invoice);
            }
        } else {
            this.FromPelanggan = false;
        }
    }

    private getAll(query?: any) {
        this.GridQueryParams = query;

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

    private getAllPelanggan(query?: any) {
        this._pelangganService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_pelanggan');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    private getAllInvoice(id_pelanggan: string, is_set?: boolean, id_invoice?: number) {
        this._invoiceService
            .getAll({ id_pelanggan: id_pelanggan })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_invoice');
                    this.FormProps.fields[index].dropdownProps.options = result.data;

                    if (is_set) {
                        setTimeout(() => {
                            this.FormComps.FormGroup.get('id_pelanggan')?.setValue(parseInt(id_pelanggan));
                            this.FormComps.FormGroup.get('id_invoice')?.setValue(parseInt(id_invoice as any));

                            const invoice = result.data.find(item => item.id_invoice == parseInt(id_invoice as any));
                            const payload = {
                                invoice_date: this._utilityService.onFormatDate(new Date(invoice!.invoice_date), 'MMM yyyy'),
                                due_date: this._utilityService.onFormatDate(new Date(invoice!.due_date), 'DD-MM-yyyy'),
                                product_name: invoice!.product_name,
                                total: formatCurrency(invoice!.total, 'EN', 'Rp. '),
                                payment_date: new Date(),
                                payment_amount: invoice!.total,
                            };
                            this.FormComps.FormGroup.patchValue(payload);
                        }, 1000);
                    }
                }
            });
    }

    private getAllPaymentMethodManual() {
        const userData = this._authenticationService.getUserData();

        this._settingCompanyService
            .getAllPaymentMethodManual(userData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_payment_method_manual');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            })
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
        if (this.FromPelanggan) {
            this._router.navigateByUrl(`/pelanggan?id_pelanggan=${this.QueryParams.id_pelanggan || this.FormComps.FormGroup.get('id_pelanggan')?.value}`);
        } else {
            this.FormState == 'detail' ? this.FormDetailComps.onResetForm() : this.FormComps.onResetForm();

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

                this.getAll(this.GridQueryParams);
            }, 100);
        }
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'detail';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            args.due_date = args.due_date ? this._utilityService.onFormatDate(new Date(args.due_date), 'DD MMMM yyyy') : 'Invoice Telah Dibatalkan';
            args.payment_date = this._utilityService.onFormatDate(new Date(args.invoice_date), 'MMMM yyyy');
            args.invoice_date = this._utilityService.onFormatDate(new Date(args.invoice_date), 'MMMM yyyy');
            this.FormDetailComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }

        if (args.type == 'edit') {
            if (args.data.payment_status == 'PENDING' || args.data.payment_status == 'ACTIVE') {
                this.onRowDoubleClicked(args.data);
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Aksi ini hanya untuk PENDING payment' });
            }
        }

        if (args.type == 'print') {
            if (args.data.payment_status == 'PAID') {
                this._router.navigateByUrl(`/print-out/pos?id_payment=${args.data.id_payment}`)
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Aksi ini hanya untuk PAID payment' });
            }
        }

        if (args.type == 'cancel') {
            if (args.data.payment_status == 'PENDING' || args.data.payment_status == 'ACTIVE') {
                this._confirmationService.confirm({
                    target: (<any>event).target as EventTarget,
                    message: 'Canceled data can not be reverted',
                    header: 'Are you sure?',
                    icon: 'pi pi-info-circle',
                    acceptButtonStyleClass: "p-button-danger p-button-sm",
                    rejectButtonStyleClass: "p-button-secondary p-button-sm",
                    acceptIcon: "none",
                    acceptLabel: 'Yes, sure',
                    rejectIcon: "none",
                    rejectLabel: 'No, back',
                    accept: () => {
                        this.cancelData(args.data.id_payment);
                    }
                });
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Aksi ini hanya untuk PENDING payment' });
            }
        }
    }

    saveData(data: any) {
        this._paymentService
            .createPaymentCash({
                id_invoice: data.id_invoice,
                payment_date: data.payment_date,
                payment_amount: data.payment_amount,
                id_payment_method_manual: data.id_payment_method_manual
            })
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

    private cancelData(id_payment: any) {
        this._paymentService
            .cancel(id_payment)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data canceled succesfully' });
                    this.getAll(this.GridQueryParams);
                }
            })
    }
}
