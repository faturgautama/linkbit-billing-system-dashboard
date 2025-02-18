import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AuthenticationModel {
    export interface IAuthentication {
        nama: string
        username: string
        nama_hotel: string
        role: string
        token: string
        is_admin: boolean;
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