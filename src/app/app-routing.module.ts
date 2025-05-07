import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'checkout',
        loadComponent: async () => (await import('./pages/checkout/checkout.component')).CheckoutComponent
    },
    {
        path: 'invoice-digital',
        loadComponent: async () => (await import('./pages/print-out/invoice-digital/invoice-digital.component')).InvoiceDigitalComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
