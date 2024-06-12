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
function App() {

  const {_get_cash_managment_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_account_categories} = useData();
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
          {field:'_month',dropdown:true,name:'Mês',items:months.map((i,_i)=>({name:i.toString(),id:i.toString(),selected:_i==new Date().getMonth() ? true : false})),selected_ids:[months[new Date().getMonth()].toString()]}
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
     let {data,datasets,labels}=_get_cash_managment_stats(false,period)
     setData(data)
     setChartDataSets(datasets)
     setChartLabels(labels)


  },[_loaded,filterOptions])
 

  console.log(openItems)


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

<div class="relative overflow-x-auto shadow mb-[100px]">

{/***   monthly   *** */}
{period=="m" && <table class={` ${period=="d" ? 'hidden' :''} ${showProjected==2 ? '_done' :''} ${showProjected==3 ? '_projected':''} _montly _table_stats w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400`}>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr className="[&>_th]:px-6 [&>_th]:py-3 [&>_th]:text-center">
            <th rowSpan={3}><span className="flex translate-y-2">Categorias de lançamentos</span></th>

            {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((i,_i)=>(
                <th key={_i} colspan="3" className={`${new Date().getMonth()==_i ? 'bg-blue-50':''}`}>{i}</th>
            ))}
            
          
         </tr>
        
    </thead>
    <tbody>
        <tr  class="[&>_td]:px-6 [&>_td]:py-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td></td>
            {Array.from({ length: 12 }, () => 0).map((i,_i)=>(
                <>
                <td className={`${new Date().getMonth()==_i ? 'bg-blue-50':''} ${showProjected==88 ? 'hidden':''} `}>Previsto</td>
                <td className={`${new Date().getMonth()==_i ? 'bg-blue-50':''} ${showProjected==88 ? 'hidden':''} `}>Realizado</td>
                <td className={`${new Date().getMonth()==_i ? 'bg-blue-50':''}`}>Atingido (%)</td>
                </>
            ))}
        </tr>


        {data.map((i,_i)=>(
                       <>
                       <tr key={'i1'+_i}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                       <td onClick={()=>setOpenItems(openItems.includes('i-'+_i) ? openItems.filter(o=>o!='i-'+_i) : [...openItems,'i-'+_i])}  className={` flex items-center relative font-medium`} style={{color:i.color,cursor:i.sub ? 'pointer':'initial'}}><span className={`border-l-[3px] flex w-full absolute left-0 top-[-2px]`} style={{height:'calc(100% + 4px)',borderColor:i.color}}></span>
                        {i.sub && <div className={`${openItems.includes('i-'+_i) ? 'rotate-90':''}`}><KeyboardArrowRightIcon/></div>}
                        {i.name}
                       </td>
                       {i.items.map((i2,_i2)=>(
                           
                            <>
                                <td className={`${new Date().getMonth()==_i2 ? 'bg-blue-50':''}`} style={{color:i2.projected < 0 ? 'crimson' : i.color }}>{i2.projected.toFixed(2)}</td>
                                <td className={`${new Date().getMonth()==_i2 ? 'bg-blue-50':''}`} style={{color:i2.done < 0 ? 'crimson' : i.color }}>{i2.done.toFixed(2)}</td>
                                <td className={`${new Date().getMonth()==_i2 ? 'bg-blue-50':''}`} style={{color:i2.percentage < 0 ? 'crimson' : i.color }}>{i2.percentage.toFixed(0)} (%)</td>
                           </>

                        ))}
                       </tr>

                       {(i.sub?.length ? true : false) && (

                             <>
                                {i.sub.map((i2,_i2)=>(
                                    <>
                                    <tr key={'i2'+_i2} style={{display:openItems.includes('i-'+_i) ? 'table-row':'none'}}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                     <td onClick={()=>setOpenItems(openItems.includes('i2-'+_i2+'-'+i.field) ? openItems.filter(o=>o!='i2-'+_i2+'-'+i.field) : [...openItems,'i2-'+_i2+'-'+i.field])} style={{cursor:i2.sub ? 'pointer':'initial'}} className={` flex items-center relative font-medium`} ><span style={{borderColor:i.color}}  className={`border-l-[3px] h-full flex w-full absolute left-0 top-0`}></span>
                                     <span className="pl-8 flex items-center">
                                     {i2.sub && <div className={`${openItems.includes('i2-'+_i2) ? 'rotate-90':''}`}><KeyboardArrowRightIcon/></div>}
                                     {i2.name}
                                     </span>
                                    </td>
                                    {i2.items.map((i3,_i3)=>(
                                        
                                         <>
                                             <td className={`${new Date().getMonth()==_i3 ? 'bg-blue-50':''}`} style={{color:i3.projected < 0 ? 'crimson' : 'initial' }}>{i3.projected.toFixed(2)}</td>
                                             <td className={`${new Date().getMonth()==_i3 ? 'bg-blue-50':''}`} style={{color:i3.done < 0 ? 'crimson' : 'initial' }}>{i3.done.toFixed(2)}</td>
                                             <td className={`${new Date().getMonth()==_i3 ? 'bg-blue-50':''}`} style={{color:i3.percentage < 0 ? 'crimson' : 'initial' }}>{i3.percentage.toFixed(0)} (%)</td>
                                        </>
             
                                     ))}
                                    </tr>

                                       {(i2.sub?.length ? true : false) && (
                                           <>
                                               {i2.sub.map((i3,_i3)=>(
                                                     <tr key={'i3'+_i3} style={{display:openItems.includes('i2-'+_i2+'-'+i.field) && openItems.includes('i-'+_i) ? 'table-row':'none'}}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                        <td className={` flex items-center relative font-medium`} ><span style={{borderColor:i3.color}} className={`border-l-[3px]  h-full flex w-full absolute left-0 top-0`}></span>
                                                          <span className="pl-14 flex items-center">
                                                            {i3.name}
                                                          </span>
                                                        </td>
                                                        {i3.items.map((i4,_i4)=>(
                                        
                                                              <>
                                                                    <td className={`${new Date().getMonth()==_i4 ? 'bg-blue-50':''}`} style={{color:i4.projected < 0 ? 'crimson' : 'initial' }}>{i4.projected.toFixed(2)}</td>
                                                                    <td className={`${new Date().getMonth()==_i4 ? 'bg-blue-50':''}`} style={{color:i4.done < 0 ? 'crimson' : 'initial' }}>{i4.done.toFixed(2)}</td>
                                                                    <td className={`${new Date().getMonth()==_i4 ? 'bg-blue-50':''}`} style={{color:i4.percentage < 0 ? 'crimson' : 'initial' }}>{i4.percentage.toFixed(0)} (%)</td>
                                                              </>
                                              
                                                        ))}
                                                       </tr>
                                               ))}
                                           </>
                                       )}
                                    </>
                                ))} 
                             </>            
                                

                       )}
                    </>
        ))}

        
       
    </tbody>
</table>}


