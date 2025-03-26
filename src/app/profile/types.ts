export interface Order {
    id: string;
    productName: string;
    date: string;
    price: string;
    duration: string;
}

export interface UserProfile {
    _id: any;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    image?: string;
    // stats: {
    //     orders: number;
    //     spending: string;
    //     vipStatus: string;
    // }
}
export interface User {
    id: string;
    fullName: string;
    email?: string;
}
export interface Notification {
    message: string;
    type: 'success' | 'error';
  }
export interface Product {
    _id: any;
    id: string;
    name: string;
    id_category: any;
    sales: string;
    base_price: string;
    max_price: string;
    min_price: string;
    image: string;
    description: string;
}
export interface Category {
    _id: string;
    type: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface SubcriptionTypes {
    _id: string;
    product_id: any;
    type_name: string;
    status: string;
    name: string;
    description: string;
}
export interface SubcriptionDurations {
    _id: string;
    product_id: any;
    duration: string;
    price: string;
    days: string;
}