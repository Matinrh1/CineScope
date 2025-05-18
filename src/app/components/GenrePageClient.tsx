"use client";

import { useState, useEffect } from "react";
import GenreToolbar from "@/app/components/GenreToolbar";
import InfiniteGenreScroll from "@/app/components/InfiniteGenreScroll";
import { Movie } from "@/app/types/movie";
import { FeaturedMovie } from "@/app/components/FeaturedMovie";

interface Props {
  initialMovies: Movie[];
  genre: string;
}

export default function GenrePageClient({ initialMovies, genre }: Props) {
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`/genres/${genre}/1?sort_by=${sortBy}`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovies();
  }, [sortBy, genre]);

  const featuredMovieIndex = movies.findIndex((m) => m.backdrop_path);
  const featuredMovie =
    featuredMovieIndex >= 0 ? movies[featuredMovieIndex] : null;
  const restMovies = movies.filter((_, i) => i !== featuredMovieIndex);

  return (
    <>
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
      <GenreToolbar
        title={`${genre.replace("-", " ")} Movies`}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <InfiniteGenreScroll
        initialMovies={restMovies}
        genre={genre}
        sortBy={sortBy}
      />
    </>
  );
}
