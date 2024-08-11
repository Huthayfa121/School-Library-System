import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyBooks = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      console.log(storedUserId)
      if (!storedUserId) {
        setError('User not signed in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/Users/${storedUserId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container sx={{ marginTop: '20px' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button color="inherit" onClick={() => navigate('/Welcome')}>
            Library
          </Button>
          <Typography variant="h6" sx={{ color: 'red' }}>
            {user.name}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/signin')}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px' }}>
        My Borrowed Books
      </Typography>

      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Name: {user.name}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Fine: ${user.fine ? user.fine.toFixed(2) : '0.00'}
          </Typography>

          {user.borrowedBooks.length > 0 ? (
            <>
              <Typography variant="h6"  sx={{ marginTop: '10px' }}>
                Borrowed Books:
              </Typography>
              <Box sx={{ marginLeft: '20px' }}>
                {user.borrowedBooks.map((borrowedBook, index) => (
                  <Typography key={index} color="textSecondary">
                    Book ID: {borrowedBook.bookId} - Due Date: {new Date(borrowedBook.dueDate).toLocaleDateString()}
                  </Typography>
                ))}
              </Box>
            </>
          ) : (
            <Typography color="textSecondary" sx={{ marginTop: '10px' }}>
              No borrowed books
            </Typography>
          )}
        </CardContent>
        <Divider />
      </Card>
    </Container>
  );
};

export default MyBooks;
