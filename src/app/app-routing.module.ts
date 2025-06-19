import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './middleware/auth.guard';
import { MenuPermissionGuard } from './middleware/menu-permission.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./pages/authentication/authentication.component')).AuthenticationComponent,
        data: {
            title: 'Sign In'
        }
    },
    {
        path: 'beranda',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/beranda/beranda.component')).BerandaComponent,
        data: {
            title: 'Home',
            breadcrumbs: ['Home']
        }
    },
    {
        path: 'setup-data',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/setup-data/setup-data.routes')).setupDataRoutes
    },
    {
        path: 'pelanggan',
        canActivate: [AuthGuard, MenuPermissionGuard],
        loadComponent: async () => (await import('./pages/pelanggan/pelanggan.component')).PelangganComponent,
        data: {
            title: 'Pelanggan',
            breadcrumbs: ['Home', 'Pelanggan']
        }
    },
    {
        path: 'tagihan',
        canActivate: [AuthGuard, MenuPermissionGuard],
        loadComponent: async () => (await import('./pages/invoice/invoice.component')).InvoiceComponent,
        data: {
            title: 'Tagihan',
            breadcrumbs: ['Home', 'Tagihan']
        }
    },
    {
        path: 'tagihan/batch-message',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/invoice/notification-invoice/notification-invoice.component')).NotificationInvoiceComponent,
        data: {
            title: 'Send Message Batch',
            breadcrumbs: ['Home', 'Tagihan', 'Send Message Batch']
        }
    },
    {
        path: 'pembayaran',
        canActivate: [AuthGuard, MenuPermissionGuard],
        loadComponent: async () => (await import('./pages/payment/payment.component')).PaymentComponent,
        data: {
            title: 'Pembayaran',
            breadcrumbs: ['Home', 'Pembayaran']
        }
    },
    {
        path: 'user-management',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/management-user/management-user.routes')).managementUserRoutes
    },
    {
        path: 'laporan',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/laporan/laporan.routes')).laporanRoutes
    },
    {
        path: 'print-out',
        loadChildren: async () => (await import('./pages/print-out/print-out.routes')).printOurRoutes
    },
    {
        path: '**',
        loadComponent: async () => (await import('./pages/wildcard-not-found/wildcard-not-found.component')).WildcardNotFoundComponent,
        data: {
            title: 'Oops'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
