import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DefaultLayout from './DefaultLayout';
import { useTranslation } from 'react-i18next';
import DownloadProcess from '../landingpage/components/Dialogs/DownloadProcess';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

function UserPreferencesLayout({children,page,setPage,showDownloadProcess,setShowDownloadProcess,res}) {
 const { t } = useTranslation();
 const [searchParams, setSearchParams] = useSearchParams();
 const data=useData()

   function _setPage(p){

     setPage(p)

     if(document.querySelector('.peer')){
      document.querySelector('.peer').checked=false
     }
     
   }
   useEffect(()=>{
    let res=data._sendFilter(searchParams)
    if(res.page){
        _setPage(res.page)
    }
  
  },[])
  


 
  return (

    <>

  <DownloadProcess updatePlanRes={res} payOnly={true} show={showDownloadProcess?.id} planInfo={showDownloadProcess} setShow={setShowDownloadProcess}/>
  <DefaultLayout  details={{name:t('userPreferences.title')}}>

   <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
   <h1 className="border-b py-6 text-4xl font-semibold">{t('userPreferences.title')}</h1>
   <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
    <div className="relative my-4 w-56 sm:hidden">
      <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
      <label for="select-1" className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring">{t(`userPreferences.menu.${page}`)} </label>
      <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
        {page!="profile" && <li onClick={()=>_setPage('profile')} className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-app_orange-400 hover:text-white">{t('userPreferences.menu.notifications')}</li>}
        {page!="notifications" && <li onClick={()=>_setPage('notifications')} className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-app_orange-400 hover:text-white">{t('userPreferences.menu.profile')}</li>}
        {page!="data" && <li onClick={()=>_setPage('data')} className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-app_orange-400 hover:text-white">{t('userPreferences.menu.data')}</li>}
        {page!="bill" && <li onClick={()=>_setPage('bill')} className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-app_orange-400 hover:text-white">{t('userPreferences.menu.bill')}</li>}
      </ul>
    </div>

    <div className="col-span-2 sm:block  max-sm:hidden">
      <ul>
        <li onClick={()=>setPage('profile')} className={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2  transition hover:border-l-app_orange-500 hover:text-app_orange-400 ${page=="profile" ? 'text-app_orange-500 font-semibold border-l-app_orange-500':''}`}>{t('userPreferences.menu.profile')}</li>
        <li onClick={()=>setPage('notifications')} className={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2  transition hover:border-l-app_orange-500 hover:text-app_orange-400 ${page=="notifications" ? 'text-app_orange-500 font-semibold border-l-app_orange-500':''}`}>{t('userPreferences.menu.notifications')}</li>
        <li onClick={()=>setPage('data')} className={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2  transition hover:border-l-app_orange-500 hover:text-app_orange-400 ${page=="data" ? 'text-app_orange-500 font-semibold border-l-app_orange-500':''}`}>{t('userPreferences.menu.data')}</li>
        <li onClick={()=>setPage('bill')} className={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2  transition hover:border-l-app_orange-500 hover:text-app_orange-400 ${page=="bill" ? 'text-app_orange-500 font-semibold border-l-app_orange-500':''}`}>{t('userPreferences.menu.bill')}</li>
      </ul>
    </div>
   

    <div className="col-span-8 rounded-xl bg-gray-50 px-8 shadow">
        {children}
    </div>
  </div>
</div>
      </DefaultLayout>
        

    
    </>

  )

}

export default UserPreferencesLayout

