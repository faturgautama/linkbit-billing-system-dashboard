import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { EntertainmentService } from '../entertainment/entertainment.service';

@Injectable({
    providedIn: 'root'
})
export class BerandaService {

    constructor(
        private _httpRequestService: HttpRequestService,
        private _entertainmentService: EntertainmentService
    ) { }

}
