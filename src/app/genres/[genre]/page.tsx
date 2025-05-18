import { fetchMoviesByGenre } from "@/app/utils/lib/tmdb";
import { notFound } from "next/navigation";
import { GENRE_SLUGS } from "@/app/utils/lib/GENRE_SLUGS";
import GenrePageClient from "@/app/components/GenrePageClient";

type Props = {
  params: { genre: string };
};

export default async function GenrePage({ params }: Props) {
  const genreParam = params.genre.toLowerCase().replace(/%20/g, "-");
  const genreId = GENRE_SLUGS[genreParam];

  if (!genreId) return notFound();

  const movies = await fetchMoviesByGenre(genreId);
  if (!movies || movies.length === 0) return notFound();

  return (
    <div>
      <GenrePageClient initialMovies={movies} genre={genreParam} />
    </div>
  );
}
