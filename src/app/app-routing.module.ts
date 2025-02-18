import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './middleware/auth.guard';

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
        path: 'entertainment',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/entertainment/entertainment.component')).EntertainmentComponent,
        data: {
            title: 'Entertainment',
            breadcrumbs: ['Home', 'Entertainment']
        }
    },
    {
        path: 'user-management',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/management-user/management-user.routes')).managementUserRoutes
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
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
