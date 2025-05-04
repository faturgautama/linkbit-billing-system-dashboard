import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LoggingService } from 'src/app/services/management-user/logging.service';

@Component({
    selector: 'app-log-activity',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
    ],
    templateUrl: './log-activity.component.html',
    styleUrl: './log-activity.component.scss'
})
export class LogActivityComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'full_name', headerName: 'Nama User', },
            { field: 'endpoint', headerName: 'Endpoint', },
            { field: 'method', headerName: 'Method', },
            { field: 'request_body', headerName: 'Request Body', format: 'json' },
            { field: 'create_at', headerName: 'Waktu Entry', format: 'date' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'full_name',
        searchPlaceholder: 'Find Nama User Here',
    };
    GridSelectedData: any;

    constructor(
        private _loggingService: LoggingService,
    ) { }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._loggingService
            .getLogActivity()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    }
}
