import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingCompanyService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: SettingCompanyModel.ISettingCompanyQuery): Observable<SettingCompanyModel.GetAllSettingCompany> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setting-company`, query);
    }

    getAllActive(query?: SettingCompanyModel.ISettingCompanyQuery): Observable<SettingCompanyModel.GetAllSettingCompany> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setting-company`, { ...query, is_active: true });
    }

    getById(id_setting_company: number): Observable<SettingCompanyModel.GetByIdSettingCompany> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setting-company/retrieve/${id_setting_company}`);
    }

    createCabang(payload: SettingCompanyModel.CreateSettingCompany): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setting-company`, { ...payload, is_mitra: false, is_cabang: true });
    }

    createMitra(payload: SettingCompanyModel.CreateSettingCompany): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setting-company`, { ...payload, is_mitra: true, is_cabang: false });
    }

    update(payload: SettingCompanyModel.UpdateSettingCompany): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setting-company`, payload);
    }

    delete(payload: SettingCompanyModel.UpdateSettingCompany): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setting-company`, {
            ...payload,
            is_active: false,
        });
    }

    getAllPaymentMethodManual(id_setting_company: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setting-company/payment-method-manual/${id_setting_company}`);
    }

    createPaymentMethodManual(payload: any): Observable<HttpBaseResponse> {
        const { id_payment_method_manual, is_active, ...data } = payload;
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setting-company/payment-method-manual`, data);
    }

    updatePaymentMethodManual(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setting-company/payment-method-manual`, payload);
    }

    getAllChannelWhatsapp(id_setting_company: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setting-company/channel-whatsapp/${id_setting_company}`);
    }

    createChannelWhatsapp(payload: any): Observable<HttpBaseResponse> {
        const { id_setting_channel_whatsapp, is_active, ...data } = payload;
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setting-company/channel-whatsapp`, data);
    }

    updateChannelWhatsapp(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setting-company/channel-whatsapp`, payload);
    }
}
