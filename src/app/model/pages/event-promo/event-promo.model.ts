import { HttpBaseResponse } from "../../http/http-request.model"

export namespace EventPromoModel {
    export interface IEventPromo {
        id_promo: string
        image_promo_url: string
        image_promo_name: string
        title_promo: string
        description: string
        start_date: string
        end_date: string
        urut: number
    }

    export class GetAllEventPromo implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IEventPromo[]
    }

    export class GetByIdEventPromo implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IEventPromo
    }

    export interface CreateEventPromo {
        image_promo_url: string
        image_promo_name: string
        title_promo: string
        description: string
        start_date: string
        end_date: string
        urut: number
    }

    export interface UpdateEventPromo {
        id_promo: string
        image_promo_url: string
        image_promo_name: string
        title_promo: string
        description: string
        start_date: string
        end_date: string
        urut: number
    }
}