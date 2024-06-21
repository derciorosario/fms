
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams,useLocation,useNavigate} from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete, Button, Checkbox} from '@mui/material';
import Switch from '@mui/material/Switch';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import InstallentsTable from '../../../components/Tables/Installments'
import PouchDB from 'pouchdb';
import moment from 'moment';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import FormLayout from '../../../layout/DefaultFormLayout';


       function App() {

         /// const { ipcRenderer } = window.require('electron');

         const navigate = useNavigate()

       
          const {_cn_op,_divideDatesInPeriods,_account_categories,_get,_suppliers,_categories,_scrollToSection,_investors,_cn,_clients}=useData()

          const { id } = useParams()

          const db={
            bills_to_pay:new PouchDB('bills_to_pay'),
            bills_to_receive:new PouchDB('bills_to_receive')
          } 

          let {pathname} = useLocation()


          let type=pathname.includes('/bills-to-pay') ? 'pay' : 'receive';


          const [countFormUpdates,setCountFormUpdates]=React.useState(0)


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

          useEffect(()=>{

                if(!id) return 

                (async()=>{
                try {
                    let item=await db['bills_to_'+type].get(id)
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
          const [showMoreOptions,setShowMoreOptions]=React.useState(false)

          

          useEffect(()=>{
            setAccountCategories(_account_categories.filter(i=>i.transation_type==(type=="receive" ? "in" :"out")))
          },[_account_categories])

        
         

            let initial_form={
               account_id:'',
               type:'fixed',
               description:'',
               account_origin:'',
               deleted:false,
               installments:[],
               paid:0,
               invoice_number:'',
               payday:'',
               total_installments:'',
               invoice_emission_date:'',
               amount:'',
               payment_origin:'cash',
               reference:{id:null,name:''},
               status:'pending',
               pay_in_installments:false,
               repeat_details:{repeat:false,times:1,period:'month'},
               createdAt:new Date().toISOString(),
               files:[]

           }
           

           const [formData, setFormData] = React.useState(initial_form);

           useEffect(()=>{

            if(type=="receive"){
                setReferenceOptions(_clients)
            }else if(formData.account_origin!="loans_out"){
                setReferenceOptions(_suppliers)
            }else{
                setReferenceOptions(_investors)
            }
           },[formData.reference,_suppliers,_investors,_clients])

           useEffect(()=>{
            (async()=>{
                let docs=await db['bills_to_'+type].allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()

            setCountFormUpdates(prev=>prev + 1)
          },[formData])



          useEffect(()=>{
             console.log(countFormUpdates)
          },[countFormUpdates])



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
             
               if(formData.paid) return

               let parts=formData.total_installments ? parseInt(formData.total_installments) : 1
       

               setFormData({...formData,
                installments:Array.from({ length: parts }, (i,_i) => {
                      
                      return {fees:'',id:Math.random(),amount:parseFloat(formData.amount / parts),date:_i==0 ? formData.payday : null,paid:0,status:'pending'}
                })})

                //if(id) return


              /* if(formData.payday && formData.amount && (formData.payday.toString()!="Invalid Date")){
                   let parts=formData.total_installments ? parseInt(formData.total_installments) : 1

                   if(formData.installments.length==parts){
                        setFormData({...formData,installments:formData.installments.map(i=>({...i,fees:'',amount:parseFloat(formData.amount / parts)}))})
                   }else{

                    setFormData({...formData,
                      installments:Array.from({ length: parts }, () => {
                            return {fees:'',id:Math.random(),amount:parseFloat(formData.amount / parts),date:parts == 1 ? formData.payday : null,paid:0,status:'pending'}
                    })})

                   }
                  
               }else{
                   setFormData({...formData,installments:[]})
               }*/

          },[formData.due_date,formData.payday,formData.total_installments,formData.amount])

          useEffect(()=>{
            let account=accountCategories.filter(i=>i.name?.toLowerCase()==formData.account_name?.toLowerCase() && !i.deleted)[0]
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
           if(formData.pay_in_installments==true && !formData.total_installments){
              setFormData({...formData,total_installments:1})
           }else if(formData.pay_in_installments==false){
              setFormData({...formData,total_installments:''})
           }



           
          },[formData.pay_in_installments])

          useEffect(()=>{

               if(!formData.repeat_details.times) setFormData({...formData,repeat_details:{...formData.repeat_details,times:1}})
           
           },[formData.repeat_details.repeat])

          
       
          let required_fields=['account_id','amount','payday','due_date','description']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }


          function saveAndPay(){
            alert('still working on it')
            return
               if(!valid) return
               navigate(`/cash-management/${type!='pay' ? 'in' :'out'}flow/create?bill=${formData.id}`)
          }
       
      
         async function SubmitForm(){
              
              if(valid){
                   try{
                     if(id){
                        _update('bills_to_'+type,[{...formData}])
                        toast.success('Conta actualizada')
                     }else{

                        let reference_id=formData.reference.id

                        if(formData.reference.name && !formData.reference.id){
                           reference_id=Math.random().toString()

                          _add(type=="receive" ? 'clients' : (formData.account_origin=="loans_out" ? 'investors' : 'suppliers'),[{
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
                              transation_type:_categories.filter(i=>i.field==formData.account_origin)[0].type,
                              type:formData.type,
                              reference:{...formData.reference,id:reference_id},
                              description:'',
                              account_origin:formData.account_origin,
                              deleted:false
                            }])
                        }




                        let linked_id=Math.random()

                        let date_intervals=_divideDatesInPeriods(formData.payday, formData.repeat_details.times,formData.repeat_details.period)

                        let data_to_add=Array.from({ length:parseInt(formData.repeat_details.times) }, () => []).map((i,_i)=>{
                     
                                let installments=_i==0 ? formData.installments : formData.installments.map((f,_f)=>{
                                        return _f == 0 ? {...f,date:new Date(date_intervals[_i][0])} : {...f,date:null}
                                })
                                    
                                return {...formData,
                                        payday:_i==0 ? formData.payday : new Date(date_intervals[_i][0]),
                                        amount:parseFloat(formData.amount),
                                        paid:parseFloat(formData.paid ? formData.paid : 0),
                                        installments:installments,
                                        reference:{...formData.reference,id:reference_id},
                                        linked_id,
                                        index:_i,
                                        total_installments:parseInt(formData.total_installments ? formData.total_installments : 1),
                                        status:parseFloat(formData.paid) == parseFloat(formData.amount) ? 'paid' : formData.status,
                                        id:Math.random(),_id:Math.random().toString()}

                        })
                       
                            
                        _add('bills_to_'+type,data_to_add)

                        
                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        setFormData(initial_form)
                        setPaydayHelper('custom')

                       


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

               if(!formData.reference.name && formData.account_origin) {
                v=false
               }
               setValid(v)
          },[formData])



          const handleFileChange = (event) => {
            console.log('hi')
            return
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                 // setFileContent(e.target.result);
                const filePath = `path/${file.name}`;
                fs.writeFileSync(filePath, e.target.result);
              };
              reader.readAsText(file);
            }
          }




          return  (
             <>
               <FormLayout name={ `${id ? 'Actualizar' : 'Nova'} conta a `+ (type=="receive" ? 'receber' : 'pagar')} formTitle={id ? 'Actualizar' : 'Adicionar nova'} topLeftContent={(
                   <>

                     {formData.paid ?  (
                        <div className="flex justify-center items-center">
                            <div>
                                <button onClick={()=>alert('still working on it')} type="button" className="text-gray-900 bg-white flex hover:bg-gray-100 border border-red-400 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center">
                                <span className="ml-1  text-red-600">Anular {type=="receive" ? 'recebimentos' : 'pagamentos'}</span>
                                </button>
                            </div>

                            <div className="ml-2">
                                <button onClick={()=>alert('still working on it')} type="button" className={`text-gray-900 flex hover:opacity-90 border  bg-blue-600 border-blue-500   focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center`}>
                                <span className="ml-1 text-white">Ver {type=="receive" ? 'recebimentos' : 'pagamentos'}</span>
                                </button>
                           </div>
                        </div>
                     ) : ''}

                     {id && !formData.paid && formData.id && <div>
                        <button onClick={saveAndPay} type="button" className={`text-gray-900 flex hover:opacity-90 border ${valid ? 'bg-blue-600 border-blue-500':'bg-gray-400 cursor-not-allowed'}   focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center`}>
                           <span className="ml-1 text-white">Salvar e efetuar {type=="receive" ? 'pagamento' : 'pagamento'}</span>
                        </button>
                     </div>}



                   </>
                  
               )}>

                     <FormLayout.Cards topInfo={[
                          //{name:'Saldo da conta',value:_cn(formData.amount && formData.paid ? parseFloat(formData.amount) - parseFloat(formData.paid) : formData.amount ? parseFloat(formData.amount) : 0)},
                          {name:type=="pay" ? "Pago" : "Recebido",value:_cn(formData.paid ? parseFloat(formData.paid) : 0)},
                          {name:'Estado',value:formData.paid >= formData.amount && formData.amount ? 'Pago' : 'Pedente',color:formData.paid >= formData.amount && formData.paid ? 'green' :null},
                          {id:'fees',name:'Multa',value:_cn(formData.fees)},
                          
                     ].filter(i=>i.id!='fees' || formData.fees)}/>

                     <FormLayout.Section>


                        <div>
                            <TextField
                                    id="outlined-multiline-static"
                                    label="Descrição*"
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
                                inputValue={formData.account_name}
                                onInputChange={(event, newInputValue) => {
                                setFormData({...formData,account_name:newInputValue})
                                }}
                                id="controllable-states-demo"
                                options={accountCategorieOptions}
                                sx={{ width: 300 }}
                                disabled={formData.paid ? true : false}
                                renderInput={(params) => <TextField {...params}
                                helperText={!accountCategories.some(a=>a.id==formData.account_id) && formData.account_name ? "(Nova conta será adicionada)" :''}
                    
                                 value={formData.account_name} label="Nome da conta *" />}
                        />   
                            </div>
                        <div>
                            <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                            <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Categoria *</InputLabel>
                                            <Select
                                            disabled={formData.paid ? true : false}
                                            labelId="demo-simple-select-error-label_"
                                            id="demo-simple-select-error_"
                                            value={formData.account_origin}
                                            label="Categoria"
                                            defaultValue=""
                                            onChange={(e)=>{
                                                setFormData({...formData,account_origin:e.target.value,reference: type=="receive" ? formData.reference : (e.target.value=="loans_out" || !e.target.value || (e.target.value!="loans_out" && formData.account_origin=="loans_out") ? {id:null,name:null} : formData.reference)})
                                            }}
                                            sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            >

                                            <MenuItem value="">
                                               <em>Selecione uma opção</em>
                                            </MenuItem> 


                                            {_categories.filter(i=>!i.disabled && (type=='pay' ? (i.type=="out") : (i.type=="in"))).map(i=>(
                                                <MenuItem value={i.field} key={i.field}><span className={`w-[7px] rounded-full h-[7px] ${type=='pay' ? 'bg-red-500' :' bg-green-600'}  inline-block mr-2`}></span> <span>{i.name}</span></MenuItem>
                                            ))}

                                            </Select>

                            </FormControl>
                            </div>


                            <div>
                                <Autocomplete size="small"
                                value={formData.reference.name && formData.account_origin ? formData.reference.name : null}
                                onChange={(event, newValue) => {
                                    newValue=newValue ? newValue : ''
                                    let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                                    setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                                }}
                                noOptionsText="Sem opções"
                                defaultValue={null}
                                inputValue={(formData.account_origin) ? formData.reference.name  : "" }
                                onInputChange={(event, newInputValue) => {
                                    newInputValue=newInputValue ? newInputValue : ''
                                    let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                                    setFormData({...formData,reference:{...formData.reference,name:newInputValue,id:reference_id}})
                            
                                }}
                                id="_referece"
                                options={referenceOptions.map(i=>i.name)}
                                sx={{ width: 300 }}
                                disabled={type=="receive" ? false : (!formData.account_origin ? true : false)}
                                renderInput={(params) => <TextField {...params}

                                onBlur={()=>validate_feild('reference')}
                                error={(!formData.reference.name) && verifiedInputs.includes('reference') ? true : false}
                                helperText={(!formData.reference.name) && verifiedInputs.includes('reference') ? "Insira nome": !formData.reference.id && formData.reference.name ? `(Novo ${formData.type=='receive' ? 'cliente' :formData.account_origin=='loans_out' ? 'investidor' :'fornecedor'} será adicionado) `: ''}
                                
                                value={formData.reference.name} label={type=="receive" ? 'Cliente' : (!formData.account_origin ? 'Fornecedor / Investidor' : formData.account_origin == "loans_out" ? 'Investidor' :'Fornecedor')}  />}
                                />   
                            </div>




                            <div className="hidden">
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
                                            label="Valor a pagar *"
                                            placeholder="Digite o valor a pagar"
                                            multiline
                                            disabled={formData.paid ? true : false}
                                            value={formData.amount}
                                            onBlur={()=>validate_feild('amount')}
                                            onChange={(e)=>setFormData({...formData,amount:_cn_op(e.target.value)})}
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
                                    helperText={parseFloat(formData.amount) < parseFloat(formData.paid) ? "Não deve ser maior que o valor a pagar" :''}
                                    value={formData.paid}
                                    onChange={(e)=>setFormData({...formData,paid:_cn_op(e.target.value)})}
                                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />
                        </div>


                            <div className="flex items-center justify-center">
                            <div className="w-full">
                            <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                <DatePicker value={dayjs(formData.payday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.payday)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,payday:e.$d})} error={true} size="small" label="Data de pagamento*"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
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
                                label="Categoria"
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
                                    <DatePicker onChange={(e)=>setFormData({...formData,due_date:e.$d})} label="Prazo de pagamento *"  style={{padding:0,overflow:'hidden'}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            </div>
                        

                        <div className="hidden">
                                    <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                            <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Método de pagamento</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-error-label"
                                            id="demo-simple-select-error"
                                            value={formData.payment_origin}
                                            label="Tipo de pagamento"
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

                           
                        

                     </FormLayout.Section>


                     <div className="flex px-[6px] items-center mt-3 pb-2">
                        <label className="flex items-center cursor-pointer hover:opacity-90">
                            <Switch checked={Boolean(formData.repeat_details.repeat)}
                            disabled={Boolean(id)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(e)=>{
                                setFormData({...formData,repeat_details:{...formData.repeat_details,repeat:!formData.repeat_details.repeat}})
                                if(!formData.repeat_details.repeat) setTimeout(()=>_scrollToSection('repeat-payment'),100)
                            }}/>
                            <span>Repetir lançamento</span>
                        </label>
                     </div>


                     <div className={`${formData.repeat_details.repeat ? 'flex' :'hidden'}`}>

                            <FormLayout.Section id={'repeat-payment'}>
                                
                                <div className="flex">

                                    <div>
                                                <TextField
                                                id="outlined-textarea"
                                                label="Quantidade de vezes"
                                                placeholder="Digite o número"
                                                multiline
                                                disabled={Boolean(id)}
                                                value={formData.repeat_details.times}
                                                onBlur={()=>validate_feild('repeat-payment-quantity')}
                                                onChange={(e)=>setFormData({...formData,repeat_details:{...formData.repeat_details,times:_cn_op(e.target.value)}})}
                                                error={(!formData.repeat_details.times) && verifiedInputs.includes('repeat-payment-quantity') ? true : false}
                                                helperText={!formData.repeat_details.times && verifiedInputs.includes('repeat-payment-quantity') && formData.repeat_details.repeat==true ? "Campo obrigatório" :''}
                                                sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                                />
                                    </div>

                                    
                                    <FormControl sx={{ m: 1, width: 'calc(40% + 3px)',margin:0,height:40,marginLeft:'3px',display:id ? 'none' :'flex'}} size="small">
                                        <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Periodo</InputLabel>
                                        <Select
                                        disabled={Boolean(id)}
                                        labelId="demo-simple-select-error-label"
                                        id="demo-simple-select-error"
                                        value={formData.repeat_details.period}
                                        label="Periodo"
                                        onChange={(e)=>setFormData({...formData,repeat_details:{...formData.repeat_details,period:e.target.value}})}
                                        sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                        '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                        >
                                        
                                        <MenuItem value={'month'}>Meses</MenuItem>
                                        <MenuItem value={'week'}>Semanas</MenuItem>
                                        <MenuItem value={'year'}>Anos</MenuItem>
                                        </Select>
                                        </FormControl>

                                </div>
                                
                            </FormLayout.Section>

                     </div>


                     <span className="flex border-b"></span>




                     <div className="flex px-[6px] items-center my-3">
                        <label className="flex items-center cursor-pointer hover:opacity-90">
                           

                            <Switch checked={Boolean(formData.pay_in_installments)}
                            disabled={formData.paid ? true : false}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(e)=>{
                                if(!formData.pay_in_installments) setTimeout(()=>_scrollToSection('pay_in_installments'),100)
                                setFormData({...formData,pay_in_installments:!formData.pay_in_installments})
                            }}/>
                            <span>Pagar em prestações</span>
                        </label>
                     </div>


                     <div  className={`${formData.pay_in_installments ? 'flex' :'hidden'}`}>

                     <FormLayout.Section id={'pay_in_installments'}>


                                <div>
                                        <TextField
                                        id="outlined-textarea"
                                        label="Quantidade de prestações"
                                        placeholder="Digite o número"
                                        multiline
                                        disabled={formData.pay_in_installments && !formData.paid ? false : true}
                                        value={formData.total_installments}
                                        onBlur={()=>validate_feild('total_installents')}
                                        onChange={(e)=>setFormData({...formData,total_installments:_cn_op(e.target.value)})}
                                        error={(!formData.total_installments) && verifiedInputs.includes('total_installments') ? true : false}
                                        helperText={!formData.total_installments && verifiedInputs.includes('total_installments') && formData.pay_in_installments==true ? "Campo obrigatório" :''}
                                        sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                        '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                        />
                                </div>

                     </FormLayout.Section>

                     </div>


                    



                     {formData.pay_in_installments && <InstallentsTable disabled={formData.paid ? true : false}  items={formData.installments} formData={formData} setFormData={setFormData} page={'pay'}/> }

                     <span className="flex border-b"></span>


                     <div className="flex px-[6px] items-center mt-3 pb-2 pl-3">
                        <label className="flex items-center cursor-pointer hover:opacity-90" onClick={()=>{
                            if(!showMoreOptions) setTimeout(()=>_scrollToSection('_show_more_option'),100)
                            setShowMoreOptions(!showMoreOptions)
                        }}>
                            <span className={`${showMoreOptions ? ' rotate-180' :' '}`}><ExpandMoreOutlinedIcon sx={{color:'gray'}}/></span>
                            <span>Mostar mais opções</span>
                        </label>
                     </div>


                     <div id={'_show_more_options'} className={`${showMoreOptions ? '' :'hidden'}`}>

                            <FormLayout.Section>
                                
                                <div className="-translate-y-0">
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


                               
                                        
                            </FormLayout.Section>

                            <div className="block w-full px-4">
                                <div className="border h-16 flex items-center justify-center rounded-[2px] relative cursor-pointer border-dashed">
                                        <label>
                                            <Button sx={{width:'100%'}} endIcon={<FilePresentIcon/>}>Anexar documento ou imagem</Button>
                                            <input onChange={handleFileChange} className="w-full h-full absolute top-0 left-0 opacity-0" type="file"/>
                                        </label>
                            </div>
                            </div>

                     </div>


                     <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>


                </FormLayout>

               
             </>
          )
          



}
export default App

