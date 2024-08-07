import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useData  } from '../../contexts/DataContext';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import Filter from '../../components/Filters/basic';
import Chart  from '../../components/Charts/chart-1';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import StatsTable from '../reports/components/table';
import { t } from 'i18next';
function App() {

  const {_get_budget_managment_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_account_categories} = useData();
  const {pathname} = useLocation()
  const [search,setSearch]=React.useState('')
  const [data,setData]=React.useState([])
  const [updater,setUpdater]=React.useState(1)
  const [showProjected,setShowProjected]=React.useState(1)
  const period=pathname.includes('/daily') ? 'd' : 'm'
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      field:'_accounts',
      name:t('common.accounts'),
      page:'cash-managemnt-stats',
      get_deleted:true,
      db_name:'accounts',
      igual:true,
      search:'',
      groups:[
        {field:'_accounts',name:t('common.accounts'),db_name:'accounts',items:[],selected_ids:[]}
      ]
    },

    {
      field:'_show_projected',
      name:t('common.view_'),
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      hide_search:true,
      single:true,
      groups:[
        {field:'_show_projected',name:t('common.month'),items:[{name:'projectado e realizado',id:1,selected:true},{name:t('common.done'),id:2},{name:t('common.projected'),id:3}],selected_ids:[1]}
      ]
    },

   
   
])



useEffect(()=>{



  if(period=='d'){
    let months=[
      t('common.months.january'),
      t('common.months.february'),
      t('common.months.march'),
      t('common.months.april'),
      t('common.months.may'),
      t('common.months.june'),
      t('common.months.july'),
      t('common.months.august'),
      t('common.months.september'),
      t('common.months.october'),
      t('common.months.november'),
      t('common.months.december')
    ]
    setFilterOPtions(prev=>([...prev.filter(i=>i.field!="_month"),
      {
        field:'_month',
        name:t('common.month'),
        page:'cash-managemnt-stats',
        not_fetchable:true,
        igual:true,
        search:'',
        hide_igual:true,
        hide_search:true,
        single:true,
        groups:[
          {field:'_month',dropdown:true,name:t('common.month'),items:months.map((i,_i)=>({name:i.toString(),id:_i,selected:_i==new Date().getMonth() ? true : false})),selected_ids:[new Date().getMonth()]}
        ]
      },
    ]))
  }else{

  }

  if(!_loaded.includes('bills_to_pay') || !_loaded.includes('bills_to_receive') || !_loaded.includes('transations')) return

  let years=[new Date().getFullYear()]

  _transations.forEach(e=>{
      if(!years.includes(new Date(e.createdAt).getFullYear()))  years.push(new Date(e.createdAt).getFullYear())
  }) 

  _bills_to_pay.forEach(e=>{
    if(!years.includes(new Date(e.payday).getFullYear()))  years.push(new Date(e.payday).getFullYear())
  }) 

  _bills_to_receive.forEach(e=>{
    if(!years.includes(new Date(e.payday).getFullYear()))  years.push(new Date(e.payday).getFullYear())
  }) 

 
  setFilterOPtions(prev=>([...prev.filter(i=>i.field!="_year" && (period=='m' ? i.field!="_month" : true==true)),
    {
      field:'_year',
      name:t('common.year'),
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      dropdown:true,
      single:true,
      groups:[
        {field:'_year',name:t('common.accounts'),db_name:'accounts',items:years.map((i)=>({name:i.toString(),id:i.toString(),selected:i==new Date().getFullYear() ? true : false})),selected_ids:[years[years.length - 1].toString()]}
      ]
    },
  ]))

 
},[_transations,_bills_to_pay,_bills_to_receive,pathname])


const [datePickerPeriodOptions,setDatePickerPeriodOptions]=React.useState({
    open:false,
    igual:true,
    startDate:null,
    endDate:null,
    name:t('common.period'),
    search:'',
    field:'_transations',
    groups:[{field:'period',name:t('common.period'),items:[
      {id:'this_week',name:'Esta semana'},
      {id:'this_month',name:'Este mês'},
      {id:'last_month',name:'Mês passado'},
      {id:'this_year',name:'Este ano'}
    ],selected_ids:[]}]
     
  })

  


  
  const [chartDataSets,setChartDataSets]=useState([])
  const [chartLabels,setChartLabels]=useState([])


 

 


  useEffect(()=>{
     let {data,datasets,labels}=_get_budget_managment_stats(filterOptions,period)
     setData(data)
     setChartDataSets(datasets)
     setChartLabels(labels)


  },[_loaded,filterOptions])
 

 
  return (
    <>
    
        <DefaultLayout details={{name:'Relatórios de orçamento'}}>

        
    
        <div className="flex flex-wrap bg-white p-3 mb-2 shadow z-10">
               
                <Button>Actualizar</Button>
            
                {/**<DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/>**/ }   

                {filterOptions.map((i,_i)=>(
                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                ))}
        </div>

        <div className="shadow bg-white p-3 mb-1">
               <div className="flex justify-between mb-2">
                     <div>
                        <span>Relatório de Orçamento</span>
                     </div>
                     <div className="mr-4 cursor-pointer flex">
                       <LocalPrintshopOutlinedIcon/>
                       <span className="ml-2">Imprimir</span>
                     </div>
               </div>

               <div className="min-h-[400px] relative">
                     <Chart datasets={chartDataSets} labels={chartLabels}/>
               </div>
        </div>
        

        <StatsTable content={{data,period,showProjected}}/>

        </DefaultLayout>
    </>
  )
}
export default App

