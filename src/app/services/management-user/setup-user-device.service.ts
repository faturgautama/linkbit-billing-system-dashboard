import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupUserDeviceModel } from 'src/app/model/pages/management-user/setup-user-device.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupUserDeviceService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<SetupUserDeviceModel.GetAllSetupUserDevice> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/admin/user-device/getUserRoom`);
    }

    getDeviceInfo(id_user_device: string): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/admin/user-device/getById/${id_user_device}`);
    }

    create(payload: SetupUserDeviceModel.CreateSetupUserDevice): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/admin/user-device/insertUserRoom`, payload);
    }

    update(payload: SetupUserDeviceModel.UpdateSetupUserDevice): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/admin/user-device/updateUserRoom`, payload);
    }

    deactivated(id_user_device: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/admin/user-device/deactived/${id_user_device}`);
    }

    activated(id_user_device: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/admin/user-device/actived/${id_user_device}`, null);
    }
}
