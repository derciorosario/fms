import React, { useState,useEffect } from 'react';
import FirstUsePerson from './forms/personal';
import FirstUseCompany from './forms/company';
import FirstUseLincense from './forms/lincense';
import { Alert, Checkbox, CircularProgress, Switch} from '@mui/material';
import colors from  '../../assets/colors.json'
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
import PageLoader from '../../components/progress/pageLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


function FirstUse() {
  const data = useData()
  const [currentPage,setCurrentPage]=useState(0)
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState([])
  const [login,setlogin]=useState(false)
  const [initialized,setinitialized]=useState(false)
  const [invite,setinvite]=useState(null)
  const [valid,setValid]=useState({
    personal:false,
    company:false,
    key:false
  })

  if(!localStorage.getItem('dbs')) localStorage.setItem('dbs',JSON.stringify([]))
  

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
       contact:''
    },
    company:{
       name:'',
       address:'',
       email:'',
       nuit:'',
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
         !formData.personal.state
      ){
        _valid.personal=false
      }

      if(formData.company.name.length <= 2 ||
      !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company.email.trim())) ||
      formData.company.contact.length != 9 ||
      formData.company.nuit.length != 9 ||
      formData.company.address.length < 3  ||
      !formData.company.state
      
      
        ){
           _valid.company=false
        }

        if(formData.key.length != 12) {
            _valid.key=false
        }

      setValid(_valid)
      setTimeout(()=> localStorage.setItem('setupdata',JSON.stringify({...formData,key:'',personal:{...formData.personal,password:''}})),1000)
  },[formData])



