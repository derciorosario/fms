
import React, { useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams} from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import InstallentsDialog from '../../../components/Dialogs/Intallments'
import PouchDB from 'pouchdb';
import moment from 'moment';
       
       function App() {

          const {_account_categories,_get,_clients}= useData()

          const { id } = useParams()

          const db={
            bills_to_receive:new PouchDB('bills_to_receive')
          } 



          function devideDate(startDate, endDate, numberOfParts, total_to_pay) {

            const start = new Date(startDate);
            const end = new Date(endDate);
      
            const dateDiff = end - start;
            const interval = Math.floor(dateDiff / numberOfParts);
      
            let result = [];
      
            for (let i = 0; i < numberOfParts; i++) {
              const partStart = new Date(start.getTime() + i * interval);
              const partEnd = new Date(start.getTime() + (i + 1) * interval);
              if (i === numberOfParts - 1) {
                partEnd.setTime(end.getTime());
            }
      
            let item={id:Math.random(),paid:0,status:'pending',setEnd:'',setStart:'',start: partStart, end: partEnd, total_to_pay: total_to_pay ? (total_to_pay /  numberOfParts): 0}
            item.initial_amount=item.total_to_pay
            result.push(item);
      
            }

            return result;
          }

           function  calculateEndDate (startDate, days) {
             startDate=startDate ? startDate : new Date().toISOString().split('T')[0]
     
             const startDateObject = new Date(startDate);
             let remainingDays = days;
         
             while (remainingDays > 0) {
                 const currentMonth = startDateObject.getMonth();
                 const daysInCurrentMonth = new Date(startDateObject.getFullYear(), currentMonth + 1, 0).getDate();
         
                 if (remainingDays <= daysInCurrentMonth - startDateObject.getDate()) {
                     startDateObject.setDate(startDateObject.getDate() + remainingDays);
                     remainingDays = 0; 
                 } else {
                     remainingDays -= daysInCurrentMonth - startDateObject.getDate() + 1;
                     startDateObject.setMonth(currentMonth + 1);
                     startDateObject.setDate(1); 
                 }
             }
         
           return startDateObject;
     
         }

         const calculateDaysLeft = (futureDateString) => {
          const futureDate = moment(futureDateString); 
          const currentDate = moment(); 
          return futureDate.diff(currentDate, 'days'); 
        }

          const [items,setItems]=React.useState([])
          const [showInstallments,setShowInstallments]=React.useState(false)

          useEffect(()=>{

                if(!id) return 

                (async()=>{
                try {
                    let item=await db.bills_to_receive.get(id)
                    setFormData({...item,
                       paid:item.paid ? item.paid : ''
                    })
                } catch (error) {
                    console.log(error)
                }
                })()

                _get('account_categories')

          },[])


         


          const [paydayHelper,setPaydayHelper]=React.useState('custom')
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {makeRequest,_add,_update,_loaded} = useData();
          const [accountCategorieOptions, setAccountCategorieOptions] = React.useState([]);
          const account_name = React.useRef(null);
          const [accountCategories,setAccountCategories]=React.useState([])
          const [referenceOptions,setReferenceOptions]=React.useState([])

          useEffect(()=>{
            setAccountCategories(_account_categories.filter(i=>['client','others','investments'].includes(i.account_origin)))
          },[_account_categories])
         
          
            let initial_form={
               account_id:'',
               type:'fixed',
               description:'',
               account_origin:'client',
               deleted:false,
               installments:[],
               paid:0,
               invoice_number:'',
               payday:'',
               total_installments:'',
               invoice_emission_date:'',
               payment_type:'single',
               amount:'',
               payment_origin:'cash',
               status:'pending',
               reference:{id:null,name:''},
               createdAt:new Date().toISOString()

           }
           

           const [formData, setFormData] = React.useState(initial_form);

           
           useEffect(()=>{
            if(formData.account_origin=="client"){
                setReferenceOptions(_clients)
            }else{
                setReferenceOptions([])
            }
           },[formData.reference,_clients])

           useEffect(()=>{
            (async()=>{
                let docs=await db.bills_to_receive.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()

            console.log(formData)
          },[formData])



          function change_date_period(value,field,update_f){

                update_f(value)
                
                if(!isNaN(value)){
                  setFormData({...formData,[field]:calculateEndDate(null,parseInt(value))})
                }else if(value=="today"){
                  setFormData({...formData,[field]:new Date()})
                }
                
          }


          useEffect(()=>{

            let days_left=calculateDaysLeft(formData.payday)
            if(id || isNaN(days_left)) return

            let payday_options=[7,30,60,90]

            setPaydayHelper(days_left==0?'today' : payday_options.indexOf(days_left + 1) != -1 ? payday_options[payday_options.indexOf(days_left + 1)] : 'custom')
            
         },[formData.payday])


          useEffect(()=>{
             
               if(id) return

               if(formData.payday && formData.amount && (formData.payday.toString()!="Invalid Date")){
                   let parts=formData.total_installments ? parseInt(formData.total_installments) : 1

                   if(formData.installments.length==parts){
                        setFormData({...formData,installments:formData.installments.map(i=>({...i,amount:parseFloat(formData.amount / parts)}))})
                   }else{

                    setFormData({...formData,
                      installments:Array.from({ length: parts }, () => {
                            return {id:Math.random(),amount:parseFloat(formData.amount / parts),date:parts == 1 ? formData.payday : null,paid:0,status:'pending'}
                    })})

                   }
                  
               }else{
                   setFormData({...formData,installments:[]})
               }

          },[formData.due_date,formData.payday,formData.total_installments,formData.amount])

          useEffect(()=>{
            let account=accountCategories.filter(i=>i.name?.toLowerCase()==formData.account_name?.toLowerCase() && !i.deleted )[0]
            let id=account?.id

            if(account){
                 setFormData({...formData,account_origin:account.account_origin,type:account.type,account_id:id ? id : formData.account_name ? Math.random() : null})
            }else{
                 setFormData({...formData,account_id:id ? id : formData.account_name ? Math.random() : null})
            }
          },[formData.account_name,accountCategories])

          useEffect(()=>{
           // if(!id){
             let items=accountCategories.map(i=>{
                if(id){
                  return i.name
                }else{
                  return i.name
                }
             }).filter(i=>!i.deleted && !accountCategorieOptions.join(',').toLowerCase().split(',').includes(i.toLowerCase())) 
             setAccountCategorieOptions([...accountCategorieOptions,...items])
          // }
         },[accountCategories])

          useEffect(()=>{
           if(formData.payment_type=="multiple" && !formData.total_installments){
              setFormData({...formData,total_installments:1})
           }else if(formData.payment_type=="single"){
              setFormData({...formData,total_installments:''})
           }
           
          },[formData.payment_type])
       
          let required_fields=['account_id','amount','payday','due_date','description']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }
       
      
         async function SubmitForm(){
              
              if(valid){
                   try{
                     if(id){
                        _update('bills_to_receive',[{...formData}])
                        toast.success('Conta actualizada')
                     }else{
                        _add('bills_to_receive',[{...formData,
                        amount:parseFloat(formData.amount),
                        paid:parseFloat(formData.paid ? formData.paid : 0),
                        total_installments:parseInt(formData.total_installments ? formData.total_installments : 1),
                        status:parseFloat(formData.paid) == parseFloat(formData.amount) ? 'paid' : formData.status,
                        id:Math.random(),_id:Math.random().toString()}])
                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        setFormData(initial_form)
                        setPaydayHelper('custom')


                        let reference_id=formData.reference.id

                        if(formData.reference.name && !formData.reference.id){
                           reference_id=Math.random().toString()
                          _add('clients',[{
                            id:reference_id,
                            _id:Math.random().toString(),
                            name:formData.reference.name,
                            last_name:'',
                            contacts:[],
                            nuit:'',
                            notes:'',
                            email:'',
                            address:'',
                            deleted:false
                          }])

                        }

                        //add category if it does not exist!
                        if(!accountCategories.some(a=>a.id==formData.account_id)){
                          _add('account_categories',[{
                              id:formData.account_id,
                              _id:Math.random().toString(),
                              name:formData.account_name,
                              type:formData.type,
                              description:'',
                              reference:{...formData.reference,id:reference_id},
                              account_origin:formData.account_origin,
                              deleted:false
                            }])
                        }
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
                 if(!formData.reference.name && formData.account_origin=="client") {
                    v=false
                 }
                  
               })
               setValid(v)
          },[formData])


         
  return (
    <>
       <InstallentsDialog page={'receive'} show={showInstallments} items={formData.installments} formData={formData} setShow={setShowInstallments} setFormData={setFormData}/>
       <DefaultLayout details={{name:'Nova conta a receber'}}>
               <div className="bg-white py-1 pb-5 max-w-[100%]">

               <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                  <span className="font-medium text-[18px]">Adicionar nova conta a receber</span>
               </div>


               <div className="[&>_div]:border  [&>_div]:border-[#D9D9D9] mb-3 flex items-center px-[1rem] [&>_div]:rounded-[0.4rem] [&>_div]:min-w-[110px] [&>_div]:mr-[10px]  justify-start">
                          
                             <div className={`items-center justify-center px-3 py-2 flex`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">Saldo da conta</span>
                                <span className="text-[19px] text-[#2B3674]">{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formData.amount && formData.paid ? parseFloat(formData.amount) - parseFloat(formData.paid) : formData.amount ? parseFloat(formData.amount) : 0)}</span>
                             </div>

                             <div className={`items-center justify-center px-3 py-2 flex`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">Recebido</span>
                                <span className="text-[19px] text-[#2B3674]">{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formData.paid ? parseFloat(formData.paid) : 0)}</span>
                            </div>

                             <div className={`items-center justify-center px-3 py-2 flex`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">Estado</span>
                                <span className={`text-[19px]  ${formData.paid==formData.amount && formData.amount ?'text-green-500' : 'text-[#2B3674]'}`}>{formData.paid==formData.amount && formData.amount ? 'Pago' : 'Pedente'}</span>
                             </div>

                  </div>

               <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]">
              
               <div>
                <TextField
                        id="outlined-multiline-static"
                        label="Descrição de pagamento *"
                        multiline
                        value={formData.description}
                        onBlur={()=>validate_feild('description')}
                        error={(!formData.description) && verifiedInputs.includes('description') ? true : false}
                        helperText={!formData.description && verifiedInputs.includes('description') ? "Campo obrigatório" :''}
                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                        defaultValue=""
                        sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                         '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                        />
                </div>

               <div> 
                <Autocomplete size="small"
                    value={formData.account_name ? formData.account_name : null}
                    onChange={(event, newValue) => {
                        setFormData({...formData,account_name:newValue})
                    }}
                    noOptionsText="Não encotrado"
                    ref={account_name}
                    defaultValue={null}
                    onBlur={()=>{
                     /* setAccountCategorieOptions(accountCategorieOptions.filter(i=>accountCategories.map(a=>a.name.toLowerCase()).includes(i.toLowerCase())))
                     
                      if(!accountCategorieOptions.join(',').toLowerCase().split(',').includes(formData.account_name.toLowerCase())){
                           setAccountCategorieOptions([...accountCategorieOptions,formData.account_name])
                      }*/
                    }}
                    inputValue={formData.account_name}
                    onInputChange={(event, newInputValue) => {
                      setFormData({...formData,account_name:newInputValue})
                    }}
                    id="controllable-states-demo"
                    options={accountCategorieOptions}
                    sx={{ width: 300 }}
                    disabled={Boolean(id)}
                    renderInput={(params) => <TextField {...params} value={formData.account_name} label="Nome da conta *" />}
              />   
                 </div>
               <div>
                 <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de conta *</InputLabel>
                                <Select
                                disabled={accountCategories.some(i=>i.id==formData.account_id)}
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.account_origin}
                                label="Tipo de conta"
                                onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'client'}>Cliente</MenuItem>
                                <MenuItem value={'investments'}>Investimentos</MenuItem>
                                <MenuItem value={'others'}>outros</MenuItem>
                                </Select>

                 </FormControl>
                </div>
                <div>
                    <Autocomplete size="small"
                      value={formData.reference.name && formData.account_origin=="client" ? formData.reference.name : null}
                      onChange={(event, newValue) => {
                        newValue=newValue ? newValue : ''
                        let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                        setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                      }}
                      noOptionsText="Sem opções"
                      defaultValue={null}
                      inputValue={(formData.account_origin=="client") ? formData.reference.name  : "" }
                      onInputChange={(event, newInputValue) => {
                           newInputValue=newInputValue ? newInputValue : ''
                          let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                          setFormData({...formData,reference:{...formData.reference,name:newInputValue,id:reference_id}})
                    
                      }}
                      id="_referece"
                      options={referenceOptions.map(i=>i.name)}
                      sx={{ width: 300 }}
                      disabled={formData.account_origin=="client" && !id ? false : true}
                      renderInput={(params) => <TextField {...params}
                      onBlur={()=>validate_feild('reference')}
                      error={(!formData.reference.name) && verifiedInputs.includes('reference') && formData.account_origin=="client" ? true : false}
                      helperText={(!formData.reference.name) && verifiedInputs.includes('reference') && formData.account_origin=="client" ? "Insira nome do cliente" :''}
                      
                       value={formData.reference.name} label="Referênciar cliente" />}
                   
                    />   
                  </div>

                <div>
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                          

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Categoria de conta *</InputLabel>
                                <Select
                                disabled={accountCategories.some(i=>i.id==formData.account_id)}
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                label="Categoria de conta"
                                onChange={(e)=>setFormData({...formData,type:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'variable'}>Variável</MenuItem>
                                <MenuItem value={'fixed'}>Fixa</MenuItem>
                                </Select>

                                

                        </FormControl>
                        </div>

                        <div>
                                <TextField
                                  id="outlined-textarea"
                                  label="Valor a receber *"
                                  placeholder="Digite o valor a receber"
                                  multiline
                                  disabled={Boolean(id)}
                                  value={formData.amount}
                                  onBlur={()=>validate_feild('amount')}
                                  onChange={(e)=>setFormData({...formData,amount:e.target.value.replace(/[^0-9]/g, '')})}
                                  error={(!formData.amount) && verifiedInputs.includes('amount') ? true : false}
                                  sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  />
                      </div>
               <div className="hidden">
                        <TextField
                           id="outlined-textarea"
                           label="Valor pago"
                           placeholder="Digite o valor pago"
                           multiline
                           onBlur={()=>validate_feild('paid')}
                           error={parseFloat(formData.amount) < parseFloat(formData.paid)  ? true : false}
                           helperText={parseFloat(formData.amount) < parseFloat(formData.paid) ? "Não deve ser maior que o valor a receber" :''}
                           value={formData.paid}
                           onChange={(e)=>setFormData({...formData,paid:e.target.value.replace(/[^0-9]/g, '')})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
               </div>


                <div className="flex items-center justify-center -translate-y-1">
                <div className="w-full">
                <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                     <DatePicker value={dayjs(formData.payday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.payday)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,payday:e.$d})} error={true} size="small" label="Data de recebimento*"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                           '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                </LocalizationProvider>

               
                </div>

                <FormControl sx={{ m: 1, width: 'calc(40% + 3px)',margin:0,height:40,marginLeft:'3px',display:id ? 'none' :'flex'}} size="small">
                      <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Periodo</InputLabel>
                      <Select
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      value={paydayHelper}
                      label="Tipo de conta"
                      onChange={(e)=>change_date_period(e.target.value,'payday',setPaydayHelper)}
                      sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                      '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                      >
                      
                      <MenuItem value={'today'}>hoje</MenuItem>
                      <MenuItem value={'7'}>7 dias</MenuItem>
                      <MenuItem value={'30'}>30 dias</MenuItem>
                      <MenuItem value={'60'}>60 dias</MenuItem>
                      <MenuItem value={'90'}>90 dias</MenuItem>
                      <MenuItem value={'custom'}>Outro</MenuItem>
                      </Select>
                    </FormControl>
                </div>

              

                <div className="hidden">
                <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                    <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']} style={{paddingTop:0}} size="small">
                        <DatePicker onChange={(e)=>setFormData({...formData,due_date:e.$d})} label="Prazo de recebimento *"  style={{padding:0,overflow:'hidden'}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                    </DemoContainer>
                </LocalizationProvider>
                </div>

                <div className="-translate-y-2">
                <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                     <DatePicker  value={dayjs(formData.invoice_emission_date).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.invoice_emission_date)) : null} onChange={(e)=>setFormData({...formData,invoice_emission_date:e.$d})}  label="Data de emissão da fatura"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
                </LocalizationProvider>
                </div>

                <div>
                        <TextField
                           id="outlined-textarea"
                           label="Número da fatura"
                           placeholder="Digite o número da fatura"
                           multiline
                           value={formData.invoice_number}
                           onChange={(e)=>setFormData({...formData,invoice_number:e.target.value})}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />
               </div>

               <div>
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Modo de recebimento</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.payment_type}
                                label="Tipo de recebimento"
                                onChange={(e)=>setFormData({...formData,payment_type:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'single'}>Único</MenuItem>
                                <MenuItem value={'multiple'}>Por prestações</MenuItem>
                                </Select>

                        </FormControl>
                        </div>
                <div className="flex">
                        <TextField
                           id="outlined-textarea"
                           label="Quantidade de prestações"
                           placeholder="Digite o número"
                           multiline
                           disabled={formData.payment_type=="single" ? true : false}
                           value={formData.total_installments}
                           onBlur={()=>validate_feild('total_installents')}
                           onChange={(e)=>setFormData({...formData,total_installments:e.target.value.replace(/[^0-9]/g, '')})}
                           error={(!formData.total_installments) && verifiedInputs.includes('total_installments') ? true : false}
                           helperText={!formData.total_installments && verifiedInputs.includes('total_installments') && formData.payment_type=="single" ? "Campo obrigatório" :''}
                           sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                           '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                           />

                           <div className="ml-2 translate-y-2">
                              <span onClick={()=>setShowInstallments(true)} className="cursor-pointer opacity-75 hover:opacity-50"><RemoveRedEyeOutlinedIcon/></span>
                           </div>
               </div>

               <div className="hidden">
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Método de recebimento</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.payment_origin}
                                label="Tipo de recebimento"
                                onChange={(e)=>setFormData({...formData,payment_origin:e.target.value})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                  <MenuItem value={'cash'}>Dinheiro</MenuItem>
                                  <MenuItem value={'card'}>Cartão </MenuItem>
                                  <MenuItem value={'check'}>Cheque</MenuItem>
                                  <MenuItem value={'transfer'}>Transferência</MenuItem>
                                  <MenuItem value={'mkesh'}>Mkesh</MenuItem>
                                  <MenuItem value={'e-mola'}>E-mola</MenuItem>
                                  <MenuItem value={'m-pesa'}>M-pesa</MenuItem>
                                  <MenuItem value={'paypal'}>PayPal</MenuItem>
                                  <MenuItem value={'stripe'}>Stripe</MenuItem>
                                  <MenuItem value={'skrill'}>Skrill</MenuItem>
                                </Select>

                        </FormControl>
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

