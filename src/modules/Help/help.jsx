import React, { useState } from 'react';
import { 
  CssBaseline, 
  Typography, 
  Container, 
  Box, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Breadcrumbs, 
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom styled components
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
}));

const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const Sidebar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
}));

const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const UpdateInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(4),
  fontStyle: 'italic',
}));

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722', // Orange color for safety theme
    },
    secondary: {
      main: '#2874f0', // Blue color similar to Flipkart
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [activeCategory, setActiveCategory] = useState('Delivery related');
  const [activeIssueType, setActiveIssueType] = useState(null);
  
  // Data for the help topics
  const issueTypes = [
    'Help with your issues',
    'Help with your order',
    'Help with other issues',
  ];
  
  const helpTopics = [
    'Delivery related',
    'Safety shirt sizing',
    'Truck tire specifications',
    'Refunds related',
  ];

  // FAQ data organized by category
  const faqData = {
    'Delivery related': [
      {
        question: 'I want to change the address for delivery of my order. Is it possible now?',
        answer: 'The delivery address for your order can be changed depending on its status. Please check Orders > Order Details for the below:\n\nApproved/Processing: If this is your order status, then you can change the address through your app.\n\nShipped: Only text change in your address will be possible. Pincode cannot be changed at this stage.\n\nDelivered: As the item would have already been delivered, the address change will not be possible.'
      },
      {
        question: 'How can I modify/add an alternate number for the order delivery?',
        answer: 'You can modify the existing delivery contact number or add an alternate one with these simple steps:\n- Go to Orders\n- Select the desired \'Order\'\n- Scroll down and go to shipping details tab and tap \'Edit\' (Pen) option next to the phone number'
      },
      {
        question: 'Can I get my orders delivered at a specific time?',
        answer: 'Orders for a few items from certain categories like large appliances, furniture and exercise & fitness categories can be delivered at specific time slots by the sellers\' partnered courier service providers. You can choose your preferred time slot from the list of available ones while placing your order. For other items, the seller\'s partnered courier service providers currently do not support delivery at a specific time due to their varying delivery schedules.'
      },
      {
        question: 'Where can I get the delivery executive\'s contact details?',
        answer: 'Once your order is \'Out for delivery\', you will get the delivery executive details by visiting the Orders section of your account.'
      },
      {
        question: 'Can I get my order delivered faster?',
        answer: 'No, the delivery date you see after the order confirmation is provided is based on factors like your address, the seller\'s address and the time needed by couriers to process and ship your order. Due to these factors, they do not have the option to change the delivery date and have it reach you earlier. However, you can track your order and its movement easily from our app or website.'
      },
      {
        question: 'Can I reinstate a cancelled order?',
        answer: 'No, a cancelled order can not be reinstated.'
      },
      {
        question: 'What should I do if my order is approved but hasn\'t been shipped yet?',
        answer: 'If your order is approved but hasn\'t been shipped yet, please allow some additional processing time. For safety shirts, this usually takes 1-2 business days, while truck tires may take 2-3 business days due to their size and special handling requirements. If it has been longer than this timeframe, please contact customer support with your order number for assistance.'
      },
      {
        question: 'Can I take the shipment after opening and checking the contents inside?',
        answer: 'Yes, we offer an "Open Box Delivery" option for most of our products. When the delivery executive arrives, you can open and inspect the product before accepting delivery. For safety shirts, you can check the size and quality, and for truck tires, you can verify the specifications and condition. If you find any issues, you can refuse the delivery and request a return on the spot.'
      },
      {
        question: 'How quickly can I get my safety equipment delivered?',
        answer: 'Standard delivery for safety shirts is 3-5 business days. For urgent requirements, we offer express delivery (1-2 business days) at an additional charge in select areas. Truck tires typically take 4-7 business days for delivery due to their weight and specialized handling requirements.'
      }
    ],
    'Safety shirt sizing': [
      {
        question: 'How do I find the right size for safety shirts?',
        answer: 'Our safety shirts follow standard sizing charts which can be found on each product page. For the most accurate fit, we recommend measuring yourself and referring to our detailed size guide. Remember that safety shirts should be slightly loose-fitting but not baggy for proper protection and comfort.'
      },
      {
        question: 'Can I exchange my safety shirt if the size doesn\'t fit?',
        answer: 'Yes, you can exchange safety shirts within 14 days of delivery if the size doesn\'t fit. The shirt must be unworn, unwashed, and with all original tags and packaging. You can initiate the exchange through the "My Orders" section.'
      },
      {
        question: 'Do your safety shirts shrink after washing?',
        answer: 'Our high-quality safety shirts are pre-shrunk to minimize size changes after washing. However, we recommend following the care instructions on the label to maintain the original size and fit. Generally, cold water wash and line drying are recommended for best results.'
      }
    ],
    'Truck tire specifications':[
      {
        question: 'How do I know which tire size is right for my truck?',
        answer: 'You can find the correct tire size for your truck on the sidewall of your current tires, in your vehicle\'s owner manual, or on the driver\'s side door jamb. Our website also features a "Tire Finder" tool where you can enter your truck model to get compatible tire recommendations.'
      },
      {
        question: 'What do the numbers and letters on truck tires mean?',
        answer: 'Truck tire markings follow a standard format. For example, in "295/75R22.5 144/141L", 295 is the width in millimeters, 75 is the aspect ratio, R means radial construction, 22.5 is the rim diameter in inches, 144/141 is the load index, and L is the speed rating. Each product page includes detailed explanations of these specifications.'
      },
      {
        question: 'Do you provide tire installation services?',
        answer: 'We don\'t provide installation services directly, but we have partnered with local service centers in major cities. During checkout, you\'ll see options for nearby installation centers with their rates. You can select this option for an additional fee.'
      },
    ],
    'Refunds related': [
      {
        question: 'How long does it take to process a refund?',
        answer: 'Once we receive your returned item, refunds typically take 5-7 business days to process. After processing, it may take an additional 3-5 business days for the amount to reflect in your account, depending on your payment method and bank processing times.'
      },
      {
        question: 'Can I get a refund without returning the product?',
        answer: 'In special cases like damaged deliveries documented at the time of delivery or incorrect items shipped, we may process refunds without requiring the return of the product. However, this is decided on a case-by-case basis. Please contact customer support with details of your situation.'
      }
    ]
  };
  
  // Create a handler for issue type selection
  const handleIssueTypeClick = (issueType) => {
    setActiveIssueType(issueType);
    
    // Map issue types to relevant help topics
    if (issueType === 'Help with your order') {
      setActiveCategory('Delivery related');
    } else if (issueType === 'Help with your issues') {
      setActiveCategory('Safety shirt sizing');
    } else {
      setActiveCategory('Refunds related');
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContainer maxWidth="lg">
        <HeaderBox>
          <Typography variant="h4" component="h1" gutterBottom>
            Help Center | 24×7 Customer Care Support
          </Typography>
          <Description variant="body2">
            The Help Centre page lists out various types of issues that you may have encountered so that there can be quick resolution and you can go back to shopping online. For example, you can get more information regarding order tracking, delivery date changes, help with returns (and refunds), and much more. The Help Centre also lists out more information that you may need regarding product tips, payment, shopping, and more. The page has various filters listed out on the left-hand side so that you can get your queries solved quickly, efficiently, and without a hassle. You can get the Help Centre number or even access Help Centre support if you need professional help regarding various topics. The support executive will ensure speedy assistance so that your shopping experience is positive and enjoyable. This information is updated on 07-Mar-25
          </Description>
        </HeaderBox>
        
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Sidebar>
              <Box>
                <CategoryTitle variant="subtitle1">TYPE OF ISSUE</CategoryTitle>
                <List disablePadding>
                  {issueTypes.map((issue, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      dense 
                      divider
                      selected={issue === activeIssueType}
                      onClick={() => handleIssueTypeClick(issue)}
                      sx={{ 
                        '&.Mui-selected': { 
                          color: 'secondary.main',
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(40, 116, 240, 0.08)'
                        } 
                      }}
                    >
                      <ListItemText primary={issue} />
                    </ListItem>
                  ))}
                </List>
                
                <CategoryTitle variant="subtitle1">HELP TOPICS</CategoryTitle>
                <List disablePadding>
                  {helpTopics.map((topic, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      dense 
                      divider
                      selected={topic === activeCategory}
                      onClick={() => setActiveCategory(topic)}
                      sx={{ 
                        '&.Mui-selected': { 
                          color: 'secondary.main',
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(40, 116, 240, 0.08)'
                        } 
                      }}
                    >
                      <ListItemText primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Sidebar>
          </Grid>
          
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <MainContent>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="#">
                  Help Centre
                </Link>
                <Typography color="text.primary">{activeCategory}</Typography>
              </Breadcrumbs>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, mb: 3 }}>
                Frequently asked questions
              </Typography>
              
              <Box>
                {faqData[activeCategory] && faqData[activeCategory].map((faq, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <Typography sx={{ fontWeight: 'medium' }}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              
              <UpdateInfo variant="caption">
                This information is updated on 07-Mar-25
              </UpdateInfo>
            </MainContent>
          </Grid>
        </Grid>
      </MainContainer>
    </ThemeProvider>
  );
}

export default App;