import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import AppTextField from "@crema/components/AppFormComponents/AppTextField";
import AppCard from "@crema/components/AppCard";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useNavigate } from "react-router-dom";
import AppGridContainer from "@crema/components/AppGridContainer";
import AppScrollbar from "@crema/components/AppScrollbar";
import { Field } from "formik";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import { useGetDataApi } from "@crema/hooks/APIHooks";
import { Fonts } from "@crema/constants/AppEnums";
import { useAuthUser } from "../../../../../@crema/hooks/AuthHooks";

const TagList = [
  {
    id: 1,
    name: "Wheel",
  },
  {
    id: 2,
    name: "Towing",
  },
  {
    id: 3,
    name: "Safety",
  },
];

const BlogSidebar = ({
  isEdit,
  inStock,
  productInfo,
  productSpec,
  setProductSpec,
  setFieldValue,
  setProductInfo,
  selectedTags,
  setSelectedTags,
  values // Add this prop to get current form values
}) => {
  const [page, setPage] = useState(0);
  const [filterData] = [];
  const inputLabel = React.useRef(null);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  
  // Fetch data from the Category API
  const [
    { apiData: categoryApiData, loading: categoryLoading },
    { setQueryParams: setCategoryQueryParams },
  ] = useGetDataApi("/Category", [], {}, false);

  // Fetch data from the Store API - same pattern as category
  const [
    { apiData: storeApiData, loading: storeLoading },
    { setQueryParams: setStoreQueryParams },
  ] = useGetDataApi(`/store/owner/${user?.id}`, [], {}, false);

  const { results: categories } = categoryApiData || {};
  const { results: stores } = storeApiData || {};

  useEffect(() => {
    setCategoryQueryParams({ page, filterData });
    setStoreQueryParams({ page, filterData });
  }, [page, filterData]);

  // Auto-select the single store if only one exists
  useEffect(() => {
    if (stores && stores.length === 1 && !values?.store) {
      const singleStore = stores[0];
      const storeId = singleStore.id || singleStore._id;
      console.log('Auto-selecting single store:', singleStore.name, storeId);
      setFieldValue("store", storeId);
    }
  }, [stores, values?.store, setFieldValue]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setFilterData({ ...filterData, title });
  };

  // Debug: Log the current store value
  console.log('Current store value:', values?.store);
  console.log('Available stores:', stores);
  console.log('Stores count:', stores?.length);

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={6} xl={6}>

        <Typography sx={{ fontWeight: Fonts.SEMI_BOLD, marginTop: "-25px" }}>
          Product Details
        </Typography>
        <Box sx={{ pt: 15 }}>
          {" "}
          {/* Reduce padding-bottom */}
          <Box sx={{ display: "flex", alignItems: "center", gap: -4 }}>
            {" "}
            {/* Align elements */}
            <FormControlLabel
              control={
                <Switch
                  checked={inStock}
                  onChange={(event) =>
                    setFieldValue("inStock", event.target.checked)
                  }
                  name="inStock"
                />
              }
              label="In Stock"
              sx={{ mb: 0, mt: -10 }} // Adjust margin to remove unnecessary space
            />
          </Box>
          <AppTextField
            name="SKU"
            variant="outlined"
            sx={{
              width: "100%",
              my: 4,
            }}
            label="Product SKU"
          />
          
          {/* Category Dropdown */}
          <FormControl
            sx={{
              width: "100%",
              my: 4,
            }}
            variant="outlined"
          >
            <InputLabel ref={inputLabel}>
              <IntlMessages id="common.category" />
            </InputLabel>
            <Field
              name="category"
              label={<IntlMessages id="common.category" />}
              as={Select}
              onChange={(event) =>
                setFieldValue("category", event.target.value)
              }
            >
              {categories &&
                categories.map((category) => (
                  <MenuItem
                    value={category.id}
                    key={category.id}
                    sx={{
                      cursor: "pointer",
                      inputVariant: "outlined",
                    }}
                  >
                    {category.name}
                  </MenuItem>
                ))}
            </Field>
          </FormControl>

          {/* Store Selection - Enhanced with auto-selection for single store */}
          {stores && stores.length > 1 ? (
            // Multiple stores - show dropdown
            <FormControl
              sx={{
                width: "100%",
                my: 4,
              }}
              variant="outlined"
            >
              <InputLabel>Store *</InputLabel>
              <Select
                name="store"
                label="Store *"
                value={values?.store || ''}
                onChange={(event) => {
                  setFieldValue("store", event.target.value);
                }}
                required
              >
                {stores.map((store) => (
                  <MenuItem
                    value={store.id || store._id}
                    key={store.id || store._id}
                    sx={{
                      cursor: "pointer",
                      inputVariant: "outlined",
                    }}
                  >
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a store</FormHelperText>
            </FormControl>
          ) : stores && stores.length === 1 ? (
            // Single store - show as read-only with auto-selection
            <TextField
              label="Store"
              value={stores[0].name}
              disabled
              fullWidth
              variant="outlined"
              sx={{ my: 4 }}
              helperText="Only one store available - automatically selected"
            />
          ) : (
            // No stores
            <TextField
              label="Store"
              value="No stores available"
              disabled
              fullWidth
              variant="outlined"
              sx={{ my: 4 }}
              error
              helperText={storeLoading ? "Loading stores..." : "Please create a store first"}
            />
          )}
        </Box>

        <br />
        <br />

        <Box sx={{ paddingBottom: "10px" }}>
          <Typography sx={{ fontWeight: Fonts.SEMI_BOLD, marginTop: "-10px" }}>
            Product Pricing
          </Typography>
          <br />
          <AppTextField
            name="mrp"
            type="number"
            variant="outlined"
            sx={{
              width: "100%",
              my: 2,
              "& .MuiInputBase-input": {
                pl: 2,
              },
            }}
            InputProps={{
              startAdornment: "$",
            }}
            label="Regular Price"
            inputProps={{
              min: 0, // Prevents negative values
            }}
            onChange={(event) => {
              const value = Math.max(0, Number(event.target.value) || 0); // Ensures only positive numbers
              setFieldValue("mrp", value);
            }}
          />

          <br />
          <br />

          <AppTextField
            name="salemrp"
            type="number"
            variant="outlined"
            sx={{
              width: "100%",
              my: 2,
              "& .MuiInputBase-input": {
                pl: 2,
              },
            }}
            InputProps={{
              startAdornment: "$",
            }}
            label="Sale Price"
            inputProps={{
              min: 0, // Prevents negative values
            }}
            onChange={(event) => {
              const value = Math.max(0, Number(event.target.value) || 0); // Ensures only positive numbers
              setFieldValue("salemrp", value);
            }}
          />
          <br />
          <br />

          <AppTextField
            type="number"
            name="discount"
            variant="outlined"
            sx={{
              width: "100%",
              my: 2,
            }}
            label="Discount %"
            inputProps={{
              min: 0, // Prevents negative values
            }}
            onChange={(event) => {
              const value = Math.max(0, Number(event.target.value) || 0); // Ensures only positive numbers
              setFieldValue("discount", value);
            }}
          />
        </Box>

        <Stack
          spacing={3}
          direction="row"
          sx={{ justifyContent: "flex-end", mt: 4 }}
        >
          <Button
            sx={{
              minWidth: 100,
              color: "text.secondary",
            }}
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            sx={{
              display: "block",
              minWidth: 100,
            }}
            color="primary"
            variant="contained"
            type="submit"
          >
            {isEdit ? "Update" : "Add"} Product
          </Button>
        </Stack>
      </Grid>
    </Slide>
  );
};

export default BlogSidebar;

BlogSidebar.propTypes = {
  isEdit: PropTypes.bool,
  inStock: PropTypes.bool,
  productInfo: PropTypes.array,
  productSpec: PropTypes.array,
  setProductSpec: PropTypes.func,
  setFieldValue: PropTypes.func,
  setProductInfo: PropTypes.func,
  selectedTags: PropTypes.array,
  setSelectedTags: PropTypes.func,
  values: PropTypes.object, // Add this prop type
};