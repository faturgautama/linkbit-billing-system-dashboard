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
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/cms/role`);
    }

    create(payload: SetupRolesModel.CreateSetupRoles): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/cms/role`, payload);
    }

    update(payload: SetupRolesModel.UpdateSetupRoles): Observable<HttpBaseResponse> {
        const { id_role, ...newObject } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/role/${payload.id_role}`, newObject);
    }

    delete(id_role: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/cms/role/${id_role}`);
    }
}
