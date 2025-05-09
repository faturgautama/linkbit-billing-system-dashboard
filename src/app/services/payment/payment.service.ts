import { Injectable } from '@angular/core';
import { map, Observable, takeUntil } from 'rxjs';
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

    getById(id_payment: number): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/retrieve/${id_payment}`);
    }

    getCheckoutUrl(id_invoice: number): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/get-checkout-url/${id_invoice}`);
    }

    getFromToken(token: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/get-from-token/${token}`);
    }

    getAllPaymentMethod(token: string): Observable<any> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/payment/get-all-payment-method/${token}`)
            .pipe(
                map((result: any) => {
                    let payment_category = [
                        {
                            id: 'Virtual Account',
                            icon: 'pi pi-building-columns',
                            category: 'Virtual Account',
                            detail: [],
                            thumbnail: []  // ✅ store per-category thumbnails
                        },
                        {
                            id: 'QRIS',
                            icon: 'pi pi-qrcode',
                            category: 'QRIS',
                            detail: [],
                            thumbnail: []  // ✅ store per-category thumbnails
                        },
                    ];

                    result.data.forEach((item: any) => {
                        let categoryIndex: number = -1;

                        switch (item.payment_method_type) {
                            case 'Virtual Account':
                                categoryIndex = 0;
                                break;
                            case 'QRIS':
                                categoryIndex = 1;
                                break;
                            default:
                                categoryIndex = -1;
                        }

                        if (categoryIndex >= 0) {
                            let currentCategory: any = payment_category[categoryIndex];

                            // Only push up to 3 thumbnails for each category
                            if (currentCategory.thumbnail.length < 2) {
                                currentCategory.thumbnail.push(item.image);
                            }

                            currentCategory.detail.push({ ...item });
                        }
                    });

                    return {
                        data: result.data,
                        accordion: payment_category.filter((item) => item.detail.length)
                    };
                })
            );
    }


    create(payload: PaymentModel.CreatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/payment/create-payment`, payload);
    }

    update(payload: PaymentModel.UpdatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment/edit-payment`, payload);
    }

    changePaymentMethod(token: string): Observable<PaymentModel.GetAllPayment> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/change-payment-method/${token}`);
    }
}
