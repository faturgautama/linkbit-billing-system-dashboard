import { HttpBaseResponse } from "../../http/http-request.model"

export namespace GreetingCardModel {
    export interface IGreetingCard {
        id_greeting_card: string
        video_name: string
        video_url: string
        no_room: string
        start_date: string
        end_date: string
        is_active: boolean
    }

    export class GetAllGreetingCard implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGreetingCard[]
    }

    export class GetByIdGreetingCard implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGreetingCard
    }

    export interface CreateGreetingCard {
        video_name: string
        video_url: string
        no_room: string
        start_date: string
        end_date: string
        is_active: boolean
    }

    export interface UpdateGreetingCard {
        id_greeting_card: string
        video_name: string
        video_url: string
        no_room: string
        start_date: string
        end_date: string
        is_active: boolean
    }
}