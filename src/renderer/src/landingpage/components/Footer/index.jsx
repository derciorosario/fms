import React,{useEffect,useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLogo from '../../assets/main-logo.png'
import Logo from '../../assets/icon.png'
import Logo2 from '../../assets/icon-2.png'

function Footer() {

   const { t, i18n } = useTranslation();
   const {pathname} =useLocation()
   const navigate= useNavigate()

   const [wf,setWhiteFooter]=useState(false)

   useEffect(()=>{

     //setWhiteFooter(pathname!="/")
    // setWhiteFooter(false)

   },[pathname])

  

  return (
    <div className={`bg-[#111]  border-t-[rgba(255,255,255,0.2)]`} id="contact">

        <div className="lg:[&>_div]:w-[25%] max-lg:[&>_div]:mb-10 [&>_div]:cursor-pointer lg:flex px-10 py-14">
            <div>
                <span className={`${!wf ? 'text-white':'text-black'} font-bold`}><a href="mailto:proconta@alinvest-group.com">proconta@alinvest-group.com</a></span>
            </div>

            <div>
            <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>{t('common.company')}</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.about-us')}</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.opens')}</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.contact')}</p>
            </div>
            <div>
                <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>{t('common.resources')}</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.tutorials')}</p>
                <p  className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}><a onClick={(e)=>{
                     e.preventDefault()
                     navigate('faq')
                }} href="/faq">FAQ</a></p>
            </div>
            <div>
                <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>{'Legal'}</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.privacy')} </p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>{t('common.terms')}</p>
            </div>
        </div>

        <div className={`bg-white border-t ${wf ? 'border-black':'border-[rgba(255,255,255,0.3)]'} flex max-md:flex-col justify-between py-4 px-6 items-center`}>
             
              <a className="flex items-center" href="https://alinvest-group.com"><img src={Logo2} className="h-[30px] mr-2"/><span className="text-gray-600 text-[18px]">{t('common.a-product-of')} <label className=" font-semibold cursor-pointer hover:underline">Alinvest</label></span></a>
              <span className={`max-md:mt-3 max-md:pr-0 flex ${!wf ? 'text-black':'text-white'} pr-[34px]`}>&copy; {t('common.rights')}</span>
        </div>


    </div>
  )
}

export default Footer