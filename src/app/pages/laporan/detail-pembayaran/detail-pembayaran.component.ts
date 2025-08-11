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
import { GroupPelangganService } from 'src/app/services/setup-data/group-pelanggan.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-detail-pembayaran',
  standalone: true,
  imports: [CommonModule, GridComponent, DashboardComponent],
  templateUrl: './detail-pembayaran.component.html',
  styleUrl: './detail-pembayaran.component.scss',
})
export class DetailPembayaranComponent implements OnInit, OnDestroy {
  Destroy$ = new Subject();

  PageState: 'list' | 'form' = 'list';

  SettingCompany!: SettingCompanyModel.ISettingCompany;

  ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

  GridProps: GridModel.IGrid = {
    id: 'Rekap-Pembayaran-Per-Periode',
    column: [
      {
        field: 'invoice_number',
        headerName: 'No. Tagihan',
        class: 'font-semibold text-sky-500 text-xs',
      },
      { field: 'invoice_date', headerName: 'Periode', class: 'text-xs' },
      { field: 'pelanggan_code', headerName: 'Kode Plgn', class: 'text-xs' },
      { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs' },
      { field: 'alamat', headerName: 'Alamat', class: 'text-xs' },
      { field: 'product_name', headerName: 'Produk', class: 'text-xs' },
      {
        field: 'payment_date',
        headerName: 'Tgl. Bayar',
        format: 'date',
        class: 'text-xs',
      },
      { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-xs' },
      {
        field: 'payment_amount',
        headerName: 'Total Bayar',
        format: 'currency',
        class: 'text-end text-xs',
      },
      {
        field: 'payment_status',
        headerName: 'Status',
        class: 'text-center text-xs',
      },
    ],
    dataSource: [],
    height: 'calc(100vh - 14.5rem)',
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
        id: 'id_group_pelanggan',
        placeholder: 'Cari Group Disini',
        type: 'dropdown',
        dropdownProps: {
          options: [],
          optionName: 'group_pelanggan',
          optionValue: 'id_group_pelanggan',
        },
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
          optionValue: 'value',
        },
      },
    ],
  };
  GridSelectedData: any;

  constructor(
    private _laporanService: LaporanService,
    private _utilityService: UtilityService,
    private _groupPelangganService: GroupPelangganService,
    private _settingCompanyService: SettingCompanyService
  ) {}

  ngOnInit(): void {
    this.getAll({
      date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD'),
    });
    this.getAllGroupPelanggan();
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  private getAll(query: LaporanModel.IQueryParamLaporanTagihan) {
    const queries = {
      ...query,
      date: this._utilityService.onFormatDate(
        new Date(query.date),
        'yyyy-MM-DD'
      ),
    };

    this._laporanService
      .getDetailPembayaran(queries)
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        if (result) {
          this.GridProps.dataSource = result.data.map((item: any) => {
            return {
              ...item,
              invoice_date: this._utilityService.onFormatDate(
                new Date(item.invoice_date),
                'MMMM yyyy'
              ),
            };
          });
        }
      });
  }

  private getAllGroupPelanggan() {
    this._groupPelangganService
      .getAll()
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        if (result) {
          this.GridProps.customSearchProps![1].dropdownProps!.options =
            result.data;
        }
      });
  }

  onSearchGrid(args: any) {
    this.getAll(args);
  }
}
