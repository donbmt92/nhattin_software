// Enum PaymentStatus khớp với backend
export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export interface Payment {
    id: string;
    id_order: string | null;
    provider: string;
    status: PaymentStatus;
    amount: number;
    is_bank_transfer: boolean;
    bank_name?: string;
    transaction_reference?: string;
    transfer_date?: string;
    transfer_note?: string;
    createdAt: string;
    updatedAt: string;
    order_snapshot?: {
        id: string;
        uid: string;
        status: string;
        total_items: number;
        note: string;
        voucher?: string;
        affiliateCode?: string;
        commissionAmount?: number;
        commissionStatus?: string;
        createdAt: string;
        updatedAt: string;
        items?: Array<{
            id: string;
            quantity: number;
            old_price: number;
            discount_precent: number;
            final_price: number;
            product_snapshot: {
                name: string;
                image: string;
                description: string;
                base_price: number;
                category_id: string;
                category_name: string;
            };
        }>;
    } | null;
    order?: {
        id: string;
        uid: string;
        status: string;
        total_items: number;
        note: string;
        createdAt: string;
    };
}
