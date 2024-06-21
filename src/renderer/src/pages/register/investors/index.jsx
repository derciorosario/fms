import React from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Table from './table'
import SearchIcon from '@mui/icons-material/Search';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteDialog from '../../../components/Dialogs/deleteItem'
import { useData  } from '../../../contexts/DataContext';
import toast from 'react-hot-toast';
function App() {
  const {makeRequest,_add,_update,_delete} = useData();
  const [itemsToDelete,setItemsToDelete]=React.useState([])
  const [deleteLoading,setDeleteLoading]=React.useState(false)
 
 async function confirmDelete(res){
    
     setItemsToDelete([])
    
     if(res){
        let items=JSON.parse(JSON.stringify(itemsToDelete))
        _delete(items,'investors')
     }
   }

  
  const navigate=useNavigate()
  
  return (
    <>
       <DeleteDialog res={confirmDelete} show={itemsToDelete.length} loading={deleteLoading}/>
       <DefaultLayout details={{name:'Investidores'}}>
            <div className="rounded-[0.3rem] shadow bg-white">
              <div className="p-3 flex justify-between">
                   <div>
                        <div className="flex h-10  items-center px-2 rounded-lg">
                          <span className="text-white"><SearchIcon style={{ color: '#5D5FEF' }}/></span>
                          <input placeholder="Pesquisar..." type="text" className="outline-none bg-transparent flex-grow px-2 text-indigo-500"/>
                       </div>
                   </div>

                   <div className="flex items-center">
                     <div className="mr-4 cursor-pointer">
                       <LocalPrintshopOutlinedIcon/>
                     </div>
                    <Button variant="contained" onClick={()=>navigate('/investors/create')}>Adicionar</Button>
             
                   </div>
                  
               </div>
               <Table itemsToDelete={itemsToDelete} setItemsToDelete={setItemsToDelete}/>
            </div>
        </DefaultLayout>
    </>
  )
}

export default App

