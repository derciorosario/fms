import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import PayPalButton from './paypal'
import SendProof from './proof'
import Download from './download'
import { useHomeData } from '../../../../contexts/HomeDataContext'

function SelectPaymentMethod({activePage,setActvePage}) {
  const data=useHomeData()
  const [message,setMessage] =  useState('')

  console.log(data.form)
  
  return (
    <div className="mt-0 mb-20 w-full">

         {(data.form.method != null && !data.form.proof_ok && !message) &&  <div className={`w-full ${data.loading ? 'opacity-0 pointer-events-none':'flex'} justify-center mb-10`}>
            <span onClick={()=>{
                data.setForm({...data.form,method:null})
            }} className="text-gray-500 underline cursor-pointer ml-3">{t('messages.choose-another-payment')}</span> 
        </div>}

        {data.form.method=="Paypal" && <PayPalButton activePage={activePage} setActvePage={setActvePage}/>}
        <SendProof setMessage={setMessage} message={message}/>

       
        {!data.form.method && <div className="flex flex-col justify-center items-center">
            
                <h2 className="text-center max-w-[300px] text-[23px] font-semibold mb-10">{t('common.select-method')}</h2>
                {data.form.email_is_registered && <div id="alert-2" className={`flex items-center w-[500px] max-md:w-full p-4 mb-4 text-orange-400 bg-orange-50 rounded-lg  dark:text-red-400`} role="alert">
        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div className="ms-3 text-sm font-medium">
           {t('messages.email-in-the-plataform')}
        </div>
     
      </div>}

                <div className="w-[500px] mt-2 max-md:w-full">
                     <span className="text-[18px] flex mb-4 font-semibold">{t(`common.order-description`)}</span>
                     <div className="p-6 border border-gray-300 bg-[#F7F7F8] rounded-[0.2rem]">
                        <div className="flex justify-between items-center mb-4">
                             <span className="uppercase text-[16px]">Plataforma</span>
                             <span>{t('common.price')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-[17px] font-semibold">Pro Conta</span>
                             <span className="font-semibold">75.000 MT</span>
                        </div>     
                     </div>

                     <div className="mt-8">
                         <span className=" font-semibold">{t('common.method')}:</span>
                    
                         <div className="mt-4">
                            {['Paypal','transfer'].map(i=>(
                                <div  class="flex items-center mb-2" key={i}>
                                    <input onClick={()=>{
                                        data.setForm({...data.form,method:i})
                                    }} id={`default-checkbox`+i} type="checkbox" checked={data.form.method==i ? true : false} value="" class="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <span for={`default-checkbox`+i} class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
                                        {i=="transfer" ? t('common.transfer') : i}
                                        <label className="ml-2 opacity-80">{i=='Paypal' ? `(${t('common.taxes-may-apply')})`:''}</label>
                                    </span>
                                </div>
                            ))}
                         </div>  

                     </div>

                </div>
        </div>}

        {(data.form.proof_ok && data.form.done==1) && <div className="flex hidden items-center justify-center mt-6">
                <button onClick={()=>{
                     data.setForm({...data.form,done:2})
                     data.update({...data.form,done:2})
                }} className="rounded-[0.3rem] flex items-center cursor-pointer hover:opacity-70 bg-green-600 text-white px-2 py-1">
                   <span className="ml-1"> {t('common.next')}</span>
                   <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#fff"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
               </button>
        </div>}
    </div>
  )
}

export default SelectPaymentMethod