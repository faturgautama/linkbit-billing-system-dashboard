import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModel } from 'src/app/model/components/grid.model';
import { HttpRequestService } from 'src/app/services/http/http-request.service';
import { GridComponent } from '../../grid/grid.component';
import { FilterModel } from 'src/app/model/components/filter.model';
import { LookupModel } from 'src/app/model/components/lookup.model';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-lookup-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        DialogModule,
        GridComponent,
        RadioButtonModule,
    ],
    templateUrl: './lookup-dialog.component.html',
    styleUrls: ['./lookup-dialog.component.scss']
})
export class LookupDialogComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    @Input('props') props!: LookupModel.ILookup;

    ShowDialog: boolean = false;

    FormLookup: FormGroup;

    @ViewChild('Grid') Grid!: GridComponent;

    GridProps: GridModel.IGrid;

    @Output('onSelectData') onSelectData = new EventEmitter<any>();

    constructor(
        private _formBuilder: FormBuilder,
        private _httpRequestService: HttpRequestService,
    ) {
        this.FormLookup = this._formBuilder.group({
            filter: ['', []],
            search: ['', []],
        });

        this.GridProps = {
            id: '',
            column: [],
            dataSource: [],
            height: 'calc(100vh - 19rem)',
            showPaging: true,
        };
    }

    ngOnInit(): void {
        this.GridProps.column = this.props.columns;
    }

    handleToggleDialog(): void {
        this.ShowDialog = !this.ShowDialog;
        setTimeout(() => {
            this.FormLookup.get('filter')?.setValue(this.props.filter[this.props.filter.length - 1].value);
            (<HTMLInputElement>document.getElementById('lookupSearchText')).focus();
        }, 1000);
    }

    handleEnterInputSearch(value: string): void {
        let payload: FilterModel.IDynamicFilter[] = [];

        const savedFilterIndex = this.props.filter.findIndex((item: any) => { return item.value == this.filter.value });

        if (savedFilterIndex > -1) {
            payload.push({
                filter: this.props.filter[savedFilterIndex].type,
                columnName: this.props.filter[savedFilterIndex].value,
                searchText: value,
                searchText2: "",
            });
        }

        this._httpRequestService
            .postRequest(this.props.url, payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.GridProps.dataSource = result.data;
            });
    }

    handleSelectData(args: any): void {
        this.onSelectData.emit(args);

        this.ShowDialog = false;

        const lookupInputResult = document.getElementById(this.props.id + 'InputResult') as HTMLInputElement;
        lookupInputResult.value = args[this.props.selectedField];
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    get filter(): AbstractControl { return this.FormLookup.get('filter') as AbstractControl }
    get search(): AbstractControl { return this.FormLookup.get('search') as AbstractControl }

}
