import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { SetupUserModel } from 'src/app/model/pages/management-user/setup-user.model';

@Injectable({
    providedIn: 'root'
})
export class SetupUserService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<SetupUserModel.GetAllSetupUser> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/cms/users`);
    }

    create(payload: SetupUserModel.CreateSetupUser): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/cms/users`, payload);
    }

    update(payload: SetupUserModel.UpdateSetupUser): Observable<HttpBaseResponse> {
        const { id_user, ...newObject } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/users/${id_user}`, newObject);
    }

    delete(id_user: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/cms/users/${id_user}`);
    }
}
