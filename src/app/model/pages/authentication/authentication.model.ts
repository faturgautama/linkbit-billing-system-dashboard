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

    export interface IUserGroupMenu {
        id_user_group_menu: number;
        id_user_group: number;
        user_group: string;
        id_menu: number;
        id_menu_parent: number | null;
        menu: string;
        icon: string;
        url: string;
        is_assigned: boolean;
        is_parent: boolean;
        toggle_child: boolean;
        child: IUserGroupMenu[];
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