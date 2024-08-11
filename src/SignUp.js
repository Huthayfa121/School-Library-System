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

export default function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [emailError, setEmailError] = useState(null); // For unique email check

  const validate = (userData) => {
    const errors = {};
    if (!userData.name) {
      errors.username = 'Username is required';
    }
    if (!userData.email) {
      errors.email = 'Email is required';
    }
    if (!userData.password) {
      errors.password = 'Password is required';
    }
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get('name'), // Ensure this matches the form field
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
      role: 'member',
      dateJoined: new Date(),
      borrowedBooks: [],
      fine: 0,
    };

    const validationErrors = validate(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Check if the email already exists before making the sign-up request
      const existingUserResponse = await axios.get(`http://localhost:3002/Users?email=${userData.email}`);
      if (existingUserResponse.data.length > 0) {
        setEmailError('Email is already in use');
        return;
      }

      const response = await axios.post('http://localhost:3002/Signup', userData);
      console.log(response.data);
      navigate('/Books');
    } catch (error) {
      console.error('Error signing up:', error);
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Username"
              name="name"
              autoComplete="username"
              autoFocus
              error={Boolean(errors.username)}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={Boolean(errors.email) || Boolean(emailError)}
              helperText={errors.email || emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signin" variant="body2">
                  Already have an account? Sign in
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
