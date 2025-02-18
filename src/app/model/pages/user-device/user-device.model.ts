import { HttpBaseResponse } from "../../http/http-request.model"

export namespace UserDeviceModel {
    export interface IUserDevice {
        id_user_device: string
        username: string
        room_id: string
        is_active: boolean
        id_hotel: string
        nama_hotel: string
        created_at: string
        created_by: string
    }

    export class GetAllUserDevice implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUserDevice[]
    }

    export class GetByIdUserDevice implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUserDevice
    }

    export interface CreateUserDevice {
        image_promo_url: string
        image_promo_name: string
        title_promo: string
        description: string
        start_date: string
        end_date: string
        urut: number
    }

    export interface UpdateUserDevice {
        password: string
        id_user_device: number
        username: string
        room_id: string
    }
}