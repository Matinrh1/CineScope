import { Metadata } from "next";
import SectionHeader from "@/app/components/SectionHeader";
import Link from "next/link";
import PeopleGrid from "@/app/components/PeopleGrid";
import MovieGrid from "@/app/components/MovieGrid";
import Image from "next/image";
import { Movie } from "@/app/types/movie";
import { RippleButton } from "@/app/components/RippleButton";

type MovieDetails = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  videos: { results: { key: string; name: string }[] }; // For videos
  images: { backdrops: { file_path: string }[] }; // For images
  cast: { id: number; name: string; profile_path: string }[]; // For cast
  recommendations: {
    results: Movie[];
  };
  // For recommendations
};
async function getMovie(id: string): Promise<MovieDetails> {
  const [detailsRes, creditsRes, videosRes, imagesRes, recsRes] =
    await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      ),
    ]);
  if (!detailsRes.ok)
    throw new Error(`Failed to fetch movie details: ${detailsRes.status}`);
  if (!creditsRes.ok)
    throw new Error(`Failed to fetch credits: ${creditsRes.status}`);
  if (!videosRes.ok)
    throw new Error(`Failed to fetch videos: ${videosRes.status}`);
  if (!imagesRes.ok)
    throw new Error(`Failed to fetch images: ${imagesRes.status}`);
  if (!recsRes.ok)
    throw new Error(`Failed to fetch recommendations: ${recsRes.status}`);

  const [details, credits, videos, images, recommendations] = await Promise.all(
    [
      detailsRes.json(),
      creditsRes.json(),
      videosRes.json(),
      imagesRes.json(),
      recsRes.json(),
    ]
  );

  return {
    ...details,
    cast: credits.cast,
    videos,
    images,
    recommendations,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const movie = await getMovie(params.id);
  return {
    title: movie.title,
    description: movie.overview,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);

  return (
    <div className="text-white">
      <div className="relative h-screen w-full overflow-hidden mb-10 border-b border-gray-800">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="object-cover brightness-85 w-full h-full absolute top-0 left-0"
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-10 left-6 space-y-3 sm:space-y-6 text-white z-10 max-w-3xl">
          <div className="sm:flex space-y-1 sm:items-end">
            <h1 className="text-2xl sm:text-3xl md:text-4xl  lg:text-5xl font-bold">
              {movie.title}
            </h1>
            <span className="text-2xl font-light sm:pl-3">
              {movie.release_date}
            </span>
          </div>
          {movie.tagline && (
            <p className="italic text-gray-300 text-xl ">"{movie.tagline}"</p>
          )}
          <p className="text-sm text-gray-300 sm:text-white sm:text-lg max-w-xl">
            <span className="block sm:hidden">
              {movie.overview}
            </span>
            <span className="hidden sm:block">{movie.overview}</span>
          </p>
          <div className="flex gap-6 text-gray-300">
            <span className="sm:flex flex-wrap gap-2 items-center">
              <strong className="whitespace-nowrap">Genres:</strong>
              {movie.genres.map((genre, idx) => (
               <div className=""> 
                 <RippleButton key={genre.id}>
                  <Link
                    href={`/genres/${genre.name.toLowerCase()}`}
                    className="text-blue-400 sm:hover:underline"
                  >
                    {genre.name}
                    {idx !== movie.genres.length - 1 && <span>,</span>}
                  </Link>
                </RippleButton>
               </div>
              ))}
            </span>
            <span className="flex flex-col sm:block">
              <strong>Runtime:</strong> <span>{movie.runtime || "NA"} mins</span>
            </span>
            <span className="flex flex-col sm:block">
              <strong>Rating:</strong> <span >⭐ {movie.vote_average.toFixed(1)} / 10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sections: Videos, Images, Cast, Recommendations */}
      <div className="space-y-10 sm:px-10">
        {/* 🎬 Videos */}
        <section>
          <SectionHeader title="Videos" href={`/movies/${movie.id}/videos`} />
          {movie.videos.results.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 px-4">
              {movie.videos.results.slice(0, 10).map((video) => (
                <iframe
                  key={video.key}
                  width="400"
                  height="250"
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  className="rounded-sm pb-5 shadow-lg flex-shrink-0"
                  allowFullScreen
                />
              ))}
            </div>
          ) : (
            <p className="px-4 text-gray-400 italic">
              No videos found for this movie.
            </p>
          )}
        </section>

        {/* 🖼️ Images */}
        <section>
          <SectionHeader title="Images" href={`/movies/${movie.id}/images`} />
          {movie.images.backdrops.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 px-4">
              {movie.images.backdrops.slice(0, 10).map((img, index) => (
                <Image
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                  alt="Movie backdrop"
                  width={400}
                  height={250}
                  className="rounded-sm pb-5 shadow-md flex-shrink-0"
                />
              ))}
            </div>
          ) : (
            <p className="px-4 text-gray-400 italic">
              No images found for this movie.
            </p>
          )}
        </section>

        {/* 👥 Cast */}
        <section>
          <h2 className="text-2xl sm:text-4xl mt-35 font-semibold mb-8 ml-2 sm:ml-9">
            Cast
          </h2>
          {movie.cast.length > 0 ? (
            <PeopleGrid people={movie.cast.slice(0, 10)} />
          ) : (
            <p className="px-4 text-gray-400 italic ml-9">
              No cast information available.
            </p>
          )}
        </section>

        {/* 📽️ Recommendations */}
        <section className="my-20">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-5 sm:mb-11  ml-2 sm:ml-9">
            Recommendations
          </h2>
         <div className="px-2">
           {movie.recommendations.results.length > 0 ? (
            <MovieGrid movies={movie.recommendations.results.slice(0, 12)} />
          ) : (
            <p className="px-4 text-gray-400 italic ml-9">
              No recommendations found.
            </p>
          )}
         </div>
        </section>
      </div>
    </div>
  );
}
