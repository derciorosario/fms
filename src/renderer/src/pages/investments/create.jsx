
import React, { useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../contexts/DataContext';
import {useParams} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import 'dayjs/locale/en-gb';
import PouchDB from 'pouchdb';
import FormLayout from '../../layout/DefaultFormLayout';
       
       function App() {
          const {_cn_op}= useData()

          const { id } = useParams()

          const db={
            investments:new PouchDB('investments'),
          } 


          const [items,setItems]=React.useState([])

          useEffect(()=>{

                 alert('In development')

                if(!id) return 

                (async()=>{
                    try {
                        let item=await db.investments.get(id)
                        setFormData({...item})
                    } catch (error) {
                        console.log(error)
                    }
                })()

          },[])



          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update} = useData();


        
            let initial_form={
               id:'',
               period:'year',
               description:'',
               deleted:false,
               time:'',
               amount:'',
               createdAt:new Date().toISOString(),
           }


           
           

           const [formData, setFormData] = React.useState(initial_form);

           useEffect(()=>{
            (async()=>{
                let docs=await db.investments.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()


          },[formData])

          let required_fields=['amount','description','time']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }

        


      

         async function SubmitForm(){
              
              if(valid){
                   try{
                     if(id){
                        _update('investments',[{...formData}])
                        toast.success('Investimento actualizada')
                     }else{
                       _add('investments',[{
                            ...formData,
                            id:Math.random().toString(),
                            _id:Math.random().toString()
                        }])
                        setFormData(initial_form)
                        toast.success('Investimento adicionado')
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
                  if(((!formData[f]?.toString()?.length && f != 'paid') && required_fields.includes(f))){
                      v=false
                  }
               })
               setValid(v)
          },[formData])

     
  return (
    <>


<FormLayout maxWidth={'700px'} name={id ? 'Actualizar' : 'Novo investimento'} formTitle={id ? 'Actualizar' : 'Adicionar'}>

             
<FormLayout.Cards topInfo={[
                          {name:"Valor final",value:0},
                     ]}/>

            

              <FormLayout.Section>
                   
              
                    <div className="w-[100%]">

                          <TextField
                                  id="outlined-multiline-static"
                                  label="Descrição *"
                                  multiline
                                  value={formData.description}
                                  onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                  defaultValue=""
                                  sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  onBlur={()=>validate_feild('description')}
                                  error={(!formData.description) && verifiedInputs.includes('description')}
                                  helperText={(!formData.description) && verifiedInputs.includes('description') ? "Insira a descrição" :''}
                              
                          />

                  </div>



                  <div>

                          <TextField
                              id="outlined-textarea"
                              label="Custo *"
                              placeholder="Digite o valor"
                              multiline
                              value={formData.amount}
                              helperText={(!formData.amount) && verifiedInputs.includes('amount') ? 'Campo obrigatório':''}
                              onBlur={()=>validate_feild('amount')}
                              error={(!formData.amount) && verifiedInputs.includes('amount') ? true : false}
                              onChange={(e)=>setFormData({...formData,amount:_cn_op(e.target.value)})}
                              sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                              '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                              />

                  </div>


                  
                  <div className="items-center justify-center -translate-y-1">
                      <div className="w-full">
                      <TextField
                              id="outlined-textarea"
                              label={`Número de ${formData.period=="year" ? 'anos' :'meses'}`}
                              placeholder={`Número de ${formData.period=="year" ? 'anos' :'meses'}`}
                              multiline
                              value={formData.time}
                              onBlur={()=>validate_feild('time')}
                              error={(!formData.time) && verifiedInputs.includes('time') ? true : false}
                              onChange={(e)=>setFormData({...formData,time:_cn_op(e.target.value)})}
                              sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                              '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                              />
                    
                      </div>

                      <div className="hidden">


                      <FormControl sx={{ m: 1, width: 'calc(40% + 3px)',margin:0,height:40,marginLeft:'3px',display:id ? 'none' :'flex'}} size="small">
                            <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Periodo</InputLabel>
                            <Select
                            labelId="demo-simple-select-error-label"
                            id="demo-simple-select-error"
                            defaultValue="year"
                            value={formData.period}
                            label="Periodo"
                            onChange={(e)=>setFormData({...formData,period:e.target.value})}
                            sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                            '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                            >
                            <MenuItem value={'year'}>Anos</MenuItem>
                            <MenuItem value={'month'}>Meses</MenuItem>
                            </Select>
                          </FormControl>




                      </div>

                    


                      </div>


              </FormLayout.Section>
                

              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>

             

           
        </FormLayout>
    </>
  )
}
export default App

