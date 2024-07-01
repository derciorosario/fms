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
import { FilterAlt, ImportExport } from '@mui/icons-material';
import { Filter1Outlined } from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
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
  const [showAllFilters,setShowAllFilters]=React.useState(false)
  const [filterIsActive,setFilterIsActive]=React.useState(false)


  
  const [filterOptions,setFilterOPtions]=useState([
    
      {
        open:false,
        field:'_payment_items',
        name:'Meios de pagamento',
        get_deleted:false,
        db_name:'payment_items',
        igual:true,
        search:'',
        groups:[
          {field:'_payment_items',name:'Meios de pagamento',db_name:'payment_items',items:[],selected_ids:[],default_ids:[]}
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
        name:'Conciliado',
        not_fetchable:true,
        igual:true,
        search:'',
        groups:[{field:'if_consiliated',name:'Conciliado',items:[{id:true,name:'Sim'},{id:false,name:'Não',selected:true}],selected_ids:[false],default_ids:[]}]
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
    if(filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).some(i=>i.groups.some(f=>f.default_ids.toString()!=f.selected_ids.toString()))){
            setFilterIsActive(true)
    }else{
       setFilterIsActive(false)
    }
},[filterOptions])

 React.useEffect(()=>{

    let _settings=JSON.parse(JSON.stringify(settings))

    if(page=='financial-reconciliation'){
            _settings.filters=['_account_categories','if_consiliated','transation_type','_payment_items']
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

    if(page=="payment-items"){
      _settings.from='_payment_items'
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

      setSearch('')

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
                 
        }else if(page=="managers" || page=="companies"){
          alert('in development')

            /* try{

              let response = await makeRequest({item:'post',url:`api/company/delete/`+items[i]}),data:{c:formData,managers:data._managers.filter(i=>chipOptions.includes(i.name+" "+i.last_name)).map(i=>i.id)}, error: ``},0);
             
              if(!response) return
               
              delete response.__v
              let user=await db.user.get('user')
              let new_user_data={...user,companies:[...user.companies,response],_rev:user._rev}
              await db.user.put(new_user_data)
              setUser(new_user_data)
    
              if(id){
                 _update('companies',[response])
              }else{
                 delete response.__v
                 _add('companies',[response])
    
              }


             }catch(e){

             }*/

             return

          

        }





        const _res=await _delete(items,page.replaceAll('-','_'))
        toast.success('Excluido com sucesso!')
     }
   }


   function print_exportExcel(type){
    let _d=[]
    let filname=""
    if(page=="inflows" || page=="outflows"){
        _d=_filtered_content.map(item => ({
          'ID':item.id,
          'Descrição':item.description,
          'Tipo':item.type=="in" ? 'Entrada' :'Saida',
          'Valor':(item.type=="out" && item.amount!=0 ?'-' :'')+""+data._cn(item.amount),
          'Canta de lançamento':data._account_categories.filter(i=>i.id==item.account.id)?.[0]?.name || '-',
          'Conta de transação':data._account_categories.filter(i=>i.id==item.transation_account.id)[0].name,
          'Multa':item.fees ? data._cn(item.fees) : '-',
          'Categoria':_categories.filter(i=>i.field==item.account_origin)[0].name,
          'Referência':data[`_${item.reference.type}`].filter(i=>i.id==item.reference.id)?.[0]?.name,
          'Data de criação':item.createdAt.split('T')[0],
      }))
      filname="Transações"
    }

    if(page=="bills-to-pay" || page=="bills-to-receive"){
      _d=_filtered_content.map(item => ({
        'ID':item.id,
        'Descrição':item.description,
        'Data de vencimento':item.payday.split('T')[0],
        'Valor em falta':data._cn(parseFloat(item.amount) + parseFloat(item.fees ? item.fees : 0) - parseFloat(item.paid ? item.paid : 0)),
        'Estado':item.status=='paid' || !item.status ? 'Pago' : new Date(item.payday) >= new Date(data._today())  ? 'Pendente' : 'Atrasado',
        'Valor':(page=="bills-to-pay" ? '-' :'')+""+data._cn(item.amount),
        'Pago':item.paid ? data._cn(item.paid) : '',
        'Canta':data._account_categories.filter(i=>i.id==item.account_id)?.[0]?.name || '',
        'Multa':item.fees ? data._cn(item.fees) : '-',
        'Número de prestações':item.total_installments,
        'Referência':data[`_${item.reference.type}`].filter(i=>i.id==item.reference.id)?.[0]?.name,
        'Categoria':_categories.filter(i=>i.field==item.account_origin)[0].name,
        'Data de criação':item.createdAt.split('T')[0],
    }))
    filname=`Contas a ${page=="bills-to-pay" ? 'pagar' :'receber'}`
   }

    if(page=="bills-to-pay" || page=="bills-to-receive"){
      _d=_filtered_content.map(item => ({
        'ID':item.id,
        'Descrição':item.description,
        'Data de vencimento':item.payday.split('T')[0],
        'Valor em falta':data._cn(parseFloat(item.amount) + parseFloat(item.fees ? item.fees : 0) - parseFloat(item.paid ? item.paid : 0)),
        'Estado':item.status=='paid' || !item.status ? 'Pago' : new Date(item.payday) >= new Date(data._today())  ? 'Pendente' : 'Atrasado',
        'Valor':(page=="bills-to-pay" ? '-' :'')+""+data._cn(item.amount),
        'Pago':item.paid ? data._cn(item.paid) : '-',
        'Canta':data._account_categories.filter(i=>i.id==item.account_id)?.[0]?.name || '-',
        'Multa':item.fees ? data._cn(item.fees) : '-',
        'Número de prestações':item.total_installments,
        'Referência':data[`_${item.reference.type}`].filter(i=>i.id==item.reference.id)?.[0]?.name,
        'Categoria':_categories.filter(i=>i.field==item.account_origin)[0].name,
        'Data de criação':item.createdAt.split('T')[0],
    }))
    filname=`Contas a ${page=="bills-to-pay" ? 'pagar' :'receber'}`
  }

  if(page=="clients" || page=="investors" || page=="suppliers"){
    _d=_filtered_content.map(item => ({
      'ID':item.id,
      'Nome':item.name,
      'Email':item.email,
      'Contactos':item.contacts.join(', '),
      'Endereço':item.address,
      'observações':item.notes || '',
      'Data de criação':item.createdAt.split('T')[0],
  }))
   filname=`${page=="clients" ? "Clientes" : page=="suppliers" ? "Fornecedores" : "Investidores"}`
  }

  if(page=="managers"){
    _d=_filtered_content.map(item => ({
      'ID':item.id,
      'Nome':item.name,
      'Apelido':item.last_name,
      'Email':item.email,
      'Empresas com acesso':data._companies.filter(i=>item.companies.includes(i.id)).map(i=>i.name).join(', '),
      'Contactos':item.contacts.join(', '),
      'Endereço':item.address,
      'observações':item.notes || '',
      'Data de criação':item.createdAt.split('T')[0],
  }))
  filname=`Gestores`
  }
  
  if(page=="account-categories"){
    _d=_filtered_content.map(item => ({
      'ID':item.id,
      'Nome':item.name,
      'Categoria':_categories.filter(i=>i.field==item.account_origin)[0].name,
      'Data de criação':item.createdAt.split('T')[0],
  }))
  filname=`plano de contas`
  }


  if(page=="companies"){
    _d=_filtered_content.map(item => ({
      'Nome':item.name,
      'Email':item.email,
      'Gestores':data._managers.filter(i=>i.companies.includes(item.id)).map(i=>i.name).join(', '),
      'Clientes':data._clients.filter(i=>i.company_id==item.id).length,
      'Fornecedores':data._suppliers.filter(i=>i.company_id==item.id).length,
      'investidores':data._investors.filter(i=>i.company_id==item.id).length,
      'Contactos':item.contacts.join(', '),
      'Endereço':item.address,
      'Data de criação':item.createdAt.split('T')[0],
  }))
  filname=`Empresas`
  }


  if(page=="payment-methods"){
    _d=_filtered_content.map(item => ({
      'Nome':item.name,
      'Tipo':item.type=="mobile" ? 'Móvel' : item.type=="bank" ? 'Bancária' : item.type=="cashier" ? 'Caixa' : 'Outro',
      'Saldo':parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==item.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((item.initial_amount ? item.initial_amount : 0)) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==item.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))),
      'Data de criação':item.createdAt.split('T')[0],
  }))
  filname=`Meios de pagamento`
  }



     if(type=="excel"){
         data._exportToExcel(_d,`${filname} - ${data._convertDateToWords(data._today(),null,'all')}  ${new Date().getHours()}_${new Date().getMinutes()}`)
     }else{
         data._print(_d)
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
                       {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).length!=0 && <span className="mr-2 ml-2 h-[40px] flex items-center cursor-pointer hover:opacity-80" onClick={()=>setShowAllFilters(!showAllFilters)}>
                                {!showAllFilters && <FilterAltOutlinedIcon sx={{color:showAllFilters ? colors.app_orange[500] : colors.app_black[500]}}/>}
                                {showAllFilters && <FilterAlt sx={{color:showAllFilters ? colors.app_orange[500] : colors.app_black[500]}}/>}
                                <span className="text-[14px]">{!showAllFilters && 'Mostar filtros'}</span>
                     
                        </span>}
                         
                     <div className="flex items-center">
                      <span className="py-1 px-2   rounded-[0.3rem]  text-gray-400">{!_filtered_content.length ? 'Nenhum resultado' : _filtered_content.length+' resultado'+`${_filtered_content.length >=2 ?'s':''}` } </span>
                     </div>

                   </div>

                  

                   <div className="flex">

                     <div onClick={()=>{
                         print_exportExcel('print')
                     }} className="mr-3 hover:opacity-80  cursor-pointer h-10 flex justify-center items-center">
                       <LocalPrintshopOutlinedIcon sx={{color:colors.app_black[400]}}/>
                     </div>
                     <div  onClick={()=>{
                         print_exportExcel('excel')
                     }} className="mr-4 hover:opacity-80  cursor-pointer h-10 flex justify-center items-center">
                         <svg style={{fill:colors.app_black[400]}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 16h2V7h3l-4-5-4 5h3z"></path><path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z"></path></svg>
                     </div>

                    

                    <div>

                    {settings.has_add_btn && <>
                         <DefaultButton goTo={add_new} text={'Adicionar'}/>
                    </>
                    }
                    </div>

                    
                   </div>
                  
               </div>

               <div className="flex pr-3 mb-3">
                         
                         {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).length!=0 && <div className="flex items-center mr-3">
                            
                           
                              
                              { 
                                filterIsActive && <button onClick={()=>clearAllFilters()} type="button" className="text-gray-900 mt-[12px] ml-3 bg-white flex hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-[5px] text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                <CloseIcon style={{width:'15px'}}/>
                                  <span className="ml-1 flex">Limpar filtros</span>
                                </button>
                              }

                          </div>}
                          <div className={`${showAllFilters ? 'flex' :'hidden'} mr-3 flex-wrap`}>

                                {filterOptions.filter(f=>settings.filters.some(i=>i==f.field)).map((i,_i)=>(
                                      
                                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                                    
                                ))}

                          </div>

                        
               </div>


               <div className={`flex border-b mt-2 ml-2 p-2 items-center ${!filterIsActive && !search ? 'hidden':''}`}>
                     <span className="mr-2">Resultado {search.replaceAll(' ','').length!=0 && 'para'}: {search.replaceAll(' ','').length!=0 && <span className=" text-app_orange-500">{search}</span>}</span>
                     {res.map((i,_i)=>(
                         <div className="flex border justify-center rounded-[4px] p-1 mr-2 min-w-[100px]" key={_i}> 
                                 <span className="mr-2">{i.name}</span>
                                 <span className="opacity-55">{i.value}</span>
                         </div>
                     ))}
               </div>

             </div>

             <div className="bg-white shadow rounded-[0.3rem] p-2">
             <Table clearAllFilters={clearAllFilters} setDatePickerPeriodOptions={setDatePickerPeriodOptions} setFilterOptions={setFilterOPtions} watchFilterChanges={watchFilterChanges} _setFilteredContent={_setFilteredContent} _filtered_content={_filtered_content} periodFilters={datePickerPeriodOptions} page={page} setSearch={setSearch} search={search} filterOptions={filterOptions} itemsToDelete={itemsToDelete} setItemsToDelete={setItemsToDelete}/>
           
             </div>
       
    </>
  )
}

export default BasicTable

