import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, MenuItem } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getCurrentUserProfile,
  resetUpdateStatus,
  updateProfileByUser,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FTextField from "../components/form/FTextField";
import { buildUpdateProfileSchema } from "../utils/validationSchemas";
import ChangePasswordModal from "../features/user/ChangePasswordModal";

const UserProfileUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { user, isAuthenticated, isUpdateSuccess } = useSelector(
    (state) => state.user
  );
  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0];
  const schema = buildUpdateProfileSchema(t);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      birthday: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      houseNumber: "",
      phone: "",
      zipcode: "",
      password: "",
    },
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (isAuthenticated && user) {
      reset({
        ...user,
        password: "",
      });
    } else if (isAuthenticated && !user) {
      dispatch(getCurrentUserProfile());
    }
  }, [user, isAuthenticated, dispatch, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfileByUser(data)).unwrap();
    } catch (err) {
      setError("root", { message: t("profileUpdate.error") });
    }
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateStatus());
        navigate(-1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isUpdateSuccess, dispatch, navigate]);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {t("profileUpdate.title")}
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FTextField name="name" label={t("profileUpdate.name")} />
          <FTextField name="email" label={t("profileUpdate.email")} disabled />

          <FTextField name="gender" label={t("profileUpdate.gender")} select>
            <MenuItem value="nam">{t("profileUpdate.male")}</MenuItem>
            <MenuItem value="nu">{t("profileUpdate.female")}</MenuItem>
            <MenuItem value="khac">{t("profileUpdate.other")}</MenuItem>
          </FTextField>

          <FTextField
            name="birthday"
            label={t("profileUpdate.birthday")}
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
          />

          <FTextField name="city" label={t("profileUpdate.city")} />
          <FTextField name="district" label={t("profileUpdate.district")} />
          <FTextField name="ward" label={t("profileUpdate.ward")} />
          <FTextField name="street" label={t("profileUpdate.street")} />
          <FTextField name="houseNumber" label={t("profileUpdate.houseNumber")} />
          <FTextField name="phone" label={t("profileUpdate.phone")} />
          <FTextField name="zipcode" label={t("profileUpdate.zipcode")} />

          <Button
            variant="outlined"
            onClick={() => setOpenChangePassword(true)}
            sx={{ mt: 2 }}
          >
            {t("profileUpdate.changePassword") || "Đổi mật khẩu"}
          </Button>

          {errors.root && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.root.message}
            </Typography>
          )}

          {isUpdateSuccess && (
            <Typography color="primary" sx={{ mt: 1 }}>
              {t("profileUpdate.success")}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              {t("profileUpdate.cancel") || "Huỷ"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {t("profileUpdate.submit")}
            </Button>
          </Box>
        </form>
      </FormProvider>
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </Box>
  );
};

export default UserProfileUpdate;
