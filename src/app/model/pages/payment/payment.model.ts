export namespace PaymentModel {
    export interface IPayment {
        id_payment: number;
        id_invoice: number;
        invoice_number: string;
        invoice_date: Date;
        total: number;
        id_pelanggan: number;
        id_setting_company: number;
        company_name: string;
        full_name: string;
        pelanggan_code: string;
        id_product: number;
        product_name: string;
        payment_token: string;
        payment_id: string;
        payment_number: string;
        payment_date: Date;
        payment_method: string;
        payment_status: string;
        payment_amount: number;
        payment_provider: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export interface IPaymentQueryParams {
        id_setting_company?: string;
        id_pelanggan?: string;
        id_product?: string;
        invoice_number?: string;
        invoice_date?: string;
    }

    export class GetAllPayment {
        status!: boolean;
        message!: string;
        data!: IPayment[]
    }

    export class GetByIdPayment {
        status!: boolean;
        message!: string;
        data!: IPayment;
    }

    export interface CreatePayment {
        payment_token: string;
        payment_method_type: string;
        payment_method_code: string;
        payment_amount: number;
    }

    export interface UpdatePayment {
        id_payment: number;
        id_invoice: number;
        id_pelanggan: number;
        id_product: number;
        payment_token: string;
        payment_id: string;
        payment_number: string;
        payment_method_type: string;
        payment_method_code: string;
        payment_amount: number;
    }

    export interface UpdatePaymentCash {
        id_payment: number;
        id_invoice: number;
        id_payment_method_manual: number;
        payment_date: Date;
    }

    export interface IPaymentMethod {
        payment_method_type: string;
        payment_method_name: string;
        payment_method_code: string;
        image: string;
    }

    export interface GetAllPaymentMethod {
        status: boolean;
        message: string;
        data: IPaymentMethod[];
    }
}