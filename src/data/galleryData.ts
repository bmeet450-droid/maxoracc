// Import images for Phytography/Wildlife gallery
import phyto1 from "@/assets/gallery/phytography/DSC00491.jpg";
import phyto2 from "@/assets/gallery/phytography/DSC00500.jpg";
import phyto3 from "@/assets/gallery/phytography/DSC00507.jpg";
import phyto4 from "@/assets/gallery/phytography/DSC00514.jpg";
import phyto5 from "@/assets/gallery/phytography/DSC00540.jpg";
import phyto6 from "@/assets/gallery/phytography/DSC00559.jpg";
import phyto7 from "@/assets/gallery/phytography/DSC00572.jpg";
import phyto8 from "@/assets/gallery/phytography/DSC00591.jpg";

// Import images for The Human Frame gallery
import human1 from "@/assets/gallery/the-human-frame/DSC01261.jpg";
import human2 from "@/assets/gallery/the-human-frame/DSC01275.jpg";
import human3 from "@/assets/gallery/the-human-frame/DSC01491.jpg";
import human4 from "@/assets/gallery/the-human-frame/DSC01765.jpg";
import human5 from "@/assets/gallery/the-human-frame/DSC01768.jpg";
import human6 from "@/assets/gallery/the-human-frame/portrait-profile.jpg";
import human7 from "@/assets/gallery/the-human-frame/couple-station.jpg";
import human8 from "@/assets/gallery/the-human-frame/street-vendor.jpg";

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  aspectRatio?: string;
}

export interface ProjectGalleryData {
  slug: string;
  images: GalleryImage[];
}

export const galleryData: Record<string, GalleryImage[]> = {
  "phytography": [
    { id: 1, src: phyto1, alt: "Cedar branch with delicate foliage", aspectRatio: "3/4" },
    { id: 2, src: phyto2, alt: "Yellow tulip bud emerging", aspectRatio: "3/4" },
    { id: 3, src: phyto3, alt: "Green thistle flower bud", aspectRatio: "3/4" },
    { id: 4, src: phyto4, alt: "Mossy tree bark texture", aspectRatio: "3/4" },
    { id: 5, src: phyto5, alt: "Branch with red berry and raindrops", aspectRatio: "3/4" },
    { id: 6, src: phyto6, alt: "Holly leaves with dark berries", aspectRatio: "3/4" },
    { id: 7, src: phyto7, alt: "Maple leaves in forest shadow", aspectRatio: "3/4" },
    { id: 8, src: phyto8, alt: "Red roses with bokeh lights", aspectRatio: "3/4" },
  ],
  // Placeholder data for other projects - will be replaced with real images
  "tonal-alchemy": [
    { id: 1, src: "", alt: "Image 1", aspectRatio: "4/5" },
    { id: 2, src: "", alt: "Image 2", aspectRatio: "16/9" },
    { id: 3, src: "", alt: "Image 3", aspectRatio: "3/4" },
    { id: 4, src: "", alt: "Image 4", aspectRatio: "1/1" },
  ],
  "geometric-narratives": [
    { id: 1, src: "", alt: "Image 1", aspectRatio: "16/9" },
    { id: 2, src: "", alt: "Image 2", aspectRatio: "4/5" },
    { id: 3, src: "", alt: "Image 3", aspectRatio: "3/4" },
    { id: 4, src: "", alt: "Image 4", aspectRatio: "16/9" },
  ],
  "the-human-frame": [
    { id: 1, src: human1, alt: "Person walking through grand hallway with chandeliers", aspectRatio: "3/4" },
    { id: 2, src: human2, alt: "Silhouettes in historic building with candlelight", aspectRatio: "3/4" },
    { id: 3, src: human3, alt: "Person feeding pigeons on city street", aspectRatio: "3/4" },
    { id: 4, src: human4, alt: "Smiling woman with colorful scarf in snow", aspectRatio: "3/4" },
    { id: 5, src: human5, alt: "Man with MTA beanie smiling in winter", aspectRatio: "3/4" },
    { id: 6, src: human6, alt: "Portrait profile with bokeh lights", aspectRatio: "3/4" },
    { id: 7, src: human7, alt: "Couple at train station", aspectRatio: "3/4" },
    { id: 8, src: human8, alt: "Street vendor with crafts", aspectRatio: "16/9" },
  ],
  "dimensional-narratives": [
    { id: 1, src: "", alt: "Image 1", aspectRatio: "16/9" },
    { id: 2, src: "", alt: "Image 2", aspectRatio: "4/5" },
    { id: 3, src: "", alt: "Image 3", aspectRatio: "16/9" },
    { id: 4, src: "", alt: "Image 4", aspectRatio: "3/4" },
  ],
  "prism-composition": [
    { id: 1, src: "", alt: "Image 1", aspectRatio: "1/1" },
    { id: 2, src: "", alt: "Image 2", aspectRatio: "4/5" },
    { id: 3, src: "", alt: "Image 3", aspectRatio: "16/9" },
    { id: 4, src: "", alt: "Image 4", aspectRatio: "3/4" },
  ],
};

export const getGalleryImages = (slug: string): GalleryImage[] => {
  return galleryData[slug] || [];
};
