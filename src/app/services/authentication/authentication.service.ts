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

    SidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([]);

    HotelId = 0;

    constructor(
        private _cookieService: CookieService,
        private _httpRequestService: HttpRequestService,
    ) { }

    signIn(payload: AuthenticationModel.ISignIn): Observable<AuthenticationModel.SignIn> {
        return this._httpRequestService
            .postRequest(`${environment.webApiUrl}/authentication/login`, payload)
            .pipe(
                tap((result) => {
                    if (result.status) {
                        this.handleSignIn(result.data);
                    }
                })
            )
    }

    getProfile(loginResult: any) {
        localStorage.removeItem("_LBS_MENU_");

        this._httpRequestService
            .getRequest(`${environment.webApiUrl}/authentication/profile`)
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

                localStorage.setItem("_LBS_MENU_", JSON.stringify(result.data.menu));
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
        const menu = localStorage.getItem('_LBS_MENU_');
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
