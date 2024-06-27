import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import DeleteDialog from '../../components/Dialogs/deleteItem'
import { useData  } from '../../contexts/DataContext';
import BasicTable from '../../components/Tables/basic';

function App() {
  const {_delete,_loaded,_budget,_cn} = useData();
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
 }
 
  const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? _budget : _filtered_content 
                let total=from.map(i=>(i.items.map(item => parseFloat(item.value)).reduce((acc, curr) => acc + curr, 0))).map(item => item).reduce((acc, curr) => acc + curr, 0);

                res[o]={
                  ...res[o],
                  total:_cn(total),
                }

      })

      setStatResponses(res)

},[_filtered_content,_budget])



  
  return (
    <>
       <DeleteDialog res={confirmDelete} show={itemsToDelete.length} loading={deleteLoading}/>
       
       <DefaultLayout details={{name:'Controle de Orçamento'}}>
          <div className="flex items-center pr-[1rem] [&>_div]:shadow-sm [&>_div]:rounded-[0.3rem] mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[170px] [&>_div]:mr-[10px] justify-start">
                        <div className="flex border items-center bg-white  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] ">Total previsto</span>
                                    <span className="text-[19px] text-[#2B3674]">{_loaded.includes('budget') ? statResponses.global.total :'-'}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{stats.total_items}</span>
                       
                        </div>
          </div>

         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
           ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={'budget-management'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

