import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../features/admin/adminSlice";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((state) => state.admin);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setCategoryForm({ categoryName: "", description: "" });
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      categoryName: category.categoryName,
      description: category.description,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    dispatch(addCategory(categoryForm))
      .unwrap()
      .then(() => {
        console.log("Category added successfully");
        handleCloseAddModal();
      })
      .catch((error) => console.error("Failed to add category:", error));
  };

  const handleUpdateCategory = () => {
    if (selectedCategory) {
      dispatch(
        updateCategory({
          categoryId: selectedCategory._id,
          updatedData: categoryForm,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Category updated successfully");
          handleCloseEditModal();
        })
        .catch((error) => console.error("Failed to update category:", error));
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      dispatch(deleteCategory(categoryId))
        .unwrap()
        .then(() => console.log("Category deleted successfully"))
        .catch((error) => console.error("Failed to delete category:", error));
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
          Thêm Danh Mục
        </Button>
      </Box>
      <List>
        {categories.map((category) => (
          <ListItem
            key={category._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <ListItemText
              primary={category.categoryName}
              secondary={category.description}
            />
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenEditModal(category)}
              >
                Sửa
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteCategory(category._id)}
              >
                Xóa
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Modal Thêm Danh Mục */}
      <Modal open={addModalOpen} onClose={handleCloseAddModal}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            borderRadius: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Thêm Danh Mục
          </Typography>
          <TextField
            label="Tên danh mục"
            name="categoryName"
            value={categoryForm.categoryName}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={categoryForm.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseAddModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleAddCategory}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Sửa Danh Mục */}
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            borderRadius: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Sửa Danh Mục
          </Typography>
          <TextField
            label="Tên danh mục"
            name="categoryName"
            value={categoryForm.categoryName}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={categoryForm.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseEditModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleUpdateCategory}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoriesPage;