import { HttpBaseResponse } from "../../http/http-request.model"

export namespace NearbyAttractionsModel {
    export interface INearbyAttractions {
        id_nearby_attraction: string
        image_name: string
        image_url: string
        title: string
        description: string
        url_location_qr: string
    }

    export class GetAllNearbyAttractions implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: INearbyAttractions[]
    }

    export class GetByIdNearbyAttractions implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: INearbyAttractions
    }

    export interface CreateNearbyAttractions {
        image_name: string
        image_url: string
        title: string
        description: string
        url_location_qr: string
    }

    export interface UpdateNearbyAttractions {
        id_nearby_attraction: string
        image_name: string
        image_url: string
        title: string
        description: string
        url_location_qr: string
    }
}