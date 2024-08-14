import React, { useEffect, useState } from 'react';
import { useNavigate,Link, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth  } from '../../contexts/AuthContext';
import { useData  } from '../../contexts/DataContext';
import SelectCompany from '../../components/Dialogs/selectCompany';
import { Alert, CircularProgress } from '@mui/material';
import { Close, Lock, LockOpen } from '@mui/icons-material';
import bcrypt from 'bcryptjs';
import Logo from '../../assets/main-logo.png'
import SlideImg1 from '../../assets/login-slide-1.svg'
import PageLoader from '../../components/progress/pageLoader';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';


function App() {
   const {login,user,reload,setReload} = useAuth()
   const navigate=useNavigate()
   const {makeRequest,_clearData, _sendFilter} = useData();
   const [email, setEmail]=React.useState('')
   const [password, setPassword]=React.useState('')
   const [companies, setCompanies]=React.useState([])
   const [loading, setLoading]=React.useState(false)
   const [loginRespose, setLoginResponse]=React.useState(null)
   const {pathname} = useLocation()
   const [recoverPassword, setRecoverPassword]=React.useState(pathname.replaceAll('/','').startsWith('recover-password'))
   const [initialized,setinitialized]=React.useState(false)
   const [registrationSuccess,setRegistrationSuccess]=React.useState('')
   const [searchParams, setSearchParams] = useSearchParams();
   const [showLogPassword,setShowLogPassword]=React.useState(false)
   const [logPassword,setLogPassword]=React.useState('')
   const [logPasswordOk,setLogPasswordOk]=React.useState(false)
   const [locked,setLocked]=React.useState(false)
   const [imageLoaded, setImageLoaded] = useState(false);
   const [mainImageLoaded,setMainImageLoaded] = useState(false)
   

   const handleKeyPress = (event) => {
    if (event.key == 'Enter') {
       handleLogin();
    }
  };

   React.useEffect(()=>{
        setinitialized(true)

        if(!user) return
     
         let companies=user.companies_details.map(i=>{
            return {...i,is_admin:i.admin_id==user.id ? true : false}
         })
       
         setLoginResponse({user:{...user,companies_details:companies},token:user.token})

         if(localStorage.getItem('l') && !logPasswordOk && user){
            setLocked(true)
            return
          } 

          if(window.location.hash.includes('login?registration-success')) return

          setCompanies(companies)
      
   },[user])

   async function check_password(){
        if(!logPassword){
            return
        }

        let check=await bcrypt.compare(logPassword, user.password)
        if(!check){
            toast.error(t('common.wrong-password'))
            return
        } 
        

        setLogPasswordOk(true)
        localStorage.removeItem('l')
        setShowLogPassword(false)
        setLocked(false)
        setLogPassword('')
        setCompanies(loginRespose.user.companies_details)
   }


   React.useEffect(()=>{

        setRecoverPassword(pathname.replaceAll('/','').startsWith('recover-password'))
        setRegistrationSuccess(window.location.hash.includes('login?registration-success'))

        let res=_sendFilter(searchParams)
        if(res.email) setEmail(res.email)

   
   },[pathname])

   React.useEffect(()=>{

     setTimeout(()=>setImageLoaded(true),5000)

  },[])

  React.useEffect(()=>{
    if(reload && reload!=pathname){
        navigate(reload)
    }
 },[reload])

 useEffect(()=>{
    if(reload==pathname)   window.electron.ipcRenderer.send('reload')
  },[reload,pathname])


  let langs=['pt','en']
  const [selectedLang, setSelectedLang] = React.useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : langs[0]);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng)
    localStorage.setItem('lang',lng)
};







   async function handleChosenCompany(company){
        setCompanies([])
        if(!company) return

        setLoading(true)


        if(loginRespose.token) localStorage.setItem('token',loginRespose.token);
        let res=await login({...loginRespose.user,selected_company:company.id},loginRespose.token)
        
        if(!res.ok){
             toast.error(t('common.unkown-error-see-details')+` ${res.error}`)
             setLoading(false)
             return
        }

        navigate('/')
   }

   
   
   async function handleLogin(){

        setRegistrationSuccess(false)

        //setLoginResponse(null)
        toast.remove()

        if(((!email || !password) && !recoverPassword) || (!email && recoverPassword)){
            toast.error(t('common.fill-fields'))
            return
        }else if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))){
            toast.error(t('common.invalid-email'))
            return
        }

        
        setLoading(true)

        try{
            let response = await makeRequest({method:'post',url:recoverPassword ? 'auth/recover-password' : `auth/login`,data:{password,email}, error: ``},0);
            toast.remove()
            setLoading(false)
            if(!recoverPassword) setEmail('')
            setPassword('')

            if(recoverPassword){
                toast.success(t('common.email-sent-2'))
                setRecoverPassword(false)
                _clearData()
                return
            }
           
            if(response.user.companies.length==0){
                toast.error(t('common.email-not-ass'))
                return
            }
            setCompanies(response.user.companies_details.map(i=>{
                return {...i,is_admin:i.admin_id==response.user.id ? true : false}
            }))
            _clearData()
            setLoginResponse(response)
        }catch(e){
            toast.remove()
            setLoading(false)
            
          if(e.response){
                if(e.response.status==404){
                    toast.error(t('common.user-not-found'))
                }
                if(e.response.status==401){
                    toast.error(t('common.wrong-password'))
                    setPassword('')
                }
                if(e.response.status==400){
                    toast.error(t('common.invalid-data'))
                }
                if(e.response.status==500){
                    toast.error(t('common.unexpected-error'))
                }
                
          }else if(e.code=='ERR_NETWORK'){
               toast.error(t('common.check-network'))
          }else{
               toast.error(t('common.unexpected-error'))
          }

          
          
          return
        
        }

       
   } 





