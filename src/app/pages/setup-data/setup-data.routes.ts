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
    }
];