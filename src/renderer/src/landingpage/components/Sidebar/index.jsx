import React,{useEffect,useState} from 'react'
import { useTranslation } from 'react-i18next';
import {  useLocation, useNavigate } from 'react-router-dom';
import { useHomeData } from '../../../contexts/HomeDataContext';

function Sidebar({openSidebar,setOpenSidebar}) {
    const { t, i18n } = useTranslation();
    const {pathname} = useLocation()

    const data=useHomeData()

    const [menu,setMenu]=useState([])

    const navigate = useNavigate()

    function goto(){
        if(window.location.href.includes('/?about')){
            data._scrollToSection('about')
        }else if(window.location.href.includes('/?contact')){
            data._scrollToSection('contact')
        }else if(pathname=="/"){
            data._scrollToSection('home')
        }
    }

    useEffect(()=>{
       goto()
    },[])

   
    useEffect(()=>{
        setMenu([
          {name:t('menu.home'),path:'/'},
          {name:t('menu.features'),path:'/?features'},
          {name:t('menu.plans'),path:'/?plans'},
          {name:t('menu.support'),path:'/?support'},
        ])
    },[i18n.language])

  return (
    <div className={`min-w-[300px] ${!openSidebar ? ' translate-x-[100%] ':''} h-[100vh] transition duration-150 ease-in-out bg-white fixed right-0 z-20`}>
           <div onClick={()=>setOpenSidebar(false)} className="bg-[#ff4800] cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 top-3 z-30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
           </div>

          <div className="mt-5 flex flex-col p-12">
            {menu.map(i=>(
                        <a className="hover:text-app_primary-500 mb-3 text-[24px] font-bold cursor-pointer"  onClick={()=>{
                          navigate(i.path)
                          goto()
                          setOpenSidebar(!openSidebar)
                        }}>{i.name}</a>
            ))}
          </div>
    </div>
  )
}

export default Sidebar