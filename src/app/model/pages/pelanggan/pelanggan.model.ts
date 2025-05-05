export namespace PelangganModel {
    export interface IPelanggan {
        id_pelanggan: number;
        id_setting_company: number;
        id_group_pelanggan: number;
        group_pelanggan: string;
        full_name: string;
        pelanggan_code: string;
        identity_number: string;
        email: string;
        password: string;
        alamat: string;
        phone: string;
        whatsapp: string;
        subscribe_start_date: Date;
        pic_name: string;
        notes: string;
        is_active: boolean;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export interface IPelangganQueryParams {
        id_setting_company?: string;
        id_group_pelanggan?: number;
        full_name?: string;
        pelanggan_code?: string;
        phone?: string;
        is_active?: boolean;
    }

    export class GetAllPelanggan {
        status!: boolean;
        message!: string;
        data!: IPelanggan[]
    }

    export class GetByIdPelanggan {
        status!: boolean;
        message!: string;
        data!: IPelanggan;
    }

    export interface CreatePelanggan {
        id_group_pelanggan: number;
        id_setting_company: number;
        full_name: string;
        pelanggan_code: string;
        identity_number: string;
        email: string;
        password: string;
        alamat: string;
        phone: string;
        whatsapp: string;
        subscribe_start_date: Date;
        pic_name: string;
        notes: string;
    }

    export interface UpdatePelanggan {
        id_pelanggan: number;
        id_setting_company: number;
        id_group_pelanggan: number;
        full_name: string;
        pelanggan_code: string;
        identity_number: string;
        email: string;
        password: string;
        alamat: string;
        phone: string;
        whatsapp: string;
        subscribe_start_date: Date;
        pic_name: string;
        notes: string;
        is_active: boolean;
    }

    export interface UpdateProductPelanggan {
        id_pelanggan: number;
        id_product: number;
        start_date: Date;
        price: number;
        invoice_cycle: string;
        days_before_send_invoice: number;
    }
}