import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ChannelGroupModel {
    export interface IChannelGroup {
        id_group: string
        group: string
    }

    export class GetAllChannelGroup implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IChannelGroup[]
    }

    export class GetByIdChannelGroup implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IChannelGroup
    }

    export interface CreateChannelGroup {
        group: string
    }

    export interface UpdateChannelGroup {
        id_group: string
        group: string
    }
}