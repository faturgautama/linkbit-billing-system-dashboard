import { Route } from '@angular/router';
import { MenuPermissionGuard } from 'src/app/middleware/menu-permission.guard';

export const laporanRoutes: Route[] = [
    {
        path: 'rekap-tagihan-per-periode',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./rekap-tagihan/rekap-tagihan.component')).RekapTagihanComponent,
        data: {
            title: 'Rekap Tagihan Per Periode',
            breadcrumbs: [
                "Home", "Laporan", "Rekap Tagihan Per Periode"
            ]
        }
    },
    {
        path: 'detail-tagihan-per-periode',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./detail-tagihan/detail-tagihan.component')).DetailTagihanComponent,
        data: {
            title: 'Detail Tagihan Per Periode',
            breadcrumbs: [
                "Home", "Laporan", "Detail Tagihan Per Periode"
            ]
        }
    },
    {
        path: 'rekap-pembayaran-per-periode',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./rekap-pembayaran/rekap-pembayaran.component')).RekapPembayaranComponent,
        data: {
            title: 'Rekap Pembayaran Per Periode',
            breadcrumbs: [
                "Home", "Laporan", "Rekap Pembayaran Per Periode"
            ]
        }
    },
    {
        path: 'rekap-pembayaran-per-tahun',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./rekap-pembayaran-tahunan/rekap-pembayaran-tahunan.component')).RekapPembayaranTahunanComponent,
        data: {
            title: 'Rekap Pembayaran Per Tahun',
            breadcrumbs: [
                "Home", "Laporan", "Rekap Pembayaran Per Tahun"
            ]
        }
    },
    {
        path: 'detail-pembayaran-per-periode',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./detail-pembayaran/detail-pembayaran.component')).DetailPembayaranComponent,
        data: {
            title: 'Detail Pembayaran Per Periode',
            breadcrumbs: [
                "Home", "Laporan", "Detail Pembayaran Per Periode"
            ]
        }
    },
    {
        path: 'tagihan-kso-mitra',
        canActivate: [MenuPermissionGuard],
        loadComponent: async () => (await import('./tagihan-kso-mitra/tagihan-kso-mitra.component')).TagihanKsoMitraComponent,
        data: {
            title: 'Tagihan KSO Mitra',
            breadcrumbs: [
                "Home", "Laporan", "Tagihan KSO Mitra"
            ]
        }
    },
];