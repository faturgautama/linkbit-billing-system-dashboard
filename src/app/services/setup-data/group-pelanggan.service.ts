import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { GroupPelangganModel } from 'src/app/model/pages/setup-data/group-pelanggan.model';

@Injectable({
    providedIn: 'root'
})
export class GroupPelangganService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: GroupPelangganModel.IGroupPelangganQueryParams): Observable<GroupPelangganModel.GetAllGroupPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/group-pelanggan`, query);
    }

    getById(id_group_pelanggan: number): Observable<GroupPelangganModel.GetAllGroupPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/group-pelanggan/retrieve/${id_group_pelanggan}`);
    }

    create(payload: GroupPelangganModel.CreateGroupPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/group-pelanggan`, {
            group_pelanggan: payload.group_pelanggan,
        });
    }

    update(payload: GroupPelangganModel.UpdateGroupPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/group-pelanggan`, payload);
    }

    delete(payload: GroupPelangganModel.UpdateGroupPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/group-pelanggan`, {
            ...payload,
            is_active: false,
        });
    }
}
