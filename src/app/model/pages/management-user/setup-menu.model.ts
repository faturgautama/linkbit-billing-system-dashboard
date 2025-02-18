import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupMenuModel {
    export interface ISetupMenu {
        id_menu: string
        menu: string
    }

    export class GetAllSetupMenu implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISetupMenu[]
    }

    export class GetByIdSetupMenu implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISetupMenu
    }

    export interface CreateSetupMenu {
        menu: string
    }

    export interface UpdateSetupMenu {
        id_menu: string
        menu: string
    }
}