
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
import InstallentsTable from '../../../components/Tables/Installments'
import PouchDB from 'pouchdb';
import moment from 'moment';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import FormLayout from '../../../layout/DefaultFormLayout';
import ConfirmDialog from '../../../components/Dialogs/confirm';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultUpload from '../../../components/Files/default-upload';

       function App() {
          const {t} = useTranslation()
        
          const navigate = useNavigate()

          const data = useData()
          const {user,db} = useAuth()
          
          const [initialized,setInitialized]=React.useState()
          const required_data=['account_categories','bills_to_pay','bills_to_receive']
          

          const { id } = useParams()

         

          let {pathname} = useLocation()


          let type=pathname.includes('/bills-to-pay') ? 'pay' : 'receive';


          const [countFormUpdates,setCountFormUpdates]=React.useState(0)
         

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


         const [paydayHelper,setPaydayHelper]=React.useState('custom')
         const [loading, setLoading] = React.useState(false);
         const [valid, setValid] = React.useState(false);
         const {makeRequest,_add,_update,_loaded,_initial_form,_get,_setRequiredData} = useData();
         const [accountCategorieOptions, setAccountCategorieOptions] = React.useState([]);
         const account_name = React.useRef(null);
         const [accountCategories,setAccountCategories]=React.useState([])
         const [referenceOptions,setReferenceOptions]=React.useState([])
         const [showMoreOptions,setShowMoreOptions]=React.useState(false)
          
       
          useEffect(()=>{

                if(!id || id==formData.id || !db['bills_to_'+type]) return 

                (async()=>{
                  let item =  await db['bills_to_'+type].find({selector: {id}})
                  item=item.docs[0]

                  if(item){
                   setFormData({...item,
                      paid:item.paid ? item.paid : '',
                      files:item.files[0] ? [{...item.files[0],checked:item.files[0].local ? false : true}] : []
                   })
                  }else{
                    navigate(`/bills-to-${type}`)
                    toast.error(`Item não encontrado`)
                  }
                  
                })()

          },[db,pathname,_setRequiredData])

       



        
         
          const [deletePayments,setDeletePayments]=React.useState({
            showDialog:false,
            loading:false,
            message:'',
            buttons:[]
          })

          useEffect(()=>{
            _setRequiredData(required_data)
           },[])


          useEffect(()=>{
            if(!(required_data.some(i=>!_loaded.includes(i)))){
                setInitialized(true)
            }
           },[_loaded])
          
           useEffect(()=>{
              _get(required_data.filter(i=>!_loaded.includes(i))) 
           },[db])


           

           const [formData, setFormData] = React.useState(_initial_form.bills);

           useEffect(()=>{
            if(formData.account_origin=="loans_out" || formData.account_origin=="loans_in"){
              setReferenceOptions([{name:t('common.add_new')},...data._investors])
            }else if(type=="receive"){
                setReferenceOptions([{name:t('common.add_new')},...data._clients])
            }else{
                setReferenceOptions([{name:t('common.add_new')},...data._suppliers])
            }
           },[formData.reference,data._suppliers,data._investors,data._clients])

           useEffect(()=>{
            setCountFormUpdates(prev=>prev + 1)
          },[formData])




          
          useEffect(()=>{
            if(formData.account_origin){
                setAccountCategories(data._account_categories.filter(i=>(!formData.loan_id || i.account_origin=="loans_out")  && i.account_origin==formData.account_origin && i.type==(type=="receive" ? "in" :"out")))
            }else{
                setAccountCategories(data._account_categories.filter(i=>i.type==(type=="receive" ? "in" :"out")))
            }

          },[data._account_categories,formData.account_origin])





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
                      
                      return {fees:'',id:uuidv4(),amount:parseFloat(formData.amount / parts),date:_i==0 ? formData.payday : null,paid:0,status:'pending'}
                })})

                //if(id) return


              /* if(formData.payday && formData.amount && (formData.payday.toString()!="Invalid Date")){
                   let parts=formData.total_installments ? parseInt(formData.total_installments) : 1

                   if(formData.installments.length==parts){
                        setFormData({...formData,installments:formData.installments.map(i=>({...i,fees:'',amount:parseFloat(formData.amount / parts)}))})
                   }else{

                    setFormData({...formData,
                      installments:Array.from({ length: parts }, () => {
                            return {fees:'',id:uuidv4(),amount:parseFloat(formData.amount / parts),date:parts == 1 ? formData.payday : null,paid:0,status:'pending'}
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
                 setFormData({...formData,account_origin:account.account_origin,type:account.type,account_id:id ? id : formData.account_name ? uuidv4() : null})
            }else{
                 setFormData({...formData,account_id:id ? id : formData.account_name ? uuidv4() : null})
            }
          },[formData.account_name,accountCategories])

          useEffect(()=>{
           
             let items=accountCategories.map(i=>i.name)
             setAccountCategorieOptions([t('common.add_new'),...items])
         
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


         async  function saveAndPay(){
               if(!valid) return
               await SubmitForm()
               navigate(`/cash-management/${type!='pay' ? 'in' :'out'}flow/create?bill_to_${type}=${formData.id}`)
          }


          async function confirmDeletePayments(res){

                 if(!res) {
                    setDeletePayments({showDialog:false})
                    return
                 }else{
                    setDeletePayments({...deletePayments,loading:true})
                 }

                 let docs=await db.transations.allDocs({ include_docs: true })
                 docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
                 
                 let transations=docs.filter(i=>i.account.id==formData.id)

                 for (let i = 0; i < transations.length; i++) {
                    await db.transations.put({...transations[i],deleted:true})
                 }

                 if(formData.loan_id){

                    let loan = await db.loans.find({selector: {id:formData.loan_id}})
                    loan=loan.docs[0]
                    if(loan){
                      loan.paid=0
                      loan.fees=0
                      await _update('loans',[loan])
                    }

                 }

                 let item=await db['bills_to_'+type].get(id)
                  item={
                    ...item,
                    paid:'',
                    fees:0,
                    status:'pending'
                  }

                 await db['bills_to_'+type].put(item)
                 setFormData(item)
                 setDeletePayments(prev=>({...prev,showDialog:false}))
                 toast.success('Pagamentos anulados')
          }

         

         async function SubmitForm(){
              
              if(valid){


                let reference_id=formData.reference.id

                if(formData.reference.name && !formData.reference.id){
                   reference_id=uuidv4()

                 await _add(type=="receive" ? 'clients' : (formData.account_origin=="loans_out" || formData.account_origin=="loans_in" ? 'investors' : 'suppliers'),[{
                    id:reference_id,
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
                  await  _add('account_categories',[{
                      id:formData.account_id,
                      name:formData.account_name,
                      type:data._categories.filter(i=>i.field==formData.account_origin)[0].type,
                      reference:{...formData.reference,id:reference_id,type:formData.account_origin=="loans_out" || formData.account_origin=="loans_in" ? 'investors' : type=="receive" ? 'clients': 'suppliers' },
                      description:'',
                      initial_amount:0,
                      account_origin:formData.account_origin,
                      deleted:false
                    }])
                }

                




                   try{
                     if(id){

                        let status=formData.paid >= formData.amount && parseFloat(formData.amount) && id ? 'paid' : formData.status!="paid" &&  new Date(data._today()) > new Date(formData.payday) && id ? 'delayed' : 'pending'
                        
                        if(formData.loan_id){
                            let loan = await db.loans.find({selector: {id:formData.loan_id}})
                            loan=loan.docs[0]
                          
                            if(loan){
                              loan.reference=formData.reference
                              loan.payday=formData.payday
                              loan.status=status
                              loan.account_id=formData.account_id
                              loan.account_name=formData.account_name
                              loan.total_installments=parseInt(formData.total_installments || 1),
                              loan.transation_fees=formData.amount
                              loan.installment_amount=parseFloat(formData.amount) / parseFloat(formData.total_installments || 1)
                              await _update('loans',[loan])
                            }
                        }

                        await _update('bills_to_'+type,[{...formData,status}])
                        toast.success('Conta actualizada')
                     }else{

                        let linked_id=uuidv4()

                        let date_intervals=data._divideDatesInPeriods(formData.payday, formData.repeat_details.times,formData.repeat_details.period)

                        let data_to_add=Array.from({ length:parseInt(formData.repeat_details.times) }, () => []).map((i,_i)=>{
                     
                                let installments=_i==0 ? formData.installments : formData.installments.map((f,_f)=>{
                                        return _f == 0 ? {...f,date:new Date(date_intervals[_i][0])} : {...f,date:null}
                                })
                                    
                                return {...formData,
                                        payday:_i==0 ? formData.payday : new Date(date_intervals[_i][0]),
                                        amount:parseFloat(formData.amount),
                                        paid:parseFloat(formData.paid ? formData.paid : 0),
                                        installments:installments,
                                        reference:{...formData.reference,id:reference_id,type:formData.account_origin=="loans_out" || formData.account_origin=="loans_in" ? 'investors' : type=="receive" ? 'clients': 'suppliers' },
                                        linked_id,
                                        index:_i,
                                        total_installments:parseInt(formData.total_installments ? formData.total_installments : 1),
                                        status:parseFloat(formData.paid) == parseFloat(formData.amount) ? 'paid' : formData.status,
                                        id:uuidv4(),_id:new Date().toISOString() + "-" + _i}

                        })
                       
                            
                        await  _add('bills_to_'+type,data_to_add)

                        setVerifiedInputs([])
                        toast.success('Conta adicionada')
                        setFormData(_initial_form.bills)
                        setPaydayHelper('custom')

                    }

                    return {ok:true}
                 }catch(e){
                        console.log(e)
                        toast.error('Erro inesperado!')
                        return {error:e}
                 }
              }else{
               toast.error('Preencha todos os campos obrigatórios')
              }
          }



            useEffect(()=>{
          
   
          if(data._openDialogRes.from=="transations" && data._openDialogRes.page=="payment_methods" && _payment_methods.some(i=>i.id==data._openDialogRes?.item?.id)){
            setFormData({...formData,payments:formData.payments.map((i,_i)=>{
                  if(_i==data._openDialogRes.details.index){
                      return {...i,account_id:data._openDialogRes.item.id,name:data._openDialogRes.item.name}
                  }else{
                     return i
                  }
            })})

            data._setOpenDialogRes({})
         }

         if(data._openDialogRes.from=="bills" && data._openDialogRes.page=="accounts" && data._account_categories.some(i=>i.id==data._openDialogRes?.item?.id)){
          
          setFormData({...formData,account_origin:data._openDialogRes.item.account_origin,account_name:data._openDialogRes.item.name,account_id:data._openDialogRes.item.id})
          setAccountCategorieOptions(data._account_categories.filter(i=>i.account_origin==data._openDialogRes.account_origin).map(i=>i.name))
        

          data._setOpenDialogRes({})
       }

       

       if(data._openDialogRes.from=="bills" && data._openDialogRes.page=="register" && (data._clients.some(i=>i.id==data._openDialogRes?.item?.id) ||  data._suppliers.some(i=>i.id==data._openDialogRes?.item?.id) ||  data._investors.some(i=>i.id==data._openDialogRes?.item?.id))){
          
        setFormData({...formData,reference:{name:data._openDialogRes.item.name,id:data._openDialogRes.item.id}})
        

        data._setOpenDialogRes({})
     }

      },[data._openDialogRes,data._payment_methods,data._account_categories,data._investors,data._clients,data._suppliers])

       


          useEffect(()=>{
                let v=true
                Object.keys(formData).forEach(f=>{
                  if(((!formData[f]?.toString()?.length && f != 'paid') && required_fields.includes(f))){
                      v=false
                  }
              })
              setValid(v)
         },[formData])


          return  (
             <>


             <div className="_input">
              
             
              <ConfirmDialog show={deletePayments.showDialog} message={deletePayments.message} res={confirmDeletePayments} loading={deletePayments.loading}/>
               
               <FormLayout loading={!initialized || loading} name={ `${id ? 'Actualizar' : 'Nova'} conta a `+ (type=="receive" ? 'receber' : 'pagar')} formTitle={id ? 'Actualizar' : 'Adicionar nova'} topLeftContent={(
                 
                 <>
                        <div className="flex justify-center items-center">
                            
                              {id && <span className="mr-3 opacity-80">Pagamentos:</span>}
                            
                           {(formData.paid) ? <>

                            <div>
                                <button onClick={()=>setDeletePayments({showDialog:true,loading:false})} type="button" className="text-gray-900 bg-white flex hover:bg-gray-100 border border-red-400 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center">
                                <span className="ml-1  text-red-600">Anular</span>
                                </button>
                            </div>

                            <div className="ml-2">
                                <button onClick={()=>navigate(`/cash-management/${type=="pay" ? 'outflow':'inflow'}?search=${formData.id}`)} type="button" className={`text-gray-900 flex hover:opacity-90 border  border-blue-500   focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center`}>
                                <span className="ml-1 text-blue-600">Ver</span>
                                </button>
                           </div>
                           </>:''}

                          {id && formData.status!="paid" && formData.id && <div className="ml-2">
                              <button onClick={saveAndPay} type="button" className={`text-gray-900 flex hover:opacity-90 border ${valid ? 'bg-app_orange-500':'bg-gray-400 cursor-not-allowed'}   focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-5 py-[5px] text-center items-center`}>
                                <span className="ml-1 text-white">Salvar e pagar</span>
                              </button>
                          </div>}


                        </div>
                    

                     



                   </>
                  
               )}>




                     <FormLayout.Cards topInfo={[
                          //{name:'Saldo da conta',value:_cn(formData.amount && formData.paid ? parseFloat(formData.amount) - parseFloat(formData.paid) : formData.amount ? parseFloat(formData.amount) : 0)},
                          {name:type=="pay" ? "Pago" : "Recebido",value:data._cn(formData.paid ? parseFloat(formData.paid) : 0)},
                          {name:'Estado',value:formData.paid >= formData.amount && parseFloat(formData.amount) && id ? 'pago' : formData.status!="paid" &&  new Date(data._today()) > new Date(formData.payday) && id ? 'atrasado' : 'pedente',color:formData.status!="paid" && id && new Date(data._today()) > new Date(formData.payday) ? 'crimson' :formData.paid >= formData.amount && formData.paid && id ? 'green' :null},
                          {id:'left',name:'Em falta',value:parseFloat(formData.paid) > parseFloat(formData.amount) ? 0 :data._cn(parseFloat(formData.amount ? formData.amount : 0) - parseFloat(formData.paid ? formData.paid : 0))},
                          {id:'fees',name:'Multa',value:data._cn(formData.fees)},
                          
                     ].filter(i=>(i.id!='fees' || formData.fees) && (i.id!="left" || id))}/>


                     

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
                        <div className=" relative">

                        {/*<div className={`text-[13px] ${formData.paid ?'opacity-30 pointer-events-none':''} absolute hover:opacity-55 cursor-pointer right-0 top-[-0.1rem] translate-y-[-100%] flex items-center`}>
                              <Add sx={{width:16,height:16,opacity:0.6}}/>
                       </div>*/}


                                
                            <Autocomplete size="small"
                                value={formData.account_name ? formData.account_name : null}
                                onChange={(event, newValue) => {
                                    if(newValue==t('common.add_new')){
                                      data._showCreatePopUp('accounts','bills',{type:formData.loan_id ? "loans_out": type=="receive" ? "in":"out",account_origin:formData.account_origin})
                                    }else{
                                      setFormData({...formData,account_name:newValue})
                                    }
                                }}
                                noOptionsText="Não encotrado"
                                ref={account_name}
                                defaultValue={null}
                                inputValue={formData.account_name}
                                onInputChange={(event, newInputValue) => {
                                  if(!newInputValue==t('common.add_new')){
                                    setFormData({...formData,account_name:newInputValue})
                                  }
                                }}
                                id="controllable-states-demo"
                                options={accountCategorieOptions}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params}
                                helperText={!accountCategories.some(a=>a.id==formData.account_id) && formData.account_name && initialized ? "(Nova conta será adicionada)" :''}
                                sx={{'& .MuiFormHelperText-root': {color:!accountCategories.some(a=>a.id==formData.account_id) && formData.account_name ? 'green' : 'crimson'}}}
                                value={formData.account_name} label="Nome da conta *" />}
                        />   
                            </div>
                        <div>
                            <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                            <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Categoria *</InputLabel>
                                            <Select
                                            disabled={accountCategories.some(a=>a.id==formData.account_id) || formData.loan_id ? true : false}
                                            labelId="demo-simple-select-error-label_"
                                            id="demo-simple-select-error_"
                                            value={formData.account_origin}
                                            label="Categoria"
                                            defaultValue=""
                                            onChange={(e)=>{
                                                setFormData({...formData,account_origin:e.target.value,reference: ((e.target.value=="loans_in" || !e.target.value || (e.target.value!="loans_in" && formData.account_origin=="loans_in")))          ||         (e.target.value=="loans_out" || !e.target.value || ((e.target.value!="loans_out" && formData.account_origin=="loans_out"))) ? {id:null,name:null} : formData.reference})
                                            }}
                                            sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            >

                                            <MenuItem value="">
                                               <em>Selecione uma opção</em>
                                            </MenuItem> 


                                            {data._categories.filter(i=>!i.disabled && (type=='pay' ? (i.type=="out") : (i.type=="in"))).map(i=>(
                                                <MenuItem value={i.field} key={i.field}><span className={`w-[7px] rounded-full h-[7px] ${type=='pay' ? 'bg-red-500' :' bg-green-600'}  inline-block mr-2`}></span> <span>{i.name}</span></MenuItem>
                                            ))}

                                            </Select>

                            </FormControl>
                            </div>


                            <div className="relative"> 

                              {/**<div  onClick={()=>data._showCreatePopUp('register','bills',{[`${type=="in" ? (formData.account_origin=="loans_in" ? "investor" : "client")  : (formData.account_origin == "loans_out" ? 'investor' :'supplier')}`]:true})}
                                  className={`text-[13px] ${!formData.account_origin ? ' opacity-25 pointer-events-none':"hover:opacity-55 cursor-pointer"} absolute   right-0 top-[-0.1rem] translate-y-[-100%] flex items-center`}>
                                          <Add sx={{width:16,height:16,opacity:0.6}}/>
                              </div> */}

                                <Autocomplete size="small"
                                value={formData.reference.name && formData.account_origin ? formData.reference.name : null}
                                onChange={(event, newValue) => {
                                    if(newValue==t('common.add_new')){
                                      data._showCreatePopUp('register','bills',{[`${type=="in" ? (formData.account_origin=="loans_in" ? "investor" : "client")  : (formData.account_origin == "loans_out" ? 'investor' :'supplier')}`]:true})
                                   }else{
                                      newValue=newValue ? newValue : ''
                                      let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                                      setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                                
                                    }
                                   }}
                                noOptionsText="Sem opções"
                                defaultValue={null}
                                inputValue={(formData.account_origin) ? formData.reference.name  : "" }
                                onInputChange={(event, newInputValue) => {
                                    if(newInputValue!=t('common.add_new')){
                                      newInputValue=newInputValue ? newInputValue : ''
                                      let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                                       setFormData({...formData,reference:{...formData.reference,name:newInputValue,id:reference_id}})
                                    }
                                    
                                }}
                                
                                id="_referece"
                                options={referenceOptions.map(i=>i.name)}
                                sx={{ width: 300 }}
                                disabled={(!formData.account_origin ? true : false)}
                                renderInput={(params) => <TextField {...params}

                                onBlur={()=>validate_feild('reference')}
                                helperText={!formData.reference.id && formData.reference.name ? `(Novo ${type=="in" ? (formData.account_origin=="loans_in" ? "Investidor" : "Cliente")  : (formData.account_origin == "loans_out" ? 'Investidor' :'Fornecedor')} será adicionado) `: ''}
                                sx={{'& .MuiFormHelperText-root': {color: !formData.reference.id && formData.reference.name ? 'green' : 'crimson'}}}
                                value={formData.reference.name}  label={'Beneficiário'}
                                
                                />}
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
                                            value={formData.amount}
                                            onBlur={()=>validate_feild('amount')}
                                            onChange={(e)=>setFormData({...formData,amount:data._cn_op(e.target.value)})}
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
                                    onChange={(e)=>setFormData({...formData,paid:data._cn_op(e.target.value)})}
                                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />
                        </div>


                            <div className="flex items-center justify-center">
                            <div className="w-full">
                            <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                <DatePicker value={dayjs(formData.payday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.payday)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,payday:e.$d})} error={true} size="small" label="Data de vencimento*"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
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
                                if(!formData.repeat_details.repeat) setTimeout(()=>data._scrollToSection('repeat-payment'),100)
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
                                                onChange={(e)=>setFormData({...formData,repeat_details:{...formData.repeat_details,times:data._cn_op(e.target.value)}})}
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
                                if(!formData.pay_in_installments) setTimeout(()=>data._scrollToSection('pay_in_installments'),100)
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
                                        onChange={(e)=>setFormData({...formData,total_installments:data._cn_op(e.target.value)})}
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
                        {!id ? <label className="flex items-center cursor-pointer hover:opacity-90" onClick={()=>{
                            if(!showMoreOptions) setTimeout(()=>data._scrollToSection('_show_more_option'),100)
                            setShowMoreOptions(!showMoreOptions)
                        }}>
                            <span className={`${showMoreOptions ? ' rotate-180' :' '}`}><ExpandMoreOutlinedIcon sx={{color:'gray'}}/></span>
                            <span>Mostar mais opções</span>
                        </label> :  ''}

                      
                     </div>


                     <div id={'_show_more_options'} className={`${showMoreOptions || id ? '' :'hidden'}`}>

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
                           


                     </div>
                        
                        <DefaultUpload show={!(showMoreOptions || id)} from={`bills-to-${type}`} formData={formData} setFormData={setFormData}/>

                     <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>


                </FormLayout>

                </div>

             </>
          )
          



}
export default App

