import React, { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import UserPreferencesLayout from '../../layout/UserPreferencesLayout';
import NotificationToggles from './components/notificationToggles';
import {CameraAltRounded, Edit} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Switch } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import FormLayout from '../../layout/DefaultFormLayout';
import PouchDB from 'pouchdb';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autocomplete from '@mui/material/Autocomplete'
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import DefaultButton from '../../components/Buttons/default';
import colors from '../../assets/colors.json'

function App() {
 const { t } = useTranslation();
 const [page,setPage]=React.useState('profile')
 const [editMode,setEditMode]=React.useState(false)
 const {user} = useAuth()



 const db={
   user:new PouchDB('user')
 }  

 useEffect(()=>{
   (async()=>{
     try {
       let item=await db.user.get('user')
       setFormData({...item,contacts:[]})
       
     } catch (error) {
       console.log(error)
     }
   })()

 },[])



 const [showPassword, setShowPassword] = React.useState(false);
 const [loading, setLoading] = React.useState(false);
 const [valid, setValid] = React.useState(false);
 const {makeRequest,_add,_update,_loaded,_scrollToSection} = useData();
 
   let initial_form={
      name:'',
      last_name:'',
      contacts:[],
      nuit:'',
      notes:'',
      email:'',
      address:''
}

 const [formData, setFormData] = React.useState(initial_form);

 let required_fields=['email','name','last_name']

 const [verifiedInputs, setVerifiedInputs] = React.useState([]);

 function validate_feild(field){
    setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
 }

 const handleClickShowPassword = () => setShowPassword((show) => !show);

 const handleMouseDownPassword = (event) => {
   event.preventDefault();
 };
 


async function SubmitForm(){
     if(valid){
         setLoading(true)
         toast.loading(`A actualizar...'}`)
         try{
            let response = await makeRequest({method:'post',url:`api/user/update`,data:formData, error: ``},0);
            toast.remove()
            toast.success('Perfil actualizado')
            _update('users',[response])
            setVerifiedInputs([])
            setFormData(initial_form)
            setLoading(false)
        }catch(e){
         toast.remove()
          if(e.response){
                if(e.response.status==409){
                    toast.error('Email ou nome já existe')
                }
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
        }
        
     }else{
      toast.error('Preencha todos os campos obrigatórios')
     }
 }


        useEffect(()=>{
        let v=true
        Object.keys(formData).forEach(f=>{
            if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) || (!formData[f].length && required_fields.includes(f))){
                v=false
            }
        })
        setValid(v)
        },[formData])


     
        
    function editProfile(){
      setTimeout(()=>_scrollToSection('edit-profile'),100)
      setEditMode(true)
    }


  return (

    <>
          <UserPreferencesLayout page={page} setPage={setPage}>

           {page=="profile"  ? <>
               
               <div className="py-6">
                    <div className=" bg-app_orange-200 w-full rounded h-[150px] shadow-sm flex items-end justify-center mb-[100px]">
                           
                           
                           <div className="flex items-center justify-center size-36 rounded-full bg-white shadow-sm translate-y-[50%] ">
                                <CameraAltRounded sx={{color:colors.app_orange[400]}}/>
                           </div>
                           
                    </div>

                    <div className="flex justify-center flex-col items-center">
                         <span className="font-semibold text-[19px] mb-1">{user.name}</span>
                         <span>{user.last_name}</span>
                    </div>


                    {!editMode && <div className="flex justify-center mt-4" >
                       <DefaultButton goTo={editProfile} text={'Editar perfil'} no_bg={true} disabled={false}/>
                    </div>}


                   {editMode &&  <span className="flex border-b my-4"></span>}


                    <div id="edit-profile"  className={`bg-white py-1 border pb-5 rounded-[0.3rem] ${!editMode ? 'hidden' :''}`}>

                    <div className="p-[15px] opacity-75 flex justify-between items-center">
                        <span className="font-medium text-[18px]">{t('userPreferences.notifications.alerts')}</span>
                        
                    </div>

                        <span className="flex border-t border-zinc-200 w-[98%] mx-auto mb-4"></span>


                        <FormLayout.Section>


                        <div>
                        <TextField
                           id="outlined-textarea"
                           label="Nome *"
                           placeholder="Digite o nome"
                           multiline
                           value={formData.name}
                           onBlur={()=>validate_feild('name')}
                           onChange={(e)=>setFormData({...formData,name:e.target.value})}
                           error={(!formData.name) && verifiedInputs.includes('name') ? true : false}
                           helperText={!formData.name && verifiedInputs.includes('name') ? "Nome obrigatório" :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Apelido *"
                           placeholder="Digite o apelido"
                           value={formData.last_name}
                           onBlur={()=>validate_feild('last_name')}
                           onChange={(e)=>setFormData({...formData,last_name:e.target.value})}
                           error={(!formData.last_name)  && verifiedInputs.includes('last_name') ? true : false}
                           helperText={verifiedInputs.includes('last_name') && !formData.last_name ? "Apelido obrigatório" :''}
                           multiline
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Email *"
                           placeholder="Digite o email"
                           multiline
                           value={formData.email}
                           onBlur={()=>validate_feild('email')}
                           onChange={(e)=>setFormData({...formData,email:e.target.value})}
                           error={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') ? true : false}
                           helperText={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') ? "Email inválido":''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div className="add_select hidden">
                         <div className="w-[100%] flex">
       
                         <Autocomplete
                               multiple
                               id="size-small-outlined-multi"
                               size="small"
                               options={formData.contacts}
                               getOptionLabel={(option) => option}
                               renderInput={(params) => (
                                  <TextField {...params} label="Contactos" placeholder="Digite os contactos" />
                               )}
                               value={formData.contacts}
                               sx={{width:'100%',marginRight:1,'& .MuiAutocomplete-endAdornment':{display:'none'}}}
                            />
                             <Button onClick={()=>formData.contacts}  variant="outlined" style={{height:39,width:30}}>
                               +
                            </Button>
                            </div>
                           
                         </div>
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Contacto"
                           placeholder="Digite o Contacto"
                           multiline
                           value={formData.contacts[0]}
                           onChange={(e)=>setFormData({...formData,contacts:[e.target.value]})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Endereço"
                           placeholder="Digite o endereço"
                           multiline
                           value={formData.address}
                           onChange={(e)=>setFormData({...formData,address:e.target.value})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Nuit"
                           placeholder="Digite o nuit"
                           multiline
                           value={formData.nuit}
                           onChange={(e)=>setFormData({...formData,nuit:e.target.value})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                    
       
                       <div className="w-[100%]">
                       <TextField
                               id="outlined-multiline-static"
                               label="Observações"
                               multiline
                               rows={4}
                               value={formData.notes}
                               onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>
              </FormLayout.Section>



               <span className="flex border-b"></span>

                <div className="flex px-[6px] items-center mt-3 mb-2" id="change-password">
                <label className="flex items-center cursor-pointer hover:opacity-90">
                <Switch
                    checked={Boolean(formData.change_password)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    
                    onChange={(e)=>{
                        setTimeout(()=>_scrollToSection('change-password'),100)
                        setFormData({...formData,change_password:!Boolean(formData.change_password)})
                    }}
                />
                <span>Alterar senha</span>
                </label>
                </div>

                <div className={`${formData.change_password ? 'flex' :'hidden'}`}>   
                    

                <FormLayout.Section style={{marginTop:0,paddingTop:5}}>

                <div  style={{transform:'translateX(-0.5rem)'}}>
                       <FormControl sx={{ m: 1 ,width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">ltima senha *</InputLabel>
                            <OutlinedInput
                               id="outlined-adornment-password"
                               type={showPassword ? 'text' : 'password'}
                               onBlur={()=>validate_feild('password')}
                               value={formData.password}
                               onChange={(e)=>setFormData({...formData,password:e.target.value})}
                               error={true}
                               helperText={(formData.length <= 5 && verifiedInputs.includes('password')) ? 'Senha deve ter no minimo 6 caracteres' : verifiedInputs.includes('password') && !formData.password ? "Senha obrigatória" :''}
                               endAdornment={
                               <InputAdornment position="end">
                                  <IconButton
                                     aria-label="toggle password visibility"
                                     onClick={handleClickShowPassword}
                                     onMouseDown={handleMouseDownPassword}
                                     edge="end"
                                  >
                                     {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                               </InputAdornment>
                               }
                               label="Ultima senha"
                            />
                   </FormControl>


                   
                       </div>

                       <div style={{transform:'translateX(-0.5rem)'}}>
                       <FormControl sx={{ m: 1 ,width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Nova senha *</InputLabel>
                            <OutlinedInput
                               id="outlined-adornment-password"
                               type={showPassword ? 'text' : 'password'}
                               onBlur={()=>validate_feild('password')}
                               value={formData.password}
                               onChange={(e)=>setFormData({...formData,password:e.target.value})}
                               error={true}
                               helperText={(formData.length <= 5 && verifiedInputs.includes('password')) ? 'Senha deve ter no minimo 6 caracteres' : verifiedInputs.includes('password') && !formData.password ? "Senha obrigatória" :''}
                               endAdornment={
                               <InputAdornment position="end">
                                  <IconButton
                                     aria-label="toggle password visibility"
                                     onClick={handleClickShowPassword}
                                     onMouseDown={handleMouseDownPassword}
                                     edge="end"
                                  >
                                     {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                               </InputAdornment>
                               }
                               label="Nova senha"
                            />
                   </FormControl>


                   
                       </div>
                        
                

                </FormLayout.Section>

                </div>
       
       
              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={true}/>
        
                       

                    </div>





                    
               </div>
                  
           </> : <>
           <div>
                                
                                <div className="border-b pt-4 pb-8">
                                    <h1 className="py-2 text-2xl font-semibold">{t('userPreferences.notifications.notificationsSettings')}</h1>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.notificationsSettingsText')}</p>
                                </div>
                                <div className="grid border-b py-6 sm:grid-cols-2">
                                    <div className="">
                                    <h2 className="text-lg font-semibold leading-4 text-slate-700">{t('userPreferences.notifications.alerts')}</h2>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.alertsText')}</p>
                                    </div>
                                    <NotificationToggles/>
                                </div>
            
                                <div className="grid border-b py-6 sm:grid-cols-2">
                                    <div className="">
                                    <h2 className="text-lg font-semibold leading-4 text-slate-700">{t('userPreferences.notifications.reminders')}</h2>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.remindersText')}</p>
                                    </div>
                                    <NotificationToggles/>
                                </div>
                                <div className="grid border-b py-6 sm:grid-cols-2">
                                    <div className="">
                                    <h2 className="text-lg font-semibold leading-4 text-slate-700">{t('userPreferences.notifications.updates')}</h2>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.updatesText')}</p>
                                    </div> 
                                    <NotificationToggles/>
                                </div>
            
            
            
                     </div>
           </>}

         </UserPreferencesLayout>
    </>

  )

}

export default App

