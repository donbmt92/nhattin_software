export interface Order {
    id: string;
    productName: string;
    date: string;
    price: string;
    duration: string;
}

export interface UserProfile {
    fullName: string;
    id: string;
    email: string;
    phone: string;
    stats: {
        orders: number;
        spending: string;
        vipStatus: string;
    }
} 