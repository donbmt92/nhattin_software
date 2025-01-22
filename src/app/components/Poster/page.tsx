import Image from 'next/image'
import React from 'react'

export default function Poster() {
    return (
        <div className="pb-[50px] pt-[100px] px-3">
            <div className="container mx-auto" style={{ backgroundColor: 'var(--clr-bg-2)', borderRadius: '10px' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
                    <div className="px-5 md:px-10 py-10 flex flex-col justify-center text-left col-span-2">
                        <h2 className="text-[30px] font-bold mb-3" style={{ color: 'var(--clr-txt-3)'}}>Uy Tín An Toàn Nhanh Chóng</h2>
                        <p className="text-[20px]" style={{ color: 'var(--clr-txt-3)'}} >Tất cả sản phẩm đều được kiểm tra và bảo đảm cho quá trình sử dụng ổn định.</p>
                    </div>
                    <div className="hidden md:flex">
                        <div className="relative xl:top-[45px] md:top-[120px] left-1/2 transform -translate-x-1/2 -translate-y-2/3 z-10 "
                            style={{ width: "90%", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Image src="/images/Poster.png" alt="Logo" style={{ width: "100%", height: "auto", borderRadius: "5px" }} width={1000} height={100} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
