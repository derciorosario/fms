import React, { useState,useEffect } from 'react';
import FirstUsePerson from './forms/personal';
import FirstUseCompany from './forms/company';
import FirstUseLincense from './forms/lincense';
import {  CircularProgress} from '@mui/material';
import colors from  '../../assets/colors.json'
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
import PageLoader from '../../components/progress/pageLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LinearProgressBar from '../../components/progress/LinearProgress';
import VericationDialog from './compnents/verification-dialog';


function FirstUse() {
  const data = useData()
  const [currentPage,setCurrentPage]=useState(0)
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState([])
  const [validated,setValidated]=useState(false)
  const [login,setlogin]=useState(false)
  const [initialized,setinitialized]=useState(false)
  const [invite,setinvite]=useState(null)
  const [userExists,setUserExists]=useState(false)
  const [verified,setVerified] = useState(true)
  const [valid,setValid]=useState({
    personal:false,
    company:false,
    key:false
  })

  
  if(!localStorage.getItem('dbs')) localStorage.setItem('dbs',JSON.stringify([]))

  let langs=['pt','en']
  const [selectedLang, setSelectedLang] = React.useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : langs[0]);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng)
    localStorage.setItem('lang',lng)
};
  

  const {user} = useAuth()

  const [useExistingAccount,setUseExistingAccount]=useState(false)
  const [inviteStatus,setInviteStatus]=useState(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate =  useNavigate()
  

  const [upload,setUpload]=React.useState({
    uploading:false,
    file:{},
    progress:0
  })
  

  let initial_form={
    personal:{
       name:'',
       last_name:'',
       email:'',
       password:'',
       state:'',
       address:'',
       contact_code:'1',
       contact:''
    },
    company:{
       name:'',
       address:'',
       email:'',
       nuit:'',
       contact_code:'1',
       contact:'',
       key:'',
       logo:{}
    },
    key:''
 }
  const [formData,setFormData]=useState(initial_form)


  const {pathname} = useLocation()

  const IsRegister=pathname.replaceAll('/','').startsWith('confirm-invite')


  useEffect(()=>{
     let _valid={
        personal:true,
        company:true,
        key:true
      }

      if(formData.personal.name.trim().length < 2 ||
         formData.personal.last_name.trim().length < 2 ||
         !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())) ||
         formData.personal.password.length < 8 ||
         formData.personal.contact.length != 9 ||
         formData.personal.address.length < 3  ||
         !formData.personal.state && formData.personal.contact_code=="258"
      ){
        _valid.personal=userExists ? true : false
      }

      if(formData.company.name.length <= 2 ||
      !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company.email.trim())) ||
      formData.company.contact.length != 9 ||
      formData.company.nuit.length != 9 &&  formData.company.contact_code=="258" ||
      formData.company.address.length < 3  ||
      (!formData.company.state && formData.company.contact_code=="258")
      
      
        ){
           _valid.company=false
        }

        if(formData.key.length != 12) {
            _valid.key=false
        }

      setValid(_valid)
      setTimeout(()=> localStorage.setItem('setupdata',JSON.stringify({...formData,key:formData.key,personal:{...formData.personal,password:''}})),1000)
  },[formData])


  console.log({code:formData.company.contact_code})


