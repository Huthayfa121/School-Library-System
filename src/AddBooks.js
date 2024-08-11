import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Box, TextField, Button, Typography, AppBar, Toolbar, Select, MenuItem, InputLabel, FormControl, Chip 
} from '@mui/material';
import { Link as RouterLink, useNavigate } from "react-router-dom";

const genresList = [
  "Art", "Biography", "Business", "Chick Lit", "Children's", "Christian", "Classics", "Comics", "Contemporary", "Cookbooks",
  "Crime", "Ebooks", "Fantasy", "Fiction", "Gay and Lesbian", "Graphic Novels", "Historical Fiction", "History", "Horror", 
  "Humor and Comedy", "Manga", "Memoir", "Music", "Mystery", "Nonfiction", "Paranormal", "Philosophy", "Poetry", "Psychology",
  "Religion", "Romance", "Science", "Science Fiction", "Self Help", "Suspense", "Spirituality", "Sports", "Thriller", "Travel", 
  "Young Adult"
];

const AddBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState([]);
  const [publishedYear, setPublishedYear] = useState('');
  const [copiesAvailable, setCopiesAvailable] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      title,
      author,
      isbn,
      category,
      publishedYear: parseInt(publishedYear, 10),
      copiesAvailable: parseInt(copiesAvailable, 10),
      totalCopies: parseInt(copiesAvailable, 10),
      price: parseInt(price, 10),
      borrowedBy: [],
    };

    try {
      await axios.post('http://localhost:3002/Books', body);
      navigate('/Books'); 
    } catch (err) {
      setError('Error adding book');
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button color="inherit" component={RouterLink} to="/Welcome">
            Library
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px' }}>
        Add New Book
      </Typography>

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <TextField
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          required
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
        />
        <TextField
          required
          label="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={category}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {genresList.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          label="Published Year"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          fullWidth
        />
        <TextField
          required
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
        />
        <TextField
          required
          label="Copies Available"
          type="number"
          value={copiesAvailable}
          onChange={(e) => setCopiesAvailable(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: '20px' }}
        >
          Add Book
        </Button>
      </Box>
    </Container>
  );
};

export default AddBooks;
