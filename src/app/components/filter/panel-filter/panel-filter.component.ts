import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Subject } from 'rxjs';
import { PanelFilterModel } from 'src/app/model/components/filter.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { DynamicFormComponent } from '../../form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-panel-filter',
    standalone: true,
    imports: [
        TagModule,
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        OverlayPanelModule,
        ReactiveFormsModule,
        DynamicFormComponent,
    ],
    templateUrl: './panel-filter.component.html',
    styleUrl: './panel-filter.component.scss'
})
export class PanelFilterComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    ShowDialogFilter = false;

    @Input('props') props!: PanelFilterModel.FilterDatasource[];

    @Input('formClass') formClass: string = "grid-rows-1 grid-cols-1"

    @Output('onFilter') onFilter = new EventEmitter<any>

    @ViewChild('FormComps') FormComps!: DynamicFormComponent;
    FormProps: FormModel.IForm;

    SavedFilter: any[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _utilityService: UtilityService,
    ) {
        this.FormProps = {
            id: 'form_advanced_filter',
            fields: [],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    };

    ngOnInit(): void {
        this.onPanelReady(this.props);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {

        }, 1);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private onPanelReady(props: PanelFilterModel.FilterDatasource[]) {
        this.FormProps.class = this.formClass;

        for (const item of props) {

            let fields: any = {
                id: item.id,
                label: item.label,
                required: false,
                type: '',
                value: item.value,
            };

            switch (item.type) {
                case PanelFilterModel.TypeFilter.DATE:
                    fields.type = 'date';
                    break;
                case PanelFilterModel.TypeFilter.SELECT:
                    fields.type = 'select';
                    fields.dropdownProps = item.select_props;
                    break;
                case PanelFilterModel.TypeFilter.TEXT:
                    fields.type = 'text';
                    break;
                case PanelFilterModel.TypeFilter.MONTHPICKER:
                    fields.type = 'monthpicker'
                    break;
                case PanelFilterModel.TypeFilter.NUMBER:
                    fields.type = 'number'
                    break;
                default:
                    break;
            };

            this.FormProps.fields.push(fields);
        };
    }

    private onGeneratedFormattedValue(args: any) {
        let formatted_value = "";

        switch (args.type) {
            case 'calendar':
            case 'monthpicker':
                formatted_value = this._utilityService.onFormatDate(new Date(args.value), 'yyyy-MM-DD');
                break;
            case 'dropdown':
                let data = args.select_props.options.find((item: any) => { return item[args.select_props.optionValue] == args.value });
                formatted_value = data[args.select_props.optionName];
                break;
            case 'text':
            case 'number':
                formatted_value = args.value;
                break;
            default:
                break;
        };

        return formatted_value;
    }

    private onGenerateSavedFilter(args: any) {
        for (const key in args) {
            let prop = this.props.find(item => item.id == key);
            const checkFilterExist = this.SavedFilter.findIndex(item => item.id == prop!.id);
            const value = args[key];

            if (
                value !== null &&
                value !== undefined &&
                value !== '' &&
                (typeof value !== 'number' || value > 0)
            ) {
                prop!.value = args[key];

                if (checkFilterExist > -1) {
                    this.SavedFilter[checkFilterExist].formatted_value = this.onGeneratedFormattedValue(prop);
                } else {
                    this.SavedFilter.push({
                        id: prop?.id,
                        label: prop?.label,
                        formatted_value: this.onGeneratedFormattedValue(prop)
                    })
                }
            } else {
                if (checkFilterExist > -1) {
                    this.SavedFilter.splice(checkFilterExist, 1);
                }
            }
        };

        return this.SavedFilter;
    }

    handleSearch(search: any) {
        this.ShowDialogFilter = false;
        const savedFilter = this.onGenerateSavedFilter(search);
        const filter = savedFilter.reduce((acc: any, item: any) => {
            acc[item.id] = item.formatted_value;
            return acc;
        }, {});

        this.onFilter.emit(filter);
    }

    handleDeleteSavedFilter(args: any) {
        this.FormComps.FormGroup.get(args.id)?.setValue(null);
        this.handleSearch(this.FormComps.FormGroup.value);
    }
}
