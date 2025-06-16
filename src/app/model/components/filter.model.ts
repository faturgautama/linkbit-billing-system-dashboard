import { FormModel } from "./form.model";

export namespace FilterModel {
    export interface IOffcanvasFilterDatasource {
        id: string;
        title: string;
        type: 'string' | 'date' | any;
        value: string;
    }

    export interface IOffcanvasSavedFilter {
        id: string;
        title: string;
        type: 'like' | 'between';
        columnName: string;
        kataKunci: string;
        kataKunci2?: string;
    }

    export interface IOffcanvasFilter {
        filter: IOffcanvasFilterDatasource[];
        url?: string;
    }

    export interface IDynamicFilter {
        filter: 'like' | 'between' | 'equal';
        columnName: string;
        searchText: string;
        searchText2?: string;
    }
}

export namespace PanelFilterModel {
    export enum TypeFilter {
        DATE = 'calendar',
        MONTHPICKER = 'monthpicker',
        TEXT = 'text',
        NUMBER = 'number',
        SELECT = 'dropdown'
    };

    export interface FilterDatasource {
        id: string;
        type: TypeFilter;
        label: string;
        value: string;
        select_props?: FormModel.DropdownProps;
        date_format?: string;
        formatted_value?: string;
    }
};