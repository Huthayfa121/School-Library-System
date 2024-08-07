
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Books from './Books';
import Users from './Users';
import AddBooks from './AddBooks';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Books" element={<Books />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/AddBooks" element={<AddBooks />} />
        </Routes>
    </Router>
  );
}

export default App;
