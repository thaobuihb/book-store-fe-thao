import React, { useEffect } from "react";
import {
  Container,
  Stack,
  Typography,
  TextField,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetAuthStatus } from "../features/user/userSlice";
import { buildChangePasswordSchema} from "../utils/validationSchemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";


function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { t } = useTranslation();

  const { isLoading, error, isResetSuccess } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(buildChangePasswordSchema(t)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(resetPassword({ token, password: data.password }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isResetSuccess) {
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [isResetSuccess, navigate]);

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h5" textAlign="center">
          {t("resetPassword.title")}
          </Typography>

          {isResetSuccess && (
            <Alert severity="success">
              {t("resetPassword.success")}
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label={t("resetPassword.newPassword")}
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label={t("resetPassword.confirmPassword")}
            type="password"
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || isLoading}
            startIcon={(isSubmitting || isLoading) && <CircularProgress size={20} />}
          >
            {isLoading ? t("resetPassword.loading") : t("resetPassword.button")}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default ResetPasswordPage;
