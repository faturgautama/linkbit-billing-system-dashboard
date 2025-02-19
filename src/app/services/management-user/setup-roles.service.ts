import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { SetupRolesModel } from 'src/app/model/pages/management-user/setup-role.model';

@Injectable({
    providedIn: 'root'
})
export class SetupRolesService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<SetupRolesModel.GetAllSetupRoles> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/user-group`);
    }

    create(payload: SetupRolesModel.CreateSetupRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/user-group`, payload);
    }

    update(payload: SetupRolesModel.UpdateSetupRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/user-group`, payload);
    }

    delete(payload: SetupRolesModel.UpdateSetupRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/user-group`, {
            ...payload,
            is_active: false
        });
    }
}
