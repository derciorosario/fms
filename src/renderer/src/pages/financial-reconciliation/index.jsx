import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Table from './table'
import SearchIcon from '@mui/icons-material/Search';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteDialog from '../../components/Dialogs/deleteItem'
import { useData  } from '../../contexts/DataContext';
import { useSearch  } from '../../contexts/SearchContext';
import Filter from '../../components/Filters/basic';
import BasicTable from '../../components/Tables/basic';

function App() {
  const {_delete,_get,_bills_to_receive} = useData();
  const [itemsToDelete,setItemsToDelete]=React.useState([])
  const [deleteLoading,setDeleteLoading]=React.useState(false)
  const [search,setSearch]=React.useState('')

  
  const searchC=useSearch()

 async function confirmDelete(res){
    
     setItemsToDelete([])
    
     if(res){
        let items=JSON.parse(JSON.stringify(itemsToDelete))
        _delete(items,'bills_to_receive')
     }
   }

  
  const navigate=useNavigate()
 
  const [stats,setStats]=React.useState({
     total:'0,00',
     total_items:0,
     for_today:0,
     left:'0,00',
     paid:'0,00',
     left_total:0,
     paid_total:0,
     due:0,
     pending:0,
  })


React.useEffect(()=>{
    let total=_bills_to_receive.filter(i=>!i.deleted).map(item => item.amount).reduce((acc, curr) => acc + curr, 0);
    let paid=_bills_to_receive.filter(i=>!i.deleted).map(item => item.paid).reduce((acc, curr) => acc + curr, 0);
    setStats({
      total:new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total),
      paid:new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paid),
      left:new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total - paid),
      total_items:_bills_to_receive.filter(i=>!i.deleted).length,
      paid_total:_bills_to_receive.filter(i=>!i.deleted && (parseFloat(i.paid) >= parseFloat(i.amount))).length,
      left_total:_bills_to_receive.filter(i=>!i.deleted && (parseFloat(i.paid) < parseFloat(i.amount))).length
    })
},[_bills_to_receive])



  
  return (
    <>
       <DeleteDialog res={confirmDelete} show={itemsToDelete.length} loading={deleteLoading}/>
       
       <DefaultLayout details={{name:'Conciliação financeira'}}>
          <div className="flex items-center pr-[1rem] [&>_div]:shadow-sm [&>_div]:rounded-[0.4rem] mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[170px] [&>_div]:mr-[10px] justify-start">
                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total de transações</span>
                                    <span className="text-[19px] text-[#2B3674]"> --</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.total_items}</span>
                       
                        </div>


                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total consiliado</span>
                                    <span className="text-[19px] text-[#2B3674]"> --</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.total_items}</span>
                        </div>



                        <div className="flex border items-center bg-white relative  px-2 py-2">
                                <div className="mr-3 opacity-70 flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Entras</span>
                                    <span className="text-[19px] text-[#2B3674]">-- </span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.paid_total}</span>
                        </div>


                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70 flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Saidas</span>
                                    <span className="text-[19px] text-[#2B3674]">-</span>
                                    <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.left_total}</span>
                                </div>
                        </div>
          </div>

         <BasicTable page={'financial-reconciliation'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

