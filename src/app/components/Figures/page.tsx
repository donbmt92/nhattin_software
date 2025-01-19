import { faAlignJustify, faAlignLeft, faBookAtlas, faCertificate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function Figures() {
    const figures = [
        { name: "View", value: "1.2M", icons: faCertificate },
        { name: "Order", value: "1.2M", icons: faAlignLeft },
        { name: "Customer", value: "1.2M", icons: faAlignJustify },
        { name: "Product", value: "1.2M", icons: faBookAtlas },
    ]
    return (
        <div className="pb-[50px] pt-[100px]" style={{ backgroundColor: 'var(--clr-bg-1)' }}>
            <div className="container mx-auto" >
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
                    {figures.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 px-[50px] py-[20px] items-center justify-center" style={{ backgroundColor: "var(--clr-bg-4)", borderRadius: "10px"}}>
                            <div className=" col-span-2 w-full">
                                <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--clr-txt-3)"}}>{item.value}</h2>
                                <p className="text-xl font-extrabold" style={{ color: "var(--clr-txt-3)"}}>{item.name}</p>
                            </div>
                            <div className="flex mx-auto justify-center items-center">
                                <FontAwesomeIcon icon={item.icons} style={{ color: "var(--clr-txt-3)", width: "50px", height: "50px" }} />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
