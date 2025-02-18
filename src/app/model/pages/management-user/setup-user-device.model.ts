import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupUserDeviceModel {
    export interface ISetupUserDevice {
        id_user_device: string
        username: string
        room_id: string
        is_active: boolean
        id_hotel: string
        nama_hotel: string
        created_at: string
        created_by: string
    }

    export class GetAllSetupUserDevice implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUserDevice[]
    }

    export class GetByIdUserDevice implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUserDevice
    }

    export interface CreateSetupUserDevice {
        username: string
        password: string
        room_id: string
        id_hotel: number
    }

    export interface UpdateSetupUserDevice {
        password: string
        id_user_device: number
        username: string
        room_id: string
    }
}