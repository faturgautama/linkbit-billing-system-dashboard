import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { map, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { SettingMenuRolesService } from 'src/app/services/management-user/setting-menu-roles.service';
import { SetupRolesService } from 'src/app/services/management-user/setup-roles.service';

@Component({
    selector: 'app-setting-menu-role',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        OverlayPanelModule,
    ],
    templateUrl: './setting-menu-role.component.html',
    styleUrl: './setting-menu-role.component.scss'
})
export class SettingMenuRoleComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    Role$ = this._setupRoleService.getAll()
        .pipe(
            takeUntil(this.Destroy$),
            map((result) => {
                return result.data;
            })
        );

    SelectedRole!: string;

    MenuRole: any[] = [];

    constructor(
        private _messageService: MessageService,
        private _setupRoleService: SetupRolesService,
        private _settingMenuRolesService: SettingMenuRolesService,
    ) { }

    ngOnInit(): void {
        // this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    getMenuByIdRole(id_role: string) {
        this.SelectedRole = id_role;

        this._settingMenuRolesService
            .getAll(id_role)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.MenuRole = result.data;
                }
            });
    }

    handleChangeStatusAssign(menu: any) {
        if (menu.is_assign) {
            this._settingMenuRolesService
                .delete(menu.id_role_menu)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                        this.getMenuByIdRole(this.SelectedRole);
                    }
                });
        };

        if (!menu.is_assign) {
            this._settingMenuRolesService
                .create({ id_menu: menu.id_menu, id_role: this.SelectedRole })
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                        this.getMenuByIdRole(this.SelectedRole);
                    }
                });
        };
    }
}
