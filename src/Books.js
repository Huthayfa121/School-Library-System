import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CircularProgress, Typography, Container, Box, Card, CardContent, Divider, Button, AppBar, Toolbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);  // State to track the current page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);  // Start loading when fetching data
      try {
        const response = await axios.get(`http://localhost:3002/Books?p=${page}`); 
        console.log(response.data)
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);  // Re-run effect when `page` changes

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  const handleSignOut = () => {
    // Clear any authentication tokens here, if stored
    // Redirect to SignIn page
    navigate('/signin');
  };

  const handleAddBook = () => {
    navigate('/AddBooks');  // Navigate to the AddBook page
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container sx={{ marginTop: '20px' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Library
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleSignOut} 
            aria-label="sign out"
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px' }}>
        Library Books
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddBook}
        sx={{ marginBottom: '20px' }}
      >
        Add New Book
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {books.map((book) => (
          <Card key={book._id} sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {book.title}
              </Typography>
              <Typography color="textSecondary">
                Author: {book.author}
              </Typography>
              <Typography color="textSecondary">
                ISBN: {book.isbn}
              </Typography>
              <Typography color="textSecondary">
                Category: {book.category}
              </Typography>
              <Typography color="textSecondary">
                Published Year: {book.publishedYear}
              </Typography>
              <Typography color="textSecondary">
                Copies Available: {book.copiesAvailable}
              </Typography>
            </CardContent>
            <Divider />
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePreviousPage}
          disabled={page === 0}  // Disable the button on the first page
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNextPage}
          disabled={books.length < 2}  // Disable if less than 2 books are shown
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default Books;
