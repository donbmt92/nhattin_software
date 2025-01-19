"use client";
import {Inter} from "next/font/google";
import "./globals.css";
import {CartProvider} from "@/context/CartContext";
import Headers from "./components/Header/page";
import Footer from "@/components/Footer";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <CartProvider>
                    <Headers/>
                    {children}
                    <Footer/>
                </CartProvider>
            </body>
        </html>
    );
}
