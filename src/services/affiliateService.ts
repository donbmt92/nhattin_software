const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AffiliateProfile {
  id: string;
  userId: string;
  affiliateCode: string;
  commissionRate: number;
  totalEarnings: number;
  totalReferrals: number;
  approvedReferrals: number;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  paymentInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  minPayoutAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface AffiliateDashboard {
  totalEarnings: number;
  totalReferrals: number;
  approvedReferrals: number;
  pendingReferrals: number;
  commissionRate: number;
  status: string;
  nextPayoutDate: string;
}

interface Commission {
  id: string;
  orderId: string;
  orderAmount: number;
  commission: number;
  commissionRate: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  transactionDate: string;
  paidDate?: string;
}

interface AffiliateLink {
  id: string;
  productId?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}

interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  pendingAffiliates: number;
  totalCommissions: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
}

class AffiliateService {
  private async getAuthHeaders() {
    const token = localStorage.getItem('nhattin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
    return response.json();
  }

  // Admin APIs
  async getAllAffiliates(page: number = 1, limit: number = 10, status?: string): Promise<{
    success: boolean;
    data: {
      affiliates: AffiliateProfile[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status && status !== 'ALL') {
        params.append('status', status);
      }

      const response = await fetch(`${API_BASE_URL}/affiliates/admin/list?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      throw error;
    }
  }

  async getAffiliateById(id: string): Promise<{
    success: boolean;
    data: AffiliateProfile;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/admin/detail/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate:', error);
      throw error;
    }
  }

  async updateAffiliateStatus(id: string, status: string): Promise<{
    success: boolean;
    data: AffiliateProfile;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/admin/${id}/status`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      throw error;
    }
  }

  async getAdminStats(): Promise<{
    success: boolean;
    data: AffiliateStats;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/admin/stats`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      throw error;
    }
  }

  async getAffiliateCommissions(affiliateId: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: {
      commissions: Commission[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/affiliates/admin/${affiliateId}/commissions?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate commissions:', error);
      throw error;
    }
  }

  async getAdminAffiliateLinks(affiliateId: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: {
      links: AffiliateLink[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/affiliates/admin/${affiliateId}/links?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      throw error;
    }
  }

  // User APIs
  async getAffiliateProfile(): Promise<{
    success: boolean;
    data: AffiliateProfile;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/profile`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate profile:', error);
      throw error;
    }
  }

  async getAffiliateDashboard(): Promise<{
    success: boolean;
    data: AffiliateDashboard;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/dashboard`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate dashboard:', error);
      throw error;
    }
  }

  async getAffiliateStats(): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/stats`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      throw error;
    }
  }

  async getTransactionHistory(page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: {
      transactions: Commission[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/affiliates/transactions?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  async getReferrals(page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: {
      referrals: any[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/affiliates/referrals?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }
  }

  async createAffiliateLink(productId?: string, customCode?: string): Promise<{
    success: boolean;
    data: AffiliateLink;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliate-links`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          productId,
          customCode,
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      throw error;
    }
  }

  async getAffiliateLinks(page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: {
      links: AffiliateLink[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/affiliate-links?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      throw error;
    }
  }

  async requestPayout(amount: number): Promise<{
    success: boolean;
    data: {
      requestId: string;
      amount: number;
      status: string;
    };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/affiliates/payout`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw error;
    }
  }
}

export const affiliateService = new AffiliateService();
export type { AffiliateProfile, AffiliateDashboard, Commission, AffiliateLink, AffiliateStats };
