import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { LaporanModel } from 'src/app/model/pages/laporan/laporan.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { LaporanService } from 'src/app/services/laporan/laporan.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-rekap-tagihan',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './rekap-tagihan.component.html',
    styleUrl: './rekap-tagihan.component.scss'
})
export class RekapTagihanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Rekap-Tagihan-Per-Periode',
        column: [
            { field: 'date', headerName: 'Tanggal Invoice', format: 'date', class: 'font-semibold text-sky-500' },
            { field: 'total', headerName: 'Grand Total', format: 'currency' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'date',
                placeholder: 'Cari Periode Disini',
                type: 'monthpicker',
            },
            {
                id: 'invoice_status',
                placeholder: 'Cari Status Tagihan Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [
                        { name: 'PENDING', value: 'PENDING' },
                        { name: 'EXPIRED', value: 'EXPIRED' },
                        { name: 'CANCEL', value: 'CANCEL' },
                        { name: 'PAID', value: 'PAID' },
                    ],
                    optionName: 'name',
                    optionValue: 'value'
                }
            },
        ],
    };
    GridSelectedData: any;

    constructor(
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _settingCompanyService: SettingCompanyService,
    ) { }

    ngOnInit(): void {
        this.getAll({ date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD') });
        this.getAllMitra();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: LaporanModel.IQueryParamLaporanTagihan) {
        const queries = {
            ...query,
            date: this._utilityService.onFormatDate(new Date(query.date), 'yyyy-MM-DD'),
        }

        this._laporanService
            .getRekapTagihan(queries)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    };

    private getAllMitra() {
        this._settingCompanyService
            .getAllActive({ is_active: true })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.customSearchProps![1].dropdownProps!.options = result.data;
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }
}
