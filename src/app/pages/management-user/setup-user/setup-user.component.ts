import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SetupRolesService } from 'src/app/services/management-user/setup-roles.service';
import { SetupUserService } from 'src/app/services/management-user/setup-user.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';

@Component({
    selector: 'app-setup-user',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-user.component.html',
    styleUrl: './setup-user.component.scss'
})
export class SetupUserComponent implements OnInit, OnDestroy {

    UserData = this._authenticationService.getUserData();

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
        id: 'Setup_Data',
        column: [
            { field: 'full_name', headerName: 'Nama User', class: 'text-sky-500 font-semibold' },
            { field: 'user_group', headerName: 'Group User', },
            { field: 'company_name', headerName: 'Nama Perusahaan', },
            { field: 'email', headerName: 'Email', },
            { field: 'username', headerName: 'Username', },
            { field: 'is_active', headerName: 'Is Active', class: 'text-center', renderAsCheckbox: true },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'nama',
        searchPlaceholder: 'Find User Name Here',
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'id_user_group',
                placeholder: 'Cari User Group Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'user_group',
                    optionValue: 'id_user_group'
                }
            },
            {
                id: 'id_setting_company',
                placeholder: 'Cari Perusahaan Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'company_name',
                    optionValue: 'id_setting_company'
                }
            },
            {
                id: 'full_name',
                placeholder: 'Cari Nama User Disini',
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
        private _setupUserService: SetupUserService,
        private _setupRolesService: SetupRolesService,
        private _confirmationService: ConfirmationService,
        private _settingCompanyService: SettingCompanyService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'form_setup_user',
            fields: [
                {
                    id: 'id_user',
                    label: 'Id User',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_setting_company',
                    label: 'Nama Perusahaan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'company_name',
                        optionValue: 'id_setting_company'
                    },
                    value: '',
                },
                {
                    id: 'id_user_group',
                    label: 'Group User',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'user_group',
                        optionValue: 'id_user_group'
                    },
                    value: '',
                },
                {
                    id: 'full_name',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'username',
                    label: 'Username',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'password',
                    label: 'Password',
                    required: true,
                    type: 'password',
                    value: '',
                },
                {
                    id: 'email',
                    label: 'Email',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'address',
                    label: 'Alamat Lengkap',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'phone',
                    label: 'No. Telepon',
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
                    id: 'notes',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.onMapCompanyType();
        this.getAll({ id_setting_company: this.UserData.id_setting_company });
        this.getAllRole();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private onMapCompanyType() {
        if (this.UserData.company_type != 'KANTOR PUSAT') {
            const index = this.GridProps.customSearchProps?.findIndex(item => item.id == 'id_setting_company');
            this.GridProps.customSearchProps?.splice(index!, 1);

            const indexForm = this.FormProps.fields.findIndex(item => item.id == 'id_setting_company');
            this.FormProps.fields[indexForm].hidden = true;
        } else {
            this.getAllSettingCompany();
        }
    }

    private getAll(query?: any) {
        if (this.UserData.company_type != 'KANTOR PUSAT') {
            query.id_setting_company = this.UserData.id_setting_company;
        };

        this._setupUserService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    }

    private getAllSettingCompany() {
        this._settingCompanyService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    const indexGrid = this.GridProps.customSearchProps?.findIndex(item => item.id == 'id_setting_company');
                    this.GridProps.customSearchProps![indexGrid!].dropdownProps!.options = result.data;

                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_setting_company');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    private getAllRole() {
        this._setupRolesService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    const indexGrid = this.GridProps.customSearchProps?.findIndex(item => item.id == 'id_user_group');
                    this.GridProps.customSearchProps![indexGrid!].dropdownProps!.options = result.data;

                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_user_group');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    onSearchGrid(args: any) {
        this.getAll(args);
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
    }

    saveData(data: any) {
        delete data.id_user;

        this._setupUserService
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
        this._setupUserService
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
        this._setupUserService
            .delete(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.handleBackToList();
                }
            })
    }
}
