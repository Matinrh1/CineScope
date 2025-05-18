const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
export const fetchTrendingMoviesDaily = async () => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to fetch trending movies: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error("❌ TMDB fetchTrendingMoviesDaily error:", err);
    throw err;
  }
};
export const fetchTrendingMoviesByPage = async (page: number = 1) => {
  if (!API_KEY) {
    throw new Error("TMDB_API_KEY is missing");
  }

  const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${page}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch trending movies page ${page}`);

  const data = await res.json();
  if (!Array.isArray(data.results)) throw new Error("Invalid response format");

  return data.results;
};

export const fetchPopularMovies = async () => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to fetch popular movies: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error("❌ TMDB fetchPopularMovies error:", err);
    throw err;
  }
};
export const fetchPopularMoviesByPage = async (
  page: number = 1,
  sort: string = "popularity.desc"
) => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  try {
    const res = await fetch(url, {
      // no caching: we want real-time results while scrolling
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(
        `Failed to fetch popular movies page ${page}: ${res.status}`
      );
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error(`❌ TMDB fetchPopularMoviesByPage (${page}) error:`, err);
    throw err;
  }
};
export const fetchTopRatedMoviesByPage = async (page: number = 1) => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;

  try {
    const res = await fetch(url, {
      // No caching to get real-time results during infinite scrolling
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(
        `Failed to fetch top rated movies page ${page}: ${res.status}`
      );
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error(`❌ TMDB fetchTopRatedMoviesByPage (${page}) error:`, err);
    throw err;
  }
};

export const fetchTopRatedMovies = async () => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to fetch top rated movies: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error("❌ TMDB fetchTopRatedMovies error:", err);
    throw err;
  }
};

export const fetchPopularPeople = async () => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to fetch popular people: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error("❌ TMDB fetchPopularPeople error:", err);
    throw err;
  }
};
export const fetchMoviesByGenre = async (genreId: number) => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=1`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(
        `Failed to fetch movies for genre ${genreId}: ${res.status}`
      );
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error(`❌ TMDB fetchMoviesByGenre (${genreId}) error:`, err);
    throw err;
  }
};
export const fetchMoviesByGenreAndPage = async (
  genreId: number,
  page: number = 1
) => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to fetch genre movies: ${res.status}`);
    }

    const data = await res.json();
    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error(
      `❌ fetchMoviesByGenreAndPage (${genreId}, page ${page}) error:`,
      err
    );
    throw err;
  }
};
export const searchMovies = async (query: string) => {
  if (!API_KEY) {
    throw new Error("❌ TMDB_API_KEY is missing from environment variables");
  }

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ TMDB API Response Error:", res.status, errorText);
      throw new Error(`Failed to search movies: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.results || !Array.isArray(data.results)) {
      throw new Error("❌ Invalid response format from TMDB");
    }

    return data.results;
  } catch (err) {
    console.error("❌ TMDB searchMovies error:", err);
    throw err;
  }
};
export const searchPeople = async (query: string) => {
  if (!API_KEY) {
    throw new Error("TMDB_API_KEY is missing");
  }

  const url = `${BASE_URL}/search/person?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "❌ TMDB API Response Error (People Search):",
        res.status,
        errorText
      );
      throw new Error(`Failed to search people: ${res.status}`);
    }

    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("❌ TMDB searchPeople error:", err);
    return [];
  }
};

export const fetchMoviesBySortAndPage = async (
  sort: string,
  page: number = 1
) => {
  if (!API_KEY) throw new Error("❌ TMDB_API_KEY is missing");

  // If sorting by top rated, call the /movie/top_rated endpoint directly
  if (sort === "vote_average.desc") {
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch top rated movies: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data.results)) throw new Error("Invalid format");

    return data.results;
  }

  // For other sorts, keep existing discover logic
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sort}&page=${page}&vote_count.gte=50&include_adult=false`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch sorted movies: ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data.results)) throw new Error("Invalid format");

  return data.results;
};
