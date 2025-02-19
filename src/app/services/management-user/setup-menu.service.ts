import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupMenuModel } from 'src/app/model/pages/management-user/setup-menu.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupMenuService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: SetupMenuModel.IMenuQueryParams): Observable<SetupMenuModel.GetAllSetupMenu> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/menu`, query);
    }

    getById(id_menu: number): Observable<SetupMenuModel.GetAllSetupMenu> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/menu/retrieve/${id_menu}`);
    }

    create(payload: SetupMenuModel.CreateSetupMenu): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/menu`, {
            id_parent: payload.id_parent! > 0 ? payload.id_parent : null,
            menu: payload.menu,
            icon: payload.icon,
            url: payload.url
        });
    }

    update(payload: SetupMenuModel.UpdateSetupMenu): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/menu`, payload);
    }

    delete(payload: SetupMenuModel.UpdateSetupMenu): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/menu`, {
            ...payload,
            is_active: false,
        });
    }
}
