import { HttpBaseResponse } from "../../http/http-request.model"

export namespace GroupDiningModel {
    export interface IGroupDining {
        id_group: string
        nama_group: string
        id_hotel: string
        nama_hotel: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export class GetAllGroupDining implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGroupDining[]
    }

    export class GetByIdGroupDining implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGroupDining
    }

    export interface CreateGroupDining {
        nama_group: string
    }

    export interface UpdateGroupDining {
        id_group: string
        nama_group: string
    }
}