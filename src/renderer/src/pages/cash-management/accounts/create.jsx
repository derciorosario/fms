
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid';
       
       
       function App() {

          const { id } = useParams()

          const db={
            accounts:new PouchDB('accounts')
          } 

          const [items,setItems]=React.useState([])
          

          useEffect(()=>{

                if(!id) return

                (async()=>{
                try {
                    let item=await db.accounts.get(id)
                    setFormData(item)
                } catch (error) {
                    console.log(error)
                }
                })()

          },[])

          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update,_loaded,_get} = useData();
          
            let initial_form={
               name:'',
               description:'',
               initial_amount:'',
               last_transation_date:'',
               deleted:false
           }

          const [formData, setFormData] = React.useState(initial_form);

   
        
       
          let required_fields=['name','description','initial_amount']
       
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
                  if(items.some(i=>i.description.toLowerCase() == formData.description.toLowerCase() && i.id!=id)){
                     toast.error('Descrição já existe')
                     return
                  }

                   try{
                     if(id){
                        _update('accounts',[{...formData}])
                        toast.success('Conta actualizada')
                     }else{
                        let id=uuidv4()
                        _add('accounts',[{...formData,id,_id:uuidv4()}])
                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        if(parseInt(formData.initial_amount)){
                           _add('transations',[{
                              id:uuidv4(),
                              _id:uuidv4(),
                              type:parseFloat(formData.initial_amount) < 0 ? 'out' : 'in',
                              description:`Valor inicial (${formData.name})`,
                              deleted:false,
                              amount:parseInt(formData.initial_amount.replaceAll('-','')),
                              payment_origin:'initial',
                              createdAt:formData.last_transation_date.toISOString(),
                              reference:{id:null,type:'none',name:''},
                              transation_account:{id,name:formData.name},
                              account:{id:null,name:''},
                              link_payment:false
                        }])
                     }
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
                if((!formData[f].length && required_fields.includes(f)) || !formData.last_transation_date){
                    v=false
                    
                }
               })
             setValid(v)
          },[formData])
        
        
         return (
           <>
              <DefaultLayout details={{name: (id ?'Actualizar' :'Nova')+' Conta'}} >
                   <div className="bg-white shadow py-1 rounded-[5px] pb-5 max-w-[675px]">
       
                      <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                         <span className="font-medium text-[18px]">{id ? 'Actualizar' :'Adicionar nova Conta'} </span>
                      </div>
       
                      <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[46%]">
                      
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
                          <TextField
                           id="outlined-textarea"
                           label="Valor inicial *"
                           placeholder="Valor inicial"
                           multiline
                           disabled={id ? true : false}
                           value={formData.initial_amount}
                           onBlur={()=>validate_feild('initial_amount')}
                           onChange={(e)=>setFormData({...formData,initial_amount:e.target.value})}
                           error={(!formData.name) && verifiedInputs.includes('initial_amount') ? true : false}
                           helperText={!formData.name && verifiedInputs.includes('initial_amount') ? "Campo obrigatório" :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                        </div>

                        <div>
                           <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                 <DatePicker
                                 disabled={id ? true : false}
                                 helperText={(!formData.last_transation_date) && verifiedInputs.includes('last_transation_date') ? t('common.required-field') :''}
                                 onBlur={()=>validate_feild('last_transation_date')}
                                 error={((!formData.last_transation_date) && verifiedInputs.includes('last_transation_date')) && (dayjs(formData.last_transation_date).$d.toString() != "Invalid Date" && formData.last_transation_date) ? true : true}
                                 value={dayjs(formData.last_transation_date).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.last_transation_date)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,last_transation_date:e.$d})}  size="small" label="Data da última transação"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                                       '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                       '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                       />
                           </LocalizationProvider>
                        </div>
               
       
                       <div className="w-[100%]">

                                <TextField
                                        id="outlined-multiline-static"
                                        label={t('common.description')}
                                        multiline
                                        rows={4}
                                        onBlur={()=>validate_feild('description')}
                                        error={(!formData.description) && verifiedInputs.includes('description') ? true : false}
                                        helperText={!formData.description && verifiedInputs.includes('description') ? "Descrição obrigatória" :''}
                                        value={formData.description}
                                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                        defaultValue=""
                                        sx={{width:'100%'}}
                                        />
                                </div>
       
                      </div>



       
                      <div className="px-3 mb-2">
                      <LoadingButton
                         onClick={SubmitForm}
                         endIcon={<SendIcon />}
                         loading={loading}
                         loadingPosition="end"
                         variant="contained"
                         disabled={!valid}
                      >
                         <span>{loading ? `${id ? 'A actualizar...' :'A enviar...'}`:`${id ? 'Actualizar' :'Enviar'}`}</span>
                       </LoadingButton>
                      </div>
       
                   </div>
               </DefaultLayout>
           </>
         )
       }
     
       export default App