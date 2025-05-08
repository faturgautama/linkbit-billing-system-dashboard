import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getLogActivity(): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/log-activity/activity`);
    }

    getLogMessage(): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/log-activity/message`);
    }

    resentMessage(id_invoice: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/log-activity/resent-message/${id_invoice}`, null);
    }
}
