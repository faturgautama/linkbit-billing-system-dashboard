import { Route } from '@angular/router';


export const managementUserRoutes: Route[] = [
    {
        path: 'setup-role',
        loadComponent: async () => (await import('./setup-role/setup-role.component')).SetupRoleComponent,
        data: {
            title: 'Setup Role',
            breadcrumbs: [
                "Home", "Management User", "Setup Role"
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
        path: 'setup-user-hotel',
        loadComponent: async () => (await import('./setup-user-hotel/setup-user-hotel.component')).SetupUserHotelComponent,
        data: {
            title: 'Setup User Hotel',
            breadcrumbs: [
                "Home", "Management User", "Setup User Hotel"
            ]
        }
    },
    {
        path: 'setup-user-device',
        loadComponent: async () => (await import('./setup-user-device/setup-user-device.component')).SetupUserDeviceComponent,
        data: {
            title: 'Setup User Device',
            breadcrumbs: [
                "Home", "Management User", "Setup User Device"
            ]
        }
    },
    {
        path: 'setting-role-menu',
        loadComponent: async () => (await import('./setting-menu-role/setting-menu-role.component')).SettingMenuRoleComponent,
        data: {
            title: 'Setting Role Menu',
            breadcrumbs: [
                "Home", "Management User", "Setting Role Menu"
            ]
        }
    },
];
