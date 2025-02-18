import { HttpBaseResponse } from "../../http/http-request.model"

export namespace DiningModel {
    export interface IDining {
        id_resto: string
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
    }

    export class GetAllDining implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IDining[]
    }

    export class GetByIdDining implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IDining
    }

    export interface CreateDining {
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
    }

    export interface UpdateDining {
        id_resto: string
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
    }
}