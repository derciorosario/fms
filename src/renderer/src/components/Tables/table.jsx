import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../components/progress/TableProgress'
import { useData } from '../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import CheckIcon from '@mui/icons-material/Check';
import { useSearchParams, useLocation } from 'react-router-dom';
import colors from '../../assets/colors.json'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useAuth } from '../../contexts/AuthContext';
import DefaultButton from '../Buttons/default';
import { v4 as uuidv4 } from 'uuid';
import { CircularProgress } from '@mui/material';
import { t } from 'i18next';


export default function Table({page_settings,setSearch,setItemsToDelete,search,filterOptions,page,periodFilters,_setFilteredContent,setFilterOptions,setDatePickerPeriodOptions,clearAllFilters}) {
  const {_loaded,_update,_categories,_cn}= useData()
  const data=useData()
  const {user,db,_change_company} = useAuth()
  const navigate=useNavigate()
  const [selectedItems,setSelectedItems]=React.useState([])
  const [loading,setLoading]=React.useState(false)
  const [rows,setRows]=React.useState([])
  const [settings,setSettings]=React.useState({
     columns:[],
     selected:'',
     required_data:[]
  })

  const {pathname}= useLocation()
  const [searchParams, setSearchParams] = useSearchParams();


  React.useEffect(()=>{
   //clearAllFilters()
   data._sendFilter(searchParams)
   
  },[])

  
  
  React.useEffect(()=>{
      let params_names=Object.keys(data._filters).filter(i=>(typeof data._filters[i] == 'string' && data._filters[i]) || (typeof data._filters[i] == 'object' && data._filters[i].length))

      setFilterOptions(filterOptions.map(f=>{
          return {...f,groups:f.groups.map(g=>{
              if(!params_names.includes(g.param)){
                  return g
              }else{
                 return {...g,selected_ids:g.items.filter(i=>data._filters[g.param].includes(i.id)).map(i=>i.id),items:g.items.map(i=>{
                      return data._filters[g.param].includes(i.id) ? {...i,selected:true} : {...i,selected:false}
                 })}

              }
          })}
      }))

      
      setDatePickerPeriodOptions({...periodFilters,
         endDate:new Date(data._filters.end_date).toString()!="Invalid Date" ? new Date(data._filters.end_date) : filterOptions.endDate ? filterOptions.endDate : new Date(),
         startDate:new Date(data._filters.start_date).toString()!="Invalid Date" ? new Date(data._filters.start_date)  : filterOptions.startDate ? filterOptions.startDate : new Date(),
      })


      setSearch(data._filters.search)

   },[data._filters])




   async function handleReconciliation(row,action,value){


    setLoading(row.id)


    if(!row.payment.confirmed && action=="confirm" && ((!row.payment.confirmed_amount || row.payment.confirmed_amount <= 0 || isNaN(row.payment.confirmed_amount)) && row.payment.confirmed_amount!=undefined)){
      toast.error(t('messages.amount-as-to-be-more-than-0'))
      return
    }

    if(row.payment.confirmed_amount==undefined){
         row.payment.confirmed_amount=parseFloat(row.payment.amount)
    } 

   
    let transation=rows.filter(i=>i.id==row.id)[0]

    transation={...transation,payments:transation.payments.map(i=>{
        if(action=="confirm"){
          return i.account_id==transation.payment.account_id ? {...i,amount:transation.payment.confirmed_amount,confirmed_amount:transation.payment.confirmed_amount,confirmed:!transation.payment.confirmed} : i
        }else{
          return i.account_id==transation.payment.account_id ? {...i,confirmed_amount:value} : i
        }
     })}

    
     let amount=transation.payments.map(i=>i.amount ? parseFloat(i.amount) : 0).reduce((acc, curr) => acc + curr, 0)
  

     setRows(sortRows(rows.map((i,_i)=>{
      if(action=="confirm"){
        return i.id==row.id ? {...i,amount:transation.payment.confirmed_amount,confirmed_amount:transation.payment.confirmed_amount,confirmed:!transation.payment.confirmed} : i
      }else{
        return i.id==row.id ? {...i,payment:{...i.payment,confirmed_amount:value}} : i
      }
    })))


   if(action=="amount"){
       setLoading(false)
       return
   } 

   
  
   if(transation.link_payment){

       let account=await db[`bills_to_${transation.type=="in"?"receive":"pay"}`].find({selector: {id:transation.account.id}})
       account=account.docs[0]

       let last=await db.transations.find({selector: {id:row.transation_id}})
       last=last.docs[0]
       let fees=transation.fees ? parseFloat(transation.fees) : 0
       account.paid=parseFloat(account.paid) - parseFloat(last.amount) + amount
       if(!account.paid) account.paid=""
       account.fees=parseFloat(account.fees ? account.fees : 0) - fees
       if(parseFloat(account.amount) > account.paid) {
           account.status="pending"
       }else{
           account.status="paid"
       }
       await db[`bills_to_${transation.type=="in"?"receive":"pay"}`].put(account)
       
       

       if(transation.loan_id){
        let loan = await db.loans.find({selector: {id:transation.loan_id}})
        loan=loan.docs[0]
    
        delete transation.payment
    
        if(transation.type=="in"){
          loan.amount=amount
          loan.payments=transation.payments
         }else{
          loan.paid=account.paid
          loan.fees=account.fees
          loan.status=account.status
        }
       
        await _update('loans',[loan])
      }

       
   }

   transation.amount=amount
   delete transation.payment
   await _update('transations',[transation])
   setLoading(false)
}


  
  function search_f(array){

      let res=data._search(search,array,filterOptions,periodFilters,page_settings)

      if(page=="inflows" || page=="outflows"){
          res=res.filter(v=>v.type==(page=="inflows" ? 'in' :'out'))
      }

    

      if(page=="companies"){
          array=user.companies_details
          res=data._search(search,array,filterOptions,periodFilters,page_settings)
      }



      

      if(page=='financial-reconciliation'){
              let reconciliation_data=[]
              let selected_filters=filterOptions.filter(i=>i.field=="if_consiliated")[0].groups[0].selected_ids
              let igual=filterOptions.filter(i=>i.field=="if_consiliated")[0].igual
              res.forEach(i=>{
                i.payments.forEach(f=>{
                  let confirmed=f.confirmed && f.amount==f.confirmed_amount ? true : false
                  
                  if(!selected_filters.length || (  (selected_filters.includes(!!(confirmed)) && igual)   ||  (!selected_filters.includes(!!(confirmed)) && !igual) )){
                     reconciliation_data.push({...i,id:uuidv4(),transation_id:i.id,payment:{...f,confirmed,confirmed_amount:f.confirmed ? f.amount : undefined}})
                  }

                })
            })
            res=reconciliation_data

    }

      _setFilteredContent(res)
      return res

   }



  function update_data(){
    setRows(sortRows(search_f(data[settings.selected])))
     

  }




  function sortRows(rows){
   
    rows.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })

    return rows
   
  }






 

  useEffect(()=>{
    let _settings=JSON.parse(JSON.stringify(settings))
   if(page=='financial-reconciliation'){
       _settings.selected='_transations'
       _settings.hide_checkbox=true
       _settings.required_data=['transations','account_categories','payment_methods']
   }else if(page=="bills-to-receive"){
      _settings.selected='_bills_to_receive'
      _settings.required_data=['bills_to_receive','account_categories']
   }else if(page=="bills-to-pay"){
      _settings.selected='_bills_to_pay'
      page=="bills-to-pay"
      _settings.required_data=['bills_to_pay','account_categories']
   }else if(page=="investments"){
      _settings.selected='_investments'
      _settings.required_data=['investments']
  }else if(page=="loans"){
    _settings.selected='_loans'
    _settings.required_data=['loans']
}else if(page=="budget-management"){
      _settings.selected='_budget'
      _settings.required_data=['budget']
  }else if(page=="account-categories"){
      _settings.selected='_account_categories'
      _settings.required_data=['account_categories']
  }else if(page=="payment-methods"){
      _settings.selected='_payment_methods'
      _settings.required_data=['payment_methods']
  }else if(page=="inflows" || page=="outflows"){
      _settings.selected='_transations'
      _settings.required_data=['transations']
  }else if(page=="clients"){
      _settings.disable_time=true
      _settings.selected='_clients'
      _settings.required_data=['clients']
  }else if(page=="suppliers"){
      _settings.disable_time=true
      _settings.selected='_suppliers'
      _settings.required_data=['suppliers']
  }else if(page=="investors"){
      _settings.disable_time=true
      _settings.selected='_investors'
      _settings.required_data=['investors']
  }else if(page=="managers"){
      _settings.disable_time=true
      _settings.selected='_managers'
      _settings.required_data=['managers']
  }else if(page=="companies"){
    _settings.disable_time=true
    _settings.required_data=['clients','suppliers','investors','managers']
    _settings.hide_checkbox=true
  }

     setSettings(_settings)
     data._get(_settings.required_data)

     
    data._setRequiredData(_settings.required_data)
    
    
 },[])



 
 React.useEffect(()=>{
      data._get(settings.required_data)
},[db,settings])



 

 let columns=[]

   if(page=='financial-reconciliation'){
          columns=[
                   {
                     field: 'edit',
                     headerName: '',
                     width: 70,
                     renderCell: (params) => (
                       <div style={{opacity:.6,marginLeft:'2rem'}}>
                             <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate(`/cash-management/${params.row.type=="in" ? 'inflow' : 'outflow'}/`+params.row.transation_id)}>
                                 <EditOutlinedIcon/>
                             </span>
                             <span className="hidden" onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                                 <DeleteOutlineOutlinedIcon/>
                             </span>
                       </div>
                     )
                 },
                 {
                  field: 'payment_origin',
                  headerName: t('common.payment-method'),
                  width: 170,
                  renderCell: (params) => (
                    <span>{params.row.payment.name}</span>
                  )
                  },
                 {
                  field: 'createdAt',
                  headerName: t('common.creation-date'),
                  width: 170,
                  renderCell: (params) => (
                    <span>{new Date(params.row.createdAt).toISOString().split('T')[0] + " "+ new Date(params.row.createdAt).toISOString().split('T')[1].replace('.000Z','').slice(0,5) || "-"}</span>
                  )
                  },
                 {
                  field: 'description',
                  headerName: t('common.description'),
                  width: 170,
                  renderCell: (params) => (
                    <span>{params.row.description ? params.row.description : '-'}</span>
                  ),editable: true,
                },
                {
                  field: 't_account',
                  headerName: t('common.transaction-account'),
                  width: 150,
                  renderCell: (params) => (
                    <span>{params.row.transation_account.name ? params.row.transation_account.name :'-'}</span>
                  ),
                 },
                 {
                   field: 'amount',
                   headerName: t('common.registed-amount'),
                   width: 150,
                   renderCell: (params) => (
                     <span className={`${params.row.type=='out' ? 'text-red-600' : 'text-green-500'}`}>{params.row.type=='out' ? `(${_cn(params.row.payment.amount)})` : _cn(params.row.payment.amount)}</span>
                   ),
                 },

                 { 
                  field: 'confirmed_amount',
                  headerName: t('common.amount-to-conciliate'),
                  width: 180,
                  renderCell: (params) => (
                        <div className="flex h-full justify-center items-center">
                             {!params.row.payment.confirmed ? <input placeholder="Valor" type="text" onChange={e=>handleReconciliation(params.row,'amount',data._cn_op(e.target.value))} value={params.row.payment.confirmed_amount==undefined ? params.row.payment.amount : params.row.payment.confirmed_amount}  className="block  outline-none w-[70%] p-[5px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-[5px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500" /> : <span className={`${params.row.type=='out' ? 'text-red-600' : 'text-app_orange-300'}`}> {params.row.type=='out' ? '-':''}{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.row.payment.amount) } </span>}   
                        </div>
                  ),
                 },
                 { 
                  field: 'market',
                  headerName: '',
                  width: 5,
                  renderCell: (params) => (
                    <span className="flex h-full justify-center items-center">{params.row.payment.confirmed && <CheckIcon style={{color:'rgb(166, 226, 46)',width:20}}/>}</span>   
                  ),
                 },

                 {
                  field: 'confirm',
                  headerName: '',
                  width: 150,
                  renderCell: (params) => (
                     <>
                      <span className={`${loading ? ' pointer-events-none':''} flex  h-full justify-center items-center relative`}>
                      <div className="absolute scale-[0.6] flex items-center justify-center left-0 top-0 w-full h-full">
                        {( loading==params.row.id ) && <CircularProgress style={{color:params.row.payment.confirmed ? colors.app_orange[500] : '#fff'}} />}
                      </div>
                      {loading!=params.row.id && <DefaultButton
                       onClick={()=>handleReconciliation(params.row,'confirm')}
                       text={!params.row.payment.confirmed ? 'Conciliar' : 'Anular' } no_bg={params.row.payment.confirmed ? true : false} disabled={false}/>
                     }
                     </span> 
                 
                     </>
                   ),
                 },
         

           ]
         
   }else if(page=="bills-to-pay" || page=="bills-to-receive"){
          columns= [
            {
              field: 'edit',
              headerName: '',
              width: 70,
              renderCell: (params) => (
                <div style={{opacity:.6}}>
                      <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/'+page+'/'+params.row.id)}>
                          <EditOutlinedIcon/>
                      </span>
                      <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                          <DeleteOutlineOutlinedIcon/>
                      </span>
                </div>
              )
          },
        {
            field: 'index',
            headerName: '',
            width:10,
            renderCell: (params) => (
              <span>{params.row.repeat_details.times!=1 ? `${params.row.index + 1}/${params.row.repeat_details.times}` : ''}</span>
            )
        },
        {
          field: 'pay_day',
          headerName: t('common.due-date'),
          width: 170,
          renderCell: (params) => (
            <span>{params.row.payday ? params.row.payday.split('T')[0] : '-'}</span>
          )
        },
          {
            field: 'description',
            headerName: t('common.description'),
            width: 200,
            renderCell: (params) => (
              <span>{params.row.description ? params.row.description : '-'}</span>
            ),editable: true,
          },
          {
            field: 'left',
            headerName: t('common.missing-amount'),
            width: 150,
            renderCell: (params) => (
              <span>{params.row.amount ? data._cn((parseFloat(params.row.amount) + parseFloat(params.row.fees ? params.row.fees : 0) - parseFloat(params.row.paid ? params.row.paid : 0)) <= 0 ? 0 : (parseFloat(params.row.amount) + parseFloat(params.row.fees ? params.row.fees : 0) - parseFloat(params.row.paid ? params.row.paid : 0)))  : '-'}</span>
            ),
          },
          
          {
            field: 'amount',
            headerName: (page=="bills-to-pay" ? t('common.total-to-pay') :t('common.total-to-receive')),
            width: 150,
            renderCell: (params) => (
              <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
            ),
          }
          ,
          {
            field: 'status',
            headerName: t('common.state'),
            width: 120,
            renderCell: (params) => (
              <div>
                
                      <span style={{backgroundColor:!params.row.status || params.row.status=='paid' ? colors.common.paid :  new Date(params.row.payday) >= new Date(data._today()) ? colors.common.pending: colors.common.delayed , color: '#fff' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='paid' || !params.row.status ? t('common.paid') : new Date(params.row.payday) >= new Date(data._today())  ? 'Pendente' : 'Atrasado'}</span>
                
              </div>
            )
          },
          {
            field: 'paid',
            headerName: page=="bills-to-pay" ? t('common.paid') : t('common.received'),
            width: 170,
            renderCell: (params) => (
            <span>{params.row.paid ? data._cn(params.row.paid) : '-'}</span>
            )
          },
          {
            field: 'fees',
            headerName: t('common.fine'),
            width: 170,
            renderCell: (params) => (
            <span>{params.row.fees ? data._cn(params.row.fees) : '-'}</span>
            )
          },
          {
            field: 'name',
            headerName: t('common.account'),
            width: 150,
            renderCell: (params) => (
              <span>{data._account_categories.filter(i=>i.id==params.row.account_id)[0]?.name}</span>
            ),
          },
          
          {
            field: 'account_origin',
            headerName:t('common.category'),
            width: 210,
            renderCell: (params) => (
              <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
            ),
          },
          
          {
            field: 'payment_type',
            headerName: t('common.payment-type'),
            width: 150,
            renderCell: (params) => (
              <span>{params.row.payment_type=="single" || params.row.total_installments==1  ? 'Único' : 'Em prestações'}</span>
            ),
          },
          {
            field: 'installments',
            headerName: t('common.numbers-of-installments'),
            width: 150,
            renderCell: (params) => (
              <span>{params.row.total_installments}</span>
            ),
          },
        
        {
          field: 'doc_number',
          headerName: t('invoice.invoice-number'),
          width: 150,
          renderCell: (params) => (
            <span>{params.row.invoice_number ? params.row.invoice_number : '-'}</span>
          )
        },


        {
          field: 'createdAt',
          headerName: t('common.creation-date'),
          width: 170,
          renderCell: (params) => (
            <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
          )
        },
        
      

      ];
   }else if(page=="investments"){
    columns= [
      {
        field: 'edit',
        headerName: '',
        width: 70,
        renderCell: (params) => (
          <div style={{opacity:.6}}>
                <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/investments/'+params.row.id)}>
                    <EditOutlinedIcon/>
                </span>
                <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                    <DeleteOutlineOutlinedIcon/>
                </span>
          </div>
        )
    },
    {
      field: 'name',
      headerName: t('common.description'),
      width: 150,
      renderCell: (params) => (
        <span>{params.row.description}</span>
      ),
    },
    {
      field: 'amount',
      headerName: t('common.cost'),
      width: 150,
      renderCell: (params) => (
        <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
      ),
    },
    {
      field: 'description',
      headerName: t('common.period'),
      width: 170,
      renderCell: (params) => (
        <span>{params.row.time} {params.row.period== "year" ? t('common.years') : t('common.period') }</span>
      )
    },
    {
      field: 'depreciantion',
      headerName: t('common.depreciation-amount'),
      width: 170,
      renderCell: (params) => (
        <span>{data._cn(parseFloat(params.row.depreciation).toFixed(2))}</span>
      )
    },
    {
      field: 'buyday',
      headerName: t('common.buying-amount'),
      width: 170,
      renderCell: (params) => (
        <span>{params.row.buyday.split('T')[0]}</span>
      )
    },
    {
      field: 'createdAt',
      headerName: t('common.creation-date'),
      width: 170,
      renderCell: (params) => (
        <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
      )
    },
  


];


}else if(page=="loans"){
  columns= [
    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
        <div style={{opacity:.6}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/loans/'+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
        </div>
      )
  },
  {
    field: 'payday',
    headerName: t('common.due-date'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.payday.split('T')[0]}</span>
    )
  },
  {
    field: 'name',
    headerName: t('common.description'),
    width: 150,
    renderCell: (params) => (
      <span>{params.row.description}</span>
    ),
  },
  {
    field: 'amount',
    headerName: t('common.loan-amount'),
    width: 200,
    renderCell: (params) => (
      <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
    ),
  },
  {
    field: 'paid',
    headerName: t('common.paid'),
    width: 170,
    renderCell: (params) => (
      <span>{data._cn(parseFloat(params.row.paid ? params.row.paid : 0)) }</span>
    )
  },
  {
    field: 'description',
    headerName: t('common.fees-to-pay'),
    width: 170,
    renderCell: (params) => (
      <span>{data._cn(parseFloat(params.row.transation_fees))}</span>
    )
  },
  {
    field: 'status',
    headerName: t('common.state'),
    width: 120,
    renderCell: (params) => (
      <div>
        
              <span style={{backgroundColor:!params.row.status || params.row.status=='paid' ? colors.common.paid :  new Date(params.row.payday) >= new Date(data._today()) ? colors.common.pending: colors.common.delayed , color: '#fff' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='paid' || !params.row.status ? t('common.paid') : new Date(params.row.payday) >= new Date(data._today())  ? 'Pendente' : 'Atrasado'}</span>
        
      </div>
    )
  },
  {
    field: 'depreciantion',
    headerName: t('common.each-installment-amount'),
    width: 170,
    renderCell: (params) => (
      <span>{data._cn(parseFloat(params.row.installment_amount).toFixed(2))}</span>
    )
  },
 
  {
    field: 'installments',
    headerName: t('common.installment-amount'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.total_installments}</span>
    )
  },
  {
    field: 'account',
    headerName: t('common.account'),
    width: 150,
    renderCell: (params) => (
      <span>{data._account_categories.filter(i=>i.id==params.row.account_id)[0]?.name}</span>
    ),
  },
  {
    field: 'next_payment',
    headerName: t('common.next-payment'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.installments.filter(i=>new Date(data._today()) <= new Date(i.end.split('T')[0])).length  ? params.row.installments.filter(i=>new Date(data._today()) <= new Date(i.end.split('T')[0]))?.[0]?.end?.split('T')?.[0] :''}</span>
    )
  },
  {
    field: 'buyday',
    headerName: t('common.loan-date'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.loanday.split('T')[0]}</span>
    )
  },
  {
    field: 'createdAt',
    headerName: t('common.creation-date'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
    )
  },



];


}else if(page=="budget-management"){
      columns= [
        {
          field: 'edit',
          headerName: '',
          width: 70,
          renderCell: (params) => (
            <div style={{opacity:.6}}>
                  <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/budget-management/'+params.row.id)}>
                      <EditOutlinedIcon/>
                  </span>
                  <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                      <DeleteOutlineOutlinedIcon/>
                  </span>
            </div>
          )
      },
      {
        field: 'name',
        headerName: t('common.account-category'),
        width: 150,
        renderCell: (params) => (
          <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
        ),
      },
      {
        field: 'desc',
        headerName: t('common.description'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.description ? params.row.description :'-'}</span>
        ),
      },
      {
        field: 'projected',
        headerName: t('common.projected'),
        width: 170,
        renderCell: (params) => (
          <span>{_cn(params.row.items.map(item => parseFloat(item.value)).reduce((acc, curr) => acc + curr, 0))}</span>
        ),editable: true,
      },
      {
        field: 'done',
        headerName: t('common.done'),
        width: 170,
        renderCell: (params) => (
          <span>{_cn(data._transations.filter(i=>i.account_origin==params.row.account_origin).map(item => (item.type=="out" ? - (parseFloat(item.amount)) : parseFloat(item.amount))).reduce((acc, curr) => acc + curr, 0))}</span>
        ),editable: true,
      },
      {
        field: 'time',
        headerName: t('common.period'),
        width: 220,
        renderCell: (params) => (
          <span>{data._convertDateToWords(params.row.items[0].picker.startDate.split('T')[0])} - {data._convertDateToWords(params.row.items[params.row.items.length - 1].picker.endDate.split('T')[0]) }</span>
        ),editable: true,
      },
      
      {
        field: 'createdAt',
        headerName: t('common.creation-date'),
        width: 170,
        renderCell: (params) => (
          <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
        )
      },



];

}else if(page=="account-categories"){
  columns = [
    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
         <div style={{opacity:.8}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/account/'+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
         </div>
      )
   },
    {
        field: 'name',
        headerName: t('common.name'),
        width: 200,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      
      {
        field: 'origin',
        headerName: t('common.category'),
        width: 200,
        renderCell: (params) => (
          <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
        ),
      },
      {
        field: 'last_name',
        headerName: t('common.notes'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.description ? params.row.description : '-'}</span>
        ),
      },
     
   

];
}else if(page=="payment-methods"){
  columns = [
    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
         <div style={{opacity:.8}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/payment-methods/'+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
         </div>
      )
   },
    {
        field: 'name',
        headerName: t('common.name'),
        width: 200,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },

      /*{
        field: 'balance',
        headerName: t('common.balance'),
        width: 200,
        renderCell: (params) => (
          <span>{parseFloat(params.row.has_initial_amount ? params.row.initial_amount : 0)  (data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0) - data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))}</span>
        ),
      },*/

      ,{
        field: 'balance',
        headerName: t('common.balance'),
        width: 200,
        renderCell: (params) => (
          <span>{parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((params.row.has_initial_amount ? params.row.initial_amount : 0)) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)))} </span>
        ),
      },
     
      {
        field: 'type',
        headerName: 'Tipo',
        width: 200,
        renderCell: (params) => (
          <span>{params.row.type=="mobile" ? t('common.mobile') : params.row.type=="bank" ? t('common.bank') : params.row.type=="cashier" ? t('common.cahier') : t('common.another')}</span>
        ),
      },

      {
        field: 'notes',
        headerName: t('common.notes'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.description ? params.row.description : '-'}</span>
        ),
      },
     
   

];
}else if(page=="inflows" || page=="outflows"){
   columns = [

    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
         <div style={{opacity:.7}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate(`/cash-management/${params.row.type=="in" ? 'inflow' : 'outflow'}/`+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
         </div>
      )
  },

    {
      field: 'description',
      headerName: t('common.description'),
      width: 170,
      renderCell: (params) => (
        <span>{params.row.description ? params.row.description : '-'}</span>
      ),editable: true,
    },
    {
      field: 'amount',
      headerName: t('common.amount'),
      width: 150,
      renderCell: (params) => (
        <span>{params.row.amount ? data._cn(parseFloat(params.row.amount))  : '-'}</span>
      ),
    },
    {
      field: 'account',
      headerName: t('common.description'),
      width: 150,
      renderCell: (params) => (
        <span>{params.row.account.name ? params.row.account.name :'-'}</span>
      ),
    },
    {
      field: 't_account',
      headerName: t('common.transaction-account'),
      width: 150,
      renderCell: (params) => (
        <span>{params.row.transation_account.name ? params.row.transation_account.name :'-'}</span>
      ),
    },
    {
      field: 'name',
      headerName: t('common.category'),
      width: 210,
      renderCell: (params) => (
        <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
      ),
    },
    {
      field: 'payment_type',
      headerName: t('common.transaction-type'),
      width: 150,
      renderCell: (params) => (
         <span style={{backgroundColor:params.row.type=='in' ? '#C9E8E8': 'rgb(255 244 198)', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}> {params.row.type=="in" ? 'Entrada' : 'Saída'} </span>
      ),
    },
    {
      field: 'fees',
      headerName:t('common.fine'),
      width: 170,
      renderCell: (params) => (
      <span>{params.row.fees ? data._cn(params.row.fees) : '-'}</span>
      )
    },
    {
      field: 'reference',
      headerName: t('common.reference'),
      width: 150,
      renderCell: (params) => (
         <span>{params.row.reference.name ? params.row.reference.name :'-'}</span>
      ),
    },
    
  {
    field: 'createdAt',
    headerName: t('common.creation-date'),
    width: 170,
    renderCell: (params) => (
      <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
    )
  },
  
  

];
}else if(page=="clients" || page=="suppliers" || page=="investors"){

  columns = [
    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
         <div style={{opacity:.8}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate(`/${page.slice(0,page.length - 1)}/`+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
         </div>
      )
    },
    {
        field: 'name',
        headerName: t('common.name'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.email ? params.row.email : '-'}</span>
        ),
      },
      {
        field: 'contacts',
        headerName: t('common.contacts'),
        width: 170,
        renderCell: (params) => (
          <div>
              {params.row.contacts.map((i,_i)=>(
                      <span key={_i}>{i}{_i!=params.row.contacts.length - 1 && ', '}</span>
              ))}
               <span>{!params.row.contacts.length && '-'}</span>
          </div>
        ),editable: true,
      },

       {
        field: 'address',
        headerName: t('common.address'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
    
    {
        field: 'notes',
        headerName: t('common.notes'),
        width: 170,
        renderCell: (params) => (
        <span>-</span>
        )
    },
    {
      field: '-',
      headerName: t('common.creation-date'),
      width: 170,
      renderCell: (params) => (
      <span>-</span>
      )
    },
    
   

];

}else if(page=="managers"){

  

  columns = [
    {
        field: 'edit',
        headerName: '',
        width: 70,
        renderCell: (params) => (
          <div style={{opacity:.8}}>

          {(user.companies_details.filter(i=>i.admin_id==user.id).some(i=>params.row.companies.includes(i.id)) || user.email==params.row.email) ? <>
            <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/manager/'+params.row.id)}>
              <EditOutlinedIcon/>
          </span>

          {user.companies_details.filter(i=>i.admin_id==user.id).some(i=>params.row.companies.includes(i.id)) && <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
              <DeleteOutlineOutlinedIcon/>
          </span>}
          
          </>:<>
         
          <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/manager/'+params.row.id)}>
               <RemoveRedEyeOutlinedIcon/>
          </span>
          </>}
        </div>
        )
      },
      
     
      {
        field: 'name',
        headerName: t('common.name'),
        width: 150,
        renderCell: (params) => (
          <span className={`${params.row.id==user.id ? 'text-app_orange-400':''}`}>{params.row.name ? params.row.name : '-'} {params.row.id==user.id && '(Você)'}</span>
        
        ),
      },
      {
        field: 'last_name',
        headerName: t('common.surname'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.last_name ? params.row.last_name : '-'}</span>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 190,
        renderCell: (params) => (
          <span>{params.row.email ? params.row.email : '-'}</span>
        ),
      },
      {
        field: 'companies',
        headerName: t('common.companies'),
        width: 300,
        renderCell: (params) => (
          <span>{user.companies_details.filter(i=>params.row.companies.includes(i.id)).map(i=>i.name).join(', ')}</span>
        ),
      },
      {
        field: 'contacts',
        headerName: t('common.contacts'),
        width: 170,
        renderCell: (params) => (
          <div>
              {params.row.contacts.map((i,_i)=>(
                      <span key={_i}>{i}{_i!=params.row.contacts.length - 1 && ', '}</span>
              ))}
               <span>{!params.row.contacts.length && '-'}</span>
          </div>
        ),editable: true,
      },

       {
        field: 'address',
        headerName: t('common.address'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
     
      {
          field: 'notes',
          headerName: t('common.notes'),
          width: 170,
          renderCell: (params) => (
          <span>-</span>
          )
      },
      {
        field: '-',
        headerName: t('common.creation-date'),
        width: 170,
        renderCell: (params) => (
        <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
        )
      },
      
    
];
}else if(page=="companies"){
  columns = [
    
    {
      field: 'login',
      headerName: '',
      width: 80,
      renderCell: (params) => (
         <div>
          {params.row.id!=user.selected_company && <span onClick={()=>_change_company(params.row.id)} className=" flex rounded-sm text-app_orange-400 cursor-pointer underline">Login</span>}
         </div>
      )
    },
    {
      field: 'edit',
      headerName: '',
      width: 70,
      renderCell: (params) => (
         <div style={{opacity:.8}}>
              {params.row.admin_id==user.id ? <>

                <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/company/'+params.row.id)}>
                  <EditOutlinedIcon/>
              </span>
              <span className={`${params.row.id==user.selected_company ? 'hidden':''}`} onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
              
              </>:<>
             
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/company/'+params.row.id)}>
                   <RemoveRedEyeOutlinedIcon/>
              </span>
              </>}
         </div>
      )
    },
    {
        field: 'name',
        headerName: t('common.name'),
        width: 150,
        renderCell: (params) => (
          <span className={`${params.row.id==user.selected_company ? 'text-app_orange-400':''}`}>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      {
        field: 'Filial de:',
        headerName: t('common.company-of'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.headquarter_id ? user.companies_details.filter(i=>i.id==params.row.headquarter_id)[0].name  : '-'}</span>
        ),
      },
      /*{
        field: 'm',
        headerName: 'Gestores',
        width: 150,
        renderCell: (params) => (
          <span>{data._managers.filter(i=>i.companies.includes(params.row.id)).length ? data._managers.filter(i=>i.companies.includes(params.row.id)).map(i=>i.name).join(', ') : '-'}</span>
        ),
      },
      {
        field: 'c',
        headerName: 'Total clientes',
        width: 150,
        renderCell: (params) => (
          <span>{data._clients.length ? data._clients.length : '-'}</span>
        ),
      },
      {
        field: 'f',
        headerName: 'Total fornecedores',
        width: 150,
        renderCell: (params) => (
          <span>{data._suppliers.length ? data._suppliers.length : '-'}</span>
        ),
      },
      {
        field: 'i',
        headerName: 'Total investidores',
        width: 150,
        renderCell: (params) => (
          <span>{data._investors.length ? data._investors.length : '-'}</span>
        ),
      },*/
      {
        field: 'contacts',
        headerName: t('common.contacts'),
        width: 170,
        renderCell: (params) => (
          <div>
              {params.row.contacts.map((i,_i)=>(
                      <span key={_i}>{i}{_i!=params.row.contacts.length - 1 && ', '}</span>
              ))}
               <span>{!params.row.contacts.length && '-'}</span>
          </div>
        ),editable: true,
      },

       {
        field: 'address',
        headerName: t('common.address'),
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
  
    {
      field: '-',
      headerName: t('common.creation-date'),
      width: 170,
      renderCell: (params) => (
        <span>{params.row.createdAt ? params.row.createdAt.split('T')[0] : '-'}</span>
      )
    }, 
    
    

];
}



  useEffect(()=>{
        update_data()
  },[data])

  

  useEffect(()=>{
    if(settings.selected) {
      let content=search_f(data[settings.selected])
      setRows(sortRows(content))
    }

  },[search,filterOptions,periodFilters,settings])


 function handleDelete(id){
    let ids=JSON.parse(JSON.stringify([...selectedItems.filter(i=>i!=id), id]))
    setSelectedItems(ids)
    setItemsToDelete(rows.filter(i=>ids.includes(i.id)))
 }



 return (
   <Box sx={{ height:'400px', width: '100%' }}>
     <DataGrid
       rows={rows}
       columns={columns}
       initialState={{
         pagination: {
           paginationModel: {
             pageSize: 6,
           },
         },
       }}
       pageSizeOptions={[6]} 
       sx={{
           '& .MuiDataGrid-root': {
             borderTop: 'none',
           },
       }}
       checkboxSelection={!Boolean(settings.hide_checkbox)}
       disableColumnMenu
       disableSelectionOnClick
       isRowSelectable={false}
       onRowSelectionModelChange={(e)=>setSelectedItems(e)}
       localeText={{ noRowsLabel: <TableLoader loading={settings.required_data.filter(i=>!_loaded.includes(i)).length ? true : false}/>}}
     />
   </Box>
 );
}
