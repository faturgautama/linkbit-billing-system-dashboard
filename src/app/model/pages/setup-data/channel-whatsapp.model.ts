import { HttpBaseResponse } from "../../http/http-request.model";

export namespace ChannelWhatsappModel {
    export interface IChannelWhatsapp {
        id_channel_whatsapp: number;
        channel_whatsapp: string;
        api_url: string;
        required_credential: any;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_active: boolean;
    }

    export class IChannelWhatsappQueryParams {
        channel_whatsapp?: string;
    }

    export class GetAllChannelWhatsapp implements HttpBaseResponse {
        status!: boolean;
        message!: string;
        data!: IChannelWhatsapp[]
    }

    export class GetByIdChannelWhatsapp implements HttpBaseResponse {
        status!: boolean;
        message!: string;
        data!: IChannelWhatsapp;
    }

    export interface CreateChannelWhatsapp {
        channel_whatsapp: string;
        api_url: string;
        required_credential: any;
    }

    export interface UpdateChannelWhatsapp {
        id_channel_whatsapp: number;
        channel_whatsapp: string;
        api_url: string;
        required_credential: any;
        is_active: boolean;
    }
}