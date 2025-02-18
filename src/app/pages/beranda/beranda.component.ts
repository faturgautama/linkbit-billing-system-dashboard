import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';
import { BerandaService } from 'src/app/services/beranda/beranda.service';

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
    ) { }

    ngOnInit(): void {
        this.getDashboard();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDashboard() {

    }

    handleNavigateToGreetingCard() {
        this._router.navigateByUrl("/greeting-card");
    }

    handleCallAdmin() {
        window.open("https://api.whatsapp.com/send/?phone=6282258049040&text=Halo, saya ingin bertanya tentang UnionIPTV saya");
    }
}
