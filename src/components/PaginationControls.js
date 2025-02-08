import { Box, IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const PaginationControls = ({ category, position, onPageChange, currentPage, totalPages }) => {
  if (!onPageChange) {
    console.error(`PaginationControls: Missing onPageChange function for category ${category}`);
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: "50px" }}>
      {position === "left" && (
        <IconButton
          onClick={() => onPageChange(category, -1)}
          disabled={currentPage === 1}
          sx={{
            fontWeight: "bold",
            backgroundColor: "rgba(0, 0, 0, 0.1)", 
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "#000",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
      )}

      {position === "right" && (
        <IconButton
          onClick={() => onPageChange(category, 1)}
          disabled={currentPage === totalPages}
          sx={{
            fontWeight: "bold",
            backgroundColor: "rgba(0, 0, 0, 0.1)", 
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "#000", 
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)", 
            },
          }}
        >
          <ArrowRightIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default PaginationControls;
