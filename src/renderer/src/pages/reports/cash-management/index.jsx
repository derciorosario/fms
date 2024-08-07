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
import { Button, Switch } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import StatsTable from '../components/table';
import DefaultButton from '../../../components/Buttons/default';
import colors from '../../../assets/colors.json'
import { useAuth } from '../../../contexts/AuthContext';
import { t } from 'i18next';

function App() {

  const {_setRequiredData,_print_exportExcel,_get_cash_managment_stats,_transations,_bills_to_pay,_bills_to_receive,_loaded,_get} = useData();
  const {pathname} = useLocation()
  const [data,setData]=React.useState([])
  const [currentMenu,setCurrentMenu]=React.useState(0)
  const period=pathname.includes('/daily') ? 'd' : 'm'

  const page_menus=[
    {name:' '+t('common.graphic')},
    {name:' '+t('common.simple-analyze')},
    {name:' '+t('common.months-comparison')},
  ]

  
  const {db} = useAuth()

  const [initialized,setInitialized]=useState(false)

  useEffect(()=>{
    
    if(!(required_data.some(i=>!_loaded.includes(i)))){
        setInitialized(true)
    }
   },[_loaded])

   let required_data=['investments','loans','bills_to_pay','account_categories','bills_to_receive','payment_methods','transations']

   useEffect(()=>{
    _setRequiredData(required_data)
   },[])
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      open:false,
      field:'_account_categories',
      name:t('common.accounts'),
      get_deleted:true,
      db_name:'account_categories',
      igual:true,
      show_all:true,
      search:'',
      groups:[
        {field:'_account_categories',name:t('common.accounts'),param:'accounts',db_name:'account_categories',items:[],selected_ids:[],default_ids:[]}
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
        {field:'_show_projected',name:t('common.month'),items:[{name:t('common.projectedAndDone'),id:1},{name:t('common.done'),id:2,selected:true},{name:t('common.projected'),id:3}],selected_ids:[2],default_ids:[2]}
      ]
    },

    {
        field:'_week_and_month',
        name:t('common.period'),
        page:'cash-managemnt-stats',
        igual:true,
        not_fetchable:true,
        search:'',
        single:true,
        hide_clear:true,
        groups:[
          {field:'_week_and_month',name:t('common.view_'),items:[{id:'week',name:t('common.daily'),to:'/reports/cash-management/daily',selected:pathname.includes('/daily') ? true : false},{id:'month',name:t('common.monthly'),selected:pathname.includes('/monthly') ? true :false,to:'/reports/cash-management/monthly'}],selected_ids:['month']}
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
      name:t('common.year'),
      page:'cash-managemnt-stats',
      not_fetchable:true,
      igual:true,
      search:'',
      hide_igual:true,
      dropdown:true,
      single:true,
      groups:[
        {field:'_year',name:t('common.accounts'),db_name:'accounts',items:years.map((i)=>({name:i.toString(),id:i.toString(),selected:i==new Date().getFullYear() ? true : false})),selected_ids:[years[years.length - 1].toString()],default_ids:[years[years.length - 1].toString()]}
      ]
    },
  ]))

 
},[_transations,_bills_to_pay,_bills_to_receive,pathname,currentMenu])


const [datePickerPeriodOptions,setDatePickerPeriodOptions]=React.useState({
    open:false,
    igual:true,
    startDate:null,
    endDate:null,
    name:t('common.period'),
    search:'',
    field:'_transations',
    groups:[{field:'period',name:t('common.period'),items:[
      {id:'this_week',name:t('common.this-week')},
      {id:'this_month',name:t('common.this-month')},
      {id:'last_month',name:t('common.last-month')},
      {id:'this_year',name:t('common.this-year')}
    ],selected_ids:[]}]
     
  })

  
  const [chartDataSets,setChartDataSets]=useState([])
  const [chartLabels,setChartLabels]=useState([])


  


 
 


  useEffect(()=>{

     let {data,datasets,labels}=_get_cash_managment_stats(filterOptions,period)
     setData(data)
     setChartDataSets(datasets)
     setChartLabels(labels)


  },[_loaded,filterOptions])
 


   useEffect(()=>{
        if(currentMenu==2 && period=="d"){
           setCurrentMenu(1)
        }
   },[pathname])

   function print_exportExcel(type,from){

    
    
      let project_only=filterOptions.filter(i=>i.field=="_show_projected")[0].groups[0].selected_ids[0]
      let month=filterOptions.filter(i=>i.field=="_month")[0]?.groups?.[0]?.selected_ids?.[0]

      let title=`${t('common.transations-reports')} ${filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].items.filter(i=>i.selected).length!= 0 ? t('common.of-accounts')+' '+ filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].items.filter(i=>i.selected).map(i=>i.name).join(', '):''}`
      
      _print_exportExcel(data,type,currentMenu,period,project_only,month,title,from)
   }

 
  return (
    <>
    
        <DefaultLayout details={{name:t('common.cash-management-reports')+" "+t(`common.${period=="d"?'daily':'monthly'}`)}} _isLoading={!initialized}>

        
    
        <div className="flex flex-wrap bg-white rounded-[0.3rem] p-3 mb-2 shadow z-10">
               
                <div className="mr-4 hidden">
                   <DefaultButton text={('common.update')} no_bg={true} disabled={false}/>
                </div>
                {filterOptions.map((i,_i)=>(
                        <Filter shownFilters={filterOptions} key={_i} filterOptions={filterOptions}  setFilterOPtions={setFilterOPtions} open={i.open} options={i}/>
                ))}
        </div>

       

        <div className="px-3 py-3 [&>_span]:mr-4 [&>_span]:table [&>_span]:relative [&>_span]:cursor-pointer  rounded-[0.3rem] p-3 mb-2 shadow flex items-center bg-white">
            {page_menus.map((i,_i)=>(
                    <span style={{display:_i==2 && period=="d" ? 'none':'table'}} onClick={()=>setCurrentMenu(_i)} className={`${currentMenu==_i ? 'text-app_orange-400':' opacity-70'} hover:text-app_orange-400 `}>
                      <label className={`absolute ${currentMenu!=_i ? 'hidden' :''} top-full translate-y-[9px] w-full h-[3px] rounded-tl rounded-tr bg-app_orange-300`}></label>
                       {i.name}
                     </span>
                
            ))}
         </div>

        <div className="shadow bg-white p-3 rounded-tr-[0.3rem] rounded-tl-[0.3rem]">
               <div className="flex justify-between mb-4">
                     <div className="">
                        <span className="text-[19px] font-medium text-gray-600">{t('common.cash-management-reports')}</span> {filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].items.filter(i=>i.selected).length!= 0 && <span className="text-app_orange-400">({filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].items.filter(i=>i.selected).map(i=>i.name).join(', ')})</span>}
                     </div>


                     <div className="flex items-center">
                            <div className="mr-6 hidden">
                                <Switch
                                checked={false==false}
                                inputProps={{ 'aria-label': 'controlled' }}
                                
                                onChange={(e)=>{
                                
                                }}
                              />
                              <span>{t('common.analitic-view')}</span>
                            </div>
                          
                          <div  onClick={()=>{
                            print_exportExcel('print','stats')
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

               {currentMenu==0 && <div className="min-h-[400px] print-table relative">
                     <Chart datasets={chartDataSets} labels={chartLabels}/>
               </div>}
        </div>
        

        {currentMenu!= 0 && <StatsTable content={{data,currentMenu,period,filterOptions}}/>}

        </DefaultLayout>
    </>
  )
}
export default App

