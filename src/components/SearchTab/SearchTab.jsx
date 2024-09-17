import Input from 'antd/es/input/Input'
import { debounce } from 'lodash'
import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Pagination, Spin } from 'antd'
import { GenresContext } from '../GenresProvider'
import MovieList from '../MovieList/MovieList'
import classes from './SearchTab.module.css'

export default function SearchTab({ starHandler }) {
  const [isLoading, setIsLoading] = useState(true)
  const [movies, setMovies] = useState([])
  const searchQuery = useRef(null)

  const genres = useContext(GenresContext)

  async function fetchMovies(movieQuery, pagePos) {
    setIsLoading(true)
    const moviesResponse = await axios(
      movieQuery
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/trending/movie/day',
      {
        method: 'GET',
        params: {
          query: movieQuery,
          page: pagePos,
          language: 'en-US',
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
        },
        responseType: 'json',
      },
    )
    setIsLoading(false)
    return moviesResponse.data
  }

  useEffect(() => {
    ;(async () => {
      const moviesFetched = await fetchMovies('', 1)
      setMovies(moviesFetched)
    })()
  }, [])

  const onSearch = debounce(async (query) => {
    const searchedMovies = await fetchMovies(query.target.value, 1)
    setMovies(searchedMovies)
  }, 500)

  async function onPaginationChange(page) {
    const moviesFetched = await fetchMovies(
      searchQuery.current.input.value,
      page,
    )
    setMovies(moviesFetched)
  }

  return (
    <>
      <Input
        placeholder="Напишите для поиска..."
        className={classes.input}
        onChange={onSearch}
        ref={
          searchQuery
          /* EDU: ref is very useful! */
        }
      />
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <MovieList
            movies={movies.results}
            genres={genres}
            starHandler={starHandler}
          />
          {/* if we have less then 20 pages we dont need pagination */}
          {movies.total_results < 20 ? null : (
            <Pagination
              defaultCurrent={1}
              onChange={onPaginationChange}
              align="center"
              total={
                movies.total_results > 10000 ? 10000 : movies.total_results
                /* it looks like themoviedb don't let us scroll more then 500 pages even if it shows there is 500+! */
              }
              showSizeChanger={false}
              pageSize={20}
              className={classes.pagination}
              current={movies.page}
            />
          )}
        </>
      )}
    </>
  )
}

SearchTab.propTypes = {
  starHandler: PropTypes.func.isRequired,
}
