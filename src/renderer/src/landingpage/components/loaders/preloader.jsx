import React from 'react'
import Logo from '../../assets/icon-2.png'
import { useHomeData } from '../../../contexts/HomeDataContext'

function Preloader() {
  const data=useHomeData()
  return (
    <div className={`flex items-center  bg-[#fff] justify-center fixed w-full h-[100vh] z-50`}>

       
          <div className="relative logo-loader h-[45px]">
              <span style={{height:`${80 - (data.imagesLoadedItems.length / data.imageUrls.length * 100)}%`,display:data.imagesLoadedItems.length>=data.imageUrls.length ? 'none':'flex'}} className="flex absolute top-0 left-0 w-[45px] bg-[rgba(255,255,255,0.7)]"></span>
              <img className="w-[45px]" src={Logo}/>
          </div>
        
       
          <svg width="160px" style={{transform:'translateX(20%)',display:'none'}} version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
          <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite"
              begin="0.1"/>    
          </circle>
          <circle fill="#fff" stroke="none" cx="26" cy="50" r="6">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite" 
              begin="0.2"/>       
          </circle>
          <circle fill="#fff" stroke="none" cx="46" cy="50" r="6">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite" 
              begin="0.3"/>     
          </circle>
        </svg>




    </div>
  )
}

export default Preloader