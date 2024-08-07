import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CircularProgress, Typography, Container, Box, Card, CardContent, Divider, Button, AppBar, Toolbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);  // State to track the current page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);  // Start loading when fetching data
      try {
        const response = await axios.get(`http://localhost:3002/Users?p=${page}`); 
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
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
        Library Users
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {users.map((user) => (
          <Card key={user._id} sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {user.name}
              </Typography>
              <Typography color="textSecondary">
                Email: {user.email}
              </Typography>
              <Typography color="textSecondary">
                Role: {user.role}
              </Typography>
              <Typography color="textSecondary">
                Date Joined: {new Date(user.dateJoined).toLocaleDateString()}
              </Typography>
              <Typography color="textSecondary">
                Fine: ${user.fine ? user.fine.toFixed(2) : '0.00'}
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
          disabled={users.length < 2}  // Disable if less than 2 users are shown
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default Users;