async function get_invite_info(id){
     toast.remove()
    try{

      let response = await data.makeRequest({method:'get',url:`api/get-invite-info/`+id, error: ``},0);
     
      if(response.invalid){
        toast.error(t('common.invite-invalid'))
        setInviteStatus('invalid')
      }else if(response.used){
        toast.error(t('common.invite-used'))
        setInviteStatus('used')
      }else if(response.data){
        setInviteStatus('not_started')  
        setFormData({...formData,personal:{...formData.personal,...response.data}})
      }else{
        setInviteStatus('started')  
      }

      setinitialized(true)

    }catch(e){
      toast.remove()

        if(e.response){
                
            if(e.response.status==400){
                toast.error(t('common.invalid-data'))
            }
            if(e.response.status==404){
              toast.error(t('common.item-not-found'))
            }
            if(e.response.status==500){
              toast.error(t('common.unexpected-error'))
            }
          
            
      }else if(e.code=='ERR_NETWORK'){
          toast.error(t('common.check-network'))
      }else{
          console.log(e)
          toast.error(t('common.unexpected-error'))
      }
      
      setLoading(false)
      setinitialized(true)
         
    }


}

  const [v,setV] = useState()
 
  useEffect(()=>{
        if(localStorage.getItem('setupdata') && !IsRegister){
             setFormData(JSON.parse(localStorage.getItem('setupdata')))
        }

        if(localStorage.getItem('first-company-created-message')){
           setlogin(true)
           setCurrentPage(2)
        }
        let res=data._sendFilter(searchParams)

        if(!IsRegister || !res.invite){
             setinitialized(true)
        }else{
             get_invite_info(res.invite)
           
        }  
        setinvite(res.invite)

        if(res.invite){
          setCurrentPage(1)
        }

        

  },[pathname,data.online])




  useEffect(()=>{

    setInterval(()=>setV(Math.random()),2000)
   
    setFormData({...formData,company:{...formData.company,logo:upload.file}})
   
 },[upload])



 async function firstStart(data){

       try{
        setLoading(false)
        let u=new PouchDB('user')
        let docs=await u.allDocs({ include_docs: true })
        let user=docs.rows.map(i=>i.doc)[0]
  
        if(user){
           u.put({id:data.user.id,_rev:user._rev,_id:user._id})
        }else{
           u.put({_id:'user',id:data.user.id})
        }

        let user_db=new PouchDB('user-'+data.user.id)
        user_db.createIndex({index: { fields: ['id'] }})
        let _user=await  user_db.find({selector: { id:data.user.id }})
        _user=_user.docs[0]

        if(_user){
          user_db.put({...data.user,_rev:_user._rev,_id:_user._id})
        }else{
          await user_db.put(data.user)
        }

       


        if(data.settings){

          let user_settings=new PouchDB(`settings-${data.user.id}-${data.user.selected_company}`)
          let docs=await user_settings.allDocs({ include_docs: true })
          let settings=docs.rows.map(i=>i.doc)[0]

          if(!settings){
            await user_settings.put(data.settings)
          }else{
            await  user_settings.put({...data.settings,_rev:settings._rev})
          }
         
        }

       
       
        let dbs=JSON.parse(localStorage.getItem('dbs'))

        for (let i = 0; i < dbs.length; i++) {
           /// await dbs[i].destroy()
        }

        localStorage.setItem('token',data.token)
        localStorage.setItem('go_to_app',true)
        setlogin(true)
        localStorage.setItem('first-company-created-message',true)
        setFormData(initial_form)
       }catch(e){
          toast.error('Fatal error: '+e)
       }
       
  }


  function handle_request_error(e,from){
    console.log(e)
    toast.remove()
     if(e.response){
           if(e.response.status==400){
              toast.error(t('common.invalid-data'))
           }
           if(e.response.status==404){
              toast.error(t('common.item-not-found'))
           }

           if(e.response.status==409){
            toast.error('Usuário já existe')
           }
           if(e.response.status==500){
              toast.error(t('common.unexpected-error'))
           }
           
     }else if(e.code=='ERR_NETWORK'){
          toast.error(t('common.check-network'))
     }else{
          console.log(e)
          toast.error(t('common.unexpected-error'))
     }

  }




  async function SubmitForm(from){
        setLoading(true)
        setErrors([])
        toast.loading(from=="invite" ? t('common.loading')+`...`: t('common.validating-invite')+`...`)
        
  

        if(from=="check_code"){
         
          try{

            let response = await data.makeRequest({method:'get',url:`api/get-key-info/`+formData.key, error: ``},0);
            toast.remove()
            if(response.status==404){
              toast.error(t('common.invite-used-or-ivalid'))
            }else{
  
              if(response.user) setUserExists(true)
  
              let personal
  
              if(response.user){
                personal={...formData.personal,...response.user,password:'',contact:response.user.contacts[0]}
              }else{
                personal={...formData.personal,email:response.info.send_email}
              }
  
              setFormData({...formData,personal})
              setCurrentPage(response.user ? 2 : 1)
              
            }
  
            setLoading(false)

          }catch(e){
            setLoading(false)
            handle_request_error(e,from)
          }
          return
        }




        try{

        let response=from=="invite" ? await data.makeRequest({method:'post',url:`api/register-from-invite`,data:{
          a:formData.personal,
          invite,
          lang:i18n.lang
        }, error: ``},0)
       
       : 

       await data.makeRequest({method:'post',url:`api/company/setup`,data:{
        c:formData.company,
        a:formData.personal,
        key:formData.key,
        lang:i18n.lang
     }, error: ``},0)

       


        toast.remove()

        if(from=="invite"){


          toast.success(t('common.user-added'))

          navigate('/login?registration-success&email='+formData.personal.email)


          return
        }


        setValidated(true)

        if(response.data){
            setErrors([])
            firstStart(response.data)
        }else{
            setLoading(false)
            setErrors(response.errors)
            toast.error(t('common.invalid-data'))
        }


       }catch(e){
        
        handle_request_error(e,from)
        setLoading(false)
        setErrors([])
         
       }
       setLoading(false)
       
 }



  const pages=[
    {name:t('common.access-key'),text:t('messages.insert-key-msg')},
    {name:t('common.personal-info'),text:t('messages.personal-info-msg')},
    {name:t('common.company'),text:t('common.register-company')},
  ]


  
  function clear_errors(){
    setValidated(false)
    setErrors([])
  }

  

  



  if(!initialized){
     return <PageLoader/>
  }


  return (
<>



{/*(!verified && invite) && <VericationDialog formData={formData} setFormData={setFormData} verified={verified} setVerified={setVerified}/>*/}

<div class={`min-h-screen p-6 bg-slate-100 items-center justify-center relative ${invite && !verified ? 'hidden':'flex'}`}>
  <div class="container max-w-screen-lg mx-auto">
    <div>

      <div class="bg-white rounded shadow-lg mb-6 relative overflow-hidden">
        {(inviteStatus==null && invite) && <div className="absolute top-0 left-0 w-full  overflow-hidden">
                          <LinearProgressBar />
        </div>}
        <div className="absolute right-2 top-2">
         <select onChange={(e)=>changeLanguage(e.target.value)} value={selectedLang} className=" rounded-[0.1rem] p-1 bg-gray-200 text-gray-500">
            <option value={"pt"}>PT</option>
            <option value={"en"}>EN</option>
         </select>
        </div>
        <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">

          <div class={`text-gray-600  flex flex-col justify-between bg-gray-50 px-8 py-10 border-r border-[rgba(0,0,0,0.04)] ${login || IsRegister ? 'hidden':''}`}>
           
               <div>
                  <p class="font-semibold text-[19px] mt-7">{t('common.step')} {currentPage + 1}</p>
                  
                  <p className="text-gray-400 mt-3 text-[15px]">{pages[currentPage].text}</p>
                  <div className="mt-10 relative">
                        <span className="w-[1px] flex h-[96%] translate-y-[3%] -z-2 bg-slate-200 left-[15px] top-0 absolute"></span>

                        {pages.map((i,_i)=>(
                                    <div className="flex mb-7 relative z-10 items-center"><span className={`flex w-[30px] h-[30px] rounded-full items-center ${currentPage==_i ? 'text-white  bg-app_orange-300 font-semibold':'text-app_black-300  bg-slate-200'} justify-center  mr-3`}>{_i+1}</span> <span className={`${currentPage==_i ? 'font-semibold':' text-gray-400'}`}>{i.name}</span></div>
                        ))}
                  </div>
               </div>
               
               <div>
                  <button onClick={()=>{
                            navigate('/login')
                    }} class={`bg-app_orange-300 hover:bg-app_orange-400 text-white font-bold py-2 px-4 rounded border-b-app_orange-300 border-b-2`}>  <ArrowBack style={{width:15}}/><span className="ml-1"> login</span></button> 
               </div>
          </div>

          <div class={`md:col-span-${IsRegister ? '3' : '2'} p-12`}>

           {!IsRegister ? <div className={`mb-10 ${(login || errors.length) ? 'hidden':''}`}>
                    <p class="font-semibold text-[19px] mt-7">{pages[currentPage].name}</p>
                    <p className="text-gray-400 mt-3 text-[15px]">{t('messages.personal-info-msg')}</p>
            
            </div> : <div className={`mb-10`}>

                    <p class="font-semibold text-[19px] mt-7">{t('common.access-invite')}</p>
                    <p className="text-gray-400 mt-3 text-[15px]"><span className="mr-3 inline-flex text-app_orange-500">{!invite ? 'Convite não encontrado!' : inviteStatus=="invalid"  ? "Este convite não é valido" : inviteStatus=="not_started" ? t('messages.confirm-invite-data') : inviteStatus!=null ?  "Está conta ja foi registrada":"Verifique sua internet (a conectar...)"}</span>  </p>
                    <span className="flex mt-4 justify-end">
                      {(inviteStatus=="used" || inviteStatus=="started") && <>
                        <label onClick={()=>navigate('/recover-password')} className="hover:opacity-75 inline-flex text-app_orange-400 underline cursor-pointer">{t('common.recover-password')}</label>
                        <label className="mx-2 text-gray-200">|</label>
                      </>}
                      <label onClick={()=>navigate('/login')} className="hover:opacity-75 inline-flex text-app_orange-400 underline cursor-pointer">Login</label>
                      <label className="mx-2 text-gray-200">|</label>
                      <label className="hover:opacity-70 cursor-pointer inline-flex text-app_orange-400 underline" onClick={()=>navigate('/new-company')}>{t('common.register-company')}</label>
                    </span>
            </div>}
            

            {/*{login && <label className="inline-flex items-center mb-4 -translate-x-2 cursor-pointer hover:opacity-95">
              <Checkbox
                checked={useExistingAccount}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={()=>{
                    setUseExistingAccount(!useExistingAccount)
              }}/>
              <span>Utilizar conta de email já cadastrado na plataforma!</span>
            </label>}*/}
           

            <div class={`grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5`}>
              
              {((currentPage == 0 || validated || login) && !invite) && <FirstUseLincense login={login} currentPage={currentPage} clear_errors={clear_errors} errors={errors} setErrors={setErrors} formData={formData} setFormData={setFormData}/>}
              {((currentPage == 1) && ((inviteStatus!=null) && !(!invite && IsRegister) && (inviteStatus!="invalid" &&  inviteStatus!="used" && inviteStatus!="started") || (currentPage==1 && !invite))) &&   <FirstUsePerson exists={userExists} IsRegister={IsRegister} useExistingAccount={useExistingAccount} formData={formData} setFormData={setFormData}/>}
              {(currentPage == 2 && !validated && !login) && <FirstUseCompany upload={upload} setUpload={setUpload} formData={formData} setFormData={setFormData}/>}
            
              <div class={`md:col-span-5 text-right mt-10 ${login || IsRegister ? 'hidden':''}`}>
                <div class={`${loading ? 'hidden':'inline-flex'}`}>
                 
                  {currentPage==1 && <span onClick={()=>{
                      setFormData(initial_form)
                      setCurrentPage(0)
                      setUserExists(false)
                  }} className="text-blue-400 mt-1 hover:opacity-70   underline cursor-pointer">{t('common.use-another-key')}</span>
                   
                   }
                  <button onClick={()=>setCurrentPage((p)=>p-=1)} class={`text-app_black-600 ${currentPage==0 || currentPage==1 ? 'opacity-0 pointer-events-none':''} font-semibold py-2 px-4 rounded`}>Voltar</button>
                  <button onClick={()=>{


                     if(errors.length) return

                    if((currentPage==0 && !valid.key) || (currentPage==1 && !valid.personal) || (currentPage==2 && !valid.company)){
                        return
                    }else if(currentPage==0 && valid.key){
                        SubmitForm('check_code')
                        return
                    }else if(currentPage==2 && valid.company){
                         SubmitForm()
                         return
                    }

                    setCurrentPage((p)=>p+=1)
                  }} class={`${(currentPage==0 && !valid.key) || (currentPage==1 && !valid.personal) || errors.length || (currentPage==2 && !valid.company) ? ' bg-gray-300 cursor-not-allowed':'bg-app_orange-300 hover:bg-app_orange-400'} ${currentPage==2 && valid.key ?' bg-app_orange-500':''} text-white font-bold py-2 px-4 rounded`}>{currentPage==2 ? t('common.send') :t('common.next')}</button>
                </div>

               {loading && <span className="scale-70 inline-block"><CircularProgress style={{color:colors.app_orange[500]}} /></span>}
             
              </div>
              


              <div class={`md:col-span-5 text-right mt-10 ${(!IsRegister || (inviteStatus=="invalid" || inviteStatus=="used" || inviteStatus=="started") || (!invite && IsRegister) )  ? 'hidden':''}`}>
                <div class={`${loading ? 'hidden':'inline-flex'}`}>
                 <button onClick={()=>{
                         SubmitForm('invite')
                    
                  }} class={`${(currentPage==0 && !valid.key) ? ' bg-gray-300 cursor-not-allowed':'bg-app_orange-300 hover:bg-app_orange-400'} text-white font-bold py-2 px-4 rounded`}>{t('common.send')}</button>
                </div>

               {loading && <span className="scale-70 inline-block"><CircularProgress style={{color:colors.app_orange[500]}} /></span>}
             
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
    </>

           
  )

}

export default FirstUse

