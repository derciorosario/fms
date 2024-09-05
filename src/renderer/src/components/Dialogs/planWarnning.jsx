import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { KeyboardReturnRounded } from '@mui/icons-material'
import DownloadProcess from '../../landingpage/components/Dialogs/DownloadProcess'
import { useData } from '../../contexts/DataContext'
import PouchDB from 'pouchdb';
import toast from 'react-hot-toast'
import PageLoader from '../progress/pageLoader'

function PlanWarnning() {
  const {licenseInfo,setShowLicensePopUp,user,setCheckingPlanUpdate,checkingPlanUpdate} = useAuth()
  const [showDownloadProcess,setShowDownloadProcess]=useState(null)
  const [planDetails,setPlanDetails]=useState({})
  const data=useData()
  const navigate=useNavigate()


  useEffect(()=>{
    if(!user) {
      return
    }
    setPlanDetails(user.companies_details.filter(i=>i.id==user.selected_company)[0])
},[user])

 
async function _selectupgradeProcress(renew){

  setShowDownloadProcess({
    ...planDetails,
    to_name:user.name,name:user.name,
    to_last_name:user.last_name,last_name:user.last_name,
    to_contact:user.contacts[0],contact:user.contacts[0],
    to_company_name:planDetails.name,company_name:planDetails.name,
    admin_id:user.id,
    renew,
    id:2
  })

}


async function verifyPlanUpdate(){
  setCheckingPlanUpdate(true)

  try{

    let r=await data.makeRequest({method:'post',url:`api/check-license-update`,data:{
      user_id:user.id,
      company:planDetails
    }, error: ``},2);

    if(r.status==1){
        setCheckingPlanUpdate(false)
        toast.error(t('common.no-updated-license'))
        return
    }

    applyLicenseUpdate(r)
   
  }catch(e){

      if(e.response){
          if(e.response.status==404){
              toast.error(t('common.user-not-found'))
          }
          if(e.response.status==500){
              toast.error(t('common.unexpected-error'))
          }
      }else if(e.code=='ERR_NETWORK'){
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
      }
  }   
}


function updatePlan(r){
  setCheckingPlanUpdate(true)
  applyLicenseUpdate({company:r.updated_plan})
}


async function applyLicenseUpdate(r){

  let companies_details=user.companies_details.map(i=>({
    ...i,
    planHistory:r.company.planHistory,
    period:r.company.period,
    plan:r.company.plan,
    planUpdatedAt:r.company.planUpdatedAt,
    license:r.company.license,
    planEnd:r.company.planEnd
    
 }))

  let user_db=new PouchDB('user-'+user.id)
  user_db.createIndex({index: { fields: ['id'] }})
  let _user=await user_db.find({selector: { id:user.id }})
  _user=_user.docs[0]
  _user.companies_details=companies_details
  await user_db.put(_user)
  toast.success(t('common.license-updated'))
  setCheckingPlanUpdate('updating')
  setTimeout(()=>{
      if(window.electron){
        window.electron.ipcRenderer.send('relaunch')
      }else{
        window.location.reload()
      }
  },5000)


}



  return (
    <>
         {checkingPlanUpdate && <PageLoader message={checkingPlanUpdate==true ? t('messages.checking-license') : checkingPlanUpdate=="updating" ? t('common.activating-license') : ''}/>}
         <DownloadProcess updatePlanRes={updatePlan} payOnly={true} show={showDownloadProcess?.id} planInfo={showDownloadProcess} setShow={setShowDownloadProcess}/>
         <div className="w-full left-0 top-0 bg-gray-300 h-[100vh] flex flex-col items-center justify-center">
                  
                  {licenseInfo?.status==0 && <div onClick={()=>{
                      setShowLicensePopUp(false)
                  }} className="bg-[#ff4800] cursor-pointer absolute right-3 top-3 hover:opacity-90 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </div>}

                 <span className="mb-5 text-[20px]">{t('common.subscription-plan')}</span>

                 <div className=" bg-white p-[30px] rounded-[0.8rem] w-[500px] max-md:w-[90%]">
                               {licenseInfo?.status==0 ? <div>
                                 <div className="flex items-center">
                                    <span className="shadow-inner  block px-5 py-2 rounded-full mr-5 bg-app_orange-50 text-app_orange-400">
                                      {t('common.expires-in')}  <label className=" font-bold">{licenseInfo?.left_days} {t('common.days')}</label>
                                    </span>
                                    <span onClick={()=>{
                                         _selectupgradeProcress('renew')
                                    }} className="text-green-500 px-5 py-2 rounded-full border border-transparent hover:border-gray-500 cursor-pointer">{t('common.renew-plan')}</span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-gray-500">{t('messages.plan-about-to-expire')}</p>
                               </div>

                               <div className="w-full h-[1px] bg-gray-100 my-[30px]"></div>

                               <div className="flex">

                                  <button  className="bg-app_orange-400 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                       _selectupgradeProcress()
                                  }}>{t('common.change-plan')}</button>

                                  <button  className="bg-gray-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                        alert('In devepment!')
                                  }}>{t('common.cancel-plan')}</button> 

                              </div>

                              <span onClick={()=>{
                                 setShowLicensePopUp(false)
                                 navigate('/user-preferences?page=bill')
                              }} className="mt-4 flex underline text-blue-500 cursor-pointer">{t('common.manage-license')}</span>
                       
                        </div>:<div>

                                 <div className="flex items-center">
                                    <span className="shadow-inner  block px-5 py-2 rounded-full mr-5 bg-app_orange-50 text-app_orange-400">
                                        <label className="font-bold">{t('common.plan-has-expired')}</label>
                                    </span>
                                    <span onClick={()=>{
                                         _selectupgradeProcress('renew')
                                    }} className="text-green-500 px-5 py-2 rounded-full border border-transparent hover:border-gray-500 cursor-pointer">{t('common.renew-plan')}</span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-gray-500">{t('messages.plan-about-to-expire')}</p>
                               </div>

                               <div className="w-full h-[1px] bg-gray-100 my-[30px]"></div>

                               <div className="flex">
                                 <button  className="bg-app_orange-400 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                   _selectupgradeProcress()
                                }}>{t('common.change-plan')}</button>
                              </div>


                              <div className="mt-2" onClick={verifyPlanUpdate}>
                                <span className="mb-2 text-[14px] mt-4  text-gray-500 flex-col">{t('messages.plan-not-updated-after-purchase')} </span>
                                
                                <span onClick={()=>{
                                  setShowLicensePopUp(false)
                                  navigate('/user-preferences?page=bill')
                                }} className="underline text-blue-500 cursor-pointer">{t('common.check-plan-update')}</span>
                        
                              </div>
   
                        </div>}      
                </div>
    </div>
    
    </>
    
  )
}

export default PlanWarnning