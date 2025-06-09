import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { ChannelWhatsappModel } from 'src/app/model/pages/setup-data/channel-whatsapp.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelWhatsappService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<ChannelWhatsappModel.GetAllChannelWhatsapp> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/channel-whatsapp`);
    }
}
