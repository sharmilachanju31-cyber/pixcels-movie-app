import React, { useState, useEffect } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // Full list backup ku
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [searchId, setSearchId] = useState(''); // ID search ku pudhu state

  useEffect(() => {
    fetch('/api/movies')
     .then(res => res.json())
     .then(data => {
        setMovies(data);
        setAllMovies(data); // Backup vechukom
      });
  }, []);

  // ID use panni search panna function
  const handleIdSearch = () => {
    if (searchId === '') {
      setMovies(allMovies); // Empty na full list mela kaami
      return;
    }
    
    fetch(`/api/movies/${searchId}`)
     .then(res => {
        if (!res.ok) {
          alert('Movie ID not found');
          setMovies([]);
          return null;
        }
        return res.json();
      })
     .then(data => {
        if (data) setMovies([data]); // Single movie ah array la podu
      })
     .catch(err => console.log(err));
  };

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
        setAllMovies([...allMovies, newMovie]);
        setTitle(''); setGenre(''); setYear(''); setRating('');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movie Database</h1>
      
      {/* ID Search Box - idhu dhan pudhusu */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Search by ID" 
          value={searchId} 
          onChange={e => setSearchId(e.target.value)} 
          type="number"
        />
        <button onClick={handleIdSearch}>Search ID</button>
        <button onClick={() => {setSearchId(''); setMovies(allMovies);}}>Clear</button>
      </div>

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
          <b>ID: {movie.id}</b> | <b>{movie.title}</b> ({movie.release_date || movie.year}) - {movie.vote_average || movie.rating}/10
        </div>
      ))}
    </div>
  );
}

export default App;