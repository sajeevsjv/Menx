import React, { useState, useEffect, useRef } from "react";

const Carousel = () => {
  const images = [
    "./images/freepik16-9-export-20241118055251kHs1.jpeg",
    "./images/freepik16-9-export-20241118061906wRTB.jpeg",
    "",
    "",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null); // To track and clear intervals

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000); // 3 seconds per slide
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePrev = () => {
    stopAutoSlide();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    startAutoSlide(); // Restart auto-slide
  };

  const handleNext = () => {
    stopAutoSlide();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    startAutoSlide(); // Restart auto-slide
  };

  const handleDotClick = (index) => {
    stopAutoSlide();
    setCurrentIndex(index);
    startAutoSlide(); // Restart auto-slide
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide(); // Cleanup on unmount
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Dots Navigation Above Images */}
      <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 z-50 flex">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`mx-1 w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-400"
            } focus:outline-none`}
          ></button>
        ))}
      </div>

      {/* Carousel Images */}
      <div className="overflow-hidden rounded-lg h-full">
        <div
          className="flex transition-transform duration-500 h-[100%]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute z-50 top-1/2 left-2 transform -translate-y-1/2 text-2xl  text-gray-300 font-bold p-2 rounded-full focus:outline-none"
      >
        &#8249;
      </button>
      <button
        onClick={handleNext}
        className="absolute z-50 top-1/2 right-2 transform text-2xl -translate-y-1/2  text-gray-300 font-bold p-2 rounded-full focus:outline-none"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;
