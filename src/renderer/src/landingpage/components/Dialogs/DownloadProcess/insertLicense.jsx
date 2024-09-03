import i18next, { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useHomeData } from '../../../../contexts/HomeDataContext'
import colors from '../../../assets/colors.json'
import CircularIndeterminate from '../../loaders/progress'

function InsertLincese({}) {

  const data=useHomeData()

  const [message,setMessage] =  useState('')

  async function SubmitForm(){

  }

  return (
    <div className="mt-0 mb-20 w-full">
             

                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-center max-w-[300px] text-[23px] font-semibold mb-10">{t('common.insert-new-license')}</h2>
        
                    <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                        <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[300]}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></span>
                        <input  onChange={(e=>(
                                    data.setForm({...data.form,last_name:e.target.value})
                        ))} value={data.form.last_name} placeholder={t('form.last-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                    </div>

                    {message  && <div id="alert-2" className="flex items-center w-[340px] p-4 my-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div className="ms-3 text-sm font-medium">
                            {message}
                        </div>
                        <button onClick={()=>setMessage('')} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
                            <span className="sr-only">Close</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                             </svg>
                        </button>
                    </div>}

                    <div className="overflow-hidden h-[46px] w-[340px]  max-sm:w-full relative flex items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                        {data.loading && <div className="scale-[0.8]"><CircularIndeterminate color={'#fff'}/></div>}
                        {!data.loading && <button onClick={SubmitForm} className="w-full h-full bg-[#ff7626] text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in">{t('common.send')}</button>}
                    </div>
                </div>
       
                   

    </div>
  )
}

export default InsertLincese