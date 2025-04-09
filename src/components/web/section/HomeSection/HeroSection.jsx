"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import img1 from "../../../../../public/images/hero_1.jpg";
import img2 from "../../../../../public/images/careers2.png";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      image: img1,
      title: "MAKE IT AI",
      subtitle: "EFFICIENT & COST-EFFECTIVE",
      buttons: [
        { text: "Try our Chatbot", className: "bg-primary" },
        {
          text: "Request Demo",
          className: "bg-transparent border border-white",
        },
      ],
    },
    {
      image: img2,
      title: "SMART REAL ESTATE CRM",
      subtitle: "AUTOMATE & SCALE EFFORTLESSLY",
      buttons: [
        { text: "Try our Chatbot", className: "bg-primary" },
        {
          text: "Request Demo",
          className: "bg-transparent border border-white",
        },
      ],
    },
  ];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Image with overlay */}
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 drop-shadow-lg">
              {slide.subtitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {slide.buttons.map((button, btnIndex) => (
                <button
                  key={btnIndex}
                  className={`${button.className} px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
