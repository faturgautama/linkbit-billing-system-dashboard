import { ColDef } from "ag-grid-community";

export namespace GridModel {
    export interface IGridToolbar {
        id: string;
        title: string;
        icon: string;
    }

    export interface IGridColumn {
        field: string;
        headerName: string;
        format?: 'date' | 'number' | 'currency' | 'image' | 'html' | 'icon_boolean';
        class?: string;
        renderAsCheckbox?: boolean;
        renderAsPills?: boolean;
        pillClass?: string;
    }

    export interface IGrid {
        id: string;
        column: IGridColumn[];
        dataSource: any[];
        height: string;
        showPaging: boolean;
        showSearch?: boolean;
        searchKeyword?: string;
        searchPlaceholder?: string;
        showSort?: boolean;
        toolbar?: string[];
    }
}