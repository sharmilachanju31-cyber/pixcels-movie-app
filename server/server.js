const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

const moviesPath = path.join(__dirname, 'movies_metadata.json');
let movies = JSON.parse(fs.readFileSync(moviesPath, 'utf8'));

// GET all movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// POST new movie
app.post('/api/movies', (req, res) => {
  const newMovie = { 
    id: Date.now(), 
    title: req.body.title,
    genre: req.body.genre,
    year: parseInt(req.body.year),
    rating: parseFloat(req.body.rating)
  };
  movies.push(newMovie);
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
  res.status(201).json(newMovie);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));