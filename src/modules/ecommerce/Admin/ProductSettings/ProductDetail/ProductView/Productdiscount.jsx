import React from 'react';
import "../../../../styles/radio.css";

const Productdiscount = () => {
  return (
    <div>
      <div className="container">
        <div className="plans">
          <div className="title">Buy More Save More</div>
          <label className="plan basic-plan" htmlFor="basic">
            <input defaultChecked type="radio" name="plan" id="basic" />
            <div className="plan-content">
              {/* <img loading="lazy" src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/life-saver-img.svg" alt="Basic" /> */}
              <div className="plan-details">
                <span>Single</span>
                <p>Standard Price.</p>
                <h2>$259</h2>
              </div>
            </div>
          </label>

          <label className="plan complete-plan" htmlFor="complete">
            <input type="radio" id="complete" name="plan" />
            <div className="plan-content">
              {/* <img loading="lazy" src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/potted-plant-img.svg" alt="Complete" /> */}
              <div className="plan-details">
                <span>Buy 4, get a 2% discount!</span>
                <p> You Save 2%</p>
                <h2>$480</h2>
              </div>
            </div>
          </label>

          <label className="plan premium-plan" htmlFor="premium">
            <input type="radio" id="premium" name="plan" />
            <div className="plan-content">
              {/* <img loading="lazy" src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/your-image-1.svg" alt="Premium" /> */}
              <div className="plan-details">
                <span>Buy 8 , get a 5% discount!</span>
                <p> You Save 2%</p>
                <h2>$1900</h2>

              </div>
            </div>
          </label>

          <label className="plan ultimate-plan" htmlFor="ultimate">
            <input type="radio" id="ultimate" name="plan" />
            <div className="plan-content">
              {/* <img loading="lazy" src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/your-image-2.svg" alt="Ultimate" /> */}
              <div className="plan-details">
                <span>Buy 16 or more, get a 8% discount!</span>
                <p> You Save 7%</p>
                <h2>$3745</h2>

              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Productdiscount;
