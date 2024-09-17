import PropTypes from 'prop-types'
import { Rate, Spin, Image } from 'antd'
import { format } from 'date-fns'
import { useState } from 'react'
import classes from './Movie.module.css'

export default function Movie({ movie, genres, starHandler }) {
  const [starValue, setStarValue] = useState(
    JSON.parse(localStorage.getItem('movie-ratings'))?.[movie.id] || 0,
  )
  const [imageLoading, setImageLoading] = useState(false)
  function stringTrimming(str, maxLength) {
    return str.length > maxLength
      ? `${str.slice(0, maxLength).split(' ').slice(0, -1).join(' ')}...`
      : str
  }
  function valueChangeHandler(newValue) {
    setStarValue(newValue)
    starHandler(newValue, movie.id)
  }

  const {
    title,
    release_date: releaseDate,
    genre_ids: genreIds,
    overview,
    poster_path: posterPath,
    vote_average: voteAverage,
  } = movie

  let voteAverageClassName = ''
  if (voteAverage >= 7) {
    voteAverageClassName = classes['green-border']
  } else if (voteAverage >= 5) {
    voteAverageClassName = classes['yelow-border']
  } else if (voteAverage >= 3) {
    voteAverageClassName = classes['orange-border']
  } else {
    voteAverageClassName = classes['red-border']
  }

  return (
    <article className={classes.movie}>
      {imageLoading ? (
        <div className={classes['movie-poster']}>
          <Spin className={classes['movie-spinner']} />
        </div>
      ) : (
        <Image
          className={classes['movie-poster']}
          src={`https://image.tmdb.org/t/p/w500/${posterPath}`}
          alt="Movie Poster"
          fallback={`https://via.placeholder.com/500x715/white/black/?text=${title.split(' ').join('+')}&font=oswald.png`}
          onLoadStart={() => setImageLoading(true)}
          onLoad={() => setImageLoading(false)}
        />
      )}
      <div className={classes['rate-flex']}>
        <h3 className={classes['movie-title']}>{stringTrimming(title, 16)}</h3>
        <span className={`${classes['movie-average']} ${voteAverageClassName}`}>
          {voteAverage.toFixed(1)}
        </span>
        <span className={classes['movie-date']}>
          {releaseDate
            ? format(new Date(releaseDate), 'MMMM d, yyyy')
            : 'No release date'}
        </span>
        <ul className={classes['tags-list']}>
          {genreIds.map((genreId) => (
            <li key={genreId} className={classes.tag}>
              {genres.find((genre) => genre.id === genreId).name}
            </li>
          ))}
        </ul>
        <p className={classes['movie-description']}>
          {overview ? stringTrimming(overview, 155) : 'No description'}
        </p>
        <Rate
          value={starValue}
          onChange={valueChangeHandler}
          allowHalf
          allowClear
          count={10}
          className={classes['movie-user-rate']}
        />
      </div>
    </article>
  )
}

Movie.propTypes = {
  movie: PropTypes.shape({
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
    rating: PropTypes.number,
  }).isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  starHandler: PropTypes.func.isRequired,
}
