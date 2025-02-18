import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, map } from 'rxjs';

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

    Destroy$ = new Subject();

    Title$ =
        this._activatedRoute.data
            .pipe(
                takeUntil(this.Destroy$),
                map(result => result['title'])
            );

    Breadcrumbs$ =
        this._activatedRoute.data
            .pipe(
                takeUntil(this.Destroy$),
                map(result => result['breadcrumbs'])
            );

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) { }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleNavigateToBeranda() {
        this._router.navigateByUrl("/beranda");
    }
}
