import React, { useState, useRef, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

function SearchInput({ handleSubmit }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      handleSubmit(trimmedQuery);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    console.log("searchQuery:******", value);
  
    if (value.trim() === "" && location.pathname !== "/") {
      console.log("🔁 Navigating to /");
      navigate("/");
    }
  };

  // Reset cờ khi người dùng gõ lại
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      hasNavigatedRef.current = false;
    }
  }, [searchQuery]);

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <TextField
        value={searchQuery}
        placeholder={t("searchByName")}
        onChange={handleChange}
        sx={{ width: "100%" }}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                color="primary"
                aria-label="search by name"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default SearchInput;
