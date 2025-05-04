import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from './services/authentication/authentication.service';
import { PelangganService } from './services/pelanggan/pelanggan.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'frontend-cis';

    Destroy$ = new Subject();

    isLoading = false;

    isStateInitted = false;

    constructor(
        private _store: Store,
        private _router: Router,
        private _renderer: Renderer2,
        private _activatedRoute: ActivatedRoute,
        private _pelangganService: PelangganService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        const isUserLoggedIn = this._authenticationService.getUserData();

        if (Object.keys(isUserLoggedIn).length) {
            this.isLoading = false;
            this._authenticationService.setMenu(isUserLoggedIn.id_user_group);
            if (!this.isStateInitted) {
                this.initPelangganState(isUserLoggedIn.id_setting_company);
            }
        } else {
            this.isLoading = false;
        }
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private initPelangganState(id_setting_company: string) {
        this._pelangganService
            .getAll({ id_setting_company: id_setting_company, is_active: true }, true)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.isStateInitted = true;
            })
    }
}
