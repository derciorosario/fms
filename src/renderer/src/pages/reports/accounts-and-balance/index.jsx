import React,{useState,useEffect} from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import MixedChart from '../../../components/Charts/chart-1';
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Doughnut from '../../../components/Charts/chart-4'
import colors from '../../../assets/colors.json'
import { t } from 'i18next';


function App() {
 
  const {_required_data,_get_cash_managment_stats,_loaded,_get_stat,_cn,_categories,_get,_setRequiredData} = useData();
  const {db} = useAuth();

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

  let {user}=useAuth()

  console.log({user})

  return (
    <>
       <DefaultLayout details={{name:t('common.hello')+' '+user?.name+"!"}} _isLoading={!initialized}>

        <div className="max-w-[1424px]">

      



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














  <div className="flex mb-5 mt-3 max-lg:flex-col">
                
                <div className="lg:max-w-sm w-full bg-white rounded-[0.3rem] shadow-sm  p-4 md:p-6 max-lg:mb-3">
                  <div className="flex justify-between border-gray-200 border-b  pb-3">
                    <div>
                      <div className={`text-base font-medium  text-gray-500  pb-1`}>{t('dashboard.weekBalance')}</div>
                      <div className={`leading-none text-3xl font-bold ${ _get_stat('this_week_transations').balance < 0 ? 'text-red-600' :'text-gray-900'}`}>{_cn(_get_stat('this_week_transations').balance)}</div>
                    </div>
                    <div className="hidden">
                      <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
                        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                        </svg>
                        23.5% da semana passada
                      </span>
                    </div>
                  </div>
                
                  <div className="grid grid-cols-2 py-3">
                    <dl>
                      <dt className="text-base font-normal text-gray-500 pb-1">{t('common.inflows')} ({_get_stat('this_week_transations').inflows_total})</dt>
                      <dd className="leading-none text-xl font-bold text-green-500">{_cn(_get_stat('this_week_transations').inflows)}</dd>
                    </dl>
                    <dl>
                      <dt className="text-base font-normal text-gray-500 pb-1">{t('common.outflows')} ({_get_stat('this_week_transations').outflows_total})</dt>
                      <dd className="leading-none text-xl font-bold text-red-600">{_get_stat('this_week_transations').outflows ? '-' :''}{_cn(_get_stat('this_week_transations').outflows)}</dd>
                    </dl>
                  </div>
                
                  <div id="bar-chart">
                
                  <MixedChart horizontal={true} datasets={[
                      {
                        type: 'bar',
                        label: 'Entradas',
                        backgroundColor: '#39d739',
                        borderColor: '#39d739',
                        borderWidth: 1,
                        yAxisID: 'y',
                        data:_get_stat('this_week_transations').inflows_datasets
                      },
                      {
                        type: 'bar',
                        label: 'Saidas',
                        backgroundColor: 'crimson',
                        borderColor: 'crimson',
                        borderWidth: 1,
                        yAxisID: 'y',
                        data:_get_stat('this_week_transations').outflows_datasets
                      }
                  ]} labels={['Domingo','Sabado','Segunda','Terça','Quarta','Quinta','Sexta']}/>
                
                  </div>
                    <div className="grid grid-cols-1 items-center border-gray-200 border-t  justify-between">
                      <div className="flex justify-between items-center pt-5">
                        
                        <button
                          id="dropdownDefaultButton"
                          data-dropdown-toggle="lastDaysdropdown"
                          data-dropdown-placement="bottom"
                          className="inline-flex hidden text-sm font-medium text-gray-500 hover:text-gray-900 text-center  items-center"
                          type="button">
                          Last 6 months
                          <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                          </svg>
                        </button>
                        <div id="lastDaysdropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg  w-44">
                            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Yesterday</a>
                              </li>
                            </ul>
                        </div>
                        <a
                         
                          onClick={()=>navigate('/reports/cash-management/monthly')}
                          className="uppercase cursor-pointer  text-sm font-semibold inline-flex items-center rounded-lg text-orange-500   hover:bg-gray-100 px-3 py-2">
                          {t('common.see-details')}
                          <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                </div>
                
                
                
                <div className="relative flex-1 bg-white shadow-sm rounded-[0.3rem] lg:ml-3">
                
                                <div className="px-3 py-2 flex justify-between items-center border-b">
                                  <span className="font-semibold">{t('common.monthy-cash-managment')} {filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].items[filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].selected_ids[0] - 1].name}</span>
                
                                  <select value={filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].selected_ids[0]} onChange={(e)=>setFilterOPtions(filterOptions.map(i=>{
                                      if(i.id=="monthy_cm"){
                                        return {...i,groups:[
                                            {...i.groups[0],selected_ids:[parseInt(e.target.value)]}
                                        ]}
                                      }else{
                                        return i
                                      }
                                  }))} id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block p-1">
                                          {filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].items.map((i,_i)=>(
                                              <option value={_i + 1} key={_i} selected={i.selected}>{i.name}</option>
                                          ))}
                                  </select>
                                  
                               </div>
                
                                <div className="min-h-[400px]">
                                   <MixedChart datasets={dataChartCM.datasets} labels={dataChartCM.labels}/>
                                </div>
                              
                               
                </div>
                
                
                
                
                
                
                       </div>
















  <div className="flex w-full  mb-2 max-lg:flex-col">
           
