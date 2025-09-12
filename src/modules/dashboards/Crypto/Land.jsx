import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'react-slick'; // Make sure to install 'react-slick' and its dependencies
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const Article = ({ data }) => {
  const { image, title, subtitle } = data;
  return (
    <figure className="snip1584">
      <img src={image} alt={title} />
      <figcaption>
        <h3>{title}</h3>
        <h5>{subtitle}</h5>
      </figcaption>
      <a href="#"></a>
    </figure>
  );
};

export default  News = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const newsTemplate = data.length > 0 ? data.map((item, index) => (
    <div key={index}>
      <Article data={item} />
    </div>
  )) : <p>Please add some cards</p>;

  return (
    <div className='news'>
      <Slider {...settings}>
        {newsTemplate}
      </Slider>
      <strong className={`news__count ${data.length > 0 ? '' : 'none'}`}>
        Total cards: {data.length}
      </strong>
    </div>
  );
};


