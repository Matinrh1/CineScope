import Link from "next/link";
import { RippleButton } from "./RippleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  release_date: string;
};

type FeaturedMovieProps = {
  movie: Movie;
};

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  if (!movie || !movie.backdrop_path) {
    return null;
  }
  return (
    <div className="relative h-[75vh] sm:h-screen w-full overflow-hidden mb-4 border-b border-gray-800">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="object-cover brightness-85 w-full h-full absolute top-0 left-0"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-7 left-4 pr-5 space-y-3 sm:space-y-6 text-white z-10">
        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold">
          {movie.title}
          {movie.release_date && (
            <span className="sm:text-2xl pl-3 font-light">
              ({new Date(movie.release_date).getFullYear()})
            </span>
          )}
        </h1>

        <p className="text-sm sm:text-xl max-w-xl">
          <span className="block sm:hidden">
            {movie.overview.length > 200
              ? movie.overview.slice(0, 200) + "..."
              : movie.overview}
          </span>
          <span className="hidden sm:block">{movie.overview}</span>
        </p>

        <Link href={`/movies/${movie.id}`} passHref>
          <RippleButton className="group relative flex items-center rounded-full border border-blue-500 text-blue-500 transition-all duration-300 hover:border-blue-300 hover:bg-blue-900/10 w-25 sm:w-10 sm:hover:w-32">
            <div className="flex items-center justify-center sm:w-10 w-6 h-8 sm:h-10">
              <FontAwesomeIcon icon={faInfo} className="text-sm pl-1 sm:pl-4" />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold sm:opacity-0 sm:ml-2 group-hover:opacity-100 transition-opacity duration-300">
              More Info
            </span>
          </RippleButton>
        </Link>
      </div>
    </div>
  );
}
