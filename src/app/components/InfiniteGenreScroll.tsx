"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MovieGrid from "@/app/components/MovieGrid";
import { Movie } from "@/app/types/movie";
import { setGlobalCursorWait } from "@/app/utils/cursor";

interface Props {
  initialMovies: Movie[];
  genre: string;
  sortBy: string; // NEW
}

export default function InfiniteGenreScroll({ initialMovies, genre, sortBy }: Props) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(2);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMoviesByPage = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/genres/${genre}/${page}?sort_by=${sortBy}`);
      if (!res.ok) throw new Error("API failed");
      return await res.json();
    } catch (err) {
      console.error("❌ Error fetching genre movies:", err);
      return [];
    }
  }, [genre, sortBy]);

  // Reset when sortBy or genre changes
  useEffect(() => {
    async function resetMovies() {
      try {
        const res = await fetch(`/genres/${genre}/1?sort_by=${sortBy}`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
        setPage(2);
      } catch (error) {
        console.error("❌ Error resetting movies:", error);
      }
    }

    resetMovies();
  }, [genre, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = Date.now();
          setGlobalCursorWait(true);

          const newMovies: Movie[] = await fetchMoviesByPage(page);

          const elapsed = Date.now() - startTime;
          const minDuration = 500;
          if (elapsed < minDuration) {
            await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
          }

          setGlobalCursorWait(false);

          if (newMovies.length === 0) return;

          setMovies((prev) => {
            const existingIds = new Set(prev.map((movie) => movie.id));
            const filteredNew = newMovies.filter((movie) => !existingIds.has(movie.id));
            return [...prev, ...filteredNew];
          });

          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      document.body.style.cursor = "auto";
    };
  }, [fetchMoviesByPage, page]);

  return (
    <>
      <MovieGrid movies={movies} />
      <div ref={loaderRef} className="h-10 w-full bg-transparent" />
    </>
  );
}
