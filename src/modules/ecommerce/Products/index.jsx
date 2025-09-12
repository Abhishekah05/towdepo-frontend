import React, { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import AppsContainer from "@crema/components/AppsContainer";
import ProductsSidebar from "./ProductsSidebar";
import ProductListing from "./ProductListing";
import { useGetProductsQuery } from "../../../@crema/Slices/productsSlice";


export const VIEW_TYPE = {
  GRID: "grid",
  LIST: "list",
};

const Products = (value) => {
  const { messages } = useIntl();
  const { data } = useGetProductsQuery({});

  const maxMrp = data?.products?.length ? Math.max(...data.products.map((product) => product.mrp)) : 0;

  const [filterData, setFilterData] = useState({
    title: "",
    brand: [],
    ideaFor: [],
    discounts: [], 
    color: [],
    rating: [],
    categories: [],
    price: [0, maxMrp],
    bulkDiscounts: [],
  });

  const [viewType, setViewType] = useState(VIEW_TYPE.GRID);
  useEffect(() => {
    if (maxMrp > 0 && filterData.price[1] !== maxMrp) {
      setFilterData(prev => ({
        ...prev,
        price: [prev.price[0], maxMrp]
      }));
    }
  }, [maxMrp]);
    

  return (
    <AppsContainer
      title={messages["sidebar.ecommerce.products"]}
      sidebarContent={<ProductsSidebar maxValue={maxMrp} filterData={filterData} setFilterData={setFilterData} />}
      
    >
      <ProductListing filterData={filterData} viewType={viewType} setViewType={setViewType}   />
  
    </AppsContainer>
  );
};

export default Products;
