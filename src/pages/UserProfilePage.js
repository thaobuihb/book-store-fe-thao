import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import {
  updateUserProfile,
  getCurrentUserProfile,
  resetUpdateStatus,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserProfileUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isUpdateSuccess, error } = useSelector(
    (state) => state.user
  );
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Ngày hiện tại để dùng làm max cho ngày sinh
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setEmail(user.email);
      setGender(user.gender);
      setBirthday(user.birthday);
      setCity(user.city);
      setState(user.state);
      setDistrict(user.district);
      setWard(user.ward);
      setStreet(user.street);
      setHouseNumber(user.houseNumber);
      setPhone(user.phone);
      setZipcode(user.zipcode);
    } else if (isAuthenticated && !user) {
      dispatch(getCurrentUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu ngày sinh là ngày tương lai
    if (new Date(birthday) > new Date()) {
      setFormError("Ngày sinh không hợp lệ.");
      return;
    }

    const updatedData = {
      name,
      email,
      gender,
      birthday,
      city,
      state,
      district,
      ward,
      street,
      houseNumber,
      phone,
      zipcode,
      password,
    };

    try {
      await dispatch(updateUserProfile(updatedData)).unwrap();
    } catch (err) {
      setFormError(t("profileUpdate.updateError"));
    }
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      setSuccessMessage(t("profileUpdate.updateSuccess"));
      setFormError("");

      const timer = setTimeout(() => {
        dispatch(resetUpdateStatus());
        navigate(-1);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (error) {
      setFormError(error);
    }
  }, [isUpdateSuccess, error, navigate, dispatch]);

  return (
    <Box
      sx={{ maxWidth: 600, margin: "auto", padding: 4, textAlign: "center" }}
    >
      <Typography variant="h4" gutterBottom>
        {t("profileUpdate.title")}
      </Typography>
      {formError && <Typography color="error">{t("profileUpdate.updateError")}</Typography>}
      {successMessage && (
        <Typography color="primary">{successMessage}</Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label={t("profileUpdate.name")}
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.email")}
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
        />
        <TextField
          label={t("profileUpdate.gender")}
          select
          fullWidth
          margin="normal"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="nam">{t("profileUpdate.male")}</MenuItem>
          <MenuItem value="nu">{t("profileUpdate.female")}</MenuItem>
          <MenuItem value="khac">{t("profileUpdate.other")}</MenuItem>
        </TextField>
        <TextField
          label={t("profileUpdate.birthday")}
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: today }}
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.city")}
          fullWidth
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.district")}
          fullWidth
          margin="normal"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.ward")}
          fullWidth
          margin="normal"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.street")}
          fullWidth
          margin="normal"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.houseNumber")}
          fullWidth
          margin="normal"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.phone")}
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.zipcode")}
          fullWidth
          margin="normal"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <TextField
          label={t("profileUpdate.newPassword")}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          {t("profileUpdate.submit")}
        </Button>
      </form>
    </Box>
  );
};

export default UserProfileUpdate;
