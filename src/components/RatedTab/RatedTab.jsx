import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Spin, Pagination } from 'antd'
import { GenresContext } from '../GenresProvider'
import classes from './RatedTab.module.css'
import MovieList from '../MovieList/MovieList'

export default function RatedTab({
  guestToken,
  tokenRecreateHandler,
  starHandler,
}) {
  const [ratedMovies, setRatedMovies] = useState({
    results: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const genres = useContext(GenresContext)
  async function fetchRatedMovies(guestTokenFetch, page = 1) {
    /* TODO: get rid of wasError variable */
    setIsLoading(true)
    const ratedMoviesResponse = await axios
      .get(
        `https://api.themoviedb.org/3/guest_session/${guestTokenFetch}/rated/movies?language=en-US&page=${page}`,
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
          },
          responseType: 'json',
        },
      )
      .catch((err) => {
        console.log(err)
        /* P.S. if token is dead we will get 401 error and then we should recreate this asap */
        if (err.response.status === 401) {
          tokenRecreateHandler()
        }
        return {
          data: {
            results: [],
          },
        }
      })
    setIsLoading(false)
    return ratedMoviesResponse.data
  }
  async function onPaginationChange(page) {
    const moviesFetched = await fetchRatedMovies(guestToken, page)
    setRatedMovies(moviesFetched)
  }

  useEffect(() => {
    ;(async () => {
      const ratedMoviesFetched = await fetchRatedMovies(guestToken)
      setRatedMovies(ratedMoviesFetched)
    })()
  }, [])
  return (
    <>
      {!isLoading ? (
        <MovieList
          movies={ratedMovies.results}
          genres={genres}
          starHandler={starHandler}
        />
      ) : (
        <Spin size="large" />
      )}
      {!isLoading && ratedMovies.total_results > 20 && (
        <Pagination
          defaultCurrent={1}
          onChange={onPaginationChange}
          align="center"
          total={
            ratedMovies.total_results > 10000
              ? 10000
              : ratedMovies.total_results
            /* it looks like themoviedb don't let us scroll more then 500 pages even if it shows there is 500+
            so i decided to end it up on 500 pages if there's more! */
          }
          showSizeChanger={false}
          pageSize={20}
          className={classes.pagination}
          current={ratedMovies.page}
        />
      )}
    </>
  )
}

RatedTab.propTypes = {
  guestToken: PropTypes.string.isRequired,
  tokenRecreateHandler: PropTypes.func.isRequired,
  starHandler: PropTypes.func.isRequired,
}
