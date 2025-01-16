"use client";
import {Inter} from "next/font/google";
import "./globals.css";
import {CartProvider} from "@/context/CartContext";
import Headers from "./components/Header/page";

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
                </CartProvider>
            </body>
        </html>
    );
}
