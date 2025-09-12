import React from "react";
import PropTypes from "prop-types";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

const ProductsDiscount = ({ discounts, selectedDiscounts, onSelectDiscount }) => {
  // Ensure valid discounts and sort them in descending order
  const sortedDiscounts = [...(discounts || [])]
    .filter((discount) => discount.percentage && discount.label) // Ensure valid data
    .sort((a, b) => b.percentage - a.percentage); // Sort from highest to lowest
console.log("discount",sortedDiscounts);

  return (
    <Box sx={{ mt: 1 }}>
      {sortedDiscounts.map((discount) => (
        <Box key={discount.id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDiscounts?.includes(discount.percentage)}
                onChange={() => onSelectDiscount(discount.percentage)}
                size="small"
                sx={{
                  "&.Mui-checked": {
                    color: "primary.main",
                  },
                  marginLeft:"10px"
                }}
              />
            }
            label={discount.label}
            sx={{
              display: "flex",
              alignItems: "center",
              "& .MuiFormControlLabel-label": {
                fontSize: 14,
                color: "text.secondary",
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

ProductsDiscount.propTypes = {
  discounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedDiscounts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectDiscount: PropTypes.func.isRequired,
};

export default ProductsDiscount;
