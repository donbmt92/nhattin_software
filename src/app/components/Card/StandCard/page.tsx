"use client"
import React from 'react'
interface HeaderSectionsProps {
    comments: { title: string, tag: string, sales: string, prices: string, img: string }[];
}
export default function StandCard({ comments }: HeaderSectionsProps) {
    return (
        <div className="">
            {comments.map((comment, index) => (
                <div key={index} className="relative mx-4 my-8 flex flex-col items-center justify-center text-center z-1"
                    style={{ border: " 1px solid var(--clr-txt-2)", backgroundColor: "var(--clr-bg)", borderRadius: "5px", boxShadow: "0px 8px 15px 10px rgb(0 0 0 / 0.08), 0 4px 4px -2px rgb(0 0 0 / 0.05)", }}
                >
                    <div className="">
                        <div className="pb-[130px] md:pb-[175px]"></div>
                        <div className="relative top-[-40px] md:top-[-60px] left-1/2 transform -translate-x-1/2 -translate-y-2/3 z-2 "
                            style={{ width: "90%", height: "90px", backgroundColor: "var(--clr-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <a href="/product/1"><img src={comment.img} alt="Logo" style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "5px", cursor: "pointer" }} /></a>
                        </div>
                    </div>
                    <div className="px-4 pb-3 w-full align-items-center">
                        <p className="mb-1 font-semibold text-[20px] text-left" style={{ color: "var(--clr-txt-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>{comment.title}</p>
                        <div className="flex justify-between items-center mb-2">
                            <button style={{ borderRadius: "5px", padding: "2px 10px", color: "var(--clr-txt-2)", border: "1px solid var(--clr-bg-3)", fontSize: "11px" }}>{comment.tag}</button>
                            <div className="flex ỉtems-center">
                                <p className="text-[14px] mr-1" style={{ color: "var(--clr-txt-1)" }}>{comment.sales}</p>
                                <img src="../images/icon/icon9.png" alt="Images" style={{ color: "var(--clr-txt-1)", width: "15px", height: "17px", marginTop: "4px" }} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[24px] mr-2 font-semibold" style={{ color: "var(--clr-txt-4)" }}>{comment.prices} đ</p>
                            <img src="../images/icon/icon10.png" alt="Images" style={{ color: "var(--clr-txt-1)", width: "25px", height: "25px" }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
