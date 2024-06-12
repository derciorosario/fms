import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../../components/progress/TableProgress'
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';
import {useParams, useNavigate} from 'react-router-dom';
export default function Table({itemsToDelete,setItemsToDelete}) {
       const {_account_categories,_get,_loaded}= useData()
       const navigate=useNavigate()
       const [selectedItems,setSelectedItems]=React.useState([])
       const columns = [
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
                headerName: 'Descrição',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.description ? params.row.description : '-'}</span>
                ),
              },
              {
                field: 'email',
                headerName: 'Tipo de conta',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.type=="fixed" ? 'Fixa' : 'Variável'}</span>
                ),
              },
              {
                field: 'origin',
                headerName: 'Origen',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.account_origin=="supplier" ? 'Fornecedor' : params.row.account_origin=="expenses" ? 'Despesa' : params.row.account_origin== 'state' ? 'Estado' : params.row.account_origin=="client" ? 'Cliente' : params.row.account_origin=="investments" ? 'Investimentos' : 'Outros'}</span>
                ),
              },
             
            {
                field: 'edit',
                headerName: '',
                width: 170,
                renderCell: (params) => (
                   <div style={{opacity:.8}}>
                        <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/account-categorie/'+params.row._id)}>
                            <EditOutlinedIcon/>
                        </span>
                        <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                            <DeleteOutlineOutlinedIcon/>
                        </span>
                   </div>
                )
            }
       
      ];
   
      const [rows,setRows]=React.useState(_account_categories)

      useEffect(()=>{
        _get('account_categories')
      },[])

      useEffect(()=>{
             setRows(_account_categories)
      },[_account_categories])

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
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('account_categories') ? true : false}/>}}
          />
        </Box>
      );
    }
    
