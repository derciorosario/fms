import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { t } from 'i18next'

function PlanWarnning() {
  const {licenseInfo} = useAuth()

  return (
    <div className="w-full left-0 top-0 bg-gray-300 h-[100vh] flex flex-col items-center justify-center">
                  <div onClick={()=>{

                  }} className="bg-[#ff4800] cursor-pointer absolute right-3 top-3 hover:opacity-90 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </div>

                 <span className="mb-5 text-[20px]">{t('common.subscription-plan')}</span>

                 <div className=" bg-white p-[30px] rounded-[0.8rem] w-[500px]">
                               {licenseInfo?.status==0 ? <div>
                                 <div className="flex items-center">
                                    <span className="shadow-inner  block px-5 py-2 rounded-full mr-5 bg-app_orange-50 text-app_orange-400">
                                      {t('common.expires-in')}  <label className=" font-bold">{licenseInfo?.left_days} {t('common.days')}</label>
                                    </span>
                                    <span className="text-green-500 px-5 py-2 rounded-full border border-transparent hover:border-gray-500 cursor-pointer">{t('common.renew-plan')}</span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-gray-500">{t('messages.plan-about-to-expire')}</p>
                               </div>

                               <div className="w-full h-[1px] bg-gray-100 my-[30px]"></div>

                               <div className="flex">

                                  <button  className="bg-app_orange-400 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                  
                                  }}>{t('common.change-plan')}</button>

                                  <button  className="bg-gray-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{

                                  }}>{t('common.cancel-plan')}</button> 

                              </div>
                              <span className="mt-4 flex underline text-blue-500 cursor-pointer">{t('common.manage-license')}</span>
                        </div>:<div>

                                 <div className="flex items-center">
                                    <span className="shadow-inner  block px-5 py-2 rounded-full mr-5 bg-app_orange-50 text-app_orange-400">
                                        <label className="font-bold">{t('common.plan-has-expired')}</label>
                                    </span>
                                    <span className="text-green-500 px-5 py-2 rounded-full border border-transparent hover:border-gray-500 cursor-pointer">{t('common.renew-plan')}</span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-gray-500">{t('messages.plan-about-to-expire')}</p>
                               </div>

                               <div className="w-full h-[1px] bg-gray-100 my-[30px]"></div>

                              <div className="flex">
                                 <button  className="bg-app_orange-400 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                 
                                }}>{t('common.change-plan')}</button>
                              </div>
   
                        </div>}      
                </div>
    </div>
  )
}

export default PlanWarnning