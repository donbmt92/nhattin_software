"use client";
import React from 'react';
import AffiliateDashboard from '../components/AffiliateDashboard';
import '../styles/affiliate.css';

export default function AffiliateDashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <AffiliateDashboard />
            </div>
        </div>
    );
}
