import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-wildcard-not-found',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule
    ],
    templateUrl: './wildcard-not-found.component.html',
    styleUrls: ['./wildcard-not-found.component.scss']
})
export class WildcardNotFoundComponent {

    constructor(
        private _router: Router,
    ) { }

    backToBeranda() {
        this._router.navigateByUrl("/beranda");
    }
}