<div class="w-[48.8%] max-lg:w-full min-w-[560px] mb-3 rounded-[0.3rem] shadow-sm bg-white lg:mr-2 ">
  
  <div class="flex justify-between border-b">
      <div class="flex justify-center items-center p-3">
          <h5 class="font-semibold  leading-none text-gray-900 ">{t('dashboard.monthlyPerformanceByCategories')}</h5>
      </div>
      <div>
           
      </div>
  </div>



  <div class="py-6 relative" id="donut-chart">
      <div className={`${!_get_stat('monthly_cat_performace',{period:'m'}).doughnut.datasets.some(i=>i!=0) == false ? 'hidden':''} absolute left-[10%] top-[50%] -translate-y-[50%]`}>
      <svg xmlns="http://www.w3.org/2000/svg" height="140px" viewBox="0 -960 960 960" fill="rgba(107,114,128 , 0.09)"><path d="M441-82Q287-97 184-211T81-480q0-155 103-269t257-129v120q-104 14-172 93t-68 185q0 106 68 185t172 93v120Zm80 0v-120q94-12 159-78t79-160h120q-14 143-114.5 243.5T521-82Zm238-438q-14-94-79-160t-159-78v-120q143 14 243.5 114.5T879-520H759Z"/></svg>
  </div>
      <Doughnut {..._get_stat('monthly_cat_performace',{period:'m'}).doughnut}/>
  </div>

  <div class="grid grid-cols-1 items-center border-gray-200   justify-between">
    <div class="flex justify-between items-center pt-5">
       <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="lastDaysdropdown"
        data-dropdown-placement="bottom"
        class="hidden text-sm font-medium text-gray-500  hover:text-gray-900 text-center inline-flex items-center"
        type="button">
        Last 7 days
        <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44">
          <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100">Yesterday</a>
            </li>
            
          </ul>
      </div>
      <a
        onClick={()=>navigate('/reports/cash-management/monthly')}
        class="uppercase cursor-pointer text-sm font-semibold inline-flex items-center rounded-lg text-orange-500   hover:bg-gray-100  px-3 py-2">
       {t('common.see-details')}
        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
      </a>
    </div>
  </div>
</div>


  <div class="mb-3 p-2 flex flex-col rounded-[0.3rem] shadow-sm bg-white flex-1">
      <div class="flex p-2 pt-1 border-b">
          <h6 class="text-[17px] font-medium leading-none text-gray-900 pt-1">{t('dashboard.balanceByAccounts')}</h6>
          
      </div>
      <div>
      <MixedChart {..._get_stat('accounts_balance')} />
      </div>
  </div>


  </div>














  <div className="flex w-full  mb-2 max-lg:flex-col">
           
    

    {Object.keys(_get_stat('accounts_cat_balance')).map((i,_i)=>(



<div key={_i} class={`${_i==0 ? 'lg:w-[48.8%]':'lg:w-[50%]'} w-full  mb-3 rounded-[0.3rem] shadow-sm bg-white ${_i==0 ? 'lg:mr-2':''}`}>
   
  <div class="flex justify-between mb-3 border-b">
      <div class="flex justify-center items-center">
          <h5 class="p-3 font-semibold text-[17px] leading-none text-gray-900 pe-1">{i=="in" ? t('dashboard.inflowsByAccounsPlan') : t('dashboard.outflowsByAccounsPlan')}</h5>
          
      </div>
  </div>



  <div class="py-6 relative" id="donut-chart">
      <div className={`${!_get_stat('accounts_cat_balance')[i].datasets.some(i=>i!=0) == false ? 'hidden':''} absolute left-[10%] top-[50%] -translate-y-[50%]`}>
      <svg xmlns="http://www.w3.org/2000/svg" height="140px" viewBox="0 -960 960 960" fill="rgba(107,114,128 , 0.09)"><path d="M441-82Q287-97 184-211T81-480q0-155 103-269t257-129v120q-104 14-172 93t-68 185q0 106 68 185t172 93v120Zm80 0v-120q94-12 159-78t79-160h120q-14 143-114.5 243.5T521-82Zm238-438q-14-94-79-160t-159-78v-120q143 14 243.5 114.5T879-520H759Z"/></svg>
  </div>
      <Doughnut {..._get_stat('accounts_cat_balance')[i]}/>
  </div>

  <div class="grid grid-cols-1 items-center border-gray-200  justify-between">
    <div class="flex justify-between items-center pt-5">
       <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="lastDaysdropdown"
        data-dropdown-placement="bottom"
        class="hidden text-sm font-medium text-gray-500 hover:text-gray-900 text-center inline-flex items-center"
        type="button">
        Last 7 days
        <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg  w-44">
          <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100">Yesterday</a>
            </li>
          </ul>
      </div>
      <a
        onClick={()=>navigate('/reports/cash-management/monthly')}
        class="uppercase cursor-pointer text-sm font-semibold inline-flex items-center rounded-lg text-orange-500  hover:bg-gray-100 px-3 py-2">
         {t('common.see-details')}
        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
      </a>
    </div>
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

