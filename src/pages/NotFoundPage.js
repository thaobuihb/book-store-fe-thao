import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        py: 5,
      }}
    >
      {/* Ảnh minh họa */}
      <Box
        component="img"
        src="/404-illustration.png"
        alt="404"
        sx={{ width: "100%", maxWidth: 400, mb: 4 }}
      />

      {/* Tiêu đề */}
      <Typography variant="h3" gutterBottom>
        {t("notFound.title")}
      </Typography>

      {/* Mô tả */}
      <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
        {t("notFound.description")}
      </Typography>

      {/* Nút quay về */}
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        {t("notFound.backHome")}
      </Button>
    </Container>
  );
}

export default NotFoundPage;
