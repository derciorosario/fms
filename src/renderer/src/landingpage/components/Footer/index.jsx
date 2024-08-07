import React,{useEffect,useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLogo from '../../assets/main-logo.png'
import Logo from '../../assets/icon.png'

function Footer() {

   const { t, i18n } = useTranslation();
   const {pathname} =useLocation()
   const navigate= useNavigate()

   const [wf,setWhiteFooter]=useState(false)

   useEffect(()=>{

     //setWhiteFooter(pathname!="/")
     setWhiteFooter(false)

   },[pathname])

  

  return (
    <div className={`bg-[#ff7626] border-t border-t-[rgba(255,255,255,0.2)]`} id="contact">

        <div className="lg:[&>_div]:w-[25%] max-lg:[&>_div]:mb-10 [&>_div]:cursor-pointer lg:flex px-10 py-14">
            <div>
                <span className={`${!wf ? 'text-white':'text-black'} font-bold`}>hello@proconta.com</span>
            </div>

            <div>
            <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>Empresa</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Sobre nós</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Vagas</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Contacto</p>
            </div>
            <div>
                <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>Recursos</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Tutoriais</p>
            </div>
            <div>
                <p className={`${!wf ? 'text-white opacity-65':'text-black'} text-[16px] mb-2`}>Legal</p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Poticas de privacidade </p>
                <p className={`${!wf ? 'text-white':'text-black'} text-[18px] mb-2`}>Termos e condições</p>
            </div>
        </div>

        <div className={`border-t ${wf ? 'border-black':'border-[rgba(255,255,255,0.3)]'} flex max-md:flex-col justify-between py-4 px-6 items-center`}>
              <div className="hidden">
                 <img src={MainLogo}  className="h-[60px]"/>
              </div>
              <a className="flex items-center"><img src={Logo} className="h-[30px] mr-2"/><span className="text-white font-bold text-[18px]">Pro Conta</span></a>
              <span className={`max-md:mt-3 pr-5 flex ${wf ? 'text-black':'text-white'}`}>&copy; {t('common.rights')}</span>
        </div>


    </div>
  )
}

export default Footer