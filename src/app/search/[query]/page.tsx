import { searchMovies, searchPeople } from "@/app/utils/lib/tmdb";
import MoviePreviewGrid from "@/app/components/MoviePreviewGrid";
import PeopleGrid from "@/app/components/PeopleGrid";

type SearchPageProps = {
  params: { query: string };
};

export default async function SearchPage({ params }: SearchPageProps) {
  const decodedQuery = decodeURIComponent(params.query);

  const [movies, people] = await Promise.all([
    searchMovies(decodedQuery),
    searchPeople(decodedQuery),
  ]);

  const hasResults = (movies && movies.length > 0) || (people && people.length > 0);

  if (!hasResults) {
    return (
      <div className="text-center text-white mt-10">
        No results found for <strong>{decodedQuery}</strong>
      </div>
    );
  }

  // Sort movies: those with poster_path first
  const sortedMovies = [...movies].sort((a, b) => {
    if (a.poster_path && !b.poster_path) return -1;
    if (!a.poster_path && b.poster_path) return 1;
    return 0;
  });

  // Sort people: those with profile_path first
  const sortedPeople = [...people].sort((a, b) => {
    if (a.profile_path && !b.profile_path) return -1;
    if (!a.profile_path && b.profile_path) return 1;
    return 0;
  });

  return (
    <div className="sm:px-20 py-20">
      <h1 className="text-white text-2xl mb-6">
        Search results for: <strong>{decodedQuery}</strong>
      </h1>

      <div>
        <h2 className="text-3xl font-bold text-white mt-8 py-2 mb-4">Movies</h2>
        {sortedMovies.length > 0 ? (
          <MoviePreviewGrid movies={sortedMovies.slice(0,20)} />
        ) : (
          <p className="text-white">No movies found for <strong>{decodedQuery}</strong>.</p>
        )}

        <h2 className="text-3xl font-bold text-white mt-8 py-2 mb-4">Celebrities</h2>
        {sortedPeople.length > 0 ? (
          <PeopleGrid people={sortedPeople.slice(0,8)} />
        ) : (
          <p className="text-white">No celebrities found for <strong>{decodedQuery}</strong>.</p>
        )}
      </div>
    </div>
  );
}
