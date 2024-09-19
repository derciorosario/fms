import { t } from 'i18next'
import React, { useEffect, useState ,useRef} from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import CircularIndeterminate from '../../loaders/progress'
import colors from '../../../assets/colors.json'
import { useHomeData } from '../../../../contexts/HomeDataContext'

function SendProof({message,setMessage,setProofSent}) {

  const [status,setStatus] =  useState()
  const [progress,setProgress]=useState(0)
  const [filename,setFileName] = useState('')
  const [success,setSuccess]=useState(false)

  const {pathname} = useLocation()
  const data = useHomeData()

  useEffect(()=>{
     if(!data.loading && status==500){
        setTimeout(()=>setShow(false),4000)
     }
  },[data.loading,status])


  const fileInputRef = useRef(null);
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileChange(file)
    
    };
    
    const resetInputValue = () => {
        fileInputRef.current.value = '';
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

  
  const handleFileChange = async (event,file) => {
        let {size} = file ? file : event.target.files[0]

        setSuccess(false)

        if(size/1024/1024 > 2){
            toast.error(t('common.file-was-to-be-more-than')+' 2MB')
            return
        }
        const invoice_number=Math.random().toString().slice(2,10)
        data.setLoading(true)
        

        const _formData = new FormData();
        let key=Math.random().toString().slice(3,15)
        _formData.append('from','landingpage');
        _formData.append('from_id','landingpage');
        _formData.append('file',event.target.files[0]);
        _formData.append('key',key);
        _formData.append('invoice',JSON.stringify({id:null,
            approved:false,
            proof:null,
            to_name:data.form.name,
            to_email:data.form.email,
            to_contact:data.form.contact,
            to_company_name:data.form.company_name,
            plan:data.form.plan,
            period:data.form.showAnualPlans ? 'anual' : 'monthly',
            to_last_name:data.form.last_name,
            admin_id:data.form.admin_id,
            type:data.form.type,
            invoice_number,
            changingPlan:data.form.changingPlan,
            payment_method:t('common.transfer'),
            date:new Date().toISOString(),
            key}))


       try{
          resetInputValue()

          const res = await axios.post(data.APP_BASE_URL+'/api/upload-file', _formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress = Math.floor((loaded * 100) / total);
              setProgress(progress)
            }
          });

          data.setLoading(false)
          setSuccess(true)
          setMessage(t('common.wait-for-approval'))
          localStorage.setItem('form',JSON.stringify({...data.form,restart:true,proof_ok:true}))
          let form={...data.form,proof_ok:true}
          setProofSent(true)
          data.update(form)

       }catch(e){
          data.setLoading(false)
          if(e.code=="ERR_NETWORK"){
           setMessage('Verifique sua internet e tente novamente')
          }else{
           setMessage('Erro inesperado! detalhes do erro:'+e)
          }
          setTimeout(()=>setMessage(''),4000)
       }

  }




  return (
    <div className={`bg-white z-20 transition-all ease-in ${data.form.method!='transfer' ? 'hidden':''}  flex items-center flex-col justify-center w-[500px] max-md:w-full mx-auto`}>

         <div className={`${data.loading  || message? 'hidden':'flex'} max-lg:flex-col`}>
        
         <div className="border  overflow-hidden rounded-[0.3rem] table relative w-[300px] max-md:w-full">
                <span className="flex h-[3px] bg-gray-300 top-0 left-0"></span>

                <div className="px-5">
                      <span className="flex border-b py-2 justify-between"><label className="font-bold">{t('common.account-details')}</label><label  className="text-blue-500 hidden cursor-pointer hover:text-blue-600 underline">{t('common.edit')}</label></span>
                </div>

                <div className="px-4 border-b py-1 w-[350px] max-md:w-full [&_p]:my-2">
                    <span className="font-medium">{t('common.account-number')}</span>
                    <p className="flex justify-between">
                        <label className="text-gray-600">00016363509</label>
                    </p>
               </div>

               <div className="px-4 border-b py-1 w-[350px] max-md:w-full [&_p]:my-2">
                    <span className="font-medium">NIB</span>
                    <p className="flex justify-between">
                        <label className="text-gray-600">0430000000166350925</label>
                    </p>
               </div>

               <div className="px-4 w-[350px] max-md:w-full py-1 [&_p]:my-2">
                    <span className="font-medium">IBAN</span>
                    <p className="flex justify-between">
                        <label className="text-gray-600">MZN5900430000000166350925</label>
                    </p>
               </div>
          </div>

         <div className="lg:ml-10 clear-start max-lg:mt-10">     
                  
                  <h2 className="text-[20px] font-semibold mb-3">{t('common.proof')}</h2>
                  <label className="relative">

                    <div onDrop={handleDrop}
                        onDragOver={handleDragOver} className="border-dashed border-2 rounded-[0.3rem] sm:w-[350px] flex items-center flex-col justify-center h-[200px]">
                        <span className="text-gray-400 mb-5">{t('common.get-proof')}</span>
                       
                        <div className="overflow-hidden h-[46px] px-3 relative table items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                         {!data.loading && <button onClick={()=>SubmitForm()} className="w-full h-full bg-[#ff7626] text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in">{t('common.look')}</button>}
                       </div>
                  
                    </div>

                    <input className="absolute left-0 top-0 w-full h-full opacity-0"
                                  type="file"
                                  onChange={handleFileChange }
                                  ref={fileInputRef}
                     />
                  </label>

          </div>


          
         </div>



         
         {(data.loading) &&
                    <div className="flex justify-center flex-col items-center my-10">
                        <div className=""><CircularIndeterminate color={colors.app_pimary[500]}/></div>
                        <span className="flex mt-4">{t('common.wait')}</span>
                    </div>
         }



     




         {success && <div className="flex mb-14 items-center justify-center flex-col">
                 <span className="mb-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="45px" fill="green"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg></span>
                 <p className="text-[20px] mt-1 ml-2 text-green-700">{t('messages.proof-sent')}</p>
                 
          </div>}




      {message &&  <div id="alert-2" className={`flex items-center w-[400px] max-md:w-full p-4 mb-4 ${success ? 'text-green-700 bg-green-50':'text-red-800 bg-red-50'} rounded-lg  dark:bg-gray-800 dark:text-red-400`} role="alert">
        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="ms-3 text-sm font-medium">
           {message}
        </div>
     
      </div>}

          
          <div className="flex justify-center flex-col">
            <div className={`${!data.loading ? 'hidden':' flex justify-center'}`}>
              <div className="spinner-container"><div className="spinner border-t-orange-500"></div></div>
            </div>


            <div className={`${data.loading ? ' opacity-0 pointer-events-none':''}`}>
              <div id="content" className="hide">
                <div id="payment_options" className="w-[350px]"></div>
              </div>
            </div>
          </div>
         
    </div>
    
  );


}

export default SendProof