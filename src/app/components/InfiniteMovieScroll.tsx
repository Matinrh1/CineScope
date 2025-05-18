"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MovieGrid from "@/app/components/MovieGrid";
import { Movie } from "@/app/types/movie";
import { setGlobalCursorWait } from "@/app/utils/cursor";

interface InfiniteMovieScrollProps {
  initialMovies: Movie[];
  type: string;
  sort?: string;
}

export default function InfiniteMovieScroll({
  initialMovies,
  sort = "popularity.desc", // default fallback
}: InfiniteMovieScrollProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(2);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMoviesByPage = useCallback(
    async (page: number) => {
      const url = `/discover-movies/api/${page}?sort_by=${sort}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API failed");

        return await res.json();
      } catch (err) {
        console.error("❌ Error fetching movies:", err);
        return [];
      }
    },
    [sort]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = Date.now();
          setGlobalCursorWait(true);

          const newMovies = await fetchMoviesByPage(page);

          const elapsed = Date.now() - startTime;
          const minDuration = 500;

          if (elapsed < minDuration) {
            await new Promise((resolve) =>
              setTimeout(resolve, minDuration - elapsed)
            );
          }

          setGlobalCursorWait(false);

          if (newMovies.length === 0) return;

          setMovies((prev) => {
            const combined = [...prev, ...newMovies];
            const unique = Array.from(
              new Map(combined.map((movie) => [movie.id, movie])).values()
            );
            return unique;
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

  useEffect(() => {
    setMovies(initialMovies);
    setPage(2);
  }, [sort]);

  return (
    <>
      <MovieGrid movies={movies} />
      <div ref={loaderRef} className="h-10 w-full bg-transparent" />
    </>
  );
}
