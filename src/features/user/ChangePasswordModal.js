import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import {
  useForm,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../features/user/userSlice";
import FTextField from "../../components/form/FTextField";
import { buildChangePasswordSchema } from "../../utils/validationSchemas";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ChangePasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(buildChangePasswordSchema(t)),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
    control,
  } = methods;

  const newPassword = useWatch({ name: "newPassword", control });
  const confirmNewPassword = useWatch({ name: "confirmNewPassword", control });

  const passwordMismatch =
    confirmNewPassword && newPassword !== confirmNewPassword;

  const onSubmit = async (data) => {
    const { currentPassword, newPassword } = data;

    const resultAction = await dispatch(
      updatePassword({ currentPassword, newPassword })
    );

    if (updatePassword.rejected.match(resultAction)) {
      const message =
        resultAction.payload || "Có lỗi xảy ra khi đổi mật khẩu";
      setError("root", { message });
      return;
    }

    reset();
    onClose();
  };

  
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("profileUpdate.changePassword") || "Đổi mật khẩu"}</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers>
            <FTextField
              name="currentPassword"
              label={t("profileUpdate.currentPassword") || "Mật khẩu hiện tại"}
              type="password"
            />
            <FTextField
              name="newPassword"
              label={t("profileUpdate.newPassword") || "Mật khẩu mới"}
              type="password"
            />
            <FTextField
              name="confirmNewPassword"
              label={t("profileUpdate.confirmNewPassword") || "Xác nhận mật khẩu mới"}
              type="password"
            />
            {passwordMismatch && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {t("profileUpdate.passwordMismatch") || "Mật khẩu xác nhận không khớp"}
              </Typography>
            )}
            {errors.root && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.root.message}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t("profileUpdate.cancel") || "Huỷ"}
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {t("profileUpdate.submit") || "Xác nhận"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
