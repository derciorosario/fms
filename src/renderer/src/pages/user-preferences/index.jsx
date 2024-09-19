import React, { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import UserPreferencesLayout from '../../layout/UserPreferencesLayout';
import NotificationToggles from './components/notificationToggles';
import {CameraAltRounded, Edit, Info} from '@mui/icons-material'; 
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Button, CircularProgress, Switch } from '@mui/material';
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
import FilterOptions from './components/options-filters';
import MainUploader from '../setup/compnents/upload-company-logo';
import bcrypt from 'bcryptjs';
import InsertKeyOrPay from '../../components/Dialogs/insertKeyOrPay';
import ConfirmPlanChange from '../../components/Dialogs/deleteItem'
import Filter from '../../components/Filters/basic';

function App() {
 const { t } = useTranslation();
 const [page,setPage]=React.useState('profile')
 const [editMode,setEditMode]=React.useState(false)
 const {user,db,startover, setLoaderUpdate,licenseInfo} = useAuth()
 const [showAccounts,setAccounts]=useState(false)
 const [showPassword, setShowPassword] = React.useState(false);
 const [loading, setLoading] = React.useState(false);
 const [valid, setValid] = React.useState(false);
 const {_required_data,_update,_loaded,_scrollToSection,_showPopUp,_setRequiredData,_get} = useData();
 const data = useData();
 const [formData, setFormData] = React.useState({contacts:[''],settings:{}});
 const [settingsDetails, setSettingsDetails]=React.useState({})
 const [initialized,setInitialized]=useState(false)
 const [showDownloadProcess,setShowDownloadProcess]=useState(null)
 const [userForm,setUserForm]=useState({contacts:['']})
 const [showResetInputs,setShowResetInputs]=useState(false)
 const [resetPassword,setResetPassword]=useState('')
 const [planDetails,setPlanDetails]=useState({})
 const [selectupgradeProcress,setSelectupgradeProcress]=useState(false)
 const [showConfirmPlanChange, setShowConfirmPlanChange] = useState(false)
 const [nextPaidPlan,setNextPaidPlan]=useState(null)
 const [currentPlan,setCurrentPlan]=useState(null)


 const [filterOptions,setFilterOPtions]=useState([

  {
    field:'_plan',
    name:t('common.plan'),
    not_fetchable:true,
    igual:true,
    search:'',
    groups:[
      {field:'_plan',name:t('common.plan'),items:[{name:t('common.basic'),id:'basic'},{name:t('common.advanced'),id:'advanced'}],selected_ids:[]}
    ]
  },
  {
    field:'_period',
    name:t('common.period'),
    not_fetchable:true,
    igual:true,
    search:'',
    groups:[
      {field:'_period',name:t('common.period'),items:[{name:t('common.monthly'),id:'monthly'},{name:t('common.anual'),id:'anual'}],selected_ids:[]}
    ]
  },
  {
    field:'_action',
    name:t('common.action'),
    not_fetchable:true,
    igual:true,
    search:'',
    groups:[
      {field:'_action',name:t('common.action'),items:[{name:t('common.renovation'),id:'renew'},{name:t('common._change'),id:'change'}],selected_ids:[]}
    ]
  },

])


 let required_data=['settings','account_categories']

 useEffect(()=>{
   _setRequiredData(required_data)
},[])

 
 useEffect(()=>{
    (async()=>{
      if(db.settings && data._app.id && user && (data.initSyncStatus=="completed" || data.initSyncStatus=="cancelled")){
        let set=await db.settings.allDocs({ include_docs: true })
        set=set.rows.map(i=>i.doc)[0]
        if(!set){
          set={...data.settings[`v${data._app.v}`],user_id:user.id}
        }
        setSettingsDetails(set)
        setFormData({...formData,settings:set.settings})
    }
  })()
     
 },[db,_required_data,data._app,data.initSyncStatus,user])

 useEffect(()=>{
      _get(required_data.filter(i=>!_loaded.includes(i)))    
 },[db])

 useEffect(()=>{
    if(!user) return

    data._get_all('managers') 
    let u=JSON.parse(JSON.stringify(user)) 
    delete u.companies
    delete u.companies_details
    setUserForm(u)
    setUpload({...upload,file:user.logo ? user.logo : {}})
    setPlanDetails(user.companies_details.filter(i=>i.id==user.selected_company)[0])

},[user])


useEffect(()=>{

    if(!planDetails?.planHistory){
      return
    }    
    let _currentPlan=planDetails.planHistory.filter(i=>new Date(i.end).getFullYear()==new Date().getFullYear() && new Date(i.end).getTime() >= new Date().getTime()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    console.log(_currentPlan[0])

},[planDetails])

 useEffect(()=>{
 if(!(required_data.some(i=>!_loaded.includes(i)))){
      setInitialized(true)
  }
 },[_loaded])


 let required_fields=['name','last_name']

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
           try{
            await _update('settings',[{...settingsDetails,settings:{...formData.settings}}])
            toast.success(t('common.updated-successfully'))
           }catch(e){
            toast.error(t('common.unexpected-error'))

           }
      }
 }
 
 const [upload,setUpload]=React.useState({
  uploading:false,
  file:{},
  progress:0
})




