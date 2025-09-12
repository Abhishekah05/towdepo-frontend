import React, { useState } from 'react';
import { 
  CssBaseline, 
  Typography, 
  Container, 
  Box, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Divider,
  Paper,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';


// Custom styled components
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(6),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  borderRadius: theme.shape.borderRadius,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SubSectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const LastUpdated = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  fontStyle: 'italic',
}));

const ListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1),
  '&:before': {
    content: '"•"',
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));

// Create a theme for our site
const theme = createTheme({
  palette: {
    primary: {
      main: '#f57c00', // Orange for safety theme
    },
    secondary: {
      main: '#0d47a1', // Dark blue
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    }
  },
});

function PrivacyPolicy() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContainer maxWidth="lg">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Typography color="text.primary">Privacy Policy</Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <HeaderBox>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Notice
          </Typography>
          <Typography variant="body1">
            By accessing or using our website and services, you agree to our terms and privacy policy.
          </Typography>
          <LastUpdated>
            Last Updated: March 7, 2025
          </LastUpdated>
        </HeaderBox>

        {/* Introduction */}
        <Typography variant="body1" paragraph>
        
          At TowDepo, we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, disclose, transfer, and store your information when you visit our website or make purchases. Please take a moment to familiarize yourself with our privacy practices.
          
        </Typography>

        {/* Main Content - Section 1 */}
        <SectionHeader variant="h5" component="h2">
          What Personal Information About Customers DoesTowDepo Collect?
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          We collect various types of personal information about our customers and visitors to provide better products and services. Here's the information we collect:
        </Typography>

        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Information you provide us:</strong> We receive and store information you enter on our website or give us in any other way, including your name, address, email, phone number, and payment information when you register, make a purchase, or set up your account.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Automatic information:</strong> We collect and store certain types of information whenever you interact with us, including your IP address, browser type, operating system, and the domain name of your Internet service provider.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Information from other sources:</strong> We might receive information about you from other sources such as credit bureaus, updated delivery and address information from our carriers, which we use to correct our records.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Mobile information:</strong> When you download or use our mobile applications, we may receive information about your location and your mobile device, including a unique identifier for your device.
            </Typography>
          </ListItem>
        </Box>

        {/* Section 2 */}
        <SectionHeader variant="h5" component="h2">
          For What Purposes DoesTowDepo Use Your Personal Information?
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          We use the information that we collect to provide, maintain, and improve our services to you, including:
        </Typography>

        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Processing and delivering your orders:</strong> We use your personal information to process your orders, deliver products, process payments, and communicate with you about your orders.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Providing and improving our services:</strong> We use your information to provide functionality, analyze performance, fix errors, and improve usability of our services.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Recommendations and personalization:</strong> We use your information to recommend products and services that might be of interest to you, identify your preferences, and personalize your experience.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Marketing communications:</strong> With your consent, we may send promotional emails about new products, special offers or other information which we think you may find interesting.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Fraud prevention and credit risks:</strong> We use personal information to prevent and detect fraud and abuse in order to protect the security of our customers, ourselves, and others.
            </Typography>
          </ListItem>
        </Box>

        {/* Section 3 */}
        <SectionHeader variant="h5" component="h2">
          DoesTowDepo Share Your Personal Information?
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          Your information is an important part of our business, and we are not in the business of selling it to others. We share customer information only as described below:
        </Typography>

        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Third-party service providers:</strong> We employ other companies and individuals to perform functions on our behalf, such as delivering packages, sending postal mail and email, processing payments, and providing customer service. They have access to personal information needed to perform their functions, but may not use it for other purposes.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Business transfers:</strong> As we continue to develop our business, we might sell or buy stores, subsidiaries, or business units. In such transactions, customer information generally is one of the transferred business assets but remains subject to the promises made in any pre-existing Privacy Notice.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Protection of our company and others:</strong> We release account and other personal information when we believe release is appropriate to comply with the law, enforce or apply our Terms of Use and other agreements, or protect the rights, property, or safety of our company, our users, or others.
            </Typography>
          </ListItem>
        </Box>

        {/* Section 4 */}
        <SectionHeader variant="h5" component="h2">
          How Secure Is Information About Me?
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          We work to protect the security of your personal information during transmission by using encryption protocols and software. We maintain physical, electronic, and procedural safeguards in connection with the collection, storage, and disclosure of customer personal information.
        </Typography>
        
        <Typography variant="body1" paragraph>
          It is important for you to protect against unauthorized access to your password and to your computers, devices, and applications. We recommend using a unique password for your account that is not used for other online accounts.
        </Typography>

        {/* Section 5 */}
        <SectionHeader variant="h5" component="h2">
          What About Cookies and Other Identifiers?
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          Cookies are unique identifiers that we transfer to your device to enable our systems to recognize your device and to provide features such as personalized advertisements, product recommendations, and storage of items in your shopping cart between visits.
        </Typography>
        
        <Typography variant="body1" paragraph>
          You can manage browser cookies through your browser settings. However, blocking cookies may affect your ability to use certain features of our website.
        </Typography>

        {/* Section 6 */}
        <SectionHeader variant="h5" component="h2">
          Policies Specific to Safety Products and Information
        </SectionHeader>
        
        <SubSectionHeader variant="h6" component="h3">
          Safety Shirts
        </SubSectionHeader>
        
        <Typography variant="body1" paragraph>
          When you purchase safety shirts, we may collect additional information to ensure compliance with industry safety standards:
        </Typography>
        
        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Size measurements:</strong> To provide properly fitted safety apparel, we may collect information about your measurements and sizing preferences.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Industry-specific requirements:</strong> For bulk or enterprise purchases, we may collect information about your company's safety requirements, industry certifications needed, and compliance regulations.
            </Typography>
          </ListItem>
        </Box>
        
        <SubSectionHeader variant="h6" component="h3">
          Truck Tires
        </SubSectionHeader>
        
        <Typography variant="body1" paragraph>
          For truck tire purchases, we collect specific vehicle information to ensure proper tire selection:
        </Typography>
        
        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Vehicle specifications:</strong> Information about your truck model, weight load requirements, axle configuration, and current tire specifications to recommend appropriate products.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Usage patterns:</strong> Information about your typical driving conditions, routes, and load types to help recommend tires with appropriate wear patterns and safety features.
            </Typography>
          </ListItem>
        </Box>

        {/* Section 7 */}
        <SectionHeader variant="h5" component="h2">
          Your Choices
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          You have choices about how we use your personal information:
        </Typography>
        
        <Box sx={{ ml: 2, mb: 3 }}>
          <ListItem>
            <Typography variant="body1">
              <strong>Account Information:</strong> You can access, update, or delete your account information by logging into your account settings. Some information is required for account maintenance and order processing.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Marketing Communications:</strong> If you do not want to receive marketing emails from us, you can adjust your communication preferences in your account or click the "unsubscribe" link in the emails.
            </Typography>
          </ListItem>
          
          <ListItem>
            <Typography variant="body1">
              <strong>Cookies and Tracking Technologies:</strong> You can manage browser cookies through your browser settings, though this may affect site functionality.
            </Typography>
          </ListItem>
        </Box>

        {/* Section 8 */}
        <SectionHeader variant="h5" component="h2">
          Children's Privacy
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are under 16, do not use or provide any information on this website.
        </Typography>

        {/* Section 9 */}
        <SectionHeader variant="h5" component="h2">
          Changes to This Privacy Notice
        </SectionHeader>
        
        <Typography variant="body1" paragraph>
          We may update our Privacy Policy from time to time. If we make significant changes, we will notify you by email or by a notice on this website prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.
        </Typography>

        {/* Section 10 */}
        {/* Contact Us Section */}
