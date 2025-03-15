import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addManager,
  updateUser,
  deleteUser,
} from "../../features/admin/adminSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewManager({ name: "", email: "", password: "" });
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedRole(user.role);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setUpdatedRole("");
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    setNewManager((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "password" && { confirmPassword: "" }), 
    }));
  
    if (name === "confirmPassword" && value !== newManager.password) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Mật khẩu không khớp" }));
    } else {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name]; 
        if (name === "password") delete updatedErrors.confirmPassword; 
        return updatedErrors;
      });
    }
  };
  

  const handleAddManager = () => {
    const newErrors = {};

    if (newManager.password !== newManager.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }  

    // ✅ Kiểm tra tên
    if (!newManager.name.trim()) newErrors.name = "Vui lòng nhập tên.";

    // ✅ Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newManager.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(newManager.email)) {
      newErrors.email = "Email không hợp lệ.";
    } else if (users.some((user) => user.email === newManager.email)) {
      newErrors.email = "Email đã tồn tại, vui lòng chọn email khác.";
    }

    // ✅ Kiểm tra mật khẩu
    const password = newManager.password.trim();
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    dispatch(addManager(newManager))
      .unwrap()
      .then(() => {
        console.log("Manager added successfully");
        handleCloseAddModal();
      })
      .catch((error) => console.error("Failed to add manager:", error));
  };

  const handleUpdateRole = () => {
    if (selectedUser) {
      dispatch(
        updateUser({
          userId: selectedUser._id,
          updatedData: { role: updatedRole },
        })
      )
        .unwrap()
        .then(() => {
          handleCloseEditModal();
        })
        .catch((error) => {
          console.error("Failed to update role:", error);
          handleCloseEditModal();
        });
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser._id))
        .unwrap()
        .then(() => {
          console.log("User deleted successfully");
          handleCloseDeleteModal();
        })
        .catch((error) => console.error("Failed to delete user:", error));
    }
  };

  if (loading && !editModalOpen && !addModalOpen) {
    return <CircularProgress />;
  }
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container>
      {/* Nút Thêm Quản Lý */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddModal}
        sx={{ mb: 2 }}
      >
        Thêm quản lý
      </Button>
      {/* Bảng Người Dùng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenEditModal(user)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteModal(user)}
                      sx={{ ml: 1 }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>Không có người dùng nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal Thêm Quản Lý */}
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
            Thêm Quản Lý
          </Typography>

          {/* Ô nhập Tên */}
          <TextField
            label="Tên"
            name="name"
            value={newManager.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Nhập tên quản lý"
            autoComplete="off"
            autoFocus
          />

          {/* Ô nhập Email */}
          <TextField
            label="Email"
            name="email"
            value={newManager.email}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            placeholder="Nhập email hợp lệ"
            autoComplete="off"
          />

          {/* Ô nhập Mật khẩu + Hiển thị mật khẩu */}
          <TextField
            label="Mật khẩu"
            name="password"
            value={newManager.password}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="Mật khẩu mạnh (8+ ký tự, chữ hoa, số, ký tự đặc biệt)"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Ô nhập lại mật khẩu + Hiển thị mật khẩu */}
          <TextField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            value={newManager.confirmPassword}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            type={showConfirmPassword ? "text" : "password"}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Nút hành động */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseAddModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleAddManager}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              ) : (
                "Thêm"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal Sửa Vai Trò */}
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
            Cập Nhật Vai Trò Người Dùng
          </Typography>
          <Typography>Tên: {selectedUser?.name}</Typography>
          <Typography>Email: {selectedUser?.email}</Typography>
          <Select
            fullWidth
            value={updatedRole}
            onChange={(e) => setUpdatedRole(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="customer">Khách hàng</MenuItem>
            <MenuItem value="manager">Quản lý</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseEditModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateRole}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Lưu"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal Xóa Người Dùng */}
      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
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
            Bạn có chắc muốn xóa người dùng này không?
          </Typography>
          <Typography>
            Tên: {selectedUser?.name}
            <br />
            Email: {selectedUser?.email}
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDeleteModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UsersPage;
