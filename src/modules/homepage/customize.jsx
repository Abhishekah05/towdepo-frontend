import React from 'react';
import { Box, Typography, Button, Grid, styled } from '@mui/material';

// Styled components
const FullWidthSection = styled(Box)(({ theme }) => ({
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  padding: theme.spacing(8, 0),
  // backgroundColor: '#F3F3F3',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.up('lg')]: {
    maxWidth: '1400px',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  minHeight: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    minHeight: '150px',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '100px',
    padding: theme.spacing(0, 2),
  },
}));


const MainImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  height: '400px',
  borderRadius: '8px',
  objectFit: 'cover',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '500px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '85%', // Reduced width for mobile
  },
}));

const TextContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(0, 0, 0, 4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 0, 0, 0),
    textAlign: 'center',
    alignItems: 'center',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({

  fontWeight: 700,

  fontSize: '35px',
  lineHeight: '100%',
  letterSpacing: '0%',
  textTransform: 'capitalize',
  color: theme.palette.grey[900],
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    fontSize: '35px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    textAlign: 'center', // Ensure center alignment on mobile
    padding: theme.spacing(0, 1), // Add some padding on mobile
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
 
  fontWeight: 400,

  fontSize: '24px',
  lineHeight: '150%',
  letterSpacing: '0%',
  color: 'black',
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    textAlign: 'center', 
    padding: theme.spacing(0, 1),
  },
}));

const CustomizeButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#FD7E14',
  border: '2px solid #FD7E14',
  padding: theme.spacing(1.5, 4),
  fontSize: '1.2rem',
  fontWeight: 700,
  borderRadius: '4px',
  alignSelf: 'flex-start',
  '&:hover': {
    backgroundColor: '#FD7E14',
    color: '#FFFFFF',
  },
  [theme.breakpoints.down('md')]: {
    alignSelf: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.2, 3.5),
    fontSize: '1.1rem',
    width: '80%', // Make button wider on mobile
    maxWidth: '250px', // But not too wide
  },
}));

// Main component
const CustomizableApparel = () => {
  // Replace with your actual image path
  const mainImagePath = "assets/homepageimages/Custom2.png";

  return (
    <FullWidthSection>
      <ContentContainer>
        <Grid container spacing={6} alignItems="center">
          {/* Left side - Single Large Image */}
          <Grid item xs={12} md={6}>
            <ImageContainer>
              <MainImage
                src={mainImagePath}
                alt="Customizable Apparel"
              />
            </ImageContainer>
          </Grid>

          {/* Right side - Text Content */}
          <Grid item xs={12} md={6}>
            <TextContent>
              <SectionTitle>
                You Name It, We'll Customize It!
              </SectionTitle>
              <DescriptionText>
                With customization options available directly at TOWDEPO,
                outfitting the team with personalized apparel has never been easier.
              </DescriptionText>
              <CustomizeButton variant="outlined">
                Customize Now
              </CustomizeButton>
            </TextContent>
          </Grid>
        </Grid>
      </ContentContainer>
    </FullWidthSection>
  );
};

export default CustomizableApparel;