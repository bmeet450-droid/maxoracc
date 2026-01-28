import { useState } from "react";
import LazyImage from "./LazyImage";
import Lightbox from "./Lightbox";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  aspectRatio?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  isVisible?: boolean;
}

const GalleryGrid = ({ images, isVisible = true }: GalleryGridProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transitionDelay: `${0.6 + index * 0.1}s`,
            }}
          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              aspectRatio={image.aspectRatio || "3/4"}
              className="rounded-lg"
              onClick={() => openLightbox(index)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentImageIndex}
      />
    </>
  );
};

export default GalleryGrid;
