
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
import { Autocomplete} from '@mui/material';
import 'dayjs/locale/en-gb';
import PouchDB from 'pouchdb';
import {useLocation,useNavigate } from 'react-router-dom';
import FormLayout from '../../../layout/DefaultFormLayout';
import AddIcon from '@mui/icons-material/Add';
import TransationNextDate from '../../../components/Dialogs/transationNextDate'
   
       function App() {

          let {pathname} = useLocation()

           let type=pathname.includes('inflow') ? 'in' : 'out';

          const {_account_categories,_get,_clients,_suppliers,_investors,_payment_methods,_bills_to_pay,_bills_to_receive,_transations,_categories,_scrollToSection,_initial_form,_cn_n,_cn}= useData()

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
                _get('categories')
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
          const [paymentMethodsOptions,setPaymentMethodsOptions]=React.useState([])
          const [accountOptions,setAccountOptions]=React.useState([])
          const [accountDetails,setAccountDetails]=React.useState({})
          const [availableCredit,setAvailableCredit]=React.useState([])
          const [showNextPaymentDialog,setShowNextPaymentDialog]=React.useState(false)

           const [formData, setFormData] = React.useState(_initial_form.transations);

           useEffect(()=>{
            (async()=>{
                let docs=await db.transations.allDocs({ include_docs: true })
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })()


            console.log(formData)


          },[formData])


          
          useEffect(()=>{

            if(formData.account_origin){
              setTransationAccountOptions(_account_categories.filter(i=>i.account_origin==formData.account_origin))
            }else{
              setTransationAccountOptions(_account_categories.filter(i=>i.transation_type==type))
            }

          },[_account_categories,formData.account_origin])

          useEffect(()=>{

             setPaymentMethodsOptions(_payment_methods)

          },[_payment_methods])

          


          useEffect(()=>{
               

            if(formData.transation_account.id){
                setFormData({...formData,transation_account:{id:null,name:''}})
            }
         

          },[_account_categories,formData.account_origin])



          


          let required_fields=['description','account_origin']
       
          const [verifiedInputs, setVerifiedInputs] = React.useState([]);
       
          function validate_feild(field){
             setVerifiedInputs(field!='all' ? [...verifiedInputs,field] : required_fields)
          }

          useEffect(()=>{

            if(type=="in"){
                setReferenceOptions(_clients)
            }else if(formData.account_origin!="loans_out"){
                setReferenceOptions(_suppliers)
            }else{
                setReferenceOptions(_investors)
            }
           },[formData.reference,_suppliers,_investors,_clients])


           useEffect(()=>{
               let from={
                  in: _bills_to_receive,
                  out:_bills_to_pay
               }
              
               setAccountOptions(from[type].filter(i=>i.status!="paid").map(i=>({...i,id:i.id,name:i.description})))
           },[_bills_to_pay,_bills_to_receive,formData.type])


           useEffect(()=>{

                  

                 if(formData.account.id && formData.link_payment){
                     let account=accountOptions.filter(i=>i.id==formData.account.id)[0]

                     //let get_reference=type=="in" ? _clients : account.account_origin=="loans_out" ? _investors : _suppliers 
                     //alert- update referrence name
                     setAccountDetails(account)
                     setFormData({...formData,
                     account_origin:account.account_origin,
                     reference:{id:account.reference.id,name:account.reference.name}
                     ///amount:parseFloat(account.amount) - parseFloat(account.paid ? account.paid : 0) ?  parseFloat(account.amount) - parseFloat(account.paid ? account.paid : 0) : '',
                     }) 


                 }else{
                     setAccountDetails({})

                 }
 
                       
           },[formData.account.id])


           useEffect(()=>{
           /* if(formData.transation_account.id){
              setAvailableCredit(_transations.filter(i=>i.transation_account.id==formData.transation_account.id && i.type=='in').map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0) - _transations.filter(i=>i.transation_account.id==formData.transation_account.id && i.type=='out').map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0))
            }else{
              setAvailableCredit(0)
            }   */              

          },[formData.transation_account.id])



          useEffect(()=>{
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
                    let initial_amount=_payment_methods.filter(i=>i.id==account_id)[0].initial_amount 
                    initial_amount=initial_amount != NaN ? initial_amount : 0
                    let _in=_transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                    let _out=_transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==formData.payments.filter(v=>v.account_id)[_i].account_id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                    let _available=initial_amount + _in - _out
                    a[_i]={_in,_out,_available}
                }
               
                
            })
            setAvailableCredit(a)
          },[formData.payments])








   

         async function SubmitForm(){

              let amount=formData.payments.map(i=>i.amount ? parseFloat(i.amount) : 0).reduce((acc, curr) => acc + curr, 0)
              let fees=formData.has_fees ? parseFloat(formData.fine) : 0
              let left=parseFloat(accountDetails.paid) > parseFloat(accountDetails.amount) ? 0 :_cn(parseFloat(accountDetails.amount ? accountDetails.amount : 0) - parseFloat(accountDetails.paid ? accountDetails.paid : 0))

              if(!formData.next_payday &&  (amount + fees) < left && formData.link_payment){
                 setShowNextPaymentDialog(true)
                 setFormData({...formData,next_payday:null})
                 return
              }



              setShowNextPaymentDialog(false)



              if(valid){
                   try{
                     if(id){
                        _update('transations',[{...formData}])
                        toast.success('Transação actualizada')
                     }else{
                        let reference_id=formData.reference.id
                       
                        if(formData.reference.name && !formData.reference.id && (formData.reference.type=="supplier" || formData.reference.type=="client")){
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
                      amount:amount + fees,
                      type,
                      fees,
                      id:Math.random(),_id:Math.random().toString()}])

                      setVerifiedInputs([])
                      toast.success('Transação adicionada')
                      setFormData(_initial_form.transations)
                      setPaydayHelper('custom')
                      

                      if(formData.link_payment){
                        _update(formData.type=='in' ? 'bills_to_receive': 'bills_to_pay',[{...accountDetails,
                             payday:formData.next_payday ? formData.next_payday : accountDetails.payday,
                             paid:parseFloat(accountDetails.paid ? accountDetails.paid : 0) + amount +  fees,
                             fees:parseFloat(accountDetails.fees ? accountDetails.fees : 0) + fees,
                             status:parseFloat(accountDetails.paid ? accountDetails.paid : 0) + amount + fees >= parseFloat(accountDetails.amount) ? 'paid' : accountDetails.status
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

               if(!formData.reference.name || formData.payments.some(i=>!i.amount || parseFloat(i.amount)==0) || formData.payments.some(i=>!i.account_id)) v=false

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

          /****
           * 
           * 
           * <div className="[&>_div]:border  [&>_div]:border-[#D9D9D9] flex items-center px-[1rem] [&>_div]:rounded-[0.4rem] [&>_div]:min-w-[110px] [&>_div]:mr-[10px]  justify-start">
                            <div className="items-center justify-center px-3 py-2">
                                <span className="text-[15px] text-[#A3AED0] mr-2">Saldo da conta {formData.transation_account.name ? `(${formData.transation_account.name})` :'(Não selecionada)'}</span>
                                <span className={`text-[19px]   ${availableCredit <=0 && type=='out' ? 'text-red-500' :'text-[#2B3674]'}
                                ${!formData.transation_account.name ? 'hidden':''}`}>{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(availableCredit)}</span>
                            </div>
                            <div className={`items-center justify-center px-3 py-2 ${!formData.account.id ? 'hidden' :'flex'}`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">Total</span>
                                <span className="text-[19px] text-[#2B3674]">{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(!accountDetails.amount ? 0 : parseFloat(accountDetails.amount))}</span>
                            </div>

                            <div className={`items-center justify-center px-3 py-2 ${!formData.account.id ? 'hidden' :'flex'}`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">{type=="in" ? 'Recebido' : 'Pago'}</span>
                                <span className="text-[19px] text-[#2B3674]">{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(accountDetails.paid ? parseFloat(accountDetails.paid) : 0)}</span>
                            </div>

                            <div className={`items-center justify-center px-3 py-2 ${!formData.account.id ? 'hidden' :'flex'}`}>
                                <span className="text-[15px] text-[#A3AED0] mr-2">Em falta</span>
                                <span className="text-[19px] text-[#2B3674]">{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(accountDetails.amount ? accountDetails.amount : 0) - parseFloat(accountDetails.paid ? accountDetails.paid : 0))}</span>
                            </div>
                </div>
           */


     
  return (
    <>
       {showNextPaymentDialog &&  <TransationNextDate show={showNextPaymentDialog} setShow={setShowNextPaymentDialog} SubmitForm={SubmitForm} formData={formData} setFormData={setFormData}/>}
       <FormLayout name={'Transação'} formTitle={id ? 'Actualizar' : 'Adicionar nova '+(type == 'in' ? 'entrada' : 'saída')}>
                   
                <FormLayout.Cards topInfo={[
                      {name:'Total a '+(type=="in" ? "receber" : "pagar"),value:_cn(!accountDetails.amount ? 0 : parseFloat(accountDetails.amount))},
                      {name:type=="in" ? 'Recebido' : 'Pago',value:_cn(accountDetails.paid ? parseFloat(accountDetails.paid) : 0)},
                      {name:'Em falta',value:parseFloat(accountDetails.paid) > parseFloat(accountDetails.amount) ? 0 :_cn(parseFloat(accountDetails.amount ? accountDetails.amount : 0) - parseFloat(accountDetails.paid ? accountDetails.paid : 0))},
                ].filter(i=>formData.account.id && !i.id || i.id).filter(i=>formData.transation_account.id && i.id || !i.id)}/>

               <div className="flex px-[6px] items-center mt-3" id="add-bill-account">
                   <label className="flex items-center cursor-pointer hover:opacity-90">
                    <Switch
                    disabled={accountOptions.length ? false : true}
                    checked={formData.link_payment}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(e)=>{
                      setTimeout(()=>_scrollToSection('add-bill-account'),100)
                      setFormData({...formData,link_payment:e.target.checked,account:{id:null,name:''}})
                    }}
                    />
                    <span className={`${!accountOptions.length ? 'opacity-80' :''}`}>Selecionar {type == 'in' ? 'recebimento' : 'pagamento'} agendado  {accountOptions.length ? false : true && <label className="text-[14px]">(Nenhuma disponível)</label>}</span>
                   </label>
               </div>

               <div className={`${formData.link_payment ? 'flex' :'hidden'}`}>   
               
               <FormLayout.Section>

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

                </FormLayout.Section>

                </div>



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
                 <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 ,display:'none'}} size="small">

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

  
                 <FormControl sx={{ m: 1, width: '100%',margin:0,height:40 }} size="small">
                     <InputLabel htmlFor="grouped-select"
                       error={(!formData.account_origin) && verifiedInputs.includes('account_origin') ? true : false}             

                     >Categoria</InputLabel>
                     <Select 

                        disabled={formData.account.id ? true : false}
                        onBlur={()=>validate_feild('account_origin')}
                        
                        defaultValue="" id="grouped-select"
                        value={formData.account_origin}
                        label="Categoria"
                        onChange={(e)=>setFormData({...formData,account_origin:e.target.value})}
                               
                     >
                     
                   
                        <MenuItem value="">
                           <em>Selecione uma opção</em>
                        </MenuItem>
                              {_categories.filter(i=>i.type=="in" && !i.disabled).map(i=>(
                                      <MenuItem value={i.field} sx={{display:type == 'in' ? 'flex' : 'none'}} key={i.field} sty><span className=" w-[7px] rounded-full h-[7px] bg-[#16a34a] inline-block mr-2"></span> <span>{i.name}</span></MenuItem>
                              ))}


                             {_categories.filter(i=>i.type=="out" && !i.disabled).map(i=>(
                                <MenuItem value={i.field} sx={{display:type == 'out' ? 'flex' : 'none'}} key={i.field}><span className=" w-[7px] rounded-full h-[7px] bg-red-500 inline-block mr-2"></span> <span>{i.name}</span></MenuItem>
                             ))}


                        
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
                    onBlur={()=>{
                      if(!formData.transation_account.id){
                          setFormData({...formData,transation_account:{id:null,name:''}})
                      }
                      validate_feild('transation_account')
                     }}
                    id="_transation_account"
                    options={transationAccountOptions.map(i=>i.name)}
                    sx={{ width: 300 }}
                    disabled={formData.transation_account.type=="none" ? true : false}
                    renderInput={(params) => <TextField {...params}
                    helperText={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? 'Campo obrigatório':''}
                    error={(!formData.transation_account.name) && verifiedInputs.includes('transation_account') ? true : false}             
                    value={formData.transation_account.name} label="Nome da conta" />}
                    
                    />   
                   </div>


                   <div className={`${formData.reference.id && formData.link_payment ? 'pointer-events-none' :''}`}>
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
                                disabled={type=="in" ? false : (!formData.account_origin ? true : false)}
                                renderInput={(params) => <TextField {...params}
                                disabled={formData.reference.id && formData.link_payment}
                                onBlur={()=>validate_feild('reference')}
                                error={(!formData.reference.name) && verifiedInputs.includes('reference') ? true : false}
                                helperText={(!formData.reference.name) && verifiedInputs.includes('reference') ? "Insira o nome": !formData.reference.id && formData.reference.name ? `(Novo ${type=='in' ? 'cliente' : formData.account_origin=='loans_out' ? 'investidor' :'fornecedor'} será adicionado) `: ''}
                                
                                value={formData.reference.name} label={type=="in" ? 'Cliente' : (!formData.account_origin ? 'Fornecedor / Investidor' : formData.account_origin == "loans_out" ? 'Investidor' :'Fornecedor')}  />}
                                />   
                    </div>

                     
                   



                   </FormLayout.Section>



                   <span className="flex border-b mb-6"></span>

                     {formData.payments.map((i,_i)=>(


                     <FormLayout.Section style={{margin:0,paddingBottom:0,paddingTop:0}}>
                    
                    <div className="flex relative" id={'payment_method'+_i}>
                       {formData.payments.length!=1 && <span onClick={()=>remove_payment_method(_i)} className="mr-2 translate-y-2 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="21" fill="gray"><path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path></svg></span>
                        } 


                         {availableCredit[_i] && <div className="text-[13px] absolute right-0 top-0 translate-y-[-100%] flex items-center">
                              <span className='text-[12px] text-gray-500 mr-1'>Disponivel: </span>  <span className={`${availableCredit[_i]._available < 0 ?'text-red-600':''}`}>{_cn(availableCredit[_i]._available)}</span>
                        </div>}    

                        <Autocomplete size="small"
                          value={i.name ? i.name : null}
                          onChange={(_, newValue) => {
                            newValue=newValue ? newValue : ''
                            let _id=paymentMethodsOptions.filter(i=>i.name?.toLowerCase()==newValue?.toLowerCase())[0]?.id
                            setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                return _f!=_i ? f : {...f,account_id:_id,name:newValue}
                            })})
                          }}
                          noOptionsText="Sem opções"
                          defaultValue={null}
                          inputValue={i.name}
                          onInputChange={(event, newInputValue) => {
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
                        options={paymentMethodsOptions.filter(f=>!formData.payments.some(j=>j.account_id==f.id)).map(i=>i.name)}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params}
                        helperText={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? 'Campo obrigatório':''}
                        error={(!formData.payments[_i].account_id) && verifiedInputs.includes('payment_method'+_i) ? true : false}             
                        value={formData.payments[_i].account_id} label="Meio de pagamento" />}
                    
                    />   
                        </div>

                        <div>
                                <TextField
                                  id="outlined-textarea"
                                  label="Valor *"
                                  placeholder="Digite o valor"
                                  multiline
                                  value={i.amount}
                                  helperText={formData.payments.map(i=>parseFloat(i.amount)).reduce((acc, curr) => acc + curr, 0) > (parseFloat(accountDetails.amount) - parseFloat(accountDetails.paid)) && formData.link_payment ? "Valor é maior que o agendado" :(!i.amount) && verifiedInputs.includes('amount') ? 'Campo obrigatório':''}
                                  onBlur={()=>validate_feild('amount'+_i)}
                                  error={(!i.amount) && verifiedInputs.includes('amount'+_i) ? true : false}
                                  onChange={(e)=>{
                                    setFormData({...formData,payments:formData.payments.map((f,_f)=>{
                                      return _f!=_i ? f : {...f,amount:_cn_n(e.target.value)}
                                    })})
                                  }}
                                  sx={{width:'100%',maxWidth:'200px','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                  '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                  />
                      </div>
                       
                   </FormLayout.Section>

                  ))}

                   <div onClick={add_payment_method} className="ml-4 border cursor-pointer hover:opacity-80 hover:ring-1 ring-slate-400 table rounded-[5px] bg-gray-100 px-2 py-1"><AddIcon sx={{color:'#374151',width:20}}/><span className=" text-gray-700">Adicionar meio de pagamento</span></div>


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
                    <span>Adicionar multa</span>
                   </label>
               </div>

               <FormLayout.Section>

                    <div className={`${formData.has_fees ? 'flex' :'hidden'}`}>   
                    
                          <div>
                                <TextField
                                        id="outlined-textarea"
                                        label="Multa"
                                        placeholder="Multa"
                                        multiline
                                        onBlur={()=>validate_feild('fine')}
                                        error={(!formData.fine) && verifiedInputs.includes('fine') && formData.has_fees ? true : false}
                                        value={formData.fine}
                                        helperText={(!formData.fine) && verifiedInputs.includes('fine') && formData.has_fees ? 'Campo obrigatório':''}
                                        onChange={(e)=>setFormData({...formData,fine:_cn_n(e.target.value)})}
                                        sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                        '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />  
                          </div>
                    </div>

              </FormLayout.Section>




            <FormLayout.SendButton SubmitForm={SubmitForm} loading={loading} valid={valid} id={id}/>
      
       </FormLayout>
    </>
  )
}
export default App

