import { HttpBaseResponse } from "../../http/http-request.model"

export namespace OurFacilitiesModel {
    export interface IOurFacilities {
        id_info_fasilites: string
        image_name: string
        image_url: string
        title: string
        description: string
    }

    export class GetAllOurFacilities implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOurFacilities[]
    }

    export class GetByIdOurFacilities implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOurFacilities
    }

    export interface CreateOurFacilities {
        image_name: string
        image_url: string
        title: string
        description: string
    }

    export interface UpdateOurFacilities {
        id_info_fasilites: string
        image_name: string
        image_url: string
        title: string
        description: string
    }
}