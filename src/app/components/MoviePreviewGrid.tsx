import MovieCard from './MovieCard';
import { Movie } from '../types/movie';

type Props = {
  movies: Movie[];
};

export default function MoviePreviewGrid({ movies }: Props) {
  return (
    <div className="flex overflow-x-auto space-x-4 px-2  sm:px-4 lg:px-8 py-2 sm:pb-10">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[280px]"
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
