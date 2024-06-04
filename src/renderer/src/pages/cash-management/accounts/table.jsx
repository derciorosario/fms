import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../../components/progress/TableProgress'
import { useData } from '../../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
export default function Table({itemsToDelete,setItemsToDelete}) {
       const {_accounts,_get,_loaded,_transations}= useData()
       const navigate=useNavigate()
       const [selectedItems,setSelectedItems]=React.useState([])

      
       const columns = [
            {
                field: 'edit',
                headerName: '',
                width:100,
                renderCell: (params) => (
                  <div style={{opacity:.6}}>
                        <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/cash-management/account/'+params.row._id)}>
                            <EditOutlinedIcon/>
                        </span>
                        <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer',display:params.row.main ? 'flex' :'nonel'}}>
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
                  <span  style={{color:params.row.main ? 'rgb(59 130 246)' :'#000'}}>{params.row.name ? params.row.name : '-'}</span>
                ),
              },
              {
                field: 'desc',
                headerName: 'Descrição',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.description ? params.row.description : '-'}</span>
                ),
              },
              {
                field: 'available',
                headerName: 'Saldo disponivel',
                width: 150,
                renderCell: (params) => (
                  <span>{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(_transations.filter(i=>i.transation_account.id==params.row.id && i.type=='in').map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0) - _transations.filter(i=>i.transation_account.id==params.row.id && i.type=='out').map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0))}</span>
                ),
              },
      ];
   
      const [rows,setRows]=React.useState(_accounts)

      useEffect(()=>{
        _get('accounts')
        _get('transations')
      },[])

      useEffect(()=>{
             setRows(_accounts.filter(i=>i.main).concat(_accounts.filter(i=>!i.main)))
      },[_accounts])

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
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('accounts') ? true : false}/>}}
          />
        </Box>
      );
    }
    
