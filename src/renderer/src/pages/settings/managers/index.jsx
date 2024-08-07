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

  
  let stats={
    total:0,
 }
 
 const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


  React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? data[`_managers`] : _filtered_content 
                 res[o]={
                ...res[o],
                total:from.length,
              }
      })

      setStatResponses(res)

  },[_filtered_content,data._managers])

  
  return (
    <>
       <DefaultLayout details={{name:t('common.managers')}}>

       {/** <TotalCard page={`${page}`} items={
             [
              {name:'Total',value:statResponses.global.total},
             ]
        }/> */}

         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
         ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={'managers'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

