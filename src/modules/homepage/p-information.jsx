import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    styled,
    useTheme,
    useMediaQuery
} from '@mui/material';


const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '35px',
    lineHeight: '100%',
    letterSpacing: '0%',
    marginLeft: "-10px",
    marginBottom: theme.spacing(1.5),
    color: theme.palette.grey[900],
    [theme.breakpoints.down('lg')]: {
        fontSize: '32px',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '28px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        textAlign: 'center',
    },
}));

const SectionDescription = styled(Typography)(({ theme }) => ({
    color: "black",
    fontSize: '1.3rem',
    lineHeight: 1.6,
    marginLeft: "-8px",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
       
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        textAlign: 'center',
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
        marginBottom: 0,
    },
}));

const ProductImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    objectFit: 'contain',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '500px',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '400px',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '300px',
    },
}));

const CustomCheckbox = styled(FormControlLabel)(({ theme }) => ({
    marginBottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'flex-start',
    '& .MuiFormControlLabel-label': {
        fontWeight: 600,
        fontSize: '1.2rem',
        color: theme.palette.grey[800],
        marginLeft: theme.spacing(1.5),
        [theme.breakpoints.down('md')]: {
            fontSize: '1.1rem',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem',
        },
    },
    '& .MuiCheckbox-root': {
        padding: 0,
        marginRight: theme.spacing(1.5),
        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '3px',
            padding: '3px',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.3rem',
            },
        },
        '&.Mui-checked .MuiSvgIcon-root': {
            backgroundColor: '#000',
            color: '#fff',
        },
        '&:not(.Mui-checked) .MuiSvgIcon-root': {
            backgroundColor: '#000',
            color: 'transparent',
        },
    },
}));

const CheckboxContainer = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        marginLeft: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
}));

// Main component
const ApparelCustomization = () => {
    const [teeShirtFeatures, setTeeShirtFeatures] = useState({
        customLogo: true,
        flagPatches: true,
        textEmbroidery: true,
        nameBadges: true
    });

    const [truckTyreFeatures, setTruckTyreFeatures] = useState({
        customLogo: true,
        flagPatches: true,
        textEmbroidery: true,
        nameBadges: true
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const handleTeeShirtChange = (feature) => (event) => {
        setTeeShirtFeatures({ ...teeShirtFeatures, [feature]: event.target.checked });
    };

    const handleTruckTyreChange = (feature) => (event) => {
        setTruckTyreFeatures({ ...truckTyreFeatures, [feature]: event.target.checked });
    };

    return (
        <Box sx={{
            width: '100%',
            overflow: 'hidden',
            py: isMobile ? 4 : 6,
            marginTop: isDesktop ? -20 : 0 
        }}>
            <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                {/* Tee Shirts and Safety Jackets Section */}
                <Grid container spacing={isMobile ? 2 : 4} alignItems="center" sx={{ mb: isMobile ? 4 : 6 }}>
                    {/* Left side - Text content */}
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
                        <Box sx={{
                            maxWidth: '600px',
                            mx: 'auto',
                            px: { xs: 0, md: 2 },
                            textAlign: isMobile ? 'center' : 'left',
                            marginRight: isMobile ? 0 : '150px'
                        }}>
                            <SectionTitle variant="h2">
                                Safety shirts and jackets
                            </SectionTitle>
                            <br />
                            <SectionDescription variant="body1">
                                Personal style is fashion to move into just when you wear—it's a visual manifestation of your personality. At TOWDEPO, our tees and safety jackets
                                combine comfort with functionality, ensuring you look sharp while staying protected
                            </SectionDescription>
                            <br />
                            <CheckboxContainer>
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={teeShirtFeatures.customLogo}
                                            onChange={handleTeeShirtChange('customLogo')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Your custom logo"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={teeShirtFeatures.flagPatches}
                                            onChange={handleTeeShirtChange('flagPatches')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="American flag patches"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={teeShirtFeatures.textEmbroidery}
                                            onChange={handleTeeShirtChange('textEmbroidery')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Text embroidery"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={teeShirtFeatures.nameBadges}
                                            onChange={handleTeeShirtChange('nameBadges')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Name badges"
                                />
                            </CheckboxContainer>
                        </Box>
                    </Grid>

                    {/* Right side - Shirt Image */}
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }} >
                        <ImageContainer sx={{ px: { xs: 0, md: 2 } }}>
                            <ProductImage
                                src="assets/homepageimages/informationimage2.png"
                                alt="Tee shirts and safety jackets"
                            />
                        </ImageContainer>
                    </Grid>
                </Grid>

                {/* Truck Tyres Section */}
                <Grid container spacing={isMobile ? 2 : 4} alignItems="center">
                    {/* Left side - Tyre Image */}
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <ImageContainer sx={{ px: { xs: 0, md: 2 } }}>
                            <ProductImage
                                src="assets/homepageimages/informationimage1.png"
                                alt="Truck Tyres"
                            />
                        </ImageContainer>
                    </Grid>

                    {/* Right side - Text content */}
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                        <Box sx={{
                            maxWidth: '600px',
                            mx: 'auto',
                            px: { xs: 0, md: 2 },
                            textAlign: isMobile ? 'center' : 'left',
                        }}>
                            <SectionTitle variant="h2">
                                Truck Tyres
                            </SectionTitle>
                            <br />
                            <SectionDescription variant="body1">
                                Engineered for strength and durability, our truck tyres ensure maximum load-carrying capacity,
                                longer life, and superior road grip—keeping your fleet moving efficiently on every journey.
                                Designed with advanced tread technology, they provide excellent traction on highways, city roads,
                                and tough terrains alike. With reduced rolling resistance,
                                our tyres help save fuel while offering smoother rides and safer handling
                            </SectionDescription>
                            <br />
                            <CheckboxContainer>
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={truckTyreFeatures.customLogo}
                                            onChange={handleTruckTyreChange('customLogo')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Your custom logo"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={truckTyreFeatures.flagPatches}
                                            onChange={handleTruckTyreChange('flagPatches')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="American flag patches"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={truckTyreFeatures.textEmbroidery}
                                            onChange={handleTruckTyreChange('textEmbroidery')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Text embroidery"
                                />
                                <CustomCheckbox
                                    control={
                                        <Checkbox
                                            checked={truckTyreFeatures.nameBadges}
                                            onChange={handleTruckTyreChange('nameBadges')}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                        />
                                    }
                                    label="Name badges"
                                />
                            </CheckboxContainer>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ApparelCustomization;