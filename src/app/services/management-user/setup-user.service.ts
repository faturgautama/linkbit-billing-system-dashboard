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

    getAll(query?: SetupUserModel.IUserQueryParams): Observable<SetupUserModel.GetAllSetupUser> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/user`, query);
    }

    create(payload: SetupUserModel.CreateSetupUser): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/authentication/register`, payload);
    }

    update(payload: SetupUserModel.UpdateSetupUser): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/user`, payload);
    }

    delete(payload: SetupUserModel.UpdateSetupUser): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/user`, {
            ...payload,
            is_active: false
        });
    }
}
