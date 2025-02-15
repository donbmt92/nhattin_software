"use client"
import { Inter } from "next/font/google";
import Sidebar from '../components/Sidebar/Sidebar';

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-layout">
            <meta
                name="description"
                content="Admin dashboard for managing the application"
            />
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <main className={`flex-1 overflow-y-auto ${inter.className}`}>
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
                    background: #f5f5f5;
                }
            `}</style>
        </div>
    );
}
