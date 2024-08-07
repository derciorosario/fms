import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import BasicTable from '../../../components/Tables/basic';
import TotalCard from '../../../components/Cards/default_totals';
import { t } from 'i18next';

function App() {
  const {_payment_methods} = useData();
  const [_filtered_content,_setFilteredContent]=useState([])



  let stats={
    total:'0,00',
  }
 
const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? _payment_methods : _filtered_content 
                res[o]={
                  ...res[o],
                  total:from.length,
                }


      })

      setStatResponses(res)

},[_filtered_content,_payment_methods])



  
  return (
    <>
     <DefaultLayout details={{name:t('common.payment-method')}}>
          
        

         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
           ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={'payment-methods'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

