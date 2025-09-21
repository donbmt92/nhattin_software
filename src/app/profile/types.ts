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

export interface AffiliateInfo {
    _id?: string;
    userId?: string;
    affiliateCode?: string;
    commissionRate?: number;
    status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    minPayoutAmount?: number;
    totalEarnings?: number;
    pendingEarnings?: number;
    paymentInfo?: PaymentInfo;
    createdAt?: string;
    updatedAt?: string;
    // Properties for unregistered users
    isRegistered?: boolean;
    message?: string;
    registrationRequired?: boolean;
}

export interface PaymentInfo {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bankCode?: string;
}

export interface AffiliateRegistrationRequest {
    commissionRate: number;
    paymentInfo: PaymentInfo;
}

export interface AffiliateRegistrationResponse {
    affiliateCode: string;
    commissionRate: number;
    status: string;
    minPayoutAmount: number;
}

export interface AffiliateStats {
    totalReferrals: number;
    totalOrders: number;
    totalEarnings: number;
    pendingEarnings: number;
    lastPayout: string;
}

// Affiliate Link System Types
export interface AffiliateLink {
    _id?: string;
    affiliateId: string;        // Reference to existing affiliate
    productId: string;          // Reference to product
    linkCode: string;           // Unique link code (e.g., "ABC123XYZ")
    originalUrl: string;        // Product page URL
    shortUrl: string;           // Affiliate redirect URL
    expiresAt: Date;            // Expiration date
    clickCount: number;         // Number of clicks
    conversionCount: number;    // Number of conversions
    totalCommissionEarned: number; // Total commission earned
    status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
    campaignName?: string;      // Campaign name (optional)
    notes?: string;             // Notes (optional)
    clickedByIPs: string[];     // Array of IP addresses
    convertedUserIds: string[]; // Array of user IDs who converted
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAffiliateLinkRequest {
    productId: string;
    expiresAt: string;
    campaignName?: string;
    notes?: string;
}

export interface CreateAffiliateLinkResponse {
    _id: string;
    linkCode: string;
    shortUrl: string;
    expiresAt: string;
    status: string;
}

export interface AffiliateLinkStats {
    totalLinks: number;
    totalClicks: number;
    totalConversions: number;
    totalCommission: number;
    conversionRate: number;
    activeLinks: number;
    expiredLinks: number;
    disabledLinks: number;
}