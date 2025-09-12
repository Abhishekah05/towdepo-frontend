import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link, TextField, Button, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import FooterLogo from '../../../../../../public/assets/paviimages/FooterLogo.png';


const SupportLinks = () => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
    {[
      { name: 'Contact Us', url: '/contactus' },
      { name: 'Shipping', url: '/shipping' },
      { name: 'Returns', url: '/returns' },
      { name: 'Track Order', url: 'ecommerce/checkout' }
    ].map((item) => (
      <li key={item.name}>
        <Link
          href={item.url}
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </Box>
);

const CompanyLinks = () => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
    {[
      { name: 'About TowDepo', url: '/about' },
      { name: 'Customer Support', url: '/support' },
      { name: 'Delivery Details', url: 'ecommerce/checkout' },
      { name: 'Terms & Conditions', url: '/terms' },
      { name: 'Privacy Policy', url: '/privacy' }
    ].map((item) => (
      <li key={item.name}>
        <Link
          href={item.url}
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </Box>
);

const SocialLinks = () => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
    {[
      { name: 'Facebook', url: 'https://facebook.com/towdepo' },
      { name: 'Instagram', url: 'https://instagram.com/towdepo' },
      { name: 'YouTube', url: 'https://youtube.com/towdepo' }
    ].map((item) => (
      <li key={item.name}>
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </Box>
);

const Footer = () => {
  const [expanded, setExpanded] = useState({
    support: false,
    company: false,
    social: false
  });

  const handleToggle = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f8f8f8',
        color: 'black',
        borderTop: '1px solid #e0e0e0',
        pt: { xs: 3, sm: 4 },
        pb: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={6}>
            {/* Added image above the text */}
            <Box sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              mt: 20
            }}>
              <Box
                component="img"
                src={FooterLogo}
                alt="App Promotion"
                sx={{
                  width: { xs: 120, sm: 150, md: 180 },
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <br/>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#333',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Shop Tyres & Safety Wear on the Go
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              mb: { xs: 3, sm: 4 },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              width: '100%',
               ml: { sm: -3, md: -4 },
              
            }}>
              <Box
                component="img"
                src="/assets/footerimages/GooglePlay.png"
                alt="Google Play"
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 35, sm: 45, md: 55 },
                  objectFit: 'contain',
                  cursor: 'pointer',
                  borderRadius: '6px',
                }}
              />
              <Box
                component="img"
                src="/assets/footerimages/AppStore.png"
                alt="App Store"
                sx={{
                  width: { xs: 85, sm: 100 },
                  height: { xs: 35, sm: 45, md: 55 },
                  objectFit: 'contain',
                  cursor: 'pointer',
                  borderRadius: '6px',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Box sx={{ borderBottom: '1px solid #e0e0e0', py: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToggle('support')}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '0.9rem',
                    }}
                  >
                    Support
                  </Typography>
                  <IconButton size="small">
                    {expanded.support ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expanded.support}>
                  <Box sx={{ pl: 1, pb: 1 }}>
                    <SupportLinks />
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ borderBottom: '1px solid #e0e0e0', py: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToggle('company')}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '0.9rem',
                    }}
                  >
                    Company
                  </Typography>
                  <IconButton size="small">
                    {expanded.company ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expanded.company}>
                  <Box sx={{ pl: 1, pb: 1 }}>
                    <CompanyLinks />
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ borderBottom: '1px solid #e0e0e0', py: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToggle('social')}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '0.9rem',
                    }}
                  >
                    Social
                  </Typography>
                  <IconButton size="small">
                    {expanded.social ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expanded.social}>
                  <Box sx={{ pl: 1, pb: 1 }}>
                    <SocialLinks />
                  </Box>
                </Collapse>
              </Box>
            </Box>

            <Grid container spacing={{ xs: 3, sm: 2 }} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: '#333',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                  }}
                >
                  Support
                </Typography>
                <SupportLinks />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: '#333',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                  }}
                >
                  Company
                </Typography>
                <CompanyLinks />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: '#333',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                  }}
                >
                  Social
                </Typography>
                <SocialLinks />
              </Grid>
            </Grid>

            <Box sx={{ mt: { xs: 4, sm: 5, md: 7 }, pt: 2, textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 3, md: 5 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Accept Payment -
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5 },
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {[
                    { name: 'Visa', icon: '/assets/footerimages/visa.png', link: 'https://www.visa.com/' },
                    { name: 'Mastercard', icon: '/assets/footerimages/card.png', link: 'https://www.mastercard.com/' },
                    { name: 'Amex', icon: '/assets/footerimages/amex.png', link: 'https://www.americanexpress.com/' },
                    { name: 'PayPal', icon: '/assets/footerimages/paypal.png', link: 'https://www.paypal.com/' },
                    { name: 'Apple Pay', icon: '/assets/footerimages/apple-pay.png', link: 'https://www.apple.com/apple-pay/' },
                    { name: 'Google Pay', icon: '/assets/footerimages/google-pay.png', link: 'https://pay.google.com/' },
                  ].map((method, index) => (
                    <Box
                      key={index}
                      component="a"
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: { xs: 40, sm: 45, md: 50 },
                        height: { xs: 25, sm: 28, md: 30 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        component="img"
                        src={method.icon}
                        alt={method.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 2, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          backgroundColor: '#333',
          mt: 4,
          gap: { xs: 1.5, sm: 0 }
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#fff',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
            textAlign: { xs: 'center', sm: 'left' },
            order: { xs: 2, sm: 1 }
          }}
        >
          Copyright © 2022–2025{' '}
          <Box component="span" sx={{ fontWeight: 'bold', color: '#fff' }}>
            TowDepo.com
          </Box>
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          order: { xs: 1, sm: 2 }
        }}>
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              mr: 1,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Stay Connected
          </Typography>

          {[
            { name: 'Facebook', icon: '/assets/footerimages/facebook.png', link: 'https://facebook.com' },
            { name: 'Instagram', icon: '/assets/footerimages/instagram.png', link: 'https://instagram.com' },
            { name: 'Twitter', icon: '/assets/footerimages/social-media.png', link: 'https://twitter.com' },
            { name: 'LinkedIn', icon: '/assets/footerimages/linkedin.png', link: 'https://linkedin.com' },
            { name: 'YouTube', icon: '/assets/footerimages/youtube.png', link: 'https://youtube.com' },
          ].map((social, index) => (
            <Box
              key={index}
              component="a"
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: { xs: 16, sm: 18 },
                height: { xs: 16, sm: 18 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Box
                component="img"
                src={social.icon}
                alt={social.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;