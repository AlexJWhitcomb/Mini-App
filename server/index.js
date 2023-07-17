const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'ajwhitcomb',
  host: 'localhost',
  database: 'movie-list',
  password: '3202488957Alex',
  port: 5432,
});

app.use(express.json());

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM movies');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving movies:', error);
    res.status(500).json({ error: 'Unable to retrieve movies' });
  }
});

// Add a movie
app.post('/movies', async (req, res) => {
  const { title } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO movies (title, user_added) VALUES ($1, $2) RETURNING *',
      [title, true]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Unable to add movie' });
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Unable to delete movie' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
