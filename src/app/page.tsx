import React from 'react'
import ListProductTop from './components/ListProductTop/ListProductTop'
import ListCategories from './components/ListCategories/ListCategories'
import Poster from './components/Poster/Poster'
import Sliders from "./components/Sliders/Sliders";
import ListProductSales from "@/app/components/ListProductSales/ListProductSales";
import ListProductNews from "@/app/components/ListProductNews/ListProductNews";
import Figures from "@/app/components/Figures/page";
import GiftCards from './components/GiftCard/page'


export default function Home() {
    return (
        <>
            <Sliders />
            <ListCategories />
            <ListProductTop />
            <ListProductSales/>
            <Poster/>
            <ListProductNews />
            <GiftCards />
            <Figures/>
        </>
    );
}
