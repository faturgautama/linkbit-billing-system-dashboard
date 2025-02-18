import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SettingUserRolesModel {
    export interface ISettingUserRoles {
        id_role_menu: string
        id_menu: string
        menu: string
        id_role: string
        role: string
    }

    export class GetAllSettingUserRoles implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISettingUserRoles[]
    }

    export class GetByIdSettingUserRoles implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISettingUserRoles
    }

    export interface CreateSettingUserRoles {
        id_menu: string
        id_role: string
    }

    export interface UpdateSettingUserRoles {
        id_role_menu: string
        id_menu: string
        id_role: string
    }
}