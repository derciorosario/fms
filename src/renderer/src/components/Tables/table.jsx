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

export default function Table({setItemsToDelete,search,filterOptions,page,periodFilters}) {
  const {_get,_loaded,_update}= useData()
  const {_setFilteredContent}=useSearch()
  const data=useData()
  const navigate=useNavigate()
  const [selectedItems,setSelectedItems]=React.useState([])
  const [rows,setRows]=React.useState([])
  const [accountCategories,setAccountCategories]=React.useState(data._account_categories)
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

      _setFilteredContent(res)
      return res

   }


  function update_data(){
    if(page=='financial-reconciliation'){
         setRows(search_f(data._transations))
         setAccountCategories(data._account_categories)
    }
  }



 

  useEffect(()=>{

 
    (async()=>{

      /*
           _get('bills_to_receive')
            try {
              let docs=await new PouchDB('account_categories').allDocs({ include_docs: true })
              setAccountCategories(docs.rows.map(i=>i.doc))
            } catch (error) {
                console.log(error)
            }
      */
      
     })()

    let _settings=JSON.parse(JSON.stringify(settings))


   if(page=='financial-reconciliation'){
       _settings.selected='_transations'
       _settings.required_data=['transations','accounts']
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
                             <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/bills-to-receive/'+params.row._id)}>
                                 <EditOutlinedIcon/>
                             </span>
                             <span className="hidden" onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                                 <DeleteOutlineOutlinedIcon/>
                             </span>
                       </div>
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
         
   }



  

  useEffect(()=>{
        update_data()
        
  },[])

  useEffect(()=>{
    if(settings.selected) {
      let content=search_f(data[settings.selected])
      setRows(content)
    }
  },[search,filterOptions,periodFilters])


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
       //checkboxSelection
       disableColumnMenu
       disableSelectionOnClick
       onRowSelectionModelChange={(e)=>setSelectedItems(e)}
       localeText={{ noRowsLabel: <TableLoader loading={settings.required_data.filter(i=>!_loaded.includes(i)).length ? true : false}/>}}
     />
   </Box>
 );
}