async function _selectupgradeProcress(id,renew,changingPlan){
  setShowDownloadProcess({
    ...planDetails,
    to_name:user.name,name:user.name,
    to_last_name:user.last_name,last_name:user.last_name,
    to_contact:user.contacts[0],contact:user.contacts[0],
    to_company_name:planDetails.name,company_name:planDetails.name,
    admin_id:user.id,
    id,
    changingPlan:changingPlan ? true : false,
    renew
  })

  setSelectupgradeProcress(false)
}



 
async function SubmitUserForm(){

     if(valid){
         setLoading(true)
         toast.loading(t('common.updating'))

         try{
            await data.makeRequest({method:'post',url:`api/user/profile/update`,data:{...userForm,logo:upload.file}, error: ``},0);
            toast.remove()
            toast.success(t('common.profile-updated'))
            setLoading(false)
            /*await update_user(userForm)
            _update('settings',[userForm.companies])
            setUser(userForm)*/

            setUserForm({...userForm,new_password:'',last_password:''})
             
        }catch(e){
         toast.remove()
         setLoading(false)
          if(e.response){
                if(e.response.status==409){
                    toast.error(t('common.user-or-email-exists'))
                }
                if(e.response.status==400){
                    toast.error(t('common.invalid-data'))
                }
                if(e.response.status==401){
                  toast.error(t('common.wrong-password'))
                }
                if(e.response.status==404){
                  toast.error(t('common.item-not-found'))
                }
                if(e.response.status==500){
                  toast.error(t('common.unexpected-error'))
                }
              
                
          }else if(e.code=='ERR_NETWORK'){
               toast.error(t('common.check-network'))
          }else{
               console.log(e)
               toast.error(t('common.unexpected-error'))
          }
          setLoading(false)
        }
        
     }else{
      toast.error(t('common.fill-all-requied-fields'))
     }
 }


  useEffect(()=>{
    let v=true
    Object.keys(userForm).forEach(f=>{
        if((!userForm[f].length && required_fields.includes(f))){
            v=false
        }

        if(userForm.change_password && (!userForm.last_password || !userForm.new_password)){
          v=false
        }
    })
    setValid(v)
  },[userForm])


  function activeAndDisable(field,not_type){
    console.log({field})
    setFormData({...formData,settings:{...formData.settings,[field]:{...formData.settings[field],[not_type]:!formData.settings[field][not_type]}}})
  }



  async function reset(){
   
    if(!resetPassword){
        return
    }

    let check=await bcrypt.compare(resetPassword, user.password)
    if(!check){
      toast(t('common.wrong-password'))
      return
    }


    startover()
  }
     
        
  function editProfile(){
    setTimeout(()=>_scrollToSection('edit-profile'),100)
    setEditMode(true)
  }


  function upgradeOrDownGradePlan(){
    let _nextPaid=planDetails.planHistory.filter(i=>new Date(i.startDate) > new Date())[0]
    if(_nextPaid){
        setShowConfirmPlanChange(true)
        setNextPaidPlan(_nextPaid)
    }else{
        _selectupgradeProcress(2,null,'changingPlan')
    }
  }


  function updatePlan(r){
    setLoaderUpdate(true)
    applyLicenseUpdate({company:r.updated_plan})
  }

  function ConfirmPlanChange_f(res){
     if(res){
      setShowConfirmPlanChange(false)
      _selectupgradeProcress(2,null,'changingPlan')
     }else{
       setShowConfirmPlanChange(false)
     }
  }


  async function applyLicenseUpdate(r){


    setLoaderUpdate('updating')

    updateUser({...user,companies_details:user.companies_details.map(i=>({
      ...i,
      planHistory:r.company.planHistory,
      period:r.company.period,
      plan:r.company.plan,
      planUpdatedAt:r.company.planUpdatedAt,
      license:r.company.license,
      planEnd:r.company.planEnd
      
      }))})

   
  }
  function handleErrors(e){

    if(e.response){
        if(e.response.status==404){
            toast.error(t('common.user-not-found'))
        }
        if(e.response.status==500){
            toast.error(t('common.unexpected-error'))
        }
    }else if(e.code=='ERR_NETWORK'){
      toast.error(t('common.check-network'))
    }else{
      toast.error(t('common.unexpected-error'))
    }

  }


  async function verifyPlanUpdate(){
      setLoaderUpdate(true)
      try{

        let r=await data.makeRequest({method:'post',url:`api/check-license-update`,data:{
          user_id:user.id,
          company:planDetails
        }, error: ``},2);

        if(r.status==1){
            setLoaderUpdate(false)
            toast.error(t('common.no-updated-license'))
            return
        }

        
          toast.success(t('common.license-updated'))
          setLoaderUpdate('updating')

         applyLicenseUpdate(r)
       
      }catch(e){
           setLoaderUpdate(false)
           handleErrors(e)
      }   
  }



  async function updateUser(user){

    let user_db=new PouchDB('user-'+user.id)
    user_db.createIndex({index: { fields: ['id'] }})
    let _user=await user_db.find({selector: { id:user.id }})
    _user=_user.docs[0]
    _user.companies_details=user.companies_details
    await user_db.put(_user)
    setTimeout(()=>{
        if(window.electron){
          window.electron.ipcRenderer.send('relaunch')
        }else{
          window.location.reload()
        }
    },5000)


  }


  async function cancelOrActivateSubscription(){

      if(!planDetails.cancelAt){
        setLoaderUpdate('cancelling-subs')
      }else{
        setLoaderUpdate(true)
      }

    try{

      let r=await data.makeRequest({method:'post',url:`api/${planDetails.cancelAt?'activate':'cancel'}-subscription`,data:{
        user_id:user.id,
        company:planDetails
      }, error: ``},2);



      if(planDetails.cancelAt) {
        setLoaderUpdate('updating')
      }
      

      updateUser({...user,companies_details:user.companies_details.map(i=>({
        ...i,
        cancelAt:r.cancelAt
      }))})

     
    }catch(e){
         setLoaderUpdate(null)
         handleErrors(e)
    }   
}


