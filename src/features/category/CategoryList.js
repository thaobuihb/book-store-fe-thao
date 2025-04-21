import React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CategoryList = ({ categories, onCategoryClick }) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={2} justifyContent="center">
      {categories.map((category) => (
        <Grid item key={category.id} xs={6} sm={4} md={3} lg={2}>
          <Card
            sx={{
              height: 220,
              p: 1,
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardActionArea onClick={() => onCategoryClick(category.id)}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  mb: 0.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {category.name}
              </Typography>

              {category.sampleBookImage && (
                <CardMedia
                  component="img"
                  image={category.sampleBookImage}
                  alt={category.name}
                  sx={{
                    width: "100%",
                    height: 150,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              )}

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: 1, fontSize: 14, fontWeight: "bold" }}
              >
                {category.count} {t("book")}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryList;
