import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth  } from '../../contexts/AuthContext';
import { useData  } from '../../contexts/DataContext';
import SelectCompany from '../../components/Dialogs/selectCompany';
import { Alert, CircularProgress } from '@mui/material';

function App() {
   const {login,user} = useAuth()
   const navigate=useNavigate()
   const {makeRequest,_clearData} = useData();
   const [email, setEmail]=React.useState('')
   const [password, setPassword]=React.useState('')
   const [companies, setCompanies]=React.useState([])
   const [loading, setLoading]=React.useState(false)
   const [loginRespose, setLoginResponse]=React.useState(null)
   const [recoverPassword, setRecoverPassword]=React.useState(false)
   const [initialized,setinitialized]=React.useState(false)

   const handleKeyPress = (event) => {
    if (event.key == 'Enter') {
       handleLogin();
    }
  };

   React.useEffect(()=>{
      if(user){
         let companies=user.companies_details.map(i=>{
            return {...i,is_admin:i.admin_id==user.id ? true : false}
         })

         setCompanies(companies)
         setLoginResponse({user:{...user,companies_details:companies},token:user.token})
      }
      setinitialized(true)
   },[user])










   async function handleChosenCompany(company){
        setCompanies([])
        if(!company) return

        setLoading(true)

        let res=await login({...loginRespose.user,selected_company:company.id},loginRespose.token)
        
        if(!res.ok){
             toast.error(`Erro inesperado, detalhes do erro ${res.error}`)
             setLoading(false)
             return
        }
        navigate('/')
        localStorage.setItem('token',loginRespose.token);  
   }

   
   
   async function handleLogin(){

        setLoginResponse(null)
        toast.remove()

        if(((!email || !password) && !recoverPassword) || (!email && recoverPassword)){
            toast.error('Preencha os campos!')
            return
        }else if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))){
            toast.error('Email invalido!')
            return
        }

        //toast.loading('A entrar...')
        
        setLoading(true)

        try{
            let response = await makeRequest({method:'post',url:recoverPassword ? 'auth/recover-password' : `auth/login`,data:{password,email}, error: ``},0);
            toast.remove()
            setLoading(false)
            setEmail('')
            setPassword('')
            

            if(recoverPassword){
                toast.success('Email enviado!')
                setRecoverPassword(false)
                _clearData()
                return
            }
           
            if(response.user.companies.length==0){
                toast.error('Não está associado a nenhuma empresa!')
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
                    toast.error('Usuário não encontrado')
                }
                if(e.response.status==401){
                    toast.error('Senha incorreta')
                    setPassword('')
                }
                if(e.response.status==400){
                    toast.error('Dados invalidos')
                }
                if(e.response.status==500){
                    toast.error('Erro interno do servidor, contacte seu administrador')
                }
                
          }else if(e.code=='ERR_NETWORK'){
               toast.error('Verifique sua internet e tente novamente')
          }else{
               toast.error('Erro inesperado!')
          }

          
          
          return
        
        }

       
   } 





if(!initialized) {
     return <></>
} 
  


  return (
              <>   
                      <SelectCompany res={handleChosenCompany} items={companies} show={companies.length!=0}/>

                        <section className="bg-white flex  md:h-screen">
                           <div className="flex items-center justify-center px-6 py-8 mx-auto ">
                            
                            <div className="w-full bg-white rounded-[0.3rem]  min-w-[390px]  xl:p-0">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl flex items-center justify-between">
                                         <span>{recoverPassword ? 'Recuperar senha' : 'Login'}</span> {(recoverPassword && !loading) && <span onClick={()=>setRecoverPassword(false)} className="cursor-pointer font-normal text-[14px] hover:opacity-80 underline">Voltar</span>}
                                         {(loginRespose && !loading && !companies.length) && !recoverPassword && <span onClick={()=>setCompanies(loginRespose.user.companies_details)} className="flex text-black cursor-pointer hover:opacity-80 font-normal text-[14px] items-center justify-center underline">Selecionar empresa</span>}
                                        
                                    </h1>
                                    <div className="w-[350px]">
                                            {recoverPassword && <Alert severity="info">Informe seu email para receber uma nova senha caso esteja registrado.</Alert>}
                                    </div>
                                    <div className="space-y-4 md:space-y-6" action="#">
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                            <input onKeyDown={handleKeyPress} value={email} onChange={(e)=>setEmail(e.target.value)} type="email" name="email" id="email" className={`bg-gray-50 border ${loading ? 'opacity-40 pointer-events-none':''} border-gray-300 text-gray-900 sm:text-sm rounded-[0.3rem] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`} placeholder="nome@empresa.com" required=""/>
                                        </div>
                                       {!recoverPassword && <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Senha</label>
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
                                             <span className={`${loading ? 'opacity-0':''}`}>{recoverPassword ? 'Enviar' : 'Entrar'}</span>
                                            <div className={`${!loading ?'hidden':''} -scale-50 absolute left-0 top-0 h-full w-full`}>
                                               <CircularProgress style={{color:'#fff'}} />
                                            </div>
                                        </button>
                                        
                                         <div className={`flex items-center justify-between ${loading ? 'opacity-0':''}`}>
                                            <p className={`text-sm font-light text-gray-500 `}>
                                                <a className="font-medium text-primary-600 hover:underline cursor-pointer" onClick={()=>navigate('/new-company')}>Registrar empresa</a>
                                            </p>

                                            {!recoverPassword && <p onClick={()=>setRecoverPassword(true)} className="text-sm font-normal cursor-pointer hover:underline  text-gray-500 ">
                                                Recuperar senha 
                                            </p>}
                                         </div>
                                         
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="w-[50%] h-full bg-app_orange-200">
                                    
                        </div>

                                
                        </section>
              
              </>
  )
}

export default App