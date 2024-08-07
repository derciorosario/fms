import React, { useEffect, useState } from 'react'
import Logo from '../../assets/icon.png'
import MainLogo from '../../assets/main-logo.png'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHomeData } from '../../../contexts/HomeDataContext';


function Header({setOpenSidebar,openSidebar}) {

const {pathname} = useLocation()
const navigate = useNavigate()
const [hw,setHeaderWhite]=useState(false)

const [lang,setLang]=useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt')

const { t, i18n } = useTranslation();

const changeLanguage = (lng) => {
   i18n.changeLanguage(lng);
   setLang(lng)
   localStorage.setItem('lang',lng)
};



const data=useHomeData()

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
  if(pathname=="/") {
      setHeaderWhite(data.scrollY > 90)
  }else{
      setHeaderWhite(true)
  }
},[data.scrollY])




const [menu,setMenu]=useState([])

useEffect(()=>{

  setMenu([
      {name:t('menu.home'),path:'/'},
      {name:t('menu.features'),path:'/?features'},
      {name:t('menu.plans'),path:'/?plans'},
      {name:t('menu.support'),path:'/?support'},
   ])

},[lang])

const [openLangDialog,setOpenLangDialog]=useState(false)

const handleOutsideClick = (event) => {
  if (!event.target.closest(`_lang`)) {
      document.removeEventListener('click', handleOutsideClick)
  }
};

  return (
    <div>
        <header className={`bg-[#ff7626] ${hw && pathname=="/"  ? 'translate-y-[-100%]':''} transition-all duration- ease-in  fixed w-full`}>
             <nav className={`flex items-center justify-between px-[40px] py-3`}>
                  <a className="flex cursor-pointer items-center" onClick={()=>navigate('/')}><img src={Logo} className="h-[30px] mr-2"/><span className="text-white font-bold text-[18px]">ProConta</span></a>
                  <div className={`flex items-center max-md:hidden`}>
                       {menu.map((i,_i)=>(
                             <a key={_i} className={` text-white opacity-70 hover:opacity-100 cursor-pointer text-[18px] mx-3`} onClick={()=>{
                                navigate(i.path)
                                goto()
                             }}>{i.name}</a>
                       ))}
                  </div>
                  <div className="flex items-center">
                  <div className="flex mr-4 items-center relative cursor-pointer  _lang">
                        <div className="flex items-center _lang" onClick={()=>{
                                    setOpenLangDialog(!openLangDialog)
                                    document.addEventListener('click', handleOutsideClick)
                        }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className="hidden" fill={'#fff'}><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>
                                <span className={`ml-1 text-white`}>{lang == 'pt' ? 'PT': 'EN'}</span>
                                <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill={'#fff'}><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>
                    
                        </div>
                        <div onClick={()=>{
                            setOpenLangDialog(false)
                            changeLanguage(lang != 'pt' ? 'pt': 'en')
                        }} className={`bg-white shadow border _lang absolute ${!openLangDialog ? ' hidden' :''} hover:text-app_primary-400 rounded-[0.3rem] p-2 w-full top-[100%] translate-y-[5px]`}>
                                <span>{lang != 'pt' ? 'PT': 'EN'}</span>
                        </div>

                        </div>

                        <span className="text-white hidden flex mr-4 font-semibold cursor-pointer hover:underline">{t('common.login')}</span>  
                       

                        <span onClick={()=>{
                            navigate('/login')
                        }} className="text-gray-700  max-sm:hidden text-[16px] min-w-[100px] flex justify-center px-5 py-3 rounded-full bg-white  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                            {t('common.login')}
                          </span>
                         
                        <div onClick={()=>setOpenSidebar(!openSidebar)} className="hidden max-md:flex ml-3 cursor-pointer hover:opacity-80">
                           <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" fill={'#fff'}><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                         </div>

                  </div>
              </nav>
        </header>
    </div>
  )
}

export default Header