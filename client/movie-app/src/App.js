import React, { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');

  useEffect(() => {
    fetch('/movies')
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error('Error fetching movies:', error));
  }, []);

  const handleAddMovie = () => {
    if (newMovieTitle.trim() !== '') {
      fetch('/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newMovieTitle }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMovies((prevMovies) => [...prevMovies, data]);
          setNewMovieTitle('');
        })
        .catch((error) => console.error('Error adding movie:', error));
    }
  };

  const handleDeleteMovie = (movieId) => {
    fetch(`/movies/${movieId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movieId)
        );
      })
      .catch((error) => console.error('Error deleting movie:', error));
  };

  return (
    <div>
      <h1>Movie List</h1>
      <input
        type="text"
        value={newMovieTitle}
        onChange={(e) => setNewMovieTitle(e.target.value)}
        placeholder="Add a movie"
      />
      <button onClick={handleAddMovie}>Add</button>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title}
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
