import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  createTheme,
  ThemeProvider,
  Box,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { purple, teal, amber } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    h2: {
      fontWeight: 700,
      color: purple[900],
    },
    h5: {
      fontStyle: 'italic',
      color: teal[700],
    },
  },
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: amber[700],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
});

export default function Welcome() {

  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName || '');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    setUserName('');
    navigate('/signin');
  };

  const isUserSignedIn = !!userName; // Check if userName is not an empty string

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: `linear-gradient(to right, ${purple[100]}, ${teal[100]})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container component="main" maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Our Library
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 5 }}>
            "The beautiful thing about learning is that nobody can take it away from you." – B.B. King
          </Typography>

          <Grid container justifyContent="center" alignItems="center" spacing={3}>

            <Grid item xs={12}>
            {!isUserSignedIn && (
              <Typography variant="h6" sx={{ mb: 2 }}>
                Welcome User
              </Typography>
            )}
            {isUserSignedIn && (
              <Typography variant="h6" sx={{ mb: 2 }}>
                Welcome, {userName}!
              </Typography>
            )}
            </Grid>
            <Grid item>
              <Button
                component={RouterLink}
                to="/Books"
                variant="contained"
                color="primary"
                size="large"
                sx={{ width: 180 }}
              >
                View Books
              </Button>
            </Grid>
            {isUserSignedIn && localStorage.getItem('userRole') !== 'member' && (
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/Users"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: 180 }}
                >
                  View Users
                </Button>
              </Grid>
            )}
            {isUserSignedIn && (
            <Grid item>
              <Button
                component={RouterLink}
                to="/MyBooks"
                variant="contained"
                color="primary"
                size="large"
                sx={{ width: 180 }}
              >
                My Books
              </Button>
            </Grid>
            )}
            {!isUserSignedIn && (
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ width: 180 }}
                >
                  Sign In
                </Button>
              </Grid>
            )}
            {!isUserSignedIn && localStorage.getItem('userRole') !== 'member' && (
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ width: 180 }}
                >
                  Sign Up
                </Button>
              </Grid>
            )}
            {isUserSignedIn && (
              <Grid item>
                <Button
                  onClick={handleSignOut}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ width: 180 }}
                >
                  Sign Out
                </Button>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
