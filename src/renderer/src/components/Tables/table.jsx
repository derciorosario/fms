import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../components/progress/TableProgress'
import { useData } from '../../contexts/DataContext';
import { useSearch } from '../../contexts/SearchContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import CheckIcon from '@mui/icons-material/Check';

export default function Table({setItemsToDelete,search,filterOptions,page,periodFilters,_setFilteredContent}) {
  const {_get,_loaded,_update,_payment_methods,_categories,_cn}= useData()
  const data=useData()
  const navigate=useNavigate()
  const [selectedItems,setSelectedItems]=React.useState([])
  const [rows,setRows]=React.useState([])
  const [settings,setSettings]=React.useState({
     columns:[],
     selected:'',
     required_data:[]
  })

 

  

  function consiliate(data,confirmed_amount){
      if((!confirmed_amount || confirmed_amount <= 0 || isNaN(confirmed_amount)) && confirmed_amount!=undefined){
          toast.error('Valor deve ser maior que 0')
          return
      }

      _update('transations',[data])
  }
  

  
  function search_f(array){

    function search_from_object(object,text){
           text=search
           let add=false
           Object.keys(object).forEach(k=>{
             if(typeof object[k]=="string" || typeof object[k]=="number"){
                if(typeof object[k]=="number") object[k]=`${object[k]}`
                if(object[k].toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
                  add=true
               }
             }
           })
           return add
        }

      if (!array) return []

      let d=JSON.parse(JSON.stringify(array))

      if(periodFilters.startDate){
          if(periodFilters.igual){
            d=d.filter(i=>new Date(i.createdAt.split('T')[0]).getTime() >= periodFilters.startDate.getTime())
          }else{
            d=d.filter(i=>new Date(i.createdAt.split('T')[0]).getTime() <= periodFilters.startDate.getTime())
          }
      }

      if(periodFilters.endDate){
          if(periodFilters.igual){
            d=d.filter(i=>new Date(i.createdAt.split('T')[0]).getTime() <= periodFilters.endDate.getTime())
          }else{
            d=d.filter(i=>new Date(i.createdAt.split('T')[0]).getTime() >= periodFilters.endDate.getTime())
          }
      }
       
      
      filterOptions.forEach(f=>{
           let g=f.groups
           let igual=f.igual
           g.filter(g=>{

                  if(g.field=='transation_type' && g.selected_ids.length){
                     d=d.filter(i=>(igual ?  g.selected_ids.includes(i.type) : !g.selected_ids.includes(i.type)))
                  }

                  if(g.field=='if_consiliated' && g.selected_ids.length){
                     d=d.filter(i=>(igual ?  g.selected_ids.includes(!!(i.confirmed)) : !g.selected_ids.includes(!!(i.confirmed))))
                  }

                  if(g.field=='payment_status' && g.selected_ids.length){
                    d=d.filter(i=>(igual ?  g.selected_ids.includes(i.status) : !g.selected_ids.includes(i.status)))
                  }


                  if(g.field=='transation_methods' && g.selected_ids.length){

                     d=d.filter(i=>(igual ?  g.selected_ids.includes(i.payment_origin) : !g.selected_ids.includes(i.payment_origin)))
                  } 
                  
                  if((g.field=='categories_in' || g.field=='categories_out' ) && g.selected_ids.length){
                      d=d.filter(i=>(igual ?  g.selected_ids.includes(i.account_origin) : !g.selected_ids.includes(i.account_origin)))
                  } 

                  if(g.field=='_accounts' && g.selected_ids.length){
                    d=d.filter(i=>(igual ?  g.selected_ids.includes(i.transation_account.id) : !g.selected_ids.includes(i.transation_account.id)))
                  }    

           })


      })




      let res=[]
      d.forEach((t,i)=>{
        if(search_from_object(t)) {
            res.push(array.filter(j=>j.id==t.id)[0])
        }
      })


      console.log({page})


      if(page=="inflows" || page=="outflows"){
          res=res.filter(v=>v.type==(page=="inflows" ? 'in' :'out'))
      }


      _setFilteredContent(res)
      return res

   }



  function update_data(){

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
  }

  
     setSettings(_settings)
   
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
                     width: 110,
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
              width: 90,
              renderCell: (params) => (
                <div style={{opacity:.6}}>
                      <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/bills-to-pay/'+params.row._id)}>
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
          headerName: 'Data de pagamento',
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
            field: 'amount',
            headerName: 'Valor a '+(page=="bills-to-pay" ? 'pagar' :'receber'),
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
                
                      <span style={{backgroundColor:!params.row.status || params.row.status=='paid' ? '#C9E8E8':params.row.status=='pending' ? 'rgb(255 244 198)': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='paid' || !params.row.status ? 'Pago' : params.row.status=='pending' ? 'Pendente' : 'Vencido'}</span>
                
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
              <span>{params.row.payment_type=="single" ? 'Único' : 'Em prestações'}</span>
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
        width: 90,
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
          width: 90,
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
      width: 170,
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
      width: 170,
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
          <span>[working on it...]</span>
        ),
      },
     
      {
        field: 'type',
        headerName: 'Tipo',
        width: 200,
        renderCell: (params) => (
          <span>{params.row.type=="mobile" ? 'Móvel' : params.row.type=="bank" ? 'Bancaria' : params.row.type=="cashier" ? 'Caixa' : 'Outro'}</span>
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
  
  {
      field: 'edit',
      headerName: '',
      width: 170,
      renderCell: (params) => (
         <div style={{opacity:.3,pointerEvents:'none'}}>
              <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/cash-management/'+params.row._id)}>
                  <EditOutlinedIcon/>
              </span>
              <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                  <DeleteOutlineOutlinedIcon/>
              </span>
         </div>
      )
  }

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
