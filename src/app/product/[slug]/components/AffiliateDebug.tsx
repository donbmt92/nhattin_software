"use client";
import React, { useState, useEffect } from 'react';
import api from '@/app/components/utils/api';

const AffiliateDebug: React.FC = () => {
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAffiliateStatus();
    }, []);

    const checkAffiliateStatus = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            console.log('🔍 [Debug] Checking affiliate status...');
            
            const info = {
                hasToken: !!token,
                tokenLength: token?.length || 0,
                timestamp: new Date().toISOString()
            };

            if (!token) {
                setDebugInfo({ ...info, error: 'No token found' });
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get('/affiliates/profile');
                
                const responseData = {
                    status: response.status,
                    ok: response.status === 200,
                    statusText: response.statusText
                };

                if (response.status === 200) {
                    const data = response.data;
                    setDebugInfo({
                        ...info,
                        ...responseData,
                        apiData: data,
                        isAffiliate: data.success && data.data?.status === 'ACTIVE',
                        affiliateStatus: data.data?.status || 'unknown'
                    });
                } else {
                    setDebugInfo({
                        ...info,
                        ...responseData,
                        error: 'API call failed'
                    });
                }
            } catch (apiError) {
                setDebugInfo({
                    ...info,
                    error: 'API call error: ' + (apiError as Error).message
                });
            }
        } catch (error) {
            setDebugInfo({
                error: 'General error: ' + (error as Error).message,
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>🔍 Đang kiểm tra affiliate status...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold mb-2">🐛 Affiliate Debug Info</h3>
            <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button 
                onClick={checkAffiliateStatus}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
                🔄 Refresh
            </button>
        </div>
    );
};

export default AffiliateDebug;
