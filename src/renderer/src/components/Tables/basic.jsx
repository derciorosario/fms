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
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
import { useSearchParams, useLocation } from 'react-router-dom';
import colors from '../../assets/colors.json'
import DefaultButton from '../Buttons/default';
import { ImportExport } from '@mui/icons-material';
function BasicTable({page,_filtered_content,_setFilteredContent,res}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const {_delete,_transations,_categories,dbs} = useData();
  const data=useData()
  const [itemsToDelete,setItemsToDelete]=React.useState([])
  const [deleteLoading,setDeleteLoading]=React.useState(false)
  const [search,setSearch]=React.useState('')
  const [watchFilterChanges,setWatchFilterChanges]=React.useState('')
  const [settings,setSettings]=React.useState({
      filters:[],
      has_add_btn:true,
      from:'_transations'
  })
  
  const [filterOptions,setFilterOPtions]=useState([
    
      {
        open:false,
        field:'_payment_methods',
        name:'Meios de pagamento',
        get_deleted:false,
        db_name:'payment_methods',
        igual:true,
        search:'',
        groups:[
          {field:'_payment_methods',name:'Meios de pagamento',db_name:'payment_methods',items:[],selected_ids:[],default_ids:[]}
        ]
      },
      {
        open:false,
        field:'_account_categories',
        name:'Contas',
        get_deleted:true,
        db_name:'account_categories',
        igual:true,
        search:'',
        groups:[
          {field:'_account_categories',name:'contas',param:'accounts',db_name:'account_categories',items:[],selected_ids:[],default_ids:[]}
        ]
      },
      {
        open:false,
        field:'_managers',
        name:'Gestores',
        igual:true,
        search:'',
        groups:[{field:'_managers',name:'Gestores',items:[],selected_ids:[],default_ids:[]}]
      },
      {
        open:false,
        field:'payment_status',
        name:'Estado de pagamento',
        not_fetchable:true,
        igual:true,
        search:'',
        groups:[{field:'payment_status',param:'status',name:'Estado de pagamento',items:[{id:'pending',name:'Pendente'},{id:'paid',name:'Pago'},{id:'delayed',name:'Em atraso'}],selected_ids:[],default_ids:[]}]
      },
      {
        open:false,
        field:'if_consiliated',
        name:'Consiliado',
        not_fetchable:true,
        igual:true,
        search:'',
        groups:[{field:'if_consiliated',name:'Consiliado',items:[{id:true,name:'Sim'},{id:false,name:'Não',selected:true}],selected_ids:[false],default_ids:[]}]
      },

      {
        open:false,
        field:'categories',
        name:'Categorias de conta',
        not_fetchable:true,
        igual:true,
        search:'',
        groups:[
          {field:'categories_in',name:'Entrada',items:_categories.filter(i=>i.type=="in").map(i=>({id:i.field,name:i.name})),selected_ids:[],default_ids:[]},
          {field:'categories_out',name:'Saída',items:_categories.filter(i=>i.type=="out").map(i=>({id:i.field,name:i.name})),selected_ids:[],default_ids:[]}
        ]
      },

      {
        field:'date_by',
        name:'Data por',
        igual:true,
        not_fetchable:true,
        search:'',
        single:true,
        groups:[
          {field:'date_by',name:'Data por',items:[{id:'createdAt',name:'Criação',selected:true},{id:'payday',name:'Vencimento'}],selected_ids:['createdAt'],default_ids:['createdAt']}
        ]
      },


      {
        open:false,
        field:'transation_type',
        name:'Tipo de transação',
        not_fetchable:true,
        igual:true,
        search:'',
        groups:[{field:'transation_type',name:'Tipo de transação',param:'payment_type',items:[{id:'in',name:'Entrada'},{id:'out',name:'Saída'}],selected_ids:[],default_ids:[]}]
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

    groups:[{field:'period',name:'Periodo',items:[
      {id:'this_month',name:'Este mês',selected:true},
      {id:'last_month',name:'Mês passado'},
      {id:'this_week',name:'Esta semana'},
      {id:'last_week',name:'Semana passada'},
      {id:'this_year',name:'Este ano'}
    ],selected_ids:['this_month']}]
     
  })
  

 React.useEffect(()=>{

    let _settings=JSON.parse(JSON.stringify(settings))

    if(page=='financial-reconciliation'){
            _settings.filters=['_account_categories','if_consiliated','transation_type','_payment_methods']
            _settings.has_add_btn=false
           
    }

   if(page=='cash-managment-stats'){
      _settings.filters=['_accounts','if_consiliated','transation_type']
      _settings.has_add_btn=false
      
   }


    if(page=='bills-to-pay'){
      _settings.filters=['payment_status','account_categories','date_by']
      _settings.from='_bills_to_pay'
    }

    if(page=='bills-to-receive'){
      _settings.filters=['payment_status','account_categories','date_by']
      _settings.from='_bills_to_receive'
    }

    if(page=="budget-management"){
       _settings.filters=['categories']
       _settings.from='_budget'
    }

    if(page=="account-categories"){
      _settings.from='_account_categories'
      _settings.create_path='accounts'
    }
    if(page=="inflows"){
      _settings.filters=['_account_categories']
      _settings.from='_transations'
      _settings.create_path='cash-management/inflow'
    }
    if(page=="outflows"){
      _settings.filters=['_account_categories']
      _settings.from='_transations'
      _settings.create_path='cash-management/outflow'
    }

    if(page=="payment-methods"){
      _settings.from='_payment_methods'
    }

   


     setSettings(_settings)
     setDatePickerPeriodOptions({...datePickerPeriodOptions,field:_settings.from})

 },[])


 React.useEffect(()=>{

   setWatchFilterChanges(Math.random().toString())


    filterOptions.some(i=>i.groups.some(f=>f.default_ids.toString()!=f.selected_ids.toString()))

},[filterOptions])


function add_new(){
  navigate(`/${settings.create_path ? settings.create_path : page}/create`)
}


function sendFilters(new_filters){
    
  let params_names=Object.keys(data._filters)

  let new_params={}
  
  new_filters.forEach(f=>{
        f.groups.forEach(g=>{
            if(params_names.includes(g.param)){
                 new_params[g.param]=g.selected_ids
            }
        })
  })

  data._updateFilters(new_params,setSearchParams)
      
}



function clearAllFilters(){

     let new_filters=filterOptions.map(f=>{
            
        return  {...f,groups:f.groups.map(g=>{
              
                return {...g,items:g.items.map(i=>{return g.default_ids.includes(i.id) ? {...i,selected:true} : {...i,selected:false}}),selected_ids:g.default_ids}
            
        })}


      })
      
      setFilterOPtions(new_filters)
      sendFilters(new_filters)
}


function onSearch(_search){
  setSearch(_search)
  data._updateFilters({search:_search},setSearchParams)
}



 
 async function confirmDelete(res){

    const db={
      
      transations:new PouchDB('transations'),
      bills_to_pay:new PouchDB('bills_to_pay'),
      bills_to_receive:new PouchDB('bills_to_receive'),

    } 
    
     setItemsToDelete([])

    
     if(res){
        let items=JSON.parse(JSON.stringify(itemsToDelete))
        let from=page.replaceAll('-','_')

        if(from=="inflows" || from=="outflows"){

           let transations=await db.transations.allDocs({ include_docs: true })
           let _items=transations.rows.map(i=>i.doc).filter(i=>!i.deleted && items.includes(i._id))
           let docs=await db[`bills_to_${page=="inflows"?"receive":"pay"}`].allDocs({ include_docs: true })
           docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
           let items_linked=_items.filter(i=>i.link_payment)

           //console.log({items_linked,items})

           for (let i = 0; i < items_linked.length; i++) {
              let fees=items_linked[i].fees ? parseFloat(items_linked[i].fees) : 0
              let amount=parseFloat(items_linked[i].amount)
              let account_id=items_linked[i].account.id
              let bill=docs.filter(i=>account_id==i.id)[0]

              

              bill.paid=parseFloat(bill.paid) - amount
              if(!bill.paid) bill.paid=""
              bill.fees=parseFloat(bill.fees ? bill.fees : 0) - fees
              bill.status="pending"
              const res=await db[`bills_to_${from=="inflows"?"receive":"pay"}`].put(bill)
              console.log({res})
              console.log({bill})
           }

           page="transations"
        }else if(from=="bills_to_pay" || from=="bills_to_receive"){

              

                 let docs=await db.transations.allDocs({ include_docs: true })
                 docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
                 
                 let transations=docs.filter(i=>i.link_payment)

                 let bills=await db[`${from}`].allDocs({ include_docs: true })

                 bills=bills.rows.map(i=>i.doc).filter(i=>!i.deleted && items.includes(i._id))

                 for (let i = 0; i < bills.length; i++) {
                   let id=bills[i].id
                   let _transations=transations.filter(i=>i.account.id==id)
                  for (let i = 0; i < _transations.length; i++) {
                      await db.transations.put({..._transations[i],deleted:true})
                  } 
                  
                 }
                 
        }
        const _res=await _delete(items,page.replaceAll('-','_'))
        alert(res)
        toast.success('Excluido com sucesso!')
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
                          <span className="text-white"><SearchIcon style={{ color: colors.app_orange[500] }}/></span>
                          <input value={search} onChange={(e)=>onSearch(e.target.value)} placeholder="Pesquisar..."  className="w-[160px] transition duration-300 ease-in-out outline-none bg-transparent flex-grow px-2 text-app_black-800"/>
                          {search.replaceAll(' ','').length!=0 && <span onClick={()=>onSearch('')} className=" cursor-pointer"><CloseIcon sx={{width:15,opacity:'0.8',color:colors.app_orange[500]}}/></span>}
                       </div>

                       
                     <DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/> 
                      
                     <div className="flex items-center">
                      <span className="py-1 px-2  rounded-[0.3rem]  text-gray-400">{!_filtered_content.length ? 'Nenhum resultado' : _filtered_content.length+' resultado'+`${_filtered_content.length >=2 ?'s':''}` } </span>
                     </div>

                   </div>

                  

                   <div className="flex">

                     <div className="mr-4  cursor-pointer h-10 flex justify-center items-center">
                       <LocalPrintshopOutlinedIcon sx={{color:colors.app_black[400]}}/>
                     </div>
                     <div className="mr-4  cursor-pointer h-10 flex justify-center items-center">
                       <ImportExport sx={{color:colors.app_black[400]}}/>
                     </div>

                    

                    <div>

                    {settings.has_add_btn && <>
                         <DefaultButton goTo={add_new} text={'Adicionar'}/>
                    </>
                    }
                    </div>

                    
                   </div>
                  
               </div>

               <div className="flex px-3 mb-3">
                         
                         {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).length!=0 && <div className="flex items-center mr-3">
                            
                            <span className="mr-2">Filtros:</span>
                              
                              { 
                                filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).some(i=>i.groups.some(f=>f.default_ids.toString()!=f.selected_ids.toString())) && <button onClick={()=>clearAllFilters()} type="button" className="text-gray-900 mt-2 bg-white flex hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-[5px] text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                <CloseIcon style={{width:'15px'}}/>
                                <span className="ml-1">Limpar filtros</span>
                                </button>
                              }

                          </div>}
                          <div className="flex mr-3 flex-wrap">

                                {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).map((i,_i)=>(
                                      
                                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                                    
                                ))}

                          </div>

                        
               </div>


               <div className="flex border-b mt-2 p-2 items-center">
                     <span className="mr-2">Resultado {search.replaceAll(' ','').length!=0 && 'para'}: {search.replaceAll(' ','').length!=0 && <span className=" text-app_orange-500">{search}</span>}</span>
                     {res.map((i,_i)=>(
                         <div className="flex border justify-center rounded-[4px] p-1 mr-2 min-w-[100px]" key={_i}> 
                                 <span className="mr-2">{i.name}</span>
                                 <span className="opacity-55">{i.value}</span>
                         </div>
                     ))}
               </div>

               <Table clearAllFilters={clearAllFilters} setDatePickerPeriodOptions={setDatePickerPeriodOptions} setFilterOptions={setFilterOPtions} watchFilterChanges={watchFilterChanges} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content} periodFilters={datePickerPeriodOptions} page={page} setSearch={setSearch} search={search} filterOptions={filterOptions} itemsToDelete={itemsToDelete} setItemsToDelete={setItemsToDelete}/>
            </div>
       
    </>
  )
}

export default BasicTable

