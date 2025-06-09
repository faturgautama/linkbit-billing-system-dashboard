import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { TemplateEditorModel } from 'src/app/model/pages/setup-data/template-editor.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ChannelWhatsappService } from 'src/app/services/setup-data/channel-whatsapp.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { TemplateEditorService } from 'src/app/services/setup-data/template-editor.service';

@Component({
    selector: 'app-setting-company',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        GridComponent,
        DropdownModule,
        InputTextModule,
        RadioButtonModule,
        DashboardComponent,
        ReactiveFormsModule,
        ConfirmDialogModule,
        DynamicFormComponent,
    ],
    templateUrl: './setting-company.component.html',
    styleUrl: './setting-company.component.scss'
})
export class SettingCompanyComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'update',
            title: 'Update',
            icon: 'pi pi-save'
        }
    ];

    FormState: 'insert' | 'update' = 'update';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FormTagihanProps: FormModel.IForm;
    @ViewChild('FormTagihanComps') FormTagihanComps!: DynamicFormComponent;

    FormPaymentGatewayProps: FormModel.IForm;
    @ViewChild('FormPaymentGatewayComps') FormPaymentGatewayComps!: DynamicFormComponent;

    IsMitra = false;

    TemplateEditor!: TemplateEditorModel.ITemplateEditor;

    GridPaymentManualProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'payment_method', headerName: 'Payment Method', class: 'text-sky-500 font-semibold' },
            { field: 'no_rekening', headerName: 'No. Rekening', },
            { field: 'is_active', headerName: 'Is Active', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Edit', 'Delete'],
        showPaging: true,
        showSearch: false,
        showSort: false,
        searchKeyword: 'payment_method',
        searchPlaceholder: 'Find Payment Method Here',
    };
    GridPaymentManualSelectedData: any;

    ShowDialogPaymentManual = false;
    FormPaymentManualState: 'insert' | 'update' = 'insert';
    FormPaymentManualProps: FormModel.IForm;
    @ViewChild('FormPaymentManualComps') FormPaymentManualComps!: DynamicFormComponent;

    ChannelWhatsappDatasource: any[] = [];
    SelectedChannelWhatsapp: any;

    GridChannelWaProps: GridModel.IGrid = {
        id: 'GridChannelWa',
        column: [
            { field: 'channel_whatsapp', headerName: 'Channel Whatsapp', class: 'text-sky-500 font-semibold' },
            { field: 'is_default', headerName: 'Is Default', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Menjadi Default', 'Edit', 'Delete'],
        showPaging: true,
        showSearch: false,
        showSort: false,
        searchKeyword: 'channel_whatsapp',
        searchPlaceholder: 'Find Channel Whatsapp Here',
    };
    GridChannelWaSelectedData: any;

    ShowDialogChannelWa = false;
    FormChannelWaState: 'insert' | 'update' = 'insert';
    FormChannelWaProps: FormGroup;
    @ViewChild('FormChannelWaComps') FormChannelWaComps!: DynamicFormComponent;

    constructor(
        private _formBuilder: FormBuilder,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
        private _settingCompanyService: SettingCompanyService,
        private _templateEditorService: TemplateEditorService,
        private _channelWhatsappService: ChannelWhatsappService,
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
                    value: '',
                    hidden: true
                },
                {
                    id: 'is_cabang',
                    label: 'Is Cabang',
                    required: true,
                    type: 'text',
                    value: '',
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
                {
                    id: 'api_key_wa',
                    label: 'API Key WA',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
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
                    label_tag: {
                        id: 'template_pesan_invoice',
                        label: 'Ambil Dari Template',
                        icon: 'pi pi-sync',
                        severity: 'warn'
                    },
                    onTagClick: (args: any) => {
                        this.syncTemplate(args.id, 'tagihan_pesan_invoice');
                    }
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
                    id: 'tagihan_pesan_lunas',
                    label: 'Pesan Whatsapp Lunas',
                    required: true,
                    type: 'editor',
                    value: '',
                    label_tag: {
                        id: 'template_pesan_lunas',
                        label: 'Ambil Dari Template',
                        icon: 'pi pi-sync',
                        severity: 'warn'
                    },
                    onTagClick: (args: any) => {
                        this.syncTemplate(args.id, 'tagihan_pesan_lunas');
                    }
                },
                {
                    id: 'tagihan_editor_invoice',
                    label: 'Editor Tagihan Invoice',
                    required: true,
                    type: 'editor',
                    value: '',
                    hidden: true,
                    label_tag: {
                        id: 'template_editor_invoice',
                        label: 'Ambil Dari Template',
                        icon: 'pi pi-sync',
                        severity: 'warn'
                    },
                    onTagClick: (args: any) => {
                        this.syncTemplate(args.id, 'tagihan_editor_invoice');
                    }
                },
                {
                    id: 'tagihan_editor_pos',
                    label: 'Format Print POS',
                    required: true,
                    type: 'editor',
                    value: '',
                    hidden: true,
                    label_tag: {
                        id: 'template_editor_pos',
                        label: 'Ambil Dari Template',
                        icon: 'pi pi-sync',
                        severity: 'warn'
                    },
                    onTagClick: (args: any) => {
                        this.syncTemplate(args.id, 'tagihan_editor_pos');
                    }
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
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
                {
                    id: 'is_use_pg_admin_fee',
                    label: 'Aktifkan Payment Gateway Admin Fee?',
                    required: true,
                    type: 'radio',
                    value: '',
                    radioButtonProps: [
                        { name: 'is_use_pg_admin_fee', label: 'Iya', value: true },
                        { name: 'is_use_pg_admin_fee', label: 'Tidak', value: false },
                    ]
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormPaymentManualProps = {
            id: 'form_payment_manual',
            fields: [
                {
                    id: 'id_payment_method_manual',
                    label: 'ID',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'payment_method',
                    label: 'Payment Method',
                    required: true,
                    type: 'text',
                    value: '',
                    placeholder: 'Contoh: BRI / MANDIRI'
                },
                {
                    id: 'no_rekening',
                    label: 'Nomor Rekening',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };

        this.FormChannelWaProps = this._formBuilder.group({
            id_channel_whatsapp: [0, [Validators.required]],
            credential: this._formBuilder.group({}),
        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getTemplateEditor();
            this.getAllChannelWhatsapp();
        }, 1000);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getById();
        }, 1);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getById() {
        const userData = this._authenticationService.getUserData();

        this._settingCompanyService
            .getById(userData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.IsMitra = result.data.is_mitra;
                    this.FormComps.FormGroup.patchValue(result.data);
                    this.FormTagihanComps.FormGroup.patchValue(result.data);
                    this.FormPaymentGatewayComps.FormGroup.patchValue(result.data);
                    this.getPaymentMethodManual();
                    this.getChannelWhatsapp();
                }
            });
    }

    private getTemplateEditor() {
        this._templateEditorService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.TemplateEditor = result.data;
                }
            });
    }

    private getAllChannelWhatsapp() {
        this._channelWhatsappService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.ChannelWhatsappDatasource = result.data;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'update') {
            let payload: any = {};

            if (this.FormPaymentGatewayComps) {
                payload = {
                    ...this.FormComps.FormGroup.value,
                    ...this.FormTagihanComps.FormGroup.value,
                    ...this.FormPaymentGatewayComps.FormGroup.value
                };

                delete payload.payment_gateway;
            } else {
                payload = {
                    ...this.FormComps.FormGroup.value,
                    ...this.FormTagihanComps.FormGroup.value,
                };
            }

            this.onUpdateData(payload);
        };
    }

    private onUpdateData(data: any) {
        this._settingCompanyService
            .update(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.getById();
                }
            })
    }

    private syncTemplate(tag_id: keyof TemplateEditorModel.ITemplateEditor, form_id: string) {
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Editor akan tersinkron dengan template',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya, yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, kembali',
            accept: () => {
                if (this.TemplateEditor) {
                    this.FormTagihanComps.FormGroup.get(form_id)?.setValue(this.TemplateEditor[tag_id]);
                }
            }
        });
    }

    onToolbarPaymentManualClicked(args: any) {
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
                    this.deletePaymentMethodManual(args.data);
                }
            });
        }

        if (args.type == 'edit') {
            this.ShowDialogPaymentManual = true;
            this.FormPaymentManualComps.FormGroup.patchValue(args.data);
        }
    }

    getPaymentMethodManual() {
        const userData = this._authenticationService.getUserData();

        this._settingCompanyService
            .getAllPaymentMethodManual(userData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.GridPaymentManualProps.dataSource = result.data;
                }
            })
    }

    savePaymentMethodManual(data: any) {
        this._settingCompanyService
            .createPaymentMethodManual(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                    this.FormPaymentGatewayComps.FormGroup.reset();
                    this.ShowDialogPaymentManual = false;
                    this.getPaymentMethodManual();
                }
            })
    }

    updatePaymentMethodManual(data: any) {
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
                this._settingCompanyService
                    .update(data)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                            this.FormPaymentGatewayComps.FormGroup.reset();
                            this.ShowDialogPaymentManual = false;
                            this.getPaymentMethodManual();
                        }
                    })
            }
        });
    }

    private deletePaymentMethodManual(data: any) {
        this._settingCompanyService
            .updatePaymentMethodManual({ ...data, is_active: false })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getPaymentMethodManual();
                }
            })
    }

    onToolbarChannelWhatsappClicked(args: any) {
        if (args.type == 'ubah menjadi default') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Pesan Whatsapp Akan Menggunakan Channel Ini',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak',
                accept: () => {
                    args.data.is_default = true;

                    this._settingCompanyService
                        .updateChannelWhatsapp(args.data)
                        .pipe(takeUntil(this.Destroy$))
                        .subscribe((result) => {
                            if (result.status) {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                                this.FormChannelWaProps.reset();
                                this.ShowDialogChannelWa = false;
                                this.getChannelWhatsapp();
                            }
                        })
                }
            });
        }

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
                    this.deleteChannelWhatsapp(args.data);
                }
            });
        }

        if (args.type == 'edit') {
            this.ShowDialogChannelWa = true;
            this.FormChannelWaProps.patchValue(args.data);
        }
    }

    handleChannelWhatsappKey(key: string) {
        return key.replace(/_/g, ' ');
    }

    handleChangeDropdownChannelWhatsapp(args: any) {
        if (args.value) {
            this.SelectedChannelWhatsapp = this.ChannelWhatsappDatasource.find(item => item.id_channel_whatsapp == args.value);
            console.log("selected channel =>", this.SelectedChannelWhatsapp);

            const requiredCredential = this.SelectedChannelWhatsapp.required_credential;

            for (const item of requiredCredential) {
                (this.FormChannelWaProps.get('credential') as FormGroup).addControl(item.key, this._formBuilder.control('', Validators.required))
            }
        }
    }

    getChannelWhatsapp() {
        const userData = this._authenticationService.getUserData();

        this._settingCompanyService
            .getAllChannelWhatsapp(userData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.GridChannelWaProps.dataSource = result.data;
                }
            })
    }

    saveChannelWhatsapp(data: any) {
        this._settingCompanyService
            .createChannelWhatsapp(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                    this.FormChannelWaProps.reset();
                    this.ShowDialogChannelWa = false;
                    this.getChannelWhatsapp();
                }
            })
    }

    updateChannelWhatsapp(data: any) {
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
                this._settingCompanyService
                    .updateChannelWhatsapp(data)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                            this.FormChannelWaProps.reset();
                            this.ShowDialogChannelWa = false;
                            this.getChannelWhatsapp();
                        }
                    })
            }
        });
    }

    private deleteChannelWhatsapp(data: any) {
        this._settingCompanyService
            .updateChannelWhatsapp({ ...data, is_active: false })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getPaymentMethodManual();
                }
            })
    }

    get credentialFormGroup(): FormGroup {
        return this.FormChannelWaProps.get('credential') as FormGroup;
    }
}
