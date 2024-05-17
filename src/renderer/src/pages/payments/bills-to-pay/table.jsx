import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
export default function Table() {
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
                field: 'amount',
                headerName: 'Valor',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.amount ? params.row.amount : '-'}</span>
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
                field: 'due',
                headerName: 'Praso de pagamento',
                width: 150,
                renderCell: (params) => (
                  <span>{params.row.due ? params.row.due : '-'}</span>
                ),
                editable: true,
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
                <span>{params.row.doc_number ? params.row.doc_number : '-'}</span>
              )
            },

            {
              field: 'status',
              headerName: 'Estado',
              width: 120,
              renderCell: (params) => (
                <div>
                   
                        <span style={{backgroundColor:!params.row.status || params.row.status=='paid' ? '#C9E8E8': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {params.row.status=='paid' || !params.row.status ? 'Pago' : 'Vencido'}</span>
                   
                </div>
              )
            },

            {
              field: 'pay_day',
              headerName: 'Data de pagamento',
              width: 170,
              renderCell: (params) => (
              <span>24/02/2024</span>
              )
            },
           
            {
              field: 'ceatatedAt',
              headerName: 'Data de criação',
              width: 170,
              renderCell: (params) => (
              <span>24/02/2024</span>
              )
            },
            
            {
                field: 'edit',
                headerName: '',
                width: 170,
                renderCell: (params) => (
                   <div style={{opacity:.8}}>
                        <span style={{marginRight:'1rem',cursor:'pointer'}}>
                            <EditOutlinedIcon/>
                        </span>
                        <span style={{cursor:'pointer'}}>
                            <DeleteOutlineOutlinedIcon/>
                        </span>
                   </div>
                )
            }
       
      ];
   
      const [rows,setRows]=React.useState([
         {id:1,name:'Aluguer',amount:'14.000,00MT',description:'Pagamento de alguer',status:'-'},
         {id:2,name:'Compra de energia',amount:'1.000,00MT',paid:'1.000'},

      ])
    
    
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
            //onSelectionModelChange={handleSelectionModelChange}
            // localeText={{ noRowsLabel: <CustomNoRowsOverlay loading={!dataLoaded.loans ? true : false}/>}}
          />
        </Box>
      );
    }
    
