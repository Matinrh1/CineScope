import PeopleGrid from './components/PeopleGrid';
import SectionHeader from './components/SectionHeader';
import { fetchTrendingMoviesDaily, fetchTopRatedMovies, fetchPopularPeople,fetchMoviesByGenre } from './utils/lib/tmdb';
import { GENRE_IDS } from './utils/lib/tmdbGeners'
import { Stack } from '@mui/material';
import { FeaturedMovie } from './components/FeaturedMovie';
import Link from 'next/link';
import MoviePreviewGrid from './components/MoviePreviewGrid';
export default async function Home() {
  const [trendingMovies, topRatedMovies, popularPeople, actionMovies, adventureMovies, animationMovies, comedyMovies] =
    await Promise.all([
      fetchTrendingMoviesDaily(),
      fetchTopRatedMovies(),
      fetchPopularPeople(),
      fetchMoviesByGenre(GENRE_IDS.Action),
      fetchMoviesByGenre(GENRE_IDS.Adventure),
      fetchMoviesByGenre(GENRE_IDS.Animation),
      fetchMoviesByGenre(GENRE_IDS.Comedy),
    ]);

  if (!trendingMovies?.length) return <div>No trending movies found.</div>;

  const [featuredMovie, ...restTrending] = trendingMovies;

  return (
    <main className='pb-15'>
      {/* Featured Movie */}
      <FeaturedMovie movie={featuredMovie} />

      <SectionHeader title="Popular Movies" href="/discover-movies" />
      <MoviePreviewGrid movies={restTrending.slice(0, 7)} />

      <SectionHeader title="Top Rated Movies" href="/top-rated" />
      <MoviePreviewGrid movies={topRatedMovies?.slice(0, 7) ?? []} />

      <SectionHeader title="Popular People" href="/celebrities" />
      <PeopleGrid people={popularPeople?.slice(0, 20) ?? []} />

      <SectionHeader title="Action Movies" href="/genre/action" />
      <MoviePreviewGrid movies={actionMovies?.slice(0, 7) ?? []} />

      <SectionHeader title="Adventure Movies" href="/genre/adventure" />
      <MoviePreviewGrid movies={adventureMovies?.slice(0, 7) ?? []} />

      <SectionHeader title="Animation Movies" href="/genre/animation"/>
      <MoviePreviewGrid movies={animationMovies?.slice(0, 7) ?? []} />

      <SectionHeader title="Comedy Movies" href="/genre/comedy" />
      <MoviePreviewGrid movies={comedyMovies?.slice(0, 7) ?? []} />

    </main>
  );
}
