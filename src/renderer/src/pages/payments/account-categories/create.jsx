
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import PouchDB from 'pouchdb';
       
       
       function App() {

          const { id } = useParams()

          const db={
            account_categories:new PouchDB('account_categories')
          } 

          const [items,setItems]=React.useState([])
          

          useEffect(()=>{

                if(!id) return

                (async()=>{
                try {
                    let item=await db.account_categories.get(id)
                    setFormData(item)
                } catch (error) {
                    console.log(error)
                }
                })()

          },[])

          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {makeRequest,_add,_update,_loaded} = useData();
          
            let initial_form={
               name:'',
               type:'fixed',
               description:'',
               account_origin:'expenses',
               deleted:false
           }

          const [formData, setFormData] = React.useState(initial_form);

          useEffect(()=>{
            (async()=>{
                let docs=await db.account_categories.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()
          },[formData])
        
       
          let required_fields=['name','description']
       
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
                     if(id){
                        _update('account_categories',[{...formData}])
                        toast.success('Categoria actualizada')
                     }else{
                        _add('account_categories',[{...formData,id:Math.random(),_id:Math.random().toString()}])
                        setVerifiedInputs([])
                        toast.success('Categoria adicionada')
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
                if((!formData[f].length && required_fields.includes(f))){
                    v=false
                }
               })
             setValid(v)
          },[formData])
        
        
         return (
           <>
              <DefaultLayout details={{name: (id ?'Actualizar' :'Nova')+' categoria'}} >
                   <div className="bg-white shadow py-1 rounded-[5px] pb-5 max-w-[675px]">
       
                      <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                         <span className="font-medium text-[18px]">{id ? 'Actualizar' :'Adicionar nova categoria'} </span>
                      </div>
       
                      <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[46%]">
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

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de conta</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                label="Tipo de conta"
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

                     <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">
                                    <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de conta *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-error-label"
                                    id="demo-simple-select-error"
                                    value={formData.account_origin}
                                    label="Tipo de conta"
                                    onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                                    sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    >
                                    
                                    <MenuItem value={'expenses'}>Despesas</MenuItem>
                                    <MenuItem value={'supplier'}>Fornecedor</MenuItem>
                                    <MenuItem value={'state'}>Estado</MenuItem>
                                    <MenuItem value={'client'}>Cliente</MenuItem>
                                    <MenuItem value={'investments'}>Investimentos</MenuItem>
                                    <MenuItem value={'others'}>Outros</MenuItem>
                                    </Select>

                     </FormControl>
                     </div>
       
                       <div className="w-[100%]">

                                <TextField
                                        id="outlined-multiline-static"
                                        label="Descrição *"
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