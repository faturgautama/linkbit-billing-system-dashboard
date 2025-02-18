import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupUserModel } from 'src/app/model/pages/management-user/setup-user.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { SetupUserHotelModel } from 'src/app/model/pages/management-user/setup-user-hotel.model';

@Injectable({
    providedIn: 'root'
})
export class SetupUserHotelService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<SetupUserHotelModel.GetAllSetupUserHotel> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/admin/user-cms`);
    }

    create(payload: SetupUserHotelModel.CreateSetupUserHotel): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/admin/user-cms`, payload);
    }

    update(payload: SetupUserHotelModel.UpdateSetupUserHotel): Observable<HttpBaseResponse> {
        const { id_user, ...newObject } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/admin/user-cms/${id_user}`, newObject);
    }

    delete(id_user: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/admin/user-cms/${id_user}`);
    }
}
