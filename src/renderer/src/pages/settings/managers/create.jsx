
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
import { ArrowRightOutlined, Close, ContentCopy, Info } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';  
import colors from '../../../assets/colors.json'   
import { Alert, CircularProgress } from '@mui/material';
import { t } from 'i18next';
       
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
          const [inviteLoader,setInviteLoader] = React.useState(true)
          const [showInviteD,setShowD] = React.useState(false)
          const [savedInvite,setSavedInvite] = React.useState()
          const [inviteRes,setInviteRes] = React.useState(null)
          const [prevEmail,setPrevEmail] = React.useState('')


         


          useEffect(()=>{

            if(!id || !db.managers || formData.id==id) return 

               (async()=>{

                     let item =  await db.managers.find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)
                     setPrevEmail(item.email)
                     handleLoaded('form','add')
                     }else{
                      toast.error(t('common.item-not-found'))
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
                              data._add_to_update_list('managers-'+removed_from[i])
                           
                           }



                           if(user.email==prevEmail || formData.created_by==user.id){
                       
                              for (let i = 0; i < last_companies.length; i++) {
                                 let company=new PouchDB('managers-'+last_companies[i])
                                 let manager = await company.find({selector: {email:formData.email}})
                                 manager=manager.docs[0]
                                 console.log({manager})
                                 await company.put({...formData,_rev:manager._rev})
                                 data._add_to_update_list('managers-'+last_companies[i])
                              
                              }

                              if(user.email==prevEmail){

                                 toast.success(id ? t('common.updated-successfully')  :  t('common.added-successfully'))
                                 setLoading(false)
                                 return

                              }
   
                              
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
                               toast.error(t('common.email-used-in')+' '+company_name)
                               email_used=true
                           }else{
                               managers.push({...formData,action:'create_new',id:uuidv4(),_id:new Date().toISOString(),companies,company_id:companies[i]})
                           }
                        }
                     }
                     
                     // Email was not used in any company

                     if(!email_used){


                        for (let i = 0; i < managers.length; i++) {

                           let company_id=JSON.parse(JSON.stringify(managers[i].company_id))
                           let company=new PouchDB('managers-'+managers[i].company_id)
                           delete managers[i].company_id

                           if(managers[i].action=="update"){
                              delete managers[i].action
                              await company.put(managers[i])    
                           }else{
                              delete managers[i].action
                              let form=JSON.parse(JSON.stringify(formData))
                              delete form._rev
                              await company.put({...form,id:uuidv4(),_id:new Date().toISOString(),companies,created_by:user.id})
                           }

                            data.replicate('from','managers-'+company_id,false)
                            data._add_to_update_list('managers-'+company_id)

                       }

                     }
                    
                    
                    
                     setLoading(false)
                     if(!email_used) {
                        toast.success(id ? t('common.updated-successfully')  :  t('common.added-successfully'))



                           if(!id){

                                 setSavedInvite(formData.invite)
                                 setInviteRes(null)
                                 setShowD(true)

                                 if(!data.online){
                                    setInviteRes(false)
                                    setInviteLoader(false)
                                    return
                                 }

                                 try{
                                    let res=await data.makeRequest({method:'post',url:`api/check-invite/`,data:{
                                       email:formData.email,
                                       invite:formData.invite
                                    }, error: ``},8);

                                    if(res.first_login){
                                       setInviteRes(null)
                                       setInviteLoader(false)
                                       setShowD(false)
                                       toast(t('common.invite-validated'))
                                    }else{
                                       if(inviteRes==null) setInviteRes(true)
                                       setInviteLoader(false)
                                    }
                                 }catch(e){
                                       setInviteRes(false)
                                       setInviteLoader(false)
                                       setShowD(true)
                                 }
                        }
                     }


                     

              }catch(e){
                     setLoading(false)
                     console.log(e)
                     toast.error(t('common.unexpected-error'))
              }

              if(!id && email_used==false){
                  setVerifiedInputs([])
                  setFormData(initial_form)
                  setChipOptions([])
              }

            }


      }


       
          useEffect(()=>{
            let v=true
            Object.keys(formData).forEach(f=>{
               if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) || (!formData[f]?.length && required_fields.includes(f))){
                  v=false
               }
           })

            if(!chipOptions.length || ((!canEdit || formData.email==user.email) && prevEmail!=user.email)) v=false


           setValid(v)
          },[formData,chipOptions])
       
        
          const handleCopyClick = (text) => {

             navigator.clipboard.writeText(data.FRONT_URL+'/#/confirm-invite?invite='+(savedInvite ? savedInvite : formData.invite)).then(() => {
                toast.success(t('messages.text-copied'));
             }).catch(err => {
                alert('Failed to copy text: ', err);
             })

         }
        

         return (
           <>
                <div className={`bg-[rgba(0,0,0,0.4)]  ${!showInviteD ? 'translate-y-[10%] opacity-0 pointer-events-none' :'' } transition duration-75 ease-in-out h-[100vh] w-full fixed z-20 flex items-center justify-center`}>
                     
                     { inviteRes != null && <div className="flex w-full h-full absolute left-0 top-0" onClick={()=>{
                        setInviteRes(null)
                        setInviteLoader(false)
                        setShowD(false)
                     }}></div>}
                   
                     {inviteRes != null && <div className="flex absolute top-6 left-6 cursor-pointer hover:opacity-65" onClick={()=>{
                        setInviteRes(null)
                        setInviteLoader(false)
                        setShowD(false)
                     }}>
                         <div className="mr-2 shadow-sm  bg-app_orange-400 flex items-center justify-center rounded-sm">
                             <Close sx={{color:'#fff'}}/>
                         </div>
                         <span className="text-white">{t('common.close')}</span>
                     </div>}

                     <div className="flex items-center mt-3 mb-3 p-3 rounded-[0.3rem] bg-white relative z-10">
                            {inviteLoader && <div className="flex items-center">
                               <span className="flex scale-75 mr-2"><CircularProgress style={{color:colors.app_orange[500]}} value={10} /></span>
                               <span>{t('common.validating-invite')}...</span>
                            </div> } 

                            {inviteRes != null && <div>
                                 {inviteRes == false && <div className="max-w-[400px] min-w-[400px]">
                                    <Alert severity="warning">{t('could-not-validate-link')}</Alert>        
                                 </div>}

                                 {inviteRes == true && <div className="max-w-[400px] min-w-[400px]">
                                    <Alert security="info">{t('common.link-validated')}.</Alert>        
                                 </div>}

                                 {<div className="flex items-center mt-5">
                                       <button className="bg-app_orange-400  text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                                handleCopyClick()
                                                setShowD(false)  
                                       }}><span> <ContentCopy/></span>{t('common.copy-link')}</button> 


                                       <div onClick={()=>{
                                             window.open(data.FRONT_URL+'/#/confirm-invite?invite='+(savedInvite ? savedInvite : formData.invite), "_blank")
                                       }} className="px-4 text-app_orange-400 underline cursor-pointer table hover:opacity-80"><ArrowRightOutlined/>{t('common.go-to-link')}</div>
                                 </div>}


                           </div> }
                     </div>
              
             
                   </div>


              <FormLayout loading={!initialized} name={ `${id ?  t('common.update-manager') : t('common.new-manager')}`} formTitle={id ? t('common.update') : t('common.add')}  topLeftContent={(
                  <>
                     {(formData.firstLogin && prevEmail!=user.email && formData.created_by!=user.id) && <span className="text-gray-400 font-light"><Info sx={{width:20}}/> {t('messages.cannot-update-personal-data')}</span>}

                      {(!formData.firstLogin && id) && <div className="flex items-center">

                        <div onClick={()=>{
                         handleCopyClick()
                       }} className="px-2 text-app_orange-400 underline cursor-pointer table hover:opacity-80"><ContentCopy/> {t('common.copy-invite')}</div>

 
                        <div onClick={()=>{
                         window.open(data.FRONT_URL+'/#/confirm-invite?invite='+(savedInvite ? savedInvite : formData.invite), "_blank")
                       }} className="px-2 text-app_orange-400 underline cursor-pointer table hover:opacity-80"><ArrowRightOutlined/>{t('common.access-link')} </div>


                      </div>}
                     

                  </>
              )}>
              

            <div className={`${!initialized ? 'opacity-50 pointer-events-none' :''}`}>
               

              <FormLayout.Section>

              <div>
                        <TextField
                           id="outlined-textarea"
                           label={t('common.name')}
                           placeholder={t('common.type-name')}
                           multiline
                           disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
                           value={formData.name}
                           onBlur={()=>validate_feild('name')}
                           onChange={(e)=>setFormData({...formData,name:e.target.value})}
                           error={(!formData.name) && verifiedInputs.includes('name') ? true : false}
                           helperText={!formData.name && verifiedInputs.includes('name') ? t('common.required-field') :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label={t('common.surname')}
                           placeholder={t('common.type-surname')}
                           value={formData.last_name}
                           disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
                           onBlur={()=>validate_feild('last_name')}
                           onChange={(e)=>setFormData({...formData,last_name:e.target.value})}
                           error={(!formData.last_name)  && verifiedInputs.includes('last_name') ? true : false}
                           helperText={verifiedInputs.includes('last_name') && !formData.last_name ? t('common.required-field') :''}
                           multiline
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Email *"
                           placeholder={t('common.type-email')}
                           multiline
                           disabled={formData.firstLogin || !canEdit ? true : false}
                           value={formData.email}
                           onBlur={()=>validate_feild('email')}
                           onChange={(e)=>setFormData({...formData,email:e.target.value})}
                           error={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') || formData.email==user.email && !formData.firstLogin ? true : false}
                           helperText={(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email)  && verifiedInputs.includes('email') ? t('common.invalid-email'):formData.email==user.email && !formData.firstLogin ? 'Não pode adicionar seu email':''}
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
                               disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
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

                         {formData.contacts.map((i,_i)=>(
                           <div key={_i}>
                              <TextField
                                 id="outlined-textarea"
                                 label={t('common.contact')}
                                 disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
                                 placeholder={t('common.type-contact')}
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
                           label={t('common.address')}
                           placeholder={t('common.type-address')}
                           multiline
                           disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
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
                           disabled={(formData.firstLogin || !canEdit) && prevEmail!=user.email && formData.created_by!=user.id ? true : false}
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
                               label={t('common.notes')}
                               multiline
                               rows={4}
                               disabled={formData.firstLogin || !canEdit ? true : false}
                               onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>

                       <div className=" relative">
                          <MultipleSelectChip disabled={!canEdit} validate_feild={validate_feild} label={t('common.access-to-companies')} setItems={setChipOptions} names={chipNames} items={chipOptions}/>
                        <div className="text-[13px] absolute right-[0px] top-0 translate-y-[-100%] flex items-center">
                              {(verifiedInputs.includes('company') && chipOptions.length==0) && <span className='text-[11px] text-red-500'>{t('common.required-field')}</span>}
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