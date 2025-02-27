import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PelangganModel } from 'src/app/model/pages/pelanggan/pelanggan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PelangganService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: PelangganModel.IPelangganQueryParams): Observable<PelangganModel.GetAllPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/pelanggan`, query);
    }

    getById(id_pelanggan: number): Observable<PelangganModel.GetAllPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/pelanggan/retrieve/${id_pelanggan}`);
    }

    create(payload: PelangganModel.CreatePelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/pelanggan`, payload);
    }

    update(payload: PelangganModel.UpdatePelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/pelanggan`, payload);
    }

    delete(payload: PelangganModel.UpdatePelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/pelanggan`, {
            ...payload,
            is_active: false,
        });
    }

    updateProductPelanggan(payload: PelangganModel.UpdateProductPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/pelanggan/update-product-pelanggan`, payload);
    }
}
