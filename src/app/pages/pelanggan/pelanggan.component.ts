import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { GroupPelangganService } from 'src/app/services/setup-data/group-pelanggan.service';
import { ProductService } from 'src/app/services/setup-data/product.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { environment } from 'src/environments/environment';

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
        DialogModule
    ],
    templateUrl: './pelanggan.component.html',
    styleUrl: './pelanggan.component.scss'
})
export class PelangganComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    UserData = this._authenticationService.getUserData();

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
            { field: 'pelanggan_code', headerName: 'Kode Pelanggan', class: 'text-sky-500 font-semibold' },
            { field: 'full_name', headerName: 'Nama Pelanggan', },
            { field: 'product_name', headerName: 'Layanan', },
            { field: 'whatsapp', headerName: 'No. Whatsapp', },
            { field: 'alamat', headerName: 'Alamat', },
            { field: 'is_active', headerName: 'Is Active', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Layanan', 'Detail'],
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

    FormProductPelangganProps: FormModel.IForm;
    @ViewChild('FormProductPelangganComps') FormProductPelangganComps!: DynamicFormComponent;

    ShowDialogProduct = false;

    constructor(
        private _productService: ProductService,
        private _messageService: MessageService,
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
                    required: true,
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
                },
                {
                    id: 'subscribe_start_date',
                    label: 'Tgl. Pemasangan',
                    required: true,
                    type: 'date',
                    value: '',
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
            class: 'grid-rows-11 grid-cols-1',
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

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query?: any) {
        if (this.UserData.company_type != 'KANTOR PUSAT') {
            query.id_setting_company = this.UserData.id_setting_company;
        };

        this._pelangganService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
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
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];

            setTimeout(() => {
                if (this.UserData) this.FormComps.FormGroup.get('id_setting_company')?.setValue(this.UserData.id_setting_company);
            }, 500);
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
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            setTimeout(() => {
                this.FormComps.FormGroup.patchValue(args);
            }, 500);
        }, 100);
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

        if (args.type == 'layanan') {
            this.ShowDialogProduct = true;

            setTimeout(() => {
                this.FormProductPelangganComps.FormGroup.patchValue({
                    id_pelanggan: args.data.id_pelanggan,
                    id_product: args.data.product_id,
                    start_date: new Date(args.data.product_start_date),
                    price: args.data.product_price,
                    days_before_send_invoice: args.data.product_days_before_send_invoice,
                    invoice_cycle: args.data.product_invoice_cycle,
                });
            }, 1000);
        }
    }

    saveData(data: any) {
        delete data.id_role;

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

    private deleteData(data: any) {
        this._pelangganService
            .delete(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getAll();
                }
            })
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
                    this.getAll();
                }
            })
    }

}
