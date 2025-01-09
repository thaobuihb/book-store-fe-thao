import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../features/admin/adminSlice';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.admin.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleOpenOrderDetail = (order) => {
    setSelectedOrder(order);
    setOpenOrderDetail(true);
  };

  const handleCloseOrderDetail = () => {
    setOpenOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then(() => toast.success('Cập nhật trạng thái thành công!'))
      .catch((err) => toast.error(`Lỗi: ${err}`));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>Quản lý đơn hàng</Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Tìm kiếm theo tên khách hàng"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ width: '200px' }}
        >
          <MenuItem value="">Tất cả trạng thái</MenuItem>
          <MenuItem value="Processing">Đang xử lý</MenuItem>
          <MenuItem value="Shipped">Đang giao</MenuItem>
          <MenuItem value="Completed">Hoàn tất</MenuItem>
          <MenuItem value="Cancelled">Đã hủy</MenuItem>
        </Select>
      </Box>

      {/* Danh sách đơn hàng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  >
                    <MenuItem value="Processing">Đang xử lý</MenuItem>
                    <MenuItem value="Shipped">Đang giao</MenuItem>
                    <MenuItem value="Completed">Hoàn tất</MenuItem>
                    <MenuItem value="Cancelled">Đã hủy</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenOrderDetail(order)}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <Dialog open={openOrderDetail} onClose={handleCloseOrderDetail} maxWidth="md" fullWidth>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          <DialogContent>
            <Typography>Mã đơn hàng: {selectedOrder._id}</Typography>
            <Typography>Tên khách hàng: {selectedOrder.customerName}</Typography>
            <Typography>Email: {selectedOrder.customerEmail}</Typography>
            <Typography>Ngày đặt hàng: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
            <Typography>Tổng tiền: ${selectedOrder.totalAmount}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Danh sách sản phẩm</Typography>
            {selectedOrder.items.map((item, index) => (
              <Box key={index} sx={{ mt: 1 }}>
                <Typography>- {item.bookName} (x{item.quantity}) - ${item.price}</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOrderDetail} color="secondary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default OrderPage;
