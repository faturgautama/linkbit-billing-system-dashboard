import { Route } from "@angular/router";
import { MenuPermissionGuard } from "src/app/middleware/menu-permission.guard";

export const setupDataRoutes: Route[] = [
    {
        path: 'setting-company',
        canActivate: [MenuPermissionGuard],
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
        canActivate: [MenuPermissionGuard],
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
        canActivate: [MenuPermissionGuard],
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
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./group-pelanggan/group-pelanggan.component')).GroupPelangganComponent,
        data: {
            title: 'Group Pelanggan',
            breadcrumbs: [
                "Home", "Setup Data", "Group Pelanggan"
            ]
        }
    },
    {
        path: 'produk',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./product/product.component')).ProductComponent,
        data: {
            title: 'Produk Layanan',
            breadcrumbs: [
                "Home", "Setup Data", "Produk Layanan"
            ]
        }
    },
    {
        path: 'template-editor',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./template-editor/template-editor.component')).TemplateEditorComponent,
        data: {
            title: 'Template Editor',
            breadcrumbs: [
                "Home", "Setup Data", "Template Editor"
            ]
        }
    }
];