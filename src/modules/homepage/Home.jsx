import React from "react";
import Carousel from "./Carosel";
import Popularbrand from "./Popularbrand";
import { Box } from "@mui/material";
import PromotionImage from "./PromotionImage";
import CustomizableApparel from "./customize";
import ApparelCustomization from "./p-information";
import ProductRange from "./homepagecards";

const Home = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
        position: "relative",
        boxSizing: "border-box",
        marginLeft: "-2px"
      }}
    >
      {/* Carousel Section */}
      <Box
        sx={{
          my: { xs: 3, sm: 4, md: 5 },
          width: "100%",
          minHeight: { xs: "200px", sm: "300px", md: "400px" },
          mx: "auto",
          padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
        }}
      >
        <Carousel />
      </Box>

      {/* Product Range */}
      <Box
        sx={{
          my: { xs: 4, sm: 5, md: 6 },
          width: "100%",
          padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
        }}
      >
        <ProductRange />
      </Box>

      <br />

      {/* Main Content Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1536px",
          margin: "0 auto",
          padding: {
            xs: "0 16px 0 8px",
            sm: "0 24px 0 12px",
            md: 0,
            lg: 0,
            xl: 0
          },
          boxSizing: "border-box"
        }}
      >
        {/* Popular Brands Sections */}
        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <Popularbrand type={"Safety Shirts"} />
        </Box>

        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <Popularbrand type={"Truck Tyres"} />
        </Box>

        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <Popularbrand type={"Safety Jackets"} />
        </Box>

        {/* Apparel Customization */}
        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <ApparelCustomization />
        </Box>

        {/* Customize Section */}
        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <CustomizableApparel />
        </Box>

        {/* Promotion Image Section */}
        <Box
          sx={{
            my: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            mx: "auto",
            padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
          }}
        >
          <PromotionImage />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
