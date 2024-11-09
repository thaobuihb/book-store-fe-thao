import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";

const ContactUs = () => {
  return (
    <Box
      sx={{
        paddingY: 5,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFE4E1",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, fontSize: "3.5rem" }}
      >
        We’re here for you
      </Typography>

      {/* Contact Section */}
      <Typography
        variant="body1"
        sx={{ mb: 2, maxWidth: 700, fontSize: "1.2rem" }}
      >
        Our friendly team is always here to assist via email. For other
        inquiries, please contact us at
        <Link
          href="#"
          sx={{ ml: 1, color: "primary.main" }}
        >
          susuanna@gmail.com
        </Link>
        . Thank you!
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mt: 3, fontSize: "2.5rem", color: "#4682B4" }}
      >
        Support for Existing Orders
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 4, maxWidth: 700, fontSize: "1.2rem" }}
      >
        Please include your Order Number in the email subject line for faster
        assistance.
      </Typography>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
        >
          booksuna.com.vn
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "1rem" }}>
          orders.vn@booksuna.com
        </Typography>
      </Box>

      {/* Head Office */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          Head Office
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          123, Quan Thanh, Ba Dinh, Ha Noi
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          Viet Nam
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          +84 123-123-123
        </Typography>
        <Typography variant="body2">
          <Link
            href="#"
            sx={{ color: "primary.main", fontSize: "1.2rem" }}
          >
            susuanna@gmail.com
          </Link>
        </Typography>
      </Box>

      {/* Connect Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          Connect
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <IconButton
            href="https://www.instagram.com"
            target="_blank"
            color="primary"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://www.facebook.com"
            target="_blank"
            color="primary"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="https://www.twitter.com"
            target="_blank"
            color="primary"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            href="https://www.pinterest.com"
            target="_blank"
            color="primary"
          >
            <PinterestIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ marginTop: 6, padding: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}
        >
          Get In Touch
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "2.5rem" }}>
          We look forward to hearing from you
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactUs;
