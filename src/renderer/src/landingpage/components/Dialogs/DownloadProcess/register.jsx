import { t } from 'i18next'
import React, { useState } from 'react'
import colors from '../../../assets/colors.json'
import CircularIndeterminate from '../../loaders/progress'
import toast from 'react-hot-toast'
import EmailImg from '../../../assets/images/email-sent.svg'
import { useHomeData } from '../../../../contexts/HomeDataContext'
import { CorporateFareOutlined } from '@mui/icons-material'

function Register({activePage,setActvePage}) {

  const [emailOk,setEmailOk]=useState(false)
  const [codeSent,setCodeSent]=useState(false)
  const [verified,setVerified] = useState(true)
  const data=useHomeData()
  const [message,setMessage]=useState('')


  async function SubmitForm(resend){
        setMessage('')
        toast.remove()

        if(resend){
              data.setForm({...data.form,code:''})
        }


        if(!data.form.email || !data.form.name || !data.form.contact || !data.form.company_name || !data.form.last_name) { 
              toast(t('messages.fill-fields'))
              return
        }

        if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email))){
                toast.error(t('common.invalid-email'))
                return
        }

        if(codeSent && !data.form.code && !resend){
                toast.error(t('common.insert-code'))
                return
        }

        data.setLoading(true)       
       
       try{
        let res=await data.makeRequest({method:'post',url:`api/${resend || !codeSent ? 'send-email-code':'verify-code'}`,data:{
            name:data.form.name,
            email:data.form.email,
            company_name:data.form.company_name,
            period:data.form.showAnualPlans ? 'anual' : 'monthly',
            plan:data.form.plan,
            last_name:data.form.last_name,
            contact:data.form.contact,
            code:data.form.code
        }, error: ``},0);

        data.setLoading(false)

        if(res.status==409 && (!codeSent || resend)){
            setMessage(t('messages.email-used'))
            return
        }

        if(res.status==404){
            setMessage(t('common.invalid-code'))
        }

        setEmailOk(true)
        setCodeSent(true)

        if(codeSent && !resend && res.status==200){
            data.setForm({...data.form,done:1,email_is_registered:res.email_is_registered})
            data.update({...data.form,done:1,email_is_registered:res.email_is_registered})
            toast.success(t('common.code-ok'))
            setVerified(true)
            
        }

       

        if(codeSent && !resend && res.status==409){
            toast.error('messages.email-used')
        }
  
       }catch(e){
        if(e.code=="ERR_NETWORK"){
            setMessage(t('common.check-network'))
        }else{
            setMessage(t('messages.try-again'))
        }
        data.setLoading(false)
        console.log(e)
       }
  }

  return (
    <div className="mb-10">
         {(!codeSent  && data.form.done==0) && <div className="flex flex-col justify-center items-center">
                <h2 className="text-center max-w-[300px] max-sm:w-full text-[23px] font-semibold mb-10">{t('titles.fill-fields')}</h2>

             

                <div className={`${data.loading ? 'opacity-70 pointer-events-none':''} max-sm:w-full`}>
                    <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                        <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[300]}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></span>
                        <input  onChange={(e=>(
                                    data.setForm({...data.form,name:e.target.value})
                        ))} value={data.form.name} placeholder={t('form.name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                    </div>

                    <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                        <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[300]}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></span>
                        <input  onChange={(e=>(
                                    data.setForm({...data.form,last_name:e.target.value})
                        ))} value={data.form.last_name} placeholder={t('form.last-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                    </div>

                    <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                        <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill={colors.app_pimary[300]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                        <input  onChange={(e=>(
                                    data.setForm({...data.form,email:e.target.value})
                        ))} value={data.form.email} placeholder={t('form.email')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                    </div>

                    <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#ff7626"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"></path></svg></span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,contact:e.target.value.replace(/[^0-9]/g, '')})
                            ))} value={data.form.contact} placeholder={t('form.your-contact')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        
                        <div className="w-[340px] max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">
                                <CorporateFareOutlined sx={{color:colors.app_pimary[400]}}/>
                            </span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,company_name:e.target.value})
                            ))} value={data.form.company_name} placeholder={t('form.company-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>
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
            </div>}


            {(codeSent && !data.loading && data.form.done==0) && <div className="flex items-center justify-center  flex-col">

            <img src={EmailImg} className="w-[100px] mb-6"/>

                    <h2 className="text-center text-[16px] font-semibold">{t('common.email-sent')}:</h2>
                    <div className="mb-10 flex items-center mt-2 max-sm:flex-col">
                        <span className="">{data.form.email}</span>
                        <span onClick={()=>{
                            setCodeSent(false)
                            setMessage('')
                        }} className="text-blue-400  flex max-sm:mt-3  underline cursor-pointer ml-3">{t('common.edit')} email</span>
                    </div>
                    <div className="w-[340px]  max-sm:w-full">

                    {message  && <div id="alert-2" className="flex items-center w-full p-4 my-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
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
                    </div>

                    <div className="w-[340px] max-sm:w-full pr-2 items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                        <input  onChange={(e=>(
                                    data.setForm({...data.form,code:e.target.value})
                        ))} value={data.form.code} placeholder={t('common.code')} className="flex-1 h-full outline-none px-2 bg-transparent"/>
                    </div>

                    <div className="overflow-hidden h-[46px] w-[340px] max-sm:w-full relative flex items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                        {data.loading && <div className="scale-[0.8]"><CircularIndeterminate color={'#fff'}/></div>}
                        {!data.loading && <button onClick={()=>SubmitForm()} className="w-full h-full bg-[#ff7626] text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in">{t('common.confirm')}</button>}
                    </div>

                    <span onClick={()=>SubmitForm('resend')} className="text-blue-400 mt-3 underline cursor-pointer flex">{t('common.resend-code')}</span>
                    </div>
                 }


                  {(data.loading && codeSent) &&
                    <div className="flex justify-center flex-col items-center my-10">
                        <div className=""><CircularIndeterminate color={colors.app_pimary[500]}/></div>
                        <span className="flex mt-4">{t('common.wait')}</span>
                    </div>
                 }


                 {data.form.done != 0 && <div className="w-full flex items-center flex-col mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"></path></svg>
                       
                        <span className="font-semibold text-center">{t('messages.your-email-was-verified')}</span>
                        <span className="mb-6 mt-2 flex text-[14px]">({data.form.email})</span>

                      
              </div>}


              {(data.form.done != 0) && <div className="flex items-center justify-center mt-3">
                <button onClick={()=>{
                    setActvePage(activePage + 1)
                }} className="rounded-[0.3rem] flex items-center cursor-pointer hover:opacity-70 bg-green-600 text-white px-2 py-1">
                   <span className="ml-1"> {t('common.next')}</span>
                   <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#fff"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
               </button>
            </div>}

            {data.form.done != 0 &&  <span onClick={()=>{
                            setCodeSent(false)
                            setMessage('')
                            let new_form={...data.form,done:0,email:'',email1:''}
                            data.setForm(new_form)
                            data.update(new_form)
                        }} className="text-blue-400 flex justify-center mt-5 underline cursor-pointer">{t('common.use-different-email')}</span>
             }

    </div>
  )
}

export default Register