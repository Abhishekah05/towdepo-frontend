import React from "react";
import {
  alpha,
  Box,
  Hidden,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AppSearch from "@crema/components/AppSearchBar";
import ListIcon from "@mui/icons-material/List";
import AppsIcon from "@mui/icons-material/Apps";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import AppsPagination from "@crema/components/AppsPagination";
import { VIEW_TYPE } from "../index";

const IconBtn = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.disabled,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  padding: 4,
  "&:hover, &:focus": {
    color: theme.palette.primary.main,
  },
  "&.active": {
    color: theme.palette.primary.main,
  },
}));

const ProductHeader = ({
  onSearch,
  viewType,
  list,
  page,
  totalProducts,
  onPageChange,
  setViewType,
  onSortChange,
  sortOrder,
}) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      <Box sx={{ mr: 3 }}>
        <AppSearch
          placeholder="Search here"
          onChange={(e) => onSearch(e.target.value)}
        />
      </Box>

      <Stack
        spacing={2}
        direction="row"
        sx={{
          display: "flex",
          alignItems: "center",
          ml: "auto",
        }}
      >
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortOrder}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="highToLow">Price: High to Low</MenuItem>
          </Select>
        </FormControl>

        <Hidden smDown>
          {list?.length > 0 ? (
            <Box
              component="span"
              sx={{
                ml: { sm: "auto" },
              }}
            >
              <AppsPagination
                rowsPerPage={10}
                count={totalProducts}
                page={page}
                onPageChange={onPageChange}
                sx={{
                  ".MuiTablePagination-toolbar": {
                    display: "flex",
                    justifyContent: "end",
                    padding: "0.5rem",
                  },
                  ".MuiTablePagination-spacer": {
                    flex: "none",
                  },
                  ".MuiTablePagination-selectLabel": {
                    pt: 7,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-displayedRows": {
                    pt: 7,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-actions": {
                    alignItems: "center",
                  },
                }}
              />
            </Box>
          ) : null}
        </Hidden>
      </Stack>
    </Box>
  );
};

export default ProductHeader;

ProductHeader.propTypes = {
  viewType: PropTypes.string,
  onSearch: PropTypes.func,
  list: PropTypes.array,
  page: PropTypes.number,
  totalProducts: PropTypes.number,
  onPageChange: PropTypes.func,
  setViewType: PropTypes.func,
  onSortChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
};