import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks, fetchCategories, createBook } from "../../features/admin/adminSlice";

const BooksPage = () => {
  const dispatch = useDispatch();

  // Lấy state từ Redux
  const { books, categories, loading } = useSelector((state) => state.admin);

  // State cho việc thêm sách
  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    price: "",
    publicationDate: "",
    img: "",
    description: "",
    categoryId: "",
    discountRate: "",
  });

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBook(newBook));
    setNewBook({
      name: "",
      author: "",
      price: "",
      publicationDate: "",
      img: "",
      description: "",
      categoryId: "",
      discountRate: "",
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Books Management
      </Typography>

      {/* Hiển thị sách */}
      <Grid container spacing={2}>
        {books && books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{book.name}</Typography>
                  <Typography>Author: {book.author}</Typography>
                  <Typography>Price: ${book.price}</Typography>
                  <Typography>
                    Publication Date: {new Date(book.publicationDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No books available.</Typography>
        )}
      </Grid>

      {/* Thêm sách */}
      <Box component="form" onSubmit={handleSubmit} mt={4}>
        <Typography variant="h5" gutterBottom>
          Add New Book
        </Typography>
        <TextField
          fullWidth
          label="Book Name"
          name="name"
          value={newBook.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Author"
          name="author"
          value={newBook.author}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={newBook.price}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
        <TextField
          fullWidth
          label="Publication Date"
          name="publicationDate"
          value={newBook.publicationDate}
          onChange={handleChange}
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Image URL"
          name="img"
          value={newBook.img}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={newBook.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={newBook.categoryId}
            onChange={handleChange}
          >
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Discount Rate (%)"
          name="discountRate"
          value={newBook.discountRate}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </Button>
      </Box>
    </Container>
  );
};

export default BooksPage;
