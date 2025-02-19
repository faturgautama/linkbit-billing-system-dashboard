import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupUserModel } from 'src/app/model/pages/management-user/setup-user.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { SettingUserRolesModel } from 'src/app/model/pages/management-user/setting-user-roles.model';

@Injectable({
    providedIn: 'root'
})
export class SettingMenuRolesService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_role: string): Observable<SettingUserRolesModel.GetAllSettingUserRoles> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/cms/role-menu/GetByIdRole/${id_role}`);
    }

    getAllAssigned(id_user_group: number): Observable<any> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/manajemen-menu/assigned/${id_user_group}`)
            .pipe(
                map((result) => {
                    if (result.status) {
                        result.data = result.data.map((item: any) => {
                            return {
                                ...item,
                                toggle_child: false,
                                is_parent: item.child.length > 0
                            }
                        });
                    }

                    return result;
                })
            )
    }

    create(payload: SettingUserRolesModel.CreateSettingUserRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/cms/role-menu`, payload);
    }

    update(payload: SettingUserRolesModel.UpdateSettingUserRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/role-menu/${payload.id_role_menu}`, payload);
    }

    delete(id_role_menu: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/cms/role-menu/${id_role_menu}`);
    }

    assign(id_menu: string, id_role: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/role-menu/updateStatusAssign/${id_menu}/${id_role}`, null);
    }
}
