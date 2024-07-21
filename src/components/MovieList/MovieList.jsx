import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './MovieList.module.css';
import Movie from '../Movie/Movie.jsx';

export default function MovieList() {
  const [isLoading, setIsLoading] = useState(false);

  const [genres, setGenres] = useState([]);

  const [movies, setMovies] = useState([]);

  const movieList = movies.slice(0, 6)
    .map((movie) => <Movie key={movie.id} movie={movie} genres={genres}/>);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      const moviesResponse = await axios(
        'https://api.themoviedb.org/3/search/movie',
        {
          method: 'GET',
          params: {
            query: 'k',
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
          },
          responseType: 'json',
        },
      );
      setMovies(moviesResponse.data.results);
      setIsLoading(false);
    }

    async function fetchGenres() {
      setIsLoading(true);
      const genresResponse = await axios('https://api.themoviedb.org/3/genre/movie/list', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
        },
        responseType: 'json',
      });
      setIsLoading(false);
      setGenres(genresResponse.data.genres);
    }
    fetchMovies();
    fetchGenres();
  }, []);
  return (
        <section className={classes['movie-list']}>
        {isLoading ? <p>Loading...</p> : movieList}
        </section>
  );
}
