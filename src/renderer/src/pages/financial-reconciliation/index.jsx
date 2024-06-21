import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import DeleteDialog from '../../components/Dialogs/deleteItem'
import { useData  } from '../../contexts/DataContext';
import BasicTable from '../../components/Tables/basic';

function App() {
  const {_delete,_loaded,_transations,_cn} = useData();
  const [itemsToDelete,setItemsToDelete]=React.useState([])
  const [deleteLoading,setDeleteLoading]=React.useState(false)
  const [_filtered_content,_setFilteredContent]=useState([])
  

 async function confirmDelete(res){
    
     setItemsToDelete([])
    
     if(res){
        let items=JSON.parse(JSON.stringify(itemsToDelete))
        _delete(items,'bills_to_receive')
     }
   }

  
  const navigate=useNavigate()


  let stats={
    total:'0,00',
    total_items:0,
    confirm:0,
    inflows:0,
    total_inflows:0,
    outflows:0,
    total_outflows:0,
    confirmed_total:0,
    not_confirmed:0,
    not_confirmed_total:0,
    for_today:0,
    left:'0,00',
    paid:'0,00',
    left_total:0,
    paid_total:0,
    due:0,
    pending:0,
 }
 
  const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? _transations : _filtered_content 


                let total=from.map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0);
                let paid=from.map(item => item.paid).reduce((acc, curr) => acc + curr, 0);
                let confirmed=from.filter(i=>i.confirmed).map(item => item.amount).reduce((acc, curr) => acc + curr, 0);
                let not_confirmed=from.filter(i=>!i.confirmed).map(item => item.amount).reduce((acc, curr) => acc + curr, 0);
                let inflows=from.filter(i=>i.type=="in").map(item => item.amount).reduce((acc, curr) => acc + curr, 0);
                let outflows=from.filter(i=>i.type=="out").map(item => item.amount).reduce((acc, curr) => acc + curr, 0);
                
                

              
               res[o]={
                ...res[o],
                total:_cn(total),
                confirmed:_cn(confirmed),
                inflows:_cn(inflows),
                outflows:_cn(outflows),
                confirmed_total:from.filter(i=>i.confirmed).length,
                not_confirmed_total:from.filter(i=>!i.confirmed).length,
                not_confirmed:_cn(not_confirmed),
                paid:_cn(paid),
                left:_cn(total - paid),
                total_items:from.filter(i=>!i.deleted).length,
                paid_total:from.filter(i=>!i.deleted && (parseFloat(i.paid) >= parseFloat(i.amount))).length,
                left_total:from.filter(i=>!i.deleted && (parseFloat(i.paid) < parseFloat(i.amount))).length
              }

      })

      setStatResponses(res)

},[_filtered_content,_transations])



  
  return (
    <>
       <DeleteDialog res={confirmDelete} show={itemsToDelete.length} loading={deleteLoading}/>
       
       <DefaultLayout details={{name:'Conciliação financeira'}}>
          <div className="flex items-center pr-[1rem] [&>_div]:shadow-sm [&>_div]:rounded-[0.4rem] mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[170px] [&>_div]:mr-[10px] justify-start">
                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total de saldo</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('transations') ? statResponses.global.total :'-'}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.total_items}</span>
                       
                        </div>


                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total consiliado</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('transations') ? statResponses.global.confirmed :'-'}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{statResponses.global.total_items}</span>
                        </div>


                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total não consiliado</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('transations') ? statResponses.global.not_confirmed :'-'}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{statResponses.global.total_items}</span>
                        </div>



                        <div className="flex border items-center bg-white relative  px-2 py-2">
                                <div className="mr-3 opacity-70 flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total entradas</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('transations') ? statResponses.global.inflows :'-'}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{_loaded.includes('transations') ? statResponses.global.inflows :'-'}</span>
                        </div>


                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70 flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total saidas</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('transations') ? statResponses.global.outflows :'-'}</span>
                                    <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{_loaded.includes('transations') ? statResponses.global.outflows :'-'}</span>
                                </div>
                        </div>
          </div>

         <BasicTable res={[
            {name:'Saldo',value:statResponses.result.total},
            {name:'Consiliado',value:statResponses.result.confirmed},
            {name:'Não consiliado',value:statResponses.result.not_confirmed}
         ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={'financial-reconciliation'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

