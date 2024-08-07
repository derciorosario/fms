import React from 'react';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth  } from '../contexts/AuthContext';
import { useData  } from '../contexts/DataContext';


function App() {
   const {login } = useAuth()
   const navigate=useNavigate()
   const {makeRequest,_add} = useData();

   let initial_form={
    c:{
      name:'',
      nuit:'',
      address:'',
      contacts:[],
      email:''
    },
    a:{
      name:'', 
      nuit:'',
      address:'',
      contacts:[],
      last_name:'',
      password:'',
      email:''
    }
 }


   const [formData, setFormData]=React.useState(initial_form)
   
   async function handleLogin(){


      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.a.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.c.email)){
        toast.error('Email invalido')
        return
      }


        let valid=true

        Object.keys(formData.a).forEach(e=>{
            if(!formData.a[e].length) valid=false
        })
        Object.keys(formData.c).forEach(e=>{
            if(!formData.c[e].length) valid=false
        })

        if(!valid){
            toast.remove() 
            toast.error('Preencha todos os campos!')
            return
        }

        toast.loading('A anviar...')

        try{
            let response = await makeRequest({method:'post',url:`api/company/create`,data:formData, error: ``},0);
            toast.remove()
            toast.success('Empresa adicionada!')
            setFormData(initial_form)
            console.log(response)
        }catch(e){
           toast.remove()
            
          if(e.response){
                if(e.response.status==409){
                    toast.error('Empresa já existe!')
                }
                
          }else if(e.code=='ERR_NETWORK'){
               toast.error(t('common.check-network'))
          }else{
               toast.error(t('common.unexpected-error'))
          }
          
          return
        
        }
       
   } 
    
   

  return (

    <div className="max-w-md mx-auto mt-7">

<div onClick={()=>navigate('/login')} className="text-center cursor-pointer mb-10 font-bold text-cyan-500 decoration-slate-600">Go to login</div>
        
        <div className="text-center mb-5 font-bold text-2xl">Add company</div>

    <div className="mb-2">Informções da empresa</div>

    <div className="relative z-0 w-full mb-5 group">
        <input value={formData.c.email} onChange={(e)=>setFormData({...formData,c:{...formData.c,email:e.target.value}})} type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
    </div>
  <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
            <input value={formData.c.name} onChange={(e)=>setFormData({...formData,c:{...formData.c,name:e.target.value}})} type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
            <input value={formData.c.address} onChange={(e)=>setFormData({...formData,c:{...formData.c,address:e.target.value}})} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Endereço</label>
        </div>
    </div>
    <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
            <input value={formData.c.contacts[0]} onChange={(e)=>setFormData({...formData,c:{...formData.c,contacts:[e.target.value]}})} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contacto</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
            <input value={formData.c.nuit} onChange={(e)=>setFormData({...formData,c:{...formData.c,nuit:e.target.value}})} type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nuit</label>
        </div>
    </div>
   



    <div className="mb-2 mt-9">Informções do administrador</div>

<div className="relative z-0 w-full mb-5 group">
    <input value={formData.a.email} onChange={(e)=>setFormData({...formData,a:{...formData.a,email:e.target.value}})} type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
    <label for="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
</div>
<div className="relative z-0 w-full mb-5 group">
    <input value={formData.a.password}  onChange={(e)=>setFormData({...formData,a:{...formData.a,password:e.target.value}})} type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
    <label for="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
</div>
<div className="grid md:grid-cols-2 md:gap-6">
    <div className="relative z-0 w-full mb-5 group">
        <input value={formData.a.name} onChange={(e)=>setFormData({...formData,a:{...formData.a,name:e.target.value}})} type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome</label>
    </div>
    <div className="relative z-0 w-full mb-5 group">
        <input  value={formData.a.last_name} type="text" onChange={(e)=>setFormData({...formData,a:{...formData.a,last_name:e.target.value}})} name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Apelido</label>
    </div>
</div>
<div className="grid md:grid-cols-2 md:gap-6">
    <div className="relative z-0 w-full mb-5 group">
        <input value={formData.a.contacts[0]} onChange={(e)=>setFormData({...formData,a:{...formData.a,contacts:[e.target.value]}})} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contacto</label>
    </div>
    <div className="relative z-0 w-full mb-5 group">
        <input value={formData.a.nuit} onChange={(e)=>setFormData({...formData,a:{...formData.a,nuit:e.target.value}})} type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nuit</label>
    </div>
</div>
<div className="grid md:grid-cols-2 md:gap-6">
    <div className="relative z-0 w-full mb-5 group">
        <input value={formData.a.address} onChange={(e)=>setFormData({...formData,a:{...formData.a,address:e.target.value}})} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Endereço</label>
    </div>
   
</div>
    <button onClick={handleLogin} type="submit" className="mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Enviar</button>
    </div>

  )
}

export default App