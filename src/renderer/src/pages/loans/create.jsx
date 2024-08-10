
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../contexts/DataContext';
import {useParams,useLocation,useNavigate} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import 'dayjs/locale/en-gb';
import PouchDB from 'pouchdb';
import FormLayout from '../../layout/DefaultFormLayout';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Info } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

       function App() {
          const {_cn_op}= useData()
          const { t } = useTranslation();
          const {db} = useAuth()

          const { id } = useParams()
          const {pathname} = useLocation()
          const navigate = useNavigate()


          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update,_investors,_get,_loaded,_setRequiredData,_required_data} = useData();
          const [accountCategorieOptions, setAccountCategorieOptions] = React.useState([]);
          const account_name = React.useRef(null);
          const [availableCredit,setAvailableCredit]=React.useState([])
          const [accountCategories,setAccountCategories]=React.useState([])
          const [paymentMethodsOptions,setPaymentMethodsOptions]=React.useState([])
          const [initialized, setInitialized] = React.useState(false);
          const [loaded, setLoaded] = React.useState([]);
          const [transationAccountOptions,setTransationAccountOptions]=React.useState([])



        
          let required_data=['account_categories','payment_methods','investors','transations']


          useEffect(()=>{

            if(!id || !db.loans || formData.id==id) return 

            (async()=>{
                let item =  await db.loans.find({selector: {id}})
                item=item.docs[0]
                if(item){
                setFormData(item)
              }else{

                navigate(`/loans`)
                toast.error(t('common.item-not-found'))
              }
              
            })()

      },[db,pathname,_required_data])


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

         
          function handleLoaded(item,action){
            if(item==undefined){
               setLoaded([])
               return
            }

            if(action=='add'){
              setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
            }else{
              setLoaded((prev)=>prev.filter(i=>i!=item))
            }
        }

          const data = useData();
        
            let initial_form={
               id:'',
               total_installments:'1',
               transation_fees:'',
               description:'',
               deleted:false,
               installment_amount:0,
               reference:{name:'',id:null},
               transation_account:{name:'',id:null},
               installments:data._initial_form.transations.payments,
               payments:[{account_id:null,amount:'',name:''}],
               status:'pending',
               amount:'',
               payday:'',
               loanday:'',
               createdAt:new Date().toISOString(),
           }


           const [formData, setFormData] = React.useState(initial_form);
           const [referenceOptions,setReferenceOptions]=React.useState([])

          

          useEffect(()=>{
            if(data._loaded.includes('payment_methods')){
              handleLoaded('payment_methods','add')
            }
            setPaymentMethodsOptions([{name:t('common.add_new')},...data._payment_methods])
         },[data._payment_methods])


          let required_fields=['description','loanday','total_installments','transation_fees','account_name']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }

          useEffect(()=>{
            setReferenceOptions([{name:t('common.add_new')},..._investors])
           },[_investors])
           
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
            setAccountCategories(data._account_categories.filter(i=>i.account_origin=="loans_out"))
        },[data._account_categories])



        function add_payment_method(){
          setFormData({...formData,payments:[...formData.payments,{account_id:null,name:'',amount:''}]})
          setTimeout(()=>_scrollToSection(`payment_method${formData.payments.length - 1}`))

        }

        function remove_payment_method(index){
          setFormData({...formData,payments:formData.payments.filter((_,_i)=>_i!=index)})
        }



          function devideDate(startDate, endDate, numberOfParts,amount) {

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
    
          let item={id:uuidv4(),paid:0,status:'pending',start: partStart, end: partEnd,amount:parseFloat(amount) / numberOfParts}
          result.push(item);
    
          }

          return result;
        }

         
         useEffect(()=>{

            if(data._openDialogRes.from=="loans" && data._openDialogRes.page=="register" && (data._investors.some(i=>i.id==data._openDialogRes?.item?.id))){ 
              setFormData({...formData,reference:{name:data._openDialogRes.item.name,id:data._openDialogRes.item.id}})
              data._setOpenDialogRes({})
            }

            if(data._openDialogRes.from=="loans" && data._openDialogRes.page=="accounts" && data._account_categories.some(i=>i.id==data._openDialogRes?.item?.id)){

              if(data._openDialogRes.details.type=="loans_out"){
                setFormData({...formData,account_name:data._openDialogRes.item.name,account_id:data._openDialogRes.item.id})
                setAccountCategorieOptions(data._account_categories.filter(i=>i.account_origin=='loans_out').map(i=>i.name))
              }else{
                setFormData({...formData,transation_account:{name:data._openDialogRes.item.name,id:data._openDialogRes.item.id}})
                setTransationAccountOptions(data._account_categories.filter(i=>i.account_origin=='loans_in'))
              }

             data._setOpenDialogRes({})
            }

            if(data._openDialogRes.from=="loans" && data._openDialogRes.page=="payment_methods" && data._payment_methods.some(i=>i.id==data._openDialogRes?.item?.id)){
              setFormData({...formData,payments:formData.payments.map((i,_i)=>{
                    if(_i==data._openDialogRes.details.index){
                        return {...i,account_id:data._openDialogRes.item.id,name:data._openDialogRes.item.name}
                    }else{
                       return i
                    }
              })})

              data._setOpenDialogRes({})
           }




       },[data._openDialogRes,data._investors,data._account_categories,data._payment_methods])



        useEffect(()=>{


          if(formData.payday && formData.loanday && formData.transation_fees && (formData.payday.toString()!="Invalid Date") && (formData.loanday.toString()!="Invalid Date")){

              let parts=formData.total_installments ? parseInt(formData.total_installments) : 1
              let start
              let end

              if(typeof formData.loanday=="string"){
                  start=formData.loanday?.split('T')[0]
              }else{
                  start=formData.loanday?.toISOString().split('T')[0]
              }

              if(typeof formData.payday=="string"){
                end=formData.payday?.split('T')[0]
              }else{
                end=formData.payday?.toISOString().split('T')[0]
              }
              let result=devideDate(start,end,parts,formData.transation_fees)
              result=result.map(i=>{
                  return {...i,amount:parseFloat(formData.transation_fees),
                    status:'pending',
                    payday:i.end,
                    transation_fees:'',
                    paid:0,
                  }
              })
              setFormData({...formData,installments:result}) 
           
          }else{
              setFormData({...formData,installments:[]})
          }


  
        },[formData.payday,formData.transation_fees,formData.loanday])





        useEffect(()=>{
          if(!initialized) return

          
          let a=[]
          Array.from({ length:formData.payments.length}, () => null).forEach((_,_i)=>{

              if(!formData.payments[_i].account_id){
                  a[_i]=null
              }else{
                  let account_id=formData.payments.filter(v=>v.account_id)[_i].account_id

                  if(!account_id){
                    a[_i]={_in:0,_out:0,_available:0}
                    return 
                  } 
                  let initial_amount=data._payment_methods.filter(i=>i.id==account_id)[0].initial_amount 
                  initial_amount=initial_amount  ? parseFloat(initial_amount) : 0
                  let _in=data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                  let _out=data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                  let _available=initial_amount + _in - _out
                  a[_i]={_in,_out,_available}
              }
             
              
          })
          setAvailableCredit(a)
        },[formData.payments,initialized,data._payment_methods])



        useEffect(()=>{
         
             setTransationAccountOptions([{name:t('common.add_new')},...data._account_categories.filter(i=>i.account_origin=='loans_in')])       
          
         },[data._account_categories])

      

         async function generate_inflow(d={}){

          if(valid){
          _add('transations',[{...data._initial_form.transations,
            description:formData.description,
            type:'in',
            transation_account:{id:d.transation_account_id,name:formData.transation_account.name},
            amount:d.amount,
            loan_id:d.loan_id,
            account_origin:'loans_in',
            reference:{...formData.reference,id:d.reference_id},
            payments:formData.payments,
            id:d.transation_id}])
          }else{
            toast.error(t('common.fill-all-requied-fields'))
          }
         }
        

  
       async function generate_bill(d={}){
             if(valid){
              await  _add('bills_to_pay',[
                {...data._initial_form.bills,
                  payday:formData.payday,
                  description:formData.description,
                  account_name:formData.account_name,
                  account_id:formData.account_id,
                  account_origin:'loans_out',
                  amount:parseFloat(formData.transation_fees),
                  paid:parseFloat(formData.paid ? formData.paid : 0),
                  installments:formData.installments,
                  reference:{...formData.reference,id:d.reference_id,type:"investors"},
                  linked_id:uuidv4(),
                  index:0,
                  status:d.status,
                  loan_id:d.loan_id,
                  total_installments:parseInt(formData.total_installments ? formData.total_installments : 1),
                  id:d.bill_id}
              ])
             }else{
                 toast.error(t('common.fill-all-requied-fields'))
             }

             return
             
         }
      
          async function SubmitForm(res){

           
              if(valid){
                let reference_id=formData.reference.id
                let transation_account_id=formData.transation_account.id ? formData.transation_account.id : uuidv4()
                let bill_id=uuidv4()
                let transation_id=uuidv4()
                let form=JSON.parse(JSON.stringify(formData))
                
                let amount=formData.payments.map(i=>i.amount ? parseFloat(i.amount) : 0).reduce((acc, curr) => acc + curr, 0)
                let status=parseFloat(formData.paid ? parseFloat(formData.paid) : 0) >= parseFloat(formData.transation_fees) ? 'paid' : "pending"
      
                if(formData.reference.name && !formData.reference.id){

                    reference_id=uuidv4()
                        _add('investors',[{
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


                  if(!accountCategories.some(a=>a.id==formData.account_id)){

                     await  _add('account_categories',[{
                        id:formData.account_id,
                        name:formData.account_name,
                        type:'out',
                        description:'',
                        initial_amount:0,
                        account_origin:'loans_out',
                        deleted:false
                      }])

                   }

                   if(!formData.transation_account.id && formData.transation_account.name){

                      await  _add('account_categories',[{
                        id:transation_account_id,
                        name:formData.transation_account.name,
                        type:'in',
                        description:'',
                        initial_amount:0,
                        account_origin:'loans_in',
                        deleted:false
                      }])

                   }

                   


                   try{
                     if(id){

                      if(res=="generate_bill"){
                        await generate_bill({bill_id,reference_id,loan_id:formData.id,status})
                        form={...form,IsBillDeleted:false}
                      }  

                      if(res=="generate_inflow"){
                        await generate_inflow({reference_id,loan_id:formData.id,transation_account_id,amount,transation_id})
                        form={...form,IsInflowDeleted:false}
                      }  


                      let IsBillDeleted = res=="generate_bill" || formData.IsBillDeleted!=true ? false : true
                      let IsInflowDeleted = res=="generate_inflow" || formData.IsInflowDeleted!=true ? false : true
                      form={...form,transation_account:{...form.transation_account,id:transation_account_id}, reference:{...form.reference,id:reference_id},bill_id:res=="generate_bill" ? bill_id : form.bill_id, transation_id:res=="generate_inflow" ? transation_id : form.transation_id,IsBillDeleted,IsInflowDeleted}

                      form.status=status
                      
                      if(!formData.IsBillDeleted){
                        let bill = await db.bills_to_pay.find({selector: {loan_id:formData.id}})
                        bill=bill.docs[0]
                        bill.reference=formData.reference
                        bill.payday=formData.payday
                        bill.amount=parseFloat(formData.transation_fees)
                        bill.status=status
                        bill.account_id=formData.account_id
                        bill.account_name=formData.account_name
                        bill.total_installments=parseInt(formData.total_installments ? formData.total_installments : 1)
                        bill.installment_amount=parseFloat(formData.amount) / parseFloat(formData.total_installments ? formData.total_installments : 1)
                        await _update('bills_to_pay',[bill])
                      }

                      if(!formData.IsInflowDeleted){
                          let t = await db.transations.find({selector: {loan_id:formData.id}})
                          t=t.docs[0]
                          t.reference=form.reference
                          t.amount=amount
                          t.transation_account=form.transation_account
                          t.payments=form.payments
                          await _update('transations',[t])
                       }

                      
                        await _update('loans',[form])
                        toast.success(t('common.updated-successfully'))

                        setFormData({...form,amount})


                     }else{

                       let loan_id=uuidv4()
                 
                       _add('loans',[{
                            ...formData,
                            id:loan_id,
                            bill_id,
                            transation_id,
                            amount,
                            transation_account:{...formData.transation_account,id:transation_account_id},
                            total_installments:parseInt(formData.total_installments || 1),
                            installment_amount:parseFloat(formData.transation_fees) / parseInt(formData.total_installments || 1),
                            reference:{...formData.reference,id:reference_id}
                        }])
                            
                        

                         await generate_bill({bill_id,reference_id,loan_id,status})
                         await generate_inflow({transation_id,reference_id,loan_id,transation_account_id,amount})

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
                  if(((!formData[f]?.toString()?.length) && required_fields.includes(f))){
                      v=false
                  }
               })

               if(!formData.transation_account.name || formData.payments.some(i=>!i.amount || parseFloat(i.amount)==0) || formData.payments.some(i=>!i.account_id)) v=false

               if(!formData.payday || !formData.loanday){
                v=false
               }
               setValid(v)
          },[formData])

          
     
  return (
    <>


<FormLayout loading={!initialized || loading} maxWidth={'700px'} name={id ? t('common.update') : t('common.new')} formTitle={id ? t('common.update') : t('common.add-new_')}  topLeftContent={(
                  <>
                    
                  </>
)}>

             
<FormLayout.Cards topInfo={[
                          {name:t('common.value-of-each-installment'),value:(parseFloat(formData.transation_fees ? formData.transation_fees : 0) / parseInt(formData.total_installments ? formData.total_installments :  1)).toFixed(2)},
              ]}/>


              <div className="flex flex-col p-4">
                {(formData.IsBillDeleted && (parseFloat(formData.paid || 0) < parseFloat(formData.transation_fees))) && <div className="mb-2"><span className="text-gray-400 font-light"><Info sx={{width:20,marginRight:1}}/>{t('messages.outflow-entry-deleted')}</span><span  onClick={()=>SubmitForm('generate_bill')} className="underline ml-2 text-app_orange-400 cursor-pointer hover:opacity-70">{t('common.re-create')}</span></div>}
                {(formData.IsInflowDeleted && (parseFloat(formData.paid || 0) < parseFloat(formData.transation_fees))) && <div><span className="text-gray-400 font-light"><Info sx={{width:20,marginRight:1}}/>{t('messages.inflow-transaction-deleted')}</span><span  onClick={()=>SubmitForm('generate_inflow')} className="underline ml-2 text-app_orange-400 cursor-pointer hover:opacity-70">{t('common.re-create')}</span></div>}
              </div>

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
                                  helperText={(!formData.description) && verifiedInputs.includes('description') ? "Insira a descrição" :''}
                              
                          />
                  </div>



                  <div className="-translate-y-0">
                                    <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                        <DatePicker  value={dayjs(formData.loanday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.loanday)) : null} onChange={(e)=>setFormData({...formData,loanday:e.$d})}  label={t('common.finaciated-day')}  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            />
                                    </LocalizationProvider>
                  </div>


                  <div className="-translate-y-0">
                                    <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                        <DatePicker disabled={Boolean(formData.IsBillDeleted)}  value={dayjs(formData.payday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.payday)) : null} onChange={(e)=>setFormData({...formData,payday:e.$d})}  label={t('common.due-date')}  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            />
                                    </LocalizationProvider>
                  </div>




                      <div className="hidden">

                         <TextField
                            id="outlined-textarea"
                            label={t('common.loan-amount')}
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

                         <div>

                          <TextField
                              id="outlined-textarea"
                              label="Valor de Juros a Pagar *"
                              placeholder={t('common.type-amount')}
                              multiline
                              value={formData.transation_fees}
                              helperText={(!formData.transation_fees) && verifiedInputs.includes('transation_fees') ? t('common.required-field') :''}
                              onBlur={()=>validate_feild('transation_fees')}
                              error={(!formData.transation_fees) && verifiedInputs.includes('transation_fees') ? true : false}
                              onChange={(e)=>setFormData({...formData,transation_fees:_cn_op(e.target.value)})}
                              sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                              '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                              />

                          </div>

                   <div>
                              <TextField
                              id="outlined-textarea"
                              label={t('common.numbers-of-installments')}
                              placeholder={t('common.type-the-number')}
                              multiline
                              value={formData.total_installments}
                              onBlur={()=>validate_feild('total_installents')}
                              onChange={(e)=>setFormData({...formData,total_installments:data._cn_n(e.target.value)})}
                              error={(!formData.total_installments) && verifiedInputs.includes('total_installments') ? true : false}
                              helperText={!formData.total_installments && verifiedInputs.includes('total_installments') ? "Campo obrigatório" :''}
                              sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                              '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                              />
                      </div>

                    <div className="relative"> 
                               
                              <Autocomplete size="small"
                              value={formData.reference.name ? formData.reference.name : null}
                              onChange={(event, newValue) => {
                                  
                                  if(newValue==t('common.add_new')){
                                    data._showCreatePopUp('register','loans',{[`investor`]:true})
                                   }else{
                                    newValue=newValue ? newValue : ''
                                    let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                                    setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                               
                                  }

                              }}
                              noOptionsText={t('common.no-options')}
                              defaultValue={null}
                              inputValue={formData.reference.name}
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
                              renderInput={(params) => <TextField {...params}
                              onBlur={()=>validate_feild('reference')}
                              helperText={formData.reference.name && !formData.reference.id ? `(${t('common.new')} ${t('common.investor')} ${t('common.will-be-added')})` :''}
                              sx={{'& .MuiFormHelperText-root': {color:formData.reference.name && !formData.reference.id ? 'green' : 'crimson'}}}
                              value={formData.reference.name}  label={t('common.investor')}
                              
                              />}
                              />   
                   </div>


                  

                  <div className="relative">
                 

                 <Autocomplete size="small"
                    value={formData.transation_account.name ? formData.transation_account.name : null}
                    onChange={(event, newValue) => {
                      if(newValue==t('common.add_new')){
                        data._showCreatePopUp('accounts','loans',{type:"loans_in",account_origin:'loans_in'})
                      }else{
                        newValue=newValue ? newValue : ''
                        let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                        setFormData({...formData,transation_account:{...formData.transation_account,name:newValue,id:_id}})
                      
                      }
                    }}
                    noOptionsText="Sem opções"
                    defaultValue={null}
                    ref={account_name}
                    inputValue={formData.transation_account.name}
                    onInputChange={(event, newInputValue) => {
                           
                      if(newInputValue!=t('common.add_new')){
                        newInputValue=newInputValue ? newInputValue : ''
                       let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                       setFormData({...formData,transation_account:{...formData.transation_account,name:newInputValue,id:_id}})
                        
                      }

                    }}
                    onBlur={()=>{
                     
                      validate_feild('transation_account')
                     }}

                    id="_transation_acco"
                    options={transationAccountOptions.map(i=>i.name)}
                    disabled={false}
                    renderInput={(params) => <TextField {...params}
                    error={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? true : false}             
                    helperText={!formData.transation_account.id  && formData.transation_account.name ? `(${t('common.new_')} ${t('common.account')} ${t('common.will-be-added')})` :''}
                    sx={{'& .MuiFormHelperText-root': {color:!formData.transation_account.id  && formData.transation_account.name ? 'green' : 'crimson'}}} 
                    value={formData.transation_account.name} label={t('common.inflow-account')} />}
              
                    />   
                   </div>

                   <div className=" relative">


                  <Autocomplete size="small"
                      value={formData.account_name ? formData.account_name : null}
                      onChange={(event, newValue) => {
                        if(newValue==t('common.add_new')){
                          data._showCreatePopUp('accounts','loans',{type:"loans_out",account_origin:'loans_out'})
                        }else{
                          setFormData({...formData,account_name:newValue})
                        }
                      }}
                      noOptionsText="Não encotrado"
                      ref={account_name}
                      onBlur={()=>{
                     
                        validate_feild('account')
                       }}
                      defaultValue={null}
                      inputValue={formData.account_name}
                      onInputChange={(event, newInputValue) => {
                        if(newInputValue!=t('common.add_new')){
                          setFormData({...formData,account_name:newInputValue})
                        }
                      }}
                      id="controllable-states-demo"
                      options={accountCategorieOptions}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params}
                      error={(!formData.account_name) && verifiedInputs.includes('account') ? true : false}             
                      helperText={!accountCategories.some(a=>a.id==formData.account_id) && formData.account_name ? `(${t('common.new_')} ${t('common.account')} ${t('common.will-be-added')})` :''}
                      sx={{'& .MuiFormHelperText-root': {color:!accountCategories.some(a=>a.id==formData.account_id) && formData.account_name ? 'green' : 'crimson'}}}
                      value={formData.account_name} label={t('common.outflow-account')} />}
                  />   
                  </div>

                   

                   

                  </FormLayout.Section>


                  <span className="flex border-b mb-6"></span>

                    {formData.payments.map((i,_i)=>(


                    <FormLayout.Section style={{margin:0,paddingBottom:0,paddingTop:0}}>

                    <div className="flex relative" id={'payment_method'+_i}>
                      {formData.payments.length!=1 && <span onClick={()=>remove_payment_method(_i)} className="mr-2 translate-y-2 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="21" fill="gray"><path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path></svg></span>
                      } 


                        {availableCredit[_i] && <div className="text-[13px] absolute right-[30px] top-0 translate-y-[-100%] flex items-center">
                            <span className='text-[12px] text-gray-500'>{t('common.balance')}: </span>  <span className={`${availableCredit[_i]._available < 0 ?'text-red-600':''}`}>{data._cn(availableCredit[_i]._available)}</span>
                      </div>}  

                      

                      <Autocomplete size="small"
                        value={i.name ? i.name : null}
                        onChange={(_, newValue) => {
                          if(newValue==t('common.add_new')){
                            data._showCreatePopUp('payment_methods','loans',{index:_i})
                            
                          }else{

                            newValue=newValue ? newValue : ''
                            let _id=paymentMethodsOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                return _f!=_i ? f : {...f,account_id:_id,name:newValue}
                            })})

                          }

                         
                        }}
                        noOptionsText="Sem opções"
                        defaultValue={null}
                        inputValue={i.name}
                        onInputChange={(event, newInputValue) => {
                          if(newInputValue==t('common.add_new')){
                            newInputValue=i.name
                          }
                          newInputValue=newInputValue ? newInputValue : ''
                          let _id=paymentMethodsOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                          setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                              return _f!=_i ? f : {...f,account_id:_id,name:newInputValue}
                          })})
                      }}
                      onBlur={()=>{
                        if(!formData.payments[_i].account_id){
                            setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                              return _f!=_i ? f : {...f,account_id:null,name:''}
                            })})
                        }
                        validate_feild('payment_method'+_i)
                      }}
                      id="_transation_account"
                      options={paymentMethodsOptions.filter(f=>!formData.payments.some(j=>j.account_id==f.id) || f.name==t('common.add_new')).map(i=>i.name)}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params}
                      
                      helperText={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? t('common.required-field') :''}
                      error={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? true : false}             
                      value={formData.payments[_i].account_id} label={t('common.payment-method')} />}

                    />   
                      </div>

                      <div>
                              <TextField
                                id="outlined-textarea"
                                label={t('common.loan-amount')}
                                placeholder={t('common.type-amount')}
                                multilinep
                                value={i.amount}
                                helperText={!i.amount && verifiedInputs.includes('amount') ? t('common.required-field') :''}
                                onBlur={()=>validate_feild('amount'+_i)}
                                error={(!i.amount) && verifiedInputs.includes('amount'+_i) ? true : false}
                                onChange={(e)=>{
                                  setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                    return _f!=_i ? f : {...f,amount:data._cn_op(e.target.value)}
                                  })})
                                }}
                              
                                sx={{width:'100%',maxWidth:'200px','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                />
                    </div>
                      
                    </FormLayout.Section>

                    ))}

                    <div onClick={add_payment_method} className="ml-4 border cursor-pointer hover:opacity-80 hover:ring-1 ring-slate-400 table rounded-[5px] bg-gray-100 px-2 py-1"><AddIcon sx={{color:'#374151',width:20}}/><span className=" text-gray-700">{t('common.add-payment-method')}</span></div>

              <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>

             

           
        </FormLayout>
    </>
  )
}
export default App

