
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
import { useData  } from '../../contexts/DataContext';
import {useParams, useNavigate,useLocation} from 'react-router-dom';
import FormLayout from '../../layout/DefaultFormLayout';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { t } from 'i18next';

       
       
       function App({isPopUp}) {

         const navigate=useNavigate()

          const { id } = useParams()

          const {pathname} = useLocation()

          const {db} = useAuth()

          const [items,setItems]=React.useState([])
          const [initialized,setInitialized]=React.useState()
          const {_get,_add,_update,_loaded,_setOpenDialogRes,_setOpenCreatePopUp,_openDialogRes,_setRequiredData,_required_data} = useData();
          const data=useData()

        
          let page=pathname.includes('/client') || (_openDialogRes?.details?.client) ? 'clients' : pathname.includes('/supplier') || _openDialogRes?.details?.supplier ? 'suppliers' :'investors';


          console.log({page,_openDialogRes})
          
          useEffect(()=>{
            if(!id || id==formData.id || isPopUp || !db.managers) return 

               (async()=>{
               
                     let item =  await db[page].find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)
                     }else{
                     toast.error(t('common.item-not-found'))
                     navigate(`/${page}`)
                     }
               })()

          },[pathname,db,_required_data])


          useEffect(()=>{
            _setRequiredData(page)
           },[pathname])


          useEffect(()=>{
            if(_loaded.includes(page)){
                setInitialized(true)
            }else{
                setInitialized(false)
            }
           },[_loaded,pathname])
          
           useEffect(()=>{
              if(!_loaded.includes(page))  _get(page)    
           },[db])

           useEffect(()=>{
                  setItems(data[`_${page}`])
           },[pathname])

         

       
          const [showPassword, setShowPassword] = React.useState(false);
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
         
            let initial_form={
               name:'',
               last_name:'',
               contacts:[],
               nuit:'',
               notes:'',
               email:'',
               address:'',
               deleted:false
         }

          const [formData, setFormData] = React.useState(initial_form);

       
          let required_fields=['name']
       
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
                  if(items.some(i=>i.email==formData.email && i.id!=id && i.email) || items.some(i=>i.name?.toLowerCase()==formData.name?.toLowerCase() && i.id!=id && i.last_name?.toLowerCase()==formData.last_name?.toLowerCase())){
                     toast.error(t('common.user-or-email-exists'))
                     return
                  }
                   try{
                     if(id && !isPopUp){
                        _update(page,[{...formData}])
                        toast.success(t('common.updated-successfully'))
                     }else{
                       
                        let new_item={...formData,id:uuidv4()}
                        let res=await _add(page,[new_item])

                        if(res.ok){
                           _setOpenDialogRes({..._openDialogRes,item:new_item,page:'register'})
                         }

                         if(isPopUp) _setOpenCreatePopUp('')

                        setVerifiedInputs([])
                        toast.success(t('common.added-successfully'))
                        setFormData(initial_form)
                     }
                 }catch(e){
                        console.log(e)
                        toast.error(t('common.unexpected-error'))
                 }
                 
              }else{
               toast.error(t('common.fill-all-requied-fields'))
              }
          }

          useEffect(()=>{
            let v=true
            Object.keys(formData).forEach(f=>{
               if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email) || (!formData[f].length && required_fields.includes(f))){
                  v=false
               }
           })
           setValid(v)
          },[formData])
       
       
         return (
           <>
              <FormLayout loading={!initialized || loading} isPopUp={isPopUp} maxWidth={isPopUp ? '700px' : null} name={ `${id && !isPopUp ? t('common.update')+" " : t('common.add-new_')+' '} ${page=="clients" ?  t('common.client') : page=="suppliers" ?  t('common.supplier') :  t('common.investor')}`} formTitle={id!="create" && !isPopUp ? t('common.update')+" " : `${t('common.add-new_')}  ${page=="clients" ?  t('common.client') : page=="suppliers" ?  t('common.supplier') : t('common.investor')}` }>
                  
                  <FormLayout.Section>

                       <div>
                        <TextField
                           id="outlined-textarea"
                           label={t('common.name')}
                           placeholder={t('common.type-name')}
                           multiline
                           value={formData.name}
                           onBlur={()=>validate_feild('name')}
                           onChange={(e)=>setFormData({...formData,name:e.target.value})}
                           error={(!formData.name) && verifiedInputs.includes('name') ? true : false}
                           helperText={!formData.name && verifiedInputs.includes('name') ? t('common.required-field') :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>
       
                       <div className="hidden">
                        <TextField
                           id="outlined-textarea"
                           label="Apelido"
                           placeholder="Digite o apelido"
                           value={formData.last_name}
                           onBlur={()=>validate_feild('last_name')}
                           onChange={(e)=>setFormData({...formData,last_name:e.target.value})}
                           multiline
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Email"
                           placeholder={t('common.type-email')}
                           multiline
                           value={formData.email}
                           onBlur={()=>validate_feild('email')}
                           onChange={(e)=>setFormData({...formData,email:e.target.value})}
                           error={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') ? true : false}
                           helperText={verifiedInputs.includes('email') && formData.email ? t('common.invalid-email'):''}
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
                                  <TextField {...params} label={t('common.contacts')} placeholder={t('common.type-contacts')} />
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
                           label={t('common.contact')}
                           placeholder={t('common.type-contact')}
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
                           label={t('common.address')}
                           placeholder={t('common.type-address')}
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
                           placeholder={t('common.type-nuit')}
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
                               label={t('common.notes')}
                               multiline
                               rows={4}
                               value={formData.motes}
                               onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>
       
       
                           
                       
                   


                  </FormLayout.Section>

                  <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id && !isPopUp}/>

                  
               </FormLayout>
           </>
         )
       }
     
       export default App