<SectionHeader variant="h5" component="h2">
  Contact Us
</SectionHeader>

<Typography variant="body1" paragraph>
  If you have any questions about this Privacy Policy, please contact us at:
</Typography>

<Box sx={{ ml: 2, mb: 4 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
    <Typography variant="body1"><strong>Email:</strong> towdepo@gmail.com</Typography>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
    <Typography variant="body1"><strong>Phone:</strong> (202) 482-2000</Typography>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
    <Typography variant="body1"><strong>Address:</strong> U.S. Department of Commerce, 1401 Constitution Ave NW, Washington, DC 20230</Typography>
  </Box>
</Box>


        {/* FAQ Accordion Section */}
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Privacy Policy FAQs
          </Typography>
          
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ fontWeight: 'medium' }}>How do I request deletion of my personal data?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                To request deletion of your personal data, please log into your account and go to the Privacy Settings section. Alternatively, you can contact our customer service team at privacy@safetytyreco.com with the subject line "Data Deletion Request." We will process your request within 30 days and send confirmation when completed.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography sx={{ fontWeight: 'medium' }}>Do you sell my information to third parties?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No, we do not sell your personal information to third parties. We only share your information with service providers who help us operate our business, process orders, and deliver products to you. These service providers are contractually obligated to keep your information confidential and secure.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography sx={{ fontWeight: 'medium' }}>How long do you keep my purchase history?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We retain your purchase history for a period of 7 years to comply with tax and financial regulations. This information is also used to provide warranty services for safety equipment and tires, track product performance, and assist with product recalls if necessary. You can view your purchase history in your account settings.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography sx={{ fontWeight: 'medium' }}>Is my payment information secure?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, your payment information is secure. We use industry-standard encryption technology to protect your credit card information during transmission. We do not store complete credit card numbers on our servers. Instead, we use tokenization through our payment processors to handle transactions securely.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2025TowDepo. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This information was last updated on March 7, 2025
          </Typography>
        </Box>
      </MainContainer>
    </ThemeProvider>
  );
}

export default PrivacyPolicy;