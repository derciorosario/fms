
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';

import PouchDB from 'pouchdb';
       
       
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
          const {makeRequest,_add,_update,_loaded} = useData();
          
            let initial_form={
               name:'',
               description:'',
               deleted:false
           }

          const [formData, setFormData] = React.useState(initial_form);

          useEffect(()=>{
            (async()=>{
                let docs=await db.accounts.allDocs({ include_docs: true })
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
                  if(items.some(i=>i.description.toLowerCase() == formData.description.toLowerCase() && i._id!=id)){
                     toast.error('Descrição já existe')
                     return
                  }

                   try{
                     if(id){
                        _update('accounts',[{...formData}])
                        toast.success('Conta actualizada')
                     }else{
                        _add('accounts',[{...formData,id:Math.random(),_id:Math.random().toString()}])
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
                if((!formData[f].length && required_fields.includes(f))){
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