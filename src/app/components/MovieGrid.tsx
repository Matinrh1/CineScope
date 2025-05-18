import MovieCard from "./MovieCard";
import { Movie } from "../types/movie";

type Props = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: Props) {
  return (
    <div className="">
      <div className="grid grid-cols-2 sm:px-4 lg:px-8 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
