import { fetchMoviesBySortAndPage } from "../utils/lib/tmdb";
import { FeaturedMovie } from "../components/FeaturedMovie";
import PageToolbar from "../components/PageToolBar";
import InfiniteMovieScroll from "../components/InfiniteMovieScroll";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const sort = searchParams.sort || "popularity.desc";
  const movies = await fetchMoviesBySortAndPage(sort, 1); 
  const [featuredMovie, ...restMovies] = movies;

  return (
    <main>
      <FeaturedMovie movie={featuredMovie} />
      <PageToolbar title="Discover Movies" />
      <InfiniteMovieScroll
        initialMovies={movies}
        type="discover"
        sort={sort}
      />
    </main>
  );
}
