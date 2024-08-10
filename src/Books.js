import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [userName, setUserName] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3002/Books?p=${page}`); 
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching books");
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in local storage");
    }
  
    setUserName(storedUserName || "");
    fetchBooks();
  }, [page]);

  const handleBorrowBook = async (bookId) => {
    if (!userId) {
      console.error("User ID is null, cannot borrow book");
      return;
    }
    try {
      await axios.post("http://localhost:3002/BorrowBook", { userId, bookId });
      fetchBooks();  
    } catch (err) {
      console.error("Error borrowing book:", err);
    }
  };

  if (loading)
    return (
      <CircularProgress
        sx={{ display: "block", margin: "auto", marginTop: "20px" }}
      />
    );
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  return (
    <Container sx={{ marginTop: "20px" }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button color="inherit" component={RouterLink} to="/Welcome">
            Library
          </Button>
          <Typography variant="h6" sx={{ color: "red" }}>
            {userName}
          </Typography>
          <Button color="inherit" onClick={() => navigate("/signin")}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ marginTop: "20px" }}
      >
        Library Books
      </Typography>

      {userRole !== "member" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/AddBooks")}
          sx={{ marginBottom: "20px" }}
        >
          Add New Book
        </Button>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {books.map((book) => (
          <Card key={book._id} sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{book.title}</Typography>
              <Typography color="textSecondary">
                Author: {book.author}
              </Typography>
              <Typography color="textSecondary">ISBN: {book.isbn}</Typography>
              <Typography color="textSecondary">
                Category: {book.category}
              </Typography>
              <Typography color="textSecondary">
                Published Year: {book.publishedYear}
              </Typography>
              <Typography color="textSecondary">
                Copies Available: {book.copiesAvailable}
              </Typography>
              <Typography color="textSecondary">
                Price: {book.price}$
              </Typography>
            </CardContent>
            <Divider />
            <Button
              onClick={() => handleBorrowBook(book._id, book.Price)}
              variant="contained"
              color="primary"
              disabled={book.copiesAvailable === 0}
              sx={{ margin: "10px" }}
            >
              Borrow
            </Button>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPage((prevPage) => prevPage - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={books.length < 3}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default Books;
