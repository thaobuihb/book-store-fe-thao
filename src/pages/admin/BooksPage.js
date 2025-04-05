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
  updateBook,
} from "../../features/admin/adminSlice";
import { toast } from "react-toastify";

// Cắt ngắn mô tả
const getFormattedDescription = (description, maxLength = 50, showFull) => {
  if (showFull || description.length <= maxLength) {
    return description;
  }
  return `${description.slice(0, maxLength)}...`;
};

const BooksPage = () => {
  const dispatch = useDispatch();
  const { books, deletedBooks, categories, hasMore, loading, error } =
    useSelector((state) => ({
      books: state.admin.books.books || [],
      deletedBooks: state.admin.deletedBooks || [],
      categories: state.admin.categories || [],
      hasMore: state.admin.hasMore,
      loading: state.admin.loading,
      error: state.admin.error,
    }));

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");

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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    if (!newBook.name.trim()) tempErrors.name = "Không được để trống";
    if (!newBook.price) tempErrors.price = "Không được để trống";
    if (!newBook.publicationDate)
      tempErrors.publicationDate = "Không được để trống";
    if (!newBook.categoryId) tempErrors.categoryId = "Không được để trống";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [bookToUpdate, setBookToUpdate] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [showFullDescriptions, setShowFullDescriptions] = useState({});

  // Fetch data
  useEffect(() => {
    if (tabValue === 0) {
      dispatch(fetchBooks({ page: 1 }));
      dispatch(fetchCategories());
    } else {
      dispatch(fetchDeletedBooks());
    }
    setSearchTerm("");
  }, [dispatch, tabValue]);

  // Handle scroll for infinite scroll
  useEffect(() => {
    if (tabValue !== 0) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !loading &&
        hasMore
      ) {
        dispatch(fetchBooks({ page: currentPage + 1 }))
          .unwrap()
          .then(() => setCurrentPage((prev) => prev + 1))
          .catch((err) => {
            toast.error(`Lỗi tải sách: ${err}`);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, currentPage, hasMore, loading, tabValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📦 newBook:", newBook);

    const sanitizedBook = {
      ...newBook,
      price: Number(newBook.price),
      discountRate: Number(newBook.discountRate || 0),
      categoryId: newBook.categoryId?.trim(),
    };

    console.log("🚀 GỬI LÊN BACKEND:", sanitizedBook);

    try {
      await dispatch(createBook(sanitizedBook)).unwrap();

      toast.success("Thêm sách thành công!");

      setOpen(false);
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

      setErrors({});
    } catch (err) {
      console.error("🧨 unwrap().catch() => err =", err);

      if (err && typeof err === "object" && err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err?.message || "Lỗi không xác định" });
      }
    }
  };

  // update
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name === "discountRate") {
      const sanitizedValue = value < 0 ? 0 : value;
      setBookToUpdate((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    } else {
      setBookToUpdate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOpenUpdateModal = (book) => {
    if (!book._id) {
      toast.error("Thiếu ID sách để cập nhật.");
      return;
    }
    setBookToUpdate({
      ...book,
      categoryId:
        book.categoryId ||
        categories.find((cat) => cat.categoryName === book.categoryName)?._id ||
        "",
    });
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmit = () => {
    if (!bookToUpdate._id) {
      toast.error("Không thể cập nhật sách do thiếu ID!");
      return;
    }

    const sanitizedBook = {
      ...bookToUpdate,
      discountRate:
        bookToUpdate.discountRate < 0 ? 0 : bookToUpdate.discountRate,
    };

    dispatch(
      updateBook({ bookId: bookToUpdate._id, updatedData: sanitizedBook })
    )
      .unwrap()
      .then(() => {
        toast.success("Cập nhật sách thành công!");
        setOpenUpdateModal(false);
      })
      .catch((err) => toast.error(`Cập nhật thất bại: ${err}`));
  };

  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  //xoá sách
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // 👉 Reset dữ liệu form và lỗi khi đóng modal
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

    setErrors({});
  };

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
  //mô tả
  const toggleDescription = (bookId) => {
    setShowFullDescriptions((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  //tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const filteredBooks = (tabValue === 0 ? books : deletedBooks).filter(
    (book) => {
      if (!searchTerm) return true;
      if (searchCriteria === "categoryId") {
        const category = categories.find((cat) => cat._id === book.category);
        return category
          ? category.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : false;
      }

      const value = book[searchCriteria];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (typeof value === "number") {
        return value.toString().includes(searchTerm);
      }
      return false;
    }
  );

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Sách hiện tại" />
          <Tab label="Sách đã xóa" />
        </Tabs>
        <Box display="flex" alignItems="center">
          <Select
            value={searchCriteria}
            onChange={handleSearchCriteriaChange}
            sx={{ marginRight: "3px" }}
          >
            <MenuItem value="Isbn">ISBN</MenuItem>
            <MenuItem value="name">Tên sách</MenuItem>
            <MenuItem value="author">Tác giả</MenuItem>
            <MenuItem value="price">Giá</MenuItem>
            <MenuItem value="categoryId">Danh mục</MenuItem>
          </Select>
          <TextField
            label="Tìm kiếm sách"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm sách mới
        </Button>
      </Box>

      {tabValue === 0 && (
        <>
          <Grid container spacing={2} mt={2}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
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
                      <Typography variant="h8" sx={{ fontWeight: "bold" }}>
                        {book.name}
                      </Typography>
                      <Typography>ISBN: {book.Isbn}</Typography>
                      <Typography>Tác giả: {book.author}</Typography>
                      <Typography>Giá: ${book.price}</Typography>
                      <Typography>Danh mục: {book.categoryName}</Typography>
                      <Typography>
                        Tỷ lệ giảm giá: {book.discountRate || 0}%
                      </Typography>
                      <Typography>
                        Giá đã giảm: ${book.discountedPrice || book.price}
                      </Typography>
                      <Typography>
                        Mô tả:{" "}
                        {getFormattedDescription(
                          book.description,
                          50,
                          showFullDescriptions[book._id]
                        )}
                        {book.description.length > 50 && (
                          <Button
                            size="small"
                            onClick={() => toggleDescription(book._id)}
                          >
                            {showFullDescriptions[book._id]
                              ? "Ẩn bớt"
                              : "Xem thêm"}
                          </Button>
                        )}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenUpdateModal(book)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            setBookToDelete(book._id) ||
                            setOpenDeleteModal(true)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>
                Không có sách được tìm
              </Typography>
            )}
          </Grid>
          {loading && <Typography>Đang tải thêm sách...</Typography>}
          {!hasMore && <Typography>Đã tải hết danh sách sách.</Typography>}
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
                    <Typography variant="h8" sx={{ fontWeight: "bold" }}>
                      {book.name}{" "}
                    </Typography>
                    <Typography>ISBN: {book.Isbn}</Typography>
                    <Typography>Tác giả: {book.author}</Typography>
                    <Typography>Giá: ${book.price}</Typography>
                    <Typography>Danh mục: {book.categoryName}</Typography>
                    <Typography>
                      Mô tả:{" "}
                      {getFormattedDescription(
                        book.description,
                        50,
                        showFullDescriptions[book._id]
                      )}
                      {book.description.length > 50 && (
                        <Button
                          size="small"
                          onClick={() => toggleDescription(book._id)}
                        >
                          {showFullDescriptions[book._id]
                            ? "Ẩn bớt"
                            : "Xem thêm"}
                        </Button>
                      )}
                    </Typography>
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Thêm sách mới</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
          >
            <TextField
              label="Tên sách *"
              name="name"
              value={newBook.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Tác giả"
              name="author"
              value={newBook.author}
              onChange={handleChange}
              error={!!errors.author}
              helperText={errors.author}
              fullWidth
            />

            <TextField
              label="Giá sách *"
              name="price"
              type="number"
              inputProps={{ min: 0 }}
              value={newBook.price}
              onChange={handleChange}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
            />

            <TextField
              label="Ngày xuất bản *"
              name="publicationDate"
              type="date"
              value={newBook.publicationDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
              error={!!errors.publicationDate}
              helperText={errors.publicationDate}
            />

            <TextField
              label="Ảnh (URL)"
              name="img"
              value={newBook.img}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Mô tả"
              name="description"
              multiline
              rows={4}
              value={newBook.description}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Tỉ lệ giảm giá (%)"
              name="discountRate"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              value={newBook.discountRate}
              onChange={handleChange}
              fullWidth
            />
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.categoryId}
            >
              <InputLabel
                shrink={true}
                sx={{ fontSize: "18px", color: "black" }}
              >
                Danh mục
              </InputLabel>
              <Select
                name="categoryId"
                value={newBook.categoryId || ""}
                onChange={handleChange}
                displayEmpty
                label="Danh mục"
              >
                <MenuItem value="" disabled>
                  Chọn danh mục
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

      {/* Modal Cập nhật sách */}
      <Dialog
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cập nhật thông tin sách</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
          >
            <TextField
              label="Tên sách"
              name="name"
              value={bookToUpdate.name}
              onChange={handleUpdateChange}
              fullWidth
            />
            <TextField
              label="Tác giả"
              name="author"
              value={bookToUpdate.author}
              onChange={handleUpdateChange}
              fullWidth
            />
            <TextField
              label="Giá sách"
              name="price"
              type="number"
              value={bookToUpdate.price}
              onChange={handleUpdateChange}
              fullWidth
            />
            <TextField
              label="Tỉ lệ giảm giá (%)"
              name="discountRate"
              type="number"
              value={bookToUpdate.discountRate || 0}
              onChange={handleUpdateChange}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Ngày xuất bản"
              name="publicationDate"
              type="date"
              value={bookToUpdate.publicationDate}
              onChange={handleUpdateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Ảnh (URL)"
              name="img"
              value={bookToUpdate.img}
              onChange={handleUpdateChange}
              fullWidth
            />
            <TextField
              label="Mô tả"
              name="description"
              multiline
              rows={4}
              value={bookToUpdate.description}
              onChange={handleUpdateChange}
              fullWidth
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel
                shrink={true}
                sx={{ fontSize: "18px", color: "black" }}
              >
                Danh mục
              </InputLabel>
              <Select
                name="categoryId"
                value={bookToUpdate.categoryId || ""}
                onChange={handleUpdateChange}
                displayEmpty
                // sx={{ fontSize: "16px", color: "black" }}
                label="Danh mục"
              >
                <MenuItem value="" disabled>
                  Chọn danh mục
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksPage;
