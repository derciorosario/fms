import { t } from 'i18next'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function PlanWarnningTopBar() {
  const {licenseInfo,setShowLicenseTopPopUp} = useAuth()
  const navigate=useNavigate()
  return (
    <div className={`w-full flex items-center justify-between shadow-inner px-5 py-2  mr-5 ${parseFloat(licenseInfo?.left_days)  >= 15 ? 'bg-green-200 text-green-600 border-b-green-100':'bg-app_orange-50 text-app_orange-400 border-b-app_orange-100'} border-b-2`}>
           <span className="">{t('messages.license-ends-in')} <label className=" font-bold">{licenseInfo?.left_days} {t('common.days')}</label></span>
           <div className="flex  items-center">
                <div className="m-2">
                      <span onClick={()=>{
                         navigate('/user-preferences?page=bill')
                         setShowLicenseTopPopUp(false)
                         localStorage.setItem('_license_top_w',new Date().toISOString().split('T')[0])
                      }} className="flex underline text-blue-500 cursor-pointer">{t('common.manage-license')}</span>
                </div>
                <div onClick={()=>{
                     
                }} className="cursor-pointer hover:opacity-90 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff4800"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
           </div>
    </div>
  )
}

export default PlanWarnningTopBar