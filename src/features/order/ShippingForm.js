import React from "react";
import { TextField, Box } from "@mui/material";

const ShippingForm = ({ formData, errors, handleInputChange, t }) => {
  return (
    <Box component="form" noValidate autoComplete="off">
      {Object.keys(formData).map((field) => (
        <TextField
          key={field}
          label={t(`order.fields.${field}`)}
          name={field}
          value={formData[field]}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={!!errors[field]}
          helperText={errors[field] ? t("order.missingField") : ""}
        />
      ))}
    </Box>
  );
};

export default ShippingForm;
