import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import BasicTable from '../../../components/Tables/basic';
import { t } from 'i18next';

function App() {
  const {_account_categories,_cn} = useData();
  const [_filtered_content,_setFilteredContent]=useState([])



  let stats={
    total:'0',
  }
 
const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? _account_categories : _filtered_content 
                res[o]={
                  ...res[o],
                  total:from.length,
                }

      })

      console.log(statResponses)

      setStatResponses(res)

},[_filtered_content,_account_categories])



  
  return (
    <>
     <DefaultLayout details={{name:t('common.account-plan')}}>
          
       

         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
           ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={'account-categories'}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

