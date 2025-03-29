import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  TextField,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetAuthStatus } from "../features/user/userSlice";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isForgotSuccess, resetUrl } = useSelector(
    (state) => state.user
  );
  console.log("resetUrl in UI:", resetUrl);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgotPassword(email));
  };

  // Reset trạng thái khi unmount trang
  useEffect(() => {
    return () => {
      dispatch(resetAuthStatus());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h5" textAlign="center">
            Forgot Your Password?
          </Typography>

          {isForgotSuccess && (
            <Alert severity="success">
              Reset link has been sent successfully!
            </Alert>
          )}

          {resetUrl && (
            <Alert severity="info">
              <Button
                variant="text"
                onClick={() => {
                  // Lấy phần token từ resetUrl
                  const token = resetUrl.split("/").pop();
                  navigate(`/reset-password/${token}`);
                }}
              >
                Click here to reset your password now
              </Button>
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default ForgotPasswordPage;
