import React, { useState } from "react";
import { Box, Popover, Typography, Divider } from "@mui/material";
import logo from "../../../public/assets/paviimages/Logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLayoutActionsContext } from "@crema/context/AppContextProvider/LayoutContextProvider";
import Dropcart from "./dropCart";
import { useAuthUser } from "@crema/hooks/AuthHooks";

const MobileHeader = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { setOpenMobileMenu } = useLayoutActionsContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "mobile-cart-popover" : undefined;

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCart = () => setAnchorEl(null);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate("/my-profile");
    } else {
      localStorage.setItem("intendedDestination", "/my-profile");
      navigate("/signin", {
        search: `?redirect=${encodeURIComponent("/my-profile")}`,
      });
    }
  };

  const handleOrdersClick = () => {
    if (isAuthenticated) {
      navigate("/ecommerce/orders");
    } else {
      localStorage.setItem("intendedDestination", "/ecommerce/orders");
      navigate("/signin", {
        search: `?redirect=${encodeURIComponent("/ecommerce/orders")}`,
      });
    }
  };

  return (
    <header className="site__mobile-header">
      <div className="mobile-header">
        <div className="container">
          <div className="mobile-header__body">
            <button
              className="mobile-header__menu-button"
              type="button"
              onClick={() => setOpenMobileMenu(true)}

            >
              <svg width="18px" height="14px">
                <path d="M-0,8L-0,6L18,6L18,8L-0,8ZM-0,-0L18,-0L18,2L-0,2L-0,-0ZM14,14L-0,14L-0,12L14,12L14,14Z"></path>
              </svg>
            </button>

            <a className="mobile-header__logo" href="/home">
              <img width={220} height={30} src={logo} alt="QT Wholesales logo" />
            </a>

            <div className="mobile-header__indicators">
              {/* Account (guarded) */}
              <div className="mobile-indicator">
                <button
                  className="mobile-indicator__button"
                  onClick={handleAccountClick}
                >
                  <span className="mobile-indicator__icon">
                    <svg width="20" height="20">
                      <path d="M20,20h-2c0-4.4-3.6-8-8-8s-8,3.6-8,8H0c0-4.2,2.6-7.8,6.3-9.3C4.9,9.6,4,7.9,4,6c0-3.3,2.7-6,6-6s6,2.7,6,6 c0,1.9-0.9,3.6-2.3,4.7C17.4,12.2,20,15.8,20,20z M14,6c0-2.2-1.8-4-4-4S6,3.8,6,6s1.8,4,4,4S14,8.2,14,6z"></path>
                    </svg>
                  </span>
                </button>
              </div>

              {/* Wishlist (public link) */}
              <div className="mobile-indicator">
                <button
                  className="mobile-indicator__button"
                  onClick={() => navigate("/wishlist")}
                >
                  <span className="mobile-indicator__icon">
                    <svg width="20" height="20">
                      <path d="M14,3c2.2,0,4,1.8,4,4c0,4-5.2,10-8,10S2,11,2,7c0-2.2,1.8-4,4-4c1,0,1.9,0.4,2.7,1L10,5.2L11.3,4C12.1,3.4,13,3,14,3 M14,1 c-1.5,0-2.9,0.6-4,1.5C8.9,1.6,7.5,1,6,1C2.7,1,0,3.7,0,7c0,5,6,12,10,12s10-7,10-12C20,3.7,17.3,1,14,1L14,1z"></path>
                    </svg>
                  </span>
                </button>
              </div>

              {/* Cart (opens dropcart) - Fixed icon visibility */}
              <div className="mobile-indicator" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                <button
                  className="mobile-indicator__button"
                  onClick={handleCartClick}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <span className="mobile-indicator__icon" style={{ display: 'flex' }}>
                    <svg 
                      width="22" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      style={{ display: 'block' }}
                    >
                      <circle cx="7" cy="17" r="2"></circle>
                      <circle cx="15" cy="17" r="2"></circle>
                      <path d="M20,4.4V5l-1.8,6.3c-0.1,0.4-0.5,0.7-1,0.7H6.7c-0.4,0-0.8-0.3-1-0.7L3.3,3.9C3.1,3.3,2.6,3,2.1,3H0.4C0.2,3,0,2.8,0,2.6 V1.4C0,1.2,0.2,1,0.4,1h2.5c1,0,1.8,0.6,2.1,1.6L5.1,3l2.3,6.8c0,0.1,0.2,0.2,0.3,0.2h8.6c0.1,0,0.3-0.1,0.3-0.2l1.3-4.4 C17.9,5.2,17.7,5,17.5,5H9.4C9.2,5,9,4.8,9,4.6V3.4C9,3.2,9.2,3,9.4,3h9.2C19.4,3,20,3.6,20,4.4z"></path>
                    </svg>
                    <span 
                      className="mobile-indicator__counter"
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      {cartItems ? cartItems.length : 0}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropcart popover for mobile */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseCart}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          '& .MuiPopover-paper': {
            width: '100%',
            maxWidth: '360px'
          }
        }}
      >
        <Typography sx={{ p: 2, backgroundColor: "#f1f1f1", fontWeight: 'bold' }}>
          Shopping Cart
        </Typography>
        <Divider />
        <Dropcart />
      </Popover>
    </header>
  );
};

export default MobileHeader;