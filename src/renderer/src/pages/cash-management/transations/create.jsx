
import React, { useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useData  } from '../../../contexts/DataContext';
import {useParams} from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import PouchDB from 'pouchdb';
import moment from 'moment';
import {useLocation,useNavigate } from 'react-router-dom';
       
       function App() {

          let {pathname} = useLocation()

         let type=pathname.includes('inflow') ? 'in' : 'out';

          

          const {_account_categories,_get,_clients,_suppliers,_accounts,_bills_to_pay,_bills_to_receive}= useData()

          const { id } = useParams()

          const db={
            transations:new PouchDB('transations'),
          } 


          const [items,setItems]=React.useState([])

          useEffect(()=>{

                if(!id) return 

                (async()=>{
                try {
                    let item=await db.transations.get(id)
                    setFormData({...item,
                       paid:item.paid ? item.paid : ''
                    })
                } catch (error) {
                    console.log(error)
                }
                })()

                _get('account_categories')
                _get('suppliers')
                _get('clients')
                _get('accounts')

          },[])



          const [paydayHelper,setPaydayHelper]=React.useState('custom')
          const [loading, setLoading] = React.useState(false);
          const [valid, setValid] = React.useState(false);
          const {_add,_update} = useData();
          const [accountCategories,setAccountCategories]=React.useState([])
          const [referenceOptions,setReferenceOptions]=React.useState([])
          const [transationAccountOptions,setTransationAccountOptions]=React.useState([])
          const [accountOptions,setAccountOptions]=React.useState([])
          const [nextAccountPayment,setNextAccountPayment]=React.useState('')
          const [accountDetails,setAccountDetails]=React.useState({})

          useEffect(()=>{
            setAccountCategories(_account_categories.filter(i=>['client','others','investments'].includes(i.account_origin)))
          },[_account_categories])

          useEffect(()=>{
            setTransationAccountOptions(_accounts)
          },[_accounts])

        

          
            let initial_form={
               id:'',
               type,
               description:'',
               deleted:false,
               amount:'',
               payment_origin:'cash',
               createdAt:new Date().toISOString(),
               reference:{id:null,type:'none',name:''},
               transation_account:{id:null,name:''},
               account:{id:null,name:''},
               link_payment:false
           }
           

           const [formData, setFormData] = React.useState(initial_form);

           useEffect(()=>{
            (async()=>{
                let docs=await db.transations.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()

          },[formData])


          let required_fields=['amount','description']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }

          useEffect(()=>{

            if(formData.reference.type=="supplier"){
                setReferenceOptions(_suppliers)
            }else if(formData.reference.type=="client"){
                setReferenceOptions(_clients)
            }else{
                setReferenceOptions([])
            }

           },[formData.reference,_suppliers,_clients])


           useEffect(()=>{
               setAccountOptions((formData.type=="in" ? _bills_to_receive : _bills_to_pay).filter(i=>i.status!="paid").map(i=>({...i,id:i.id,name:i.description})))
           },[_bills_to_pay,_bills_to_receive,formData.type])


           useEffect(()=>{

                 if(formData.account.id && formData.link_payment){
                     let account=accountOptions.filter(i=>i.id==formData.account.id)[0]
                     setAccountDetails(account)
                     setFormData({...formData,
              
                     amount:parseFloat(account.amount) - parseFloat(account.paid) ?  parseFloat(account.amount) - parseFloat(account.paid) : '',
                     reference:{...account.reference,type:account.account_origin=="supplier" || account.account_origin=="client" ? account.account_origin : formData.reference.type}}) 
                 }else{
                     setAccountDetails({})
                     setFormData({...formData,amount:''})
                     setNextAccountPayment('')

                 }
 
                       
           },[formData.account.id])



           useEffect(()=>{
                  if(parseFloat(formData.amount) >= (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment || !formData.link_payment){
                        setNextAccountPayment('')
                  }
           },[formData.amount])
   

         async function SubmitForm(){
              
              if(valid){
                   try{
                     if(id){
                        _update('transations',[{...formData}])
                        toast.success('Transação actualizada')
                     }else{
                        let reference_id=formData.reference.id
                       
                        if(formData.reference.name && !formData.reference.id && (formData.reference.type=="supplier" || formData.reference.type=="client")){
                          alert('adding new '+formData.reference.type)
                          reference_id=Math.random().toString()
                          _add(formData.reference.type+'s',[{
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

                        let transation_account_id=formData.transation_account.id
                        if(formData.transation_account.name && !formData.transation_account.id){
                          alert('adding new a')
                            transation_account_id=Math.random().toString()
                           _add('accounts',[{
                            id:transation_account_id,
                            _id:Math.random().toString(),
                            name:formData.transation_account.name,
                            description:'',
                            deleted:false
                         }])
                       }


                      _add('transations',[{...formData,
                      reference:{...formData.reference,id:reference_id},
                      transation_account:{...formData.transation_account,id:transation_account_id},
                      amount:parseFloat(formData.amount),
                      id:Math.random(),_id:Math.random().toString()}])
                      setVerifiedInputs([])
                      toast.success('Transação adicionada')
                      setFormData(initial_form)
                      setPaydayHelper('custom')
                      

                      if(formData.link_payment){
                        _update(formData.type=='in' ? 'bills_to_receive': 'bills_to_pay',[{...accountDetails,
                             payday:nextAccountPayment ? nextAccountPayment : accountDetails.payday,
                             paid:parseFloat(accountDetails.paid) + parseFloat(formData.amount),
                             status:parseFloat(accountDetails.paid) + parseFloat(formData.amount) == parseFloat(accountDetails.amount) ? 'paid' : accountDetails.status
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
               })

               if(!formData.reference.name && (formData.reference.type!="none")) v=false

               if(formData.link_payment && !formData.account.id || !formData.transation_account.name) v=false
                
               if(parseFloat(formData.amount) < (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment && !nextAccountPayment) v=false
               
               setValid(v)
          },[formData,nextAccountPayment])

     
  return (
    <>
       <DefaultLayout details={{name:'Nova transação'}}>
               <div className="bg-white py-1 pb-5 max-w-[100%]">

               <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                  <span className="font-medium text-[18px]">Adicionar {type == 'in' ? 'entrada' : 'saída'}</span>
               </div>

               <div className="flex px-[6px] items-center">
                   <label className="flex items-center cursor-pointer hover:opacity-90">
                    <Checkbox
                    checked={formData.link_payment}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(e)=>{
                      setFormData({...formData,link_payment:e.target.checked,account:{id:null,name:''}})
                    }}
                    />
                    <span>Selecionar conta a {type == 'in' ? 'receber' : 'pagar'}</span>
                   </label>
               </div>

                <div className="flex flex-wrap p-4 pt-0 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]">   
                <div>
                       
                       <Autocomplete size="small"
                          value={formData.account.name ? formData.account.name : null}
                          onChange={(event, newValue) => {
                            newValue=newValue ? newValue : ''
                            let _id=accountOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,account:{...formData.account,name:newValue,id:_id}})
                          }}
                          noOptionsText="Sem opções"
                          defaultValue={null}
                          inputValue={formData.account.name}
                          onInputChange={(event, newInputValue) => {
                             newInputValue=newInputValue ? newInputValue : ''
                             let _id=accountOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                             setFormData({...formData,account:{...formData.account,name:newInputValue,id:_id}})
                          }}
      
                          onBlur={()=>{
                               if(!formData.account.id){
                                   setFormData({...formData,account:{...formData.account,name:''},reference:{...formData.reference,name:'',id:null}})
                               }
                               validate_feild('account')
                          }}
                          id="_transation_account"
                          options={accountOptions.map(i=>i.name)}
                          sx={{ width: 300 }}
                          disabled={!formData.link_payment}
                          renderInput={(params) => <TextField  {...params}
                          helperText={(!formData.account.id) && verifiedInputs.includes('account') && formData.link_payment ? 'Campo obrigatório':''}
                          error={(!formData.account.id) && formData.link_payment && verifiedInputs.includes('account') ? true : false}             
                           value={formData.account.name} label={type == 'in' ? 'conta a receber' : 'conta a pagar'} />}
                      />   
                       </div>
                    
                    <div>
                          <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                              <DatePicker
                                helperText={(!nextAccountPayment) && verifiedInputs.includes('next_payment') && parseFloat(formData.amount) < parseFloat(accountDetails.amount) && formData.link_payment ? 'Campo obrigatório':''}
                                onBlur={()=>validate_feild('next_payment')}
                                error={((!nextAccountPayment) && verifiedInputs.includes('next_payment') && parseFloat(formData.amount) < (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid))) || (dayjs(nextAccountPayment).$d.toString() != "Invalid Date" && nextAccountPayment) ? true : true}
                                disabled={parseFloat(formData.amount) < (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment ? false : true} value={dayjs(nextAccountPayment).$d.toString() != "Invalid Date" ? dayjs(new Date(nextAccountPayment)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setNextAccountPayment(e.$d)}  size="small" label="Proxima data"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                                    '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />
                          </LocalizationProvider>
                    </div>
                </div>

               <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]">   
     
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
                 <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de referência</InputLabel>
                                <Select
                                disabled={(accountOptions.filter(i=>i.id==formData.account.id)[0]?.account_origin=="client" || accountOptions.filter(i=>i.id==formData.account.id)[0]?.account_origin=="supplier") && formData.link_payment ? true : false}
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.reference.type}
                                label="Tipo de conta"
                                onChange={(e)=>setFormData({...formData,reference:{id:null,type:e.target.value}})}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'none'}>Nenhuma</MenuItem>
                                <MenuItem sx={{display:type == 'in' ? 'flex' : 'none'}} value={'client'}>Cliente</MenuItem>
                                <MenuItem  sx={{display:type == 'out' ? 'flex' : 'none'}} value={'supplier'}>Fornecedor</MenuItem>
                                <MenuItem value={'other'}>Outro</MenuItem>
                                </Select>

                 </FormControl>
               </div>
               <div>
                 <Autocomplete size="small"
                    value={formData.reference.name && formData.reference.type!="none" ? formData.reference.name : null}
                    onChange={(event, newValue) => {
                      newValue=newValue ? newValue : ''
                      let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                      setFormData({...formData,reference:{...formData.reference,name:newValue,id:reference_id}})
                    }}
                    noOptionsText="Sem opções"
                    defaultValue={null}
                    inputValue={formData.reference.type=="none" ? "" : formData.reference.name}
                    onInputChange={(event, newInputValue) => {
                       newInputValue=newInputValue ? newInputValue : ''
                       let reference_id=referenceOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                       setFormData({...formData,reference:{...formData.reference,name:newInputValue,id:reference_id}})
                  
                    }}
                    id="_referece"
                    options={referenceOptions.map(i=>i.name)}
                    sx={{ width: 300 }}
                    disabled={formData.reference.type=="none" || ((accountOptions.filter(i=>i.id==formData.account.id)[0]?.account_origin=="client" || accountOptions.filter(i=>i.id==formData.account.id)[0]?.account_origin=="supplier") && formData.link_payment) ? true : false}
                    renderInput={(params) => <TextField {...params}
                    onBlur={()=>validate_feild('reference')}
                    error={(!formData.reference.name) && verifiedInputs.includes('reference') && (formData.reference.type!="none") ? true : false}
                    helperText={(!formData.reference.name) && verifiedInputs.includes('reference') && (formData.reference.type!="none") ? "Insira o nome" :''}
                    
                     value={formData.reference.name} label="Referência" />}
                  />   
                   </div>

                   <div className="hidden">
                        <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">

                                <InputLabel style={{margin:0,height:40}} id="demo-simple-select-error">Tipo de transação *</InputLabel>
                                <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                value={formData.type}
                                label="Tipo de transação"
                                onBlur={()=>validate_feild('type')}
                                error={(!formData.type) && verifiedInputs.includes('type') ? true : false}
                                onChange={(e)=>{
                                  setFormData({...formData,type:e.target.value,account:{name:'',id:null}})
                                }}
                                sx={{width:'100%','& .MuiInputBase-root':{height:40},'& .css-1869usk-MuiFormControl-root':{margin:0},'& .Mui-focused.MuiInputLabel-root': { top:0 },
                                '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                >
                                <MenuItem value={'in'}>Entrada</MenuItem>
                                <MenuItem value={'out'}>Saída</MenuItem>
                                </Select>
                        </FormControl>
                      </div>


                      <div>

                 <Autocomplete size="small"
                    value={formData.transation_account.name ? formData.transation_account.name : null}
                    onChange={(event, newValue) => {
                      newValue=newValue ? newValue : ''
                      let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                      setFormData({...formData,transation_account:{...formData.transation_account,name:newValue,id:_id}})
                    }}
                    noOptionsText="Sem opções"
                    defaultValue={null}
                    inputValue={formData.transation_account.name}
                    onInputChange={(event, newInputValue) => {
                       newInputValue=newInputValue ? newInputValue : ''
                       let _id=transationAccountOptions.filter(i=>i.name?.toLowerCase()==newInputValue?.toLowerCase())[0]?.id
                       setFormData({...formData,transation_account:{...formData.transation_account,name:newInputValue,id:_id}})
                  
                    }}
                    onBlur={()=>validate_feild('transation_account')}
                    id="_transation_account"
                    options={transationAccountOptions.map(i=>i.name)}
                    sx={{ width: 300 }}
                    disabled={formData.transation_account.type=="none" ? true : false}
                    renderInput={(params) => <TextField {...params}
                    helperText={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? 'Campo obrigatório':''}
                    error={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? true : false}             
                    value={formData.transation_account.name} label="Conta de transação" />}
                    
                    />   
                   </div>
                      <div>
                                <TextField
                                  id="outlined-textarea"
                                  label="Valor *"
                                  placeholder="Digite o valor"
                                  multiline
                                  value={formData.amount}
                                  helperText={parseFloat(formData.amount) > (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment ? "Não deve ser maior que o valor do lançamento" :(!formData.amount) && verifiedInputs.includes('amount') ? 'Campo obrigatório':''}
                                  onBlur={()=>validate_feild('amount')}
                                  error={(!formData.amount) && verifiedInputs.includes('amount') || parseFloat(formData.amount) > parseFloat(accountDetails.amount) && formData.link_payment ? "Não deve ser maior que o valor do laçamento" : (!formData.amount) && verifiedInputs.includes('amount') ? true : false}
                                  onChange={(e)=>setFormData({...formData,amount:e.target.value.replace(/[^0-9]/g, '')})}
                                  sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  />
                      </div>
                      <div>
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

