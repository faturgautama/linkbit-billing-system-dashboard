import { HttpBaseResponse } from "../../http/http-request.model"

export namespace RegisterHotelModel {
    export interface IRegisterHotel {
        id: number
        video_splash_name: any
        video_splash_url: any
        title_hotel: string
        logo_hotel_name: any
        logo_hotel_url: any
        background_image_name: any
        background_image_url: any
        video_channel_0_name: any
        video_channel_0_url: any
        default_home: any
        address: string
        expired_date: string
        actived_at: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export class GetAllRegisterHotel implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRegisterHotel[]
    }

    export class GetByIdRegisterHotel implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRegisterHotel
    }

    export interface CreateRegisterHotel {
        title_hotel: string
        address: string
        expired_date: string
        actived_at: string
    }

    export interface UpdateRegisterHotel {
        id: string
        title_hotel: string
        address: string
        expired_date: string
        actived_at: string
    }
}