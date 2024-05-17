import React from 'react';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth  } from '../../contexts/AuthContext';
import { useData  } from '../../contexts/DataContext';


function App() {
   const {login } = useAuth()
   const navigate=useNavigate()
   const {makeRequest} = useData();


   const [email, setEmail]=React.useState('')
   const [password, setPassword]=React.useState('')
   
   async function handleLogin(){
        toast.remove()

        if(!email || !password){
            toast.error('Preencha todos os campos!')
            return
        }else if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))){
            toast.error('Email invalido!')
            return
        }

        toast.loading('A entrar...')

        try{
            let response = await makeRequest({method:'post',url:`auth/login`,data:{password,email}, error: ``},0);
            toast.remove()
            toast.success('Autenticado com sucesso!')
            login(response.user,response.token)
            navigate('/');
            localStorage.setItem('token',response.token);
        }catch(e){
            toast.remove()
            
          if(e.response){
                if(e.response.status==404){
                    toast.error('Usuário não encontrado')
                }
                if(e.response.status==401){
                    toast.error('Senha incorreta')
                }
                if(e.response.status==400){
                    toast.error('Dados invalidos')
                }
                
          }else if(e.code=='ERR_NETWORK'){
               toast.error('Verifique sua internet e tente novamente')
          }else{
               toast.error('Erro inesperado!')
          }
          
          return
        
        }

       

       

        

       
   } 
    


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            FMS Tech  
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login
                </h1>
                <div className="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nome@empresa.com" required=""/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input onChange={(e)=>setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Lembrar de mim</label>
                            </div>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu sua senha?</a>
                    </div>
                    <button onClick={handleLogin}  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Entrar</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Não tem conta? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={()=>alert('Not built yet')}>Registre - se</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  </section>
  )
}

export default App