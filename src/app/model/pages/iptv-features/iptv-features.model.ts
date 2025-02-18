import { HttpBaseResponse } from "../../http/http-request.model"

export namespace IptvFeaturesModel {
    export interface IIptvFeatures {
        id: number
        video_splash_name: string
        video_splash_url: string
        title_hotel_name: string
        title_hotel_url: string
        logo_hotel_name: string
        logo_hotel_url: string
        is_background_video: boolean;
        background_image_name: string
        background_image_url: string
        background_video_name: string
        background_video_url: string
        video_channel_0_name: string
        video_channel_0_url: string
        default_home_name: string
        default_home_url: string
    }

    export class GetAllIptvFeatures implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IIptvFeatures
    }

    export class GetByIdIptvFeatures implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IIptvFeatures
    }

    export interface CreateIptvFeatures {
        video_splash_name: string
        video_splash_url: string
        title_hotel_name: string
        title_hotel_url: string
        logo_hotel_name: string
        logo_hotel_url: string
        background_image_name: string
        background_image_url: string
        video_channel_0_name: string
        video_channel_0_url: string
        default_home_name: string
        default_home_url: string
    }

    export interface UpdateIptvFeatures {
        id: number
        video_splash_name: string
        video_splash_url: string
        title_hotel_name: string
        title_hotel_url: string
        logo_hotel_name: string
        logo_hotel_url: string
        background_image_name: string
        background_image_url: string
        video_channel_0_name: string
        video_channel_0_url: string
        default_home_name: string
        default_home_url: string
    }
}