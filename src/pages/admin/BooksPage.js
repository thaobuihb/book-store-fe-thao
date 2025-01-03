import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardMedia,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Delete, Edit, Restore, DeleteForever } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  fetchCategories,
  createBook,
  deleteBook,
  fetchDeletedBooks,
  restoreDeletedBook,
  permanentlyDeleteBook,
} from "../../features/admin/adminSlice";
import { toast } from "react-toastify";

const BooksPage = () => {
  const dispatch = useDispatch();

  const { books, deletedBooks, categories, hasMore, loading, error } = useSelector((state) => ({
    books: state.admin.books.books || [],
    deletedBooks: state.admin.deletedBooks || [],
    categories: state.admin.categories,
    hasMore: state.admin.hasMore,
    loading: state.admin.loading,
    error: state.admin.error,
  }));

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [open, setOpen] = useState(false);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState(0); // 0: Sách hiện tại, 1: Sách đã xóa

  // Fetch data
  useEffect(() => {
    if (tabValue === 0) {
      dispatch(fetchBooks({ page: 1 }));
      dispatch(fetchCategories());
    } else {
      dispatch(fetchDeletedBooks());
    }
  }, [dispatch, tabValue]);

  // Handle scroll for infinite scroll
  useEffect(() => {
    if (tabValue !== 0) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasMore &&
        !loading
      ) {
        dispatch(fetchBooks({ page: currentPage + 1 }))
          .unwrap()
          .then(() => {
            setCurrentPage((prev) => prev + 1);
          })
          .catch((err) => {
            console.error("Error fetching books:", err);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, hasMore, loading, dispatch, tabValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBook(newBook))
      .unwrap()
      .then(() => {
        toast.success("Thêm sách thành công!");
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
        setOpen(false);
      })
      .catch((err) => {
        toast.error(`Thêm sách thất bại: ${err}`);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenDeleteModal = (bookId) => {
    setBookToDelete(bookId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setBookToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      dispatch(deleteBook(bookToDelete))
        .unwrap()
        .then(() => {
          toast.success("Xóa sách thành công!");
          setOpenDeleteModal(false);
          setBookToDelete(null);
        })
        .catch((err) => {
          toast.error(`Không thể xóa sách: ${err}`);
        });
    }
  };

  const handleRestoreBook = (bookId) => {
    dispatch(restoreDeletedBook(bookId))
      .unwrap()
      .then((restoredBook) => {
        toast.success("Khôi phục sách thành công!");

        dispatch(fetchBooks({ page: 1 }));
        dispatch(fetchDeletedBooks());
      })
      .catch((err) => {
        toast.error(`Không thể khôi phục sách: ${err}`);
      });
  };

  const handlePermanentlyDelete = (bookId) => {
    dispatch(permanentlyDeleteBook(bookId))
      .unwrap()
      .then(() => {
        toast.success("Sách đã được xóa vĩnh viễn!");
      })
      .catch((err) => {
        toast.error(`Không thể xóa vĩnh viễn sách: ${err}`);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý sách
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Sách hiện tại" />
        <Tab label="Sách đã xóa" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Box mb={3}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Thêm sách mới
            </Button>
          </Box>

          <Grid container spacing={2} mt={2}>
            {books.length > 0 ? (
              books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      style={{ objectFit: "contain" }}
                      image={book.img || "/default-book.jpg"}
                      alt={book.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{book.name}</Typography>
                      <Typography>Tác giả: {book.author}</Typography>
                      <Typography>Giá: ${book.price}</Typography>
                      <Typography>Mô tả: {book.description}</Typography>
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteModal(book._id)}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>Không có sách nào.</Typography>
            )}
          </Grid>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={2} mt={2}>
          {deletedBooks.length > 0 ? (
            deletedBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    style={{ objectFit: "contain" }}
                    image={book.img || "/default-book.jpg"}
                    alt={book.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{book.name}</Typography>
                    <Typography>Tác giả: {book.author}</Typography>
                    <Typography>Giá: ${book.price}</Typography>
                    <Typography>Mô tả: {book.description}</Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <IconButton
                        color="primary"
                        onClick={() => handleRestoreBook(book._id)}
                      >
                        <Restore />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handlePermanentlyDelete(book._id)}
                      >
                        <DeleteForever />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>Không có sách đã xóa.</Typography>
          )}
        </Grid>
      )}

      {/* Modal thêm sách */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm sách mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên sách"
            name="name"
            value={newBook.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Tác giả"
            name="author"
            value={newBook.author}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Giá"
            name="price"
            value={newBook.price}
            onChange={handleChange}
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            value={newBook.description}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Thêm sách
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal xác nhận xóa */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sách này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksPage;
