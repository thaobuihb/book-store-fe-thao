import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Tổng số sách */}
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
            <Typography variant="h4">120</Typography>
          </Paper>
        </Grid>

        {/* Tổng số đơn hàng */}
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
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>

        {/* Tổng số người dùng */}
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
            <Typography variant="h4">200</Typography>
          </Paper>
        </Grid>

        {/* Doanh thu */}
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
            <Typography variant="h4">$10,000</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
