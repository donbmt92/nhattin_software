"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Headers from "./components/Header/page";
import Footer from "@/components/Footer";
import { ExpandingFloatButton } from "@/components/ui/expanding-float-button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
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
