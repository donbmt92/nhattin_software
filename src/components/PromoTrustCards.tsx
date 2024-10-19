import React from 'react';
import { Shield, Clover } from 'lucide-react';

export default function PromoTrustCards() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"  style={{ maxWidth: '85rem' }}>
            <div className="flex flex-row gap-4">
                {/* Promotional Card */}
                <div className="flex-1 bg-green-500 rounded-lg p-6 text-white flex items-center justify-between">
                    <div className="flex items-center p-4 space-x-4">
                        <h2 className="text-xl font-bold tracking-wide">MUA HÀNG HÔM NAY</h2>
                        <p className="text-3xl font-extrabold tracking-wider">ƯU ĐÃI LỚN</p>
                    </div>
                    <Clover className="text-white" size={45}/>
                </div>

                {/* Trust and Safety Card */}
                <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center"> {/* Changed from items-start to items-center */}
                        <div className="flex items-center justify-center"> {/* New container for SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="51" viewBox="0 0 44 51"
                                 fill="none" className="flex-shrink-0">
                                <g clipPath="url(#clip0_1_1175)">
                                    <path
                                        d="M42.3327 13.221C42.2727 11.9013 42.2727 10.6417 42.2727 9.38215C42.2727 8.36241 41.4929 7.58264 40.4733 7.58264C32.9755 7.58264 27.2772 5.42329 22.5386 0.804666C21.8188 0.144864 20.7391 0.144864 20.0194 0.804666C15.2808 5.42329 9.58249 7.58264 2.08473 7.58264C1.06504 7.58264 0.285273 8.36241 0.285273 9.38215C0.285273 10.6417 0.285273 11.9013 0.225291 13.221C-0.0146371 25.8172 -0.374531 43.092 20.6791 50.3499L21.279 50.4698L21.8789 50.3499C42.8725 43.092 42.5726 25.8772 42.3327 13.221ZM19.8394 30.6757C19.4795 30.9757 19.0597 31.1556 18.5798 31.1556H18.5198C18.04 31.1556 17.5601 30.9157 17.2602 30.5558L11.6819 24.3777L14.3811 21.9783L18.7597 26.8368L28.4769 17.5996L30.9361 20.2388L19.8394 30.6757Z"
                                        fill="#5BC014"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_1175">
                                        <rect width="42.9943" height="50.16" fill="white"
                                              transform="translate(0.17041 0.309814)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className="ml-4 flex">
                            <h2 className="font-bold text-xl mb-1">
                                <span className="text-green-500">UY TÍN</span><br/>
                                <span className="text-blue-900">AN TOÀN</span><br/>
                                <span className="text-red-500">NHANH CHÓNG</span>
                            </h2>
                            <p className="text-xl text-gray-600 mt-1 leading-tight">
                                TẤT CẢ SẢN PHẨM ĐỀU ĐƯỢC KIỂM TRA <br/>
                                VÀ BẢO ĐẢM CHO QUÁ TRÌNH SỬ DỤNG ỔN ĐỊNH.
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
