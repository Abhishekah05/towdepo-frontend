import React, { useState, useEffect } from "react";
import {
  Grid,
  Divider,
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  cardActionAreaClasses,
  useMediaQuery,
  Chip,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  SwipeableDrawer,
} from "@mui/material";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@crema/Slices/productsSlice";
import { addItemToCart } from "@crema/Slices/cartSlice";
import { mediaUrl } from "@crema/constants/AppConst";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import AppLoader from "../../@crema/components/AppLoader";
import "../../@crema/components/AppLoader/loader.css";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import VerifiedIcon from "@mui/icons-material/Verified";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Customize from "./Customize";

const ProductDetailPage = ({ product }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [filteredVariants, setFilteredVariants] = useState(product?.variant);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);
  const [customizationId, setCustomizationId] = useState("");
  const [displayPrice, setDisplayPrice] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // New state for Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [availableSizes, setAvailableSizes] = useState([]);

  // Mobile detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  //product Description tabs
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCustomizeSave = (customization) => {
    setShowDrawer(false);
    setCustomizationId(customization.id);
    console.log(customization);
  };

  const handleCustomizeClick = () => {
    setShowDrawer(true);
  };

  // Handle image navigation in dialog
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % thumbnailImages.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + thumbnailImages.length) % thumbnailImages.length
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setImageDialogOpen(true);
  };

  useEffect(() => {
    const filters = {};

    if (product?.category) {
      filters.category = product?.category?.name;
    }

    if (product?.brand) {
      filters.brand = product.brand;
    }

    product?.variant.forEach((variant) => {
      variant?.attributes.forEach((attribute) => {
        if (!filters[attribute.name]) {
          filters[attribute.name] = new Set();
        }
        filters[attribute?.name].add(attribute?.value);
      });
    });

    for (let key in filters) {
      if (filters[key] instanceof Set) {
        filters[key] = Array.from(filters[key]);
      }
    }

    setFilterValues(filters);

    if (product?.variant?.length > 0) {
      const firstVariant = product.variant[0];
      setSelectedType(
        firstVariant.attributes.find((attr) => attr.name === "type")?.value
      );
      setSelectedColor(
        firstVariant.attributes.find((attr) => attr.name === "color")?.value
      );
      const initialSize = firstVariant.attributes.find(
        (attr) => attr.name === "size"
      )?.value;
      if (initialSize) {
        setSelectedSize(initialSize.replace(/"/g, ""));
      }

      setSelectedVariant(firstVariant);
      setDisplayPrice(firstVariant.price);

      if (firstVariant.images && Array.isArray(firstVariant.images) && firstVariant.images.length > 0) {
        console.log("Setting initial thumbnails from variant.images:", firstVariant.images);
        const newThumbnails = [...firstVariant.images];
        setThumbnailImages(newThumbnails);
        setMainImage(`${mediaUrl}/product/${firstVariant.images[0]}`);
      } else if (firstVariant.image) {
        console.log("Setting initial thumbnails from variant.image:", firstVariant.image);
        setThumbnailImages([firstVariant.image]);
        setMainImage(`${mediaUrl}/product/${firstVariant.image}`);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedType && selectedColor) {
      const matchingVariants = product?.variant.filter((variant) =>
        variant.attributes.some(
          (attr) => attr.name === "type" && attr.value === selectedType
        ) &&
        variant.attributes.some(
          (attr) => attr.name === "color" && attr.value === selectedColor
        )
      );
      if (matchingVariants && matchingVariants.length > 0) {
        setDisplayPrice(matchingVariants[0].price);

        if (matchingVariants[0].images && Array.isArray(matchingVariants[0].images) && matchingVariants[0].images.length > 0) {
          setThumbnailImages([...matchingVariants[0].images]);
          setMainImage(`${mediaUrl}/product/${matchingVariants[0].images[0]}`);
        } else if (matchingVariants[0].image) {
          setThumbnailImages([matchingVariants[0].image]);
          setMainImage(`${mediaUrl}/product/${matchingVariants[0].image}`);
        }
      }
      const sizes = new Set();
      matchingVariants.forEach((variant) => {
        const size = variant.attributes.find(
          (attr) => attr.name === "size"
        )?.value;
        if (size) {
          const normalizedSize = size.replace(/"/g, "");
          sizes.add(normalizedSize);
        }
      });
      setAvailableSizes(Array.from(sizes));

      if (selectedSize && !Array.from(sizes).includes(selectedSize)) {
        setSelectedSize("");
      } else if (selectedSize) {
        const variant = findVariant(selectedType, selectedColor, selectedSize);
        if (variant) {
          setSelectedVariant(variant);
        }
      } else {
        setSelectedVariant(matchingVariants[0] || null);
      }
    } else {
      setAvailableSizes([]);
    }
  }, [selectedType, selectedColor, product?.variant]);

  const findVariant = (type, color, size) => {
    if (!type || !color) return null;
    if (size) {
      return product?.variant.find((v) =>
        v.attributes.some(
          (attr) => attr.name === "type" && attr.value === type
        ) &&
        v.attributes.some(
          (attr) => attr.name === "color" && attr.value === color
        ) &&
        v.attributes.some(
          (attr) => {
            if (attr.name === "size") {
              const normalizedAttrValue = attr.value.replace(/"/g, "");
              const normalizedSize = size.replace(/"/g, "");
              return normalizedAttrValue === normalizedSize;
            }
            return false;
          }
        )
      );
    }
    else {
      return product?.variant.find((v) =>
        v.attributes.some(
          (attr) => attr.name === "type" && attr.value === type
        ) &&
        v.attributes.some(
          (attr) => attr.name === "color" && attr.value === color
        )
      );
    }
  };

  useEffect(() => {
    if (selectedType && selectedColor && selectedSize) {
      const variant = findVariant(selectedType, selectedColor, selectedSize);
      if (variant) {
        setSelectedVariant(variant);
        setDisplayPrice(variant.price);
      }
    }
  }, [selectedSize]);

  const handleTypeChange = (event) => setSelectedType(event.target.value);

  const handleColorChange = (event, newColor) => {
    if (!newColor) return;

    console.log("Changing color to:", newColor);
    setSelectedColor(newColor);

    const matchingVariant = product?.variant.find((v) =>
      v.attributes.some((attr) => attr.name === "color" && attr.value === newColor) &&
      v.attributes.some((attr) => attr.name === "type" && attr.value === selectedType)
    );

    if (matchingVariant) {
      console.log("Found matching variant:", matchingVariant);

      setSelectedVariant(matchingVariant);

      if (matchingVariant.images && Array.isArray(matchingVariant.images) && matchingVariant.images.length > 0) {
        setThumbnailImages([]);

        setTimeout(() => {
          console.log("Setting thumbnails to:", matchingVariant.images);
          setThumbnailImages([...matchingVariant.images]);
          setMainImage(`${mediaUrl}/product/${matchingVariant.images[0]}`);
        }, 10);
      }
    } else {
      console.warn("No matching variant found for color:", newColor);
    }
  };

  const handleSizeChange = (event, newSize) => {
    if (newSize) {
      setSelectedSize(newSize.replace(/"/g, ""));
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (selectedVariant?.quantity || 10)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      try {
        let finalPrice = selectedVariant.price;
        let discountAmount = 0;

        if (product?.discount && product?.mrp) {
          discountAmount = (product.mrp * parseFloat(product.discount)) / 100;
          finalPrice = product.mrp - discountAmount;
        }

        dispatch(
          addItemToCart({
            ...selectedVariant,
            quantity: quantity,
            title: product.title,
            customizationId,
            stockQuantity: selectedVariant.quantity,
            price: finalPrice,
            originalPrice: product.mrp || selectedVariant.price,
            discount: product.discount || 0,
            discountAmount: discountAmount * quantity,
          })
        );
        setSnackbarMessage(`${quantity} ${product.title} added to cart successfully`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Failed to add item to cart");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const StyledImage = styled("img")({
    maxWidth: "90%",
    height: "auto",
  });

  const Container = styled(Box)(({ theme }) => ({
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "-20px",
    [theme.breakpoints.down('md')]: {
      padding: "10px",
      marginTop: "0",
    },
  }));

  const ThumbnailImage = styled("img")({
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    border: "2px solid #e0e0e0",
    "&:hover": {
      borderColor: "#f1640b",
    },
    [theme.breakpoints.down('md')]: {
      width: "50px",
      height: "50px",
    },
  });

  const ColorSwatch = styled(Box)(({ theme, selected }) => ({
    width: '35px',
    height: '35px',
    borderRadius: '4px',
    margin: '4px',
    border: selected ? '2px solid #f1640b' : '1px solid #e0e0e0',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      border: '2px solid #666'
    },
    [theme.breakpoints.down('md')]: {
      width: '30px',
      height: '30px',
    },
  }));

  const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px',
    minWidth: 'auto',
    marginRight: theme.spacing(4),
    '&.Mui-selected': {
      color: '#f1640b',
    },
    '&:hover': {
      color: '#f1640b',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
      marginRight: theme.spacing(2),
      minWidth: 'unset',
      padding: '6px 12px',
    },
  }));

  // Custom styled Tabs component
  const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
      backgroundColor: '#f1640b',
      height: '3px',
    },
    // borderBottom: '1px solid #e0e0e0',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(2),
    },
  }));

  // Custom Tab Panel component
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`product-tabpanel-${index}`}
        aria-labelledby={`product-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ py: 3, [theme.breakpoints.down('md')]: { py: 2 } }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  // Determine if product is tyre or clothing
  const isTyre = product?.category?.name === "Truck Tyres";
  const isClothing = product?.category?.name === "Safety Shirts" || product?.category?.name === "Safety Jackets";

  return (
    <Container>
      {/* Mobile Image Gallery */}
      {isMobile && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            sx={{
              width: '100%',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img
              src={mainImage}
              alt={product?.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onClick={() => handleImageClick(thumbnailImages.findIndex(img => `${mediaUrl}/product/${img}` === mainImage))}
            />
          </Box>

          {/* Thumbnail strip for mobile - fixed width issue */}
          <Box sx={{ display: 'flex', overflowX: 'auto', py: 1, mt: 1, gap: 1, justifyContent: 'center' }}>
            {thumbnailImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: '60px', // Fixed width for consistency
                  height: '60px',
                  flexShrink: 0, // Prevent shrinking
                  border: mainImage === `${mediaUrl}/product/${image}` ? '2px solid #f1640b' : '1px solid #e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
                onClick={() => {
                  setMainImage(`${mediaUrl}/product/${image}`);
                }}
              >
                <img
                  src={`${mediaUrl}/product/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Grid container spacing={0} sx={{ minHeight: '600px' }}>
        {/* Left Side - Thumbnails (Desktop only) */}
        {!isMobile && (
          <Grid item xs={12} md={1} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pr: 1,
            marginBottom: '80px',
          }}>
            <Box display="flex" flexDirection="column" gap={1} sx={{ justifyContent: "center", height: "100%" }}>
              {thumbnailImages && thumbnailImages.length > 0 ? (
                thumbnailImages.map((image, index) => (
                  <ThumbnailImage
                    key={`thumb-${index}-${image}`}
                    src={`${mediaUrl}/product/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => {
                      console.log("Setting main image to:", image);
                      setMainImage(`${mediaUrl}/product/${image}`);
                    }}
                    sx={{
                      width: "55px",
                      height: "55px",
                      border: mainImage === `${mediaUrl}/product/${image}` ? "2px solid #f1640b" : "2px solid #e0e0e0"
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2">No thumbnails</Typography>
              )}
            </Box>
          </Grid>
        )}

        {/* Main Product Image (Desktop only) */}
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px'
          }}>
            {mainImage ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: "500px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  marginBottom: '85px',
                  overflow: 'hidden',
                }}
              >
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: product?.title || "Product Image",
                      isFluidWidth: false,
                      width: 450,
                      height: 450,
                      src: mainImage,
                    },
                    largeImage: {
                      src: mainImage,
                      width: 1200,
                      height: 1200,
                    },
                    enlargedImageContainerDimensions: {
                      width: '150%',
                      height: '150%',
                    },
                    enlargedImagePosition: "over",
                  }}
                  imageStyle={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </Box>
            ) : (
              <Typography variant="h6">No image selected</Typography>
            )}
          </Grid>
        )}

        {/* Right Side - Product Details */}
        <Grid item xs={12} md={isMobile ? 12 : 5} sx={{
          pl: { xs: 0, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: '600px',
          marginTop: isMobile ? '0px' : '50px'
        }}>
          <Box display="flex" flexDirection="column" gap={2} sx={{ height: '100%' }}>
            {/* Breadcrumbs for mobile */}
            {isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 1 }}>
                Shop &gt; {product?.category?.name === "Safety Shirts" ? "Women" : "All products"} &gt; {product?.category?.name === "Safety Shirts" ? "Top" : "Product"}
              </Typography>
            )}

            {/* Product Title */}
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.primary,
                fontFamily: "Arial, sans-serif",
                fontWeight: 600,
                fontSize: isMobile ? "1.4rem" : "1.8rem",
                lineHeight: 1.2,
                mb: 2
              }}
            >
              {product?.title}
            </Typography>

            {/* SKU and Availability */}
            <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SKU: <strong style={{ color: '#000' }}>{product?.SKU || 'A264671'}</strong>
                </Typography>
              </Box>
              {!isMobile && <Box sx={{ flexGrow: 1 }} />}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, ml: isMobile ? 0 : 2 }}
              >
                Availability:{" "}
                <Box component="span" sx={{ color: selectedVariant?.quantity > 0 ? '#4caf50' : '#f44336' }}>
                  {selectedVariant?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </Box>
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: isMobile ? 2 : 0 }}>
              Category: <strong style={{ color: '#000' }}>{product?.category?.name || 'Clothing'}</strong>
            </Typography>

            {/* Price Section */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#f1640b",
                  fontWeight: 700,
                  fontSize: isMobile ? "1.8rem" : "2rem",
                }}
              >
                ${displayPrice || 1699}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: "line-through",
                  fontSize: isMobile ? "1rem" : "1.2rem",
                }}
              >
                ${product?.mrp || 1999}
              </Typography>
              <Chip
                label="25% OFF"
                sx={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>

            <Divider sx={{ mt: isMobile ? 2 : 8 }} />

            {/* Color Selector - Only show if not a tyre */}
            {!isTyre && filterValues["color"]?.length > 0 && (
              <Box sx={{ mt: isMobile ? 3 : 8 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Color
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {filterValues["color"]?.map((filter) => {
                    const variant = product?.variant.find((v) =>
                      v.attributes.some(
                        (attr) => attr.name === "color" && attr.value === filter
                      )
                    );
                    let colorImage = "default.jpg";
                    if (variant?.images?.length > 0) {
                      colorImage = variant.images[0];
                    } else if (variant?.image) {
                      colorImage = variant.image;
                    }

                    return (
                      <ColorSwatch
                        key={filter}
                        selected={selectedColor === filter}
                        onClick={() => handleColorChange(null, filter)}
                      >
                        <img
                          src={`${mediaUrl}/product/${colorImage}`}
                          alt={filter}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `${mediaUrl}/product/default.jpg`;
                          }}
                        />
                      </ColorSwatch>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Size and Sleeve Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Size Selector */}
              <Grid item xs={isClothing ? 6 : 12}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    mt: isMobile ? 3 : 5
                  }}
                >
                  Size
                </Typography>
                {isTyre ? (
                  <Box
                    sx={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#f8f9fa',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">
                      {selectedSize || '245 70 19.5'}
                    </Typography>
                  </Box>
                ) : (
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ddd'
                        },
                        borderRadius: '4px'
                      }}
                    >
                      <MenuItem value="" disabled>M</MenuItem>
                      {["S", "M", "L", "XL", "XXL", "3XL"].map((size) => {
                        const isAvailable = availableSizes.includes(size);
                        return (
                          <MenuItem
                            key={size}
                            value={size}
                            disabled={!isAvailable}
                          >
                            {size}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              {/* Sleeve Selector for Clothing */}
              {isClothing && (
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      mt: isMobile ? 3 : 5
                    }}
                  >
                    Sleeve
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedType}
                      onChange={handleTypeChange}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ddd'
                        },
                        borderRadius: '4px'
                      }}
                    >
                      <MenuItem value="" disabled>Full sleeve</MenuItem>
                      {filterValues["type"]?.map((filter) => (
                        <MenuItem key={filter} value={filter}>
                          {filter}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* Quantity, Add to Cart and Customise in one line */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
              {/* Quantity Selector */}
              <Box display="flex" alignItems="center" sx={{ border: '1px solid #ddd', borderRadius: '4px', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  sx={{ padding: '6px' }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: '35px', textAlign: 'center', fontSize: '14px', py: 1 }}>
                  {quantity.toString().padStart(2, '0')}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= (selectedVariant?.quantity || 10)}
                  sx={{ padding: '6px' }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Add to Cart Button */}
              <Button
                sx={{
                  color: "white",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: "#f1640b",
                  "&:hover": {
                    backgroundColor: "#e0550a",
                  },
                  textTransform: "none",
                  width: isMobile ? '100%' : 'auto',
                  flex: isMobile ? 'none' : 1
                }}
                variant="contained"
                disabled={!selectedVariant || selectedVariant.quantity <= 0}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>

              {/* Customise Button - Only show for non-tyre products */}
              {!isTyre && (
                <Button
                  sx={{
                    border: `1px solid #f1640b`,
                    color: "#f1640b",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(241, 100, 11, 0.1)",
                    },
                    textTransform: "none",
                    width: isMobile ? '100%' : 'auto'
                  }}
                  onClick={handleCustomizeClick}
                >
                  CUSTOMISE
                </Button>
              )}
            </Box>

            <Divider sx={{ mt: isMobile ? 3 : 10 }} />

            {/* Product Features */}
            <Box sx={{
              mt: isMobile ? 3 : '25px',
              pb: isTyre ? (isMobile ? 3 : 105) : (isMobile ? 3 : 50)
            }}>
              <Grid container spacing={isMobile ? 2 : 10} sx={{ mb: 1 }}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(241, 100, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <PaymentIcon sx={{ color: '#f1640b', fontSize: '16px' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: isMobile ? '12px' : '13px' }}>
                      Secure payment
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '10px' : '11px' }}>
                      Safe & encrypted
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(241, 100, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <VerifiedIcon sx={{ color: '#f1640b', fontSize: '16px' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: isMobile ? '12px' : '13px' }}>
                      {isTyre ? 'Top Quality' : 'Size & Fit'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '10px' : '11px' }}>
                      {isTyre ? 'Premium materials' : 'Perfect fit guarantee'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(241, 100, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <LocalShippingIcon sx={{ color: '#f1640b', fontSize: '16px' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: isMobile ? '12px' : '13px' }}>
                      Free shipping
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '10px' : '11px' }}>
                      On orders over $50
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(241, 100, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckroomIcon sx={{ color: '#f1640b', fontSize: '16px' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: isMobile ? '12px' : '13px' }}>
                      Free returns
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '10px' : '11px' }}>
                      30 days return policy
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Description Table  */}
      <Box sx={{ width: '100%', mt: isTyre ? (isMobile ? -60 : -50) : (isMobile ? 0 : -30) }}>
        {/* Outer bordered container */}
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Tabs Header with bottom border */}
          <Box sx={{ borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "center" }}>
            <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs" variant={isMobile ? "scrollable" : "standard"}>
              <StyledTab label="Description" />
              <StyledTab label="Additional Information" />
              <StyledTab label="Specification" />
            </StyledTabs>
          </Box>

          {/* Description Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 2 : 4, p: isMobile ? 2 : 0 }}>
              {/* Description */}
              <Box sx={{ flex: 1, p: isMobile ? 0 : 2, ml: isMobile ? 0 : 8 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: isMobile ? "15px" : "16px" }}>
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#666",
                    textAlign: isMobile ? "left" : "justify"
                  }}
                >
                  {isTyre && (
                    <>
                      Our premium truck tyres are engineered for heavy-duty performance, delivering superior grip, durability, and stability on all road conditions. Designed for long-lasting tread life, they ensure safety and comfort on every journey. Optimized for fuel efficiency and low noise, these tyres keep your fleet moving smoothly. Reinforced sidewalls provide extra strength against punctures, while advanced tread patterns enhance traction in wet and dry conditions. Perfect for long hauls, they help reduce maintenance costs and maximize uptime for your fleet.
                    </>
                  )}
                  {isClothing && product?.category?.name === "Safety Shirts" && (
                    <>
                      Designed for professional use, our safety shirts combine comfort, durability, and functionality. Made from high-quality, breathable fabric, they ensure all-day wearability while providing essential protection. Reinforced stitching and ergonomic design allow freedom of movement without compromising safety. Ideal for construction or industrial environments, these shirts withstand rigorous daily use and retain their shape and color even after multiple washes.
                    </>
                  )}
                  {isClothing && product?.category?.name === "Safety Jackets" && (
                    <>
                      Engineered for safety and durability, our safety jackets provide excellent protection against harsh environments. With reflective detailing, water-resistant fabric, and a comfortable fit, they are ideal for outdoor and industrial work. Multiple pockets and adjustable features enhance practicality, while insulation ensures warmth in cold conditions. Lightweight yet durable, these jackets allow freedom of movement while maintaining high visibility and safety standards.
                    </>
                  )}
                </Typography>
              </Box>

              {/* Feature / Benefits */}
              <Box sx={{ flex: 1, p: isMobile ? 0 : 2 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: isMobile ? "15px" : "16px",
                  ml: isMobile ? 0 : 58
                }}>
                  {isTyre ? "Benefits" : "Features"}
                </Typography>
                <List sx={{ pl: 0, m: 0, ml: isMobile ? 0 : 55 }}>
                  {(isTyre
                    ? [
                      { text: "Superior road grip", icon: "/assets/productviewpageicons/Roadgrip.png" },
                      { text: "Long-lasting tread life", icon: "/assets/productviewpageicons/Longlasting.png" },
                      { text: "Enhanced fuel efficiency", icon: "/assets/productviewpageicons/fuel-efficiency.png" },
                      { text: "Low noise design", icon: "/assets/productviewpageicons/NoiseDesign.png" },
                      { text: "Reinforced sidewalls for extra strength", icon: "/assets/productviewpageicons/strength.png" },
                      { text: "Excellent wet and dry traction", icon: "/assets/productviewpageicons/wet-dry.png" },
                      { text: "Reduced maintenance costs", icon: "/assets/productviewpageicons/cost.png" }
                    ]
                    : [
                      { text: "Free 1 Year Warranty", icon: "/assets/productviewpageicons/Medal.png" },
                      { text: "Free Shipping & Fast Delivery", icon: "/assets/productviewpageicons/Truck.png" },
                      { text: "100% Money-back guarantee", icon: "/assets/productviewpageicons/Handshake.png" },
                      { text: "24/7 Customer support", icon: "/assets/productviewpageicons/Headphones.png" },
                      { text: "Secure payment method", icon: "/assets/productviewpageicons/CreditCard.png" },
                    ]
                  ).map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.8 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Box
                          component="img"
                          src={item.icon}
                          alt={item.text}
                          sx={{ width: 20, height: 20, objectFit: "contain" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: isMobile ? "13px" : "14px",
                            color: "#666",
                            lineHeight: 1.4
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Shipping */}
              <Box sx={{ flex: 1, p: isMobile ? 0 : 2 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  mb: isMobile ? 2 : 7,
                  fontSize: isMobile ? "15px" : "16px",
                  ml: isMobile ? 0 : 20
                }}>
                  Shipping Information
                </Typography>
                {[
                  { label: "Courier:", value: "2 - 4 days, free shipping" },
                  { label: "Local Shipping:", value: "up to one week, $19.00" },
                  { label: "UPS Ground Shipping:", value: "4 - 6 days, $29.00" },
                  { label: "Unishop Global Export:", value: "3 - 4 days, $39.00" },
                ].map((item, index) => (
                  <Box key={index} sx={{
                    display: "flex",
                    mb: isMobile ? 1 : 2,
                    flexDirection: isMobile ? "row" : "row", // Changed to always be row
                    alignItems: isMobile ? "center" : "flex-start",
                    flexWrap: isMobile ? "nowrap" : "nowrap"
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#333",
                        minWidth: isMobile ? "35%" : "fit-content", 
                        ml: isMobile ? 0 : 20,
                        mb: isMobile ? 0 : 6
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#666",
                        lineHeight: 1.4,
                        ml: isMobile ? 1 : 0
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Box>

      {/* Image Dialog for Mobile */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, overflow: 'hidden' }}>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <ArrowForwardIcon />
          </IconButton>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh'
          }}>
            <img
              src={`${mediaUrl}/product/${thumbnailImages[currentImageIndex]}`}
              alt={`Product view ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
 <Drawer
              anchor={"right"}
              open={showDrawer}
              onClose={(event) => {
                console.log(event);
                setShowDrawer(false);
              }}
            >
              <IconButton
                onClick={() => {
                  setShowDrawer(false);
                }}
              >
                <CloseIcon />
              </IconButton>
              {selectedVariant && (
                <Customize
                  variantId={selectedVariant?.id}
                  handleCustomizeSave={handleCustomizeSave}
                  product={product}
                />
              )}
            </Drawer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: "#43a047",
            color: "white",
            fontWeight: "bold",
            "& .MuiSvgIcon-root": { color: "white" },
            padding: "2px 10px",
            minHeight: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Example usage of the ProductDetailPage component
const App = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  if (isLoading) {
    return <AppLoader />;
  }
  return <ProductDetailPage product={product} />;
};
export default App;