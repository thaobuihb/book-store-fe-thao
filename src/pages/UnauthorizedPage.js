import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function UnauthorizedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Container>
  );
}

export default UnauthorizedPage;
