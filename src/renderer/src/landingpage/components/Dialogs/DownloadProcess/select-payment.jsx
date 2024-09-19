import i18next, { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import PayPalButton from './paypal'
import SendProof from './proof'
import Download from './download'
import { useHomeData } from '../../../../contexts/HomeDataContext'

function SelectPaymentMethod({activePage,setActvePage,planInfo,updatePlanRes,setShow}) {

  const data=useHomeData()

  const [message,setMessage] =  useState('')
  const [plans,setPlans]=useState([])
  const [selectedPlanItem,setSelectedPlanItem] = useState('')
  const [proofSent,setProofSent]=useState(false)

  

  useEffect(()=>{
      if(planInfo?.id){
        let next_plan=planInfo?.renew ? planInfo?.plan :  (planInfo?.plan=="basic" ? "advanced":"basic")
        data.setForm({...data.form,...planInfo,plan:next_plan,changingPlan:planInfo?.changingPlan})
        setSelectedPlanItem((next_plan)+`${(planInfo?.showAnualPlans || data.form.showAnualPlans) ? '_':''}`)
      }else{
        setSelectedPlanItem((data.form.plan)+`${(data.form.showAnualPlans) ? '_':''}`)
      }
  },[])


  useEffect(()=>{

      setPlans([
        {
            n:'basic',name:`${t('common.basic')} (${t('common.monthly')})`,hide:Boolean(planInfo?.plan=='basic' && !planInfo?.renew),
         },
         {
            n:'advanced',name:`${t('common.advanced')} (${t('common.monthly')})`,hide:Boolean(planInfo?.plan=='advanced' && !planInfo?.renew)
         },
         {
            n:'basic_',name:`${t('common.basic')} (${t('common.per-year')})`,hide:Boolean(planInfo?.plan=='basic' && !planInfo?.renew),
         },
         {
            n:'advanced_',name:`${t('common.advanced')} (${t('common.per-year')})`,hide:Boolean(planInfo?.plan=='advanced' && !planInfo?.renew)
         }
      ])

  },[i18next.language,planInfo])

  return (
    <div className="mt-0 mb-20 w-full">

         {((data.form.method != null && !data.form.proof_ok && !message) || (planInfo && data.form.method != null)) &&  <div className={`w-full ${data.loading ? 'opacity-0 pointer-events-none':'flex'} justify-center mb-10`}>
            <span onClick={()=>{
                data.setForm({...data.form,method:null})
            }} className="text-gray-500 underline cursor-pointer ml-3">{t('messages.choose-another-payment')}</span> 
        </div>}

        {data.form.method=="Paypal" && <PayPalButton setShow={setShow} updatePlanRes={updatePlanRes} activePage={activePage} setActvePage={setActvePage}/>}
        <SendProof setProofSent={setProofSent} updatePlanRes={updatePlanRes} setMessage={setMessage} message={message}/>

        {(!data.form.method) && <div className="flex flex-col justify-center items-center"> 
         <h2 className="text-center max-w-[500px] text-[23px] font-semibold mb-10">{planInfo?.renew ? t('messages.renew-your-package-quickly-and-easily') : planInfo?.id ? t('messages.are-you-looking-to-change-your-plan') : t('common.select-method')}</h2>
         {data.form.email_is_registered && <div id="alert-2" className={`flex items-center w-[500px] max-md:w-full p-4 mb-4 text-orange-400 bg-orange-50 rounded-lg  dark:text-red-400`} role="alert">
        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div className="ms-3 text-sm font-medium">
             {t('messages.email-in-the-plataform')}
        </div>
      </div>}

                <div className="w-[580px] mt-2 max-md:w-full">
                     <div className="w-full flex justify-between mb-2">
                         <span className="text-[18px] flex mb-4 font-semibold">{t(`common.order-description`)}</span>
                         <div className={`bg-gray-200 flex rounded-[0.3rem] p-1 px-[0.1rem] items-center cursor-pointer`}>
                                            <span onClick={()=>data.setForm({...data.form,showAnualPlans:false})} className={`text-[14px]  transition-all ease-in duration-75 ${!data.form.showAnualPlans ? 'bg-[#ff7626] text-white':'text-gray-500'} rounded-[0.3rem] py-2 px-2  flex w-[50%] mx-1`}>{t('common.per-month')}</span>
                                            <span onClick={()=>data.setForm({...data.form,showAnualPlans:true})} className={`text-[14px] transition-all ease-in duration-75 ${data.form.showAnualPlans ? 'bg-[#ff7626] text-white':'text-gray-500'} rounded-[0.3rem] py-2 px-2  flex w-[50%] mx-1`}>{t('common.per-year')}</span>
                                            
                         </div>
                      </div>
                     

                     <div className="p-6 border border-gray-300 bg-[#F7F7F8] rounded-[0.2rem]">
                        <div className="flex justify-between items-center mb-4">
                             <span className="uppercase text-[16px]">{t('common.plataform')}</span>
                             <div>
                                <span>{t('common.price')}</span>
                                <span className="hidden">{t('common.plan')}</span>
                             </div>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-[17px] font-semibold">Pro Conta</span>
                             <div>
                              
                                <div className="hidden">
                                      {!data.form.showAnualPlans ? <>
                                        
                                        <span className="font-semibold">{data.form.plan=="basic" ? '1.500,00 MZN': '3.000,00 MZN'}</span>
                                    </> : <>
                                        <span className="font-semibold">{data.form.plan=="advanced" ? '16.500,00 MZN': '32.500,00 MZN'}</span>
                                    </>}
                                </div>

                                <div className="flex gap-x-8">

                                  <label className={`flex cursor-pointer items-center ${planInfo?.plan=='basic' && !planInfo?.renew || planInfo?.renew && planInfo?.plan!='basic'  ? 'hidden':''}`}>

                                     <input type="radio" onClick={()=>data.setForm({...data.form,plan:'basic'})} checked={data.form.plan=='basic'} name="selected_plan"/>
                                     <div className="flex flex-col ml-1">
                                       <span className="font-semibold">{!data.form.showAnualPlans ? '1.500,00 MZN': '16.500,00 MZN'}</span>
                                       <span>{t('common.basic')}</span>
                                     </div>  

                                  </label>


                                  <label className={`flex cursor-pointer items-center ${planInfo?.plan=='advanced' && !planInfo?.renew || planInfo?.renew && planInfo?.plan!='advanced' ? 'hidden':''}`}>

                                     <input onClick={()=>data.setForm({...data.form,plan:'advanced'})}  checked={data.form.plan=='advanced'} type="radio" name="selected_plan"/>
                                     <div className="flex flex-col ml-1">
                                       <span className="font-semibold">{!data.form.showAnualPlans ? '3.500,00 MZN': '32.500,00 MZN'}</span>
                                       <span>{t('common.advanced')}</span>
                                     </div>    

                                  </label>
                                     
                                </div>

                                  <select  onChange={e=>{
                                      data.setForm({...data.form,plan:e.target.value.replace('_',''),showAnualPlans:e.target.value.includes('_')})
                                      setSelectedPlanItem(e.target.value)
                                  }} value={selectedPlanItem} className="ml-2 w-[130px] hidden">
                                     {plans.map((i,_i)=>(
                                        <option disabled={i.hide} value={i.n}>{i.name}</option>
                                     ))}
                                  </select>
                             </div>
                             
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
                                    <span for={`default-checkbox`+i} class="ms-2 text-sm font-medium text-gray-900  cursor-pointer">
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