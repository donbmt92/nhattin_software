"use client";
import React from "react";
import Slider from "react-slick";

export default function GiftCards() {
    const settings = {
        centerMode: true, // Bật chế độ center mode
        centerPadding: "60px", // Khoảng cách xung quanh phần tử ở chế độ center
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false, // Optional: Add dots for navigation
        arrows: true, // Optional: Show arrows for navigation
        focusOnSelect: true, // Đảm bảo khi chọn slide, nó sẽ vào trung tâm
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1,
                }
            }
        ]
    };

    const giftCards = [
        { id: 1, name: "Razer Gold", image: "https://gamikey.com/wp-content/uploads/2024/09/Razer.jpg" },
        { id: 2, name: "Amazon", image: "https://gamikey.com/wp-content/uploads/2024/09/Amazone.jpg" },
        { id: 3, name: "iTunes", image: "https://gamikey.com/wp-content/uploads/2024/09/Itune.jpg" },
        { id: 4, name: "Tinder", image: "https://gamikey.com/wp-content/uploads/2024/09/Tinder.jpg" },
        { id: 5, name: "Spotify", image: "https://gamikey.com/wp-content/uploads/2024/09/Spotify.jpg" },
        { id: 6, name: "Netflix", image: "https://gamikey.com/wp-content/uploads/2024/09/Netflix.jpg" },
        { id: 7, name: "Google Play", image: "https://gamikey.com/wp-content/uploads/2024/09/Google.jpg" },
    ];

    return (
        <div className="container mx-auto py-[50px]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-center mb-2 uppercase">Comming Soon</h2>
                <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "40px", width: "140px", marginLeft: "auto", marginRight: "auto"}}/>
            </div>
            <Slider {...settings}>
                {giftCards.map((card) => (
                    <div key={card.id} className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-60 object-cover"
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
