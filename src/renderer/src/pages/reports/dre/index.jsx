import React,{useEffect, useState} from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useData  } from '../../../contexts/DataContext';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import Filter from '../../../components/Filters/basic';
import { useLocation } from 'react-router-dom';
import StatsTable from '../components/table'
import DefaultButton from '../../../components/Buttons/default';
import colors from '../../../assets/colors.json'
import { useAuth } from '../../../contexts/AuthContext';
import { t } from 'i18next';
import i18n from '../../../i18n';
function App() {

  const {_setRequiredData,_get_dre_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_get,_print_exportExcel,_investments} = useData();
  const {pathname} = useLocation()
  const [search,setSearch]=React.useState('')
  const [data,setData]=React.useState([])
  const [updater,setUpdater]=React.useState(1)
  const [showProjected,setShowProjected]=React.useState(1)
  const period=pathname.includes('/daily')  ? 'd' : 'm'
  const [currentMenu,setCurrentMenu]=React.useState(1)
 
  const page_menus=[
    {name:' '+t('common.simple-analyze')},
    {name:' '+t('common.months-comparison')},
  ]

  

  const [initialized,setInitialized]=useState(false)

  useEffect(()=>{
    
    if(!(required_data.some(i=>!_loaded.includes(i)))){
        setInitialized(true)
    }
   },[_loaded])

   let required_data=['investments','loans','bills_to_pay','account_categories','bills_to_receive','payment_methods','transations']

   const {db} = useAuth()

   useEffect(()=>{
    _setRequiredData(required_data)
   },[])
  
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      field:'_show_projected',
      name:t('common.view_'),
      t_name:'view_',
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      hide_search:true,
      single:true,
      groups:[
        {field:'_show_projected',name:t('common.month'),items:[{name:t('common.projectedAndDone'),t_name:'projectedAndDone',id:1},{name:t('common.done'),t_name:'done',id:2,selected:true},{name:t('common.projected'),t_name:'projected',id:3}],selected_ids:[2],default_ids:[2]}
      ]
    },
    
  
    {
        field:'_week_and_month',
        name:t('common.period'),
        t_name:'period',
        page:'cash-managemnt-stats',
        igual:true,
        not_fetchable:true,
        hide:true,
        search:'',
        single:true,
        groups:[
          {field:'_week_and_month',name:t('common.period'),items:[{id:'week',name:t('common.daily'),t_name:'daily',to:'/reports/dre/daily',selected:pathname.includes('/daily') ? true : false},{id:'month',name:t('common.monthly'),t_name:'monthly',selected:!pathname.includes('/daily') ? true :false,to:'/reports/dre/monthly'}],selected_ids:['month']}
        ]
      },
   
])


useEffect(()=>{
  _get(required_data.filter(i=>!_loaded.includes(i)))

},[db,filterOptions])

 

useEffect(()=>{

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
        t_name:'month',
        page:'cash-managemnt-stats',
        not_fetchable:true,
        igual:true,
        search:'',
        hide_igual:true,
        hide_search:true,
        single:true,
        groups:[
          {field:'_month',dropdown:true,name:t('common.month'),items:months.map((i,_i)=>({name:i.toString(),id:_i,selected:_i==new Date().getMonth() ? true : false})),selected_ids:[new Date().getMonth()],default_ids:[new Date().getMonth()]}
         ]
      },
    ]))
  

  if(!_loaded.includes('bills_to_pay') || !_loaded.includes('bills_to_receive') || !_loaded.includes('transations')) return

  function getNextYears(currentYear, numberOfYears) {
    let yearsArray = [];
    for (let i = 0; i < numberOfYears; i++) {
      yearsArray.push(currentYear + i);
    }
    return yearsArray;
  }


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

  _investments.forEach(e=>{
    let years_array=getNextYears(new Date(e.buyday).getFullYear(), parseInt(e.time))
    years=[...years,...years_array.filter(i=>!years.includes(i))]
    if(!years.includes(new Date(e.buyday).getFullYear()))  years.push(new Date(e.buyday).getFullYear())
  }) 

 
  setFilterOPtions(prev=>([...prev.filter(i=>i.field!="_year" && (currentMenu==2 && period=='m' ? i.field!="_month": true)),
    {
      field:'_year',
      name:t('common.year'),
      t_name:'year',
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      dropdown:true,
      single:true,
      groups:[
        {field:'_year',name:t('common.accounts'),db_name:'accounts',items:years.map((i)=>({name:i.toString(),id:i.toString(),selected:i==new Date().getFullYear() ? true : false})),selected_ids:[new Date().getFullYear().toString()]}
      ]
    },
  ]))

 
},[_transations,_bills_to_pay,_bills_to_receive,pathname,i18n.language])



  
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
     let {data,datasets,labels}=_get_dre_stats(filterOptions.filter(i=>i.field=="_month" || i.field=="_year"),period)
     setData(data)
     setChartDataSets(datasets)
     setChartLabels(labels)
  },[_loaded,filterOptions])


  
 

  return (
    <>
    
        <DefaultLayout details={{name:t('common.result-demostration')}} _isLoading={!initialized}>
        
    
        <div className="flex flex-wrap bg-white p-3 mb-2 shadow z-10 rounded-[0.3rem]">
               
                <div className="mr-4 hidden">
                   <DefaultButton text={t('common.update')} no_bg={true} disabled={false}/>
                </div>
            
                {/**<DatePickerRange open={datePickerPeriodOptions.open} options={datePickerPeriodOptions} setFilterOPtions={setDatePickerPeriodOptions}/>**/ }   

                {filterOptions.map((i,_i)=>(
                        <Filter shownFilters={filterOptions} key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
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
                              }}  className="mr-4 cursor-pointer flex">
                               <LocalPrintshopOutlinedIcon sx={{color:colors.app_black[400]}}/>
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

