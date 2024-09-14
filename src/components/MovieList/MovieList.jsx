import { Alert } from 'antd'
import PropTypes from 'prop-types'
import { Offline, Online } from 'react-detect-offline'
import classes from './MovieList.module.css'
import './MovieList.css'
import Movie from '../Movie/Movie'

export default function MovieList({ movies, genres, starHandler }) {
  const movieList = movies.map((movie) => (
    <Movie
      key={movie.id}
      movie={movie}
      genres={genres}
      starHandler={starHandler}
    />
  ))
  return (
    <>
      <Online>
        <section className={classes['movie-list']}>
          {movies.length > 0 ? (
            movieList
          ) : (
            <Alert
              className={classes['no-movies']}
              description="Фильмов по этому запросу не найдено, попробуйте сменить запрос."
              type="error"
              showIcon
            >
              No movies
            </Alert>
          )}
        </section>
      </Online>
      <Offline>
        <Alert
          type="error"
          showIcon
          description="Нет соединения, проверь подключение к интернету."
        />
      </Offline>
    </>
  )
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      adult: PropTypes.bool,
      backdrop_path: PropTypes.string,
      genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
      id: PropTypes.number.isRequired,
      original_language: PropTypes.string,
      original_title: PropTypes.string,
      overview: PropTypes.string.isRequired,
      popularity: PropTypes.number,
      poster_path: PropTypes.string,
      release_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      video: PropTypes.bool,
      vote_average: PropTypes.number.isRequired,
      vote_count: PropTypes.number,
    }),
  ).isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  starHandler: PropTypes.func.isRequired,
}
