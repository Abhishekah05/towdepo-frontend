import React, { useState } from "react";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import PropTypes from "prop-types";
import AppsContent from "@crema/components/AppsContainer/AppsContent";
import { alpha, Box, Hidden, Skeleton } from "@mui/material";
import { useThemeContext } from "@crema/context/AppContextProvider/ThemeContextProvider";
import AppsFooter from "@crema/components/AppsContainer/AppsFooter";
import AppsPagination from "@crema/components/AppsPagination";
import ProductHeader from "../ProductHeader";
import ProductGrid from "./ProductGrid";
import { VIEW_TYPE } from "../index";
import ProductList from "./ProductList";
import { useGetProductsQuery } from "@crema/Slices/productsSlice";
import { useLocation } from "react-router-dom";
const ProductListing = ({
  filterData,
  viewType,
  setViewType,
  setFilterData,
}) => {
  const location = useLocation();
  
  const params = new URLSearchParams(location.search);
  const category = params.get("category"); // 👈 get category from query string




  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit: itemsPerPage,
  });

  const { theme } = useThemeContext();
  const totalPages = data ? Math.ceil(data.totalResults / itemsPerPage) : 0;

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const filterProducts = (product) => {

    const categoryMatch =
      (!filterData?.categories?.length && !category) || // if no filters selected
      product?.category?.name === category || // match query param
      (filterData.categories?.includes(product.category?.id));

    const priceMatch =
      !Array.isArray(filterData?.price) ||
      filterData.price[1] === 0 ||
      (product.mrp >= filterData.price[0] && product.mrp <= filterData.price[1]);

    const discountMatch =
      !filterData?.discounts?.length ||
      filterData.discounts.includes(Number(product.discount));

    return categoryMatch && priceMatch && discountMatch;
  };


  const filteredProducts = data?.products?.filter(filterProducts);

  const searchedProducts = filteredProducts?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = searchedProducts?.slice().sort((a, b) => {
    if (!a.mrp || !b.mrp) return 0;

    switch (sortOrder) {
      case 'lowToHigh':
        return a.mrp - b.mrp;
      case 'highToLow':
        return b.mrp - a.mrp;
      case 'featured':
      default:
        return 0; // Keep original order for featured items
    }
  });

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setSearchQuery(title);
  };

  return (
    <>
      <AppsHeader>
        <ProductHeader
          list={searchedProducts || []}
          viewType={viewType}
          page={page}
          totalProducts={searchedProducts?.length || 0}
          onPageChange={onPageChange}
          onSearch={searchProduct}
          setViewType={setViewType}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </AppsHeader>

      <AppsContent
        style={{
          backgroundColor: alpha(theme.palette.background.default, 0.6),
        }}
      >
        <Box
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            py: 2,
            px: 4,
            height: 1,
            "& > div": {
              width: "100%",
            },
          }}
        >
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton width="60%" />
            </>
          ) : viewType === VIEW_TYPE.GRID ? (
            <ProductGrid ecommerceList={sortedProducts} loading={isLoading} />
          ) : (
            <ProductList ecommerceList={sortedProducts} loading={isLoading} />
          )}
        </Box>
      </AppsContent>

      <Hidden smUp>
        {searchedProducts?.length > 0 && (
          <AppsFooter>
            <AppsPagination
              count={totalPages}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        )}
      </Hidden>
    </>
  );
};

export default ProductListing;

ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string.isRequired,
  setViewType: PropTypes.func.isRequired,
  setFilterData: PropTypes.func.isRequired,
};