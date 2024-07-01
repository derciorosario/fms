import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import Filter from '../../../components/Filters/basic';
import { useLocation } from 'react-router-dom';
import StatsTable from '../components/table'
import DefaultButton from '../../../components/Buttons/default';
import colors from '../../../assets/colors.json'
function App() {

  const {_get_dre_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_get,_print_exportExcel} = useData();
  const {pathname} = useLocation()
  const [search,setSearch]=React.useState('')
  const [data,setData]=React.useState([])
  const [updater,setUpdater]=React.useState(1)
  const [showProjected,setShowProjected]=React.useState(1)
  const period=pathname.includes('/daily')  ? 'd' : 'm'
  const [currentMenu,setCurrentMenu]=React.useState(1)

  const page_menus=[
    {name:' Análise simples'},
    {name:' Análise comparativa'}
  ]
  
  
  const [filterOptions,setFilterOPtions]=useState([

   

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
        {field:'_show_projected',name:'Mês',items:[{name:'Previsto e realizado',id:1},{name:'Realizado',id:2,selected:true},{name:'Previsto',id:3}],selected_ids:[2],default_ids:[2]}
      ]
    },
    
  
    {
        field:'_week_and_month',
        name:'Periodo',
        page:'cash-managemnt-stats',
        igual:true,
        not_fetchable:true,
        hide:true,
        search:'',
        single:true,
        groups:[
          {field:'_week_and_month',name:'Periodo',items:[{id:'week',name:'Diário',to:'/reports/dre/daily',selected:pathname.includes('/daily') ? true : false},{id:'month',name:'Mensal',selected:!pathname.includes('/daily') ? true :false,to:'/reports/dre/monthly'}],selected_ids:['month']}
        ]
      },
   
])



useEffect(()=>{



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
          {field:'_month',dropdown:true,name:'Mês',items:months.map((i,_i)=>({name:i.toString(),id:_i,selected:_i==new Date().getMonth() ? true : false})),selected_ids:[new Date().getMonth()],default_ids:[new Date().getMonth()]}
         ]
      },
    ]))
  

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

 
  setFilterOPtions(prev=>([...prev.filter(i=>i.field!="_year" && (currentMenu==2 && period=='m' ? i.field!="_month": true)),
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


  function print_exportExcel(type){
    
    let project_only=filterOptions.filter(i=>i.field=="_show_projected")[0].groups[0].selected_ids[0]
    let month=filterOptions.filter(i=>i.field=="_month")[0]?.groups?.[0]?.selected_ids?.[0]

    let title=`Demonstração de resultados`
    
    _print_exportExcel(data,type,currentMenu,period,project_only,month,title)
 }


 


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
    
        <DefaultLayout details={{name:'Dermostração de resutados'}}>
        
    
        <div className="flex flex-wrap bg-white p-3 mb-2 shadow z-10 rounded-[0.3rem]">
               
                <div className="mr-4 hidden">
                   <DefaultButton text={'Actualizar'} no_bg={true} disabled={false}/>
                </div>
            
                {/**<DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/>**/ }   

                {filterOptions.map((i,_i)=>(
                        <Filter key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                ))}
        </div>


        <div className="px-3 py-3 [&>_span]:mr-4 [&>_span]:table [&>_span]:relative [&>_span]:cursor-pointer  rounded-[0.3rem] p-3 mb-2 shadow flex items-center bg-white">
            {page_menus.map((i,_i)=>(
                    <span onClick={()=>setCurrentMenu(_i + 1)} className={`${currentMenu==_i + 1 ? 'text-app_orange-400':' opacity-70'} hover:text-app_orange-400`}>
                      <label className={`absolute ${currentMenu!=_i + 1 ? 'hidden' :''} top-full translate-y-[9px] w-full h-[3px] rounded-tl rounded-tr bg-app_orange-300`}></label>
                       {i.name}
                     </span>
                
            ))}
         </div>



        <div className="shadow bg-white p-3">
               <div className="flex justify-between mb-2">
                     <div>
                        <span>Demonstração de resultados</span>
                     </div>
                     <div className="flex items-center">
                            <div  onClick={()=>{
                                print_exportExcel('print')
                              }}  className="mr-4 cursor-pointer flex opacity-70">
                                <LocalPrintshopOutlinedIcon/>
                              </div>
                              {currentMenu!=0 && <div  onClick={()=>{
                                print_exportExcel('excel')
                              }} className="mr-4 hover:opacity-80  cursor-pointer h-10 flex justify-center items-center">
                                <svg style={{fill:colors.app_black[400]}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 16h2V7h3l-4-5-4 5h3z"></path><path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z"></path></svg>
                            </div>}
                     </div>
               </div>
        </div>

        {currentMenu!= 0 && <StatsTable content={{data,currentMenu,period,filterOptions}}/>}
        </DefaultLayout>
    </>
  ) 
}
export default App

