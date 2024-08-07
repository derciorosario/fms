import React, { useState } from 'react';
import VerifiedIcon from '../compnents/valid-icon';
import colors from '../../../assets/colors.json'
import { Close, CloseRounded } from '@mui/icons-material';
import { t } from 'i18next';
function FirstUseLincense({formData,setFormData,errors,setErrors,login,currentPage,clear_errors}) {


  return (
    <>

        <div className="md:col-span-5">
              {(!login && currentPage==0) && <div class="w-[300px]">
                    <label for="email">{t('common.access-key')}</label>
                    <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1 w-full">
                            <input onChange={(e)=>setFormData({...formData,key:e.target.value.length <= 12 ? e.target.value : formData.key})} value={formData.key} name="name"  placeholder="xxxx xxxx xxxx" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                            {formData.key.length == 12 && <VerifiedIcon/> }
                    </div>
             </div>}

             <div className={`mt-10 w-full ${!errors.length || login ?'hidden':''}`}>
                   <span className="text-[17px] mb-2 flex text-gray-600">{t('common.found-errors')}:</span>
                   {errors.map(i=>(
                      <>
                        <div><CloseRounded sx={{width:17,color:'crimson'}}/> <span className="text-[crimson]">{i}</span></div>
                      </>
                   ))}

                  <span onClick={clear_errors} className="ml-1 mt-3 table underline cursor-pointer opacity-80 text-gray-500 hover:opacity-100">{t('common.clear-errors')}</span>
             </div>


             <div className={`${!login ? 'hidden':''}`}>
                <span className="flex items-center mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" fill="rgb(34,197,94)"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>  
                   <label className="text-green-500 font-semibold ml-2 table text-[18px]">{t('messages.company-created-msg')}</label>
                </span>

                <span className="text-gray-500 font-medium ml-2 table text-[17px]">
                   {t('messages.setup-final')}
                </span>

                <button onClick={()=>{
                    window.location.href="/"
                }} className={`hover:bg-app_orange-300 mt-5 bg-app_orange-400 text-white font-bold py-3 px-8 rounded text-[17px]`}>{t('common.to_start')}</button>
                 
            </div>

        </div>

    </>

           
  )

}

export default FirstUseLincense

