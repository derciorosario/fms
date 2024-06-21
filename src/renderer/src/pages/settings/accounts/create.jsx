
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import FormLayout from '../../../layout/DefaultFormLayout';


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
          const {makeRequest,_add,_update,_loaded,_categories} = useData();
          
            let initial_form={
               name:'',
               notes:'',
               account_origin:'',
               transation_type:'',
               deleted:false
           }



          const [formData, setFormData] = React.useState(initial_form);

          useEffect(()=>{
            (async()=>{
                let docs=await db.account_categories.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()
          },[formData])

          useEffect(()=>{
            setFormData({...formData,transation_type:_categories.filter(i=>i.field==formData.account_origin)?.[0]?.type})
          },[formData.account_origin])
        
       
          let required_fields=['name','account_origin']
       
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
                if((!formData[f]?.length && required_fields.includes(f))){
                    v=false
                }
               })
             setValid(v)
          },[formData])

          console.log(formData)
        
        
         return (
           <>

         <FormLayout maxWidth={'700px'} name={id ? 'Actualizar' : 'Nova conta'} formTitle={id ? 'Actualizar' : 'Adicionar nova'}>

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

                                   {_categories.map(i=>(
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
                        <ListSubheader><span className="font-semibold text-[#16a34a] opacity-70">Entradas</span></ListSubheader>
                        {_categories.filter(i=>i.type=="in").map(i=>(
                              <MenuItem value={i.field} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-[#16a34a] inline-block mr-2"></span> <span>{i.name}</span></MenuItem>
                        ))}
                        <ListSubheader><span className="font-semibold text-red-600 opacity-70">Saídas</span></ListSubheader>
                        {_categories.filter(i=>i.type=="out").map(i=>(
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


                  
               
             
                    <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>

               </FormLayout>
           </>
         )
       }
     
       export default App