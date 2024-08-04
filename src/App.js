
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import SignUp from './SignUp';
import SignIn from './SignIn';
import BooksTable from './Books';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Books" element={<BooksTable />} />
        </Routes>
    </Router>
  );
}

export default App;
