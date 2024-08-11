import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
  Link,
  Avatar,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State for handling errors

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await axios.post('http://localhost:3002/Signin', { email, password });
      const userRole = response.data.role;
      const userName = response.data.name;
      const userId = response.data.userId;

      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userId', userId);

      navigate('/Welcome');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid email or password'); // Display error message
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Typography color="error">{error}</Typography>} {/* Error message display */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              aria-label="sign in"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" aria-label="forgot password">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2" aria-label="sign up">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Button
              onClick={() => navigate('/Welcome')}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            >
              {'<- Back to Home'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
