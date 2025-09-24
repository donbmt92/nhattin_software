"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Headers from "./components/Header/page";
import Footer from "@/components/Footer";
import { ExpandingFloatButton } from "@/components/ui/expanding-float-button";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import { metadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <head>
                <link rel="icon" type="image/jpeg" sizes="32x32" href="/images/icon/logo.jpg" />
                <link rel="icon" type="image/jpeg" sizes="192x192" href="/images/icon/logo.jpg" />
                <link rel="icon" type="image/jpeg" sizes="512x512" href="/images/icon/logo.jpg" />
                <link rel="apple-touch-icon" sizes="180x180" href="/images/icon/logo.jpg" />
                <link rel="shortcut icon" href="/images/icon/logo.jpg" />
                <meta name="msapplication-TileImage" content="/images/icon/logo.jpg" />
                <OrganizationSchema />
                <WebsiteSchema />
            </head>
            <body className={inter.className}>
                <CartProvider>
                    <Headers />
                    {children}
                    <ExpandingFloatButton />
                    <Footer />
                </CartProvider>
            </body>
        </html>
    );
}
