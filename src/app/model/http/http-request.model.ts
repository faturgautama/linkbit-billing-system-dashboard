export class HttpBaseResponse {
    responseResult!: boolean;
    statusCode!: number;
    message!: string;
    data: any;
}

export interface PostRequestByDynamicFiterModel {
    columnName: string;
    filter: string;
    searchText: string;
    searchText2: string;
    withOr: boolean;
}