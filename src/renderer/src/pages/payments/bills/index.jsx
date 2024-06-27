import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import BasicTable from '../../../components/Tables/basic';
import TotalCard from '../../../components/Cards/default_totals';
import { useLocation } from 'react-router-dom';

function App() {
  const data = useData()
  const [_filtered_content,_setFilteredContent]=useState([])
  let {pathname} = useLocation()

  let type=pathname.includes('/bills-to-pay') ? 'pay' : 'receive';

  let stats={
    total:'0,00',
    left:'0,00',
    paid:'0,00',
 }
 
 const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


  React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? data['_bills_to_'+type] : _filtered_content 
                let total=from.map(item => (item.type=="out" ? - (parseFloat(item.amount) + parseFloat(item.fees ? item.fees : 0)) : parseFloat(item.amount) + parseFloat(item.fees ? item.fees : 0))).reduce((acc, curr) => acc + curr, 0);
                let paid=from.map(item => item.paid ? parseFloat(item.paid) : 0).reduce((acc, curr) => acc + curr, 0);
                res[o]={
                ...res[o],
                total:data._cn(total),
                paid:data._cn(paid),
                left:data._cn(total - paid),
                total_items:from.filter(i=>!i.deleted).length,
              }
      })

      setStatResponses(res)

  },[_filtered_content,data._bills_to_pay,data._bills_to_receive])

  
  return (
    <>
      
       <DefaultLayout details={{name:type=="pay" ? 'Contas a pagar' : 'Contas a receber'}}>

       <TotalCard page={`bills_to_${type}`} items={
             [
              {name:'Total',value:statResponses.global.total},
              {name:type == 'pay' ? 'Pago' :'Recebido',value:statResponses.global.paid},
              {name:'Em falta',value:statResponses.global.left}
             ]
        }/>


         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
            {name:type == 'pay' ? 'Pago' :'Recebido',value:statResponses.result.paid},
            {name:'Em falta',value:statResponses.result.left}
         ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={`bills-to-${type}`}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

