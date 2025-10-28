import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
    IconButton,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    useMediaQuery,
    Stack,
    Divider,
    Alert
} from '@mui/material';
import {
    Store as StoreIcon,
    Inventory as InventoryIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    AttachMoney as MoneyIcon,
    ShoppingCart as CartIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Add as AddIcon,
    LocalShipping as DeliveryIcon,
    Schedule as ScheduleIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import {
    useGetProductsByOwnerQuery,
    useGetStoresByOwnerQuery
} from '@crema/Slices/productsSlice';
import AppLoader from '@crema/components/AppLoader';
import { Fonts } from '@crema/constants/AppEnums';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

const StoreOwnerDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useAuthUser();

    // Use the same queries as ProductListing component
    const {
        data: productsData,
        isLoading: productsLoading,
        error: productsError
    } = useGetProductsByOwnerQuery(user?.id);

    const {
        data: storesData,
        isLoading: storesLoading,
        error: storesError
    } = useGetStoresByOwnerQuery(user?.id);

    const stores = storesData?.stores || [];
    const products = productsData?.products || [];
    const store = stores[0]; // Get first store for owner

    // Calculate dashboard metrics
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.inStock).length;
    const outOfStockProducts = products.filter(p => !p.inStock).length;
    const totalValue = products.reduce((sum, p) => sum + (p.mrp || 0), 0);
    const averagePrice = totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;
    const stockPercentage = totalProducts > 0 ? ((inStockProducts / totalProducts) * 100).toFixed(1) : 0;

    // Get recent products (last 5)
    const recentProducts = products.slice(0, 5);

    // Loading state
    if (storesLoading || productsLoading) {
        return <AppLoader />;
    }

    // Error state
    if (storesError || productsError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                    Error loading dashboard data. Please try refreshing the page.
                </Alert>
            </Box>
        );
    }

    // No store found
    if (!store) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                    No store found for your account. Please contact administrator.
                </Alert>
            </Box>
        );
    }

    // Metric Card Component with enhanced styling
    const MetricCard = ({ title, value, icon, color, subtitle, trend }) => (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                            sx={{
                                fontWeight: Fonts.MEDIUM,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                letterSpacing: 0.5,
                                mb: 1.5
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            component="div"
                            sx={{
                                fontWeight: Fonts.BOLD,
                                color,
                                mb: 1,
                                fontSize: { xs: '1.75rem', md: '2.125rem' }
                            }}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    mt: 0.5,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                {trend > 0 ? (
                                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                ) : (
                                    <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
                                )}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        ml: 0.5,
                                        color: trend > 0 ? 'success.main' : 'error.main',
                                        fontWeight: Fonts.SEMI_BOLD
                                    }}
                                >
                                    {Math.abs(trend)}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
                            color,
                            width: 64,
                            height: 64,
                            boxShadow: `0 4px 14px ${color}25`
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    // Store Info Card with enhanced styling
    const StoreInfoCard = () => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'warning.light', color: 'warning.main',
                            width: 48,
                            height: 48
                        }}>
                            <StoreIcon sx={{}} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD }}>
                                Store Information
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Your store details and settings
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="medium"
                        onClick={() => navigate('/stores')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                transform: 'rotate(90deg)',
                                transition: 'all 0.3s'
                            }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                    }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', }}>
                            <StoreIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: Fonts.MEDIUM }}>
                                Store Name
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: Fonts.SEMI_BOLD, mt: 0.5 }}>
                                {store.name}
                            </Typography>
                            {store.description && (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {store.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                    }}>
                        <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                            <PhoneIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: Fonts.MEDIUM }}>
                                Contact Information
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: Fonts.SEMI_BOLD, mt: 0.5 }}>
                                {store.contact?.phone}
                            </Typography>
                            {store.contact?.email && (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {store.contact.email}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                    }}>
                        <Avatar sx={{ bgcolor: 'info.light', color: 'common.white' }}>
                            <LocationIcon />
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: Fonts.MEDIUM }}>
                                Store Address
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: Fonts.MEDIUM, mt: 0.5 }}>
                                {store.address?.street}, {store.address?.city}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {store.address?.state} {store.address?.postalCode}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                    }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                            <DeliveryIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: Fonts.MEDIUM, mb: 1 }}>
                                Delivery Information
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label={`Radius: ${store.deliveryRadius} km`}
                                    size="small"
                                    sx={{ fontWeight: Fonts.MEDIUM }}
                                />
                                <Chip
                                    label={`Fee: ₹${store.deliveryFee}`}
                                    size="small"
                                    sx={{ fontWeight: Fonts.MEDIUM }}
                                />
                                <Chip
                                    label={`Min Order: ₹${store.minOrderAmount}`}
                                    size="small"
                                    sx={{ fontWeight: Fonts.MEDIUM }}
                                />
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: store.isActive ? 'success.lighter' : 'grey.100'
                    }}>
                        <Typography variant="body1" sx={{ fontWeight: Fonts.SEMI_BOLD }}>
                            Store Status
                        </Typography>
                        <Chip
                            label={store.isActive ? 'Active' : 'Inactive'}
                            icon={store.isActive ? <CheckIcon /> : <CancelIcon />}
                            size="small"
                            sx={{
                                fontWeight: Fonts.BOLD,
                                fontSize: 14,
                                borderRadius: 1,
                                px: 1,
                                py: 0.3,
                                color: store.isActive ? '#43C888' : '#F84E4E', // text + icon color
                                bgcolor: store.isActive ? '#43C88844' : '#F84E4E44', // translucent background
                                '& .MuiChip-icon': {
                                    color: store.isActive ? '#43C888' : '#F84E4E', // ensure icon uses same color
                                },
                            }}
                        />

                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    // Store Timings Card with enhanced styling
    const StoreTimingsCard = () => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}05 100%)`,
                p: 2.5,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
                        <ScheduleIcon fontSize="small" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD }}>
                            Store Timings
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Weekly schedule
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                    {store.timings?.map((timing, index) => (
                        <Box
                            key={timing.day}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: index % 2 === 0 ? 'background.default' : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: Fonts.SEMI_BOLD,
                                    textTransform: 'capitalize',
                                    minWidth: 100
                                }}
                            >
                                {timing.day}
                            </Typography>
                            {timing.isClosed ? (
                                <Chip
                                    label="Closed"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ fontWeight: Fonts.MEDIUM }}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        fontWeight: Fonts.MEDIUM,
                                        bgcolor: 'success.lighter',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}
                                >
                                    {timing.openingTime} - {timing.closingTime}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );

    // Recent Products Table with enhanced styling
    const RecentProductsTable = () => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 48, height: 48 }}>
                            <InventoryIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD }}>
                                Recent Products
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Your latest inventory additions
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/ecommerce/product-listing')}
                        endIcon={<ViewIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: Fonts.SEMI_BOLD,
                            boxShadow: 2
                        }}
                    >
                        View All
                    </Button>
                </Box>
            </Box>

            <CardContent sx={{ p: 0 }}>
                {recentProducts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                        <Avatar sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            mx: 'auto',
                            mb: 2
                        }}>
                            <AddIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: Fonts.SEMI_BOLD, mb: 1 }}>
                            No products yet
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                            Start adding products to your inventory
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/ecommerce/add-products')}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: Fonts.SEMI_BOLD,
                                px: 4
                            }}
                        >
                            Add Your First Product
                        </Button>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'background.default' }}>
                                    <TableCell sx={{ fontWeight: Fonts.BOLD, fontSize: '0.875rem' }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: Fonts.BOLD, fontSize: '0.875rem' }}>SKU</TableCell>
                                    <TableCell sx={{ fontWeight: Fonts.BOLD, fontSize: '0.875rem' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: Fonts.BOLD, fontSize: '0.875rem' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: Fonts.BOLD, fontSize: '0.875rem' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentProducts.map((product, index) => (
                                    <TableRow
                                        key={product.id}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                cursor: 'pointer'
                                            },
                                            borderBottom: index === recentProducts.length - 1 ? 'none' : undefined
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    boxShadow: 1,
                                                    flexShrink: 0
                                                }}>
                                                    <img
                                                        src={product.images?.length > 0
                                                            ? `${mediaUrl}/product/${product.images[0].src}`
                                                            : '/default-image.jpg'}
                                                        alt={product.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    sx={{
                                                        maxWidth: 200,
                                                        fontWeight: Fonts.MEDIUM
                                                    }}
                                                >
                                                    {product.title}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.SKU}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: Fonts.MEDIUM }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: Fonts.BOLD,
                                                    color: 'primary.main'
                                                }}
                                            >
                                                ₹{product.mrp}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.inStock ? 'In Stock' : 'Out of Stock'}
                                                size="small"
                                                sx={{
                                                    fontWeight: Fonts.SEMI_BOLD,
                                                    fontSize: 14,
                                                    borderRadius: 1,
                                                    color: product.inStock ? '#43C888' : '#F84E4E', // same as getPaymentStatusColor()
                                                    bgcolor: product.inStock ? '#43C88844' : '#F84E4E44', // adds transparency
                                                    px: 1,
                                                    py: 0.3,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/ecommerce/product-view/${product.id}`)}
                                                sx={{
                                                    bgcolor: 'primary.lighter',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
                                                        color: 'primary.contrastText'
                                                    }
                                                }}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );

    // Stock Overview with enhanced styling
    const StockOverview = () => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}05 100%)`,
                p: 2.5,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.main, width: 40, height: 40 }}>
                        <InventoryIcon fontSize="small" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD }}>
                            Stock Overview
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Inventory status
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: Fonts.SEMI_BOLD }}>
                            Stock Availability
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: Fonts.BOLD,
                                color: 'success.main'
                            }}
                        >
                            {stockPercentage}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={parseFloat(stockPercentage)}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: 'error.lighter',
                            '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(90deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                                borderRadius: 6,
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                            }
                        }}
                    />
                </Box>

                <Stack spacing={2}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'success.lighter'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                            }} />
                            <Typography variant="body2" sx={{ fontWeight: Fonts.MEDIUM }}>
                                In Stock
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD, color: 'success.main' }}>
                            {inStockProducts}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'error.lighter'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: 'error.main',
                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.4)'
                            }} />
                            <Typography variant="body2" sx={{ fontWeight: Fonts.MEDIUM }}>
                                Out of Stock
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD, color: 'error.main' }}>
                            {outOfStockProducts}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'primary.lighter'
                    }}>
                        <Typography variant="body1" sx={{ fontWeight: Fonts.BOLD }}>
                            Total Products
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: Fonts.EXTRA_BOLD, color: 'primary.main' }}>
                            {totalProducts}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    // Quick Actions Card with enhanced styling
    const QuickActionsCard = () => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.main}05 100%)`,
                p: 2.5,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="h6" sx={{ fontWeight: Fonts.BOLD }}>
                    Quick Actions
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Manage your store efficiently
                </Typography>
            </Box>
            <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/ecommerce/add-products')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: Fonts.SEMI_BOLD,
                            py: 1.5,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
                            '&:hover': {
                                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                            }
                        }}
                    >
                        Add New Product
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<InventoryIcon />}
                        onClick={() => navigate('/ecommerce/product-listing')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: Fonts.SEMI_BOLD,
                            py: 1.5,
                            borderWidth: 2,
                            '&:hover': {
                                borderWidth: 2,
                                bgcolor: 'primary.lighter',
                                transform: 'translateY(-2px)',
                                boxShadow: 2
                            }
                        }}
                    >
                        Manage Products
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{
            p: { xs: 2, md: 3 },
            background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 100%)',
            minHeight: '100vh'
        }}>
            {/* Header with gradient background */}
            <Box sx={{
                mt: { xs: 2, md: 10 },
                mb: 4,
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '40%',
                    height: '100%',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                    pointerEvents: 'none'
                }
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: Fonts.EXTRA_BOLD,
                            mb: 1,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '1.75rem', md: '2.125rem' }
                        }}
                    >
                        Welcome back, {user?.name || 'Store Owner'}! 👋
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                            fontWeight: Fonts.MEDIUM,
                            maxWidth: 600
                        }}
                    >
                        Here's what's happening with your store today.
                    </Typography>
                </Box>
            </Box>

            {/* Metrics Grid with staggered animation effect */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Products"
                        value={totalProducts}
                        icon={<InventoryIcon />}
                        color={theme.palette.primary.main}
                        subtitle={`${inStockProducts} in stock`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="In Stock"
                        value={inStockProducts}
                        icon={<CheckIcon />}
                        color={theme.palette.success.main}
                        subtitle={`${stockPercentage}% of total`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Out of Stock"
                        value={outOfStockProducts}
                        icon={<CancelIcon />}
                        color={theme.palette.error.main}
                        subtitle="Need restocking"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Avg. Price"
                        value={`₹${averagePrice}`}
                        icon={<MoneyIcon />}
                        color={theme.palette.info.main}
                        subtitle={`Total: ₹${totalValue.toFixed(2)}`}
                    />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} lg={8}>
                    <Stack spacing={3}>
                        <RecentProductsTable />
                        <StoreInfoCard />
                    </Stack>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3} sx={{ height: '100%' }}>
                        <QuickActionsCard />
                        <StockOverview />
                        <Box sx={{ flexGrow: 1 }}>
                            <StoreTimingsCard />
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StoreOwnerDashboard;