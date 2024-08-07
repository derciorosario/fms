
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useLocation, useParams} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import FormLayout from '../../../layout/DefaultFormLayout';
import PouchDB from 'pouchdb';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { Switch } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';      
import { useAuth } from '../../../contexts/AuthContext';
import { t } from 'i18next';
       
       function App({isPopUp}) {

          const { id } = useParams()
          
          const {db} = useAuth()

          const [items,setItems]=React.useState([])

          const {pathname} = useLocation()


          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const [initialized,setInitialized]=React.useState()

          const required_data=['payment_methods']

          const {_required_data,_setRequiredData,_get,_loaded,_payment_methods,_add,_update,_cn_op,_scrollToSection,_openDialogRes,_setOpenDialogRes,_setOpenCreatePopUp} = useData();
          
          
          
            let initial_form={
               name:'',
               notes:'',
               type:'',
               last_transation_date:'',
               has_initial_amount:false,
               initial_amount:'',
               deleted:false
           }



          const [formData, setFormData] = React.useState(initial_form);
          

          useEffect(()=>{

            if(!id || !db.payment_methods || formData.id==id || isPopUp) return 
               (async()=>{
                     let item =  await db.payment_methods.find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)
                     }else{
                      toast.error(t('common.item-not-found'))
                      navigate(`/payment_methods`)
                     }
               })()
          },[db,pathname,_required_data])

          useEffect(()=>{
            _setRequiredData(required_data)
         },[])
         



          useEffect(()=>{
            if(!(required_data.some(i=>!_loaded.includes(i)))){
                setInitialized(true)
            }
           },[_loaded])
          
           useEffect(()=>{
                _get(required_data.filter(i=>!_loaded.includes(i)))    
           },[db])

           useEffect(()=>{
              setItems(_payment_methods)
          },[_payment_methods])
      
        
       
          let required_fields=['name','type']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }
       
      
       
         async function SubmitForm(){
              
              if(valid){
                  if(items.some(i=>i.name.toLowerCase() == formData.name.toLowerCase() && i.id!=id)){
                     toast.error(t('common.name-exists'))
                     return
                  }

                   try{
                     if(id && !isPopUp){
                        _update('payment_methods',[{...formData}])
                        toast.success(t('common.updated-successfully'))
                     }else{
                          let new_id=uuidv4()
                          let new_item={...formData,id:new_id}
                          let res=await _add('payment_methods',[new_item])

                          if(res.ok){
                            _setOpenDialogRes({..._openDialogRes,item:new_item,page:'payment_methods'})
                          }


                        setVerifiedInputs([])
                        toast.success(t('common.added-successfully'))
                        setFormData(initial_form)

                        if(isPopUp) _setOpenCreatePopUp('')



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
                if((!formData[f]?.length && required_fields.includes(f))){
                    v=false
                }
                if(formData.has_initial_amount && (!formData.last_transation_date || !formData.initial_amount)){
                    v=false
                }
               })
             setValid(v)
          },[formData])


          useEffect(()=>{
             if(!formData.has_initial_amount && !id)  setFormData({...formData,initial_amount:'',last_transation_date:null})
          },[formData.has_initial_amount])


        
         return (
           <>

         <FormLayout loading={!initialized || loading} isPopUp={isPopUp} maxWidth={'700px'} name={id ? t('common.add-update') : t('common.add-new_')} formTitle={isPopUp ? t('common.add-payment-method') : (id ? t('common.update') : t('common.add-new_'))}>

                    <FormLayout.Section maxWidth={'700px'}>

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

                        <div>
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">{t('common.type')}</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                defaultValue=""
                                label={t('common.type')}
                                onChange={(e)=>setFormData({...formData,type:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                { /*<MenuItem value="">
                                               <em>Selecione o tipo</em>
                                </MenuItem>*/} 
                                <MenuItem value={'cashier'}>{t('common.cashier')}</MenuItem>
                                <MenuItem value={'bank'}>{t('common.bank')}</MenuItem>
                                <MenuItem value={'mobile'}>{t('common.mobile')}</MenuItem>
                                <MenuItem value={'other'}>{t('common.another')}</MenuItem>
                                </Select>

                        </FormControl>


                   
                        </div>

                        

               
       
                       <div className="w-[100%]">

                                <TextField
                                        id="outlined-multiline-static"
                                        label={t('common.notes')}
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

                    <div className="flex px-[6px] items-center mt-3 mb-2" id="add-initial-amount">
                      <label className="flex items-center cursor-pointer hover:opacity-90">
                      <Switch
                          checked={Boolean(formData.has_initial_amount)}
                          inputProps={{ 'aria-label': 'controlled' }}
                          
                          onChange={(e)=>{
                            setTimeout(()=>_scrollToSection('add-initial-amount'),100)
                            setFormData({...formData,has_initial_amount:!Boolean(formData.has_initial_amount)})
                          }}
                      />
                      <span>{t('common.type-initial-value')}</span>
                      </label>
                    </div>

                    <div className={`${formData.has_initial_amount ? 'flex' :'hidden'}`}>   
                         

                    <FormLayout.Section style={{marginTop:0,paddingTop:5}}>

                      <div>
                                                <TextField
                                                id="outlined-textarea"
                                                label={t('common.initial-value')}
                                                placeholder={t('common.type-initial-value')}
                                                multiline
                                                value={formData.initial_amount}
                                                onBlur={()=>validate_feild('initial_amount')}
                                                onChange={(e)=>setFormData({...formData,initial_amount:_cn_op(e.target.value,'allow_negative')})}
                                                error={(!formData.initial_amount) && verifiedInputs.includes('initial_amount') ? true : false}
                                                sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                                />
                          </div>

                          <div>
                                <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                    <DatePicker value={dayjs(formData.last_transation_date).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.last_transation_date)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,last_transation_date:e.$d})} error={true} size="small" label={t('common.last-transaction-date')}  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                                        '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                        '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                        />
                                </LocalizationProvider>
                        </div>
                            
                      

                    </FormLayout.Section>

                    </div>

                    <div className="mb-10"></div>
                                  
             
                    <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id && !isPopUp}/>

               </FormLayout>
           </>
         )
       }
     
       export default App