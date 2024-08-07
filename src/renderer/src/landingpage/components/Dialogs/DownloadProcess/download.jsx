import { t } from 'i18next'
import React from 'react'
import colors from '../../../assets/colors.json'
import toast from 'react-hot-toast';
import { useHomeData } from '../../../../contexts/HomeDataContext';

function Download() {


    const data=useHomeData()


    const handleCopyClick = (text) => {
        toast.remove()
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Texto copiado!');
        }).catch(err => {
            toast.success('Texto copiado!');
        });
    }



  return (
    <div className="flex items-center justify-center flex-col mb-20">
        <h2 className="text-center max-w-[300px] max-sm:w-full text-[23px] font-semibold mb-10">{t('common.get')} <span className="text-[#ff7626]">Pro Conta</span></h2> 
        <div className="w-[600px]  max-sm:w-full">
             <span></span>
             <div className="flex flex-col">
                 <span className="flex text-[20px] font-semibold mb-4">
                    {t('common.access')}:
                 </span>

                 <div className="bg-gray-200 rounded-[0.2rem] p-4 border-l-4 border-l-gray-500 mb-10">
                     <span className="opacity-75">{t('common.download-msg-1')}</span>
                     <div className="flex items-center mt-4 active:opacity-30" onClick={()=>{
                        handleCopyClick(data.key)
                     }}>
                          <span className="cursor-pointer flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                            <label className="text-[14px] cursor-pointer">{t('common.copy')}</label>
                          </span>

                          <div className="bg-gray-300 rounded-[0.3rem] p-1 text-gray-800 ml-4 border border-gray-400">
                               <label className="text-[13px]">{data.key}</label>
                          </div>
                     </div>
                 </div>

                 <span className="flex text-[20px] font-semibold mb-4">
                    Download:
                 </span>


                 <div className="flex items-center  max-sm:flex-col">
                        <div className="overflow-hidden h-[46px] px-3 relative table items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                           <button onClick={()=>{
                              window.open(data.APP_BASE_URL+"/download")
                           }} className="w-full h-full bg-[#ff7626] flex items-center text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in">
                            <span className="mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                            </span>
                            <label className="cursor-pointer">Desktop App</label>
                           </button>
                       </div>

                       <div onClick={()=>{
                                window.open(data.plataform_url+"/create-company")
                        }} className="text-app_primary-500  max-sm:mt-6 rounded-[0.3rem] h-[46px] sm:ml-5 flex items-center border-1 border-app_primary-400 cursor-pointer">
                             <svg className="hidden" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[500]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h420v-140H160v140Zm500 0h140v-360H660v360ZM160-460h420v-140H160v140Z"/></svg>
                             <svg className={``} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[500]}><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>
                             <span className="ml-1 text-[#ff7626]">{t('common.access-from-browser')}</span>
                       </div>
                 </div>
                
             </div>
        </div>        
    </div>
  )
}

export default Download