export namespace InvoiceModel {
    export interface IInvoice {
        id_invoice: number;
        invoice_number: string;
        invoice_date: Date;
        id_pelanggan: number;
        id_setting_company: number;
        company_name: string;
        full_name: string;
        pelanggan_code: string;
        id_pelanggan_product: number;
        id_product: number;
        product_name: string;
        price: number;
        diskon_percentage: number;
        diskon_rupiah: number;
        pajak: number;
        admin_fee: number;
        unique_code: string;
        total: number;
        due_date: Date;
        notes?: string;
        invoice_status: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_deleted: boolean;
        delete_at: Date;
        delete_by: number;
    }

    export enum InvoiceStatus {
        PENDING = 'PENDING',
        EXPIRED = 'EXPIRED',
        CANCEL = 'CANCEL',
        PAID = 'PAID',
    }

    export interface IInvoiceQueryParams {
        id_setting_company?: string;
        id_pelanggan?: string;
        id_product?: string;
        invoice_number?: string;
        invoice_date?: string;
        invoice_status?: InvoiceStatus;
    }

    export class GetAllInvoice {
        status!: boolean;
        message!: string;
        data!: IInvoice[]
    }

    export class GetByIdInvoice {
        status!: boolean;
        message!: string;
        data!: IInvoice;
    }

    export interface CreateInvoice {
        invoice_number: string;
        invoice_date: Date;
        id_pelanggan: number;
        id_pelanggan_product: number;
        id_product: number;
        price: number;
        diskon_percentage: number;
        diskon_rupiah: number;
        pajak: number;
        admin_fee: number;
        unique_code: string;
        total: number;
        due_date: Date;
        notes?: string;
    }

    export interface UpdateInvoice {
        id_invoice: number;
        invoice_number: string;
        invoice_date: Date;
        id_pelanggan: number;
        id_pelanggan_product: number;
        id_product: number;
        price: number;
        diskon_percentage: number;
        diskon_rupiah: number;
        pajak: number;
        admin_fee: number;
        unique_code: string;
        total: number;
        due_date: Date;
        notes?: string;
    }
}