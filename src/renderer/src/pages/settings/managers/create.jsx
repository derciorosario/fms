
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autocomplete from '@mui/material/Autocomplete'
import toast from 'react-hot-toast';
import { useAuth  } from '../../../contexts/AuthContext';
import { useData  } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';
import FormLayout from '../../../layout/DefaultFormLayout';

      
       
       function App() {

         const {navigate}=useNavigate()

          const { id } = useParams()

          const db={
            managers:new PouchDB('managers')
          }  

          useEffect(()=>{
            if(!id) return

            (async()=>{
              try {
                let item=await db.managers.get(id)
                setFormData(item)
                
              } catch (error) {
                console.log(error)
              }
            })()

          },[])


       
          const [showPassword, setShowPassword] = React.useState(false);
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {makeRequest,_add,_update,_loaded} = useData();
          
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
                  toast.loading(`${id ? 'A actualizar...' :'A enviar...'}`)
                  try{
                     let response = await makeRequest({method:'post',url:`api/user/`+(id ? "update" : "create"),data:formData, error: ``},0);
                     toast.remove()
                     toast.success('Usuário '+(id ? "actualizado" : "criado"))

                     if(id){
                        _update('managers',[response])
                     }else{
                        _add('managers',[response])
                        setVerifiedInputs([])
                        setFormData(initial_form)
                     }
                     
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
       
          
        
        
         return (
           <>
              <FormLayout name={ `${id ? 'Actualizar Gestor' : 'Novo Gestor'}`} formTitle={id ? 'Actualizar' : 'Adicionar'}>
              




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
       
                       <div className="hidden" style={{transform:'translateX(-0.5rem)'}}>
                       <FormControl sx={{ m: 1 ,width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Senha *</InputLabel>
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
                               label="Senha"
                            />
                   </FormControl>
                       </div>
       
                       <div className="w-[100%]">
                       <TextField
                               id="outlined-multiline-static"
                               label="Obsrvações"
                               multiline
                               rows={4}
                               value={formData.notes}
                               onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>
              </FormLayout.Section>
       
       
              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>
        
                      
       
                     
       
               </FormLayout>
           </>
         )
       }
     
       export default App