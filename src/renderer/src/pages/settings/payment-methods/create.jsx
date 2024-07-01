
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams} from 'react-router-dom';
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
       
       
       function App({isPopUp}) {

          const { id } = useParams()

          const db={
            payment_methods:new PouchDB('payment_methods')
          } 

          const [items,setItems]=React.useState([])
          

          useEffect(()=>{

                if(!id) return

                (async()=>{
                try {
                    let item=await db.payment_methods.get(id)
                    setFormData(item)
                } catch (error) {
                    console.log(error)
                }
                })()

          },[])

          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update,_initial_form,_cn_op,_scrollToSection,_openDialogRes,_setOpenDialogRes,_setOpenCreatePopUp} = useData();
          
          
          
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
            (async()=>{
                let docs=await db.payment_methods.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()
          },[formData])

        
       
          let required_fields=['name','type']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }
       
      
       
         async function SubmitForm(){
              
              if(valid){
                  if(items.some(i=>i.name.toLowerCase() == formData.name.toLowerCase() && i._id!=id)){
                     toast.error('Nome já existe')
                     return
                  }

                   try{
                     if(id && !isPopUp){
                        _update('payment_methods',[{...formData}])
                        toast.success('Conta actualizada')
                     }else{
                          let new_id=Math.random()
                          let new_item={...formData,id:new_id,_id:Math.random().toString()}
                          let res=await _add('payment_methods',[new_item])

                        


                          if(res.ok){
                            _setOpenDialogRes({..._openDialogRes,item:new_item,page:'payment_methods'})
                          }

                        /*if(formData.has_initial_amount && parseFloat(formData.initial_amount)){
                           _add('transations',[{..._initial_form.transations,
                            description:`Valor inicial ${}`
                            type:parseFloat(formData.initial_amount) > 0 ? 'in' : 'out',
                            payments:[{id:new_id,name:formData.name,amount:parseFloat(formData.initial_amount)}],
                            amount:parseFloat(formData.initial_amount),
                            is_initial_amount:true,
                            id:Math.random(),_id:Math.random().toString()}])
                        }*/

                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        setFormData(initial_form)

                        if(isPopUp) _setOpenCreatePopUp('')



                     }
                 }catch(e){
                        console.log(e)
                        toast.error('Erro inesperado!')
                 }
                 
              }else{
               toast.error('Preencha todos os campos obrigatórios')
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

         <FormLayout isPopUp={isPopUp} maxWidth={'700px'} name={id ? 'Actualizar' : 'Nova conta'} formTitle={isPopUp ? 'Adicionar novo meio de pagamento' : (id ? 'Actualizar' : 'Adicionar nova')}>

                    <FormLayout.Section maxWidth={'700px'}>

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
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                defaultValue=""
                                label="Tipo"
                                onChange={(e)=>setFormData({...formData,type:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                { /*<MenuItem value="">
                                               <em>Selecione o tipo</em>
                                </MenuItem>*/} 
                                <MenuItem value={'cashier'}>Caixa</MenuItem>
                                <MenuItem value={'bank'}>Bancária</MenuItem>
                                <MenuItem value={'mobile'}>Móvel</MenuItem>
                                <MenuItem value={'other'}>Outro</MenuItem>
                                </Select>

                        </FormControl>


                   
                        </div>

                        

               
       
                       <div className="w-[100%]">

                                <TextField
                                        id="outlined-multiline-static"
                                        label="Nota"
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
                      <span>Introduzir o valor inicial</span>
                      </label>
                    </div>

                    <div className={`${formData.has_initial_amount ? 'flex' :'hidden'}`}>   
                         

                    <FormLayout.Section style={{marginTop:0,paddingTop:5}}>

                      <div>
                                                <TextField
                                                id="outlined-textarea"
                                                label="Valor inicial *"
                                                placeholder="Digite inicial"
                                                multiline
                                                value={formData.initial_amount}
                                                onBlur={()=>validate_feild('initial_amount')}
                                                onChange={(e)=>setFormData({...formData,initial_amount:_cn_op(e.target.value)})}
                                                error={(!formData.initial_amount) && verifiedInputs.includes('initial_amount') ? true : false}
                                                sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                                />
                          </div>

                          <div>
                                <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                    <DatePicker value={dayjs(formData.last_transation_date).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.last_transation_date)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,last_transation_date:e.$d})} error={true} size="small" label="Data da ultima transação*"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
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