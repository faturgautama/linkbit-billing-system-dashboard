import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationModel } from 'src/app/model/pages/authentication/authentication.model';
import { SettingMenuRolesService } from '../management-user/setting-menu-roles.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    UserData$ = new BehaviorSubject<AuthenticationModel.IAuthentication>({} as any);

    SidebarMenu$ = new BehaviorSubject<AuthenticationModel.IUserGroupMenu[]>([]);

    constructor(
        private _cookieService: CookieService,
        private _httpRequestService: HttpRequestService,
        private _settingMenuRolesService: SettingMenuRolesService,
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
                const newRes = {
                    ...loginResult,
                    ...result.data,
                };

                localStorage.setItem("_LBS_UD_", JSON.stringify(newRes));
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

    setMenu(id_user_group: number) {
        this._settingMenuRolesService
            .getAllAssigned(id_user_group)
            .subscribe((result) => {
                if (result.status) {
                    localStorage.setItem("_LBS_MENU_", JSON.stringify(result.data));
                    this.SidebarMenu$.next(result.data);
                }
            })
    }

    private handleSignIn(data: AuthenticationModel.IAuthentication) {
        localStorage.clear();
        localStorage.setItem("_LBS_UD_", JSON.stringify(data));
        setTimeout(() => {
            this.getProfile(data);
        }, 1000);
    }
}
