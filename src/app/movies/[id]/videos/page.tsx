import { notFound } from "next/navigation";
import {
  VideoProvider,
  VideoPlayer,
  VideoThumbnail,
  VideoSwiperController,
} from "@/app/components/ClientVideo";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default async function MovieVideosPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch video data
  const videosRes = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${TMDB_API_KEY}`
  );
  
  // Fetch movie details
  const movieRes = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${TMDB_API_KEY}`
  );

  // Check if either request fails
  if (!videosRes.ok || !movieRes.ok) return notFound();

  const videosData = await videosRes.json();
  const movieData = await movieRes.json();

  if (videosData.results.length === 0) return notFound();

  return (
    <main className="p-6 md:px-20 mb-5 pt-20 h-screen text-white flex gap-6">
      <VideoProvider initialVideoKey={videosData.results[0].key}>
        {/* Left 70% - Main Video */}
        <div className="w-[70%] flex flex-col bg-zinc-900 rounded-md">
          <div className="flex justify-center">
            <VideoPlayer /> 
          </div>
          <VideoSwiperController videos={videosData.results} />
          <div className="flex items-center px-5 gap-4 py-4">
            <img
              src={`https://image.tmdb.org/t/p/w185${movieData.poster_path}`}
              alt={movieData.title}
              className="w-12 h-12 rounded-full object-cover"
            />
            <a
              href={`/movies/${movieData.id}`}
              className="text-lg font-semibold text-blue-500 hover:text-blue-400"
            >
              {movieData.title}
            </a>
          </div>
        </div>

        {/* Right 30% - Video Thumbnails */}
        <div className="w-[30%] bg-zinc-900 rounded-md p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Videos</h2>
            <p className="text-sm pt-1 text-gray-400">
              {videosData.results.length} Video(s)
            </p>
          </div>

          <div className="overflow-y-auto pr-1">
            <div className="gap-4">
              {videosData.results.slice(1).map((video: any, index: number) => (
              <VideoThumbnail
              key={index}
              videoKey={video.key}
              title={video.name}
              type={video.type} 
            />
              ))}
            </div>
          </div>
        </div>

      </VideoProvider>
    </main>
  );
}
