// src/FullPageSlider.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from '../../assets/images/clients/1.webp'
import Img2 from '../../assets/images/clients/2.webp'

const ClientsSlider = ({autoplaySpeed,slidesToShow}) => {

  
  const settings = {
      dots: false,
      infinite: true,
      speed: 400,
      slidesToShow: slidesToShow ? slidesToShow : 4,
      slidesToScroll: 1,
      autoplay: true, 
      autoplaySpeed,
      arrows: false,
      cssEase: 'linear',
   
  };
  

  return (
    <div className="mt-3">
        <Slider {...settings}>
      {[
          Img1,
          Img2,
          Img1,
          Img2
      ].map((i,_i)=>(
                   <div className="h-[150px] px-2">
                        <div className=" bg-white rounded-[0.4rem] w-full h-full flex items-center justify-center"> 
                            <img src={i}/>
                        </div>
                   </div>
     ))}
    </Slider>
    </div>
  );
};

export default ClientsSlider;
