import { Alert, CircularProgress } from '@mui/material'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/main-white.png'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../../contexts/DataContext'

function VericationDialog({formData,setFormData,setVerified,verified}) {
  const [loading,setLoading]=useState(true)
  const [code,setCode]=useState('')
  const [email,setEmail]=useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const [emailOk,setEmailOk]=useState(false)
  const [codeSent,setCodeSent]=useState(false)
  const [message,setMessage]=useState('')
  const data=useData()


  async function verify(verification_code){
   
        try{
            let res=await data.makeRequest({method:'post',url:`api/${'verify-code'}`,data:{
                email,
                code:verification_code
            }, error: ``},0);

            console.log({res})

            if(res.status==409){
                setMessage(t('messages.email-used'))
                return
            }
    
            if(res.status==404){
                setMessage(t('common.invalid-code'))
            }
           
            setLoading(false)
        }catch(e){
            setLoading(false)
        }
    
  }

 

  useEffect(()=>{
    let res=data._sendFilter(searchParams)
    console.log({res})
    if(verified) setLoading(true)
 },[])



  async function SubmitForm(resend){
        setMessage('')
        toast.remove()

        if(resend){
            setCode('')
        }

        if(!email) {
              toast(t('messages.fill-fields'))
              return
        }

        if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
                toast.error(t('common.invalid-email'))
                return
        }

        if(codeSent && !code && !resend){
                toast.error(t('common.insert-code'))
                return
        }

        

        setLoading(true)

       
       
       try{
        let res=await data.makeRequest({method:'post',url:`api/${resend || !codeSent ? 'send-email-code':'verify-code'}`,data:{
            name:data.form.name,
            email:data.form.email,
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
    <div className={`bg-[rgba(0,0,0,0.4)]  ${0!=0 ? 'translate-y-[10%] opacity-0 pointer-events-none' :'' } transition duration-75 ease-in-out h-[100vh] w-full fixed z-20 flex items-center justify-center`}>

          
            <div className="w-full flex justify-center absolute top-4 left-0 z-10">
                    <img src={Logo} className="w-[170px]"/>
            </div> 

            <div className="flex items-center mt-3 flex-col mb-3 py-3 px-5 rounded-[0.3rem] bg-white relative z-10 w-[400px]">
                
                    {!loading && <>
                        <div class="flex mb-4 items-center  w-full p-3 border-b rounded-t"><h3 class="text-xl font-semibold text-gray-900 ">{t('common.invite-verification')}</h3></div>
                            <div className="w-full">
                            <Alert severity="warning">{t('messages.please-verify-email-to-proceed')}</Alert> 
                            </div>

                            {message  && <div id="alert-2" className="flex items-center w-[310px] p-4 my-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
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

                            <div className="flex-col flex items-center justify-center w-full mt-5">
                                <input onChange={(e)=>{
                                }}  className="p-1 border w-full mb-3 rounded-[0.2rem] h-[40px]" type="password" placeholder={t('common.type-email')} value={code}/>
                                <button className="bg-app_orange-400 w-full text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                        
                                }}>{t('common.send')}</button>  
                        </div>
                    </>}

                    {loading &&  <div className="mt-5 mb-5 flex flex-col items-center">
                            <span className="block mb-2">{t('common.loading')}...</span>
                            <span className="text-app_orange-400"> <CircularProgress/></span>
                     </div>}

                    {codeSent && !loading &&  <span onClick={()=>SubmitForm('resend')} className="text-blue-400 mt-3 underline cursor-pointer flex">{t('common.resend-code')}</span>}
                  

            </div>

          

            

  </div>
  )
}

export default VericationDialog