import PropTypes from 'prop-types';
import { format } from 'date-fns';
import classes from './Movie.module.css';

export default function Movie({ movie, genres }) {
  function stringTrimming(str, maxLength) {
    return str.length > maxLength ? `${str.slice(0, maxLength).split(' ').slice(0, -1).join(' ')}...` : str;
  }
  const {
    title, release_date: releaseDate, genre_ids: genreIds, overview, poster_path: posterPath,
  } = movie;
  return (
        <article className={classes.movie}>
            <img className={classes['movie-poster']} src={posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : 'https://img.freepik.com/free-vector/cinema-realistic-poster-with-illuminated-bucket-popcorn-drink-3d-glasses-reel-tickets-blue-background-with-tapes-vector-illustration_1284-77070.jpg'} alt="Movie Poster" />
            <div className={classes['movie-info']}>
            <h3 className={classes['movie-title']}>{stringTrimming(title, 22)}</h3>
            <span className={classes['movie-date']}>{releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : 'No release date'}</span>
            <ul className={classes['tags-list']}>
                {genreIds.map((genreId) => (
                <li key={genreId} className={classes.tag}>{
                    genres.find((genre) => genre.id === genreId).name}
                </li>
                ))}
            </ul>
            <p className={classes['movie-description']}>{overview ? stringTrimming(overview, 207) : 'No description'}</p>
            </div>
        </article>
  );
}

Movie.propTypes = {
  movie: PropTypes.object.isRequired,
  genres: PropTypes.array.isRequired,
};
