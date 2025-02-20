import { Route } from '@angular/router';


export const managementUserRoutes: Route[] = [
    {
        path: 'setup-menu',
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
        loadComponent: async () => (await import('./setting-menu-role/setting-menu-role.component')).SettingMenuRoleComponent,
        data: {
            title: 'Setting Menu Akses',
            breadcrumbs: [
                "Home", "Management User", "Setting Menu Akses"
            ]
        }
    },
];
