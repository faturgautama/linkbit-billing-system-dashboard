import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { EntertainmentModel } from 'src/app/model/pages/entertainment/entertainment.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class EntertainmentService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<EntertainmentModel.GetAllEntertainment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/cms/entertainment`);
    }

    create(payload: EntertainmentModel.CreateEntertainment): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/cms/entertainment`, payload);
    }

    update(payload: EntertainmentModel.UpdateEntertainment): Observable<HttpBaseResponse> {
        const { id_app, ...newObject } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/entertainment/${id_app}`, newObject);
    }

    delete(id_app: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/cms/entertainment/${id_app}`);
    }

    changeStatus(id_app: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/cms/entertainment/updateStatusActive/${id_app}`, null);
    }
}
