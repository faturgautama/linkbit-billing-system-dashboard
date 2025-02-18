import { HttpBaseResponse } from "../../http/http-request.model"

export namespace OrderManagementModel {
    export interface IOrderManagement {
        id_order_resto: string
        order_date: string
        order_number: string
        id_hotel: string
        nama_hotel: string
        guest_name: string
        id_user_device: string
        room_id: string
        diskon_persen: any
        diskon_nominal: any
        ppn_persen: any
        ppn_nominal: any
        grand_total: string
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
        status_bayar: number
        status_order: number
        canceled_at: any
        canceled_by: any
        reason_canceled: any
        status_order_name: string
        status_bayar_name: string
        detail?: IOrderManagementDetail[]
    }

    export interface IOrderManagementDetail {
        id_order_resto_detail: string
        id_order_resto: string
        id_resto: string
        title: string
        harga: string
        qty: string
        subtotal: string
    }

    export class GetAllOrderManagement implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOrderManagement[]
    }

    export class GetByIdOrderManagement implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IOrderManagement
    }
}