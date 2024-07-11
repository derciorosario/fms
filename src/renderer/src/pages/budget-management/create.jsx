
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import DatePickerRange from '../../components/Filters/budget-management-date-picker';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import PouchDB from 'pouchdb';
       
       
       function App() {

          const { id } = useParams()

          const db={
            budget:new PouchDB('budget')
          } 

          

          const [items,setItems]=React.useState([])

          let months=['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
          


          let initialDatePickers={
            start_open:false,
            end_open:false,
            startDate:null,
            endDate:null,
            start_groups:[
                     {
                        field:'_month',dropdown:true,name:'Mês',items:months.map((i,_i)=>({name:i.toString(),id:_i})),selected_ids:[]
                     },
                     {
                        field:'_day',dropdown:true,name:'Dia',items:Array.from({ length: 31 }, (i,_i) => _i+1).map((i,_i)=>({name:i.toString(),id:_i,selected:_i==0 ? true : false})),selected_ids:[0]
                     }
            ],
            end_groups:[
                     {
                        field:'_month',dropdown:true,name:'Mês',items:months.map((i,_i)=>({name:i.toString(),id:_i})),selected_ids:[]
                     },
                     {
                        field:'_day',dropdown:true,name:'Dia',items:Array.from({ length: 31 }, (i,_i) => _i+1).map((i,_i)=>({name:i.toString(),id:_i,selected:_i==0 ? true : false})),selected_ids:[0]
                     }
            ]
           }

          

          useEffect(()=>{

            

                if(!id) return

                (async()=>{
                try {
                    let item=await db.budget.get(id)
                    setFormData({...item,items:item.items.map(i=>{
                        return {...i,picker:{...i.picker,endDate:new Date(i.picker.endDate), startDate: new Date(i.picker.startDate)}}
                    })})

                   console.log(item)
                } catch (error) {
                    console.log(error)
                }
                })()


          },[])

          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update,_categories,_budget} = useData();
          
            let initial_form={
               account_origin:'',
               items:[{
                   id:uuidv4(),startDate:'', endDate:'',value:'',picker:initialDatePickers
               }],
               deleted:false,
               description:'',
               createdAt:new Date().toISOString(),
           }

          const [formData, setFormData] = React.useState(initial_form);


          useEffect(()=>{
            (async()=>{
                let docs=await db.budget.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()

          },[formData])

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
                 

                   try{
                     if(id){
                        _update('budget',[{...formData}])
                        toast.success('Orçamento actualizado')
                     }else{
                        _add('budget',[{...formData,id:uuidv4()}])
                        setVerifiedInputs([])
                        toast.success('Orçamento adicionado')
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

             console.log(formData.items)
          },[formData])



          function add_new_budget(){
              if(!(formData.items[formData.items.length - 1].picker.startDate && formData.items[formData.items.length - 1].picker.endDate)){
                  return
              }


              setFormData({...formData,items:[...formData.items,{...initial_form.items[0],id:uuidv4(),picker:initialDatePickers}]})
          }

          
       

      


         return (
           <>
              <div className=" hidden overflow-scroll items-center justify-center absolute left-0 top-0 bg-[rgba(0,0,0,0.4)] h-[100vh] w-full z-10">

              </div>
              <DefaultLayout details={{name: (id ?'Actualizar' :'Novo')+' orçamento'}} >
                   <div className="bg-white  py-1 border rounded-[5px] pb-1 max-w-[750px]">
       
                      <div className="p-[15px] border-b border-zinc-300 mb-2 opacity-75">
                         <span className="font-medium text-[18px]">{id ? 'Actualizar' :'Adicionar novo orçamento'} </span>
                      </div>

       
                      <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[46%]  ">
                    

                     <div>

                     <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">
                     <InputLabel htmlFor="grouped-select">Categoria de conta</InputLabel>
                     <Select defaultValue="" id="grouped-select"
                       disabled={Boolean(id)}
                       value={formData.account_origin}
                        label="Categoria de conta"
                        onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                     >
                     
                   
                     <MenuItem value="">
                           <em>Selecione uma opção</em>
                        </MenuItem>
                        <ListSubheader><span className="font-semibold text-[#16a34a] opacity-70">Entradas</span></ListSubheader>
                        {_categories.filter(i=>i.type=="in").map(i=>(
                              <MenuItem disabled={_budget.some(f=>f.account_origin==i.field)} value={i.field} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-[#16a34a] inline-block mr-2"></span> <span>{i.name}{_budget.some(f=>f.account_origin==i.field && formData.account_origin!=f.account_origin) && <label className="ml-5 text-[13px]">(Definido)</label>}</span></MenuItem>
                        ))}
                        <ListSubheader><span className="font-semibold text-red-600 opacity-70">Saídas</span></ListSubheader>
                        {_categories.filter(i=>i.type=="out").map(i=>(
                             <MenuItem disabled={_budget.some(f=>f.account_origin==i.field)} value={i.field} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-red-500 inline-block mr-2"></span> <span>{i.name}{_budget.some(f=>f.account_origin==i.field && formData.account_origin!=f.account_origin) && <label className="ml-5 text-[13px]">(Definido)</label>}</span></MenuItem>
                        ))}
                     </Select>
                     </FormControl>


                     </div>

                     <div className="w-[100%]">
                <TextField
                        id="outlined-multiline-static"
                        label="Descrição"
                        multiline
                        value={formData.description}
                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                        defaultValue=""
                        sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                        '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                       />
                </div>


       
                      </div>


                      <div className="p-3">

                      <div class="relative rounded-[0.2rem] w-[100%]">
                                <table class="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="[&>_th]:px-6 [&>_th]:py-3 [&>_th]:font-medium">
                                        <th scope="col">
                                           <span className="font-semibold">Data Inicio</span>
                                        </th>
                                        <th scope="col">
                                        </th>
                                        <th scope="col">
                                        <span className="font-semibold"> Data Fim</span>
                                        </th>
                                        <th scope="col">
                                        <span className="font-semibold">  Valor Estimado</span>
                                        </th>
                                        <th scope="col">
                                        </th>

                                        
                                    </tr>
                                </thead>
                                <tbody>
                                        {formData.items.filter(i=>i).map((i,_i)=>(
                                              

                                          <tr key={_i} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 px-1">
                                           
                                            <th scope="row" class="px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                               <div className="relative">
                                                   <DatePickerRange current_item={i} formData={formData} setFormData={setFormData} id={'start'} options={i.picker} open={i.picker.start_open}/>
                                                </div>
                                            </th>
                                            <td class="px-6 py-4">
                                               á
                                            </td>
                                            <td class="px-6 py-4">
                                                 <div className="relative">
                                                     <DatePickerRange current_item={i} formData={formData} setFormData={setFormData} id={'end'} options={i.picker} open={i.picker.end_open}/>
                                               </div>
                                            </td>
                                            <td class="px-6 py-4">
                                              <TextField
                                                    id="outlined-textarea"
                                                    label="Valor"
                                                    placeholder="Digite o valor"
                                                    multiline
                                                    value={i.value}
                                                    onChange={e=>setFormData({...formData,items:formData.items.map(f=>{
                                                        if(f.id==i.id){
                                                           return {...f,value:e.target.value} 
                                                        }else {
                                                           return f
                                                        }
                                                    })})}
                                                     sx={{width:'100%',maxWidth:'200px','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                                />
                                            </td>
                                            <td> 
                                                {((formData.items.filter(i=>i.picker.endDate && i.picker.startDate).length > 1) || (formData.items.length > 1 && (!i.picker.endDate || !i.picker.startDate))) && <span onClick={()=>setFormData({...formData,items:formData.items.filter(f=>f.id!=i.id)})} className="pr-2 flex items-center cursor-pointer hover:opacity-80">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="21" fill="crimson"><path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path></svg>
                                                </span>}
                                             </td>
                                           
                                        </tr>

                                   ))}
                                    
                                </tbody>
                                </table>

                              

                       </div>
   

                      </div>


                      <div className="flex float-end -translate-y-5">
                        <button onClick={add_new_budget} type="button" className={`text-gray-900 ${formData.items[formData.items.length - 1].picker.startDate && formData.items[formData.items.length - 1].picker.endDate ? 'bg-blue-500  hover:bg-blue-600' : ' bg-neutral-300 cursor-not-allowed'}  border border-gray-200 focus:ring-4 focus:outline-none flex focus:ring-gray-100 font-medium rounded-[1rem] text-sm px-3 py-[4px] text-center items-center me-2 mb-2`}>
                           <span className="text-[14px] text-white">Adicionar período</span><AddIcon sx={{color:'#fff',width:20}}/>
                        </button>
                      </div>

       
       
                      <div className="px-2 mb-2 mt-6">
                      <LoadingButton
                         onClick={SubmitForm}
                         endIcon={<SendIcon />}
                         loading={loading}
                         loadingPosition="end"
                         variant="contained"
                         disabled={!valid || formData.items.filter(i=>i.picker.endDate && i.picker.startDate).length == 0 || formData.items.filter(i=>!i.value || !i.picker.startDate || !i.picker.endDate).length >= 1}
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