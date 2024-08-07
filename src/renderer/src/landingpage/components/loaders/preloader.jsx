import React from 'react'

import LoadingImg from '../../assets/icon.png'
import { useHomeData } from '../../../contexts/HomeDataContext'

function Preloader() {
  const data = useHomeData()
  return (
    <div className={`flex items-center hidden ${data.isPreloaderLoaded ? 'bg-[#0D0121]':'bg-white'} justify-center fixed w-full h-[100vh] z-50`}>
            {data.isPreloaderLoaded && <img src={LoadingImg} className="scale-75"/>}
    </div>
  )
}

export default Preloader