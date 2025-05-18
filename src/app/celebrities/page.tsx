import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { CelebrityCard } from "../components/CelebrityCard";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const totalPages = 500;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}): Promise<Metadata> {
  const page = parseInt(searchParams.page || "1");
  return {
    title: `Popular Celebrities - Page ${page}`,
    description: `Discover the most popular celebrities right now. Browse page ${page} of trending actors and public figures.`,
  };
}

export default async function CelebritiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");

  const res = await fetch(
    `https://api.themoviedb.org/3/person/popular?page=${page}&api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  const celebrities = Array.isArray(data.results) ? data.results : [];

  const pageNumbersToShow = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (page > 3) pages.push(1, "…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…", totalPages);

    return [...new Set([...(page <= 3 ? [1, 2, 3] : []), ...pages])];
  };

  return (
    <main className="p-6 md:px-20 pt-20">
      <h1 className="text-3xl py-5 font-bold text-white mb-4">
        Popular Celebrities
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {celebrities.map((person: any) => (
          <CelebrityCard key={person.id} person={person} />
        ))}
      </div>

      <div className="flex justify-center mt-12 mb-5 items-center gap-2 text-white">
        {page > 1 && (
          <Link
            href={`/celebrities?page=${page - 1}`}
            className="px-3 py-2 rounded hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Link>
        )}

        {pageNumbersToShow().map((p, idx) =>
          p === "…" ? (
            <span key={idx} className="px-3 py-2 text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={idx}
              href={`/celebrities?page=${p}`}
              className={`px-3 py-2 rounded ${
                p === page
                  ? "bg-blue-700 text-white font-bold"
                  : "hover:bg-gray-800"
              }`}
            >
              {p}
            </Link>
          )
        )}

        {page < totalPages && (
          <Link
            href={`/celebrities?page=${page + 1}`}
            className="px-3 py-2 rounded hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        )}
      </div>
    </main>
  );
}
