"use client"
import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="dashboard-layout">
            <meta
                name="description"
                content="Bảng điều khiển quản trị để quản lý ứng dụng"
            />
            
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <div className={`${isMobile ? 'fixed' : 'relative'} z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <Sidebar />
                </div>

                {/* Main content */}
                <main className={`flex-1 overflow-y-auto ${inter.className} lg:ml-0`}>
                    {/* Mobile header */}
                    {isMobile && (
                        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
                                </div>
                                <div className="w-8"></div>
                            </div>
                        </div>
                    )}
                    
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .headerNhattin,
                .footerNhattin {
                    display: none;
                }
                .dashboard-layout {
                    min-height: 100vh;
                    background: #f9fafb;
                }
                
                .dark .dashboard-layout {
                    background: #111827;
                }
                
                /* Custom scrollbar */
                .dashboard-layout ::-webkit-scrollbar {
                    width: 6px;
                }
                
                .dashboard-layout ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .dashboard-layout ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .dashboard-layout ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                /* Smooth transitions */
                * {
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}
