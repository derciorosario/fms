import React,{useState,useEffect} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import MixedChart from '../../components/Charts/chart-1';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import colors from '../../assets/colors.json'
import Circularchart from '../../components/Charts/circular-chart';
import { t } from 'i18next';


function App() {
 
  const {_get_cash_managment_stats,_loaded,_get_stat,_cn,_categories,_get,_setRequiredData,_showPopUp} = useData();
  const {db,reload} = useAuth();
  
  const {pathname}=useLocation()


  useEffect(()=>{
      if(reload==pathname)   window.electron.ipcRenderer.send('reload')
  },[reload,pathname])

  let required_data=['bills_to_pay','account_categories','bills_to_receive','payment_methods','transations']
  const [initialized,setInitialized]=useState(false)
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      field:'_show_projected',
      id:'monthy_cm',
      groups:[
        {field:'_show_projected',name:t('common.month'),items:[{name:'projectado e realizado',id:1},{name:t('common.done'),id:2},{name:t('common.projected'),id:3}],selected_ids:[3]}
      
      ]
    }
  ])

  const [dataChartCM,setDataChartCM]=useState({labels:[],datasets:[]})

  const navigate = useNavigate()


  useEffect(()=>{
    const {datasets:d_cm,labels:l_cm} = _get_cash_managment_stats([filterOptions.filter(i=>i.id=="monthy_cm")[0]],'m')
    setDataChartCM({datasets:d_cm,labels:l_cm})
    if(!(required_data.some(i=>!_loaded.includes(i)))){
        setInitialized(true)
    }
  },[_loaded,filterOptions])

 useEffect(()=>{
      _get(required_data.filter(i=>!_loaded.includes(i)))    
 },[db])

 useEffect(()=>{
  _setRequiredData(required_data)
 },[])

 
 const [catsTotal,setCatsTotal]=useState([])
 const [billsToPay,setBillToPay]=useState({})
 const [billsToReceive,setBillToReceive]=useState({})
 useEffect(()=>{
  setCatsTotal(_get_stat('monthly_cat_performace').cats_total)
  setBillToPay(_get_stat('bills_to_pay'))
  setBillToReceive(_get_stat('bills_to_receive'))
 },[_loaded])


  let {user}=useAuth()


  return (
    <>
       <DefaultLayout details={{name:t('common.hello')+' '+user?.name+"!"}} _isLoading={!initialized}>

        <div className="max-w-[1424px]">
        <div className={`max-lg:flex-col  flex [&>_div]:rounded-[0.3rem]  mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[200px] justify-start`}>
                       
                        <div className={`flex relative shadow-sm  max-lg:mb-2 max-lg:mr-0 mr-[10px] items-center bg-white border-b-[rgb(59,130,246)]  px-2 py-2`}>
                            <div className="flex relative">
                               <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:colors.app_orange[500],width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] font-light mb-2">{t('dashboard.cards.cashierBalance')}</span>
                                    <span className="text-[19px] text-[#2B3674] font-semibold">{!_loaded.includes('payment_methods') ? '-' : _cn(_get_stat('accounts_balance').datasets[0].data.map(item => item).reduce((acc, curr) => acc + curr, 0))}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{0}</span>
                            </div>
                            <span className="cursor-pointer absolute bottom-1 right-2 text-[0.8rem]" onClick={()=>setTimeout(()=>_showPopUp('balance_details'),100)}>   
                                  <svg className="opacity-60 hover:opacity-100" xmlns="http://www.w3.org/2000/svg" height="19px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                            </span>
                          
                        </div>  


                        <div className="flex  max-sm:flex-col flex-1 [&>_div] [&>_div]:rounded-[0.3rem] [&>_div]:min-h-[90px] [&>_div]:min-w-[170px]">
                                <div className="flex w-[50%] max-sm:w-full max-sm:mb-2 [&>_div]:w-[50%] items-center bg-white px-2 py-2 border-b-red-600  shadow-sm mr-[10px]">
                                    <div className="flex border-r pr-3 relative">
                                          <div className="flex justify-center flex-col">
                                            <span className="text-[15px] text-[#A3AED0] font-light mb-2">{t('dashboard.cards.billsToPayToday')} <label className={`${!billsToPay.today_total ? 'hidden':''}`}>({billsToPay.today_total})</label></span>
                                            <span className="text-[19px] text-red-600 font-semibold">{!_loaded.includes('bills_to_pay') ? '-' : `${_cn(billsToPay.today).replaceAll('-','')}`}</span>
                                            
                                          </div>
                                          <span onClick={()=>navigate(`/bills-to-pay?status=pending&start_date=${new Date().toISOString().split('T')[0]}&end_date=${new Date().toISOString().split('T')[0]}`)} className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                          <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                         </span>
                                    </div>
                                    <div className="flex pl-3 relative">
                                          <div className="flex justify-center flex-col relative">
                                            <span className="text-[15px] text-red-600   font-light mb-2">{t('dashboard.cards.billsToPayInDelay')} <label className={`${!billsToPay.delayed_total ? 'hidden':''}`}>({billsToPay.delayed_total})</label></span>
                                            <span className="text-[19px] text-red-600 #FF8900 font-semibold">{!_loaded.includes('bills_to_pay') ? '-'  : `${_cn(billsToPay.delayed).replaceAll('-','')}`}</span>
                                          </div>
                                          <span onClick={()=>navigate('/bills-to-pay?status=delayed')} className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                          <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                         </span>
                                    </div>
                                </div> 

                                
                                <div className="flex w-[50%] [&>_div]:w-[50%] max-sm:w-full max-sm:mb-2 items-center bg-white px-2 py-2 border-b-[#3CD856] shadow-sm">
                                 
                                    <div className="flex border-r pr-3 relative">
                                            <div className="flex justify-center flex-col">
                                              <span className="text-[15px] text-[#A3AED0] font-light mb-2">{t('dashboard.cards.billsToReceiveToday')} <label className={`${!billsToReceive.today_total ? 'hidden':''}`}>({billsToReceive.today_total})</label></span>
                                              <span className="text-[19px] text-[#3CD856] font-semibold">{!_loaded.includes('bills_to_receive') ? '-' : _cn(billsToReceive.today)} </span>
                                            </div>
                                            <span onClick={()=>navigate(`/bills-to-receive?status=pending&start_date=${new Date().toISOString().split('T')[0]}&end_date=${new Date().toISOString().split('T')[0]}`)} className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                              <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                            </span>
                                      </div>
                                      
                                      <div className="flex pl-3 relative">
                                            <div className="flex justify-center flex-col relative">
                                              <span className="text-[15px] text-[#3CD856] font-light mb-2">{t('dashboard.cards.billsToReceiveInDelay')} <label className={`${!billsToReceive.delayed_total ? 'hidden':''}`}>({billsToReceive.delayed_total})</label></span>
                                              <span className="text-[19px] text-[#3CD856] font-semibold">{!_loaded.includes('bills_to_receive') ? '-' : _cn(billsToReceive.delayed)}</span>
                                            </div>
                                            <span onClick={()=>navigate('/bills-to-receive?status=delayed')} className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                              <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                            </span>
                                      </div>

                            </div>
          </div> 
       
  </div>
   
  <div className="flex mb-5 mt-3 max-lg:flex-col">
                
                <div className="w-[40%] max-lg:w-full bg-white rounded-[0.3rem] shadow-sm  p-2 max-lg:mb-3">
                  
                  <div className="flex justify-between border-gray-200 border-b  pb-2">
                    <div>
                      <div className={`text-base font-medium  text-gray-500  pb-1`}>{t('dashboard.monthPerformance')}</div>
                    </div>
                  </div>
                
                
                  <div class="grid grid-cols-2 gap-3 w-full">

                    <div class="bg-white p-1  rounded-lg">
                       <Circularchart stroke={'#fb923c'} percentage={catsTotal.filter(i=>i.field=="services_in")[0]?.percentage || 0} icon={(<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z"/></svg>)}/>
                       <span className="flex items-center justify-between px-3">
                          <label className="text-[13px] text-gray-500">{t('categories.services_in')}</label>
                          <label className="text-[16px] text-[#fb923c] pl-2">{_cn(catsTotal.filter(i=>i.field=="services_in")[0]?.total || 0)}</label>
                       </span>
                    </div>
                    <div class="bg-white p-1  rounded-lg">
                    <Circularchart stroke={'#fb923c'} percentage={catsTotal.filter(i=>i.field=="products_in")[0]?.percentage || 0} icon={(<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M440-280h80v-40h40q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520H440v-40h160v-80h-80v-40h-80v40h-40q-17 0-28.5 11.5T360-600v120q0 17 11.5 28.5T400-440h120v40H360v80h80v40ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>)}/>
                    <span className="flex items-center justify-between px-3">
                          <label className="text-[13px] text-gray-500">{t('categories.expenses_out')}</label>
                          <label className="text-[16px] text-[#fb923c] pl-2">{_cn(catsTotal.filter(i=>i.field=="expenses_out")[0]?.total || 0)}</label>
                       </span>
                    </div>
                    <div class="bg-white p-1  rounded-lg border-t">
                    <Circularchart stroke={'#fb923c'} percentage={catsTotal.filter(i=>i.field=="expenses_out")[0]?.percentage || 0} icon={(<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/></svg>)}/>
                    
                       <span className="flex items-center justify-between px-3">
                          <label className="text-[13px] text-gray-500">{t('categories.products_in')}</label>
                          <label className="text-[16px] text-[#fb923c] pl-2">{_cn(catsTotal.filter(i=>i.field=="products_in")[0]?.total || 0)}</label>
                       </span>
                    </div>
                    <div class="bg-white p-1  rounded-lg border-t">
                    <Circularchart stroke={'#fb923c'} percentage={catsTotal.filter(i=>i.field=="state_out")[0]?.percentage || 0} icon={(<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)}/>
                       <span className="flex items-center justify-between px-3">
                          <label className="text-[13px] text-gray-500">{t('categories.state_out')}</label>
                          <label className="text-[16px] text-[#fb923c] pl-2">{_cn(catsTotal.filter(i=>i.field=="state_out")[0]?.total || 0)}</label>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 bg-white shadow-sm rounded-[0.3rem] lg:ml-3 flex flex-col">
                
                                <div className="px-3 py-2 flex justify-between items-center border-b">
                                  <span className="font-semibold text-gray-500">{t('dashboard.dailyCashier')}</span>
                               </div>

                               <div className="flex-1 items-end  flex w-full py-2">

                               <div className="h-[200px] w-full">
                                        <MixedChart gridY={false} horizontal={false} datasets={[

                                              {
                                                type: 'bar',
                                                label: '',
                                                backgroundColor: 'rgb(251 146 60)',
                                                borderColor: 'rgb(251 146 60)',
                                                borderWidth: 1,
                                                yAxisID: 'y',
                                                data:_get_stat('this_week_transations').compare_datasets
                                                }
                                               
                                               /* {
                                                type: 'bar',
                                                label: t('common.inflows'),
                                                backgroundColor: '#39d739',
                                                borderColor: '#39d739',
                                                borderWidth: 1,
                                                yAxisID: 'y',
                                                data:_get_stat('this_week_transations').inflows_datasets
                                                },
                                                {
                                                type: 'bar',
                                                label: t('common.outflows'),
                                                backgroundColor: 'crimson',
                                                borderColor: 'crimson',
                                                borderWidth: 1,
                                                yAxisID: 'y',
                                                data:_get_stat('this_week_transations').outflows_datasets
                                                }*/
                                                ]} 
                                                
                                                labels={[t('common.weeks.sunday'),t('common.weeks.monday'),t('common.weeks.tuesday'),t('common.weeks.wednesday'),t('common.weeks.thursday'),t('common.weeks.friday'),t('common.weeks.saturday')]}/>



                                        </div>

                               </div>
                               
                         </div>
                  </div>




  
   <div className="flex mb-2 max-lg:flex-col">




  {Object.keys(_get_stat('upcomming_payments')).map((i,_i)=>(

<div key={_i} className={`lg:w-[50%]  rounded-[0.3rem] shadow-sm ${_i==0 ?'lg:mr-2':''} max-lg:mb-2 bg-white`}>
        

<div className="border-b">
    <span className="flex p-2 px-4 justify-between items-center"><label className={`${i=="inflows" ? 'text-green-500':'text-red-600'} font-semibold`}>{i=="inflows" ? t('dashboard.billsToPayTable.accountsToReceive') : t('dashboard.billsToPayTable.accountsToPay')} {_get_stat('upcomming_payments')[i].length!=0 && <span>({_get_stat('upcomming_payments')[i].length})</span>}</label><label className="text-gray-600 text-[13px]">{t('dashboard.billsToPayTable.paymentTimeTitle',{days:7})}</label></span>
</div>        


<div class="relative overflow-x-auto w-[100%] max-h-[300px]">
<table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
          <th scope="col" class="px-6 py-3 font-medium">
              {t('dashboard.billsToPayTable.origin')}
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
              {t('dashboard.billsToPayTable.description')}
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
              {t('dashboard.billsToPayTable.value')}
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
             {t('dashboard.billsToPayTable.due')}
          </th>
          <th></th>
      </tr>
  </thead>
  <tbody>

      {_get_stat('upcomming_payments')[i].map((f,_f)=>(
             <tr key={_f} class="bg-white shadow-sm px-1 hover:text-blue-900 cursor-pointer" onClick={()=>navigate('/'+(i=="inflows" ? "bills-to-receive" : "bills-to-pay")+"/"+f.id)}>
             <th scope="row" class="px-6 py-4 truncate font-medium text-gray-900 hover:text-blue-900 whitespace-nowrap">
                 <span  className="max-w-300"> {_categories.filter(i=>i.field==f.account_origin)[0].name}</span>
             </th>
             <td class="px-6 py-4">
                 {f.description}
             </td>
             <td class="px-6 py-4">
                 {_cn(f.amount)}
             </td>
             <td class="px-6 py-4">
                 {f.payday.split('T')[0]}
             </td>
             <td className="hidden"><button  className="mr-2 px-2 py-1 bg-blue-400 text-white rounded hover:opacity-70">{t('common.view')}</button></td>
         </tr>
      ))}
  </tbody>
</table>

{!_get_stat('upcomming_payments')[i].length && (
  <div className="p-6 flex justify-center">
          <span className="text-[13px] opacity-70">{t('common.no-data')}</span>
  </div>
)}

</div>
   


</div>



      ))}

      


  </div>














 









       </div>

       </DefaultLayout>
    </>
  )
}

export default App