async function get_invite_info(id){


    try{

      let response = await data.makeRequest({method:'get',url:`api/get-invite-info/`+id, error: ``},0);
     
      if(response.invalid){
        toast.error('Convite invalido!')
        setInviteStatus('invalid')
      }else if(response.used){
        toast.error('Convite usado!')
        setInviteStatus('used')
      }else if(response.data){
        setInviteStatus('not_started')  
        setFormData({...formData,personal:{...formData.personal,...response.data}})
      }else{
        setInviteStatus('started')  
      }

      setinitialized(true)

    }catch(e){

        if(e.response){
                
            if(e.response.status==400){
                toast.error('Dados invalidos')
            }
            if(e.response.status==404){
              toast.error('Item não encontrado')
            }
            if(e.response.status==500){
              toast.error('Erro interno do servidor, contacte seu administrador')
            }
          
            
      }else if(e.code=='ERR_NETWORK'){
          toast.error('Verifique sua internet e tente novamente')
      }else{
          console.log(e)
          toast.error('Erro inesperado!')
      }
      
      setLoading(false)
      setinitialized(true)
         
    }


    



}



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
             setinvite(res.invite)
        }  
       
  },[pathname])



  useEffect(()=>{
   
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
        await user_db.put(data.user)

        let user_settings=new PouchDB(`settings-${data.user.id}-${data.user.selected_company}`)
        await user_settings.put(data.settings)
       
        let dbs=JSON.parse(localStorage.getItem('dbs'))

        for (let i = 0; i < dbs.length; i++) {
           /// await dbs[i].destroy()
        }

        setlogin(true)
        localStorage.setItem('first-company-created-message',true)
        setFormData(initial_form)
       }catch(e){
          toast.error('Erro de inicialização inesperado, tente novamente! detalhes do erro'+e)
       }
       
  }





  async function SubmitForm(from){
        setLoading(true)
        setErrors([])
        toast.loading(from=="invite" ? `A carregar...`: `A validar...`)
        try{

        let response=from=="invite" ? await data.makeRequest({method:'post',url:`api/register-from-invite`,data:{
          a:formData.personal,
          invite,
        }, error: ``},0)
       
       : 

       await data.makeRequest({method:'post',url:`api/company/setup`,data:{
        c:formData.company,
        a:formData.personal,
        key:formData.key
     }, error: ``},0)

       


        toast.remove()

        if(from=="invite"){


          toast.success('Usuário cadastrado com successo')

          navigate('/login?registration-success&email='+formData.personal.email)


          return
        }

        if(response.data){
            setErrors([])
            firstStart(response.data)
        }else{
            setLoading(false)
            setErrors(response.errors)
            toast.error('Dados inválidos!')
        }


       }catch(e){
        toast.remove()
         if(e.response){
             
               if(e.response.status==400){
                  toast.error('Dados invalidos')
               }
               if(e.response.status==404){
                  toast.error(from!="invite" ? 'Item não encontrado' : 'Usuário ou convite não encotrado')
               }

               if(e.response.status==409){
                toast.error('Usuário já existe')
               }
               if(e.response.status==500){
                  toast.error('Erro interno do servidor, contacte seu administrador')
               }
               
         }else if(e.code=='ERR_NETWORK'){
              toast.error('Verifique sua internet e tente novamente')
         }else{
              console.log(e)
              toast.error('Erro inesperado!')
         }
         setLoading(false)
       }
 }



  const pages=[
    {name:'Informação pessoal',text:'Insira sua informação pessoal e de login para a plataforma'},
    {name:'Empresa',text:'Registre sua primeira empresa'},
    {name:'Chave de acesso',text:'Insira a chave the accesso enviado por email'}
  ]


  



  if(!initialized){
     return <PageLoader/>
  }



  return (
<>

<div class="min-h-screen p-6 bg-slate-100 flex items-center justify-center">
  <div class="container max-w-screen-lg mx-auto">
    <div>
      

      <div class="bg-white rounded shadow-lg mb-6">
        <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">

          <div class={`text-gray-600 bg-gray-50 px-8 py-10 border-r border-[rgba(0,0,0,0.04)] ${login || IsRegister ? 'hidden':''}`}>
           
            <p class="font-semibold text-[19px] mt-7">Etapa {currentPage + 1}</p>
           
            <p className="text-gray-400 mt-3 text-[15px]">{pages[currentPage].text}</p>
            <div className="mt-10 relative">
                  <span className="w-[1px] flex h-[96%] translate-y-[3%] -z-2 bg-slate-200 left-[15px] top-0 absolute"></span>

                  {pages.map((i,_i)=>(
                              <div className="flex mb-7 relative z-10 items-center"><span className={`flex w-[30px] h-[30px] rounded-full items-center ${currentPage==_i ? 'text-white  bg-app_orange-300 font-semibold':'text-app_black-300  bg-slate-200'} justify-center  mr-3`}>{_i+1}</span> <span className={`${currentPage==_i ? 'font-semibold':' text-gray-400'}`}>{i.name}</span></div>
                  ))}
               </div>
          </div>

          <div class={`md:col-span-${IsRegister ? '3' : '2'} p-12`}>

           {!IsRegister ? <div className={`mb-10 ${login ? 'hidden':''}`}>
                    <p class="font-semibold text-[19px] mt-7">{pages[currentPage].name}</p>
                    <p className="text-gray-400 mt-3 text-[15px]">Insira sua informação pessoal e de login para a plataforma</p>
            
            </div> : <div className={`mb-10`}>
                    <p class="font-semibold text-[19px] mt-7">Convite de adesão</p>

                    
                    <p className="text-gray-400 mt-3 text-[15px]"><span className="mr-3 inline-flex text-amber-400">{!invite ? 'Convite não encontrado!' : inviteStatus=="invalid"  ? "Este convite não é valido" : inviteStatus=="not_started" ? "Confirme os dados adicionados no convite antes de prosseguir" :"Está conta ja foi registrada"}</span>  </p>
                    <span className="flex mt-4 justify-end">
                      {(inviteStatus=="used" || inviteStatus=="started") && <>
                        <label onClick={()=>navigate('/recover-password')} className="hover:opacity-75 inline-flex text-app_orange-400 underline cursor-pointer">Recuperar senha</label>
                        <label className="mx-2 text-gray-200">|</label>
                      </>}
                      <label onClick={()=>navigate('/login')} className="hover:opacity-75 inline-flex text-app_orange-400 underline cursor-pointer">Login</label>
                      <label className="mx-2 text-gray-200">|</label>
                      <label className="hover:opacity-70 cursor-pointer inline-flex text-app_orange-400 underline" onClick={()=>navigate('/new-company')}>Registrar empresa</label>
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
           

            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
   
            {(currentPage == 0 && !(!invite && IsRegister) && (inviteStatus!="invalid" &&  inviteStatus!="used" && inviteStatus!="started")) && <FirstUsePerson IsRegister={IsRegister} useExistingAccount={useExistingAccount} formData={formData} setFormData={setFormData}/>}
            {currentPage == 1 && <FirstUseCompany upload={upload} setUpload={setUpload} formData={formData} setFormData={setFormData}/>}
            {currentPage == 2 && <FirstUseLincense login={login} errors={errors} setErrors={setErrors} formData={formData} setFormData={setFormData}/>}

      
              <div class={`md:col-span-5 text-right mt-10 ${login || IsRegister ? 'hidden':''}`}>
                <div class={`${loading ? 'hidden':'inline-flex'}`}>
                  <button onClick={()=>setCurrentPage((p)=>p-=1)} class={`text-app_black-600 ${currentPage==0 ? 'opacity-0 pointer-events-none':''} font-semibold py-2 px-4 rounded`}>Voltar</button>
                  <button onClick={()=>{

                    if((currentPage==0 && !valid.personal) || (currentPage==1 && !valid.company) || (currentPage==2 && !valid.key)){
                        return
                    }else if(currentPage==2 && valid.key){
                        SubmitForm()
                        return
                    }

                    setCurrentPage((p)=>p+=1)
                  }} class={`${(currentPage==0 && !valid.personal) || (currentPage==1 && !valid.company) || (currentPage==2 && !valid.key) ? ' bg-gray-300 cursor-not-allowed':'bg-app_orange-300 hover:bg-app_orange-400'} ${currentPage==2 && valid.key ?' bg-app_orange-500':''} text-white font-bold py-2 px-4 rounded`}>{currentPage==2 ? 'Submeter' :'Próximo'}</button>
                </div>

               {loading && <span className="scale-70 inline-block"><CircularProgress style={{color:colors.app_orange[500]}} /></span>}
             
              </div>
              


              <div class={`md:col-span-5 text-right mt-10 ${(!IsRegister || (inviteStatus=="invalid" || inviteStatus=="used" || inviteStatus=="started") || (!invite && IsRegister) )  ? 'hidden':''}`}>
                <div class={`${loading ? 'hidden':'inline-flex'}`}>
                 <button onClick={()=>{
                         SubmitForm('invite')
                    
                  }} class={`${(currentPage==0 && !valid.personal) ? ' bg-gray-300 cursor-not-allowed':'bg-app_orange-300 hover:bg-app_orange-400'} text-white font-bold py-2 px-4 rounded`}>Enviar</button>
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

