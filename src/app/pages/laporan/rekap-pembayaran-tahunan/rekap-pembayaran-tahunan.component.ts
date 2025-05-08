import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
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
import * as FileSaver from 'file-saver';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-rekap-pembayaran-tahunan',
    standalone: true,
    imports: [
        FormsModule,
        TableModule,
        CommonModule,
        ButtonModule,
        GridComponent,
        CalendarModule,
        DashboardComponent,
    ],
    templateUrl: './rekap-pembayaran-tahunan.component.html',
    styleUrl: './rekap-pembayaran-tahunan.component.scss'
})
export class RekapPembayaranTahunanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    Year = new Date();

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Rekap-Pembayaran-Per-Tahun',
        column: [
            { field: 'no', headerName: 'No', width: '50px' },
            { field: 'kode_pelanggan', headerName: 'ID Pelanggan', class: 'font-semibold text-sky-500', width: '100px' },
            { field: 'nama_pelanggan', headerName: 'Pelanggan', width: '200px' },
            { field: 'alamat', headerName: 'Alamat', width: '350px' },
            { field: 'tgl_bayar_1', headerName: 'Tgl. Bayar Jan', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_1', headerName: 'Jml. Bayar Jan', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_2', headerName: 'Tgl. Bayar Feb', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_2', headerName: 'Jml. Bayar Feb', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_3', headerName: 'Tgl. Bayar Mar', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_3', headerName: 'Jml. Bayar Mar', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_4', headerName: 'Tgl. Bayar Apr', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_4', headerName: 'Jml. Bayar Apr', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_5', headerName: 'Tgl. Bayar Mei', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_5', headerName: 'Jml. Bayar Mei', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_6', headerName: 'Tgl. Bayar Jun', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_6', headerName: 'Jml. Bayar Jun', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_7', headerName: 'Tgl. Bayar Jul', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_7', headerName: 'Jml. Bayar Jul', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_8', headerName: 'Tgl. Bayar Ags', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_8', headerName: 'Jml. Bayar Ags', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_9', headerName: 'Tgl. Bayar Sep', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_9', headerName: 'Jml. Bayar Sep', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_10', headerName: 'Tgl. Bayar Okt', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_10', headerName: 'Jml. Bayar Okt', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_11', headerName: 'Tgl. Bayar Nov', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_11', headerName: 'Jml. Bayar Nov', format: 'currency', width: '150px' },
            { field: 'tgl_bayar_12', headerName: 'Tgl. Bayar Des', format: 'date', width: '150px' },
            { field: 'jumlah_bayar_12', headerName: 'Jml. Bayar Des', format: 'currency', width: '150px' },
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
        ],
    };
    GridSelectedData: any;

    constructor(
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _settingCompanyService: SettingCompanyService,
    ) {
        this._utilityService
            .ShowSidebar$
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                const el = document.getElementById("TableRekapPembayaranTahunan");

                if (el) {
                    el.style.width = result
                        ? "calc(100vw - 24rem)"
                        : "calc(100vw - 10rem)";
                }
            })
    }

    ngOnInit(): void {
        this.getAll(new Date().getFullYear().toString());
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(year: string) {
        this._laporanService
            .getRekapPembayaranTahunan(year)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    };

    onSearchGrid(args: any) {
        const year = new Date(args).getFullYear().toString();
        this.getAll(year);
    }

    onExportExcel(): void {
        import('xlsx').then((xslx) => {
            let colSize: number[] = [];

            const data = this.GridProps.dataSource.map((item) => {
                let object: any = {};

                for (const col of this.GridProps.column) {
                    let header = "", value = "";

                    header = col.headerName;

                    if (col.format) {
                        if (col.format == 'date') {
                            value = item[col.field] ? formatDate(item[col.field], 'dd-MM-yyyy', 'EN') : "";
                        } else {
                            value = item[col.field];
                        }
                    } else {
                        value = item[col.field];
                    };

                    object[header] = value;
                }

                colSize.push(15);

                return object;
            });

            const wscols = colSize.map(width => ({ width }));

            const worksheet = xslx.utils.json_to_sheet(data);
            worksheet['!cols'] = wscols;

            const workbook = { Sheets: { data: worksheet, }, SheetNames: ['data'] };
            const excelBuffer: any = xslx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, this.GridProps.id);
        });
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}   
