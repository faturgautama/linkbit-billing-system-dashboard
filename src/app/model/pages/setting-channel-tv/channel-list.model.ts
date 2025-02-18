import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ChannelListModel {
    export interface IChannelList {
        id_channel: string
        id_group: string
        group: string
        icon_url: string
        icon_name: string
        title_channel: string
        url: string
        urut: string
        is_active: string
        is_assign: boolean
    }

    export class GetAllChannelList implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IChannelList[]
    }

    export class GetByIdChannelList implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IChannelList
    }

    export interface CreateChannelList {
        id_group: string
        icon_url: string
        icon_name: string
        title_channel: string
        url: string
        urut: string
        is_active: string
        is_assign: string
    }

    export interface UpdateChannelList {
        id_channel: string
        id_group: string
        icon_url: string
        icon_name: string
        title_chanel: string
        url: string
        urut: string
        is_active: string
        is_assign: string
    }
}