import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        DialogModule,
        InputTextModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ShowTopMenu = false;

    ShowSearch = false;

    OriginalMenu = this.getMenu();

    Menu: any[] = this.getMenu();

    Logo = this._sanitizer.bypassSecurityTrustResourceUrl('https://linkbit.net.id/assets/img/logo-linkbit.png');

    constructor(
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {

    }

    getMenu(): any {
        const menu = this._authenticationService.SidebarMenu$.value;

        let flatArray: any[] = [];

        function flatten(item: any) {
            const { child, url, ...rest } = item;
            // Only push items that have a URL
            if (url) {
                flatArray.push({ ...rest, url });
            }
            if (child) {
                child.forEach(flatten);
            }
        }

        menu.forEach(flatten);
        return flatArray;
    }

    handleToggleSidebar() {
        const state: boolean = this._utilityService.ShowSidebar$.value;
        this._utilityService.ShowSidebar$.next(!state);
    }

    handleToggleTopMenu() {
        this.ShowTopMenu = !this.ShowTopMenu;
        this._utilityService.ShowTopMenu$.next(this.ShowTopMenu);
    }

    handleFilterMenu(keyword: string) {
        this.Menu = this.OriginalMenu;

        if (keyword) {
            this.Menu = this.Menu.filter(item => item.menu.toLowerCase().includes(keyword.toLowerCase()));
        } else {
            this.Menu = this.OriginalMenu;
        }
    }

    onBackToBeranda() {
        this._router.navigateByUrl("/beranda");
    }

    handleNavigateToMenu(url: string) {
        this._router.navigateByUrl(url);
    }

    onSignOut() {
        this._utilityService.ShowLoading$.next(true);

        setTimeout(() => {
            this._utilityService.ShowLoading$.next(false);
            this._messageService.clear();
            this._messageService.add({ severity: 'success', detail: 'Success', summary: 'Sign Out Succesfully' });
            this._router.navigateByUrl("");
            localStorage.clear();
        }, 2000);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}   
