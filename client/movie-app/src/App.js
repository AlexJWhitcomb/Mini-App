import React, { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setSearchResults(data);
      })
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
          if (data.user_added) {
            setMovies((prevMovies) => [...prevMovies, data]);
            setSearchResults((prevResults) => [...prevResults, data]);
          }
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
        setSearchResults((prevResults) =>
          prevResults.filter((movie) => movie.id !== movieId)
        );
      })
      .catch((error) => console.error('Error deleting movie:', error));
  };

  const handleSearch = () => {
    const results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="app-container">
      <h1 className="app-heading">Movie List</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div className="add-movie-container">
        <input
          type="text"
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
          placeholder="Add a movie"
          className="add-movie-input"
        />
        <button onClick={handleAddMovie} className="add-movie-button">
          Add
        </button>
      </div>
      <ul className="movie-list">
        {searchResults.map((movie) => (
          <li key={movie.id} className="movie-item">
            <span>{movie.title}</span>
            <button onClick={() => handleDeleteMovie(movie.id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
