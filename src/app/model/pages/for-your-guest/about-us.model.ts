import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AboutUsModel {
    export interface IAboutUs {
        id: string
        image_url: string
        image_name: string
        title: string
        description: string
    }

    export class GetAllAboutUs implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IAboutUs
    }

    export class GetByIdAboutUs implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IAboutUs
    }

    export interface CreateAboutUs {
        image_url: string
        image_name: string
        title: string
        description: string
    }

    export interface UpdateAboutUs {
        id: string
        image_url: string
        image_name: string
        title: string
        description: string
    }
}