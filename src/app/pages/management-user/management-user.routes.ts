import { Route } from '@angular/router';
import { MenuPermissionGuard } from 'src/app/middleware/menu-permission.guard';


export const managementUserRoutes: Route[] = [
    {
        path: 'setup-menu',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./setup-menu/setup-menu.component')).SetupMenuComponent,
        data: {
            title: 'Setup Menu',
            breadcrumbs: [
                "Home", "Management User", "Setup Menu"
            ]
        }
    },
    {
        path: 'setup-group-user',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./setup-role/setup-role.component')).SetupRoleComponent,
        data: {
            title: 'Setup Group User',
            breadcrumbs: [
                "Home", "Management User", "Setup Group User"
            ]
        }
    },
    {
        path: 'setup-user',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./setup-user/setup-user.component')).SetupUserComponent,
        data: {
            title: 'Setup User',
            breadcrumbs: [
                "Home", "Management User", "Setup User"
            ]
        }
    },
    {
        path: 'setting-menu-akses',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./setting-menu-role/setting-menu-role.component')).SettingMenuRoleComponent,
        data: {
            title: 'Setting Menu Akses',
            breadcrumbs: [
                "Home", "Management User", "Setting Menu Akses"
            ]
        }
    },
    {
        path: 'log-activity',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./logging/log-activity/log-activity.component')).LogActivityComponent,
        data: {
            title: 'Log Aktifitas User',
            breadcrumbs: [
                "Home", "Management User", "Log Aktifitas User"
            ]
        }
    },
    {
        path: 'log-message',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./logging/log-message-invoice/log-message-invoice.component')).LogMessageInvoiceComponent,
        data: {
            title: 'Log Pesan Invoice',
            breadcrumbs: [
                "Home", "Management User", "Log Pesan Invoice"
            ]
        }
    }
];
