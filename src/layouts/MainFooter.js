import React from "react";
import { Link, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";


function MainFooter() {

  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: "primary.main", p: 0, m: 0 }}>
      <Box sx={{ bgcolor: "#B2EBF2", p: 0, m: 0, border: "none" }}>
        {" "}
        {/* Thêm padding và borderRadius */}
        <Typography
          variant="body1"
          color="inherit"
          align="center"
          sx={{ opacity: 0.8 }}
        >
          {t('footerIntro')}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="white"
        align="center"
        sx={{ textAlign: "center", p: 3 }}
      >
        {t('copyright', { year })}{" "}
        <Link color="inherit" href="">
          BookStore
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}

export default MainFooter;
