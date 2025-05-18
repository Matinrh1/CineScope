"use client";
import { useState, createContext, useContext } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { RippleButton } from "./RippleButton";

const ImageContext = createContext<{
  currentImage: string;
  setCurrentImage: (src: string) => void;
} | null>(null);

export function ImageProvider({
  children,
  initialImage,
}: {
  children: React.ReactNode;
  initialImage: string;
}) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  return (
    <ImageContext.Provider value={{ currentImage, setCurrentImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export function MainImageDisplay() {
  const ctx = useContext(ImageContext);
  if (!ctx) return null;

  return (
    <img
      src={`https://image.tmdb.org/t/p/w780${ctx.currentImage}`}
      alt="Main"
      className="rounded-sm h-[65vh] shadow object-cover"
    />
  );
}

export function Thumbnail({ src }: { src: string }) {
  const ctx = useContext(ImageContext);
  if (!ctx) return null;

  return (
    <img
      src={`https://image.tmdb.org/t/p/w185${src}`}
      alt="Thumbnail"
      className="w-full rounded cursor-pointer hover:opacity-80"
      onClick={() => ctx.setCurrentImage(src)}
    />
  );
}

export function ImageSwiperController({ images }: { images: string[] }) {
  const ctx = useContext(ImageContext);
  if (!ctx) return null;

  const currentIndex = images.findIndex((img) => img === ctx.currentImage);

  const handleSlideChange = (direction: "next" | "prev") => {
    let newIndex = currentIndex + (direction === "next" ? 1 : -1);
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    ctx.setCurrentImage(images[newIndex]);
  };

  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <RippleButton>
        <p
          className="text-white hover:bg-zinc-700 px-3 py-2 "
          onClick={() => handleSlideChange("prev")}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </p>
      </RippleButton>
      <RippleButton>
        <p
          className="text-white hover:bg-zinc-700 px-3 py-2 "
          onClick={() => handleSlideChange("next")}
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </p>
      </RippleButton>
    </div>
  );
}
