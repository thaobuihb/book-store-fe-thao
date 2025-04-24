import React, { useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function SearchInput({ handleSubmit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();

    if (trimmed) {
      handleSubmit(trimmed); 
    } else {
      navigate("/", { replace: true, state: { fromSearchClear: true } });
    }
  };

  useEffect(() => {
    const raw = searchParams.get("search");
    if (
      location.pathname === "/books" &&
      raw !== null &&
      raw.trim() === ""
    ) {
      navigate("/", { replace: true, state: { fromSearchClear: true } });
    }
  }, [searchParams, location, navigate]);

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <TextField
        value={searchQuery}
        placeholder={t("searchByName")}
        onChange={(e) => {
          const value = e.target.value;
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value.trim()) {
              next.set("search", value);
            } else {
              next.delete("search"); 
            }
            return next;
          });
        }}
        sx={{ width: "100%" }}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" color="primary">
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
