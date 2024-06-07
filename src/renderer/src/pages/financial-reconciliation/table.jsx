import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableLoader from '../../components/progress/TableProgress'
import { useData } from '../../contexts/DataContext';
import {useParams, useNavigate} from 'react-router-dom';
import PouchDB from 'pouchdb';

export default function Table({setItemsToDelete,search,filterOptions,page}) {
       const {_get,_loaded}= useData()
       const navigate=useNavigate()
       const [selectedItems,setSelectedItems]=React.useState([])
       const [rows,setRows]=React.useState([])
       const [accountCategories,setAccountCategories]=React.useState([])
       const [settings,setSettings]=React.useState({
          columns:[]
       })


       useEffect(()=>{

        let _settings=JSON.parse(JSON.stringify(settings))

        if(page=='financial-reconciliation'){
                _settings.columns=[
                        {
                          field: 'edit',
                          headerName: '',
                          width: 90,
                          renderCell: (params) => (
                            <div style={{opacity:.6}}>
                                  <span style={{marginRight:'0.5rem',cursor:'pointer'}} onClick={()=>navigate('/bills-to-receive/'+params.row._id)}>
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

                ]
              
        }

        setSettings(_settings)
        


        (async()=>{


          _get('bills_to_receive')
           try {
             let docs=await new PouchDB('account_categories').allDocs({ include_docs: true })
             setAccountCategories(docs.rows.map(i=>i.doc))
           } catch (error) {
               console.log(error)
           }


         })()
      },[])
 
      
       useEffect(()=>{
             // setRows(_bills_to_receive)
       },[data])


    

      function handleDelete(id){
         let ids=JSON.parse(JSON.stringify([...selectedItems.filter(i=>i!=id), id]))
         setSelectedItems(ids)
         setItemsToDelete(rows.filter(i=>ids.includes(i.id)).map(i=>i._id))
      }


    
      return (
        <Box sx={{ height:'400px', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={settings.columns}
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
            localeText={{ noRowsLabel: <TableLoader loading={!_loaded.includes('bills_to_receive') ? true : false}/>}}
          />
        </Box>
      );
    }
    