import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { GridModel } from 'src/app/model/components/grid.model';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { TableModule } from 'primeng/table'
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-grid',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        OverlayPanelModule,
        AvatarModule,
        InputNumberModule,
        DropdownModule,
        CalendarModule,
        PaginatorModule
    ],
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit {

    @Input('props') props!: GridModel.IGrid;

    @Output('cellClicked') cellClicked = new EventEmitter<any>();

    @Output('rowDoubleClicked') rowDoubleClicked = new EventEmitter<any>();

    @Output('aksiClicked') aksiClicked = new EventEmitter<any>();

    @Output('additionalButtonClicked') additionalButtonClicked = new EventEmitter<GridModel.IAdditionalButtonGrid>();

    @Output('customSearchClicked') customSearchClicked = new EventEmitter<any>();

    defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        resizable: true
    };

    gridApi!: GridApi;

    gridColumnApi!: ColumnApi;

    gridToolbar: GridModel.IGridToolbar[] = [];

    gridDatasource: any[] = [];

    SelectedRow: any;

    CustomSearchForm: FormGroup;

    CustomSearchLength$ = new BehaviorSubject<number>(1);

    constructor(
        private _formBuilder: FormBuilder,
    ) {
        this.CustomSearchForm = this._formBuilder.group({});
    };

    ngOnInit(): void {
        if (this.props.customSearchProps?.length) {
            this.props.customSearchProps.forEach((item) => {
                this.CustomSearchForm.addControl(item.id, new FormControl(null, []));
            });
        }
    }

    ngAfterViewInit(): void {
        this.onGridReady();
    }

    onGridReady(): void {
        const column = this.props.column.map((item) => {
            return {
                id: item.field,
                renderAsCheckbox: item.renderAsCheckbox ? item.renderAsCheckbox : false,
                ...item
            }
        });

        this.props.column = column as any;

        if (this.props.toolbar?.length) {
            this.props.toolbar.forEach((item) => {
                let icon = "";

                switch (item) {
                    case 'Add':
                        icon = 'pi pi-plus';
                        break;
                    case 'Edit':
                        icon = 'pi pi-file-edit';
                        break;
                    case 'Delete':
                        icon = 'pi pi-trash';
                        break;
                    case 'Change Status':
                        icon = 'pi pi-sync';
                        break;
                    case 'Detail':
                        icon = 'pi pi-info-circle';
                        break;
                    case 'Produk Layanan':
                        icon = 'pi pi-user-edit';
                        break;
                    case 'Kirim Pesan Tagihan':
                        icon = 'pi pi-whatsapp';
                        break;
                    case 'Kirim Pesan Lunas':
                        icon = 'pi pi-send';
                        break;
                    case 'Payment':
                        icon = 'pi pi-credit-card';
                        break;
                    default:
                        break;
                }

                this.gridToolbar.push({
                    id: item.toLowerCase(),
                    title: item,
                    icon: icon
                });
            });
        };

        setTimeout(() => {
            this.gridDatasource = [...this.props.dataSource];
        }, 1000);

    }

    onCellClicked(args: any): void {
        this.cellClicked.emit(args);
    }

    onRowDoubleClicked(args: any): void {
        this.rowDoubleClicked.emit(args);
    }

    onToolbarClicked(args: GridModel.IGridToolbar): void {
        // if (args.id == 'excel') {
        //     this.handleExportExcel();
        // } else {
        //    this.toolbarClicked.emit(args);
        // }
    }

    onClickAdditionalButton(args: GridModel.IAdditionalButtonGrid) {
        this.additionalButtonClicked.emit(args);
    }

    onSearchKeyword(search: string) {
        if (!this.props.searchKeyword) {
            console.warn("searchKeyword is undefined.");
            return;
        }

        // Preserve the original data source
        const originalDataSource = [...this.gridDatasource];

        if (search.length) {
            this.props.dataSource = originalDataSource.filter((item: any) => {
                const value = item[this.props.searchKeyword!];
                return value ? value.toString().toLowerCase().includes(search.toLowerCase()) : false;
            });
        } else {
            this.props.dataSource = originalDataSource;
        }
    }


    onAksiClicked(type: string, data: any) {
        this.aksiClicked.emit({ type: type, data: data });
    }

    handleFormatStringToNumber(data: string): number {
        return parseFloat(data);
    }

    handleRenderIconBoolean(value: boolean): string {
        return value ? `<i class="pi pi-check text-emerald-600 font-medium" style="font-size: 12px">` : `<i class="pi pi-times text-red-600 font-medium" style="font-size: 12px">`;
    }

    handleRenderStatusOrderManagement(value: 'ORDER' | 'DIPROSES' | 'DIANTAR' | 'DITERIMA' | 'AVAILABLE' | 'SOLD_OUT') {
        let pillClass = 'px-2 py-1 bg-blue-200 text-blue-700', text = 'ORDER PLACED';

        if (value == 'ORDER') {
            text = 'ORDER PLACED';
            pillClass = 'px-2 py-1 bg-blue-200 text-blue-700';
        };

        if (value == 'DIPROSES') {
            text = 'ON PROCESS';
            pillClass = 'px-2 py-1 bg-yellow-200 text-yellow-700';
        };

        if (value == 'DIANTAR') {
            text = 'ON DELIVERY';
            pillClass = 'px-2 py-1 bg-rose-200 text-rose-700';
        };

        if (value == 'DITERIMA') {
            text = 'DELIVERED';
            pillClass = 'px-2 py-1 bg-emerald-200 text-emerald-700';
        };

        if (value == 'AVAILABLE') {
            text = 'Available';
            pillClass = 'px-2 py-1 bg-emerald-200 text-emerald-700 text-xs';
        };

        if (value == 'SOLD_OUT') {
            text = 'Sold Out';
            pillClass = 'px-2 py-1 bg-rose-200 text-rose-700 text-xs';
        };

        return [pillClass, text];
    }

    onClickCustomSearch() {
        const value = this.CustomSearchForm.value;

        const filteredObj = Object.fromEntries(
            Object.entries(value).filter(([key, value]) => value !== null)
        );

        this.customSearchClicked.emit(filteredObj);
    }

    onExportExcel(): void {
        import('xlsx').then((xslx) => {
            let colSize: number[] = [];

            const data = this.props.dataSource.map((item) => {
                let object: any = {};

                for (const col of this.props.column) {
                    let header = "", value = "";

                    header = col.headerName;

                    if (col.format) {
                        if (col.format == 'date') {
                            value = formatDate(item[col.field], 'dd-MM-yyyy', 'EN');
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
            this.saveAsExcelFile(excelBuffer, this.props.id);
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
