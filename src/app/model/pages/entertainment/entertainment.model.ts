import { HttpBaseResponse } from "../../http/http-request.model"

export namespace EntertainmentModel {
    export interface IEntertainment {
        id_app: string
        title_app: string
        icon_app: string
        package_name_app: string
        is_active: boolean
    }

    export class GetAllEntertainment implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: IEntertainment[]
    }

    export class GetByIdEntertainment implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: IEntertainment
    }

    export interface CreateEntertainment {
        title_app: string
        icon_app: string
        package_name_app: string
        is_active: boolean
    }

    export interface UpdateEntertainment {
        id_app: string
        title_app: string
        icon_app: string
        package_name_app: string
        is_active: boolean
    }
}