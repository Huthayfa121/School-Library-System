import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: {
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontStyle: 'italic',
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function Welcome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    
    setIsAuthenticated(!!userRole);
    setUserName(storedUserName || '');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/signin');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our Library
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph sx={{ mb: 5 }}>
          "The beautiful thing about learning is that nobody can take it away from you." – B.B. King
        </Typography>

        <Grid container justifyContent="center" alignItems="center" spacing={3}>
          {isAuthenticated ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: 'textPrimary', mb: 2 }}>
                  Welcome, {userName}!
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/Books"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: 150 }}
                >
                  View Books
                </Button>
              </Grid>
              {localStorage.getItem('userRole') !== 'member' && (
                <Grid item>
                  <Button
                    component={RouterLink}
                    to="/Users"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ width: 150 }}
                  >
                    View Users
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  onClick={handleSignOut}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ width: 150 }}
                >
                  Sign Out
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ width: 150 }}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ width: 150 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
