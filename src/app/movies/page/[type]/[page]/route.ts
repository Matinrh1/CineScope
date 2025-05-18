// src/app/api/movies/page/[type]/[page]/route.ts
import { NextRequest } from "next/server";
import {
  fetchPopularMoviesByPage,
  fetchTopRatedMoviesByPage,
  fetchTrendingMoviesByPage,
} from "@/app/utils/lib/tmdb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { type?: string; page?: string } }
) {
  const type = params.type?.toLowerCase() || "popular";
  const pageNumber = Number(params.page) || 1;

  try {
    let movies;

    switch (type) {
      case "popular":
        movies = await fetchPopularMoviesByPage(pageNumber);
        break;
      case "top_rated":
        movies = await fetchTopRatedMoviesByPage(pageNumber);
        break;
      case "trending":
        movies = await fetchTrendingMoviesByPage(pageNumber);
        break;
      default:
        return new Response(`❌ Invalid movie type: '${type}'`, { status: 400 });
    }

    return Response.json(movies);
  } catch (error) {
    console.error(`❌ Failed to fetch '${type}' movies (page ${pageNumber}):`, error);
    return new Response(`Failed to fetch '${type}' movies`, { status: 500 });
  }
}