{/**  weekly ** */}
{period == 'd' && 
<table class={` ${period=="m" ? 'hidden' :''} _table_stats _daily w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400`}>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr className="[&>_th]:px-6 [&>_th]:py-3 [&>_th]:text-center">
            <th rowSpan={3}><span className="flex translate-y-2">Dias</span></th>

            {['Entradas', 'Saídas', 'Resultado', 'Saldo'].map((i,_i)=>(
                <th key={_i} colspan="2" className={`${new Date().getMonth()==_i ? 'bg-blue-50':''}`}>{i}</th>
            ))}
            
          
         </tr>
        
    </thead>
    <tbody>

    <tr  class="[&>_td]:px-6 [&>_td]:py-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
           <td></td>
            {Array.from({ length: 4 }, () => 0).map((i,_i)=>(
                <>
                <td className={`${new Date().getMonth()==_i ? 'bg-blue-50':''}`}>Previsto</td>
                <td className={`${new Date().getMonth()==_i ? 'bg-blue-50':''}`}>Realizado</td>
                </>
            ))}
        </tr>
       
         
        {data.map((i,_i)=>(

                       <tr key={'i1'+_i}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                       <td className={` flex items-center relative font-medium`}><span className={`border-l-[3px] flex w-full absolute left-0 top-[-2px]`}></span>
                        {i.day}
                       </td>
                       {i.items.map((i2,_i2)=>(
                           
                            <>
                                <td className={`${new Date().getMonth()==88 ? 'bg-blue-50':''}`} style={{color:i2.projected < 0 || _i2==1 ? 'crimson' : _i2==0 ? 'rgb(22, 163, 74)' :  '#111' }}>{i2.projected.toFixed(2)}</td>
                                <td className={`${new Date().getMonth()==99 ? 'bg-blue-50':''}`} style={{color:i2.done < 0 || _i2==1 ? 'crimson' : _i2==0 ? 'rgb(22, 163, 74)' : '#111'}}>{i2.done.toFixed(2)}</td>
                           </>

                        ))}
                       </tr>
        ))}
        
       
    </tbody>
</table>
}



</div>

        </DefaultLayout>
    </>
  )
}
export default App

