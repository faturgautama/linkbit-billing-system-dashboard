import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SetupUserHotelModel {
    export interface ISetupUserHotel {
        id_user: string
        id_role: string
        id_hotel: string
        nama_hotel: string
        nama: string
        username: string
        password: string
        is_active: boolean
    }

    export class GetAllSetupUserHotel implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUserHotel[]
    }

    export class GetByIdSetupUserHotel implements HttpBaseResponse {
        status!: boolean
        message!: string
        data!: ISetupUserHotel
    }

    export interface CreateSetupUserHotel {
        nama: string
        id_role: number
        id_hotel: number
        username: string
        password: string
    }

    export interface UpdateSetupUserHotel {
        id_user: string
        nama: string
        id_role: number
        id_hotel: number
        username: string
        password: string
    }
}