import { notFound } from "next/navigation";
import {
  ImageProvider,
  MainImageDisplay,
  Thumbnail,
  ImageSwiperController,
} from "@/app/components/ClientImage";
import { RippleButton } from "@/app/components/RippleButton";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default async function CelebrityImagesPage({
  params,
}: {
  params: { id: string };
}) {
  const [imagesRes, personRes] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/person/${params.id}/images?api_key=${TMDB_API_KEY}`
    ),
    fetch(
      `https://api.themoviedb.org/3/person/${params.id}?api_key=${TMDB_API_KEY}`
    ),
  ]);

  if (!imagesRes.ok || !personRes.ok) return notFound();

  const imagesData = await imagesRes.json();
  const personData = await personRes.json();
  const defaultImage = imagesData.profiles?.[0]?.file_path;

  return (
    <main className="p-2 sm:p-6 md:px-20 mb-5 pt-20 h-screen space-y-6 sm:space-y-0 text-white sm:flex gap-6">
      <ImageProvider initialImage={defaultImage}>
        {/* Left 70% - Main Image + Name */}
        <div className="sm:w-[70%] flex flex-col bg-zinc-900 rounded-md">
          <div className="flex justify-center">
            <MainImageDisplay />
          </div>

          <ImageSwiperController
            images={imagesData.profiles.map((img: any) => img.file_path)}
          />

          {/* Name + Avatar */}
          <div className="flex justify-center sm:justify-start items-center px-5 gap-4 py-4">
            <img
              src={`https://image.tmdb.org/t/p/w185${personData.profile_path}`}
              alt={personData.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <a
              href={`/celebrities/${personData.id}`}
              className="text-lg font-semibold text-blue-500 hover:text-blue-400"
            >
              {personData.name}
            </a>
          </div>
        </div>

        {/* Right 30% - Thumbnails */}
        <div className=" sm:w-[30%] bg-zinc-900 rounded-md p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Images</h2>
            <p className="text-sm pt-1 text-gray-400">
              {imagesData.profiles.length} Image(s)
            </p>
          </div>

          <div className="overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              {imagesData.profiles.map((img: any, index: number) => (
                <RippleButton key={index}>
                  <Thumbnail key={index} src={img.file_path} />
                </RippleButton>
              ))}
            </div>
          </div>
        </div>
      </ImageProvider>
    </main>
  );
}
