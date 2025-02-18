import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AuthenticationModel {
    export interface IAuthentication {
        id_user: number;
        id_setting_company: number;
        company_name: string;
        id_user_group: number;
        user_group: string;
        username: string;
        full_name: string;
        email: string;
        phone: string;
        whatsapp: string;
        notes: string;
        token: string;
    }

    export interface ISidebarMenu {
        id_menu: string
        urut?: number
        caption: string
        icon: string
        toggle_child: boolean
        url?: any
        is_parent?: boolean
        id_parent?: any
        is_active?: boolean
        is_admin?: boolean
        is_client?: boolean
        sidebarChild?: ISidebarMenu[]
    }

    export interface ISignIn {
        username: string
        password: string
    }

    export class SignIn implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: IAuthentication
    }
}