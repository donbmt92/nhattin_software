import React from 'react'

export default function Sliders() {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mx-auto my-[50px] ">
                <div className="col-span-2 m-2 relative" style={{ flexBasis: "100%", backgroundColor: "var(--clr-bg-1)", borderRadius: "10px" }}>
                    <img src="images/Slider-1.png" alt="Images" className="w-[70%]" style={{borderRadius: "10px"}} />
                    <div className="absolute top-0 right-0">
                        <img src="images/Slider-7.png" alt="" className="w-[90%]" />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="flex-3 m-2" style={{ flexBasis: "100%" }}>
                        <img src="images/Slider-4.png" alt="Images" style={{ width: "100%", height: "100%", objectFit: "cover",  borderRadius: "10px" }} />
                    </div>
                    <div className="flex-3 m-2" style={{ flexBasis: "100%", height: "auto" }}>
                        <img src="images/Slider-3.png" alt="Images" style={{ width: "100%", height: "100%", objectFit: "cover",  borderRadius: "10px" }} />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="flex-3 m-2" style={{ flexBasis: "100%" }}>
                        <img src="images/Slider-2.png" alt="Images" style={{ width: "100%", height: "100%", objectFit: "cover",  borderRadius: "10px"}} />

                    </div>
                    <div className="flex-3 m-2 relative flex" style={{ flexBasis: "100%", height: "100px" }}>
                        <img src="images/Slider-5.png" alt="Images" style={{ width: "70%", height: "100%", objectFit: "cover", zIndex: 1, borderRadius: "10px" }} />
                        <div className="absolute inset-5 flex justify-start items-center z-10" style={{ pointerEvents: "none" }}  >
                            <img src="images/Slider-8.png" alt="" className="w-[50%] h-auto" />
                        </div>
                        <div className="flex justify-end items-center w-[35%]">
                            <img src="images/Slider-9.png" alt="Images" style={{ width: "auto", height: "100%", objectFit: "cover", zIndex: 1, backgroundColor: "var(--clr-bg-4)", margin: "0 0 0 20px", borderRadius: "10px", padding: "10px",}}/>
                        </div>

                    </div>
                    <div className="flex-3 m-2 flex" style={{ flexBasis: "100%", height: "70px" }}>   
                        <img src="images/Slider-6.png" alt="Images" style={{ width: "70px", height: "auto", objectFit: "cover", }} />
                        <div className="flex justify-center items-center m-4 font-semibold text-[20px]">
                            <h2>Xem Thêm Những Sản Phẩm</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
