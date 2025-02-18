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
import { SetupUserDeviceService } from 'src/app/services/management-user/setup-user-device.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-setup-user-device',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-user-device.component.html',
    styleUrl: './setup-user-device.component.scss'
})
export class SetupUserDeviceComponent implements OnInit, OnDestroy {

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
            { field: 'nama_hotel', headerName: 'Hotel Name' },
            { field: 'username', headerName: 'Username' },
            { field: 'room_id', headerName: 'Room Id', },
            { field: 'is_active', headerName: 'Is Active', renderAsCheckbox: true },
            { field: 'created_at', headerName: 'Created At', format: 'date' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Change Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'username',
        searchPlaceholder: 'Find Username Here'
    };
    GridSelectedData: any;

    DeviceInfo: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _confirmationService: ConfirmationService,
        private _setupUserDeviceService: SetupUserDeviceService,
    ) {
        this.FormProps = {
            id: 'form_user_device',
            fields: [
                {
                    id: 'id_user_device',
                    label: 'Id User Device',
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
                    id: 'username',
                    label: 'Username',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'room_id',
                    label: 'Room Id',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'password',
                    label: 'Password',
                    required: false,
                    type: 'password',
                    value: '',
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-1',
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

    private getAll() {
        this._setupUserDeviceService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
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
            args.id_hotel = parseInt(args.id_hotel);
            this.FormComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'change status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'User device status will be changed',
                header: 'Are you sure?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Yes, sure',
                rejectIcon: "none",
                rejectLabel: 'No, back',
                accept: () => {
                    if (args.data.is_active) {
                        this.deactivatedData(args.data.id_user_device);
                    } else {
                        this.activatedData(args.data.id_user_device);
                    }

                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveData(data: any) {
        delete data.id_user_device;

        this._setupUserDeviceService
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
        this._setupUserDeviceService
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

    private deactivatedData(id: string) {
        this._setupUserDeviceService
            .deactivated(id)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Status changed succesfully' });
                    this.getAll();
                }
            })
    }

    private activatedData(id: string) {
        this._setupUserDeviceService
            .activated(id)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Status changed succesfully' });
                    this.getAll();
                }
            })
    }

}
