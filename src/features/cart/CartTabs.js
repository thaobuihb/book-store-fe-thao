import React from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const CartTabs = ({ currentTab, handleTabChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h4" gutterBottom>{t("cartTitle")}</Typography>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Cart and Purchase History"
      >
        <Tab label={t("cartTab")} id="tab-0" aria-controls="tabpanel-0" />
        <Tab label={t("historyTab")} id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>
    </>
  );
};

export default CartTabs;