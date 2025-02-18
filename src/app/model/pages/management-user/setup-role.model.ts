import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupRolesModel {
    export interface ISetupRoles {
        id_role: string
        role: string
    }

    export class GetAllSetupRoles implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupRoles[]
    }

    export class GetByIdSetupRoles implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupRoles
    }

    export interface CreateSetupRoles {
        role: string
    }

    export interface UpdateSetupRoles {
        id_role: string
        role: string
    }
}