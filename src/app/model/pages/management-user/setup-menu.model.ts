import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupMenuModel {
    export interface ISetupMenu {
        id_menu: number;
        id_parent: number | null;
        menu: string;
        icon: string;
        url: string;
        is_active: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export class IMenuQueryParams {
        id_parent?: number;
        menu?: string;
    }

    export class GetAllSetupMenu implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupMenu[]
    }

    export class GetByIdSetupMenu implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupMenu
    }

    export interface CreateSetupMenu {
        id_parent: number | null;
        menu: string;
        icon: string;
        url: string;
    }

    export interface UpdateSetupMenu {
        id_menu: number;
        id_parent: number | null;
        menu: string;
        icon: string;
        url: string;
        is_active: boolean;
    }
}