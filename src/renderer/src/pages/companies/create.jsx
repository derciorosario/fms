
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'
import toast from 'react-hot-toast';
import { useAuth  } from '../../contexts/AuthContext';
import { useData  } from '../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';
import FormLayout from '../../layout/DefaultFormLayout';
import MultipleSelectChip from '../../components/TextField/chipInput';
import { Switch } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';     
import MainUploader from '../setup/compnents/upload-company-logo';
      
  
       
       function App() {

         const navigate=useNavigate()

          const { id } = useParams()

          const {db,user} = useAuth()

          const [items,setItems]=React.useState([])

          const required_data=['managers']
          
          const {makeRequest,_add,_update,_loaded,_get,_get_all,_all,_all_loaded,replicate} = useData();
          const data=useData()       
          const [isFilial,setIsFilial]=useState(false)
          const [filialDetails,setFilialDetails]=useState({name:''})
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const [chipOptions, setChipOptions] = React.useState([]);
          const [initialized, setInitialized] = React.useState(false);
          const [chipNames, setChipNames] = React.useState([]);
          const [allManagers, setAllManagers] = React.useState([]);
          const [allManagersLoaded, setAllManagersLoaded] = React.useState(false);


          const {setUser}=useAuth()
          
            let initial_form={
              name:'',
              nuit:'',
              address:'',
              contacts:[],
              logo:{},
              email:'',
              createdAt:new Date().toISOString()
            }

             
            const [upload,setUpload]=React.useState({
              uploading:false,
              file:{},
              progress:0
            })



           const [formData, setFormData] = React.useState(initial_form);


           useEffect(()=>{
             if(initialized) setFormData({...formData,logo:upload.file})
          },[upload,initialized])


        
            React.useEffect(()=>{
            if(!initialized && formData || !_all.managers) return

            let managers=[]

             if(id){

              
              _all.managers.forEach(i=>{
                 if(i.companies.includes(formData.id) && !managers.some(f=>f.email==i.email)) managers.push(i)
                
              })

              setChipOptions(managers.map(i=>i.email))

             }

             _all.managers.forEach(i=>{
              if(i.created_by==user.id && !managers.some(f=>f.email==i.email))  managers.push(i)
             })

             setChipNames(managers.map(i=>i.email))
           
               
          },[initialized,_all])

          
          useEffect(()=>{
            if(!(required_data.some(i=>!_loaded.includes(i))) && user && (formData.id || !id)){
                 setInitialized(true)
            }


          },[db,user,_loaded,formData])



          useEffect(()=>{
            _get(required_data.filter(i=>!_loaded.includes(i))) 
            
          },[db])

          useEffect(()=>{


              if(user) _get_all('managers')  



              if(!id) return

              if(id){
                      let item=user.companies_details.filter(i=>i.id==id)[0]
                      if(item){
                          setFormData({...formData,...item})
                          setUpload({...upload,file:item.logo ? item.logo : {}})
                      }else{
                          toast.error('Item não encontrado')
                          navigate(`/managers`)
                      }
              }

              

          },[user])

       
          let required_fields=['name']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }
       

          console.log({formData})
       

          async function SubmitForm(){
              if(valid){
                  try{

                  
                  if(id){

                    let user_db=new PouchDB('user-'+user.id)
                    let new_user_content={...user,companies_details:[...user.companies_details.filter(i=>i.id!=formData.id),formData]}
                    let res=await user_db.put(new_user_content)

                    setUser({...new_user_content,_rev:res.rev})
                    

                    let selected_managers_ids=_all.managers.filter(i=>chipOptions.includes(i.email)).map(i=>i.id)
                    let olds=_all.managers.filter(i=>i.companies.includes(formData.id))
                    let removed_m=_all.managers.filter(i=>i.companies.includes(formData.id) && !selected_managers_ids.includes(i.id))
                    let new_m=_all.managers.filter(i=>selected_managers_ids.includes(i.id) && !olds.some(f=>f.id==i.id))
                    

                    console.log({olds,new_m,removed_m})

                  
                    for (let i = 0; i < removed_m.length; i++) {
                        let cps=removed_m[i].companies
                        for (let f = 0; f < cps.length; f++) {
                          let c=new PouchDB(`managers-`+cps[f])
                          let manager = await c.find({selector: {email:cps[i].email}})
                          manager=manager.docs[0]
                          let res=await c.put({...manager,deleted:true,companies:[...manager.companies.filter(i=>i!=formData.id)]})
                          //replicate('from',`managers-`+cps[f],true)
                          data._add_to_update_list(`managers-`+cps[f])
                          console.log(res)
                       }
                    }


                  for (let i = 0; i < new_m.length; i++) {
                        let new_c=new PouchDB(`managers-`+formData.id)
                        delete new_m[i].company_id
                        delete new_m[i]._rev
                        delete new_m[i]._id
                        await new_c.put({...new_m[i],_id:uuidv4(),companies:[...new_m[i].companies,formData.id]})
                        //replicate('from',`managers-`+formData.id,true)
                        data._add_to_update_list(`managers-`+formData.id)

                      
                  
                        let cps=new_m[i].companies
                        for (let f = 0; f < cps.length; f++) {
                          let c=new PouchDB(`managers-`+cps[f])
                          let manager = await c.find({selector: {email:new_m[i].email}})
                          manager=manager.docs[0]
                          let res=await c.put({...manager,companies:[...manager.companies,formData.id]})
                          // replicate('from',`managers-`+cps[f],true)
                          data._add_to_update_list(`managers-`+cps[f])
                          console.log({res})
                        } 

                  }


              }else{
                    let company_id=uuidv4()
                    let company=new PouchDB('managers-'+company_id)
                    let managers=_all.managers.filter(i=>chipOptions.includes(i.email))

                    for (let i = 0; i < managers.length; i++) {
                         delete managers[i]._rev
                         await company.put({...managers[i],companies:[...managers[i].companies,company_id]})
                         

                         let associated_companies=managers[i].companies

                        for (let f = 0; f < associated_companies.length; f++) {
                             let c=new PouchDB('managers-'+associated_companies[f])
                             let manager = await c.find({selector: {id:managers[i].id}})
                             manager=manager.docs[0]
                             await c.put({...manager,companies:[...manager.companies,company_id]})
                             //replicate('from','managers-'+associated_companies[f],true)
                             data._add_to_update_list('managers-'+associated_companies[f])
                        }
                    }

                    //replicate('from','managers-'+company_id,true)
                    data._add_to_update_list('managers-'+company_id)

                  
                    let new_company=JSON.parse(JSON.stringify(formData))
                    delete new_company.company

                    if(!formData.headquarter_id) {
                      delete new_company.headquarter_id
                    }

                    let new_user_content={...user,
                      companies:[...user.companies,company_id],
                      companies_details:[...user.companies_details,{
                      ...formData,
                      id:company_id,
                      admin_id:user.id,
                      _id:new Date().toISOString()
                    }]}

                    let user_db=new PouchDB('user-'+user.id)
                    let res=await user_db.put(new_user_content)
                    setUser({...new_user_content,_rev:res.rev})
                    setVerifiedInputs([])
                    setFormData(initial_form)
                    setChipOptions([])

                  }

                  toast.success('Empresa '+(id ? "actualizada" : "criada"))

                }catch(e){
                     console.log(e)
                     toast.error('Erro inesperado')
                }
              }
         }

       /*  async function SubmitForm(){
              if(valid){
                  setLoading(true)
                  toast.loading(`${id ? 'A actualizar...' :'A enviar...'}`)
                  try{
                     let response = await makeRequest({method:'post',url:`api/company/`+(id ? "update" : "create"),data:{c:formData,managers:data._managers.filter(i=>chipOptions.includes(i.email)).map(i=>i.id)}, error: ``},0);
                     toast.remove()
                     toast.success('Empresa '+(id ? "actualizada" : "criada"))

                     if(!response) return
                      
                     delete response.__v
                     let user=await db.user.get('user')
                    

                     if(id){
                        _update('companies',[response])
                        let new_user_data={...user,companies:[...user.companies.filter(i=>i.id!=formData.id),response],_rev:user._rev}
                        await db.user.put(new_user_data)
                        setUser(new_user_data)
                     }else{
                        _add('companies',[response])
                        let new_user_data={...user,companies:[...user.companies,response],_rev:user._rev}
                        await db.user.put(new_user_data)
                        setUser(new_user_data)
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
          }
              */

        
          useEffect(()=>{
            let v=true
            Object.keys(formData).forEach(f=>{

               if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email) || (!formData[f]?.length && required_fields.includes(f))){
                  v=false
               }
           })
           if(user.id!=formData.admin_id && id) v=false

           if(isFilial && !formData.headquarter_id) v=false

           if(user.companies_details.some(i=>i.name.toLowerCase()==formData.name.toLocaleLowerCase() && i.id!=formData.id)) v=false
          
           setValid(v)
          },[formData,chipOptions])
       
          
        
         return (
           <>
              <FormLayout loading={(!initialized || (id && !_all_loaded.includes('managers'))) ? true : false} name={ `${id ? 'Actualizar '+(formData.headquarter_id ? 'filial':'empresa') : 'Nova '+(isFilial ?'filial':'empresa')}`} formTitle={id ? 'Actualizar' : 'Adicionar'}>


              
              {!id && <div className="flex px-[6px] items-center mt-3" id="add-bill-account">
                   <label className="flex items-center cursor-pointer hover:opacity-90">
                    <Switch
                      checked={isFilial}
                      inputProps={{ 'aria-label': 'controlled' }}
                      onChange={(e)=>{
                         setIsFilial(!isFilial)
                      }}
                    />
                    <span>Adicionar como filial</span>
                   </label>
               </div>}




               <div className={`${ isFilial ? 'flex' :'hidden'}`}>   
               
               <FormLayout.Section>

               <div>
                       
                       <Autocomplete size="small"
                          value={filialDetails.name ? filialDetails.name : null}
                          onChange={(_, newValue) => {
                            newValue=newValue ? newValue : ''
                            let _id=user.companies_details.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,headquarter_id:_id})
                            setFilialDetails({name:newValue})
                          }}
                          noOptionsText="Sem opções"
                          defaultValue={null}
                          inputValue={filialDetails.name}
                          onInputChange={(event, newValue) => {
                            newValue=newValue ? newValue : ''
                            let _id=user.companies_details.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,headquarter_id:_id})
                            setFilialDetails({name:newValue})
                          }}
      
                          onBlur={()=>{
                               if(!formData.headquarter_id)  setFilialDetails({name:''})
                                validate_feild('headquarter')
                          }}
                          id="_transation_account"
                          options={user ? user.companies_details.filter(i=>i.admin_id==user.id).map(i=>i.name) : [] }
                          sx={{ width: 300 }}
                          disabled={id}
                          renderInput={(params) => <TextField  {...params}
                          helperText={(!formData.headquarter_id) && verifiedInputs.includes('headquarter') ? 'Campo obrigatório':''}
                          error={(!formData.headquarter_id) && verifiedInputs.includes('headquarter') ? true : false}             
                           value={filialDetails.name} label={'Empresa'} />}
                      />   
                       </div>

                </FormLayout.Section>

                </div>
                 






              
              <FormLayout.Section>
              <div>
                        <TextField
                           id="outlined-textarea"
                           label="Nome *"
                           placeholder="Digite o nome"
                           multiline
                           disabled={user.id!=formData.admin_id && id ? true : false}
                           value={formData.name}
                           onBlur={()=>validate_feild('name')}
                           onChange={(e)=>setFormData({...formData,name:e.target.value})}
                           error={(!formData.name) && verifiedInputs.includes('name') || user.companies_details.some(i=>i.name.toLowerCase()==formData.name.toLocaleLowerCase() && i.id!=formData.id) ? true : false}
                           helperText={!formData.name && verifiedInputs.includes('name') ? "Nome obrigatório" :user.companies_details.some(i=>i.name.toLowerCase()==formData.name.toLocaleLowerCase() && i.id!=formData.id)   ?'Nome já existe':''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>
       
                     
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Email"
                           placeholder="Digite o email"
                           multiline
                           value={formData.email}
                           disabled={user.id!=formData.admin_id && id ? true : false}
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
                               disabled={user.id!=formData.admin_id && id ? true : false}
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


                         {formData.contacts.map((i,_i)=>(
                           <div key={_i}>
                              <TextField
                                 id="outlined-textarea"
                                 label="Contacto"
                                 disabled={user.id!=formData.admin_id && id ? true : false}
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
                           disabled={user.id!=formData.admin_id && id ? true : false}
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
                           disabled={user.id!=formData.admin_id && id ? true : false}
                           value={formData.nuit}
                           onChange={(e)=>setFormData({...formData,nuit:e.target.value})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
       
                       <div className=" relative">
                          <MultipleSelectChip disabled={user.id!=formData.admin_id && id ? true : false} label={'Gestores'} setItems={setChipOptions} names={chipNames} items={chipOptions}/>
                        <div className="text-[13px] absolute right-[0px] top-0 translate-y-[-100%] flex items-center">
                              {(verifiedInputs.includes('company') && chipOptions.length==0) && <span className='text-[11px] text-red-500'>Campo obrigatório</span>}
                        </div>

                       </div>
              </FormLayout.Section>


              
              <div className={`ml-7 mb-4`}>
                 <MainUploader upload={upload} setUpload={setUpload} disabled={formData.admin_id!=user.id && id}/>
              </div>
              <br/>

       
       
              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>
        
                      
       
                     
       
               </FormLayout>
           </>
         )
       }
     
       export default App