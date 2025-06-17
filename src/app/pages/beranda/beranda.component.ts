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
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-beranda',
    standalone: true,
    imports: [
        FormsModule,
        ChartModule,
        CommonModule,
        ButtonModule,
        CalendarModule,
        DashboardComponent,
        NgApexchartsModule,
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

    Count: any = {
        "pelanggan": 0,
        "mitra": 0,
        "invoice": 0,
        "payment": 0
    };

    SelectedYear = '2025';

    PaymentYearly: any;

    LatestPayment: any;

    basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'rgb(55 65 81)'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgb(55 65 81)'
                },
                grid: {
                    color: 'rgb(229 231 235)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: 'rgb(55 65 81)'
                },
                grid: {
                    color: 'rgb(229 231 235)',
                    drawBorder: false
                }
            }
        }
    };

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

        this.getCount();
        this.getPaymentYearly(new Date().getFullYear().toString());
        this.getLatestPayment();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getCount() {
        this._berandaService
            .getCount()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Count = result.data;
            })
    }

    private getPaymentYearly(year: string) {
        this.SelectedYear = year;

        this._berandaService
            .getPaymentYearly(year)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                this.PaymentYearly = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Nov', 'Des'],
                    datasets: [
                        {
                            label: 'Sudah Terbayar',
                            data: result.data.map((item: any) => item.total_paid),
                            borderWidth: 1
                        },
                        {
                            label: 'Belum Terbayar',
                            data: result.data.map((item: any) => item.total_unpaid),
                            borderWidth: 1
                        }
                    ]
                };;
            })
    }

    handleChangeYear(args: any) {
        this.getPaymentYearly(new Date(args).getFullYear().toString());
    }

    private getLatestPayment() {
        this._berandaService
            .getLatestPayment()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.LatestPayment = result.data;
            })
    }
}
