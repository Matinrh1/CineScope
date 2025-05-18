import { notFound } from "next/navigation";
import {
  ImageProvider,
  MainImageDisplay,
  Thumbnail,
  ImageSwiperController,
} from "@/app/components/ClientImage";
import { RippleButton } from "@/app/components/RippleButton";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default async function MovieImagesPage({
  params,
}: {
  params: { id: string };
}) {
  const [imagesRes, movieRes] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/movie/${params.id}/images?api_key=${TMDB_API_KEY}`
    ),
    fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?api_key=${TMDB_API_KEY}`
    ),
  ]);

  if (!imagesRes.ok || !movieRes.ok) return notFound();

  const imagesData = await imagesRes.json();
  const movieData = await movieRes.json();
  const defaultImage = imagesData.backdrops?.[0]?.file_path;

  return (
    <main className="p-2  md:px-20 mb-5 pt-20 h-screen space-y-6 sm:space-y-0 text-white sm:flex gap-6">
      <ImageProvider initialImage={defaultImage}>
        {/* Left Section - Main Image + Movie Info */}
        <div className="sm:w-[70%] flex flex-col bg-zinc-900 rounded-md">
          <div className="flex justify-center">
            <MainImageDisplay />
          </div>

          <ImageSwiperController
            images={imagesData.backdrops.map((img: any) => img.file_path)}
          />

          {/* Poster + Title */}
          <div className="flex justify-center sm:justify-start items-center px-5 gap-4 py-4">
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

        {/* Right Section - Thumbnails */}
        <div className="sm:w-[30%] bg-zinc-900 rounded-md p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Images</h2>
            <p className="text-sm pt-1 text-gray-400">
              {imagesData.backdrops.length} Image(s)
            </p>
          </div>

          <div className="overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              {imagesData.backdrops.map((img: any, index: number) => (
                <RippleButton key={index}>
                  <Thumbnail src={img.file_path} />
                </RippleButton>
              ))}
            </div>
          </div>
        </div>
      </ImageProvider>
    </main>
  );
}
