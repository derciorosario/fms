import React, { useState } from 'react';
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Table from './table'
import SearchIcon from '@mui/icons-material/Search';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteDialog from '../Dialogs/deleteItem'
import { useData  } from '../../contexts/DataContext';
import Filter from '../Filters/basic';
import DatePickerRange from '../Filters/date-picker-range';
import CloseIcon from '@mui/icons-material/Close';

function BasicTable({page,_filtered_content,_setFilteredContent,options,res}) {

  const {_delete,_transations} = useData();
  const [itemsToDelete,setItemsToDelete]=React.useState([])
  const [deleteLoading,setDeleteLoading]=React.useState(false)
  const [search,setSearch]=React.useState('')
  const [watchFilterChanges,setWatchFilterChanges]=React.useState('')
  const [settings,setSettings]=React.useState({
      filters:[],
      has_add_btn:true
  })
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      open:false,
      field:'transation_method',
      name:'Método de pagamento',
      page:'finacial-reconciliation',
      get_deleted:true,
      not_fetchable:true,
      igual:true,
      search:'',
      groups:[
        {field:'transation_methods',name:'Método de pagamento',items:[
          {name:'Dinheiro',id:'cash'},
          {name:'Cartão',id:'card'},
          {name:'Cheque',id:'check'},
          {name:'Transferência',id:'transfer'},
          {name:'Mkesh',id:'mkesh'},
          {name:'E-mola',id:'e-mola'},
          {name:'M-pesa',id:'m-pesa'},
          {name:'PayPal',id:'paypal'},
          {name:'Stripe',id:'stripe'},
          {name:'Strill',id:'Strill'},
          {name:'Valor inicial',id:'initial'},
        ],selected_ids:[]}
      ]
    },
      {
        open:false,
        field:'_accounts',
        name:'Contas',
        page:'finacial-reconciliation',
        get_deleted:true,
        db_name:'accounts',
        igual:true,
        search:'',
        groups:[
          {field:'_accounts',name:'contas',db_name:'accounts',items:[],selected_ids:[]}
        ]
      },
      {
        open:false,
        field:'_managers',
        name:'Gestores',
        page:'finacial-reconciliation',
        igual:true,
        search:'',
        groups:[{field:'_managers',name:'Gestores',items:[],selected_ids:[]}]
      },
      {
        open:false,
        field:'if_consiliated',
        name:'Consiliado',
        not_fetchable:true,
        page:'finacial-reconciliation',
        igual:true,
        search:'',
        groups:[{field:'if_consiliated',name:'Consiliado',items:[{id:true,name:'Sim'},{id:false,name:'Não',selected:true}],selected_ids:[false]}]
      },
      {
        open:false,
        field:'transation_type',
        name:'Tipo de transação',
        not_fetchable:true,
        page:'finacial-reconciliation',
        igual:true,
        search:'',
        groups:[{field:'transation_type',name:'Tipo de transação',items:[{id:'in',name:'Entrada'},{id:'out',name:'Saída'}],selected_ids:[]}]
      }
  ])

  const [datePickerPeriodOptions,setDatePickerPeriodOptions]=React.useState({
    open:false,
    igual:true,
    startDate:null,
    endDate:null,
    name:'Periodo',
    search:'',
    field:'_transations',
    groups:[/*{field:'period',name:'Periodo',items:[
      {id:'this_week',name:'Esta semana'},
      {id:'this_month',name:'Este mês'},
      {id:'last_month',name:'Mês passado'},
      {id:'this_year',name:'Este ano'}
    ],selected_ids:[]}*/]
     
  })
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  
 React.useEffect(()=>{

    let _settings=JSON.parse(JSON.stringify(settings))

    if(page=='financial-reconciliation'){
            _settings.filters=['_accounts','if_consiliated','transation_type','transation_method']
            _settings.has_add_btn=false
           
    }

    if(page=='cash-managment-stats'){
      _settings.filters=['_accounts','if_consiliated','transation_type']
      _settings.has_add_btn=false
     
   }

    setSettings(_settings)

 },[])


 React.useEffect(()=>{

   setWatchFilterChanges(Math.random().toString())

},[filterOptions])



 
 async function confirmDelete(res){
    
     setItemsToDelete([])
    
     if(res){
        let items=JSON.parse(JSON.stringify(itemsToDelete))
        _delete(items,page.replaceAll('-','_'))
     }
   }

  
  const navigate=useNavigate()
 
  
  return (
    <>
       <DeleteDialog res={confirmDelete} show={itemsToDelete.length} loading={deleteLoading}/>
       
            <div className="rounded-[0.3rem] shadow bg-white">
              <div className="p-3 flex justify-between border-b-[1px]">
                   <div className="flex">
                        <div className="flex h-10 border-[1px]  items-center px-2 rounded-lg mr-3">
                          <span className="text-white"><SearchIcon style={{ color: '#5D5FEF' }}/></span>
                          <input value={search} type="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Pesquisar..."  className="w-[100px] focus:w-[160px] transition duration-300 ease-in-out outline-none bg-transparent flex-grow px-2 text-indigo-500"/>
                       </div>

                       
                     <DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/> 
                      
                     <div className="flex items-center">
                      <span className="py-1 px-2 border rounded-[0.3rem] border-blue-100 text-blue-500">{!_filtered_content.length ? 'Nenhum resultado' : _filtered_content.length+' resultado'+`${_filtered_content.length >=2 ?'s':''}` } </span>
                     </div>

                   </div>

                  

                   <div className="flex">

                     <div className="mr-4  cursor-pointer h-10 flex justify-center items-center">
                       <LocalPrintshopOutlinedIcon/>
                     </div>

                    

                    <div>

                    {settings.has_add_btn && <Button variant="contained" onClick={()=>navigate(`/${page}/create`)}>Adicionar</Button>
                    }
                    </div>

                    
                   </div>
                  
               </div>

               <div className="flex px-3 mb-3">
                         
                          <div className="flex items-center mr-3">
                              <span className="mr-2">Filtros:</span>
                              <button onClick={()=>alert('still working one it!')} type="button" className="text-gray-900 mt-2 bg-white flex hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-[5px] text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                              <CloseIcon style={{width:'15px'}}/>
                              <span className="ml-1">Limpar filtros</span>
                              </button>
                          </div>
                          <div className="flex mr-3 flex-wrap">

                                {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).map((i,_i)=>(
                                      
                                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                                    
                                ))}

                          </div>

                        
               </div>


               <div className="flex border-b mt-2 p-2 items-center">
                     <span className="mr-2">Resultado:</span>
                     {res.map((i,_i)=>(
                         <div className="flex border rounded-[4px] p-1 mr-2" key={_i}> 
                                 <span className="mr-2">{i.name}</span>
                                 <span className="opacity-55">{i.value}</span>
                         </div>
                     ))}
               </div>

               <Table watchFilterChanges={watchFilterChanges} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content} periodFilters={datePickerPeriodOptions} page={page} search={search} filterOptions={filterOptions} itemsToDelete={itemsToDelete} setItemsToDelete={setItemsToDelete}/>
            </div>
       
    </>
  )
}

export default BasicTable

