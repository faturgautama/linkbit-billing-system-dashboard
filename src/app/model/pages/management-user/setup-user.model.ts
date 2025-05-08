import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupUserModel {
    export interface ISetupUser {
        id_user: number;
        id_setting_company: number;
        company_name: string;
        id_user_group: number;
        user_group: string;
        username: string;
        full_name: string;
        email: string;
        address: string;
        phone: string;
        whatsapp: string;
        notes: string;
        is_active: boolean;
        create_at: Date;
        create_by: number;
        update_at?: Date;
        update_by?: number;
    }

    export interface IUserQueryParams {
        id_user_group?: number;
        username?: string;
        full_name?: string;
        email?: string;
    }

    export class GetAllSetupUser implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUser[]
    }

    export class GetByIdSetupUser implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUser
    }

    export interface CreateSetupUser {
        id_setting_company: number;
        id_user_group: number;
        username: string;
        full_name: string;
        email: string;
        address: string;
        phone: string;
        whatsapp: string;
        notes: string;
    }

    export interface UpdateSetupUser {
        id_user: string
        id_setting_company: number;
        id_user_group: number;
        username: string;
        full_name: string;
        email: string;
        address: string;
        phone: string;
        whatsapp: string;
        notes: string;
        is_active: boolean;
    }
}