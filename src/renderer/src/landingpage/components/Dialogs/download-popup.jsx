import { t } from 'i18next'
import colors from '../../assets/colors.json';

import React from 'react'
import { useHomeData } from '../../../contexts/HomeDataContext';
    function DownloadPopUp() {
    const data=useHomeData()

    return (
        <div className={`w-full ${!data.dialogs.download ? 'pointer-events-none opacity-0 translate-y-[1rem]':''} transition-all ease px-2 duration-75 flex items-center justify-center left-0 top-0 bg-[#f7f7f8] z-40 h-[100vh] fixed`}>
                <div className="bg-white rounded-[0.3rem] w-[500px] relative p-4 download-pop">
                    <div className="flex justify-between items-center mb-9">
                        <span className=" text-[18px] font-semibold">{t('common.get')} ProConta</span>
                        <div onClick={()=> data.setDialogs({...data.dialogs,download:false})} className="bg-[#ff4800] cursor-pointer hover:opacity-90 w-[40px] h-[40px] absolute right-3 top-3 z-30 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>
                    </div>


                    <div className="bg-gray-200 rounded-[0.2rem] p-4 border-l-4 border-l-gray-500 mb-10">
                       <span className="opacity-75">{t('common.download-msg-2')}</span>
                       <span onClick={()=>{
                          data.register()
                       }} className="text-blue-400 mt-3 underline cursor-pointer flex">{t('common.register')}</span>
                    </div>

                    <div>

                           <div className="flex items-center">
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
                                window.open(data.plataform_url)
                            }} className="text-app_primary-500 rounded-[0.3rem] h-[46px] ml-5 flex items-center border-1 border-app_primary-400 cursor-pointer">
                                    <svg className="hidden" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[500]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h420v-140H160v140Zm500 0h140v-360H660v360ZM160-460h420v-140H160v140Z"/></svg>
                                    <svg className={``} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[500]}><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>
                                    <span className="ml-1 text-app_primary-400">{t('common.access-from-browser')}</span>
                            </div>
                            </div>

                    </div>
                </div>
        </div>
    )
    
    }
    export default DownloadPopUp