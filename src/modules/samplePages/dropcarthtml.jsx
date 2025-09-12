import React from 'react';

const Dropcart = () => {
  return (
    <div className="dropcart">
      <ul className="dropcart__list">
        <li className="dropcart__item">
          <div className="dropcart__item-image image image--type--product">
            <a className="image__body" href="product-full.html">
              <img
                className="image__tag"
                src="images/products/product-4-70x70.jpg"
                alt=""
              />
            </a>
          </div>
          <div className="dropcart__item-info">
            <div className="dropcart__item-name">
              <a href="product-full.html">Glossy Gray 19" Aluminium Wheel AR-19</a>
            </div>
            <ul className="dropcart__item-features">
              <li>Color: Yellow</li>
              <li>Material: Aluminium</li>
            </ul>
            <div className="dropcart__item-meta">
              <div className="dropcart__item-quantity">2</div>
              <div className="dropcart__item-price">$699.00</div>
            </div>
          </div>
          <button type="button" className="dropcart__item-remove">
            <svg width="10" height="10">
              <path d="M8.8,8.8L8.8,8.8c-0.4,0.4-1,0.4-1.4,0L5,6.4L2.6,8.8c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L3.6,5L1.2,2.6c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L5,3.6l2.4-2.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L6.4,5l2.4,2.4C9.2,7.8,9.2,8.4,8.8,8.8z"></path>
            </svg>
          </button>
        </li>
        <li className="dropcart__divider" role="presentation"></li>
        <li className="dropcart__item">
          <div className="dropcart__item-image image image--type--product">
            <a className="image__body" href="product-full.html">
              <img
                className="image__tag"
                src="images/products/product-2-70x70.jpg"
                alt=""
              />
            </a>
          </div>
          <div className="dropcart__item-info">
            <div className="dropcart__item-name">
              <a href="product-full.html">Brandix Brake Kit BDX-750Z370-S</a>
            </div>
            <div className="dropcart__item-meta">
              <div className="dropcart__item-quantity">1</div>
              <div className="dropcart__item-price">$849.00</div>
            </div>
          </div>
          <button type="button" className="dropcart__item-remove">
            <svg width="10" height="10">
              <path d="M8.8,8.8L8.8,8.8c-0.4,0.4-1,0.4-1.4,0L5,6.4L2.6,8.8c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L3.6,5L1.2,2.6c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L5,3.6l2.4-2.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L6.4,5l2.4,2.4C9.2,7.8,9.2,8.4,8.8,8.8z"></path>
            </svg>
          </button>
        </li>
        <li className="dropcart__divider" role="presentation"></li>
        <li className="dropcart__item">
          <div className="dropcart__item-image image image--type--product">
            <a className="image__body" href="product-full.html">
              <img
                className="image__tag"
                src="images/products/product-5-70x70.jpg"
                alt=""
              />
            </a>
          </div>
          <div className="dropcart__item-info">
            <div className="dropcart__item-name">
              <a href="product-full.html">Twin Exhaust Pipe From Brandix Z54</a>
            </div>
            <ul className="dropcart__item-features">
              <li>Color: True Red</li>
            </ul>
            <div className="dropcart__item-meta">
              <div className="dropcart__item-quantity">3</div>
              <div className="dropcart__item-price">$1210.00</div>
            </div>
          </div>
          <button type="button" className="dropcart__item-remove">
            <svg width="10" height="10">
              <path d="M8.8,8.8L8.8,8.8c-0.4,0.4-1,0.4-1.4,0L5,6.4L2.6,8.8c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L3.6,5L1.2,2.6c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L5,3.6l2.4-2.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L6.4,5l2.4,2.4C9.2,7.8,9.2,8.4,8.8,8.8z"></path>
            </svg>
          </button>
        </li>
        <li className="dropcart__divider" role="presentation"></li>
      </ul>
      <div className="dropcart__totals">
        <table>
          <tbody>
            <tr>
              <th>Subtotal</th>
              <td>$5877.00</td>
            </tr>
            <tr>
              <th>Shipping</th>
              <td>$25.00</td>
            </tr>
            <tr>
              <th>Tax</th>
              <td>$0.00</td>
            </tr>
            <tr>
              <th>Total</th>
              <td>$5902.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="dropcart__actions">
        <a href="cart.html" className="btn btn-secondary">
          View Cart
        </a>
        <a href="checkout.html" className="btn btn-primary">
          Checkout
        </a>
      </div>
    </div>
  );
};

export default Dropcart;
