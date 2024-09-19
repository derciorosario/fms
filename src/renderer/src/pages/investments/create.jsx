
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../contexts/DataContext';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'dayjs/locale/en-gb';
import FormLayout from '../../layout/DefaultFormLayout';
import { v4 as uuidv4 } from 'uuid';     
import { useAuth } from '../../contexts/AuthContext';
import { t } from 'i18next';
       function App() {
          const {_cn_op}= useData()

          const { id } = useParams()

          const {db} = useAuth()

          const navigate = useNavigate()
          const {pathname}=useLocation()


          const [initialized,setInitialized]=React.useState()

          
          let initial_form={
            id:'',
            period:'year',
            description:'',
            deleted:false,
            time:'',
            amount:'',
            buyday:'',
            createdAt:new Date().toISOString(),
        }



        const [formData, setFormData] = React.useState(initial_form);



          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_loaded,_add,_update,_calculateInvestmentCost,_setRequiredData} = useData();

          let required_data=['investiments']


          useEffect(()=>{
            if(!id || id==formData.id || !db.investments) return 

               (async()=>{

                     let item =  await db.investments.find({selector: {id}})
                     item=item.docs[0]
                     if(item){
                     setFormData(item)

                     }else{
                      toast.error(t('common.item-not-found'))
                      navigate(`/investments`)
                     }

               })()

          },[db,pathname])

          useEffect(()=>{
            _setRequiredData(required_data)
           },[])

          useEffect(()=>{
            if(!formData.id && id){
                setInitialized(false)
            }else{
                setInitialized(true)
            }
           },[_loaded,formData])
          
          
        
         

          let required_fields=['amount','description','time']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }


        



          useEffect(()=>{
            setFormData({...formData,depreciation:formData.amount && formData.buyday && formData.time ? _calculateInvestmentCost({...formData,buyday:!formData.buyday?.split ? formData.buyday?.toISOString() : formData.buyday}).amount.toFixed(2) : '0'})
          },[formData.amount,formData.buyday,formData.time])

        


      

         async function SubmitForm(){
              
              if(valid){
                   try{
                     if(id){
                        _update('investments',[{...formData}])
                        toast.success(t('common.updated-successfully'))
                     }else{
                       _add('investments',[{
                            ...formData,
                            id:uuidv4(),
                        }])
                        setFormData(initial_form)
                        toast.success(t('common.added-successfully'))
                        setVerifiedInputs([])
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
                  if(((!formData[f]?.toString()?.length && f != 'paid') && required_fields.includes(f))){
                      v=false
                  }
               })
               setValid(v)
          },[formData])

     
  return (
    <>


<FormLayout loading={!initialized || loading} maxWidth={'700px'} name={id ? t('common.update')  : t('common.new-investment')} formTitle={id ? t('common.update') : t('common.add')}>

             
<FormLayout.Cards topInfo={[
                          {name:t('common.monthly-depreciation-amount'),value: formData.depreciation},
                     ]}/>

            

              <FormLayout.Section>
                   
              
                    <div className="w-[100%]">

                          <TextField
                                  id="outlined-multiline-static"
                                  label={t('common.description')}
                                  multiline
                                  value={formData.description}
                                  onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                  defaultValue=""
                                  sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  onBlur={()=>validate_feild('description')}
                                  error={(!formData.description) && verifiedInputs.includes('description')}
                                  helperText={(!formData.description) && verifiedInputs.includes('description') ? t('common.required-field') : ''}
                              
                          />

                  </div>



                  <div className="-translate-y-0">
                                    <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                        <DatePicker  value={dayjs(formData.buyday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.buyday)) : null} onChange={(e)=>setFormData({...formData,buyday:e.$d})}  label="Data de compra"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            />
                                    </LocalizationProvider>
                  </div>
                  



                  <div>

                          <TextField
                              id="outlined-textarea"
                              label={t('common.cost')}
                              placeholder={t('common.type-amount')}
                              multiline
                              value={formData.amount}
                              helperText={(!formData.amount) && verifiedInputs.includes('amount') ? t('common.required-field') :''}
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
                              label={t('common.number-of')+` ${formData.period=="year" ? t('common.years') :t('common.months')}`}
                              placeholder={t('common.number-of')+` ${formData.period=="year" ? t('common.years') :t('common.months')}`}
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

