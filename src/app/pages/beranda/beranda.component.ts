import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';
import { BerandaService } from 'src/app/services/beranda/beranda.service';
import { SettingMenuRolesService } from 'src/app/services/management-user/setting-menu-roles.service';

@Component({
    selector: 'app-beranda',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        NgApexchartsModule,
        ButtonModule,
    ],
    templateUrl: './beranda.component.html',
    styleUrls: ['./beranda.component.scss']
})
export class BerandaComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    UserData$ =
        this._authenticationService.UserData$
            .pipe(takeUntil(this.Destroy$));

    Menu: any[] = [];

    GreetingCards: number = 0;

    Facilities: number = 0;

    EventPromo: number = 0;

    EntertainmentApp: number = 0;

    constructor(
        private _router: Router,
        private _berandaService: BerandaService,
        private _authenticationService: AuthenticationService,
        private _settingMenuRolesService: SettingMenuRolesService,
    ) { }

    ngOnInit(): void {
        const isUserLoggedIn = this._authenticationService.getUserData();

        if (Object.keys(isUserLoggedIn).length) {
            this._authenticationService.setMenu(isUserLoggedIn.id_user_group);
        }

        this.getDashboard();

    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDashboard() {

    }

    private getMenu() {
        const userData = this._authenticationService.getUserData();

        this._settingMenuRolesService
            .getAllAssigned(userData.id_user_group)
            .pipe(takeUntil(this.Destroy$));
    }

    handleNavigateToGreetingCard() {
        this._router.navigateByUrl("/greeting-card");
    }

    handleCallAdmin() {
        window.open("https://api.whatsapp.com/send/?phone=6282258049040&text=Halo, saya ingin bertanya tentang UnionIPTV saya");
    }
}
