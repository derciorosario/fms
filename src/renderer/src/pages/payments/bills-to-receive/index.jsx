import React from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Table from './table'
import SearchIcon from '@mui/icons-material/Search';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
function App() {

  const navigate=useNavigate()
 
  return (
    <>
       <DefaultLayout details={{name:'Contas a receber'}}>
            <div className="rounded-[0.3rem] shadow bg-white">
              <div className="p-3 flex justify-between">
                   <div>
                        <div className="flex h-10 bg-slate-100 items-center px-2 rounded-lg">
                          <span className="text-white"><SearchIcon style={{ color: '#5D5FEF' }}/></span>
                          <input placeholder="Pesquisar..." type="text" className="outline-none bg-transparent flex-grow px-2 text-indigo-500"/>
                       </div>
                   </div>

                   <div className="flex items-center">
                     <div className="mr-4 cursor-pointer">
                       <LocalPrintshopOutlinedIcon/>
                     </div>
                    <Button variant="contained" onClick={()=>navigate('/bills-to-receive/create')}>Adicionar</Button>
                   </div>
                  
               </div>
              <Table/>
            </div>
        </DefaultLayout>
    </>
  )
}

export default App

