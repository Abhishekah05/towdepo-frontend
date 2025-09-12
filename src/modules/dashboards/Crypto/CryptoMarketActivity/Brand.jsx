import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Styled components for Card and ButtonWrapper
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    height: 200, // Adjust this value as needed
    margin: '0 auto',
    textAlign: 'center',
  }))


// Sample data for the cards
const cardsData = [
  { id: 1,  image: '/assets/images/ecommerce/shopbybrand1.png' },
  { id: 2,  image: '/assets/images/ecommerce/shopbybrand2.png' },
  { id: 3,  image: '/assets/images/ecommerce/shopbybrand3.png' },
  { id: 4,  image: '/assets/images/ecommerce/shopbybrand2.png' },
  { id: 5,  image: '/assets/images/ecommerce/shopbybrand5.png' },
  { id: 6,  image: '/assets/images/ecommerce/shopbybrand6.png' },
  { id: 7,  image: '/assets/images/ecommerce/shopbybrand7.png' },
  { id: 8,  image: '/assets/images/ecommerce/shopbybrand8.png' },

];

export default function Brand() {
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        {cardsData.map((card) => (
          <StyledCard key={card.id}>
            <img
              src={card.image}
              style={{ width: '100%', height: '50%' }}
            />
            
          </StyledCard>
        ))}
      </Box>
    </>
  );
}
