import React, { useState } from "react";
import {
    Box,
    Slider,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  

function PriceFilter({
    applyFilter,
    clearFilter,
    priceRange,
    setPriceRange,
  }) {
    const [filterExpanded, setFilterExpanded] = useState(false);
  
    const handleSliderChange = (event, newValue) => {
      setPriceRange(newValue);
    };
  
    const handleApplyFilter = () => {
      applyFilter(priceRange[0], priceRange[1]);
    };
  
    const handleClearFilter = () => {
      clearFilter();
      setPriceRange([20, 40]);
    };
  
    const handleToggleFilter = () => {
      setFilterExpanded(!filterExpanded);
    };

    return (
        <Accordion
          sx={{ height: "auto", minHeight: 55, width: 250, m: 1, borderRadius: 1 }}
          expanded={filterExpanded}
          onChange={handleToggleFilter}
        >
          <AccordionSummary sx={{}} expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              <b> Pricing Filter</b> ${priceRange[0]} - ${priceRange[1]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "1px solid rgba(0, 0, 0, 0.4)",
                borderRadius: 1,
                padding: 1,
                width: "100%",
              }}
            >
              <Slider
                value={priceRange}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={20}
                max={40}
                aria-labelledby="price-slider"
                sx={{ m: 1, width: 150 }}
              />
    
              <Typography variant="body2">
                Price: ${priceRange[0]} - ${priceRange[1]}
              </Typography>
    
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilter}
                size="small"
                sx={{ m: 1, width: 150, height: 40 }}
              >
                Apply Filter
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilter}
                size="small"
                sx={{ m: 1, width: 150, height: 40 }}
              >
                Clear All
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      );
    }

    export default PriceFilter;