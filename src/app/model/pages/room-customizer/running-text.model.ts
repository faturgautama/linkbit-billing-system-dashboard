import { HttpBaseResponse } from "../../http/http-request.model"

export namespace RunningTextModel {
    export interface IRunningText {
        id_announcement: string
        description: string
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

    export class GetAllRunningText implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRunningText[]
    }

    export class GetByIdRunningText implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRunningText
    }

    export interface CreateRunningText {
        description: string
        start_date: string
        end_date: string
        detail_room: DetailRoom[]
    }

    export interface DetailRoom {
        id_user_device: number
    }

    export interface UpdateRunningText {
        id_announcement: string
        description: string
        start_date: string
        end_date: string
        detail_room: DetailRoom[]
    }
}