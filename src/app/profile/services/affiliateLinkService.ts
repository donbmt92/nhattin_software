import api from '../../components/utils/api';
import { 
    AffiliateLink,
    CreateAffiliateLinkRequest,
    CreateAffiliateLinkResponse,
    AffiliateLinkStats
} from '../types';

export class AffiliateLinkService {
    private static getAuthHeaders() {
        const token = localStorage.getItem('nhattin_token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Tạo affiliate link mới
     */
    static async createAffiliateLink(data: CreateAffiliateLinkRequest): Promise<CreateAffiliateLinkResponse> {
        try {
            const response = await api.post<{ success: boolean; data: CreateAffiliateLinkResponse; message?: string }>(
                '/affiliate-links',
                data,
                { headers: this.getAuthHeaders() }
            );
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Tạo link thất bại');
            }
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy danh sách affiliate links
     */
    static async getAffiliateLinks(): Promise<AffiliateLink[]> {
        try {
            const response = await api.get('/affiliate-links', {
                headers: this.getAuthHeaders()
            });
            return response.data.data || [];
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thống kê affiliate links
     */
    static async getAffiliateLinkStats(): Promise<AffiliateLinkStats> {
        try {
            const response = await api.get('/affiliate-links/stats', {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Vô hiệu hóa affiliate link
     */
    static async disableAffiliateLink(linkCode: string): Promise<void> {
        try {
            await api.put(`/affiliate-links/${linkCode}/disable`, {}, {
                headers: this.getAuthHeaders()
            });
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thông tin chi tiết affiliate link
     */
    static async getAffiliateLinkDetails(linkCode: string): Promise<AffiliateLink> {
        try {
            const response = await api.get(`/affiliate-links/${linkCode}`, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Cleanup expired links (Admin only)
     */
    static async cleanupExpiredLinks(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.post('/affiliate-links/cleanup-expired', {}, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy danh sách sản phẩm để tạo link
     */
    static async getProducts(): Promise<any[]> {
        try {
            const response = await api.get('/products', {
                headers: this.getAuthHeaders()
            });
            return response.data.data || [];
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Xử lý lỗi API
     */
    private static handleError(error: any): Error {
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return new Error(data?.message || 'Dữ liệu không hợp lệ');
                case 401:
                    return new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                case 403:
                    return new Error('Bạn không có quyền truy cập chức năng này');
                case 404:
                    return new Error('Không tìm thấy affiliate link');
                case 409:
                    return new Error('Link đã tồn tại hoặc bị trùng lặp');
                case 422:
                    return new Error(data?.message || 'Dữ liệu không hợp lệ');
                case 500:
                    return new Error('Lỗi server. Vui lòng thử lại sau.');
                default:
                    return new Error(data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } else if (error.request) {
            return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
        } else {
            return new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    }
}

export default AffiliateLinkService;
