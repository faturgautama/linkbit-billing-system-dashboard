import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BerandaService {

    constructor(
        private _httpRequestService: HttpRequestService,
    ) { }

}
