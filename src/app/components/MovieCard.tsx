import Link from "next/link";
import { RippleButton } from "./RippleButton";

type Props = {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average?: number;
    release_date?: string;
  };
};

export default function MovieCard({ movie }: Props) {
  return (
    <RippleButton>
      <Link href={`/movies/${movie.id}`} passHref>
        <div className="bg-black text-white cursor-pointer rounded-sm shadow hover:scale-101 hover:brightness-110 transition-transform duration-300">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded mb-2 w-full h-auto"
          />
          <div className="px-3 space-y-5 pb-2">
            <h2 className="font-semibold line-clamp-2">{movie.title}</h2>
            <div className="text-sm text-gray-400 flex justify-between mt-1">
              <span>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : ""}
              </span>
              {movie.vote_average !== undefined && (
                <span className="text-yellow-400">
                  ⭐ {movie.vote_average.toFixed(2)} / 10
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </RippleButton>
  );
}
