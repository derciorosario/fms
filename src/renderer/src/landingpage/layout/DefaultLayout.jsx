import React,{useState} from 'react'
import Header from '../components/header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Preloader from '../components/loaders/preloader'
import { useHomeData } from '../../contexts/HomeDataContext'


function DefaultLayout({children}) { 
  const [openSidebar,setOpenSidebar]=useState(false)
  const [showDownloadPop,setShowDownloadPop]=useState(false)

  const data=useHomeData()

  return (
    <div id={'top'} className="min-h-[100vh]">

          {data.isLoading && <Preloader/>}
          <Sidebar setOpenSidebar={setOpenSidebar} openSidebar={openSidebar}/>
            <div onClick={()=>{
            if(openSidebar)  setOpenSidebar(false)
            }} className={`${openSidebar ? 'p-2 blur-md':''} overflow-hidden w-full transition duration-150 ease-in-out`}>
                <Header setOpenSidebar={setOpenSidebar} openSidebar={openSidebar}/>
                {children}
            </div>
           <Footer/>

    </div>
  )
}

export default DefaultLayout