import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupUserModel {
    export interface ISetupUser {
        id_user: string
        id_role: string
        nama: string
        username: string
        password: string
        is_active: boolean
    }

    export class GetAllSetupUser implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISetupUser[]
    }

    export class GetByIdSetupUser implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISetupUser
    }

    export interface CreateSetupUser {
        id_role: string
        nama: string
        username: string
        password: string
    }

    export interface UpdateSetupUser {
        id_user: string
        id_role: string
        nama: string
        username: string
        password: string
    }
}