// import { useEffect } from 'react';
import MovieList from './components/MovieList/MovieList.jsx';
import Header from './components/Header/Header.jsx';
import './App.css';

function App() {
  return (
    <div className='movie-app'>
    <Header/>
    <MovieList/>
    </div>
  );
}

export default App;
