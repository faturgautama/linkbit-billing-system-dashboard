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
import { SetupRolesService } from 'src/app/services/management-user/setup-roles.service';
import { SetupUserHotelService } from 'src/app/services/management-user/setup-user-hotel.service';
import { SetupUserService } from 'src/app/services/management-user/setup-user.service';

@Component({
    selector: 'app-setup-user-hotel',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-user-hotel.component.html',
    styleUrl: './setup-user-hotel.component.scss'
})
export class SetupUserHotelComponent implements OnInit, OnDestroy {

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
            { field: 'nama_hotel', headerName: 'Hotel Name', },
            { field: 'nama_role', headerName: 'Role', },
            { field: 'nama', headerName: 'Name', },
            { field: 'username', headerName: 'Username', },
            { field: 'is_active', headerName: 'Is Active', renderAsCheckbox: true, },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'nama',
        searchPlaceholder: 'Find User Name Here'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _setupRolesService: SetupRolesService,
        private _confirmationService: ConfirmationService,
        private _setupUserHotelService: SetupUserHotelService,
    ) {
        this.FormProps = {
            id: 'form_channel_group',
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
                    id: 'id_hotel',
                    label: 'Hotel',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'title_hotel',
                        optionValue: 'id'
                    },
                    value: '',
                },
                {
                    id: 'id_role',
                    label: 'Role',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'role',
                        optionValue: 'id_role'
                    },
                    value: '',
                },
                {
                    id: 'nama',
                    label: 'Name',
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
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Active', value: true },
                            { name: 'Inactive', value: false },
                        ],
                        optionName: 'name',
                        optionValue: 'value'
                    },
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
        this.getAllRole();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._setupUserHotelService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    }

    private getAllRole() {
        this._setupRolesService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.FormProps.fields[2].dropdownProps.options = result.data;
                }
            });
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

            this.FormProps.fields[6].hidden = true;
            this.FormProps.class = 'grid-rows-5';

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
            this.FormProps.fields[6].hidden = false;
            this.FormProps.class = 'grid-rows-6';

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
                    this.deleteData(args.data.id_user);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveData(data: any) {
        delete data.id_user;
        delete data.is_active;

        this._setupUserHotelService
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
        this._setupUserHotelService
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

    private deleteData(id: string) {
        this._setupUserHotelService
            .delete(id)
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
