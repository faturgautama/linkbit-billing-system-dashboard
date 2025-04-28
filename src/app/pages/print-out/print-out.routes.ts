import { Route } from '@angular/router';

export const printOurRoutes: Route[] = [
    {
        path: 'tagihan',
        loadComponent: async () => (await import('./print-out-tagihan/print-out-tagihan.component')).PrintOutTagihanComponent,
    },
    {
        path: 'pos',
        loadComponent: async () => (await import('./print-out-pos/print-out-pos.component')).PrintOutPosComponent,
    },
];