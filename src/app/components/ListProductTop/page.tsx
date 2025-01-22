"use client";
import ListCard1 from "@/app/components/Card/ListCard1/page";
import Image from "next/image";

export default function ListProductTop() {

    return (
        <div className="relative container mx-auto pt-[100px] pb-[50px]">
            <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-3 mx-auto">
                <div className="col-span-4 justify-center items-center hidden xl:flex xl:mt-[-50px]">
                    <Image src="/images/banner1.png" alt="Images" style={{ width: "84%", objectFit: "cover", }} width={1000} height={100} />
                </div>
                <div className="col-span-8">
                    <ListCard1 />
                </div>

            </div>
        </div>
    );
}
