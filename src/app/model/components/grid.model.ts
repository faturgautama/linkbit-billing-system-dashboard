import { FormModel } from "./form.model";

export namespace GridModel {
    export interface IGridToolbar {
        id: string;
        title: string;
        icon: string;
    }

    export interface IGridColumn {
        field: string;
        headerName: string;
        format?: 'date' | 'number' | 'currency' | 'image' | 'html' | 'icon_boolean' | 'monthpicker';
        class?: string;
        renderAsCheckbox?: boolean;
        renderAsPills?: boolean;
        pillClass?: string;
        width?: string;
    }

    export interface IGridCustomSearch {
        id: string;
        placeholder: string;
        type: 'text' | 'dropdown' | 'date' | 'number' | 'monthpicker';
        dropdownProps?: FormModel.DropdownProps;
    }

    export interface IAdditionalButtonGrid {
        id: string;
        label: string;
        severity: 'danger' | 'warning' | 'success' | 'info' | 'secondary';
    }

    export interface IGrid {
        id: string;
        column: IGridColumn[];
        dataSource: any[];
        height: string;
        showPaging: boolean;
        showSearch?: boolean;
        isCustomSearch?: boolean;
        customSearchProps?: IGridCustomSearch[];
        searchKeyword?: string;
        searchPlaceholder?: string;
        showSort?: boolean;
        toolbar?: string[];
        additionalButtons?: IAdditionalButtonGrid[];
    }
}