
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams,useNavigate, useLocation} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import FormLayout from '../../../layout/DefaultFormLayout';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../contexts/AuthContext';


       function App({isPopUp}) {

          const { id } = useParams()
          const navigate = useNavigate()
          const {pathname} = useLocation()


          const {db} = useAuth() 

          const [items,setItems]=React.useState([])
          const [initialized,setInitialized]=React.useState()
          const required_data=['account_categories']
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_required_data,_setRequiredData,_account_categories,_add,_get,_update,_loaded,_categories,_setOpenDialogRes,_setOpenCreatePopUp,_openDialogRes} = useData();
          
          

          useEffect(()=>{
            if(!id || !db.account_categories || formData.id==id || isPopUp) return 

               (async()=>{

                     let item =  await db.account_categories.find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)

                     }else{
                      toast.error('Item não encontrado')
                      navigate(`/accounts`)
                     }

               })()

          },[db,pathname,_required_data])

          useEffect(()=>{
            _setRequiredData(required_data)
           },[])

          

         
            let initial_form={
               name:'',
               notes:'',
               account_origin:'',
               type:'',
               deleted:false
           }



          const [formData, setFormData] = React.useState(initial_form);

          useEffect(()=>{
            if(!(required_data.some(i=>!_loaded.includes(i)))){
                setInitialized(true)
            }
           },[_loaded])
          
           useEffect(()=>{
                _get(required_data.filter(i=>!_loaded.includes(i)))    
           },[db])

           useEffect(()=>{
                  setItems(_account_categories)
           },[_account_categories])


          useEffect(()=>{
            setFormData({...formData,type:_categories.filter(i=>i.field==formData.account_origin)?.[0]?.type})
          },[formData.account_origin])
        
       
          let required_fields=['name','account_origin']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }
       
      
       
         async function SubmitForm(){
              
              if(valid){
                  if(items.some(i=>i.name.toLowerCase() == formData.name.toLowerCase() && i.id!=id)){
                     toast.error('Nome já existe')
                     return
                  }

                   try{
                     if(id && !isPopUp){
                        _update('account_categories',[{...formData}])
                        toast.success('Canta actualizada')
                     }else{
                        
                        let new_item={...formData,id:uuidv4()}
                        let res=await _add('account_categories',[new_item])

                        if(res.ok){
                           _setOpenDialogRes({..._openDialogRes,item:new_item,page:'accounts'})
                         }

                         if(isPopUp) _setOpenCreatePopUp('')

                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        setFormData(initial_form)
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
               })
             setValid(v)
          },[formData])

    
          useEffect(()=>{
                  if(_openDialogRes?.details?.account_origin){
                           setFormData({...formData,account_origin:_openDialogRes?.details?.account_origin})
                  }
          },[])
        
         return (
           <>

         <FormLayout loading={!initialized || loading} isPopUp={isPopUp} maxWidth={'700px'} name={id ? 'Actualizar' : 'Nova conta'} formTitle={isPopUp ? 'Adicionar nova conta' : (id ? 'Actualizar' : 'Adicionar nova')}>

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

                        <div className="hidden">
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Variação</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                label="Variação"
                                onChange={(e)=>setFormData({...formData,type:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'variable'}>Varirável</MenuItem>
                                <MenuItem value={'fixed'}>Fixa</MenuItem>
                                </Select>

                        </FormControl>


                   
                        </div>

                  <div>

                     <FormControl sx={{ m: 1, width: '100%',margin:0,height:40,display:'none' }} size="small">
                                    <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de conta *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-error-label"
                                    id="demo-simple-select-error"
                                    value={formData.account_origin}
                                    label="Tipo de conta*"
                                    onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                                    sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    >

                                   {_categories.filter(i=>i.type == _openDialogRes?.details?.type || !isPopUp).map(i=>(
                                     <MenuItem value={i.field} key={i.field}><span style={{color:i.type=='in' ? '#16a34a' : 'crimson'}}>{i.sub_name ? i.sub_name : i.name}</span></MenuItem>
                                   ))}

                                    
                                   

                                    </Select>

                     </FormControl>


                     <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">
                     <InputLabel htmlFor="grouped-select">Tipo de conta</InputLabel>
                     <Select defaultValue="" id="grouped-select"
                     
                       value={formData.account_origin}
                        label="Tipo de conta"
                        onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                     >
                        <MenuItem value="">
                           <em>Selecione uma opção</em>
                        </MenuItem>
                        {(_openDialogRes?.details?.type=="in"|| !isPopUp) && <ListSubheader><span className="font-semibold text-[#16a34a] opacity-70">Entradas</span></ListSubheader>}
                        {_categories.filter(i=>i.type == _openDialogRes?.details?.type || !isPopUp || i.field==_openDialogRes?.details?.type).filter(i=>i.type=="in").map(i=>(
                               <MenuItem value={i.field} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-[#16a34a] inline-block mr-2"></span> <span>{i.name}</span></MenuItem>
                        ))}
                        {(_openDialogRes?.details?.type=="out"|| !isPopUp) && <ListSubheader><span className="font-semibold text-red-600 opacity-70">Saídas</span></ListSubheader>}
                        {_categories.filter(i=>i.type == _openDialogRes?.details?.type || !isPopUp || i.field==_openDialogRes?.details?.type).filter(i=>i.type=="out").map(i=>(
                             <MenuItem value={i.field} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-red-500 inline-block mr-2"></span> <span>{i.name}</span></MenuItem>
                        ))}
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


                  
               
             
                    <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id && !isPopUp}/>

               </FormLayout>
           </>
         )
       }
     
       export default App