const [filters,setFilters]=useState({plan:[],period:[],action:[]})

useEffect(()=>(

  setFilters({
      plan:filterOptions.filter(i=>i.groups.filter(f=>f.field=="_plan")[0])?.[0]?.groups?.[0]?.selected_ids,
      period:filterOptions.filter(i=>i.groups.filter(f=>f.field=="_period")[0])?.[0]?.groups?.[0]?.selected_ids,
      action:filterOptions.filter(i=>i.groups.filter(f=>f.field=="_action")[0])?.[0]?.groups?.[0]?.selected_ids
  })

),[filterOptions])


  return (

    <>
           
           <ConfirmPlanChange show={showConfirmPlanChange} messageContent={(
                <div>
                    <p className="mb-2">{t(`messages.confirm-registration-plan-change`,{plan:t('common.'+nextPaidPlan?.plan)})} {nextPaidPlan?.startDate?.split('T')?.[0]}</p>
                    
                    <span>{t('common.sure-to-continue')}</span>
                </div>
           )} res={ConfirmPlanChange_f}/>
           <InsertKeyOrPay show={selectupgradeProcress} res={_selectupgradeProcress}/>
         
           <UserPreferencesLayout res={updatePlan} setShowDownloadProcess={setShowDownloadProcess} showDownloadProcess={showDownloadProcess}  page={page} setPage={setPage}>

           {page=="profile"  ? <>
               
               <div className="py-6">
                 
 
               <div className=" bg-app_orange-200 w-full rounded h-[150px] shadow-sm flex items-end justify-center mb-[100px]">         
                  
                    <MainUploader upload={upload} setUpload={setUpload} CustomUploader={()=>(
    
                           <div  style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${data.APP_BASE_URL+"/file/"+upload.file.generated_name?.replaceAll(' ','%20')}")`}} className="flex items-center justify-center size-36 rounded-full bg-white shadow-sm translate-y-[50%] ">
                                {!upload.file.generated_name && <CameraAltRounded sx={{color:colors.app_orange[400]}}/>}
                                {upload.uploading &&  <CircularProgress variant="determinate" style={{color:colors.app_orange[500]}} value={upload.progress / 100 * 100} /> }
                           </div>
                        
                    )}/>

              </div>
                    

                    <div className="flex justify-center flex-col items-center">
                         <span className="font-semibold text-[19px] mb-1">{user.name} {user.last_name} </span>
                         <span>{user.email}</span>
                    </div>


                    {!editMode  && <div className="flex justify-center mt-4" >
                       <DefaultButton goTo={editProfile} text={t('common.edit-profile')} no_bg={true} disabled={false}/>
                    </div>}


                   {editMode &&  <span className="flex border-b my-4"></span>}


                    <div id="edit-profile"  className={`bg-white py-1 border pb-5 rounded-[0.3rem] ${!editMode ? 'hidden' :''}`}>

                    <div className="p-[15px] opacity-75 flex justify-between items-center">
                        <span className="font-medium text-[18px]">{t('userPreferences.notifications.alerts')}</span>
                       {!data.online && <div className="opacity-65">
                           <Info sx={{width:20}}/> <label>{t('common.you-need-internet')}</label> 
                        </div>}
                    </div>

                        <span className="flex border-t border-zinc-200 w-[98%] mx-auto mb-4"></span>


                        <FormLayout.Section>


                        <div>
                        <TextField
                           id="outlined-textarea"
                           label={t('common.name')}
                           placeholder={t('common.type-name')}
                           multiline
                           value={userForm.name}
                           onBlur={()=>validate_feild('name')}
                           onChange={(e)=>setUserForm({...userForm,name:e.target.value})}
                           error={(!userForm.name) && verifiedInputs.includes('name') ? true : false}
                           helperText={!userForm.name && verifiedInputs.includes('name') ? t('common.required-field') :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLuserFormled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Apelido *"
                           placeholder={t('common.type-name')}
                           value={userForm.last_name}
                           onBlur={()=>validate_feild('last_name')}
                           onChange={(e)=>setUserForm({...userForm,last_name:e.target.value})}
                           error={(!userForm.last_name)  && verifiedInputs.includes('last_name') ? true : false}
                           helperText={verifiedInputs.includes('last_name') && !userForm.last_name ? "Apelido obrigatório" :''}
                           multiline
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                       <div>
                        <TextField
                           id="outlined-textarea"
                           label="Email *"
                           multiline
                           disabled={true}
                           value={userForm.email}
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
                               options={userForm.contacts}
                               getOptionLabel={(option) => option}
                               renderInput={(params) => (
                                  <TextField {...params} label={t('common.contacts')} placeholder={t('common.type-contacts')} />
                               )}
                               value={userForm.contacts}
                               sx={{width:'100%',marginRight:1,'& .MuiAutocomplete-endAdornment':{display:'none'}}}
                            />
                             <Button onClick={()=>userForm.contacts}  variant="outlined" style={{height:39,width:30}}>
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
                           value={userForm.contacts[0]}
                           onChange={(e)=>setUserForm({...userForm,contacts:[e.target.value]})}
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
                           value={userForm.address}
                           onChange={(e)=>setUserForm({...userForm,address:e.target.value})}
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
                           value={userForm.nuit}
                           onChange={(e)=>setUserForm({...userForm,nuit:e.target.value})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                       </div>
       
                    
       
                       <div className="w-[100%]">
                       <TextField
                               id="outlined-multiline-static"
                               label={t('common.notes')}
                               multiline
                               rows={4}
                               value={userForm.notes}
                               onChange={(e)=>setUserForm({...userForm,notes:e.target.value})}
                               defaultValue=""
                               sx={{width:'100%'}}
                               />
                       </div>
              </FormLayout.Section>



               <span className="flex border-b"></span>

                <div className="flex px-[6px] items-center mt-3 mb-2" id="change-password">
                <label className="flex items-center cursor-pointer hover:opacity-90">
                <Switch
                    checked={Boolean(userForm.change_password)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    
                    onChange={(e)=>{
                        setTimeout(()=>_scrollToSection('change-password'),100)
                        setUserForm({...userForm,change_password:!Boolean(userForm.change_password)})
                    }}
                />
                <span>{t('common.change-password')}</span>
                </label>
                </div>

                <div className={`${userForm.change_password ? 'flex' :'hidden'}`}>   
                    

                <FormLayout.Section style={{marginTop:0,paddingTop:5}}>

                <div  style={{transform:'translateX(-0.5rem)'}}>
                       <FormControl sx={{ m: 1 ,width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">{t('common.last-password')} *</InputLabel>
                            <OutlinedInput
                               id="outlined-adornment-password"
                               type={showPassword ? 'text' : 'password'}
                               onBlur={()=>validate_feild('last_password')}
                               value={userForm.last_password}
                               onChange={(e)=>setUserForm({...userForm,last_password:e.target.value})}
                               error={true}
                               helperText={(userForm.last_password?.length <= 5 && verifiedInputs.includes('last_password')) ? t('password-was-to-have-more-than-6') : verifiedInputs.includes('password') && !formData.password ? "Senha obrigatória" :''}
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
                               label={t('common.last-password')}
                            />
                   </FormControl>


                   
                       </div>

                       <div style={{transform:'translateX(-0.5rem)'}}>
                       <FormControl sx={{ m: 1 ,width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">{t('common.new-password')} *</InputLabel>
                            <OutlinedInput
                               id="outlined-adornment-password"
                               type={showPassword ? 'text' : 'password'}
                               onBlur={()=>validate_feild('mew_password')}
                               value={userForm.new_password}
                               onChange={(e)=>setUserForm({...userForm,new_password:e.target.value})}
                               error={true}
                               helperText={(userForm.new_password?.length <= 5 && verifiedInputs.includes('new_password')) ? 'Senha deve ter no minimo 6 caracteres' : verifiedInputs.includes('password') && !formData.password ? "Senha obrigatória" :''}
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
                               label={t('common.new-password')}
                            />
                   </FormControl>


                   
                       </div>
                        
                

                </FormLayout.Section>

                </div>
       
       
                   <FormLayout.SendButton SubmitForm={SubmitUserForm} loading={loading} valid={valid} id={true}/>
        
                       

                    </div>
                    
               </div>
                  
           </> : (page=="notifications") ? <>
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
                                    <NotificationToggles initialized={initialized} field="alerts" email={formData.settings?.alerts?.email} whatsapp={formData.settings?.alerts?.whatsapp} activeAndDisable={activeAndDisable}/>
                                </div>
            
                                <div className="grid border-b py-6 sm:grid-cols-2">
                                    <div className="">
                                    <h2 className="text-lg font-semibold leading-4 text-slate-700">{t('userPreferences.notifications.reminders')}</h2>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.remindersText')}</p>

                                    <div className=" mt-8 w-full flex items-center">
                                       
                                        <span className="mr-3 font-light">{t('common.notifications-period')}</span>


                                        {!initialized ? <>

                                          <div className="table border-r skeleton-bg h-[17px] rounded-[4px] w-[110px]"></div>
                                        
                                        </>:<>

                                        <select value={formData.settings?.bills_not?.days} onChange={(e)=>{

                                                  let days=e.target.value.includes('7') ? 2 : e.target.value

                                                  setFormData({...formData,settings:{...formData.settings,bills_not:{...formData.settings?.bills_not,days}}})

                                                  }} id="category" class="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5">
                                                     {[{
                                                      value:1,
                                                      text:t('common.one-day-before')
                                                     },
                                                     {
                                                      value:2,
                                                      text:t('common.within--days',{days:7})
                                                     },
                                                     {
                                                      value:3,
                                                      text:t('common.within--days',{days:15})
                                                     }].map(i=>(
                                                      <option value={i.value} selected={formData.settings?.bills_not?.days==i.value ? true : false}>{i.text}</option>
                                                     ))}
                                                  </select>
                                        </>}

                                    </div>


                                    <div className="mt-3 w-full flex items-center">
                                     
                                       <span className="mr-3 font-light">{t('common.select-accounts-to-notify')}</span>

                                          {!initialized ? <>

                                              <div className="table border-r skeleton-bg h-[17px] rounded-[4px] w-[110px]"></div>

                                              </>:<>
                                              <div className="_not_bill_accounts">
                                        <button onClick={()=>_showPopUp('not_bill_accounts')}  className={`flex relative items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:outline-none font-medium  rounded-lg text-[13px] px-3 py-[3px] text-center`}>
                                            <FilterOptions formData={formData} setFormData={setFormData} show={showAccounts}/>
                                        <span className="text-gray-900 ml-1 rounded-[0.3rem] flex p-1 items-center font-normal">{formData.settings?.bills_not?.accounts?.length==0 ? `${t('common.all_s')}` : `${formData.settings?.bills_not?.accounts?.length || '(0)'} ${t(`confirm.selected${formData.settings?.bills_not?.accounts?.length!=1 ? '_s' :''}`)} ` } <ExpandMoreOutlined style={{width:16}}/></span>
                                        </button>
                                      </div>
                                          </>}
                                      </div>

                                    </div>
                                    <NotificationToggles initialized={initialized} field={'reminder'} email={formData.settings?.reminder?.email} whatsapp={formData.settings?.reminder?.whatsapp} activeAndDisable={activeAndDisable}/>
                                </div>
                                <div className="grid border-b py-6 sm:grid-cols-2">
                                    <div className="">
                                    <h2 className="text-lg font-semibold leading-4 text-slate-700">{t('userPreferences.notifications.updates')}</h2>
                                    <p className="font- text-slate-600">{t('userPreferences.notifications.updatesText')}</p>
                                    </div> 
                                    <NotificationToggles initialized={initialized} field={'updates'} email={formData.settings?.updates?.email} whatsapp={formData.settings?.updates?.whatsapp} activeAndDisable={activeAndDisable}/>
                                </div>
                     </div>
                     <div className="py-4">
                      <DefaultButton goTo={SubmitForm} loading={!initialized} text={loading ? t('common.updating')+'...' :t('common.update')} disabled={false}/>
                    </div>
           </>:page=="data" ? <>
           <div className="py-5 mb-4">
              <span className="font-semibold text-[25px] mb-5 flex">{t('common.clear-data')}</span>
               <Alert severity="warning">{t('messages.clear-data-msg')}</Alert>        

                {!showResetInputs && <button className="bg-red-600 text-white px-3 py-2 rounded-[0.3rem] mt-3 cursor-pointer hover:opacity-75" onClick={()=>{
                              setShowResetInputs(true)
                }}>{t('common.clear')}</button> }  

                {showResetInputs && <div>
                  <div className="flex items-center mt-3 mb-3">
                    <input onChange={(e)=>{
                       setResetPassword(e.target.value)
                    }}  className="p-1 border rounded-[0.2rem] h-[40px]" placeholder={t('common.type-password')} value={resetPassword}/>
                    <button className="bg-app_orange-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                              reset()
                    }}>{t('common.clear')}</button>  
                  </div>
                  <span className="underline cursor-pointer text-blue-500" onClick={()=>{
                    setShowResetInputs(false)
                    setResetPassword('')
                  }}>{t('common.cancel')}</span>
                </div>  }  
           </div>
                    
           </>:<>

           <div className="py-5 mb-4">
              <span className="font-semibold text-[25px] mb-5 hidden flex">{t('common.clear-data')}</span>
              <div>
                     <span className="text-[15px] text-gray-400">{t('common.current-plan')}</span>
                     <div className="w-full flex mt-2 max-md:flex-col">
                            <div className="flex-1">
                              <h2 className="text-[24px] font-semibold mb-2">{planDetails?.plan == "basic" ? t('common.basic') : t('common.advanced')}</h2>
                              {planDetails?.plan == "basic" ? <div>

                                <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.basic-plan-item-1')}</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.basic-plan-item-2')}</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.basic-plan-item-3')}</label>
                                 </span>
                              </div> : <div>

                                        <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.advanced-plan-item-1')}</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.advanced-plan-item-2')}</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.advanced-plan-item-3')}</label>
                                         </span>

                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">{t('common.advanced-plan-item-4')}</label>
                                         </span>


                              </div>}

                              <span className="text-gray-500 flex my-5">{t('common.license-end')}: {planDetails?.planEnd.split('T')[0]}</span>
                            
                              </div>

                              <div className="flex flex-col gap-y-2 items-end">

                              
                               {(!planDetails.cancelAt && (parseInt(licenseInfo?.left_days) <= 5)) && <button  className=" ml-4 text-green-500 px-3 py-2 rounded-[0.3rem] border border-green-500 cursor-pointer hover:opacity-75" onClick={()=>{
                                  _selectupgradeProcress(2,'renew')
                                }}>{t('common.renew-plan')}</button>}


                                 {(planDetails?.planHistory.filter(i=>new Date(i.date).getMonth()==new Date().getMonth() && i.type=="change").length<=1 && !planDetails.cancelAt) && <button  className="bg-app_orange-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                  upgradeOrDownGradePlan()
                                 }}>{t('common.change-plan')}</button>}

                                {(!planDetails.cancelAt) ? <button  className="bg-gray-400 ml-4 text-white px-3 py-2 rounded-[0.3rem] cursor-pointer hover:opacity-75" onClick={()=>{
                                  cancelOrActivateSubscription()
                                }}>{t('common.cancel-plan')}</button> : <div className="w-[200px] flex flex-col items-end">
                                     <span className={`text-orange-500`}>{t('messages.the-subscriptions-will-end-at')} {planDetails?.cancelAt?.split('T')?.[0]}. <label onClick={cancelOrActivateSubscription} className="cursor-pointer  underline text-green-600">{t('common.reactivate')}</label></span>
                                </div>} 

                               {!planDetails.cancelAt && <div className="w-[200px]">
                                  <span className="mb-2 text-[14px] flex text-end mt-4 text-gray-500 flex-col">{t('messages.plan-not-updated-after-purchase')}<label onClick={verifyPlanUpdate} className="underline cursor-pointer text-[15px] flex mt-2  justify-end text-blue-500">{t('common.check-plan-update')}</label></span>
                               </div>}

                            </div>
                     </div>


                     <div className="w-full h-[1px] my-[30px]"></div>


                     <div>
                       
                          <h2 className="text-[24px] font-semibold mb-2">{t('common.billing-history')}</h2>

                          <div className="flex flex-wrap bg-white shadow mb-2 rounded-[0.2rem]">
               
                                  {filterOptions.map((i,_i)=>(
                                          <Filter key={_i} filterOptions={filterOptions} shownFilters={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                                  ))}
                          </div>

                          <div>

                            <div class="relative overflow-x-auto max-h-[300px]">
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead class="text-xs text-gray-900 uppercase">
                                        <tr>
                                            <th scope="col" class="py-3">
                                                {t('common.plan')}
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {t('common.date')}
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {t('common.start')}
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {t('common.end')}
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                {t('common.period')}
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                               
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planDetails?.planHistory?.filter(i=>(filters.plan.includes(i.plan) || !filters.plan.length) && (filters.action.includes(i.type) || !filters.action.length) && (filters.period.includes(i.period) || !filters.period.length))?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())?.map((i,_i)=>(
                                            <tr class="">
                                            <th scope="row" class="py-4 font-medium text-gray-900 whitespace-nowrap">
                                               {i.plan == "basic" ? t('common.basic') : t('common.advanced')}
                                            </th>
                                            <td class="px-6 py-4">
                                              {i.date.split('T')[0]} {i.date.split('T')[1].slice(0,5)}
                                            </td>
                                            <td class="px-6 py-4">
                                              {i.startDate.split('T')[0]} {i.startDate.split('T')[1].slice(0,5)}
                                            </td>
                                            <td class="px-6 py-4">
                                              {i.end.split('T')[0]} {i.end.split('T')[1].slice(0,5)}
                                            </td>
                                            <td class="px-6 py-4">
                                                {t(`common.${i.period}`)}
                                            </td>
                                            <td class="px-6 py-4">
                                                {i.type!="new" && <span className={`p-1 rounded-[0.3rem]  ${i.type=="change" ? 'bg-app_orange-100':'bg-green-200'}`}>{i.type=="renew" ?  t('common.renovation') : t('common._change')}</span>}
                                            </td>
                                           </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                          </div>
                     </div>



              </div>
           </div>

           </>}
         </UserPreferencesLayout>
    </>

  )

}

export default App

