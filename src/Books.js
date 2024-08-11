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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";


const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");


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

  const fetchUsers = async (page = 0, pageSize = 6) => {
    try {

      const response = await axios.get(`http://localhost:3002/Users?p=${page}&limit=${pageSize}`);
      console.log(response.data)
      setUserList(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
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

  const handleBorrowBook = async () => {
    if (!selectedUser) {
      console.error("No user selected, cannot borrow book");
      return;
    }
    try {
      await axios.post("http://localhost:3002/BorrowBook", { userId: selectedUser, bookId: currentBookId });
      setDialogOpen(false);
      fetchBooks();
    } catch (err) {
      console.error("Error borrowing book:", err);
    }
  };

  const handleOpenDialog = async (bookId) => {
    setCurrentBookId(bookId);
    await fetchUsers(0); 
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  const isUserSignedIn = !!userName;

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
          {isUserSignedIn && (
            <Button color="inherit" onClick={() => navigate("/signin")}>
              Sign Out
            </Button>
          )}
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

      {isUserSignedIn && userRole !== "member" && (
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
            {isUserSignedIn && userRole !== "member" && (
              <Button
                onClick={() => handleOpenDialog(book._id)}
                variant="contained"
                color="primary"
                disabled={book.copiesAvailable === 0}
                sx={{ margin: "10px" }}
              >
                Lend
              </Button>
            )}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select User to Lend Book</DialogTitle>
        <DialogContent>
          <List>
            {userList.map((user) => (
              <ListItem 
                button
                key={user._id}
                onClick={() => setSelectedUser(user._id)}
              >
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleBorrowBook}
            color="primary"
            disabled={!selectedUser}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Books;
 