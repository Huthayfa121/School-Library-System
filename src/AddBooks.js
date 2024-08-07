import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Box, TextField, Button, Typography, AppBar, Toolbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [copiesAvailable, setCopiesAvailable] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      title,
      author,
      isbn,
      category,
      publishedYear,
      copiesAvailable
    };

    try {
      await axios.post('http://localhost:3002/Books', body);
      navigate('/Books');  // Redirect to the Books page
    } catch (err) {
      setError('Error adding book');
    }
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Library
          </Typography>
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
        <TextField
          required
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />
        <TextField
          required
          label="Published Year"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
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
