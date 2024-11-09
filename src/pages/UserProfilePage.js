import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import {
  updateUserProfile,
  getCurrentUserProfile,
  resetUpdateStatus,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const UserProfileUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isUpdateSuccess, error } = useSelector(
    (state) => state.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setEmail(user.email);
      setGender(user.gender);
      setBirthday(user.birthday);
      setAddress(user.address);
      setCity(user.city);
      setState(user.state);
      setZipcode(user.zipcode);
    } else if (isAuthenticated && !user) {
      dispatch(getCurrentUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(birthday) > new Date()) {
      setFormError("Ngày sinh không hợp lệ.");
      return;
    }

    const updatedData = {
      name,
      email,
      gender,
      birthday,
      address,
      city,
      state,
      zipcode,
      password,
    };

    try {
      await dispatch(updateUserProfile(updatedData)).unwrap();
    } catch (err) {
      setFormError("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      setSuccessMessage("Thông tin đã được cập nhật thành công!");
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
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Cập nhật thông tin cá nhân
      </Typography>
      {formError && <Typography color="error">{formError}</Typography>}
      {successMessage && <Typography color="primary">{successMessage}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
        />
        <TextField
          label="Giới tính"
          select
          fullWidth
          margin="normal"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="nam">Nam</MenuItem>
          <MenuItem value="nu">Nữ</MenuItem>
          <MenuItem value="khac">Khác</MenuItem>
        </TextField>
        <TextField
          label="Ngày sinh"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <TextField
          label="Địa chỉ"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Thành phố"
          fullWidth
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          label="Tỉnh/Bang"
          fullWidth
          margin="normal"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <TextField
          label="Mã bưu điện"
          fullWidth
          margin="normal"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <TextField
          label="Mật khẩu mới (nếu muốn thay đổi)"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Cập nhật
        </Button>
      </form>
    </Box>
  );
};

export default UserProfileUpdate;
