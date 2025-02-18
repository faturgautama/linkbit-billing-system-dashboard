import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationModel } from 'src/app/model/pages/authentication/authentication.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    UserData$ = new BehaviorSubject<AuthenticationModel.IAuthentication>({} as any);

    // SidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([
    //     {
    //         id_menu: '1',
    //         caption: 'Channel TV',
    //         icon: 'pi pi-desktop',
    //         toggle_child: false,
    //         is_active: true,
    //         is_parent: true,
    //         id_parent: null,
    //         is_admin: false,
    //         is_client: true,
    //         sidebarChild: [
    //             {
    //                 id_menu: '11',
    //                 caption: 'Channel Group',
    //                 icon: 'pi pi-clone',
    //                 toggle_child: false,
    //                 url: '/setting-channel-tv/channel-group',
    //                 is_active: true,
    //                 is_parent: false,
    //                 id_parent: '1',
    //                 is_admin: false,
    //                 is_client: true,
    //             },
    //             {
    //                 id_menu: '12',
    //                 caption: 'Channel List',
    //                 icon: 'pi pi-desktop',
    //                 toggle_child: false,
    //                 url: '/setting-channel-tv/channel-list',
    //                 is_active: true,
    //                 is_parent: false,
    //                 id_parent: '1',
    //                 is_admin: false,
    //                 is_client: true,
    //             },
    //         ]
    //     },
    //     {
    //         id_menu: '2',
    //         caption: 'Event & Promo',
    //         icon: 'pi pi-calendar-clock',
    //         toggle_child: false,
    //         url: '/event-promo',
    //         is_active: true,
    //         is_parent: true,
    //         id_parent: null,
    //         is_admin: false,
    //         is_client: true,
    //     },
    //     {
    //         id_menu: '3',
    //         caption: 'Entertainment',
    //         icon: 'pi pi-crown',
    //         toggle_child: false,
    //         url: '/entertainment',
    //         is_active: true,
    //         is_parent: true,
    //         id_parent: null,
    //         is_admin: false,
    //         is_client: true,
    //     },
    //     {
    //         id_menu: '4',
    //         caption: 'For Your Guest',
    //         icon: 'pi pi-file-edit',
    //         toggle_child: false,
    //         is_active: true,
    //         is_parent: true,
    //         id_parent: null,
    //         is_admin: false,
    //         is_client: true,
    //         sidebarChild: [
    //             {
    //                 id_menu: '41',
    //                 caption: 'About Us',
    //                 icon: 'pi pi-info-circle',
    //                 toggle_child: false,
    //                 url: '/for-your-guest/about-us'
    //             },
    //             {
    //                 id_menu: '42',
    //                 caption: 'Our Rooms',
    //                 icon: 'pi pi-home',
    //                 toggle_child: false,
    //                 url: '/for-your-guest/our-rooms'
    //             },
    //             {
    //                 id_menu: '43',
    //                 caption: 'Our Facilities',
    //                 icon: 'pi pi-expand',
    //                 toggle_child: false,
    //                 url: '/for-your-guest/our-facilities'
    //             },
    //         ]
    //     },
    //     {
    //         id_menu: '5',
    //         caption: 'Resto',
    //         icon: 'pi pi-receipt',
    //         toggle_child: false,
    //         sidebarChild: [
    //             {
    //                 id_menu: '51',
    //                 caption: 'Dining Category',
    //                 icon: 'pi pi-info-circle',
    //                 toggle_child: false,
    //                 url: '/resto/dining-category'
    //             },
    //             {
    //                 id_menu: '52',
    //                 caption: 'Dining Menu',
    //                 icon: 'pi pi-star',
    //                 toggle_child: false,
    //                 url: '/resto/dining'
    //             },
    //         ]
    //     },
    //     {
    //         id_menu: '7',
    //         caption: 'Nearby Attractions',
    //         icon: 'pi pi-car',
    //         toggle_child: false,
    //         url: '/nearby-attractions'
    //     },
    //     {
    //         id_menu: '8',
    //         caption: 'IPTV Features',
    //         icon: 'pi pi-cog',
    //         toggle_child: false,
    //         url: '/iptv-features'
    //     },
    //     {
    //         id_menu: '9',
    //         caption: 'User Management',
    //         icon: 'pi pi-users',
    //         toggle_child: false,
    //         sidebarChild: [
    //             {
    //                 id_menu: '91',
    //                 caption: 'Setup Role',
    //                 icon: 'pi pi-objects-column',
    //                 toggle_child: false,
    //                 url: '/user-management/setup-role'
    //             },
    //             {
    //                 id_menu: '92',
    //                 caption: 'Setup User',
    //                 icon: 'pi pi-user',
    //                 toggle_child: false,
    //                 url: '/user-management/setup-user'
    //             },
    //             {
    //                 id_menu: '95',
    //                 caption: 'Setting Menu Roles',
    //                 icon: 'pi pi-sliders-h',
    //                 toggle_child: false,
    //                 url: '/user-management/setting-role-menu'
    //             },
    //         ]
    //     },
    //     {
    //         id_menu: '10',
    //         caption: 'User Device',
    //         icon: 'pi pi-microchip',
    //         toggle_child: false,
    //         url: '/user-device'
    //     },
    //     {
    //         id_menu: '11',
    //         caption: 'Room Customizer',
    //         icon: 'pi pi-sliders-h',
    //         toggle_child: false,
    //         sidebarChild: [
    //             {
    //                 id_menu: '111',
    //                 caption: 'Background Image',
    //                 icon: 'pi pi-tablet',
    //                 toggle_child: false,
    //                 url: '/room-customizer/background'
    //             },
    //             {
    //                 id_menu: '112',
    //                 caption: 'Running Text',
    //                 icon: 'pi pi-pencil',
    //                 toggle_child: false,
    //                 url: '/room-customizer/running-text'
    //             },
    //             {
    //                 id_menu: '113',
    //                 caption: 'Greeting Card',
    //                 icon: 'pi pi-check-square',
    //                 toggle_child: false,
    //                 url: '/room-customizer/greeting-card'
    //             },
    //         ]
    //     },
    //     {
    //         id_menu: '12',
    //         caption: 'Admin Menu',
    //         icon: 'pi pi-cog',
    //         toggle_child: false,
    //         sidebarChild: [
    //             {
    //                 id_menu: '121',
    //                 caption: 'Register Hotel',
    //                 icon: 'pi pi-building',
    //                 toggle_child: false,
    //                 url: '/register-hotel'
    //             },
    //             {
    //                 id_menu: '122',
    //                 caption: 'Setup User Hotel',
    //                 icon: 'pi pi-address-book',
    //                 toggle_child: false,
    //                 url: '/user-management/setup-user-hotel'
    //             },
    //             {
    //                 id_menu: '123',
    //                 caption: 'Setup User Device',
    //                 icon: 'pi pi-user',
    //                 toggle_child: false,
    //                 url: '/user-management/setup-user-device'
    //             },
    //         ]
    //     },
    // ]);

    SidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([]);

    HotelId = 0;

    constructor(
        private _cookieService: CookieService,
        private _httpRequestService: HttpRequestService,
    ) { }

    signIn(payload: AuthenticationModel.ISignIn): Observable<AuthenticationModel.SignIn> {
        return this._httpRequestService
            .postRequest(`${environment.webApiUrl}/cms/users/login`, payload)
            .pipe(
                tap((result) => {
                    if (result.status) {
                        this.handleSignIn(result.data);
                    }
                })
            )
    }

    getProfile(loginResult: any) {
        localStorage.removeItem("_UNION_IPTV_MENU_");

        this._httpRequestService
            .getRequest(`${environment.webApiUrl}/cms/profile/getProfile`)
            .pipe(
                tap((result) => {
                    if (result.status) {

                    }
                })
            )
            .subscribe((result) => {
                this.HotelId = result.data.id_hotel;

                const newRes = {
                    ...loginResult,
                    ...result.data,
                };

                localStorage.setItem("_LBS_UD_", JSON.stringify(newRes));

                localStorage.setItem("_UNION_IPTV_MENU_", JSON.stringify(result.data.menu));
                this.SidebarMenu$.next(result.data.menu);
            })
    }

    setUserData() {
        const user_data = localStorage.getItem("_LBS_UD_");
        const layanan_data = localStorage.getItem("_LBS_UD_");
        this.UserData$.next({ ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) });
    }

    getUserData() {
        const user_data = localStorage.getItem("_LBS_UD_");
        const layanan_data = localStorage.getItem("_LBS_UD_");
        return { ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) };
    }

    setMenu() {
        const menu = localStorage.getItem('_UNION_IPTV_MENU_');
        this.SidebarMenu$.next(JSON.parse(menu as any));
    }

    private handleSignIn(data: AuthenticationModel.IAuthentication) {
        localStorage.clear();
        localStorage.setItem("_LBS_UD_", JSON.stringify(data));
        setTimeout(() => {
            this.getProfile(data);
        }, 1000);
    }
}