if(!initialized) {
     return <></>
} 
  


  return (
              <> 
                       
                      {!imageLoaded && <PageLoader/>}
                      <div className={`bg-[rgba(0,0,0,0.4)]  ${!showLogPassword ? 'translate-y-[10%] opacity-0 pointer-events-none' :'' } transition duration-75 ease-in-out h-[100vh] w-full fixed z-20 flex items-center justify-center`}>
                     
                         
                        <div className="flex w-full h-full absolute left-0 top-0" onClick={()=>setShowLogPassword(false)}></div>
                   
                        <div className="flex absolute top-6 left-6 cursor-pointer hover:opacity-65" onClick={()=>setShowLogPassword(false)}>
                            <div className="mr-2 shadow-sm  bg-app_orange-400 flex items-center justify-center rounded-sm">
                                <Close sx={{color:'#fff'}}/>
                            </div>
                            <span className="text-white">{t('common.close')}</span>
                        </div>

                       

                        <div className="flex items-center mt-3 mb-3 p-3 rounded-[0.3rem] bg-white relative z-10">
                                <span className="text-gray-500 mr-2"> <Lock /></span>
                                <input onChange={(e)=>{
                                setLogPassword(e.target.value)
                                }}  className="p-1 border rounded-[0.2rem] h-[40px]" type="password" placeholder={t('common.type-password')} value={logPassword}/>
                                <button className="bg-app_orange-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                        check_password()    
                                }}>{t('common.login')}</button>  
                        </div>
                 
                
                      </div>
                      <SelectCompany res={handleChosenCompany} items={companies} show={companies.length!=0}/>

                        <section className="bg-white flex  md:h-screen max-md:min-h-[100vh] relative">

                        <div className="absolute right-2 top-2">
                                <select onChange={(e)=>changeLanguage(e.target.value)} value={selectedLang} className=" rounded-[0.2rem] p-1 bg-gray-100 text-gray-600">
                                    <option value={"pt"}>PT</option>
                                    <option value={"en"}>EN</option>
                                </select>
                        </div>

                        {(!locked && user && user.companies?.length!=0) &&  <div onClick={()=>{
                              setLocked(true)
                              setLogPasswordOk(false)
                              localStorage.setItem('l',true)
                              setLogPassword('')
                           }} className="flex items-center absolute bottom-2 right-3">
                                         <span className="text-gray-500 mr-2"> <Lock sx={{width:18}} /> </span>
                                         <label className="text-black cursor-pointer hover:opacity-80 font-normal text-[14px] items-center justify-center underline">{t('common.lock')}</label>
                                      </div>
                           }
                            
                        <div className="w-[50%] h-full bg-gray-50 max-md:hidden   justify-center flex items-center flex-col lg:p-24 p-10 max-sm:p-10">

                           
                              {!window.electron &&  <span onClick={()=>{
                                            if(!window.electron){
                                                localStorage.removeItem('go_to_app')
                                                window.location.href="/"
                                            }
                              }} className="bg-app_orange-400 absolute left-2 top-2 text-white px-3 py-1 rounded-[0.3rem] cursor-pointer hover:underline">{t('common.home')}</span>
}
                              <div className={`flex py-5 h-full ${!imageLoaded ? 'h-0 overflow-hidden':''}`}>
                                 <img src={SlideImg1} className="w-full" onLoad={()=>{
                                   setImageLoaded(true)
                                 }}/>
                              </div>


                              <div className="">
                                  <h2 className={`font-semibold ${!imageLoaded ? 'text-[30px]':'text-[22px]'} mb-2  text-app_orange-400`}>Seu negócio sempre na mão</h2>
                                 
                                 
                                  <div className="flex items-center mt-2">
                                        <div className="flex items-center mr-5">                
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill={'#ff944d'}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                                            <span className="text-gray-400 ml-1 text-[15px] hover:underline"><a href="mailto:proconta@alinvest-group.com" target="_blank">proconta@alinvest-group.com</a></span>
                                        </div>

                                        <div className="flex items-center mr-5">                
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#ff944d"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                                        <span className="text-gray-400 text-[15px] ml-1"><a>+258 87 870 7590</a></span>  </div>
                                  </div>

                            </div>
                                    
                         </div>

   
                           <div className="flex items-center justify-center px-6 py-8 mx-auto max-md:w-full">

                            <div className="w-full bg-white rounded-[0.3rem] relative  md:min-w-[390px]  xl:p-0">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">

                               


                             <div className="w-full min-h-[80px] flex justify-center">
                                        <div className={`${!window.electron  ? 'cursor-pointer ':''} ${!mainImageLoaded ? 'opacity-0 pointer-events-none':''}`} onClick={()=>{
                                            if(!window.electron){
                                                localStorage.removeItem('go_to_app')
                                                window.location.href="/"
                                            }
                                        }}>
                                            <img src={Logo} className="h-[30px]" onLoad={()=>{
                                            setMainImageLoaded(true)
                                        }}/>
                                        </div>
                              </div>
                                  
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl flex items-center justify-between">
                                         <span>{recoverPassword ? t('common.recover-password') : 'Login'}</span>{(recoverPassword && !loading) && <span onClick={()=>setRecoverPassword(false)} className="cursor-pointer font-normal text-[14px] hover:opacity-80 underline">{t('common.go-back')}</span>}
                                        
                                         {((loginRespose && !loading && !companies.length) && !recoverPassword && user.companies?.length!=0) &&  <span onClick={()=>{
                                            if(locked){
                                                setShowLogPassword(true)
                                                return
                                            }
                                            setCompanies(loginRespose.user.companies_details)
                                         }} className="flex text-black cursor-pointer hover:opacity-80 font-normal text-[14px] items-center justify-center underline decoration-app_orange-100 underline-offset-2">{locked && <span className="text-gray-500 mr-2"> <LockOpen sx={{width:18}} /> </span>} {t('common.select-company')}</span>}
                                        
                                    </h1>
                                    <div className="max-mad:w-full w-[350px]">
                                            {recoverPassword && <Alert severity="info">{t('messages.recover-password-msg')}</Alert>}
                                    </div>
                                    <div className="max-md:w-full w-[350px]">
                                            {registrationSuccess && <Alert severity="success">{t('messages.account-created-msg')}</Alert>}
                                    </div>
                                    <div className="space-y-4 md:space-y-6" action="#">
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                            <input id="login-email-input" onKeyDown={handleKeyPress} value={email} onChange={(e)=>setEmail(e.target.value)} type="email" name="email" className={`bg-gray-50 border ${loading ? 'opacity-40 pointer-events-none':''} border-gray-300 text-gray-900 sm:text-sm rounded-[0.3rem] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`} placeholder={t('common.email-mask')} required=""/>
                                        </div>
                                       {!recoverPassword && <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">{t('common.password')}</label>
                                            <input onKeyDown={handleKeyPress} value={password} onChange={(e)=>setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className={`bg-gray-50 border ${loading ? 'opacity-40 pointer-events-none':''} border-gray-300 text-gray-900 sm:text-sm rounded-[0.3rem] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}  required=""/>
                                        </div>}
                                        <div className="flex items-center justify-between hidden">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300" required=""/>
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="remember" className="text-gray-500">Lembrar de mim</label>
                                                </div>
                                            </div>
                                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Esqueceu sua senha?</a>
                                        </div>
                                        <button onClick={handleLogin}  className={`w-full relative text-white ${loading ? 'pointer-events-none' :''} ${password && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) ? 'bg-app_orange-400':'bg-app_orange-400  '} hover:bg-primary-700 font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center`}>
                                             <span className={`${loading ? 'opacity-0':''}`}>{recoverPassword ? t('common.send') :  t('common.login')}</span>
                                            <div className={`${!loading ?'hidden':''} -scale-50 absolute left-0 top-0 h-full w-full`}>
                                               <CircularProgress style={{color:'#fff'}} />
                                            </div>
                                        </button>
                                        
                                         <div className={`flex items-center justify-between ${loading ? 'opacity-0':''}`}>
                                            <p className={`text-sm font-light text-gray-500 `}>
                                                <a className="font-medium text-primary-600 hover:underline cursor-pointer" onClick={()=>navigate('/new-company')}>{ t('common.register-company')}</a>
                                            </p>

                                            {!recoverPassword && <p onClick={()=>setRecoverPassword(true)} className="text-sm font-normal cursor-pointer hover:underline  text-gray-500 ">
                                                {t('common.recover-password')}
                                            </p>}
                                         </div>
                                         
                                    </div>
                                </div>




                                <div className="max-md:flex items-center justify-center hidden mt-5 mb-2">
                                        <div className="flex items-center mr-5">                
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill={'#ff944d'}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                                            <span className="text-gray-400 ml-1 text-[15px] hover:underline"><a href="mailto:proconta@alinvest-group.com" target="_blank">proconta@alinvest-group.com</a></span>
                                        </div>

                                        <div className="flex items-center mr-5">                
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#ff944d"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                                        <span className="text-gray-400 text-[15px] ml-1"><a>+258 87 870 7590</a></span>  </div>
                                  </div>




                            </div>
                        </div>



                                
                        </section>
              
              </>
  )
}

export default App