import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PaymentModel } from 'src/app/model/pages/payment/payment.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(
        private _utilityService: UtilityService,
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: PaymentModel.IPaymentQueryParams): Observable<PaymentModel.GetAllPayment> {
        if (query?.invoice_date) {
            query.invoice_date = this._utilityService.onFormatDate(new Date(query.invoice_date), 'yyyy-MM-DD');
        };

        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment`, query);
    }

    getById(id_payment: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/retrieve/${id_payment}`);
    }

    getCheckoutUrl(id_invoice: number): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/get-checkout-url/${id_invoice}`);
    }

    getFromToken(token: string): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/get-from-token/${token}`);
    }

    getAllPaymentMethod(token: string): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/get-all-payment-method/${token}`);
    }

    create(payload: PaymentModel.CreatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/payment/create-payment`, payload);
    }

    update(payload: PaymentModel.UpdatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment/edit-payment`, payload);
    }

    updatePaymentCash(payload: PaymentModel.UpdatePaymentCash): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment/edit-payment-cash`, payload);
    }

    sendMessage(id_payment: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/send-message/${id_payment}`);
    }

    createPaymentCash(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/payment/create-payment-cash`, payload);
    }

    cancel(id_payment: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment/cancel/${id_payment}`, null);
    }
}
