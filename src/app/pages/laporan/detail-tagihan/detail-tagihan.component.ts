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
import { ProductService } from 'src/app/services/setup-data/product.service';
import { SettingCompanyService } from 'src/app/services/setup-data/setting-company.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-detail-tagihan',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './detail-tagihan.component.html',
    styleUrl: './detail-tagihan.component.scss'
})
export class DetailTagihanComponent implements OnInit, OnDestroy {

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
        id: 'Detail-Tagihan-Per-Periode',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500' },
            { field: 'invoice_date', headerName: 'Periode', },
            { field: 'pelanggan_code', headerName: 'Kode Pelanggan', },
            { field: 'full_name', headerName: 'Pelanggan', },
            { field: 'product_name', headerName: 'Produk', },
            { field: 'total', headerName: 'Subtotal', format: 'currency', class: 'text-end' },
            { field: 'invoice_status', headerName: 'Status', class: 'text-center' },
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
                id: 'id_setting_company',
                placeholder: 'Cari Company Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'company_name',
                    optionValue: 'id_setting_company'
                }
            },
            {
                id: 'id_product',
                placeholder: 'Cari Product Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'product_name',
                    optionValue: 'id_product'
                }
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
        private _productService: ProductService,
        private _settingCompanyService: SettingCompanyService,
    ) { }

    ngOnInit(): void {
        this.getAll({ date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD') });
        this.getAllMitra();
        this.getAllProdut();
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
            .getDetailTagihan(queries)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'MMMM yyyy')
                        }
                    });
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

    private getAllProdut() {
        this._productService
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
