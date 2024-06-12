import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../../components/progress/TableProgress'
import { useData } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';

export default function Table({setItemsToDelete}) {
       const {_bills_to_pay,_get,_loaded}= useData()
       const navigate=useNavigate()
       const [selectedItems,setSelectedItems]=React.useState([])
       const [rows,setRows]=React.useState(_bills_to_pay)
       const [accountCategories,setAccountCategories]=React.useState([])

       useEffect(()=>{
         (async()=>{
            _get('bills_to_pay')
            try {
              let docs=await new PouchDB('account_categories').allDocs({ include_docs: true })
              setAccountCategories(docs.rows.map(i=>i.doc))
            } catch (error) {
                console.log(error)
            }
          })()
       },[])
 
       useEffect(()=>{
              setRows(_bills_to_pay)
       },[_bills_to_pay])

     

       const columns = [
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
                field: 'name',
                headerName: 'Nome',
                width: 150,
                renderCell: (params) => (
                  <span>{accountCategories.filter(i=>i.id==params.row.account_id)[0]?.name}</span>
                ),
              },
              {
                field: 'amount',
                headerName: 'Valor',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
                ),
              },
              {
                field: 'description',
                headerName: 'Descrição de pagamento',
                width: 170,
                renderCell: (params) => (
                  <span>{params.row.description ? params.row.description : '-'}</span>
                ),editable: true,
              },
              {
                field: 'account_origin',
                headerName: 'Tipo de conta',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.account_origin=="supplier" ? 'Fornecedor' : params.row.account_origin=="expenses" ? 'Despesa' : 'Estado'}</span>
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
                field: 'paid',
                headerName: 'Valor pago ',
                width: 170,
                renderCell: (params) => (
                <span>{params.row.paid ? params.row.paid : '-'}</span>
                )
            },
            
            {
              field: 'doc_number',
              headerName: 'Número da fatura',
              width: 120,
              renderCell: (params) => (
                <span>{params.row.invoice_number ? params.row.invoice_number : '-'}</span>
              )
            },

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
              field: 'pay_day',
              headerName: 'Data de pagamento',
              width: 170,
              renderCell: (params) => (
                <span>{params.row.payday ? params.row.payday.split('T')[0] : '-'}</span>
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
            checkboxSelection
            disableColumnMenu
            disableSelectionOnClick
            onRowSelectionModelChange={(e)=>setSelectedItems(e)}
            //onSelectionModelChange={handleSelectionModelChange}
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('bills_to_pay') ? true : false}/>}}
          />
        </Box>
      );
    }
    