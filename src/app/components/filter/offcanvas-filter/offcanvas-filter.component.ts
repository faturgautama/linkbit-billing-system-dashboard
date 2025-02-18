import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterModel } from 'src/app/model/components/filter.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-offcanvas-filter',
    standalone: true,
    imports: [
        CommonModule,
        SidebarModule,
        ButtonModule,
        ChipModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './offcanvas-filter.component.html',
    styleUrls: ['./offcanvas-filter.component.scss']
})
export class OffcanvasFilterComponent {

    ButtonProps = { id: 'open', caption: 'Pencarian', icon: 'pi pi-search', severity: 'info', class: '' }

    OpenOffcanvas: boolean = false;

    @Input('props') props: FilterModel.IOffcanvasFilter;

    FormSearch: FormGroup;

    ButtonAddProps = { id: 'add', caption: 'Add', icon: '', severity: 'info', class: '' }

    SavedFilter: FilterModel.IOffcanvasSavedFilter[] = [];

    ButtonSearchProps = { id: 'search', caption: 'Search', icon: 'pi pi-search', severity: 'info', class: '' }

    ChipsDatasource: any[] = [];

    @Output('onSearch') onSearch = new EventEmitter<any[]>([] as any);

    constructor(
        private _formBuilder: FormBuilder,
        private _utilityService: UtilityService,
    ) {
        this.props = {
            filter: [
                { id: 'test', title: 'test', type: 'string', value: 'ms.test' },
                { id: 'test2', title: 'test2', type: 'date', value: 'ms.test2' },
            ],
            url: ''
        };

        this.FormSearch = this._formBuilder.group({
            id: [''],
            title: [''],
            type: [''],
            columnName: [''],
            kataKunci: [''],
            kataKunci2: [''],
        });
    }

    handleToggleOffcanvas(state: boolean): void {
        this.OpenOffcanvas = !state;
    }

    handleChangeFilterBy(args: any): void {
        this.id.setValue(args.value.id + "_" + (this.SavedFilter.length + 1));
        this.title.setValue(args.value.title);
        this.type.setValue(args.value.type == 'string' ? 'like' : 'between');
        this.columnName.setValue(args.value.value);
    }

    handleAddSearch(data: FilterModel.IOffcanvasSavedFilter): void {
        if (data.type == 'between') {
            const kataKunci1 = this.kataKunci.value[0];
            const kataKunci2 = this.kataKunci.value[1];

            data.kataKunci = formatDate(kataKunci1, 'dd-MM-yyyy', 'EN');
            data.kataKunci2 = formatDate(kataKunci2, 'dd-MM-yyyy', 'EN');
        }

        this.SavedFilter.push(data);

        this.FormSearch.reset();
    }

    handleDeleteFilter(index: number): void {
        this.SavedFilter = this.SavedFilter.filter((data: any, i) => {
            if (i != index) {
                return data;
            }
        });
    }

    handleSearchData(changeChip: boolean): void {
        this.ChipsDatasource = [];

        const payload = this.SavedFilter.map((item) => {
            if (changeChip) {
                const chip = `${item.title} = ${item.type == 'between' ? item.kataKunci + " - " + item.kataKunci2 : item.kataKunci}`

                this.ChipsDatasource.push({
                    id: item.id,
                    label: chip,
                })
            }

            return {
                filter: item.type == 'like' ? 'contain' : 'between',
                columnName: item.columnName,
                searchText: item.kataKunci,
                searchText2: item.kataKunci2,
            }
        });

        this.onSearch.emit(payload);

        this.OpenOffcanvas = false;
    }

    handleRemoveChips(args: any): void {
        const index = this.SavedFilter.findIndex((item) => { return item.id == args.id });

        this.handleDeleteFilter(index);

        this.handleSearchData(false);
    }

    get id(): AbstractControl { return this.FormSearch.get('id') as AbstractControl }
    get title(): AbstractControl { return this.FormSearch.get('title') as AbstractControl }
    get type(): AbstractControl { return this.FormSearch.get('type') as AbstractControl }
    get columnName(): AbstractControl { return this.FormSearch.get('columnName') as AbstractControl }
    get kataKunci(): AbstractControl { return this.FormSearch.get('kataKunci') as AbstractControl }
    get kataKunci2(): AbstractControl { return this.FormSearch.get('kataKunci2') as AbstractControl }

}
