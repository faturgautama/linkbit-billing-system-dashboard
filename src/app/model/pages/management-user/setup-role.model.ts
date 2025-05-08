import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupRolesModel {
    export interface ISetupRoles {
        id_user_group: number;
        user_group: string;
        is_active: boolean;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
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
        user_group: string
    }

    export interface UpdateSetupRoles {
        id_user_group: string
        user_group: string
        is_active: boolean;
    }
}