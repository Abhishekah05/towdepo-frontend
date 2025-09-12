import React, { useState } from 'react';
import './style.header-spaceship-variant-one.css'

// Define the SVG icons as separate components for reuse
const SearchIcon = () => (
    <svg width="20" height="20">
        <path d="M6.6,2c2,0,4.8,0,6.8,0c1,0,2.9,0.8,3.6,2.2C17.7,5.7,17.9,7,18.4,7C20,7,20,8,20,8v1h-1v7.5c0,0.8-0.7,1.5-1.5,1.5h-1 c-0.8,0-1.5-0.7-1.5-1.5V16H5v0.5C5,17.3,4.3,18,3.5,18h-1C1.7,18,1,17.3,1,16.5V16V9H0V8c0,0,0.1-1,1.6-1C2.1,7,2.3,5.7,3,4.2 C3.7,2.8,5.6,2,6.6,2z M13.3,4H6.7c-0.8,0-1.4,0-2,0.7c-0.5,0.6-0.8,1.5-1,2C3.6,7.1,3.5,7.9,3.7,8C4.5,8.4,6.1,9,10,9 c4,0,5.4-0.6,6.3-1c0.2-0.1,0.2-0.8,0-1.2c-0.2-0.4-0.5-1.5-1-2C14.7,4,14.1,4,13.3,4z M4,10c-0.4-0.3-1.5-0.5-2,0 c-0.4,0.4-0.4,1.6,0,2c0.5,0.5,4,0.4,4,0C6,11.2,4.5,10.3,4,10z M14,12c0,0.4,3.5,0.5,4,0c0.4-0.4,0.4-1.6,0-2c-0.5-0.5-1.3-0.3-2,0 C15.5,10.2,14,11.3,14,12z"></path>
    </svg>
);

const SubmitIcon = () => (
    <svg width="20" height="20">
        <path d="M19.2,17.8c0,0-0.2,0.5-0.5,0.8c-0.4,0.4-0.9,0.6-0.9,0.6s-0.9,0.7-2.8-1.6c-1.1-1.4-2.2-2.8-3.1-3.9C10.9,14.5,9.5,15,8,15 c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7c0,1.5-0.5,2.9-1.3,4c1.1,0.8,2.5,2,4,3.1C20,16.8,19.2,17.8,19.2,17.8z M8,3C5.2,3,3,5.2,3,8 c0,2.8,2.2,5,5,5c2.8,0,5-2.2,5-5C13,5.2,10.8,3,8,3z"></path>
    </svg>
);

