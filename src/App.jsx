import { useState, useEffect } from 'react'
import axios from 'axios'
import { Spin, Tabs } from 'antd'
import { GenresContextProvider } from './components/GenresProvider'
import RatedTab from './components/RatedTab/RatedTab'
import SearchTab from './components/SearchTab/SearchTab'
import './App.css'

function App() {
  const [genres, setGenres] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [guestToken, setGuestToken] = useState('')

  async function fetchGenres() {
    setIsLoading(true)
    const genresResponse = await axios(
      'https://api.themoviedb.org/3/genre/movie/list',
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
        },
        params: {
          language: 'en-US',
        },
        responseType: 'json',
      },
    )
    setIsLoading(false)
    return genresResponse.data
  }

  async function createGuestToken() {
    setIsLoading(true)
    const guestTokenResponse = await axios(
      'https://api.themoviedb.org/3/authentication/guest_session/new',
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI',
        },
      },
    )
    localStorage.setItem(
      'guest_session',
      guestTokenResponse.data.guest_session_id,
    )
    localStorage.setItem('movie-ratings', JSON.stringify({}))
    setIsLoading(false)
    return guestTokenResponse.data.guest_session_id
  }

  useEffect(() => {
    ;(async () => {
      const genresFetched = await fetchGenres()
      setGenres(genresFetched.genres)
      /* if we have token in localStorage, we don't need to create new one, 
      that will also save guests progress on watching/rating movies */
      if (localStorage.getItem('guest_session')) {
        setGuestToken(localStorage.getItem('guest_session'))
      } else {
        const localGuestToken = await createGuestToken()
        setGuestToken(localGuestToken)
      }
      setIsLoading(false)
    })()
  }, [])

  function starHandler(newStarValue, movieId) {
    localStorage.setItem(
      'movie-ratings',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('movie-ratings')),
        [movieId]: newStarValue,
      }),
    )
    if (newStarValue === 0) {
      axios.delete(`https://api.themoviedb.org/3/movie/${movieId}/rating`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI`,
          'Content-Type': 'application/json;charset=utf-8',
        },
        params: {
          guest_session_id: `${guestToken}`,
        },
      })
    } else {
      axios.post(
        `https://api.themoviedb.org/3/movie/${movieId}/rating`,
        {
          value: `${newStarValue}`,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDY4ZjMwMjlhOGVkZWNlZmNhOGQ5MWZhNzhiMWQ3MyIsIm5iZiI6MTcyMTU0NjE0Mi4zMTY0ODUsInN1YiI6IjY1YTEzZmQ5Y2NkZTA0MDEyYjhiOGVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4Sg8uPhBjm2sEeJQ3Yzjbf23Qoxss2iQ_-5vkD29qI`,
            'Content-Type': 'application/json;charset=utf-8',
          },
          params: {
            guest_session_id: `${guestToken}`,
          },
        },
      )
    }
  }
  return (
    <div className="movie-app">
      {
        isLoading ? <Spin size="large" /> :  <GenresContextProvider genres={genres}>
        <Tabs
          centered
          defaultActiveKey="1"
          animated
          type="cards"
          destroyInactiveTabPane
          items={[
            {
              key: '1',
              label: 'Search',
              children: 
                <SearchTab starHandler={starHandler} />
              ,
            },
            {
              key: '2',
              label: 'Rated',
              children: 
                <RatedTab
                  guestToken={guestToken}
                  starHandler={starHandler}
                  tokenRecreateHandler={async () => {
                    const tok = await createGuestToken()
                    setGuestToken(tok)
                  }}
                />
              ,
            },
          ]}
        />
      </GenresContextProvider>
      }
    </div>
  )
}

export default App
