import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../../components/progress/TableProgress'
import { useData } from '../../../contexts/DataContext';
import {useParams, useNavigate,useLocation} from 'react-router-dom';

export default function Table({setItemsToDelete}) {
       const {_transations,_get,_loaded,_account_categories}= useData()
       const navigate=useNavigate()
       let {pathname} = useLocation()

       let type=pathname.includes('inflow') ? 'in' : 'out';
       const [selectedItems,setSelectedItems]=React.useState([])
       const [rows,setRows]=React.useState(_transations)
       const [accountCategories,setAccountCategories]=React.useState(_account_categories)


       useEffect(()=>{
         _get('transations')
         _get('account_categories')
       },[])
 
       useEffect(()=>{
              setRows(_transations)
       },[_transations])

       useEffect(()=>{
              setAccountCategories(_account_categories)
      },[_account_categories])

       const columns = [

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
                  <span>{params.row.amount ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(params.row.amount))  : '-'}</span>
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
   
    

      function handleDelete(id){
         let ids=JSON.parse(JSON.stringify([...selectedItems.filter(i=>i!=id), id]))
         setSelectedItems(ids)
         setItemsToDelete(rows.filter(i=>ids.includes(i.id)).map(i=>i._id))
      }

      
      

         

    
      return (
        <Box sx={{ height:'400px', width: '100%' }}>
          <DataGrid
            rows={rows.filter(i=>i.type==type)}
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
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('transations') ? true : false}/>}}
          />
        </Box>
      );
    }
    