import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Checkbox, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { green, grey } from "@mui/material/colors";
import { Fonts } from "@crema/constants/AppEnums";
import { useNavigate } from "react-router-dom";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@crema/Slices/wishlistSlice";
import IntlMessages from "@crema/helpers/IntlMessages";
import { addItemToCart } from "../../../../../@crema/Slices/cartSlice";

const GridItem = (props) => {
  const { item } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get wishlist items from Redux store
  const wishlistItems = useSelector((state) => state?.wishlist?.items);

  // Track if the product is in the wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if the product is in the wishlist whenever the wishlist changes
  useEffect(() => {
    const itemInWishlist = wishlistItems?.some(
      (wishlistItem) => wishlistItem.id === item.id
    );
    setIsInWishlist(itemInWishlist); // Update the state to reflect if it's in the wishlist
  }, [wishlistItems, item.id]);

  // Handle adding/removing item from wishlist
  const toggleWishlist = (event) => {
    event.stopPropagation(); // Prevent the card's onClick from being triggered when toggling wishlist
    if (isInWishlist) {
      // If the item is already in the wishlist, remove it
      dispatch(removeItemFromWishlist(item));
    } else {
      // If the item is not in the wishlist, add it
      dispatch(addItemToWishlist(item));
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    // Only dispatch the action if the item is in stock
    if (item.inStock !== false) {
      // Calculate the discounted price with decimal points
      const discountAmount = (+item.mrp * +item.discount) / 100;
      const finalPrice = +item.mrp - discountAmount;
      
      dispatch(
        addItemToCart({
          id: item.id,
          title: item.title,
          price: finalPrice,
          quantity: 1,
          totalPrice: finalPrice,
          image: item.images?.[0]?.src,
        })
      );
    }
  };

  // Determine if the product is out of stock
  const isOutOfStock = item.inStock === false;

  return (
    <Card
      sx={{
        p: 5,
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative", // Added for out of stock overlay
      }}
      className="item-hover"
      onClick={(event) => {
        // Prevent navigation if clicking the wishlist checkbox
        if (event.target.closest(".wishlist-checkbox")) {
          return;
        }
        navigate("/ecommerce/product-view/" + item.id);
      }}
    >
      <Box
        sx={{
          mt: 2,
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          position: "relative", // Added for positioning the out of stock overlay
        }}
      >
        <Box
          component="span"
          sx={{
            maxHeight: 28,
            width: 48,
            color: "primary.contrastText",
            backgroundColor: green[500],
            pt: 1.5,
            pb: 1,
            px: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: Fonts.MEDIUM,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          <Box
            component="span"
            sx={{
              ml: 1,
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.5)",
                color: "white", // Change color on hover
              },
            }}
          
          >
            <StarBorderIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
        
        {/* Image container with relative positioning for overlay */}
        <Box
          sx={{
            mx: 2,
            maxHeight: { xs: 140, sm: 200, md: 260 },
            minHeight: { xs: 140, sm: 200, md: 260 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative", // For positioning the out of stock banner
            "& img": {
              maxHeight: "100%",
              maxWidth: "100%",
            },
          }}
        >
          <img
            src={`${mediaUrl}/product/${item.images?.[0]?.src}`}
            alt="Product Image"
          />
          
          {/* New OUT OF STOCK overlay - horizontal band style */}
          {isOutOfStock && (
            <Box
              sx={{
                position: "absolute",
                top: "50%", // Center vertically
                left: 0,
                right: 0,
                transform: "translateY(-50%)", // Perfect centering
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "8px 0",
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  color: "grey.700",
                  fontWeight: Fonts.MEDIUM,
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                OUT OF STOCK
              </Box>
            </Box>
          )}
          
          {/* Sale tag - based on the image */}
          {item.isOnSale && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "#f05123",
                color: "white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: Fonts.MEDIUM,
                fontSize: 12,
              }}
            >
              Sale!
            </Box>
          )}
        </Box>
        
        <Box
          sx={{
            mt: -3,
          }}
          className="wishlist-checkbox"
        >
          <Checkbox
            icon={<FavoriteBorderIcon />}
            checkedIcon={<FavoriteIcon />}
            checked={isInWishlist}
            onChange={toggleWishlist}
            sx={{
              color: 'default', // Color of the unchecked icon
              '&.Mui-checked': {
                color: '#f1640b', // Color of the checked icon
              },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mb: 1,
          color: "text.primary",
          fontWeight: Fonts.BOLD,
          fontSize: 16,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        component="h3"
      >
        {item.title}
      </Box>

      <Box
        component="p"
        sx={{
          mb: 3,
          color: "text.secondary",
          fontSize: 14,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.description}
      </Box>

      <Box
        sx={{
          mx: -1,
          mt: "auto",
          display: "flex",
          alignItems: "center",
          fontWeight: Fonts.MEDIUM,
          justifyContent: "space-between",
          fontSize: { xs: 12, xl: 14 },
        }}
      >
        <Box>
          <Box
            component="span"
            sx={{
              px: 1,
              mb: 2,
              color: "text.primary",
            }}
          >
            $ {+item.mrp - ((+item.mrp * +item.discount) / 100).toFixed(2)}
          </Box>
          <Box
            component="span"
            sx={{
              px: 1,
              mb: 2,
              color: "text.disabled",
              textDecoration: "line-through",
            }}
          >
            ${item.mrp}
          </Box>
          <Box
            component="span"
            sx={{
              px: 1,
              mb: 2,
              color: green[500],
            }}
          >
            {item.discount}% <IntlMessages id="ecommerce.off" />
          </Box>
        </Box>
        <Tooltip 
          title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          placement="top"
        >
          <Box
            sx={{
              ml: 2,
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: isOutOfStock ? "none" : "scale(1.5)",
                color: isOutOfStock ? grey[400] : "primary.main",
              },
              color: isOutOfStock ? grey[400] : "inherit",
            }}
            onClick={handleAddToCart}
          >
            <AddShoppingCartOutlinedIcon sx={{ fontSize: 16, mt: 1 }} />
          </Box>
        </Tooltip>
      </Box>
    </Card>
  );
};

GridItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default GridItem;