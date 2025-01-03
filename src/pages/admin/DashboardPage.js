import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../features/admin/adminSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {

    console.log("Dispatching fetchDashboardData...");
    dispatch(fetchDashboardData());
  }, [dispatch]);


  useEffect(() => {
    console.log("Dashboard state:", { dashboard, loading, error });
  }, [dashboard, loading, error]);

  // Hiển thị trạng thái loading khi dữ liệu đang được tải
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Hiển thị lỗi nếu có lỗi xảy ra
  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography color="error">
          Error: {error.message || "Failed to load data"}
        </Typography>
      </Box>
    );
  }

  // Kiểm tra nếu dashboard không có dữ liệu
  if (!dashboard) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6">Total Books</Typography>
            <Typography variant="h4">{dashboard?.totalBooks || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">{dashboard?.totalOrders || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboard?.totalUsers || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">${dashboard?.totalRevenue || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
