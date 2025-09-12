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
  maxWidth: 300,
  margin: '0 auto',
  textAlign: 'center',
  boxShadow: theme.shadows[5],
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

// Sample data for the cards
const cardsData = [
  { id: 1, title: 'Tyre 1', description: 'This is a description for tyre 1.', image: '/assets/images/ecommerce/Gogo1.png' },
  { id: 2, title: 'Tyre 2', description: 'This is a description for tyre 2.', image: '/assets/images/ecommerce/ARM1.png' },
  { id: 3, title: 'Tyre 3', description: 'This is a description for tyre 3.', image: '/assets/images/ecommerce/Bridge1.png' },
  { id: 4, title: 'Tyre 4', description: 'This is a description for tyre 4.', image: '/assets/images/ecommerce/T1-1.jpg' },
  { id: 5, title: 'Tyre 5', description: 'This is a description for tyre 5.', image: '/assets/images/ecommerce/Zep2.png' },
  { id: 6, title: 'Tyre 6', description: 'This is a description for tyre 6.', image: '/assets/images/ecommerce/Gogo2.png' },
  { id: 7, title: 'Tyre 7', description: 'This is a description for tyre 7.', image: '/assets/images/ecommerce/con1.png' },
  { id: 8, title: 'Tyre 8', description: 'This is a description for tyre 8.', image: '/assets/images/ecommerce/americus1.png' },
];

export default function ProductCarousel() {
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        {cardsData.map((card) => (
          <StyledCard key={card.id}>
            <img
              src={card.image}
              alt={card.title}
              style={{ width: '100%', height: '60%' }}
            />
            <CardContent>
              <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2">
                {card.description}
              </Typography>
            </CardContent>
            <CardActions>
              <ButtonWrapper>
                <Button variant="contained" color="primary" size="small">
                  Buy Now
                </Button>
              </ButtonWrapper>
            </CardActions>
          </StyledCard>
        ))}
      </Box>
    </>
  );
}