const ProductItem = ({ imageSrc, name, rating, reviews, price }) => (
    <a className="suggestions__item suggestions__product" href="">
        <div className="suggestions__product-image image image--type--product">
            <div className="image__body">
                <img className="image__tag" src={imageSrc} alt={name} />
            </div>
        </div>
        <div className="suggestions__product-info">
            <div className="suggestions__product-name">{name}</div>
            <div className="suggestions__product-rating">
                <div className="suggestions__product-rating-stars">
                    <div className="rating">
                        <div className="rating__body">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`rating__star ${i < rating ? 'rating__star--active' : ''}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="suggestions__product-rating-label">{`${rating} on ${reviews} reviews`}</div>
            </div>
        </div>
        <div className="suggestions__product-price">{price}</div>
    </a>
);

const CategoryItem = ({ name }) => (
    <a className="suggestions__item suggestions__category" href="">
        {name}
    </a>
);

const VehiclePicker = () => (
    <div className="search__dropdown search__dropdown--vehicle-picker vehicle-picker">
        <div className="search__dropdown-arrow"></div>
        <div className="vehicle-picker__panel vehicle-picker__panel--list vehicle-picker__panel--active" data-panel="list">
            <div className="vehicle-picker__panel-body">
                <div className="vehicle-picker__text">Select a vehicle to find exact fit parts</div>
                <div className="vehicles-list">
                    <div className="vehicles-list__body">
                        {['2011 Ford Focus S', '2019 Audi Q7 Premium'].map((vehicle, index) => (
                            <label key={index} className="vehicles-list__item">
                                <span className="vehicles-list__item-radio input-radio">
                                    <span className="input-radio__body">
                                        <input className="input-radio__input" name="header-vehicle" type="radio" />
                                        <span className="input-radio__circle"></span>
                                    </span>
                                </span>
                                <span className="vehicles-list__item-info">
                                    <span className="vehicles-list__item-name">{vehicle}</span>
                                    <span className="vehicles-list__item-details">Engine details</span>
                                </span>
                                <button type="button" className="vehicles-list__item-remove">
                                    <svg width="16" height="16">
                                        <path d="M2,4V2h3V1h6v1h3v2H2z M13,13c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V5h10V13z"></path>
                                    </svg>
                                </button>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="vehicle-picker__actions">
                    <button type="button" className="btn btn-primary btn-sm" data-to-panel="form">
                        Add A Vehicle
                    </button>
                </div>
            </div>
        </div>
        <div className="vehicle-picker__panel vehicle-picker__panel--form" data-panel="form">
            <div className="vehicle-picker__panel-body">
                <div className="vehicle-form vehicle-form--layout--search">
                    {['Year', 'Brand', 'Model', 'Engine'].map((label, index) => (
                        <div key={index} className="vehicle-form__item vehicle-form__item--select">
                            <select className="form-control form-control-select2">
                                <option value="none">Select {label}</option>
                                {/* Options here */}
                            </select>
                        </div>
                    ))}
                    <div className="vehicle-form__divider">Or</div>
                    <div className="vehicle-form__item">
                        <input type="text" className="form-control" placeholder="Enter VIN number" aria-label="VIN number" />
                    </div>
                </div>
                <div className="vehicle-picker__actions">
                    <div className="search__car-selector-link">
                        <a href="" data-to-panel="list">Back to vehicles list</a>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" disabled="disabled">
                        Add A Vehicle
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const HeaderSearch = () => (
    <div className="header__search">
        <div className="search">
            <div className="search__dropdown">
                <VehiclePicker />
            </div>
            <div className="search__input">
                <input type="text" className="form-control" placeholder="Search for products" />
                <button type="button" className="search__input-button">
                    <SearchIcon />
                </button>
                <button type="button" className="search__input-button">
                    <SubmitIcon />
                </button>
            </div>
        </div>
    </div>
);

const Header = () => {
    const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    return (
        <header className="site__header">
            <div className="header">
                <div className="header__megamenu-area megamenu-area"></div>

                <div className="header__topbar-start-bg"></div>

                <div className="header__topbar-start">
                    <div className="topbar topbar--spaceship-start">
                        <div className="topbar__item-text d-none d-xxl-flex">
                            Call Us: (800) 060-0730
                        </div>
                        <div className="topbar__item-text">
                            <a className="topbar__link" href="about-us.html">About Us</a>
                        </div>
                        <div className="topbar__item-text">
                            <a className="topbar__link" href="contact-us-v1.html">Contacts</a>
                        </div>
                        <div className="topbar__item-text">
                            <a className="topbar__link" href="track-order.html">Track Order</a>
                        </div>
                    </div>
                </div>

                <div className="header__topbar-end-bg"></div>
                <div className="header__topbar-end">
                    <div className="topbar topbar--spaceship-end">
                        <div className="topbar__item-button">
                            <a href="" className="topbar__button">
                                <span className="topbar__button-label">Compare:</span>
                                <span className="topbar__button-title">5</span>
                            </a>
                        </div>
                        <div className="topbar__item-button topbar__menu">
                            <button
                                className="topbar__button topbar__button--has-arrow topbar__menu-button"
                                type="button"
                                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                            >
                                <span className="topbar__button-label">Currency:</span>
                                <span className="topbar__button-title">USD</span>
                                <span className="topbar__button-arrow">
                                    <svg width="7px" height="5px">
                                        <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z" />
                                    </svg>
                                </span>
                            </button>
                            {currencyMenuOpen && (
                                <div className="topbar__menu-body">
                                    <a className="topbar__menu-item" href="#">€ Euro</a>
                                    <a className="topbar__menu-item" href="#">£ Pound Sterling</a>
                                    <a className="topbar__menu-item" href="#">$ US Dollar</a>
                                    <a className="topbar__menu-item" href="#">₽ Russian Ruble</a>
                                </div>
                            )}
                        </div>
                        <div className="topbar__menu">
                            <button
                                className="topbar__button topbar__button--has-arrow topbar__menu-button"
                                type="button"
                                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                            >
                                <span className="topbar__button-label">Language:</span>
                                <span className="topbar__button-title">EN</span>
                                <span className="topbar__button-arrow">
                                    <svg width="7px" height="5px">
                                        <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z" />
                                    </svg>
                                </span>
                            </button>
                            {languageMenuOpen && (
                                <div className="topbar__menu-body">
                                    <a className="topbar__menu-item" href="#">
                                        <img src="images/languages/language-1.png" alt="" />
                                        <span>English</span>
                                    </a>
                                    <a className="topbar__menu-item" href="#">
                                        <img src="images/languages/language-2.png" alt="" />
                                        <span>French</span>
                                    </a>
                                    <a className="topbar__menu-item" href="#">
                                        <img src="images/languages/language-3.png" alt="" />
                                        <span>German</span>
                                    </a>
                                    <a className="topbar__menu-item" href="#">
                                        <img src="images/languages/language-4.png" alt="" />
                                        <span>Russian</span>
                                    </a>
                                    <a className="topbar__menu-item" href="#">
                                        <img src="images/languages/language-5.png" alt="" />
                                        <span>Italian</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="header__navbar">
                                {/* TODO  */}
                </div>
                <div className="header__logo">
      <a href="index.html" className="logo">
        <div className="logo__slogan">Auto parts for Cars, trucks and motorcycles</div>
        <div className="logo__image">
          {/* logo */}
          <svg width="168" height="26">
            <path 
              className="logo__part-primary" 
              d="M50,26h-5c-1.1,0-2-0.9-2-2V2c0-1.1,0.9-2,2-2h5c6.6,0,12,5.4,12,12v2C62,20.6,56.6,26,50,26z M57,12
              c0-3.9-3.1-7-7-7h-0.8C48.5,5,48,5.5,48,6.2v13.6c0,0.7,0.5,1.2,1.2,1.2H50c3.9,0,7-3.1,7-7V12z M38.5,26h-13h-2
              c-0.8,0-1.5-0.7-1.5-1.5v-2v-9v-2v-8v-2C22,0.7,22.7,0,23.5,0h2h13C39.3,0,40,0.7,40,1.5v2C40,4.3,39.3,5,38.5,5H27v5h9.5
              c0.8,0,1.5,0.7,1.5,1.5v2c0,0.8-0.7,1.5-1.5,1.5H27v6h11.5c0.8,0,1.5,0.7,1.5,1.5v2C40,25.3,39.3,26,38.5,26z M18.8,23.8
              c0.6,1-0.1,2.3-1.3,2.3h-2.3c-0.5,0-1-0.3-1.3-0.8L9.7,18H5v6.5C5,25.3,4.3,26,3.5,26h-2C0.7,26,0,25.3,0,24.5v-23
              C0,0.7,0.7,0,1.5,0H10c5,0,9,4,9,9c0,3.2-1.7,6.1-4.3,7.7L18.8,23.8z M10,5H6C5.5,5,5,5.4,5,6v6c0,0.6,0.4,1,1,1h4c2.2,0,4-1.8,4-4
              S12.2,5,10,5z" 
            />
            <path 
              className="logo__part-secondary" 
              d="M166.5,8h-2.3c-0.6,0-1.1-0.4-1.4-1c-0.5-1.2-2-2-3.8-2c-2.2,0-4,1.3-4,3c0,0.9,0.6,1.8,1.5,2.3
              c0.2,0.1,0.5,0.3,0.7,0.4c0.9,0.3,1.2,1.3,0.7,2.1l-1,1.7c-0.4,0.7-1.2,0.9-1.9,0.6c-1.2-0.5-2.3-1.3-3.1-2.2c-1.2-1.4-2-3.1-2-5
              c0-4.4,4-8,9-8c4.3,0,8,2.6,8.9,6.2C168.2,7.1,167.4,8,166.5,8z M151.5,18h2.3c0.6,0,1.1,0.4,1.4,1c0.5,1.2,2,2,3.8,2
              c2.2,0,4-1.3,4-3c0-0.9-0.6-1.8-1.5-2.3c-0.2-0.1-0.5-0.3-0.7-0.4c-0.9-0.3-1.2-1.3-0.7-2.1l1-1.7c0.4-0.6,1.2-0.9,1.9-0.6
              c1.2,0.5,2.3,1.3,3.1,2.2c1.2,1.4,2,3.1,2,5c0,4.4-4,8-9,8c-4.3,0-8-2.6-8.9-6.2C149.8,18.9,150.6,18,151.5,18z M146.5,5H140v19.5
              c0,0.8-0.7,1.5-1.5,1.5h-2c-0.8,0-1.5-0.7-1.5-1.5V5h-6.5c-0.8,0-1.5-0.7-1.5-1.5v-2c0-0.8,0.7-1.5,1.5-1.5h18
              c0.8,0,1.5,0.7,1.5,1.5v2C148,4.3,147.3,5,146.5,5z M125.8,23.8c0.6,1-0.2,2.3-1.3,2.3h-2.3c-0.5,0-1-0.3-1.3-0.8l-4.2-7.3H112v6.5
              c0,0.8-0.7,1.5-1.5,1.5h-2c-0.8,0-1.5-0.7-1.5-1.5v-23c0-0.8,0.7-1.5,1.5-1.5h8.5c5,0,9,4,9,9c0,3.2-1.7,6.1-4.3,7.7L125.8,23.8z
              M117,5h-4c-0.5,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h4c2.2,0,4-1.8,4-4S119.2,5,117,5z M103.8,26h-2.3c-0.7,0-1.4-0.4-1.6-1.1l-2.4-6.7
              c0-0.1-0.1-0.1-0.2-0.1h-7.5c-0.1,0-0.2,0.1-0.2,0.1l-2.4,6.7c-0.2,0.7-0.9,1.1-1.6,1.1h-2.3c-0.8,0-1.4-0.8-1.1-1.6l8.3-23.3
              C90.7,0.4,91.3,0,92,0H95c0.7,0,1.4,0.4,1.6,1.1l8.3,23.3C105.2,25.2,104.6,26,103.8,26z M95.5,12.7l-1.8-4.9
              c-0.1-0.2-0.3-0.2-0.4,0l-1.8,4.9c0,0.1,0.1,0.3,0.2,0.3h3.5C95.4,13,95.5,12.9,95.5,12.7z M83.9,10.2c0,0.2-0.1,0.4-0.1,0.6
              c0,0.2-0.1,0.4-0.1,0.6c-0.1,0.5-0.3,1.1-0.6,1.6c-0.1,0.1-0.1,0.3-0.2,0.4c-0.1,0.1-0.1,0.2-0.2,0.4c-0.2,0.4-0.5,0.7-0.8,1.1
              c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.1-0.2,0.2-0.3,0.3c-0.5,0.5-1.1,0.9-1.7,1.3c-1.4,0.8-3,1.3-4.7,1.3h-5v6.5c0,0.8-0.7,1.5-1.5,1.5
              h-2c-0.8,0-1.5-0.7-1.5-1.5v-23C65,0.7,65.7,0,66.5,0H75c1.7,0,3.3,0.5,4.7,1.3c0.6,0.4,1.2,0.8,1.7,1.3c0.1,0.1,0.2,0.2,0.3,0.3
              c0.1,0.1,0.2,0.2,0.3,0.3c0.3,0.3,0.5,0.7,0.8,1.1c0.1,0.1,0.1,0.2,0.2,0.3C83,4.8,83.1,5,83.1,5.1c0.2,0.5,0.4,1,0.6,1.6
              c0,0.2,0.1,0.4,0.1,0.6c0,0.2,0.1,0.4,0.1,0.6C83.9,8,84,8.2,84,8.4c0,0.2,0,0.4,0,0.6s0,0.4,0,0.6C84,9.8,83.9,10,83.9,10.2z M75,5
              h-4c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h4c2.2,0,4-1.8,4-4S77.2,5,75,5z" 
            />
          </svg>
          {/* logo / end */}
        </div>
      </a>
    </div>

    <HeaderSearch />

            </div>
            {/* End Part  */}
        </header>
    );
};

export default Header;
