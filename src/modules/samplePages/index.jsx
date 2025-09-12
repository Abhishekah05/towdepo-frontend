import React, { useState } from "react";
import { HeaderIndicators } from "./HeaderIndicators";
import "./style.header-spaceship-variant-one.css";
import "./mobile.css"
// import logo from "../../assets/pavimages/QT2.png";
import logo from "../../../public/assets/paviimages/Logo.png";

import MobileHeader from "./MobileHeader";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { styled } from '@mui/material/styles';
import { color } from "@mui/system";



const Header = () => {

  const [mobileView, setMobileView] = useState(false);

  useState(() => { }, [mobileView])
  const handleMobileMenu = (status) => {
    console.log("clicked", status);
    setMobileView(status)
  }
  return (
    <>



      <MobileHeader handleMobileMenu={handleMobileMenu} />
      <header className="site__header">
        <div className="header">
          <div className="header__megamenu-area megamenu-area"></div>
          <div className="header__topbar-start-bg"></div>
          <div className="header__topbar-start">
            <div className="topbar topbar--spaceship-start">
              <div
                style={{
                  color: "white", // Set text color to white
                  display: "flex", // Use flexbox for alignment
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  height: "100%", // Ensure the div takes up full height (optional, depends on the parent container)
                }}
              >
                Call Us: (619) 982-0777
              </div>



            </div>
          </div>
          <div className="header__topbar-end-bg"></div>
          <div className="header__topbar-end">
            <div className="topbar topbar--spaceship-end">

              <div className="topbar__item-button topbar__menu">
                <button
                  className="topbar__button topbar__button--has-arrow topbar__menu-button"
                  type="button"
                >
                  <span className="topbar__button-label">Currency:</span>
                  <span className="topbar__button-title">USD</span>
                  <span className="topbar__button-arrow">
                    <svg
                      width="7px"
                      height="5px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z"></path>
                    </svg>
                  </span>
                </button>
                <div className="topbar__menu-body">
                  <a className="topbar__menu-item" href="#">
                    € Euro
                  </a>
                  <a className="topbar__menu-item" href="#">
                    £ Pound Sterling
                  </a>
                  <a className="topbar__menu-item" href="#">
                    $ US Dollar
                  </a>
                  <a className="topbar__menu-item" href="#">
                    ₽ Russian Ruble
                  </a>
                </div>
              </div>
              <div className="topbar__menu">
                <button
                  className="topbar__button topbar__button--has-arrow topbar__menu-button"
                  type="button"
                >
                  <span className="topbar__button-label">Language:</span>
                  <span className="topbar__button-title">EN</span>
                  <span className="topbar__button-arrow">
                    <svg
                      width="7px"
                      height="5px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z"></path>
                    </svg>
                  </span>
                </button>
                <div className="topbar__menu-body">
                  <a className="topbar__menu-item" href="#">
                    <img src="images/languages/language-1.png" alt="English" />
                    <span>English</span>
                  </a>
                  <a className="topbar__menu-item" href="#">
                    <img src="images/languages/language-2.png" alt="French" />
                    <span>French</span>
                  </a>
                  <a className="topbar__menu-item" href="#">
                    <img src="images/languages/language-3.png" alt="German" />
                    <span>German</span>
                  </a>
                  <a className="topbar__menu-item" href="#">
                    <img src="images/languages/language-4.png" alt="Russian" />
                    <span>Russian</span>
                  </a>
                  <a className="topbar__menu-item" href="#">
                    <img src="images/languages/language-5.png" alt="Italian" />
                    <span>Italian</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="header__logo">
            <a href="#" className="logo">
              <div className="logo__slogan"   >Truck Tyres  Uniform Shirts</div>
              <div className="logo__image">


                <img
                  width={240}
                  height={30}
                  src={logo}
                  alt="QT Wholesales logo"
                />
              </div>
            </a>
          </div>
          <HeaderIndicators />

          <div className="header__navbar">
            <div className="header__navbar-menu">
              <div className="main-menu">
                <ul className="main-menu__list">
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/home" className="main-menu__link">
                      Home
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="ecommerce/products" className="main-menu__link">
                      All Products
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/about" className="main-menu__link">
                      About Us
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/contactus" className="main-menu__link">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileView} mobileView />
    </>

  );
};

export default Header;







