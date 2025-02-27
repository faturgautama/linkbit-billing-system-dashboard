export namespace ProductModel {
    export interface IProduct {
        id_product: number;
        product_name: string;
        description: string;
        price: number;
        invoice_cycle: string;
        days_before_send_invoice: number;
        is_active: boolean;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export interface IProductQueryParams {
        product_name?: string;
        price?: number;
    }

    export class GetAllProduct {
        status!: boolean;
        message!: string;
        data!: IProduct[]
    }

    export class GetByIdProduct {
        status!: boolean;
        message!: string;
        data!: IProduct;
    }

    export interface CreateProduct {
        product_name: string;
        description: string;
        price: number;
        invoice_cycle: string;
        days_before_send_invoice: number;
    }

    export interface UpdateProduct {
        id_product: number;
        product_name: string;
        description: string;
        price: number;
        invoice_cycle: string;
        days_before_send_invoice: number;
        is_active: boolean;
    }
}