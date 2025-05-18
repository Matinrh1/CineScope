// src/app/discover-movies/api/[page]/route.ts

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { page?: string } }
) {
  const pageNumber = Number(params.page) || 1;
  const url = new URL(req.url);
  const sortBy = url.searchParams.get("sort_by") || "popularity.desc";

  try {
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&sort_by=${sortBy}&page=${pageNumber}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Error:", res.status, errorText);
      return new Response(`Failed to fetch movies`, { status: 500 });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data.results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Discover movies API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
