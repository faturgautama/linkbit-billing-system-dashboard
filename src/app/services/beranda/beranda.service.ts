import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BerandaModel } from 'src/app/model/pages/beranda/beranda.model';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GreetingCardService } from '../greeting-card/greeting-card.service';
import { OurFacilitiesService } from '../for-your-guest/our-facilities.service';
import { EventPromoService } from '../event-promo/event-promo.service';
import { EntertainmentService } from '../entertainment/entertainment.service';

@Injectable({
    providedIn: 'root'
})
export class BerandaService {

    constructor(
        private _eventPromoService: EventPromoService,
        private _httpRequestService: HttpRequestService,
        private _greetingCardService: GreetingCardService,
        private _ourFacilitiesService: OurFacilitiesService,
        private _entertainmentService: EntertainmentService
    ) { }

    getAll(): Observable<any> {
        const eventPromo = this._eventPromoService.getAll().pipe(map(result => result.data.length)),
            greetingCard = this._greetingCardService.getAll().pipe(map(result => result.data.length)),
            ourFacilities = this._ourFacilitiesService.getAll().pipe(map(result => result.data.length)),
            entertainment = this._entertainmentService.getAll().pipe(map(result => result.data.length));

        return forkJoin({
            eventPromo,
            greetingCard,
            ourFacilities,
            entertainment
        });
    }
}
