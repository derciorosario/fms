import React, { useEffect, useState } from 'react'
import PayPalButton from './paypal'
import { GoogleLogin } from '@react-oauth/google'
import i18n from '../../../../i18n'
import Register from './register'
import SelectPaymentMethod from './select-payment'
import Logo from '../../../assets/icon-2.png'
import Download from './download'
import Invoice from '../../../pages/invoice'
import InvoiceDownload from '../../../pages/invoice/invoice-download'
import { useNavigate } from 'react-router-dom'
import { useHomeData } from '../../../../contexts/HomeDataContext'
import { useTranslation } from 'react-i18next'
import InsertLincese from './insertLicense'

function DownloadProcess({show,payOnly,setShow,planInfo,updatePlanRes}) {
    
  const [activePage,setActvePage]=useState(0)
  const [pages,setPages]=useState([])
  const data=useHomeData()
  const navigate = useNavigate()
  const [resetUpdater,setResetUpdater]= useState()
  const { t } = useTranslation();
  const [licenseVerified,setLinceseVerified]=useState(false)

  useEffect(()=>{
    setPages([
        {name:t('titles.register')},
        {name:t('titles.payment')},
        {name:"Download"}
    ])
  },[i18n.language])



  

 
  useEffect(()=>{

        if(!data.initialized || data.resetUpdater!=resetUpdater){
            setActvePage(!data.form.done ? 0 : data.form.done)
            setResetUpdater(Math.random())
        }
        
  },[data.formUpdater,data.resetUpdater])




  useEffect(()=>{

      if(!data.initialized){
        return
      }
      if(data.form.done){
        data.register()
      }
  },[data.done,data.initialized])


  
  let langs=['pt','en']
  const [selectedLang, setSelectedLang] = React.useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : langs[0]);
 
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng)
    localStorage.setItem('lang',lng)
  };


 
  return (
    
   <>
    <InvoiceDownload/>
    <div className={`w-full top-0 left-0 fixed z-30 flex flex-col h-[100vh] ${!data.dialogs.register && !show ? 'opacity-0 pointer-events-none translate-y-[50px]':''} transition-all ease-in duration-100`}>

<div className="bg-[rgba(0,0,0,0.4)] h-[60px] w-full relative flex items-end">
    <div className="bg-[rgba(0,0,0,0.4)]  w-full h-[10px] z-[-1] translate-y-[100%]"></div>
</div>

<div className="flex-1 bg-white rounded-t-[0.8rem] overflow-auto flex-col justify-between flex">
   
    <div>
         <div className="w-full flex justify-center relative">
                    <span className="mt-6 h-[3px] w-[50px] bg-gray-400 rounded-full"></span>

                            {!data.loading && <span onClick={()=>{

                               if(payOnly){
                                  setShow(false)
                               }else{
                                 data.reset()
                                 data.setDialogs({...data.dialogs,register:false})
                               }
                               
                             }} className="bg-app_orange-400 absolute left-2 top-2 text-white px-3 py-1 rounded-[0.3rem] cursor-pointer hover:underline">{t('common.cancel-process')}</span>
}
                                {(!data.loading && !payOnly) && <span onClick={()=>{
                                                                if(data.form.done==2 || data.form.proof_ok){
                                                                    data.reset()
                                                                }
                                                                data.setDialogs({...data.dialogs,register:false})
                                                            }} className="bg-app_orange-400 absolute right-2 top-2 text-white px-3 py-1 rounded-[0.3rem] cursor-pointer hover:underline">{t('common.close-and-save')}</span>
                                }


        </div>

        <div className={`w-full ${payOnly ? 'hidden':''} flex justify-center items-center mt-14 mb-10`}>
                    {pages.map((i,_i)=>(
                            <div className="flex items-center justify-center relative">
                                <span className={`flex ${activePage==_i ? 'bg-[#ff7626]':'bg-white'} justify-center items-center w-[30px] h-[30px] border-[2px] border-app_primary-400 rounded-full`}>
                                    <label className={`${activePage==_i ? 'text-white':'text-gray-500'} `}>{_i+1}</label>  
                                </span>
                                <label className="mx-2 max-sm:text-[13px] flex max-md:absolute max-md:left-[10px] top-[100%] max-md:translate-x-[-50%]">{i.name}</label>
                            {_i+1 != pages.length &&  <span className="w-[100px] h-[2px] max-sm:w-[70px] bg-gray-400"></span>}
                        </div>
                    ))}
        </div>
    </div>
    <div className={`py-3 px-8 flex justify-between max-md:mb-10 ${data.loading ? 'opacity-0 pointer-events-none':''}`}>
       {(activePage >= data.form.done && activePage!=0 && activePage!=2 && !data.form.proof_ok) ? <button onClick={()=>{
          setActvePage(activePage - 1)
       }} className="rounded-[0.3rem] flex items-center cursor-pointer hover:opacity-70 bg-[#ff7626] text-white px-2 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#fff"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
          <span className="ml-1"> {t('common.go-back')}</span>
       </button> : <span></span>}

       {(data.form.done > activePage && activePage!=2 && data.form.done != 1) ? <button  onClick={()=>{
           setActvePage(activePage + 1)
       }} className="rounded-[0.3rem] flex items-center cursor-pointer hover:opacity-70 bg-green-600 text-white px-2 py-1">
           <span className="ml-1"> {t('common.next')}</span>
           <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#fff"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
       </button> : <span></span>}
    </div>

   <div className="w-full flex-1  px-4">
          {(activePage == 0 && !payOnly) && <Register activePage={activePage} setActvePage={setActvePage}/>}
          {((activePage == 1 || (payOnly && show==2))) && <SelectPaymentMethod setShow={setShow} updatePlanRes={updatePlanRes} planInfo={planInfo} activePage={activePage} setActvePage={setActvePage}/>}   
          {(activePage == 2 && !payOnly) && <Download/>}
          {(payOnly && show==1) && <InsertLincese/>}
   </div>

   
    <div className="flex justify-between p-2 relative">
             <a className="flex items-center"><img src={Logo} className="h-[30px] mr-2"/><span className="text-white font-bold text-[18px]">Pro Conta</span></a>
                <div className="flex items-center">

                    {data.form.done==2 && <span onClick={()=>navigate('/invoice/'+data.form.invoice.invoice_number)} className="bg-[#ff7626] hidden cursor-pointer mr-2 text-white p-1 rounded-[0.3rem] underline">{t('common.view-invoice')}</span>}
                    

                    <div className="flex items-center">
                       <div className="mr-4">
                                <select onChange={(e)=>changeLanguage(e.target.value)} value={selectedLang} className=" rounded-[0.2rem] p-1 bg-gray-300 text-gray-600">
                                    <option value={"pt"}>PT</option>
                                    <option value={"en"}>EN</option>
                                </select>
                        </div>

                        <div className="flex items-center mb-2">                
                            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" fill="#ddd"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                            <span className="text-gray-500 ml-1 text-[15px]"><a>+258 87 870 7590</a></span>
                         </div>
                    </div>
                   
               </div>
    </div>




</div>

</div>
   </>
  )
}

export default DownloadProcess