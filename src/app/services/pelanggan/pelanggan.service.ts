import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PelangganModel } from 'src/app/model/pages/pelanggan/pelanggan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PelangganService {

    Pelanggan$ = new BehaviorSubject<PelangganModel.IPelanggan[]>([]);

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: PelangganModel.IPelangganQueryParams, refresh_state?: boolean): Observable<PelangganModel.GetAllPelanggan> {
        if (this.Pelanggan$.value && !refresh_state) {
            return of({
                status: true,
                message: 'OK',
                data: this.Pelanggan$.value
            })
        };

        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/pelanggan`, query)
            .pipe(
                tap((result) => {
                    if (result.data) {
                        if (refresh_state) {
                            this.Pelanggan$.next(result.data);
                        }
                    }
                })
            )
    }

    getAllInactive(id_setting_company: number): Observable<PelangganModel.GetAllPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/pelanggan`, { id_setting_company: id_setting_company, is_active: false });
    }

    getAllNotHaveProduct(id_setting_company: number): Observable<PelangganModel.GetAllPelanggan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/pelanggan/not-have-product`, { id_setting_company: id_setting_company });
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
            is_active: !payload.is_active,
        });
    }

    updateProductPelanggan(payload: PelangganModel.UpdateProductPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/pelanggan/update-product-pelanggan`, payload);
    }

    updateManyProductPelanggan(payload: PelangganModel.UpdateProductPelanggan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/pelanggan/update-many-product-pelanggan`, payload);
    }

    getFileTemplate() {
        this._httpRequestService.getFileRequest(`${environment.webApiUrl}/pelanggan/template-import`);
    }

    import(payload: any): Observable<PelangganModel.GetAllPelanggan> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/pelanggan/import`, payload, false, true);
    }
}
