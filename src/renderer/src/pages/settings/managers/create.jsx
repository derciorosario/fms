
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
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import PouchDB from 'pouchdb';
import FormLayout from '../../../layout/DefaultFormLayout';
import MultipleSelectChip from '../../../components/TextField/chipInput';
import { Info } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';     
       
       function App() {

         const navigate=useNavigate()

          const { id } = useParams()

          const {db,user,APP_BASE_URL} = useAuth()

          const [items,setItems]=React.useState([])

          const required_data=['managers']

          const {_loaded,_get,_setRequiredData} = useData();
          const data= useData()
        

          let initial_form={
            name:'',
            last_name:'',
            contacts:[''],
            nuit:'',
            notes:'',
            email:'',
            address:'',
            invite:uuidv4()
        }

          const [formData, setFormData] = React.useState(initial_form);


          const {pathname} = useLocation()
         

          const [showPassword, setShowPassword] = React.useState(false);
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const [loaded, setLoaded] = React.useState([]);
          const [initialized, setInitialized] = React.useState(false);
          const [canEdit,setCanEdit] = React.useState(true)
         


          useEffect(()=>{

            if(!id || !db.managers || formData.id==id) return 

               (async()=>{

                     let item =  await db.managers.find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)
                     handleLoaded('form','add')
                     }else{
                      toast.error('Item não encontrado')
                      navigate(`/managers`)
                     }

               })()

          },[db,pathname,data._required_data])


          
         useEffect(()=>{
            _setRequiredData(required_data)
         },[])
         




         
          
           useEffect(()=>{
                _get(required_data.filter(i=>!_loaded.includes(i)))    
           },[db])

           useEffect(()=>{
                  setItems(data._managers)
           },[data._managers])


       
          


          function handleLoaded(item,action){
              if(action=='add'){
                setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
              }else{
                setLoaded((prev)=>prev.filter(i=>i!=item))
              }
          }


          
          const [chipOptions, setChipOptions] = React.useState([]);
          const [chipNames, setChipNames] = React.useState([]);


          React.useEffect(()=>{

            if(_loaded.includes('managers') && user &&  (loaded.includes('form') || !id)){
                setInitialized(true)
                if(id){
                  if(!user.companies_details.filter(i=>i.admin_id==user.id).some(i=>formData.companies.includes(i.id))){
                     setCanEdit(false)
                 }
                }
           }
                  
          },[data._managers,loaded])

         

          React.useEffect(()=>{
            if(!initialized) return

             if(id){
                  console.log({formData})
                  setChipOptions(user.companies_details.filter(i=>(formData.companies.includes(i.id) && i.admin_id==user.id) || !canEdit).map(i=>i.name))
             }

             setChipNames(user.companies_details.filter(i=>i.admin_id==user.id).map(i=>i.name))
               
          },[initialized])

         
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

            setLoading(true)

            let email_used=false

            if(valid){
               
               let companies=user.companies_details.filter(i=>chipOptions.includes(i.name)).map(i=>i.id)
               
               try{     

                     if(id){

                           let last_companies=await db.managers.find({selector: {id}})
                           last_companies=last_companies.docs[0].companies
                           let removed_from=last_companies.filter(i=>!companies.includes(i))

                           for (let i = 0; i < removed_from.length; i++) {
                              let company=new PouchDB('managers-'+removed_from[i])
                              let manager = await company.find({selector: {email:formData.email}})
                              manager=manager.docs[0]
                              await company.put({...formData,deleted:true,_rev:manager._rev})
                           
                           }

                      }


                      let managers=[]
                      
                      // Verfiying email conflict
                      for (let i = 0; i < companies.length; i++) {
                        let company_name=user.companies_details.filter(f=>f.id==companies[i])[0].name
                        let company=new PouchDB('managers-'+companies[i])
                        let manager = await company.find({selector: {email:formData.email,deleted:false}})
                        manager=manager.docs[0]

                        if(id){
                           if(manager) {
                              console.log(manager)
                               managers.push({...formData,id:manager.id,_id:manager._id,_rev:manager._rev,action:'update',companies,deleted:false,company_id:companies[i]})      
                           }else{
                               managers.push({...formData,action:'create_new',id:uuidv4(),_id:new Date().toISOString(),companies,company_id:companies[i]})  
                           }
                        }else{    
                           if(manager) {
                               toast.error('Email já foi usado em: '+company_name)
                               email_used=true
                           }else{
                               managers.push({...formData,action:'create_new',id:uuidv4(),_id:new Date().toISOString(),companies,company_id:companies[i]})
                           }
                        }
                     }
                     
                     // Email was not used in any company

                     if(!email_used){

                        for (let i = 0; i < managers.length; i++) {

                           let company=new PouchDB('managers-'+managers[i].company_id)
                           delete managers[i].company_id
                           if(managers[i].action=="update"){
                              delete managers[i].action
                              await company.put(managers[i])    
                           }else{
                              delete managers[i].action
                              let form=JSON.parse(JSON.stringify(formData))
                              delete form._rev
                              company.put({...form,id:uuidv4(),_id:new Date().toISOString(),companies,created_by:user.id})
                           }

                       }

                     }
                    
                    
                    
                     setLoading(false)
                     if(!email_used) toast.success('Usuário '+(id ? "actualizado" : "criado"))

              }catch(e){
                     setLoading(false)
                     console.log(e)
                     toast.error('Erro inesperado!')
              }

              if(!id && email_used==false){
                  setVerifiedInputs([])
                  setFormData(initial_form)
                  setChipOptions([])
              }

            }


      }


          /*
         async function SubmitForm(){
              if(valid){
                  setLoading(true)
                  toast.loading(`${id ? 'A actualizar...' :'A enviar...'}`)
                  try{
                     let response = await makeRequest({method:'post',url:`api/user/`+(id ? "update" : "create"),data:{
                        ...formData,companies:data._companies.filter(i=>chipOptions.includes(i.name)).map(i=>i.id)
                     }, error: ``},0);
                     toast.remove()
                     toast.success('Usuário '+(id ? "actualizado" : "criado"))

                     if(id){
                        _update('managers',[response])
                     }else{
                        _add('managers',[response])
                        setVerifiedInputs([])
                        setFormData(initial_form)
                        setChipOptions([])
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
          }*/




          useEffect(()=>{
            let v=true
            Object.keys(formData).forEach(f=>{
               if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) || (!formData[f]?.length && required_fields.includes(f))){
                  v=false
               }
           })

            if(!chipOptions.length || !canEdit || formData.email==user.email) v=false


           setValid(v)
          },[formData,chipOptions])
       

        
          const handleCopyClick = (text) => {
            navigator.clipboard.writeText('http://13.40.24.65:3001/#/confirm-invite?invite='+formData.invite).then(() => {
              toast.success('Texto copiado!');
            }).catch(err => {
              alert('Failed to copy text: ', err);
            });
          }
          
        
        
         return (
           <>
              <FormLayout loading={!initialized} name={ `${id ? 'Actualizar Gestor' : 'Novo Gestor'}`} formTitle={id ? 'Actualizar' : 'Adicionar'}  topLeftContent={(
                  <>
                     {formData.firstLogin && <span className="text-gray-400 font-light"><Info sx={{width:20}}/> Não poderá editar dados pessoais</span>}

                      {!formData.firstLogin && <div onClick={()=>{
                         toast.error('clipboard não funciona no modo http')
                         setTimeout(()=>window.open('http://13.40.24.65:3001/#/confirm-invite?invite='+formData.invite, "_blank"),4000)
                       }} className="px-6 text-app_orange-400 underline cursor-pointer table hover:opacity-80">Copiar convite</div>}
                     

                  </>
              )}>
              

            <div className={`${!initialized ? 'opacity-50 pointer-events-none' :''}`}>
               

              <FormLayout.Section>
              <div>
                        <TextField
                           id="outlined-textarea"
                           label="Nome *"
                           placeholder="Digite o nome"
                           multiline
                           disabled={formData.firstLogin || !canEdit ? true : false}
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
                           disabled={formData.firstLogin || !canEdit ? true : false}
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
                           disabled={formData.firstLogin || !canEdit ? true : false}
                           value={formData.email}
                           onBlur={()=>validate_feild('email')}
                           onChange={(e)=>setFormData({...formData,email:e.target.value})}
                           error={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') || formData.email==user.email ? true : false}
                           helperText={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') ? "Email inválido":formData.email==user.email ? 'Não pode adicionar seu email':''}
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
                               disabled={formData.firstLogin || !canEdit ? true : false}
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

                         {formData.contacts.map((i,_i)=>(
                           <div key={_i}>
                              <TextField
                                 id="outlined-textarea"
                                 label="Contacto"
                                 disabled={(user.id!=formData.admin_id && id) || canEdit ? true : false}
                                 placeholder="Digite o Contacto"
                                 multiline
                                 value={i}
                                 onChange={(e)=>setFormData({...formData,contacts:[e.target.value]})}
                                 sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                 '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                 />
                          </div>
                         ))}
       
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Endereço"
                           placeholder="Digite o endereço"
                           multiline
                           disabled={formData.firstLogin || !canEdit ? true : false}
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
                           disabled={formData.firstLogin || !canEdit ? true : false}
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
                               disabled={!canEdit}
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
                               label="Observações"
                               multiline
                               rows={4}
                               disabled={formData.firstLogin || !canEdit ? true : false}
                               onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>

                       <div className=" relative">
                          <MultipleSelectChip disabled={!canEdit} validate_feild={validate_feild} label={'Acesso a empresas'} setItems={setChipOptions} names={chipNames} items={chipOptions}/>
                        <div className="text-[13px] absolute right-[0px] top-0 translate-y-[-100%] flex items-center">
                              {(verifiedInputs.includes('company') && chipOptions.length==0) && <span className='text-[11px] text-red-500'>Campo obrigatório</span>}
                        </div>

                       </div>

              </FormLayout.Section>
            </div>

           

       
       
              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading && initialized} valid={valid} id={id}/>
        
               </FormLayout>



               


           </>
         )
       }
     
       export default App