"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Sliders() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/images/Slider-1.png",
    "/images/Slider-4.png",
    "/images/Slider-3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mx-auto my-[50px] ">
        <div
          className="col-span-2 m-2 relative"
          style={{
            flexBasis: "100%",
            backgroundColor: "var(--clr-bg-1)",
            borderRadius: "10px",
            overflow: "hidden",
            height: "415px",
          }}
        >
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  zIndex: currentSlide === index ? 1 : 0,
                }}
              >
                <Image
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full"
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                  width={1000}
                  height={500}
                  priority
                />
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg max-w-md text-center">
              <h2 className="text-2xl font-bold mb-2">Special Offers</h2>
              <p className="mb-4">
                Discover our latest products with amazing discounts
              </p>
              <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">
                Shop Now
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-white scale-125"
                    : "bg-gray-400 bg-opacity-50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="flex-3 m-2" style={{ flexBasis: "100%", height: "200px" }}>
            <Image
              src="/images/Slider-4.png"
              alt="Images"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              width={500}
              height={500}
            />
          </div>
          <div
            className="flex-3 m-2"
            style={{ flexBasis: "100%", height: "200px" }}
          >
            <Image
              src="/images/Slider-3.png"
              alt="Images"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              width={500}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
