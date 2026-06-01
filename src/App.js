import React, { useState, useEffect } from 'react';
function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, genre, year, rating })
    })
      .then(res => res.json())
      .then(newMovie => {
        setMovies([...movies, newMovie]);
        setTitle(''); setGenre(''); setYear(''); setRating('');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movie Database</h1>
      
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} required />
        <input placeholder="Year" type="number" value={year} onChange={e => setYear(e.target.value)} required />
        <input placeholder="Rating" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} required />
        <button type="submit">Add Movie</button>
      </form>

      <h2>Movies: {movies.length}</h2>
      {movies.map(movie => (
        <div key={movie.id} style={{ border: '1px solid gray', margin: '5px', padding: '10px' }}>
          <b>{movie.title}</b> ({movie.release_date || movie.year}) - {movie.vote_average || movie.rating}/10
        </div>
      ))}
    </div>
  );
}

export default App;