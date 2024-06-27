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
import StatsTable from '../components/table'
import DefaultButton from '../../../components/Buttons/default';
function App() {

  const {_get_dre_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_get} = useData();
  const {pathname} = useLocation()
  const [search,setSearch]=React.useState('')
  const [data,setData]=React.useState([])
  const [updater,setUpdater]=React.useState(1)
  const [showProjected,setShowProjected]=React.useState(1)
  const period=pathname.includes('/daily')  ? 'd' : 'm'
  
  const [filterOptions,setFilterOPtions]=useState([
  
    {
        field:'_week_and_month',
        name:'Periodo',
        page:'cash-managemnt-stats',
        igual:true,
        not_fetchable:true,
        search:'',
        single:true,
        groups:[
          {field:'_week_and_month',name:'Periodo',items:[{id:'week',name:'Diário',to:'/reports/dre/daily',selected:pathname.includes('/daily') ? true : false},{id:'month',name:'Mensal',selected:!pathname.includes('/daily') ? true :false,to:'/reports/dre/monthly'}],selected_ids:['month']}
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


  const [openItems,setOpenItems]=useState([])


 


  useEffect(()=>{
     if(!_loaded.includes('categories')) return
     let {data,datasets,labels}=_get_dre_stats(filterOptions.filter(i=>i.field=="_month"),period)
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
               
                <div className="mr-4">
                   <DefaultButton text={'Actualizar'} no_bg={true} disabled={false}/>
                </div>
            
                {/**<DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/>**/ }   

                {filterOptions.map((i,_i)=>(
                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                ))}
        </div>

        <div className="shadow bg-white p-3">
               <div className="flex justify-between mb-2">
                     <div>
                        <span>Demonstração de resultados</span>
                     </div>
                     <div className="mr-4 cursor-pointer flex">
                       <LocalPrintshopOutlinedIcon/>
                       <span className="ml-2">Imprimir</span>
                     </div>
               </div>
        </div>

        <StatsTable content={{data,period,openItems,showProjected, showIcons:true}}/>


        </DefaultLayout>
    </>
  ) 
}
export default App

