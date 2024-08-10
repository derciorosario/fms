import { t } from 'i18next';
import * as React from 'react';

export default function SelectCompany({items,show,res}) {

    const [selected,setSelected]=React.useState(null)
  return (
      <>

 
<div id="select-modal" tabindex="-1" aria-hidden="true" className={` bg-[rgba(0,0,0,.6)] overflow-y-auto flex transition  ${show ? 'opacity-1 z-50 ' :'opacity-0'}  -z-10 overflow-x-hidden fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-full max-h-full`}>
    <div className="_bg w-full h-full absolute left-0 top-0" onClick={()=>res(null)}></div>
    <div className={`relative p-4 w-full max-w-md max-h-full duration-150 ease-in-out  ${!show ? ' translate-y-4' :''}`}>
        <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('common.companies')}
                </h3>
                <button onClick={()=>{
                    res(false)
                    setSelected(null) 
                 }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="select-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-4 md:p-5">
                <p className="text-gray-500 mb-4">{t('common.select-company-to-login')}:</p>
                <ul className="space-y-4 mb-4 max-h-[300px] overflow-auto">
                   
                    
                   {items.map((i,_i)=>(
                        <li onClick={()=>setSelected(i)} key={_i}>
                        <input type="radio" id={`job-${_i}`} name="job" value={`job-${_i}`} className="hidden peer"/>
                        <label for={`job-${_i}`} className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-app_orange-300 peer-checked:text-app_orange-300 hover:text-gray-900 hover:bg-gray-100">
                            <div className="block">
                                <div className="w-full text-lg font-semibold">{i.name}</div>
                                <div className="w-full text-gray-500">{i.is_admin ? t('common.administrator') : t('common.manager')}</div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                   ))}
                </ul>
                <button onClick={()=>{
                    res(selected)
                    setSelected(null)
                }} className={`text-white inline-flex w-full justify-center  focus:outline-none ${selected ? 'focus:ring-app_orange-300 bg-app_orange-500 hover:bg-app_orange-400 focus:ring-4' :' bg-gray-400 opacity-70 cursor-not-allowed'} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                      {t('common.login')}
                </button>

                <span onClick={()=>{
                    document.getElementById('login-email-input').focus()
                    res(false)
                    setSelected(null)
                }} className="underline text-gray-500 cursor-pointer flex items-center w-full hover:opacity-80 justify-center my-5">{t('common.choose-another-email')}</span>
            </div>
        </div>
    </div>
</div> 

    

      </>
  );
}