import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CircularProgress, Typography, Container, Box, Card, CardContent, Divider, Button, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(0);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const userRole = localStorage.getItem('userRole');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName || '');
    try {
      const response = await axios.get(`http://localhost:3002/Users?p=${page}`); 

      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleReturnBook = async () => {
    if (!selectedUserId || !selectedBookId) {
      console.error('User ID or Book ID is null, cannot return book');
      return;
    }
    try {
      await axios.post('http://localhost:3002/ReturnBook', {
        userId: selectedUserId,
        bookId: selectedBookId,
      });
      setReturnDialogOpen(false);
      fetchUsers(); 
    } catch (err) {
      console.error('Error returning book:', err);
    }
  };

  const handleSignOut = () => {
    navigate('/signin');
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container sx={{ marginTop: '20px' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            color="inherit" 
            component={RouterLink}
            to="/Welcome"
            aria-label="library"
          >
            Library
          </Button>
          <Typography variant="h6" sx={{ color: 'red' }}>
            {userName}
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
  
      {userRole !== 'member' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/SignUp')}
          sx={{ marginBottom: '20px' }}
        >
          Add A New User
        </Button>
      )}
  
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
  
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {users
          .filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(user => (
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
  
                {user.borrowedBooks.length > 0 ? (
                  <>
                    <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                      Borrowed Books:
                    </Typography>
                    <Box sx={{ marginLeft: '20px' }}>
                      {user.borrowedBooks.map((borrowedBook, index) => (
                        <Typography key={index} color="textSecondary">
                          Book ID: {borrowedBook.bookId} - Due Date: {new Date(borrowedBook.dueDate).toLocaleDateString()}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setReturnDialogOpen(true);
                      }}
                      variant="contained"
                      color="secondary"
                      sx={{ marginTop: '10px' }}
                    >
                      Return Book
                    </Button>
                  </>
                ) : (
                  <Typography color="textSecondary" sx={{ marginTop: '10px' }}>
                    No borrowed books
                  </Typography>
                )}
              </CardContent>
              <Divider />
            </Card>
          ))}
      </Box>
  
      <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
        <DialogTitle>Select a Book to Return</DialogTitle>
        <DialogContent>
          <Select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            fullWidth
          >
            {users
              .find((user) => user._id === selectedUserId)
              ?.borrowedBooks.map((borrowedBook) => (
                <MenuItem key={borrowedBook.bookId} value={borrowedBook.bookId}>
                  {borrowedBook.bookId} - Due:{" "}
                  {new Date(borrowedBook.dueDate).toLocaleDateString()}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReturnBook} color="primary">
            Return Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
