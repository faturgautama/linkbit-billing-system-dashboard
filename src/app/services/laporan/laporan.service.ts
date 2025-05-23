import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LaporanModel } from 'src/app/model/pages/laporan/laporan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class LaporanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getRekapTagihan(query: LaporanModel.IQueryParamLaporanTagihan): Observable<LaporanModel.GetRekapTagihanBulanan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/rekap-invoice-bulanan`, query);
    }

    getDetailTagihan(query: LaporanModel.IQueryParamLaporanTagihan): Observable<LaporanModel.GetDetailTagihanBulanan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/detail-invoice-bulanan`, query);
    }

    getRekapPembayaran(query: LaporanModel.IQueryParamLaporanPembayaran): Observable<LaporanModel.GetRekapPembayaranBulanan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/rekap-pembayaran-bulanan`, query);
    }

    getDetailPembayaran(query: LaporanModel.IQueryParamLaporanPembayaran): Observable<LaporanModel.GetDetailPembayaranBulanan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/detail-pembayaran-bulanan`, query);
    }

    getRekapPembayaranTahunan(year: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/rekap-pembayaran-tahunan/${year}`);
    }

    getTagihanKsoMitra(periode: Date): Observable<LaporanModel.GetTagihanKsoMitra> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/tagihan-kso-mitra/${periode}`);
    }

    updateTagihanKsoMitra(id_tagihan_kso: any): Observable<LaporanModel.GetTagihanKsoMitra> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/laporan/tagihan-kso-mitra/update-paid/${id_tagihan_kso}`, null);
    }
}
