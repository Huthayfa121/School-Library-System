
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Books from './Books';
import Users from './Users';
import AddBooks from './AddBooks';
import Welcome from './Welcome';
import MyBooks from './MyBooks';
import ForgotPassword from './ForgotPassword';



function App() {
  return (
    <Router>
        <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Books" element={<Books />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/AddBooks" element={<AddBooks />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/MyBooks" element={<MyBooks />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />


        </Routes>
    </Router>
  );
}

export default App;
