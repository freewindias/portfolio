"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
        {images.map((image, index) => {
          const isRightCol = index % 2 === 1;
          const isLastRow =
            index >= images.length - (images.length % 2 === 0 ? 2 : 1);

          return (
            <div
              key={index}
              className={`overflow-hidden border-border cursor-pointer group ${isRightCol ? "md:border-l" : ""} ${!isLastRow ? "border-b" : ""}`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={image}
                  alt={`${title} - ${index + 1}`}
                  width={600}
                  height={400}
                  className="object-cover hover:scale-105 transition-all duration-500 ease-in-out"
                />
              </div>
            </div>
          );
        })}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-9999 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10000 p-3 text-foreground/70 hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-border/50"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10000 p-3 md:p-4 text-foreground/70 hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-border/50"
                aria-label="Previous Image"
              >
                <ChevronLeft className="size-6 md:size-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10000 p-3 md:p-4 text-foreground/70 hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-border/50"
                aria-label="Next Image"
              >
                <ChevronRight className="size-6 md:size-8" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full max-w-7xl max-h-[85vh] pointer-events-auto">
              <Image
                src={images[currentIndex]}
                alt={`${title} - Gallery Detail`}
                fill
                className="object-contain animate-in zoom-in-95 duration-500"
                priority
              />
            </div>
          </div>

          {/* Mobile Swipe/Tap Hints or Counter */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/40 text-xs font-semibold tracking-widest uppercase bg-white/5 px-4 py-2 rounded-full border border-border/50">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
