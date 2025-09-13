"use client";
import React, { useState } from 'react';
import api from '@/app/components/utils/api';

const BackendTest: React.FC = () => {
    const [testResult, setTestResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const testBackendConnection = async () => {
        setIsLoading(true);
        setTestResult(null);

        try {
            console.log('🔍 Testing backend connection...');
            
            // Test 1: Check if backend is running
            const healthCheck = await fetch('http://localhost:3080/api/health');
            console.log('🏥 Health check:', healthCheck.status);
            
            // Test 2: Test affiliate profile endpoint
            const profileResponse = await api.get('/affiliates/profile');
            console.log('👤 Profile response:', profileResponse.status);
            
            // Test 3: Test affiliate-links endpoint with sample data
            const sampleData = {
                productId: 'test-product-123',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                campaignName: 'Test Campaign',
                notes: 'Test from frontend'
            };
            
            console.log('📅 Sample data:', sampleData);
            
            const linkResponse = await api.post('/affiliate-links', sampleData);
            console.log('🔗 Link response:', linkResponse.status);
            
            setTestResult({
                success: true,
                healthCheck: healthCheck.status,
                profileResponse: profileResponse.status,
                linkResponse: linkResponse.status,
                sampleData
            });
            
        } catch (error: any) {
            console.error('❌ Backend test failed:', error);
            
            setTestResult({
                success: false,
                error: error.message,
                errorType: error.constructor.name,
                errorDetails: error.response?.data || error.request || 'Unknown error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold mb-2">🧪 Backend Connection Test</h3>
            
            <button 
                onClick={testBackendConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? '🔄 Testing...' : '🚀 Test Backend'}
            </button>
            
            {testResult && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Test Results:</h4>
                    <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
                        {JSON.stringify(testResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default BackendTest;
