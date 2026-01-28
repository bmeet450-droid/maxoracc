import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/data/galleryData";

const projects = [
  {
    id: 1,
    slug: "tonal-alchemy",
    title: "Tonal Alchemy",
    category: "Enhanced",
    year: "2024",
    description: "A study in light and shadow, exploring the depths of visual enhancement.",
  },
  {
    id: 2,
    slug: "phytography",
    title: "Phytography",
    category: "Wildlife",
    year: "2024",
    description: "Capturing the untamed beauty of nature through a refined lens.",
  },
  {
    id: 3,
    slug: "geometric-narratives",
    title: "Geometric Narratives",
    category: "Architecture",
    year: "2023",
    description: "Where structure meets story, architecture becomes art.",
  },
  {
    id: 4,
    slug: "the-human-frame",
    title: "The Human Frame",
    category: "Art Direction",
    year: "2024",
    description: "Exploring the intersection of human form and artistic vision.",
  },
  {
    id: 5,
    slug: "dimensional-narratives",
    title: "Dimensional Narratives",
    category: "Interior Design",
    year: "2023",
    description: "Transforming spaces into visual stories through thoughtful composition.",
  },
  {
    id: 6,
    slug: "prism-composition",
    title: "Prism Composition",
    category: "Perspective Design",
    year: "2024",
    description: "Bending light and perspective to create new visual dimensions.",
  },
];

const ProjectGallery = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [headingParallax, setHeadingParallax] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const project = projects.find((p) => p.slug === slug);
  const galleryImages = slug ? getGalleryImages(slug) : [];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const offset = (clampedProgress - 0.5) * 80;

      setHeadingParallax(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!project) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <CustomCursor />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 group"
      >
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
        </svg>
        <span className="text-sm tracking-wide">Back</span>
      </button>

      {/* Header Section */}
      <section className="pt-32 md:pt-48 px-6 md:px-12 lg:px-20 pb-16">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <h1
              ref={headingRef}
              className="text-white text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tighter mb-8 whitespace-nowrap"
              style={{
                transform: `translateY(${headingParallax}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {project.category}
            </h1>
            <div
              className="w-full bg-white py-1 sm:py-2 flex justify-between px-4 sm:px-8 md:px-16 transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0) scaleY(1)" : "translateY(10px) scaleY(0.8)",
                transitionDelay: "0.3s",
              }}
            >
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">{project.title}</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">{project.year}</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">{project.category}</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Gallery</span>
            </div>
          </div>

          {/* Project Description */}
          <p
            className="text-white/60 text-lg md:text-xl max-w-2xl mt-12 font-light transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.5s",
            }}
          >
            {project.description}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-[1600px] mx-auto">
          {galleryImages.length > 0 && galleryImages[0].src ? (
            <GalleryGrid images={galleryImages} isVisible={isVisible} />
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">Gallery images coming soon...</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectGallery;
