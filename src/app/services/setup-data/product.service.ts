import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { ProductModel } from 'src/app/model/pages/setup-data/product.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: ProductModel.IProductQueryParams): Observable<ProductModel.GetAllProduct> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/product`, query);
    }

    getById(id_product: number): Observable<ProductModel.GetAllProduct> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/product/retrieve/${id_product}`);
    }

    create(payload: ProductModel.CreateProduct): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/product`, payload);
    }

    update(payload: ProductModel.UpdateProduct): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/product`, payload);
    }

    delete(payload: ProductModel.UpdateProduct): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/product`, {
            ...payload,
            is_active: false,
        });
    }
}
