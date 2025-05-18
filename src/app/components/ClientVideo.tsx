"use client";

import { useState, createContext, useContext } from "react";
import { RippleButton } from "./RippleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const VideoContext = createContext<{
  currentVideoKey: string;
  setCurrentVideoKey: (key: string) => void;
} | null>(null);

export function VideoProvider({
  children,
  initialVideoKey,
}: {
  children: React.ReactNode;
  initialVideoKey: string;
}) {
  const [currentVideoKey, setCurrentVideoKey] = useState(initialVideoKey);
  return (
    <VideoContext.Provider value={{ currentVideoKey, setCurrentVideoKey }}>
      {children}
    </VideoContext.Provider>
  );
}

export function VideoPlayer() {
  const ctx = useContext(VideoContext);
  if (!ctx) return null;

  return (
    <iframe
      width="80%"
      height="470"
      src={`https://www.youtube.com/embed/${ctx.currentVideoKey}`}
      title="Main Video"
      className="rounded-sm shadow-lg"
      allowFullScreen
    />
  );
}

export function VideoThumbnail({
  videoKey: key,
  title,
  type,
}: {
  videoKey: string;
  title: string;
  type: string; 
}) {
  const ctx = useContext(VideoContext);
  if (!ctx) return null;

  return (
    <div className="cursor-pointer hover:opacity-80" onClick={() => ctx.setCurrentVideoKey(key)}>
      <img
        src={`https://img.youtube.com/vi/${key}/hqdefault.jpg`}
        alt={title}
        className="rounded-sm w-full h-[150px] object-cover"
      />
      <p className="text-md text-white my-2">{title}</p>
      <p className="text-sm text-gray-400 mb-10">{type}</p> {/* Display video type under the title */}
    </div>
  );
}

export function VideoSwiperController({ videos }: { videos: { key: string; name: string; type: string }[] }) {
  const ctx = useContext(VideoContext);
  if (!ctx) return null;

  const currentIndex = videos.findIndex((video) => video.key === ctx.currentVideoKey);

  const handleSlideChange = (direction: "next" | "prev") => {
    let newIndex = currentIndex + (direction === "next" ? 1 : -1);
    if (newIndex < 0) newIndex = videos.length - 1;
    if (newIndex >= videos.length) newIndex = 0;
    ctx.setCurrentVideoKey(videos[newIndex].key);
  };

  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <RippleButton>
        <p
          className="text-white hover:bg-zinc-700 px-3 py-2"
          onClick={() => handleSlideChange("prev")}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </p>
      </RippleButton>
      <RippleButton>
        <p
          className="text-white hover:bg-zinc-700 px-3 py-2"
          onClick={() => handleSlideChange("next")}
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </p>
      </RippleButton>
    </div>
  );
}
