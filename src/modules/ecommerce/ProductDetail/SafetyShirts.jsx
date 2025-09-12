import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useGetProductByIdQuery } from '@crema/Slices/productsSlice';
import { useParams } from 'react-router-dom';
import AppLoader from '../../../@crema/components/AppLoader';

// Static Data
const IMAGES = [
  'https://cdnimages.opentip.com/full/7GAE/7GAE-DKGAE19_ORANGE1.jpg',
  'https://cdnimages.opentip.com/thumbs/7GAE/7GAE-DKGAE19_YELLOWBLACK1_576_576.jpg',
  'https://cdnimages.opentip.com/thumbs/7GAE/7GAE-DKGAE19_YELLOWBLACK1_576_576.jpg',
];

const COLORS = [
  {
    name: 'Red',
    image: 'https://cdnimages.opentip.com/full/7GAE/7GAE-DKGAE19_ORANGE1.jpg',
  },
  {
    name: 'Green',
    image: 'https://cdnimages.opentip.com/thumbs/7GAE/7GAE-DKGAE19_YELLOWBLACK1_576_576.jpg',
  },
  {
    name: 'Blue',
    image: 'https://cdnimages.opentip.com/thumbs/7GAE/7GAE-DKGAE19_YELLOWBLACK1_576_576.jpg',
  },
];

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '20px',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '10px',
  width: '100%',
}));

const VerticalImageList = styled(Box)(({ theme }) => ({
  width: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'hidden',
  padding: '10px',
  backgroundColor: '#fff',
  borderRadius: '8px',
}));

const MainImageDisplay = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  overflow: 'hidden',
  marginLeft: '15px',
  backgroundColor: theme.palette.grey[50],
  position: 'relative',
}));

const Thumbnail = styled(Box)(({ theme }) => ({
  marginBottom: '15px',
  cursor: 'pointer',
  border: '2px solid transparent',
  borderRadius: '4px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease',
  },
}));

const ColorButton = styled(IconButton)(({ theme, selected }) => ({
  width: '40px',
  height: '40px',
  margin: '5px',
  borderRadius: '50%',
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : '2px solid transparent',
  backgroundSize: 'cover',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.3s ease',
  },
}));

const SafetyImageView = () => {
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Red');
  const [sleeves, setSleeves] = useState('Short');
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);


  if (isLoading) return <AppLoader/>;

  const handleImageClick = (image) => setSelectedImage(image);

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} sm={6}>
          <ImageContainer>
            <VerticalImageList>
              {IMAGES.map((image, index) => (
                <Thumbnail key={index} onClick={() => handleImageClick(image)}>
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain', borderRadius: '4px' }}
                  />
                </Thumbnail>
              ))}
            </VerticalImageList>
            <MainImageDisplay>
              <img
                src={selectedImage}
                alt="Selected Product"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <IconButton
                sx={{ position: 'absolute', top: '10px', right: '10px' }}
                color="primary"
              >
                <FavoriteBorderIcon />
              </IconButton>
            </MainImageDisplay>
          </ImageContainer>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h1" gutterBottom>
              Men Graphic Print Round Neck Cotton Blend Black T-Shirt
            </Typography>
            <Typography variant="h1" color="red" gutterBottom>
              ₹249{' '}
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                sx={{ textDecoration: 'line-through' }}
              >
                ₹1,999
              </Typography>{' '}
              87% off
            </Typography>

            {/* Color Selection */}
            <Box sx={{ margin: '10px 0' }}>
              <Typography variant="h3" gutterBottom>
                Color
              </Typography>
              <Box display="flex" flexDirection="row">
                {COLORS.map((colorOption, index) => (
                  <ColorButton
                    key={index}
                    selected={color === colorOption.name}
                    onClick={() => setColor(colorOption.name)}
                    sx={{ backgroundImage: `url(${colorOption.image})` }}
                  />
                ))}
              </Box>
            </Box>

            {/* Sleeves Dropdown */}
            <Box sx={{ margin: '10px 0' }}>
              <Typography variant="h3" gutterBottom>
                Sleeves
              </Typography>
              <FormControl size="small" margin="normal" sx={{ marginBottom: '16px', width: '150px' }}>
                <Select size="small" fullWidth value={sleeves} onChange={(e) => setSleeves(e.target.value)}>
                  {['HalfSleeves', 'FullSleeves'].map((sleevesOption) => (
                    <MenuItem key={sleevesOption} value={sleevesOption}>
                      {sleevesOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Size Dropdown */}
            <Box sx={{ margin: '10px 0' }}>
              <Typography variant="h3" gutterBottom>
                Size
              </Typography>
              <FormControl size="small" margin="normal" sx={{ marginBottom: '16px', width: '150px' }}>
                <Select value={size} onChange={(e) => setSize(e.target.value)}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sizeOption) => (
                    <MenuItem key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Quantity Dropdown */}
            <Box sx={{ margin: '10px 0' }}>
              <Typography variant="h3" gutterBottom>
                Quantity
              </Typography>
              <FormControl size="small" margin="normal" sx={{ marginBottom: '16px', width: '150px' }}>
                <Select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                  {[1, 2, 3, 4, 5].map((qty) => (
                    <MenuItem key={qty} value={qty}>
                      {qty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Available Offers */}
            <Box sx={{ margin: '20px 0' }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Offers
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Bank Offer:</strong> Get ₹50 Instant Discount on first
                Flipkart UPI transaction on order of ₹200 and above T&C
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Bank Offer:</strong> 5% Unlimited Cashback on Flipkart
                Axis Bank Credit Card T&C
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Bank Offer:</strong> 12% off up to ₹1,500 on all Axis
                Bank Credit EMI Txns (incl. migrated) on orders of ₹7,500 and
                above T&C
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Combo Offer:</strong> Buy 2 or more items save ₹30 T&C
              </Typography>
            </Box>

            {/* Buttons: Add to Cart */}
            <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
              <Button variant="contained" color="error">
                Add to Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SafetyImageView;
