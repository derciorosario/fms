
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { Autocomplete, Button, Radio} from '@mui/material';
import 'dayjs/locale/en-gb';
import PouchDB from 'pouchdb';
import {useLocation,useNavigate } from 'react-router-dom';
import FormLayout from '../../../layout/DefaultFormLayout';
import AddIcon from '@mui/icons-material/Add';
import TransationNextDate from '../../../components/Dialogs/transationNextDate'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import DefaultUpload from '../../../components/Files/default-upload';

       function App() {
       
         const {t} = useTranslation()
        

          let {pathname} = useLocation()

          const mapFunction = function (doc) {
            if (doc.company_id) {
              emit(doc.company_id, null);
            }
          };

          
          let required_data=['bills_to_pay','account_categories','bills_to_receive','payment_methods','clients','investors','suppliers','transations']

          
          const {_account_categories,_get,_clients,_suppliers,_investors,_payment_methods,_bills_to_pay,_bills_to_receive,_transations,_categories,_scrollToSection,_initial_form,_cn_n,_cn,_openDialogRes,_setOpenDialogRes,_required_data}= useData()
          const data = useData()
          const {user,db} = useAuth()
          const { id } = useParams()

        

          const navigate = useNavigate()

          const [searchParams, setSearchParams] = useSearchParams();

          const [loaded, setLoaded] = React.useState([]);
          const [loading, setLoading] = React.useState(false);
          const [initialized, seTinitialized] = React.useState(false);
          const [refreshAvailableCredit,setRefreshAvailableCredit]=React.useState(uuidv4());


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

          const [type, setType] = React.useState(pathname.includes('inflow') ? 'in' : 'out');
         

        //  console.log(_transations)

          const [bill,setBill]=React.useState({id:null,from:null})

          useEffect(()=>{

                
                let res=data._sendFilter(searchParams)

                if(!id && !res.bill_to_pay && !res.bill_to_receive) {
                  setBill(null)
                  handleLoaded('bill','add')
                  handleLoaded('form','add')
                  return 
                }

               
                (async()=>{

                      
                      if(id){

                          if(!db.transations || !id || formData.id==id) return
                         
                          if(!data._loaded.includes('transations')){
                             return
                          }

                          let item =  await db.transations.find({selector: {id}})
                          item=item.docs[0]

                          if(item){
                              setFormData({...item,
                                paid:item.paid ? item.paid : '',
                                files:item.files[0] ? [{...item.files[0],checked:item.files[0].local ? false : true}] : []
                              })
                          }else{
                              navigate(`/cash-management/${type}flow`)
                              toast.error(t('common.item-not-found'))
                          }

                          handleLoaded('form','add')

                      }else{

                        if(!db[res.bill_to_pay ? 'bills_to_pay' : 'bills_to_receive']) return

                        let bill=await db[res.bill_to_pay ? 'bills_to_pay' : 'bills_to_receive'].find({selector: {id:res.bill_to_pay || res.bill_to_receive}})
                        bill=bill.docs[0]
                        setBill({...bill,from:res.bill_to_pay ? 'bills_to_pay' : 'bills_to_receive'})
                        handleLoaded('bill','add')

                      }
                })()

          },[pathname,data._loaded,data._required_data])

          useEffect(()=>{
            data._setRequiredData(required_data)
           },[])

          useEffect(()=>{
             _get(required_data.filter(i=>!data._loaded.includes(i)))
          },[db])


          useEffect(()=>{
           
                 setType(pathname.includes('inflow') ? 'in' : 'out')
                 setVerifiedInputs([])

             
          },[pathname,user])


          
          const [valid, setValid] = React.useState(false);
          const {_add,_update} = useData();
          const [referenceOptions,setReferenceOptions]=React.useState([])
          const [transationAccountOptions,setTransationAccountOptions]=React.useState([])
          const [paymentMethodsOptions,setPaymentMethodsOptions]=React.useState([])
          const [accountOptions,setAccountOptions]=React.useState([])
          const [accountDetails,setAccountDetails]=React.useState({})
          const [availableCredit,setAvailableCredit]=React.useState([])
          const [showNextPaymentDialog,setShowNextPaymentDialog]=React.useState(false)
         
          const [showMoreOptions,setShowMoreOptions]=React.useState(false)
          const [formData, setFormData] = React.useState(_initial_form.transations);


          useEffect(()=>{

           if(_categories.length && accountOptions.length && transationAccountOptions.length && bill?.id && !formData.account.id){
               
              if((bill?.from=="bills_to_pay" && data._loaded.includes('suppliers') || bill?.from=="bills_to_receive" && data._loaded.includes('clients')) && data._loaded.includes('investors') ){
                let subname=bill.repeat_details.times >= 2 ? `[${bill.index + 1}/${bill.repeat_details.times}] ${bill.description}` : bill.description
                setFormData({...formData,link_payment:true,account:{id:bill?.id,name:subname}})
              }
           }

         },[transationAccountOptions,accountOptions,_categories,_suppliers,_clients,_investors])



         useEffect(()=>{


            if(loaded.length>=6){
                       seTinitialized(true)
            }else{
                       seTinitialized(false)
            }


        },[loaded])

        useEffect(()=>{
          
   
          if(_openDialogRes.from=="transations" && _openDialogRes.page=="payment_methods" && _payment_methods.some(i=>i.id==_openDialogRes?.item?.id)){
            setFormData({...formData,payments:formData.payments.map((i,_i)=>{
                  if(_i==_openDialogRes.details.index){
                      return {...i,account_id:_openDialogRes.item.id,name:_openDialogRes.item.name}
                  }else{
                     return i
                  }
            })})

            _setOpenDialogRes({})
         }

         if(_openDialogRes.from=="transations" && _openDialogRes.page=="accounts" && _account_categories.some(i=>i.id==_openDialogRes?.item?.id)){
          
          setFormData({...formData,account_origin:_openDialogRes.item.account_origin,transation_account:{name:_openDialogRes.item.name,id:_openDialogRes.item.id}})
          setTransationAccountOptions(_account_categories.filter(i=>i.account_origin==_openDialogRes.account_origin))
        

          _setOpenDialogRes({})
       }

       if(_openDialogRes.from=="transations" && _openDialogRes.page=="register" && (_clients.some(i=>i.id==_openDialogRes?.item?.id) ||  _suppliers.some(i=>i.id==_openDialogRes?.item?.id) ||  _investors.some(i=>i.id==_openDialogRes?.item?.id))){
          
        setFormData({...formData,reference:{name:_openDialogRes.item.name,id:_openDialogRes.item.id}})
        

        _setOpenDialogRes({})
     }

      },[_openDialogRes,_payment_methods,_account_categories,_investors,_clients,_suppliers])


      useEffect(()=>{
            setFormData(prev=>({...prev,type}))
      },[pathname])



      console.log({formData})
       

         


          
         

          useEffect(()=>{

             if(data._loaded.includes('payment_methods')){
                   handleLoaded('payment_methods','add')
             }
              
             setPaymentMethodsOptions([{name:t('common.add_new')},..._payment_methods])

          },[_payment_methods])

 


          let required_fields=['description','account_origin']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }

          useEffect(()=>{
            if(formData.account_origin=="loans_out" || formData.account_origin=="loans_in"){
               
              if(!_investors.some(i=>i.id==referenceOptions[0]?.reference?.id))  setReferenceOptions([{name:t('common.add_new')},..._investors])

            }else if(type=="in"){
               if(!_clients.some(i=>i.id==referenceOptions[0]?.reference?.id)) setReferenceOptions([{name:t('common.add_new')},..._clients])
            }else{
              if(!_suppliers.some(i=>i.id==referenceOptions[0]?.reference?.id)) setReferenceOptions([{name:t('common.add_new')},..._suppliers])
            }

            if(data._loaded.includes('investors')) handleLoaded('investors','add')
            if(data._loaded.includes('clients')) handleLoaded('clients','add')
            if(data._loaded.includes('suppliers')) handleLoaded('suppliers','add')
              
           

           },[formData.reference,_suppliers,_investors,_clients,formData.account_origin])


           useEffect(()=>{
               let from={
                  in: _bills_to_receive,
                  out:_bills_to_pay
               }
               setAccountOptions(from[type].filter(i=>i.status!="paid" || i.id==formData.account.id).map(i=>{
                    let subname=i.repeat_details.times >= 2 ? `[${i.index + 1}/${i.repeat_details.times}] ${i.description}` : i.description
                    return {...i,id:i.id,subname} 

               }))

               if(data._loaded.includes('bills_to_pay') && data._loaded.includes('bills_to_receive') && !loaded.includes('account-options')) handleLoaded('account-options','add')
           },[_bills_to_pay,_bills_to_receive,formData.type,formData.id,pathname,loaded])


           useEffect(()=>{

             if(!initialized) return
             
                 if(formData.account.id && formData.link_payment){
                     let account=accountOptions.filter(i=>i.id==formData.account.id)[0]
                     setAccountDetails(account)
                     setTransationAccountOptions([{name:t('common.add_new')},..._account_categories.filter(i=>i.account_origin==account.account_origin)])
                     setFormData({...formData,
                     loan_id:account.loan_id,
                     payments:formData.payments.length==1 && !formData.payments[0].amount ? [{...formData.payments[0],amount:parseFloat(account.amount) - parseFloat(account.paid ? account.paid : 0)}] : formData.payments,
                     account_origin:account.account_origin,
                     invoice_number:formData.invoice_number ? formData.invoice_number : account.invoice_number,
                     invoice_emission_date:formData.invoice_emission_date ? formData.invoice_emission_date : account.invoice_emission_date,
                     reference:{id:account.reference.id,name:account.reference.name}
                     }) 
                 }else{ 
                     setAccountDetails({})

                 }   
           },[formData.account.id,initialized,refreshAvailableCredit])





           useEffect(()=>{
              if(formData.account_origin){
                setTransationAccountOptions([{name:t('common.add_new')},..._account_categories.filter(i=>i.account_origin==formData.account_origin && i.type==type)])       
              }else{
                setTransationAccountOptions([{name:t('common.add_new')},..._account_categories.filter(i=>i.type==type)])     
              }
            

           },[_account_categories,formData.account_origin])

           
         

           



           useEffect(()=>{

              if(formData.transation_account.id){
                let account_origin=transationAccountOptions.filter(i=>i.id==formData.transation_account.id)[0]?.account_origin
                if(account_origin) setFormData({...formData,account_origin})
              }
            

           },[formData.transation_account])


           useEffect(()=>{
               

              if(formData.transation_account.id){
                  
                  let account_origin=transationAccountOptions.filter(i=>i.id==formData.transation_account.id)[0]?.account_origin
                  if(account_origin!=formData.account_origin && account_origin){
                      setFormData({...formData,transation_account:{id:null,name:''}})
                  }

              }
         

          },[_account_categories,formData.account_origin])



           useEffect(()=>{

                 if(!accountDetails.id)  return

                 if(_account_categories.filter(i=>i.id==accountDetails.account_id)[0]?.account_origin==formData.account_origin){
                     let _a=_account_categories.filter(i=>i.id==accountDetails.account_id)[0]
                     setFormData({...formData,transation_account:{id:accountDetails.account_id,name:_a.name}})
                 }
                
                  
        },[transationAccountOptions])




          useEffect(()=>{
            if(!initialized) return
            if(formData.transation_account.id){
             }else{
              setAvailableCredit(0)
            } 

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
                    let initial_amount=_payment_methods.filter(i=>i.id==account_id)[0].initial_amount
                    initial_amount=!initial_amount ? 0   : parseFloat(initial_amount) 
                    let _in=_transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                    let _out=_transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                    let _available=initial_amount + _in - _out
                    a[_i]={_in,_out,_available}
                }
               
                
            })
            setAvailableCredit(a)
          },[formData.payments,initialized,_payment_methods,refreshAvailableCredit])





         async function SubmitForm(ignore_next_payday){

              let amount=formData.payments.map(i=>i.amount ? parseFloat(i.amount) : 0).reduce((acc, curr) => acc + curr, 0)
              let fees=formData.has_fees ? parseFloat(formData.fine) : 0
              let left=parseFloat(accountDetails.paid) > parseFloat(accountDetails.amount) ? 0 :parseFloat(accountDetails.amount ? accountDetails.amount : 0) - parseFloat(accountDetails.paid ? accountDetails.paid : 0)

              if(!formData.next_payday &&  (amount + fees) < left && formData.link_payment && !ignore_next_payday){
                 if(new Date(accountDetails.payday.split('T')[0]).getTime() < new Date(data._today()).getTime()){
                    setShowNextPaymentDialog(true)
                    setFormData({...formData,next_payday:null})
                    return
                 }
              }

              setShowNextPaymentDialog(false)


             
              if(valid){


                let reference_id=formData.reference.id
                       
                if(formData.reference.name && !formData.reference.id && (formData.reference.type=="supplier" || formData.reference.type=="client")){
                  reference_id=uuidv4()
                  _add(formData.reference.type+'s',[{
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

                let transation_account_id=formData.transation_account.id
                if(formData.transation_account.name && !formData.transation_account.id){
                  transation_account_id=uuidv4()
                   _add('accounts',[{
                    id:transation_account_id,
                    name:formData.transation_account.name,
                    description:'',
                    deleted:false
                 }])
               }




               




                   
                   try{

                     if(id){

                       
                       
                          if(formData.link_payment){
                            let last=await db.transations.get(formData._id)
                            let fees=formData.fees ? parseFloat(formData.fees) : 0
                            fees=fees - parseFloat(last.fees ? last.fees : 0)
                            let current_amount=formData.payments.map(i=>i.amount ? parseFloat(i.amount): 0).reduce((acc, curr) => acc + curr, 0)
                            let account=JSON.parse(JSON.stringify(accountDetails))
                            account.paid=parseFloat(account.paid) - parseFloat(last.amount) + current_amount
                            account.fees=parseFloat(account.fees ? account.fees : 0) - fees
                            if(!account.paid) account.paid=""
                            if(parseFloat(accountDetails.amount) > amount + fees) {
                                account.status="pending"
                            }else{
                                account.status="paid"
                            }
                           
                            
                           
                            await _update(`bills_to_${type=="in"?"receive":"pay"}`,[{...account,fees,paid:amount + fees}])

                           
                            if(formData.loan_id){
                               let loan = await db.loans.find({selector: {id:formData.loan_id}})
                               loan=loan.docs[0]

                              if(loan){

                                loan.paid=paid + fees
                                loan.fees=fees
                                loan.status=account.status
                                await _update('loans',[loan])

                              }
                              
                            }

                          }



                          if(formData.loan_id && type=="in"){
                            let loan = await db.loans.find({selector: {id:formData.loan_id}})
                            loan=loan.docs[0]

                            if(loan){
                              loan.amount=amount
                              loan.transation_account=formData.transation_account
                              loan.payments=formData.payments
                              await _update('loans',[loan])

                            }
                           
                          }
                        
                        
                           await _update('transations',[{...formData,amount}])
                           setRefreshAvailableCredit(uuidv4())
                           toast.success(t('common.transation-updated'))
                     }else{
                       
                     _add('transations',[{...formData,
                      reference:{...formData.reference,id:reference_id,type:formData.account_origin=="loans_out" || formData.account_origin=="loans_in" ? 'investors' : type=="receive" ? 'clients': 'suppliers' },
                      transation_account:{...formData.transation_account,id:transation_account_id},
                      amount:amount + fees,
                      type,
                      fees,
                      id:uuidv4()}])

                     

                      setAccountDetails({})
                      setBill(null)
                      setVerifiedInputs([])

                      toast.success(t('common.transation-added'))
                      setFormData(_initial_form.transations)


                      if(formData.link_payment){
                        let paid=parseFloat(accountDetails.paid ? accountDetails.paid : 0) + amount +  fees
                        let _fees=parseFloat(accountDetails.fees ? accountDetails.fees : 0) + fees
                        let status=parseFloat(accountDetails.paid ? accountDetails.paid : 0) + amount + fees >= parseFloat(accountDetails.amount) ? 'paid' : accountDetails.status
                       _update(formData.type=='in' ? 'bills_to_receive': 'bills_to_pay',[{...accountDetails,
                             payday:formData.next_payday && !ignore_next_payday ? formData.next_payday : accountDetails.payday,
                             paid,
                             fees:_fees,
                             status
                        }])

                        if(formData.loan_id){
                          let loan = await db.loans.find({selector: {id:formData.loan_id}})
                          loan=loan.docs[0]
                          if(loan){
                            loan.paid=paid
                            loan.fees=_fees
                            loan.status=status
                            await _update('loans',[loan])
                          }
                        }
                      }
                      

                     }

                      try{
                        await data.store_uploaded_file_info(formData.files[0])
                      }catch(e){
                        console.log({e})
                      }
                 }catch(e){
                        console.log(e)
                        toast.error(t('common.unexpected-error'))
                 }

                 data._updateFilters({bill_to_pay:'',bill_to_receive:''},setSearchParams)
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

               if(formData.payments.some(i=>!i.amount || parseFloat(i.amount)==0) || formData.payments.some(i=>!i.account_id)) v=false

               if(formData.link_payment && !formData.account.id || !formData.transation_account.name) v=false

               if(formData.has_fees && !formData.fine) v=false
               setValid(v)
          },[formData])


          function add_payment_method(){
                setFormData({...formData,payments:[...formData.payments,{account_id:null,name:'',amount:''}]})
                setTimeout(()=>_scrollToSection(`payment_method${formData.payments.length - 1}`))

          }

          function remove_payment_method(index){
            setFormData({...formData,payments:formData.payments.filter((_,_i)=>_i!=index)})
          }



        

          

      
  return (
    <>
       {showNextPaymentDialog &&  <TransationNextDate last_date={accountDetails.payday?.split('T')?.[0]} show={showNextPaymentDialog} setShow={setShowNextPaymentDialog} SubmitForm={SubmitForm} formData={formData} setFormData={setFormData}/>}
       <FormLayout loading={!initialized || loading} name={type == 'in' ? t('common.inflow') : t('common.outflow')} formTitle={id ? t('common.update') : t('common.add')+(type == 'in' ? '' : '')}>


                 <div className="ml-5 flex items-center mb-3">
                    <span className="border-l-2 pl-1 text-gray-300 mr-3">{!id ? t('common.new_') : t('common.add') } {  (type=="in" ?  t('common.inflow') :t('common.outflow')).toLocaleLowerCase()}</span>
                    <button onClick={(e)=>{
                                data._updateFilters({bill_to_pay:'',bill_to_receive:''},setSearchParams)
                                setFormData(_initial_form.transations)
                                handleLoaded()
                                navigate(`/cash-management/${type == "in" ? "out" : "in"}flow/create`)
                              }} className={`flex bg-gray-400 hover:opacity-80 focus:outline-none text-white  border-b font-medium  rounded-[0.3rem] text-[13px] px-3 py-[6px] text-center`}>
                          {type=="out" ? t('common.add-inflow'):t('common.add-outflow')}
                    </button>
                 </div>
                
                {(!id && bill==null) && <div className={`${(!initialized || loading) ?' pointer-events-none':''} hidden  flex ml-2 mb-2`}>
                   <label className="cursor-pointer">
                      <Radio
                          checked={type=="in"}
                          inputProps={{ 'aria-label': 'controlled' }}
                          onChange={(e)=>{
                             data._updateFilters({bill_to_pay:'',bill_to_receive:''},setSearchParams)
                             setFormData(_initial_form.transations)
                             navigate('/cash-management/inflow/create')
                          }}
                      />


                      <span className=" text-gray-500">{t('common.inflow')}</span>
                   </label>

                   <label className="ml-2 cursor-pointer">
                      <Radio
                         checked={type=="out"}
                         inputProps={{ 'aria-label': 'controlled' }}
                         onChange={(e)=>{
                            data._updateFilters({bill_to_pay:'',bill_to_receive:''},setSearchParams)
                            
                            setFormData(_initial_form.transations)
                            navigate('/cash-management/outflow/create')
                         }}
                      />
                      <span className=" text-gray-500">{t('common.outflow')}</span>
                   </label>
                </div>}


                <FormLayout.Cards topInfo={[
                      {name:t('common.missing'),value:parseFloat(accountDetails.paid) > parseFloat(accountDetails.amount) ? 0 :_cn(parseFloat(accountDetails.amount ? accountDetails.amount : 0) - parseFloat(accountDetails.paid ? accountDetails.paid : 0))},
                      {name:type=="in" ? t('common.received') : t('common.paid'),value:_cn(accountDetails.paid ? parseFloat(accountDetails.paid) : 0)},
                      {name:'Total',value:_cn(!accountDetails.amount ? 0 : parseFloat(accountDetails.amount))},
                  ].filter(i=>formData.account.id && !i.id || i.id).filter(i=>formData.transation_account.id && i.id || !i.id)}/>



               <div className={`${!initialized ?'pointer-events-none':''}`}>

              
                
                {!id && <div className="flex px-[6px] items-center mt-3" id="add-bill-account">
                   <label className="flex items-center cursor-pointer hover:opacity-90">
                    <Switch
                    disabled={accountOptions.length && !id ? false : true}
                    checked={formData.link_payment}

                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(e)=>{
                     setFormData({...formData,link_payment:e.target.checked,account:{id:null,name:''}})
                    }}
                    />
                    <span className={`${!accountOptions.length ? 'opacity-80' :''}`}>{type == 'in' ? t('common.select-agended-bill-to-receive') : t('common.select-agended-bill-to-pay')}  {(accountOptions.length==0 && !id && initialized) && <label className="text-[14px]">({t('common.none-available')})</label>}</span>
                   </label>
               </div>
}


               <div className={`${formData.link_payment ? 'flex' :'hidden'}`}>   
               
               <FormLayout.Section>

               <div>
                       
                       <Autocomplete size="small"
                          value={formData.account.name ? formData.account.name : null}
                          onChange={(event, newValue) => {
                            newValue=newValue ? newValue : ''
                            let _id=accountOptions.filter(i=>i.subname?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,account:{...formData.account,name:newValue,id:_id}})
                          
                          }}
                          noOptionsText={t('common.no-options')}
                          defaultValue={null}
                          inputValue={formData.account.name}
                          onInputChange={(event, newInputValue) => {
                             newInputValue=newInputValue ? newInputValue : ''
                              let _id=accountOptions.filter(i=>i.subname?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                              setFormData({...formData,account:{...formData.account,name:newInputValue,id:_id}})
                            
                          }}
      
                          onBlur={()=>{
                               if(!formData.account.id){
                                   setFormData({...formData,account:{...formData.account,name:''},reference:{...formData.reference,name:'',id:null}})
                               }
                               validate_feild('account')
                          }}
                          id="_transation_account"
                          options={accountOptions.map(i=>i.subname)}
                          sx={{ width: 300 }}
                          disabled={id}
                          renderInput={(params) => <TextField  {...params}
                          helperText={(!formData.account.id) && verifiedInputs.includes('account') && formData.link_payment ? t('common.required-field') : ''}
                          error={(!formData.account.id) && formData.link_payment && verifiedInputs.includes('account') ? true : false}             
                           value={formData.account.name} label={type == 'in' ? t('common.bill-to-receive') : t('common.bill-to-pay')} />}
                      />   
                       </div>

                </FormLayout.Section>

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
                        helperText={(!formData.description) && verifiedInputs.includes('description') ? t('common.required-field') : ''}
                    
                        />
                </div>


               <div>
  
                 
                 <div className="flex flex-col">
                 <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">
                     <InputLabel htmlFor="grouped-select"
                       error={(!formData.account_origin) && verifiedInputs.includes('account_origin') ? true : false}             
                     
                     >{t('common.category')}</InputLabel>
                     <Select 
                        disabled={formData.loan_id || accountDetails.loan_id ? true : false}
                        onBlur={()=>validate_feild('account_origin')}
                        
                        defaultValue="" id="grouped-select"
                        value={formData.account_origin}
                        label={t('common.category')}
                        onChange={(e)=>{
                          setFormData({...formData,account_origin:e.target.value,reference: ((e.target.value=="loans_in" || !e.target.value || (e.target.value!="loans_in" && formData.account_origin=="loans_in")))          ||         (e.target.value=="loans_out" || !e.target.value || ((e.target.value!="loans_out" && formData.account_origin=="loans_out"))) ? {id:null,name:null} : formData.reference})
                        }}
                               
                     >
                     
                   
                        <MenuItem value="">
                           <em>{t('')}</em>
                        </MenuItem>
                              {_categories.filter(i=>i.type=="in" && !i.disabled).map(i=>(
                                      <MenuItem value={i.field} sx={{display:type == 'in' ? 'flex' : 'none'}} key={i.field} sty><span className=" w-[7px] rounded-full h-[7px] bg-[#16a34a] inline-block mr-2"></span> <span>{t(`categories.${i.field}`)}</span></MenuItem>
                              ))}


                             {_categories.filter(i=>i.type=="out" && !i.disabled).map(i=>(
                                <MenuItem value={i.field} sx={{display:type == 'out' ? 'flex' : 'none'}} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-red-500 inline-block mr-2"></span> <span>{t(`categories.${i.field}`)}</span></MenuItem>
                             ))}


                        
                     </Select>
                     </FormControl>
                 </div>

                  {(accountDetails.id && accountDetails.account_origin!=formData.account_origin)  && <span className="opacity-70 text-orange-400 text-[13px] ml-3">{t(`common.changed-from`)} ({_categories.filter(i=>i.field==accountDetails.account_origin)[0].name})</span>}



               </div>

                 

                  <div className="relative">
                 

                 <Autocomplete size="small"
                    value={formData.transation_account.name ? formData.transation_account.name : null}
                    onChange={(event, newValue) => {
                      if(newValue==t('common.add_new')){
                        data._showCreatePopUp('accounts','transations',{account_origin:formData.account_origin,type:formData.loan_id && type=="in"  ? "loans_in" : formData.loan_id && type=="out" || accountDetails.loan_id  ? "loans_out" : type})
                      }else{
                        newValue=newValue ? newValue : ''
                        let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                        setFormData({...formData,transation_account:{...formData.transation_account,name:newValue,id:_id}})
                      
                      }
                    }}
                    noOptionsText={t('common.no-options')}
                    defaultValue={null}
                    inputValue={formData.transation_account.name}
                    onInputChange={(event, newInputValue) => {
                           
                      if(!newInputValue==t('common.add_new')){
                        newInputValue=newInputValue ? newInputValue : ''
                       let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                       setFormData({...formData,transation_account:{...formData.transation_account,name:newInputValue,id:_id}})
                        
                      }

                    }}
                    onBlur={()=>{
                     
                      if(!formData.transation_account.id){
                          setFormData({...formData,transation_account:{id:null,name:''}})
                      }
                      validate_feild('transation_account')
                     }}

                    id="_transation_account"
                    options={transationAccountOptions.map(i=>i.name)}
                    sx={{ width: 300,'& .MuiFormHelperText-root':{color:accountDetails.id && accountDetails.account_id!=formData.transation_account.id && formData.transation_account.name ? 'orange':'crimson'}}}

                    disabled={false}
                    renderInput={(params) => <TextField {...params}
                    helperText={accountDetails.id && accountDetails.account_id!=formData.transation_account.id && formData.transation_account.name ? `${t('common.changed-to')} (${_account_categories.filter(i=>i.id==accountDetails.account_id)[0]?.name})` :(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? t('common.required-field') : ''}
                    error={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? true : false}             
                    value={formData.transation_account.name} label={t('common.account-name')} />}
                    
                    />   
                   </div>


                   <div className="relative" >
                                

                                <Autocomplete size="small"
                                value={formData.reference.name && formData.account_origin ? formData.reference.name : null}
                                onChange={(event, newValue) => {
                                  
                                    if(newValue==t('common.add_new')){
                                      data._showCreatePopUp('register','transations',{[`${type=="in" ? (formData.account_origin=="loans_in" ? "investor" : "client")  : (formData.account_origin == "loans_out" ? 'investor' :'supplier')}`]:true})
                                    }else{
                                      newValue=newValue ? newValue : ''
                                      let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                                      setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                                 
                                    }

                                }}
                                noOptionsText={t('common.no-options')}
                                defaultValue={null}
                                inputValue={(formData.account_origin) ? formData.reference.name  : "" }
                                onInputChange={(event, newInputValue) => {
                                    if(!newInputValue==t('common.add_new')){
                                      newInputValue=newInputValue ? newInputValue : ''
                                      let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                                      setFormData({...formData,reference:{...formData.reference,name:newInputValue,id:reference_id}})                    
                                    }
                                
                                }}
                                
                                id="_referece"
                                options={referenceOptions.map(i=>i.name)}
                                sx={{width:300,'& .MuiFormHelperText-root': {color: !formData.reference.id && formData.reference.name ? 'green' : 'crimson'}}}
                                disabled={(!formData.account_origin ? true : false) }
                                renderInput={(params) => <TextField {...params}
                                helperText={!formData.reference.id && formData.reference.name ? `(${t('common.new')} ${type=="in" ? (formData.account_origin=="loans_in" ? t('common.investor') : t('common.client'))  : (formData.account_origin == "loans_out" ? t('common.investor') :t('common.supplier'))} ${t('common.will-be-added')}) `: ''}
                                value={formData.reference.name}  label={t('common.beneficie')}   />}
                                />   
                            </div>

                            {/**label={type=="in" ? (!formData.account_origin ? 'Cliente / Investidor' : formData.account_origin=="loans_in" ? t('common.investor') : t('common.client'))  : (!formData.account_origin ? 'Fornecedor / Investidor' : formData.account_origin == "loans_out" ? 'Investidor' :'Fornecedor')} */}



                   </FormLayout.Section>



                   <span className="flex border-b mb-6"></span>

                     {formData.payments.map((i,_i)=>(


                     <FormLayout.Section style={{margin:0,paddingBottom:0,paddingTop:0}}>
                    
                    <div className="flex relative" id={'payment_method'+_i}>
                       {formData.payments.length!=1 && <span onClick={()=>remove_payment_method(_i)} className="mr-2 translate-y-2 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="21" fill="gray"><path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path></svg></span>
                        } 


                         {availableCredit[_i] && <div className="text-[13px] absolute right-[30px] top-0 translate-y-[-100%] flex items-center">
                              <span className='text-[12px] text-gray-500'>{t('common.balance')}: </span>  <span className={`${availableCredit[_i]._available < 0 ?'text-red-600':''}`}>{_cn(availableCredit[_i]._available)}</span>
                        </div>}  

                        

                        <Autocomplete size="small"
                          value={i.name ? i.name : null}
                          onChange={(_, newValue) => {
                            if(newValue==t('common.add_new')){
                              data._showCreatePopUp('payment_methods','transations',{index:_i})
                           }else{
                              newValue=newValue ? newValue : ''
                              let _id=paymentMethodsOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                              setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                  return _f!=_i ? f : {...f,account_id:_id,name:newValue}
                              })})
                            }

                          
                          }}
                          noOptionsText={t('common.no-options')}
                          defaultValue={null}
                          inputValue={i.name}
                          onInputChange={(event, newInputValue) => {
                            if(!newInputValue==t('common.add_new')){
                              newInputValue=newInputValue ? newInputValue : ''
                            let _id=paymentMethodsOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                            setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                return _f!=_i ? f : {...f,account_id:_id,name:newInputValue}
                            })})
                            }
                           
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
                        helperText={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? t('common.required-field') : ''} 
                        error={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? true : false}             
                        value={formData.payments[_i].account_id} label={t('common.payment-method')} />}
                    
                    />   
                        </div>

                        <div>
                                <TextField
                                  id="outlined-textarea"
                                  label={t('common.amount')}
                                  placeholder={t('common.type-amount')}
                                  multilinep
                                  value={i.amount}
                                  helperText={i.amount && formData.payments.map(i=>i.amount ? parseFloat(i.amount): 0).reduce((acc, curr) => acc + curr, 0) > (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment && accountDetails.status!="paid" ? t('common.more-than-missing') :(!i.amount) && verifiedInputs.includes('amount') ? t('common.required-field') : ''} 
                                  onBlur={()=>validate_feild('amount'+_i)}
                                  error={(!i.amount) && verifiedInputs.includes('amount'+_i) ? true : false}
                                  onChange={(e)=>{
                                    setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                      return _f!=_i ? f : {...f,amount:data._cn_op(e.target.value)}
                                    })})
                                  }}
                                
                                  sx={{'& .MuiFormHelperText-root': {color:i.amount && formData.payments.map(i=> i.amount ? parseFloat(i.amount) : 0).reduce((acc, curr) => acc + curr, 0) > (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment &&  accountDetails.status!="paid" ? 'orange' : 'crimson'},width:'100%',maxWidth:'200px','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  />
                      </div>
                       
                   </FormLayout.Section>

                  ))}

                   <div onClick={add_payment_method} className="ml-4 border cursor-pointer hover:opacity-80 hover:ring-1 ring-slate-400 table rounded-[5px] bg-gray-100 px-2 py-1"><AddIcon sx={{color:'#374151',width:20}}/><span className=" text-gray-700">{t('common.add-payment-method')}</span></div>


                <span className="flex border-b mt-10"></span>

               <div className="flex px-[6px] items-center mt-3 mb-2" id="add-fine">
                   <label className="flex items-center cursor-pointer hover:opacity-90">
                    <Switch
                      checked={Boolean(formData.has_fees)}
                      inputProps={{ 'aria-label': 'controlled' }}
                      
                      onChange={(e)=>{
                        setTimeout(()=>_scrollToSection('add-fine'),100)
                        setFormData({...formData,has_fees:!Boolean(formData.has_fees)})
                      }}
                    />
                    <span>{t('common.add-fees')}</span>
                   </label>
               </div>

               <FormLayout.Section>

                    <div className={`${formData.has_fees ? 'flex' :'hidden'}`}>   
                    
                          <div>
                                <TextField
                                        id="outlined-textarea"
                                        label={t('common.fine')}
                                        placeholder="Multa"
                                        multiline
                                        onBlur={()=>validate_feild('fine')}
                                        error={(!formData.fine) && verifiedInputs.includes('fine') && formData.has_fees ? true : false}
                                        value={formData.fine}
                                        helperText={(!formData.fine) && verifiedInputs.includes('fine') && formData.has_fees ? t('common.required-field') : ''} 
                                        onChange={(e)=>setFormData({...formData,fine:_cn_n(e.target.value)})}
                                        sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                        '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />  
                          </div>
                    </div>

              </FormLayout.Section>

                                  <span className="flex border-b"></span>

                    <div className="flex px-[6px] items-center mt-3 pb-2 pl-3">
                      {!id ? <label className="flex items-center cursor-pointer hover:opacity-90" onClick={()=>{
                          if(!showMoreOptions) setTimeout(()=>_scrollToSection('_show_more_option'),100)
                          setShowMoreOptions(!showMoreOptions)
                      }}>
                          <span className={`${showMoreOptions ? ' rotate-180' :' '}`}><ExpandMoreOutlinedIcon sx={{color:'gray'}}/></span>
                          <span>{t('common.show-more-options')}</span>
                      </label> :  ''}

                    
                    </div>


                    <div id={'_show_more_options'} className={`${showMoreOptions || id ? '' :'hidden'}`}>

                    <FormLayout.Section>
                                
                                <div className="-translate-y-0">
                                    <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                        <DatePicker  value={dayjs(formData.invoice_emission_date).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.invoice_emission_date)) : null} onChange={(e)=>setFormData({...formData,invoice_emission_date:e.$d})}  label={t('common.invoice-emission-date')}  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            />
                                    </LocalizationProvider>
                                    </div>

                                    

                                    <div>
                                            <TextField
                                            id="outlined-textarea"
                                            label={t('invoice.invoice-number')}
                                            placeholder={t('common.type-invoice-number')}
                                            multiline
                                            value={formData.invoice_number}
                                            onChange={(e)=>setFormData({...formData,invoice_number:e.target.value})}
                                            sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                            '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                            />
                                 </div>


                               
                                        
                            </FormLayout.Section>


                            <DefaultUpload show={!(showMoreOptions || id)} from={`transations`} formData={formData} setFormData={setFormData}/>


                    </div>











            <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>

            </div>
      
       </FormLayout>
    </>
  )
}
export default App

