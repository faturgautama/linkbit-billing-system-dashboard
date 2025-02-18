import { HttpBaseResponse } from "../../http/http-request.model"

export namespace OurRoomsModel {
    export interface IOurRooms {
        id_info_room: string
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
        diskon_persen: number
        diskon_nominal: number
        harga_total: number
    }

    export class GetAllOurRooms implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOurRooms[]
    }

    export class GetByIdOurRooms implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOurRooms
    }

    export interface CreateOurRooms {
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
        diskon_persen: number
        diskon_nominal: number
        harga_total: number
    }

    export interface UpdateOurRooms {
        id_info_room: string
        image_name: string
        image_url: string
        title: string
        description: string
        harga: number
        diskon_persen: number
        diskon_nominal: number
        harga_total: number
    }
}