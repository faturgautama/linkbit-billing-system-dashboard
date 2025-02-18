import { HttpBaseResponse } from "../../http/http-request.model"

export namespace BackgroundModel {
    export interface IBackground {
        id_background: string
        background_url: string
        background_name: string
        start_date: string
        end_date: string
        is_active: boolean
        id_hotel: string
        nama_hotel: string
        id_user_device: string
        room_id: string
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export class GetAllBackground implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBackground[]
    }

    export class GetByIdBackground implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBackground
    }

    export interface CreateBackground {
        background_url: string
        background_name: string
        start_date: string
        end_date: string
        detail_room: DetailRoom[]
    }

    export interface DetailRoom {
        id_user_device: number
    }

    export interface UpdateBackground {
        id_background: string
        background_url: string
        background_name: string
        start_date: string
        end_date: string
        detail_room: DetailRoom[]
    }
}