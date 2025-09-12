import React, { useEffect, useState } from 'react';
import { IconButton, Popover, Typography, List, ListItem, Divider, Button, Avatar, Badge } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';


import { useSelector, useDispatch } from 'react-redux';

 
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { Link } from 'react-router-dom';


const BasketButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);

  
    const cartItems = useSelector((state) => state.cart);

    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        dispatch(getCartItems());
      }, [dispatch]);
      

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <IconButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{ position: 'relative' }}
            >
                <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingBasketIcon />
                </Badge>


            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>Cart Items</Typography>
                <Divider />
                <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <ListItem key={index}>
                                <Typography variant="body2">
                                    <Avatar sx={{ mr: 3.5 }} src={`${mediaUrl}/product/${item.product?.images[0].src || data?.image}`} />
                                </Typography>
                                <Typography variant="body2">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2">
                                    / {JSON.stringify(item.count)}
                                </Typography>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <Typography variant="body2">Your cart is empty.</Typography>
                        </ListItem>
                    )}
                </List>
                <Link to="ecommerce/checkout" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="error" fullWidth>
                        Checkout
                    </Button>
                </Link>
            </Popover>
        </>
    );
};

export default BasketButton;
