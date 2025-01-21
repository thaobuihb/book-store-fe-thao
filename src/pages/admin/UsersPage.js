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
} from "@mui/material";
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

  const [addModalOpen, setAddModalOpen] = useState(false); // Modal Thêm quản lý
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal Sửa vai trò
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal Xóa người dùng

  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");

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
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManager = () => {
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
          <TextField
            label="Tên"
            name="name"
            value={newManager.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newManager.email}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            name="password"
            value={newManager.password}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            type="password"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseAddModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleAddManager}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Thêm"}
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
