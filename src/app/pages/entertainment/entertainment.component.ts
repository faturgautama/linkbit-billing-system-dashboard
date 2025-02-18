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
import { EntertainmentService } from 'src/app/services/entertainment/entertainment.service';
import { MinioService } from 'src/app/services/minio/minio.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-entertainment',
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
    templateUrl: './entertainment.component.html',
    styleUrl: './entertainment.component.scss'
})
export class EntertainmentComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Setup_Data',
        column: [
            { field: 'title_app', headerName: 'App Name', },
            { field: 'icon_app', headerName: 'Icon', },
            { field: 'package_name_app', headerName: 'App Package Name', },
            { field: 'is_active', headerName: 'Is Active', format: 'icon_boolean' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Change Status', 'Edit G'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'title_app',
        searchPlaceholder: 'Find Entertainment App Name Here'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;


    constructor(
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _confirmationService: ConfirmationService,
        private _entertainmentService: EntertainmentService,
    ) {
        this.FormProps = {
            id: 'form_channel_group',
            fields: [
                {
                    id: 'id_app',
                    label: 'Id App',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'title_app',
                    label: 'Title',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'package_name_app',
                    label: 'Package Name',
                    required: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-1',
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
        this._entertainmentService
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
            this.FormComps.FormGroup.patchValue(args);
            this.FormComps.ImagePreviews['icon'] = args.icon_url;
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'change status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'App will show or hide depends on its status',
                header: 'Are you sure?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Yes, sure',
                rejectIcon: "none",
                rejectLabel: 'No, back',
                accept: () => {
                    this.changeStatus(args.data.id_app);
                }
            });
        }
    }

    private changeStatus(id: string) {
        this._entertainmentService
            .changeStatus(id)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Status app changed succesfully' });
                    this.getAll();
                }
            })
    }
}
