import React from 'react';
import SlideItem from './SlideItem';
import AppCard from '@crema/components/AppCard';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import MediaSlider from './MediaSlider';


const PromoCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const slides = [
        {
            id: 1,
            title: '50% Off For Your First Shopping',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.',
            buttonText: 'Shop Now',
            image: '/path/to/your/image1.png', // Replace with your image path
        },
        {
            id: 2,
            title: 'Special Offer on Tyres',
            description: 'Get the best deals on tyres today. Hurry, offer ends soon!',
            buttonText: 'Explore Now',
            image: '/path/to/your/image2.png', // Replace with your image path
        },
    ];

    return (
        <div className="promo-carousel">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="promo-slide">
                        <div className="promo-content">
                            <h2>{slide.title}</h2>
                            <p>{slide.description}</p>
                            <button>{slide.buttonText}</button>
                        </div>
                        <div className="promo-image">
                            <img src={slide.image} alt={slide.title} />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PromoCarousel;
