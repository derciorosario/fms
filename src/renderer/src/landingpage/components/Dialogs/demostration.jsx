import { t } from 'i18next'
import React from 'react'
import { useHomeData } from '../../../contexts/HomeDataContext'
import colors from '../../assets/colors.json'
import CircularIndeterminate from '../loaders/progress'
import { CorporateFareOutlined } from '@mui/icons-material'

function Demostration({show, setShow,validate_email}) {
  const data=useHomeData()
  return (
    <div className={`flex fixed top-0 left-0 z-50 items-center transition-all ease-in duration-200 ${show ? '':'opacity-0 pointer-events-none'} justify-center min-h-[100vh] w-full bg-[rgba(0,0,0,0.5)] px-[1rem]`}>
                 <div className={`pb-[30px] transition-all ease-in duration-200 ${show ? 'scale-100':'scale-75'} bg-white rounded-[0.4rem] w-[400px] px-[0.5rem]`}>

                    <div className="flex justify-between p-2 items-center border-b">
                       <span className="text-[23px] font-normal">{t('common.ask-for-demostration')}</span>
                       <div onClick={()=>setShow(false)} className="bg-[#ff4800] cursor-pointer hover:opacity-90 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>
                    </div>

                    <div className="py-6 px-4">

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[300]}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,name:e.target.value})
                            ))} value={data.form.name} placeholder={t('form.full-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                           <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill={colors.app_pimary[300]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                           <input  onChange={(e=>(
                                        data.setForm({...data.form,email1:e.target.value})
                            ))} value={data.form.email1} placeholder={t('form.your-email')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#ff7626"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"></path></svg></span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,contact:e.target.value.replace(/[^0-9]/g, '')})
                            ))} value={data.form.contact} placeholder={t('form.your-contact')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        
                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">
                                <CorporateFareOutlined sx={{color:colors.app_pimary[400]}}/>
                            </span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,company_name:e.target.value})
                            ))} value={data.form.company_name} placeholder={t('form.company-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>


                        <div className="overflow-hidden h-[46px] w-full  max-sm:w-full relative flex items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                           {data.loading && <div className="scale-[0.8]"><CircularIndeterminate color={'#fff'}/></div>}
                           {!data.loading && <button onClick={()=>{
                             validate_email()
                           }} className="w-full h-full bg-[#ff7626] text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in">{t('common.send')}</button>}
                      </div>

                    </div>

                    
                    

                 </div>
    </div>
  )
}

export default Demostration