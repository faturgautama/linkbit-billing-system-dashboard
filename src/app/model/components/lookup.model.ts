import { ColDef } from "ag-grid-community";
import { FilterModel } from "./filter.model";
import { GridModel } from "./grid.model";

export namespace LookupModel {
    export interface ILookup {
        id: string;
        label: string;
        url: string;
        title: string;
        columns: GridModel.IGridColumn[];
        filter: FilterModel.IOffcanvasFilterDatasource[];
        selectedField: string;
        selectedValue?: string;
        callback?: (data: any) => void;
        showLabel?: boolean;
    }
}