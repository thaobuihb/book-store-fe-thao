import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CancelOrderDialog = ({ open, handleClose, handleConfirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("cart.deleteConfirmTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("cart.deleteConfirmText")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("no")}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {t("cart.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderDialog;