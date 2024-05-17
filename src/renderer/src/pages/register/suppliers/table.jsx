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
       const {_suppliers,_get,_loaded}= useData()
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
            
            {
                field: 'edit',
                headerName: '',
                width: 170,
                renderCell: (params) => (
                   <div style={{opacity:.8}}>
                        <span style={{marginRight:'1rem',cursor:'pointer'}} onClick={()=>navigate('/client/'+params.row._id)}>
                            <EditOutlinedIcon/>
                        </span>
                        <span onClick={()=>handleDelete(params.row.id)} style={{cursor:'pointer'}}>
                            <DeleteOutlineOutlinedIcon/>
                        </span>
                   </div>
                )
            }
       
      ];
   
      const [rows,setRows]=React.useState(_suppliers)

      useEffect(()=>{
        _get('suppliers')
      },[])

      useEffect(()=>{
             setRows(_suppliers)
      },[_suppliers])

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
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('suppliers') ? true : false}/>}}
          />
        </Box>
      );
    }
    
