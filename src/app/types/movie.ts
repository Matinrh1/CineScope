export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string; 
  overview: string;      
  release_date: string;
  vote_average?: number;
  imdb_rating?: number;
}
