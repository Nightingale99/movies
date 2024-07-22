import axios from 'axios';
import { useEffect, useState } from 'react';
import { Spin, Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import classes from './MovieList.module.css';
import './MovieList.css';
import Movie from '../Movie/Movie.jsx';

export default function MovieList() {
  const [genres, setGenres] = useState([]);

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
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
    }

    async function fetchGenres() {
      const genresResponse = await axios('https://api.themoviedb.org/3/genre/movie/list', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
        },
        responseType: 'json',
      });
      setGenres(genresResponse.data.genres);
    }
    fetchMovies();
    fetchGenres();
  }, []);

  return (
        <>
        <Online>
          <section className={classes['movie-list']}>
          {(movies.length > 0 && genres.length > 0)
            ? movies.slice(0, 6).map((movie) => <Movie key={movie.id}
          movie={movie} genres={genres}/>)
            : <Spin size='large'/>}
          </section>
        </Online>
        <Offline>
          <Alert type='error' showIcon description='No connection, check your internet'/>
        </Offline>
        </>
  );
}
