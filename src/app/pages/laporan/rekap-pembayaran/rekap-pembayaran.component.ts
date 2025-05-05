import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { LaporanModel } from 'src/app/model/pages/laporan/laporan.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { LaporanService } from 'src/app/services/laporan/laporan.service';
import { GroupPelangganService } from 'src/app/services/setup-data/group-pelanggan.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-rekap-pembayaran',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        GridComponent,
        InputTextModule,
        DashboardComponent,
    ],
    templateUrl: './rekap-pembayaran.component.html',
    styleUrl: './rekap-pembayaran.component.scss'
})
export class RekapPembayaranComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Rekap-Pembayaran-Per-Periode',
        column: [
            { field: 'date', headerName: 'Tgl. Pembayaran', format: 'date', class: 'font-semibold text-sky-500' },
            { field: 'cash', headerName: 'Cash', format: 'currency' },
            { field: 'manual', headerName: 'Chanel Manual', format: 'currency' },
            { field: 'xendit', headerName: 'Payment Gateway', format: 'currency' },
            { field: 'total', headerName: 'Grand Total', format: 'currency' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
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
                id: 'id_group_pelanggan',
                placeholder: 'Cari Group Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'group_pelanggan',
                    optionValue: 'id_group_pelanggan'
                }
            },
            {
                id: 'payment_status',
                placeholder: 'Cari Status Pembayaran Disini',
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

    Footer = {
        grand_total: 0,
        total_payment_gateway: 0,
        total_cash: 0,
        total_manual: 0
    };

    constructor(
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _groupPelangganService: GroupPelangganService,
        private _settingCompanyService: SettingCompanyService,
    ) { }

    ngOnInit(): void {
        this.getAll({ date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD') });
        this.getAllMitra();
        this.getAllGroupPelanggan();
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
            .getRekapPembayaran(queries)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                    this.Footer = result['sum'];
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

    private getAllGroupPelanggan() {
        this._groupPelangganService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.customSearchProps![2].dropdownProps!.options = result.data;
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }
}
