import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import BasicTable from '../../../components/Tables/basic';
import TotalCard from '../../../components/Cards/default_totals';
import { useLocation } from 'react-router-dom';
import { t } from 'i18next';

function App() {
  const data = useData()
  const [_filtered_content,_setFilteredContent]=useState([])
  let {pathname} = useLocation()

  let type=pathname.includes('inflow') ? 'in' : 'out';
 
  let stats={
    total:'0,00',
 }

 const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


  React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? data._transations.filter(i=>i.type==type) : _filtered_content 
                let total=from.map(item => (item.type=="out" ? - (parseFloat(item.amount)) : parseFloat(item.amount))).reduce((acc, curr) => acc + curr, 0);
                res[o]={
                ...res[o],
                total:data._cn(total).replaceAll('-','')
              }
      })

      setStatResponses(res)

  },[_filtered_content,data._transations])


return (
  <>
    
     <DefaultLayout details={{name:type=="in" ? t('common.inflow')+"s":t('common.outflow')+"s"}}>

     <TotalCard page={`transations`} items={
           [
            {name:'Total',value:statResponses.global.total},
            
           ]
      }/>


       <BasicTable res={[
          {name:'Total',value:statResponses.result.total},
         ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={`${type}flows`}/>
         
      </DefaultLayout>
  </>
)
}

export default App

