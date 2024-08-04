import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Container } from '@mui/material';

function BooksTable() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Books');
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Books List
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme => theme.palette.primary.main, color: theme => theme.palette.common.white }}>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Author</TableCell>
              <TableCell align="center">Categories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((book) => (
              <TableRow key={book._id} sx={{ '&:nth-of-type(even)': { backgroundColor: theme => theme.palette.action.hover } }}>
                <TableCell align="center">{book.title}</TableCell>
                <TableCell align="center">{book.author}</TableCell>
                <TableCell align="center">{book.genre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
}

export default BooksTable;
