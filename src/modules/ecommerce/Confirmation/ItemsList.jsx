import React from 'react';
import AppCard from '@crema/components/AppCard';
import AppList from '@crema/components/AppList';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Button, Grid, Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import AppGridContainer from '@crema/components/AppGridContainer';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

const ItemsList = ({ order }) => {
  const { items: orderItems } = order;

  return (
    <AppCard>
      <AppGridContainer>
        <Grid xs={12} sm={6} item>
          <AppList
            delay={200}
            data={orderItems}
            renderRow={(item) => {
              const { productVariantId } = item;

              // Format product title for both tire and shirt categories
              let productTitle = productVariantId?.title;
              if (productVariantId?.category === 'Tire') {
                const { width, aspectRatio, diameter } = productVariantId;
                productTitle = `${width} *** ${aspectRatio}R * ${diameter}`;
              } else if (productVariantId?.category === 'Shirt') {
                const { size } = productVariantId;
                const attributes = productVariantId?.attributes || [];
                const getAttribute = (name) => attributes.find(attr => attr.name === name)?.value || "N/A";
                const shirtColor = getAttribute('color');
                productTitle = `${shirtColor} ${size} Shirt`; // Example: "Red L Shirt"
              }

              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 4,
                    py: 3,
                    className: 'item-hover',
                  }}
                >
                  <Avatar sx={{ mr: 3.5 }} src={`${mediaUrl}/product/${productVariantId?.images[0]}`} />
                  <Box>
                    {/* SKU */}
                    {/* <Typography component="span" variant="body2" color="text.primary">
                      SKU: {productVariantId?.sku}
                    </Typography> */}
                    <br />

                    {/* Product Title */}
                    <Typography component="span" variant="body2" color="text.primary">
                      Product Name: {item?.title}
                    </Typography>
                    <br />

                    {/* Quantity */}
                    <Typography component="span" variant="body2" color="text.primary">
                      Quantity: {item.quantity}
                    </Typography>
                    <br />

                    {/* Unit Price */}
                    <Typography component="span" variant="body2" color="text.primary">
                      Unit Price: ${item.unitPrice}
                    </Typography>
                    <br />
                    {item?.category?.name === "Safety Shirts" && (
                    <Typography component="span" variant="body2" color="text.primary">
                      <strong>Color:</strong> {item?.productVariantId?.attributes?.find(attr => attr.name === "color")?.value?.replace(/^"|"$/g, '') || "N/A"}
                    </Typography>
                    )}
                    
                    <Typography component="span" variant="body2" color="text.primary">
                      Size: {item?.productVariantId?.attributes?.find(attr => attr.name === "size")?.value?.replace(/^"|"$/g, '') || "N/A"}
                    </Typography>


                  </Box>
                </Box>
              );
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} item>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 4, fontSize: 16, fontWeight: Fonts.BOLD }}>
              Total ${order.totalAmount}
            </Box>
            <Box sx={{ pl: 2, display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ px: 2 }}>
                {/* <Button color='primary' variant='outlined'>
                  Cancel
                </Button> */}
              </Box>
              <Box px={2}>
                <Button color='primary' variant='contained' sx={{marginLeft:"-10px"}}>
                  Need Help
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 'auto',
                p: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box component='span' sx={{ mr: 3, pt: 1.5 }}>
                <AirportShuttleOutlinedIcon sx={{ color: 'primary.main' }} />
              </Box>
              <Box component='span'>Delivery expected by 27 Aug 24</Box>
            </Box>
          </Box>
        </Grid>
      </AppGridContainer>
    </AppCard>
  );
};

export default ItemsList;

ItemsList.propTypes = {
  order: PropTypes.object.isRequired,
};
