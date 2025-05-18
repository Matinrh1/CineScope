import { notFound } from "next/navigation";
import MovieCard from "@/app/components/MovieCard";
import SectionHeader from "@/app/components/SectionHeader";
import { format } from "date-fns";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function calculateAge(birthday: string): number {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
}

export default async function CelebrityDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const [personRes, imagesRes, creditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}`),
    fetch(
      `https://api.themoviedb.org/3/person/${id}/images?api_key=${TMDB_API_KEY}`
    ),
    fetch(
      `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${TMDB_API_KEY}`
    ),
  ]);

  if (!personRes.ok) return notFound();
  const person = await personRes.json();
  const imagesData = await imagesRes.json();
  const creditsData = await creditsRes.json();

  const age = person.birthday ? calculateAge(person.birthday) : null;
  const profileImage = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;

  return (
    <main className="p-6 md:px-20 pt-20 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {profileImage && (
          <div className="md:w-[30%] w-full">
            <img
              src={profileImage}
              alt={person.name}
              className="w-full h-auto max-h-[500px] rounded shadow-lg object-cover"
            />
          </div>
        )}
        <div className="md:w-[70%] flex flex-col justify-between w-full">
          <div className="">
            <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
            <h2 className="text-2xl text-gray-300 mt-5 font-bold mb-2">
              Biography
            </h2>
            <p className="whitespace-pre-line text-gray-300 font-semibold">
              {person.biography || "No biography available."}
            </p>
          </div>
          <div className="flex pt-8 text-xl space-x-4">
            <p className="mb-2">
              <strong>Birthday:</strong>{" "}
              {person.birthday
                ? format(new Date(person.birthday), "MMMM d, yyyy")
                : "Unknown"}{" "}
              ({age||" _"} years old)
            </p>
            <p className="">
              <strong>Place of Birth:</strong>{" "}
              {person.place_of_birth || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-10">
        <SectionHeader title="Images" href={`/celebrities/${id}/images`} />
        <div className="flex overflow-x-auto space-x-4 px-6 mr-6 pb-2">
          {imagesData.profiles.slice(0, 8).map((img: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[260px]"
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                alt={`${person.name} image ${index + 1}`}
                className="rounded shadow object-cover py-5 w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Castings */}

      <div className="my-20 mx-6">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-11">Known For</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {creditsData.cast
            .filter((item: any) => item.media_type === "movie")
            .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
            .slice(0, 20)
            .map((item: any) => (
              <div
                key={item.id}
                className="rounded overflow-hidden shadow hover:brightness-110 transition"
              >
                <MovieCard
                  movie={{
                    id: item.id,
                    title: item.title,
                    poster_path: item.poster_path,
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
