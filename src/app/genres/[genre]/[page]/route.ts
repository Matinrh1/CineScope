//D:\js\next.js\cinescope\src\app\genres\[genre]\[page]\route.ts
import { NextRequest } from "next/server";
import { GENRE_SLUGS } from "@/app/utils/lib/GENRE_SLUGS";

export async function GET(
  req: NextRequest,
  { params }: { params: { genre?: string; page?: string } }
) {
  const genreSlug = params.genre?.toLowerCase().replace(/%20/g, "-") || "";
  const genreId = GENRE_SLUGS[genreSlug];
  const pageNumber = Number(params.page) || 1;
  

  // 🆕 Get the `sort_by` param from the query
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sort_by") || "popularity.desc";

  if (!genreId) {
    return new Response(`❌ Invalid genre: '${genreSlug}'`, { status: 400 });
  }

  try {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&sort_by=${sortBy}&with_genres=${genreId}&page=${pageNumber}`;
    
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Error:", res.status, errorText);
      return new Response(`Failed to fetch movies for genre`, { status: 500 });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data.results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Genre page API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
  
}
