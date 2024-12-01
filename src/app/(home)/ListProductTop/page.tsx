"use client";
import ListCard1 from "@/app/components/Card/ListCard1/page";
import StandCard from "@/app/components/Card/StandCard/page";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function ListProductTop() {

    return (
        <div className="relative container mx-auto pt-[100px] pb-[50px]">
            <div className="grid grid-cols-1 xl:grid-cols-6 md:grid-cols-3  mx-auto">
                <div className="col-span-2 justify-center items-center hidden xl:flex mt-[-57px]">
                    <img src="images/banner1.png" alt="Images" style={{ width: "84%", objectFit: "cover", }} />
                </div>
                <div className="col-span-4">
                    <ListCard1 />
                </div>

            </div>
        </div>
    );
}
