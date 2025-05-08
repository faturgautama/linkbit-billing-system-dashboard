import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
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
    selector: 'app-tagihan-kso-mitra',
    standalone: true,
    imports: [
        FormsModule,
        DialogModule,
        CommonModule,
        GridComponent,
        ButtonModule,
        DashboardComponent,
    ],
    templateUrl: './tagihan-kso-mitra.component.html',
    styleUrl: './tagihan-kso-mitra.component.scss'
})
export class TagihanKsoMitraComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Rekap-Tagihan-Per-Periode',
        column: [
            { field: 'no_tagihan_kso', headerName: 'No. Tagihan KSO', class: 'font-semibold text-sky-500' },
            { field: 'periode', headerName: 'Periode', },
            { field: 'company_name', headerName: 'Nama Mitra', },
            { field: 'company_address', headerName: 'Alamat Mitra', },
            { field: 'total_tagihan', headerName: 'Total Tagihan', format: 'currency', class: 'text-end' },
            { field: 'status_bayar', headerName: 'Status Tagihan', class: 'text-center' },
        ],
        dataSource: [],
        toolbar: ['Detail'],
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
        ],
    };
    GridSelectedData: any;
    GridSelectedQuery: any;

    ShowDetail = false;

    constructor(
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _settingCompanyService: SettingCompanyService,
    ) { }

    ngOnInit(): void {
        this.getAll({ date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD') });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: LaporanModel.IQueryParamLaporanTagihan) {
        this.GridSelectedQuery = { date: this._utilityService.onFormatDate(new Date(query.date), 'yyyy-MM-DD') }

        this._laporanService
            .getTagihanKsoMitra(this.GridSelectedQuery.date)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    };

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            console.log("args =>", args.data);
            this.GridSelectedData = args.data;
            this.ShowDetail = true;
        }
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }


    handleChangeStatus(data: any) {
        this._laporanService
            .updateTagihanKsoMitra(data.id_tagihan_kso)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Status Tagihan Berhasil Diperbarui' });
                    this.ShowDetail = false;
                    this.GridSelectedData = null;
                    this.getAll(this.GridSelectedQuery);
                }
            });
    };

}
