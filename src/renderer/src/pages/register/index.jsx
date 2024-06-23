import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useData  } from '../../contexts/DataContext';
import BasicTable from '../../components/Tables/basic';
import TotalCard from '../../components/Cards/default_totals';
import { useLocation } from 'react-router-dom';

function App() {
  const data = useData()
  const [_filtered_content,_setFilteredContent]=useState([])
  let {pathname} = useLocation()

  let page=pathname.includes('/client') ? 'clients' : pathname.includes('/supplier') ? 'suppliers' :'investors';

  let stats={
    total:0,
 }
 
 const [statResponses,setStatResponses]=React.useState({global:stats,result:stats})


  React.useEffect(()=>{
      let res=JSON.parse(JSON.stringify(statResponses))

      Object.keys(statResponses).forEach(o=>{
                let from=o=="global" ? data[`_${page}`] : _filtered_content 
                 res[o]={
                ...res[o],
                total:from.length,
              }
      })

      setStatResponses(res)

  },[_filtered_content,data._clients,data._suppliers,data._investors])

  
  return (
    <>
       <DefaultLayout details={{name:page=="clients" ? "Clientes" : page=="suppliers" ? "Fornecedores" : "Investidores"}}>

      {/** <TotalCard page={`${page}`} items={
             [
              {name:'Total',value:statResponses.global.total},
             ]
        }/> */}

         <BasicTable res={[
            {name:'Total',value:statResponses.result.total},
         ]} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content}  page={page}/>
           
        </DefaultLayout>
    </>
  )
}

export default App

