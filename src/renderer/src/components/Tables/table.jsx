import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../components/progress/TableProgress'
import { useData } from '../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import CheckIcon from '@mui/icons-material/Check';
import { useSearchParams, useLocation } from 'react-router-dom';
import colors from '../../assets/colors.json'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useAuth } from '../../contexts/AuthContext';
import DefaultButton from '../Buttons/default';


export default function Table({setSearch,setItemsToDelete,search,filterOptions,page,periodFilters,_setFilteredContent,setFilterOptions,setDatePickerPeriodOptions,clearAllFilters}) {
  const {_get,_loaded,_update,_payment_methods,_categories,_cn}= useData()
  const data=useData()
  const {user} = useAuth()
  const navigate=useNavigate()
  const [selectedItems,setSelectedItems]=React.useState([])
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
      _get('managers')
      _get('companies')
   },[pathname])

  settings.selected

  
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



  



  

  function consiliate(data,confirmed_amount){
      if((!confirmed_amount || confirmed_amount <= 0 || isNaN(confirmed_amount)) && confirmed_amount!=undefined){
          toast.error('Valor deve ser maior que 0')
          return
      }

      _update('transations',[data])
  }
  

  
  function search_f(array){

      let res=data._search(search,array,filterOptions,periodFilters)

      if(page=="inflows" || page=="outflows"){
          res=res.filter(v=>v.type==(page=="inflows" ? 'in' :'out'))
      }

      if(page=="managers"){
        res=res.filter(v=>v.id!=user.id)
      }

      _setFilteredContent(res)
      return res

   }



  function update_data(){

    console.log({ddddddddd:data[settings.selected]})


    console.log(search_f(data[settings.selected]))

      setRows(search_f(data[settings.selected]))

  }







 

  useEffect(()=>{

    let _settings=JSON.parse(JSON.stringify(settings))

   if(page=='financial-reconciliation'){
       _settings.selected='_transations'
       _settings.hide_checkbox=true
       _settings.required_data=['transations','account_categories']
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
      _settings.selected='_clients'
      _settings.required_data=['clients']
  }else if(page=="suppliers"){
      _settings.selected='_suppliers'
      _settings.required_data=['suppliers']
  }else if(page=="investors"){
      _settings.selected='_investors'
      _settings.required_data=['investors']
  }else if(page=="managers"){
      _settings.selected='_managers'
      _settings.required_data=['managers']
  }else if(page=="companies"){
    _settings.selected='_companies'
    _settings.required_data=['companies']
    _settings.hide_checkbox=true
  }
     setSettings(_settings)

     _settings.required_data.forEach(i=>{
      data._get(i)
    })
   
 },[])



 function change_row_value(id,field,value){
       let index=rows.findIndex(i=>i.id==id)
        setRows(search_f(rows.map((i,_i)=>{
           return _i==index ? {...i,[field]:value} : i
        })))
 }


 

 

 let columns=[]

   if(page=='financial-reconciliation'){
          columns=[
                   {
                     field: 'edit',
                     headerName: '',
                     width: 70,
                     renderCell: (params) => (
                       <div style={{opacity:.6,marginLeft:'2rem'}}>
                             <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/cash-management/'+params.row._id)}>
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
                  headerName: 'Método de pagamento',
                  width: 170,
                  renderCell: (params) => (
                    <span>{_payment_methods.filter(i=>i.id==params.row.payment_origin)[0]?.name}</span>
                  )
                  },
                 {
                  field: 'createdAt',
                  headerName: 'Data de criação',
                  width: 170,
                  renderCell: (params) => (
                    <span>{new Date(params.row.createdAt).toISOString().split('T')[0] + " "+ new Date(params.row.createdAt).toISOString().split('T')[1].replace('.000Z','').slice(0,5) || "-"}</span>
                  )
                  },
                 {
                  field: 'description',
                  headerName: 'Descrição',
                  width: 170,
                  renderCell: (params) => (
                    <span>{params.row.description ? params.row.description : '-'}</span>
                  ),editable: true,
                },
                {
                  field: 't_account',
                  headerName: 'Conta de transação',
                  width: 150,
                  renderCell: (params) => (
                    <span>{params.row.transation_account.name ? params.row.transation_account.name :'-'}</span>
                  ),
                 },
                 {
                   field: 'amount',
                   headerName: 'Valor registrado',
                   width: 150,
                   renderCell: (params) => (
                     <span className={`${params.row.type=='out' ? 'text-red-600' : ''}`}>{params.row.type=='out' ? '-':''}{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.row.amount)}</span>
                   ),
                 },
                 { 
                  field: 'confirmed_amount',
                  headerName: 'Valor por conciliar',
                  width: 180,
                  renderCell: (params) => (
                        <div className="flex h-full justify-center items-center">
                             {!params.row.confirmed ? <input placeholder="Valor"   type="number" onChange={e=>change_row_value(params.row.id,'confirmed_amount',e.target.value)} value={params.row.confirmed_amount==undefined ? params.row.amount : params.row.confirmed_amount}  className="block  outline-none w-[70%] p-[5px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-[5px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" /> : <span className={`${params.row.type=='out' ? 'text-red-600' : ''}`}> {params.row.type=='out' ? '-':''}{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.row.amount) } </span>}   
                        </div>
                  ),
                 },

                 {
                  field: 'confirm',
                  headerName: '',
                  width: 150,
                  renderCell: (params) => (
                      <span className="flex h-full justify-center items-center"   onClick={()=>consiliate({...params.row,confirmed:true,amount:params.row.confirmed_amount ? params.row.confirmed_amount : params.row.amount },params.row.confirmed_amount)}>{params.row.confirmed ? <CheckIcon style={{color:'rgb(166, 226, 46)'}}/> : <Button style={{width:'80%'}} variant="contained">Conciliar</Button>}</span> 
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
                      <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/'+page+'/'+params.row._id)}>
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
          headerName: 'Data de vencimento',
          width: 170,
          renderCell: (params) => (
            <span>{params.row.payday ? params.row.payday.split('T')[0] : '-'}</span>
          )
        },
          {
            field: 'description',
            headerName: 'Descrição',
            width: 200,
            renderCell: (params) => (
              <span>{params.row.description ? params.row.description : '-'}</span>
            ),editable: true,
          },
          {
            field: 'left',
            headerName: 'Valor em falta',
            width: 150,
            renderCell: (params) => (
              <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount) + parseFloat(params.row.fees ? params.row.fees : 0) - parseFloat(params.row.paid ? params.row.paid : 0))  : '-'}</span>
            ),
          },
          
          {
            field: 'amount',
            headerName: 'Total a '+(page=="bills-to-pay" ? 'pagar' :'receber'),
            width: 150,
            renderCell: (params) => (
              <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
            ),
          }
          ,
          {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
              <div>
                
                      <span style={{backgroundColor:!params.row.status || params.row.status=='paid' ? colors.common.paid :  new Date(params.row.payday) >= new Date(data._today()) ? colors.common.pending: colors.common.delayed , color: '#fff' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='paid' || !params.row.status ? 'Pago' : new Date(params.row.payday) >= new Date(data._today())  ? 'Pendente' : 'Atrasado'}</span>
                
              </div>
            )
          },
          {
            field: 'paid',
            headerName: page=="bills-to-pay" ? 'Valor pago ' : 'Valor recebido',
            width: 170,
            renderCell: (params) => (
            <span>{params.row.paid ? data._cn(params.row.paid) : '-'}</span>
            )
          },
          {
            field: 'fees',
            headerName: 'Multa',
            width: 170,
            renderCell: (params) => (
            <span>{params.row.fees ? data._cn(params.row.fees) : '-'}</span>
            )
          },
          {
            field: 'name',
            headerName: 'Conta',
            width: 150,
            renderCell: (params) => (
              <span>{data._account_categories.filter(i=>i.id==params.row.account_id)[0]?.name}</span>
            ),
          },
          
          {
            field: 'account_origin',
            headerName: 'Categoria',
            width: 180,
            renderCell: (params) => (
              <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
            ),
          },
          
          {
            field: 'payment_type',
            headerName: 'Tipo de pagamento',
            width: 150,
            renderCell: (params) => (
              <span>{params.row.payment_type=="single" || params.row.total_installments==1  ? 'Único' : 'Em prestações'}</span>
            ),
          },
          {
            field: 'installments',
            headerName: 'Número de prestações',
            width: 150,
            renderCell: (params) => (
              <span>{params.row.total_installments}</span>
            ),
          },
        
        {
          field: 'doc_number',
          headerName: 'Número da fatura',
          width: 150,
          renderCell: (params) => (
            <span>{params.row.invoice_number ? params.row.invoice_number : '-'}</span>
          )
        },


        {
          field: 'createdAt',
          headerName: 'Data de criação',
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
                <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/investments/'+params.row._id)}>
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
      headerName: 'Descrição',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.description}</span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Custo',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
      ),
    },
    {
      field: 'description',
      headerName: 'Período',
      width: 170,
      renderCell: (params) => (
        <span>{params.row.time} {params.row.period== "year" ? 'Anos' : 'Meses'}</span>
      ),editable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Data de criação',
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
                  <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/budget-management/'+params.row._id)}>
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
        headerName: 'Categoria de conta',
        width: 150,
        renderCell: (params) => (
          <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
        ),
      },
      {
        field: 'desc',
        headerName: 'Descrição',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.description ? params.row.description :'-'}</span>
        ),
      },
      {
        field: 'projected',
        headerName: 'Projectado',
        width: 170,
        renderCell: (params) => (
          <span>{_cn(params.row.items.map(item => parseFloat(item.value)).reduce((acc, curr) => acc + curr, 0))}</span>
        ),editable: true,
      },
      {
        field: 'done',
        headerName: 'Realizado',
        width: 170,
        renderCell: (params) => (
          <span>{_cn(data._transations.filter(i=>i.account_origin==params.row.account_origin).map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0))}</span>
        ),editable: true,
      },
      {
        field: 'time',
        headerName: 'Período',
        width: 220,
        renderCell: (params) => (
          <span>{data._convertDateToWords(params.row.items[0].picker.startDate.split('T')[0])} - {data._convertDateToWords(params.row.items[params.row.items.length - 1].picker.endDate.split('T')[0]) }</span>
        ),editable: true,
      },
      
      {
        field: 'createdAt',
        headerName: 'Data de criação',
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
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/account/'+params.row._id)}>
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
        headerName: 'Nome',
        width: 200,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      
      {
        field: 'origin',
        headerName: 'Categoria',
        width: 200,
        renderCell: (params) => (
          <span>{_categories.filter(i=>i.field==params.row.account_origin)[0].name}</span>
        ),
      },
      {
        field: 'last_name',
        headerName: 'Notas',
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
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/payment-methods/'+params.row._id)}>
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
        headerName: 'Nome',
        width: 200,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },

      /*{
        field: 'balance',
        headerName: 'Saldo',
        width: 200,
        renderCell: (params) => (
          <span>{parseFloat(params.row.has_initial_amount ? params.row.initial_amount : 0)  (data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0) - data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))}</span>
        ),
      },*/
      ,{
        field: 'balance',
        headerName: 'Saldo',
        width: 200,
        renderCell: (params) => (
          <span>{parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((params.row.initial_amount ? params.row.initial_amount : 0)) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==params.row.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)))} </span>
        ),
      },
     
      {
        field: 'type',
        headerName: 'Tipo',
        width: 200,
        renderCell: (params) => (
          <span>{params.row.type=="mobile" ? 'Móvel' : params.row.type=="bank" ? 'Bancária' : params.row.type=="cashier" ? 'Caixa' : 'Outro'}</span>
        ),
      },

      {
        field: 'notes',
        headerName: 'Notas',
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
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate(`/cash-management/${params.row.type=="in" ? 'inflow' : 'outflow'}/`+params.row._id)}>
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
      headerName: 'Descrição',
      width: 170,
      renderCell: (params) => (
        <span>{params.row.description ? params.row.description : '-'}</span>
      ),editable: true,
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.amount ? data._cn(parseFloat(params.row.amount))  : '-'}</span>
      ),
    },
    {
      field: 'account',
      headerName: 'Conta de lançamento',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.account.name ? params.row.account.name :'-'}</span>
      ),
    },
    {
      field: 't_account',
      headerName: 'Conta de transação',
      width: 150,
      renderCell: (params) => (
        <span>{params.row.transation_account.name ? params.row.transation_account.name :'-'}</span>
      ),
    },
    {
      field: 'payment_type',
      headerName: 'Tipo de transação',
      width: 150,
      renderCell: (params) => (
         <span style={{backgroundColor:params.row.type=='in' ? '#C9E8E8': 'rgb(255 244 198)', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}> {params.row.type=="in" ? 'Entrada' : 'Saída'} </span>
      ),
    },
    {
      field: 'fees',
      headerName: 'Multa',
      width: 170,
      renderCell: (params) => (
      <span>{params.row.fees ? data._cn(params.row.fees) : '-'}</span>
      )
    },
    {
      field: 'reference',
      headerName: 'Referência',
      width: 150,
      renderCell: (params) => (
         <span>{params.row.reference.name ? params.row.reference.name :'-'}</span>
      ),
    },
    
  {
    field: 'createdAt',
    headerName: 'Data de criação',
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
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate(`/${page.slice(0,page.length - 1)}/`+params.row._id)}>
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
        headerName: 'Nome',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      {
        field: 'last_name',
        headerName: 'Apelido',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.last_name ? params.row.last_name : '-'}</span>
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
        headerName: 'Contactos',
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
        headerName: 'Endereço',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <div>
           
                <span style={{backgroundColor:!params.row.status || params.row.status=='active' ? '#C9E8E8': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='active' || !params.row.status ? 'Activo' : 'Inactivo'}</span>
           
        </div>
      )
    },
    {
        field: 'notes',
        headerName: 'Observações',
        width: 170,
        renderCell: (params) => (
        <span>-</span>
        )
    },
    {
      field: '-',
      headerName: 'Data de  criação',
      width: 170,
      renderCell: (params) => (
      <span>-</span>
      )
    },
    
   

];

}else if(page=="managers"){

  function change_c(){

  }

  

  columns = [
    {
        field: 'edit',
        headerName: '',
        width: 70,
        renderCell: (params) => (
          <div style={{opacity:.8}}>
          {user.companies.filter(i=>i.admin_id==user.id).some(i=>params.row.companies.includes(i.id)) ? <>

            <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/manager/'+params.row._id)}>
              <EditOutlinedIcon/>
          </span>
          <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
              <DeleteOutlineOutlinedIcon/>
          </span>
          
          </>:<>
         
          <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/manager/'+params.row._id)}>
               <RemoveRedEyeOutlinedIcon/>
          </span>
          </>}
        </div>
        )
      },
      
     
      {
        field: 'name',
        headerName: 'Nome',
        width: 150,
        renderCell: (params) => (
          <span className={`${params.row.id==user.id ? 'text-app_orange-400':''}`}>{params.row.name ? params.row.name : '-'} {params.row.id==user.id && '(Você)'}</span>
        
        ),
      },
      {
        field: 'last_name',
        headerName: 'Apelido',
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
        headerName: 'Empresas',
        width: 300,
        renderCell: (params) => (
          <span>{data._companies.filter(i=>params.row.companies.includes(i.id)).map(i=>i.name).join(', ')}</span>
        ),
      }
     ,
      {
        field: 'contacts',
        headerName: 'Contactos',
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
        headerName: 'Endereço',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
      {
        field: 'status',
        headerName: 'Estado',
        width: 120,
        renderCell: (params) => (
          <div>
            
                  <span style={{backgroundColor:!params.row.status || params.row.status=='active' ? '#C9E8E8': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='active' || !params.row.status ? 'Activo' : 'Inactivo'}</span>
            
          </div>
        )
      },
      {
          field: 'notes',
          headerName: 'Observações',
          width: 170,
          renderCell: (params) => (
          <span>-</span>
          )
      },
      {
        field: '-',
        headerName: 'Data de  criação',
        width: 170,
        renderCell: (params) => (
        <span>-</span>
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
          {params.row.id!=user.company.id && <span onClick={()=>data._change_company(params.row)} className=" flex rounded-sm text-app_orange-400 cursor-pointer underline">Login</span>}
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

                <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/company/'+params.row._id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
              
              </>:<>
             
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/company/'+params.row._id)}>
                   <RemoveRedEyeOutlinedIcon/>
              </span>
              </>}
         </div>
      )
    },
    {
        field: 'name',
        headerName: 'Nome',
        width: 150,
        renderCell: (params) => (
          <span className={`${params.row.id==user.company.id ? 'text-app_orange-400':''}`}>{params.row.name ? params.row.name : '-'}</span>
        ),
      },
      {
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
          <span>{data._clients.filter(i=>i.company_id==params.row.id).length ? data._clients.filter(i=>i.company_id==params.row.id).length : '-'}</span>
        ),
      },
      {
        field: 'c',
        headerName: 'Total fornecedores',
        width: 150,
        renderCell: (params) => (
          <span>{data._suppliers.filter(i=>i.company_id==params.row.id).length ? data._suppliers.filter(i=>i.company_id==params.row.id).length : '-'}</span>
        ),
      },
      {
        field: 'c',
        headerName: 'Total investidores',
        width: 150,
        renderCell: (params) => (
          <span>{data._investors.filter(i=>i.company_id==params.row.id).length ? data._investors.filter(i=>i.company_id==params.row.id).length : '-'}</span>
        ),
      },
      {
        field: 'contacts',
        headerName: 'Contactos',
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
        headerName: 'Endereço',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.address ? params.row.address : '-'}</span>
        ),
        editable: true,
      },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <div>
           
                <span style={{backgroundColor:!params.row.status || params.row.status=='active' ? '#C9E8E8': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='active' || !params.row.status ? 'Activo' : 'Inactivo'}</span>
           
        </div>
      )
    },
    {
      field: '-',
      headerName: 'Data de  criação',
      width: 170,
      renderCell: (params) => (
      <span>-</span>
      )
    },
    
    

];
}





  useEffect(()=>{
        update_data()
  },[data])

  React.useEffect(()=>{
   
    _get('categories') 

  },[])

  useEffect(()=>{
    if(settings.selected) {
      let content=search_f(data[settings.selected])
      setRows(content)
    }
  },[search,filterOptions,periodFilters,settings])


 function handleDelete(id){
    let ids=JSON.parse(JSON.stringify([...selectedItems.filter(i=>i!=id), id]))
    setSelectedItems(ids)
    setItemsToDelete(rows.filter(i=>ids.includes(i.id)).map(i=>i._id))
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
       onRowSelectionModelChange={(e)=>setSelectedItems(e)}
       localeText={{ noRowsLabel: <TableLoader loading={settings.required_data.filter(i=>!_loaded.includes(i)).length ? true : false}/>}}
     />
   </Box>
 );
}
