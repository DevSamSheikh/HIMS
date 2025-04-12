import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutWithSliderProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: string;
  backLinkText?: string;
  className?: string;
  currentStep?: string;
  image?: string;
}

const images = [
  {
    url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80",
    alt: "Modern hospital hallway",
    caption: "Advanced Healthcare Solutions",
  },
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
    alt: "Doctor with digital tablet",
    caption: "Streamlined Patient Management",
  },
  {
    url: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=1200&q=80",
    alt: "Medical technology",
    caption: "Integrated Medical Records",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    alt: "Medical professionals team",
    caption: "Collaborative Healthcare",
  },
  {
    url: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1200&q=80",
    alt: "Digital healthcare",
    caption: "Secure & Efficient Systems",
  },
];

const AuthLayoutWithSlider = ({
  children,
  title,
  subtitle,
  backLink,
  backLinkText,
  className,
  currentStep,
  image,
}: AuthLayoutWithSliderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* Left side - Image slider */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={image || images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-2xl font-bold">
                  {images[currentImageIndex].caption}
                </h2>
                <p className="text-sm opacity-80">
                  Healthcare Information Management System
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="absolute bottom-10 right-10 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 hover:text-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 hover:text-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/40"}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className={`w-full max-w-md space-y-8 ${className}`}>
          {backLink && (
            <div>
              <Link
                to={backLink}
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {backLinkText || "Back"}
              </Link>
            </div>
          )}

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutWithSlider;
