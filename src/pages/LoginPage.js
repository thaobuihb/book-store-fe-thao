import React, { useState } from "react";
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { FCheckbox, FormProvider, FTextField } from "../components/form";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";



function LoginPage({ setUserProfile }) {
  const { t } = useTranslation();
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email(t("login.invalidEmail"))
    .required(t("login.requiredEmail")),
  password: Yup.string().required(t("login.requiredPassword")),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const user = await auth.login(data);
  
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      }
  
      if (setUserProfile) {
        setUserProfile({
          name: user.name,
          avatar: user.avatar || null,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
  
      setError("responseError", {
        type: "manual",
        message:
          error?.response?.data?.message || 
          t("login.invalidCredentials") || 
          "Đã có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };
  

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.responseError && (
            <Alert severity="error">{errors.responseError.message}</Alert>
          )}
          <Alert severity="info">
          {t("login.noAccount")}{" "}
            <Link variant="subtitle2" component={RouterLink} to="/register">
            {t("login.getStarted")}
            </Link>
          </Alert>

          <FTextField name="email" label={t("login.email")} />

          <FTextField
            name="password"
            label={t("login.password")}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FCheckbox name="remember" label={t("login.remember")}  />
          <Link component={RouterLink} variant="subtitle2" to="/forgot-password">
          {t("login.forgot")}
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
         {t("login.button")}
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}

export default LoginPage;
