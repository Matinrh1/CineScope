import React from "react";
import { FeaturedMovie } from "../components/FeaturedMovie";
import InfiniteMovieScroll from "../components/InfiniteMovieScroll";
import {
  fetchTopRatedMovies,
  fetchTopRatedMoviesByPage,
} from "../utils/lib/tmdb";

export default async function TopRatedPage() {
  const movies = await fetchTopRatedMovies();

  if (!movies || movies.length === 0) {
    return <div>No movies found.</div>;
  }

  const [featuredMovie, ...restMovies] = movies;

  return (
    <main>
      <FeaturedMovie movie={featuredMovie} />

      <h2 className="p-5 my-5 text-2xl sm:text-4xl text-white font-semibold">
        Top Rated Movies
      </h2>

      <InfiniteMovieScroll initialMovies={movies} type="top_rated" />
    </main>
  );
}
