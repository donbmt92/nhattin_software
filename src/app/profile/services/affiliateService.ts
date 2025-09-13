import api from '../../components/utils/api';
import { 
    AffiliateRegistrationRequest, 
    AffiliateRegistrationResponse,
    AffiliateInfo,
    AffiliateStats 
} from '../types';

export class AffiliateService {
    private static getAuthHeaders() {
        const token = localStorage.getItem('nhattin_token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Đăng ký affiliate mới
     */
    static async registerAffiliate(data: AffiliateRegistrationRequest): Promise<AffiliateRegistrationResponse> {
        try {
            const response = await api.post<{ success: boolean; data: AffiliateRegistrationResponse; message?: string }>(
                '/affiliates/register',
                data,
                { headers: this.getAuthHeaders() }
            );
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Đăng ký thất bại');
            }
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thông tin affiliate của user hiện tại
     */
    static async getAffiliateProfile(): Promise<AffiliateInfo> {
        try {
            const response = await api.get('/affiliates/profile', {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy thống kê affiliate
     */
    static async getAffiliateStats(): Promise<AffiliateStats> {
        try {
            const response = await api.get('/affiliates/stats', {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Cập nhật thông tin affiliate
     */
    static async updateAffiliateProfile(data: Partial<AffiliateInfo>): Promise<AffiliateInfo> {
        try {
            const response = await api.put('/affiliates/profile', data, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Yêu cầu rút tiền
     */
    static async requestPayout(amount: number): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.post('/affiliates/payout', { amount }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy lịch sử giao dịch affiliate
     */
    static async getTransactionHistory(page: number = 1, limit: number = 10): Promise<{
        transactions: any[];
        total: number;
        page: number;
        limit: number;
    }> {
        try {
            const response = await api.get(`/affiliates/transactions?page=${page}&limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Lấy danh sách khách hàng được giới thiệu
     */
    static async getReferrals(page: number = 1, limit: number = 10): Promise<{
        referrals: any[];
        total: number;
        page: number;
        limit: number;
    }> {
        try {
            const response = await api.get(`/affiliates/referrals?page=${page}&limit=${limit}`, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
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
                    return new Error('Không tìm thấy thông tin affiliate');
                case 409:
                    return new Error('Bạn đã đăng ký affiliate trước đó');
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

export default AffiliateService;
