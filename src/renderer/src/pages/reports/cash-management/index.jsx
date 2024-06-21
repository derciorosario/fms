import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import Filter from '../../../components/Filters/basic';
import SearchIcon from '@mui/icons-material/Search';
import DatePickerRange from '../../../components/Filters/date-picker-range'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chart  from '../../../components/Charts/chart-1';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import StatsTable from '../components/table';
function App() {

  const {_get_cash_managment_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_get} = useData();
  const {pathname} = useLocation()
  const [search,setSearch]=React.useState('')
  const [data,setData]=React.useState([])
  const [updater,setUpdater]=React.useState(1)
  const [showProjected,setShowProjected]=React.useState(1)
  const period=pathname.includes('/daily') ? 'd' : 'm'
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      field:'_accounts',
      name:'Contas',
      page:'cash-managemnt-stats',
      get_deleted:true,
      db_name:'accounts',
      igual:true,
      search:'',
      groups:[
        {field:'_accounts',name:'contas',db_name:'accounts',items:[],selected_ids:[]}
      ]
    },

    {
      field:'_show_projected',
      name:'Visão',
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      hide_search:true,
      single:true,
      groups:[
        {field:'_show_projected',name:'Mês',items:[{name:'projectado e realizado',id:1,selected:true},{name:'Realizado',id:2},{name:'Projectado',id:3}],selected_ids:[1]}
      ]
    },

    {
        field:'_week_and_month',
        name:'Periodo',
        page:'cash-managemnt-stats',
        igual:true,
        not_fetchable:true,
        search:'',
        single:true,
        groups:[
          {field:'_week_and_month',name:'Visão',items:[{id:'week',name:'Diário',to:'/reports/cash-management/daily',selected:pathname.includes('/daily') ? true : false},{id:'month',name:'Mensal',selected:pathname.includes('/monthly') ? true :false,to:'/reports/cash-management/monthly'}],selected_ids:['month']}
        ]
      },
   
])



useEffect(()=>{



  if(period=='d'){
    let months=['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    setFilterOPtions(prev=>([...prev.filter(i=>i.field!="_month"),
      {
        field:'_month',
        name:'Mês',
        page:'cash-managemnt-stats',
        not_fetchable:true,
        igual:true,
        search:'',
        hide_igual:true,
        hide_search:true,
        single:true,
        groups:[
          {field:'_month',dropdown:true,name:'Mês',items:months.map((i,_i)=>({name:i.toString(),id:_i,selected:_i==new Date().getMonth() ? true : false})),selected_ids:[new Date().getMonth()]}
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
      name:'Ano',
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      dropdown:true,
      single:true,
      groups:[
        {field:'_year',name:'contas',db_name:'accounts',items:years.map((i)=>({name:i.toString(),id:i.toString(),selected:i==new Date().getFullYear() ? true : false})),selected_ids:[years[years.length - 1].toString()]}
      ]
    },
  ]))

 
},[_transations,_bills_to_pay,_bills_to_receive,pathname])


const [datePickerPeriodOptions,setDatePickerPeriodOptions]=React.useState({
    open:false,
    igual:true,
    startDate:null,
    endDate:null,
    name:'Periodo',
    search:'',
    field:'_transations',
    groups:[{field:'period',name:'Periodo',items:[
      {id:'this_week',name:'Esta semana'},
      {id:'this_month',name:'Este mês'},
      {id:'last_month',name:'Mês passado'},
      {id:'this_year',name:'Este ano'}
    ],selected_ids:[]}]
     
  })

  


  
  const [chartDataSets,setChartDataSets]=useState([])
  const [chartLabels,setChartLabels]=useState([])


 

 


  useEffect(()=>{

     if(!_loaded.includes('categories')) return
     let {data,datasets,labels}=_get_cash_managment_stats(filterOptions,period)
     setData(data)
     setChartDataSets(datasets)
     setChartLabels(labels)


  },[_loaded,filterOptions])
 

  useEffect(()=>{
    _get('categories')
   },[])

 
  return (
    <>
    
        <DefaultLayout details={{name:'Relatórios de fluxo de caixa'}}>

        
    
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
                        <span>Relatório de entradas x Saídas</span>
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

