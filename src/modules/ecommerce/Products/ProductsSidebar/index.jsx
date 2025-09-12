import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Fonts } from "@crema/constants/AppEnums";
import Divider from "@mui/material/Divider";
import PriceSelector from "./PriceSelector";
import AppScrollbar from "@crema/components/AppScrollbar";
import AppList from "@crema/components/AppList";
import CheckedCell from "./CheckedCell";
import ProductsDiscount from "./productDiscount"; // Corrected import
import { useGetDataApi } from "@crema/hooks/APIHooks";

const ProductSidebar = ({ filterData, setFilterData, maxValue }) => {
  const [selectedCategories, setSelectedCategories] = useState(
    filterData.categories
  );
  const [selectedFor, setSelectedFor] = useState(filterData.ideaFor);
  const [selectedColor, setSelectedColor] = useState(filterData.color);
  // Initialize price with maxValue if filterData.price is not set
  const [price, setPrice] = useState(filterData?.price || [0, maxValue]);
  const [selectedDiscounts, setSelectedDiscounts] = useState(
    filterData.discounts
  );

  
  const [page, setPage] = useState(0);

  // Fetch Categories
  const [
    { apiData: categoryData },
    { setQueryParams: setCategoryQueryParams },
  ] = useGetDataApi("/category", [], {}, false);
  const { results: categories } = categoryData;

  // Fetch Discounts
  const [
    { apiData: discountData },
    { setQueryParams: setDiscountQueryParams },
  ] = useGetDataApi("/discount", [], {}, false);

  useEffect(() => {
    setCategoryQueryParams({ page, filterData: [] });
  }, [page, filterData]);

  useEffect(() => {
    setDiscountQueryParams({ page });
  }, [page]);

  // If maxValue changes, update the price state if it's not already set by user
  useEffect(() => {
    if (maxValue && (!filterData.price || !price[1])) {
      setPrice([0, maxValue]);
    }
  }, [maxValue]);

  // Process Discounts
  const discounts =
    discountData?.results
      ?.filter((discount) => discount.percentage && discount.label) // Remove invalid entries
      ?.sort((a, b) => b.percentage - a.percentage) || []; // Sort from highest to lowest

  useEffect(() => {
    setFilterData({
      ...filterData,
      categories: selectedCategories,
      ideaFor: selectedFor,
      color: selectedColor,
      price,
      discounts: selectedDiscounts,
    });
  }, [
    selectedCategories,
    selectedFor,
    selectedColor,
    price,
    selectedDiscounts,
  ]);

    useEffect(() => {
    setSelectedCategories(filterData.categories);
  }, [filterData.categories]);

  const onSelectCategories = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSelectDiscount = (discountId) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discountId)
        ? prev.filter((id) => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  return (
    <AppScrollbar>
      <Box sx={{ p: 6 }}>
        <Box component="h5" sx={{ mb: 2, fontWeight: Fonts.MEDIUM }}>
          Filter By
        </Box>


        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          CATEGORY
          <AppList
            data={categories}
            renderRow={(data) => (
               <CheckedCell
                key={data.id}
                data={data}
                onChange={onSelectCategories}
                selected={selectedCategories} // ✅ controlled by synced state
              />
            )}
          />
        </Box>
        <Divider sx={{ mt: 4 }} />

        {/* PRICE FILTER */}
        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          PRICE
        </Box>
        <PriceSelector
          value={price}
          maxValue={maxValue}
          onChange={handlePriceChange}
        />
        <Divider sx={{ mt: 4 }} />

        {/* CATEGORY SELECTION */}



        {/* DISCOUNT FILTER */}
        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          DISCOUNTS
          <ProductsDiscount
            discounts={discountData}
            selectedDiscounts={selectedDiscounts}
            onSelectDiscount={onSelectDiscount}
          />
        </Box>
      </Box>
    </AppScrollbar>
  );
};

ProductSidebar.propTypes = {
  filterData: PropTypes.object.isRequired,
  setFilterData: PropTypes.func.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default ProductSidebar;