import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BerandaService {

    constructor(
        private _httpRequestService: HttpRequestService,
    ) { }

    getCount(): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/dashboard/count`);
    }

    getLatestPayment(): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/dashboard/latest-payment`);
    }

    getPaymentWeekly(start_date: string, end_date: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/dashboard/payment-weekly/${start_date}/${end_date}`);
    }

    getPaymentMonthly(date: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/dashboard/payment-monthly/${date}`);
    }

    getPaymentYearly(year: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/dashboard/payment-yearly/${year}`);
    }
}
