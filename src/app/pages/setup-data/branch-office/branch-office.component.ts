import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';

@Component({
    selector: 'app-branch-office',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './branch-office.component.html',
    styleUrl: './branch-office.component.scss'
})
export class BranchOfficeComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    IsFormCabang = true;

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
            { field: 'company_name', headerName: 'Nama Perusahaan', },
            { field: 'company_email', headerName: 'Email Perusahaan', },
            { field: 'company_address', headerName: 'Alamat Perusahaan', },
            { field: 'is_active', headerName: 'Is Active', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'company_name',
                placeholder: 'Cari Nama Perusahaan Disini',
                type: 'text'
            },
        ],
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'update';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FormTagihanProps: FormModel.IForm;
    @ViewChild('FormTagihanComps') FormTagihanComps!: DynamicFormComponent;

    FormPaymentGatewayProps: FormModel.IForm;
    @ViewChild('FormPaymentGatewayComps') FormPaymentGatewayComps!: DynamicFormComponent;

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _settingCompanyService: SettingCompanyService,
    ) {
        this.FormProps = {
            id: 'form_setting_company',
            fields: [
                {
                    id: 'id_setting_company',
                    label: 'Id Setting Company',
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
                    id: 'is_mitra',
                    label: 'Is Mitra',
                    required: true,
                    type: 'text',
                    value: false,
                    hidden: true
                },
                {
                    id: 'is_cabang',
                    label: 'Is Cabang',
                    required: true,
                    type: 'text',
                    value: true,
                    hidden: true
                },
                {
                    id: 'company_name',
                    label: 'Nama Usaha',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_email_admin',
                    label: 'Admin Email',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_short_name',
                    label: 'Nama Singkat Usaha',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_phone',
                    label: 'No. Telp Usaha',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_whatsapp',
                    label: 'No. WA Usaha',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_email',
                    label: 'Email Perusahaan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_bank_name',
                    label: 'Bank Rekening Perusahaan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_nomor_rekening',
                    label: 'No. Rekening Perusahaan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'company_address',
                    label: 'Alamat Usaha',
                    required: true,
                    type: 'text',
                    textareaRow: 4,
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormTagihanProps = {
            id: 'form_setting_tagihan',
            fields: [
                {
                    id: 'tagihan_ppn',
                    label: 'PPn (%)',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'tagihan_use_unik_kode',
                    label: 'Kode Unik',
                    required: true,
                    type: 'radio',
                    value: '',
                    radioButtonProps: [
                        { name: 'tagihan_use_unik_kode', label: 'Iya', value: true },
                        { name: 'tagihan_use_unik_kode', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'tagihan_pesan_invoice',
                    label: 'Pesan Whatsapp Tagihan',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'tagihan_pesan_lunas',
                    label: 'Pesan Whatsapp Lunas',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'tagihan_jatuh_tempo',
                    label: 'Tgl. Jatuh Tempo',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'tagihan_biaya_admin',
                    label: 'Biaya Admin',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'tagihan_editor_invoice',
                    label: 'Editor Tagihan Invoice',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'tagihan_editor_pos',
                    label: 'Format Print POS',
                    required: true,
                    type: 'editor',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormPaymentGatewayProps = {
            id: 'form_setting_payment_gateway',
            fields: [
                {
                    id: 'payment_gateway',
                    label: 'Payment Gateway',
                    required: true,
                    type: 'text',
                    value: 'XENDIT',
                    readonly: true
                },
                {
                    id: 'api_key_pg',
                    label: 'API Key Payment Gateway',
                    required: true,
                    type: 'text',
                    value: '',
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-2',
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
        this.IsFormCabang = this._router.url.includes('branch-office');

        this._settingCompanyService
            .getAll({ ...query, is_cabang: this.IsFormCabang, is_mitra: !this.IsFormCabang })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
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
            this.FormState = 'insert';
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
            this.FormComps.FormGroup.patchValue(args);
            this.FormTagihanComps.FormGroup.patchValue(args);
            this.FormPaymentGatewayComps.FormGroup.patchValue(args);
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
    }

    saveData(data: any) {
        let payload = {
            ...data,
            ...this.FormTagihanComps.FormGroup.value,
            ...this.FormPaymentGatewayComps.FormGroup.value,
        };

        payload.tagihan_use_unik_kode = payload.tagihan_use_unik_kode ? payload.tagihan_use_unik_kode : false;
        payload.is_cabang = this.IsFormCabang;
        payload.is_mitra = !this.IsFormCabang;

        delete payload.id_setting_company;
        delete payload.is_active;
        delete payload.payment_gateway;

        if (this.IsFormCabang) {
            this._settingCompanyService
                .createCabang(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                        this.handleBackToList();
                    }
                })
        } else {
            this._settingCompanyService
                .createMitra(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                        this.handleBackToList();
                    }
                })
        }
    }

    updateData(data: any) {
        let payload = {
            ...data,
            ...this.FormTagihanComps.FormGroup.value,
            ...this.FormPaymentGatewayComps.FormGroup.value,
        };

        payload.tagihan_use_unik_kode = payload.tagihan_use_unik_kode ? payload.tagihan_use_unik_kode : false;
        payload.is_cabang = this.IsFormCabang;
        payload.is_mitra = !this.IsFormCabang;

        delete payload.payment_gateway;

        this._settingCompanyService
            .update(payload)
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
        let payload = {
            ...data,
            ...this.FormTagihanComps.FormGroup.value,
            ...this.FormPaymentGatewayComps.FormGroup.value,
        };

        payload.tagihan_use_unik_kode = payload.tagihan_use_unik_kode ? payload.tagihan_use_unik_kode : false;
        payload.is_cabang = this.IsFormCabang;
        payload.is_mitra = !this.IsFormCabang;

        delete payload.payment_gateway;

        this._settingCompanyService
            .delete(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getAll();
                }
            })
    }

}
