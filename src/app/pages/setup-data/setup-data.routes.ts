import { Route } from "@angular/router";

export const setupDataRoutes: Route[] = [
    {
        path: 'setting-company',
        loadComponent: async () => (await import('./setting-company/setting-company.component')).SettingCompanyComponent,
        data: {
            title: 'Setting Company',
            breadcrumbs: [
                "Home", "Setup Data", "Setting Company"
            ]
        }
    },
    {
        path: 'branch-office',
        loadComponent: async () => (await import('./branch-office/branch-office.component')).BranchOfficeComponent,
        data: {
            title: 'Kantor Cabang',
            breadcrumbs: [
                "Home", "Setup Data", "Kantor Cabang"
            ]
        }
    },
    {
        path: 'mitra',
        loadComponent: async () => (await import('./branch-office/branch-office.component')).BranchOfficeComponent,
        data: {
            title: 'Mitra',
            breadcrumbs: [
                "Home", "Setup Data", "Mitra"
            ]
        }
    },
    {
        path: 'group-pelanggan',
        loadComponent: async () => (await import('./group-pelanggan/group-pelanggan.component')).GroupPelangganComponent,
        data: {
            title: 'Group Pelanggan',
            breadcrumbs: [
                "Home", "Setup Data", "Group Pelanggan"
            ]
        }
    }
];