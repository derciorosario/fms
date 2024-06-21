import React,{useState,useEffect} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import MixedChart from '../../components/Charts/chart-1';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import Doughnut from '../../components/Charts/chart-4'

function App() {
 

  const {_get_cash_managment_stats,_loaded,_get_stat,_cn,_categories,_get} = useData();
  
  const [filterOptions,setFilterOPtions]=useState([
    {
      field:'_show_projected',
      id:'monthy_cm',
      groups:[
        {field:'_show_projected',name:'Mês',items:[{name:'projectado e realizado',id:1},{name:'Realizado',id:2},{name:'Projectado',id:3}],selected_ids:[3]}
      
      ]
    }
  ])

  const [dataChartCM,setDataChartCM]=useState({labels:[],datasets:[]})

  const navigate = useNavigate()


useEffect(()=>{

  if(!_loaded.includes('categories')) return

  const {datasets:d_cm,labels:l_cm} = _get_cash_managment_stats([filterOptions.filter(i=>i.id=="monthy_cm")[0]],'m')
  setDataChartCM({datasets:d_cm,labels:l_cm})

 },[_loaded,filterOptions])

 useEffect(()=>{
  _get('categories')
 },[])



 
  let {user}=useAuth()

  if(!_loaded.includes('categories')){
     return (<></>)
  }

  return (
    <>
       <DefaultLayout details={{name:'Olá '+user.name+"!"}}>

        <div className="max-w-[1424px]">

       <div className="flex items-center  [&>_div]:rounded-[0.3rem] mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[200px] [&>_div]:mr-[10px] justify-start">
                        <div className="flex border items-center bg-white border-b-[rgb(59,130,246)]  px-2 py-2">
                                <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                                <div className="flex justify-center flex-col">
                                    <span className="text-[15px] text-[#A3AED0] font-light">Saldo de caixa</span>
                                    <span className="text-[19px] text-[#2B3674] font-semibold">{!_loaded.includes('accounts') ? '-' : _cn(_get_stat('cash_account_balance'))}</span>
                                </div>
                                <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]">{0}</span>
                        </div>  


                        <div className="flex flex-1 [&>_div] [&>_div]:rounded-[0.3rem] [&>_div]:min-h-[80px] [&>_div]:min-w-[170px]">
                                <div className="flex w-[50%] [&>_div]:w-[50%] items-center bg-white px-2 py-2 border-b-red-600 border-[1px] mr-[10px]">
                                    <div className="flex border-r pr-3 relative">
                                          <div className="flex justify-center flex-col">
                                            <span className="text-[15px] text-[#A3AED0] font-light">Contas a pagar hoje</span>
                                            <span className="text-[19px] text-red-600 font-semibold">{!_loaded.includes('bills_to_pay') ? '-' : _cn(_get_stat('bills_to_pay').today)}</span>
                                          </div>
                                          <span className="absolute -bottom-2 right-2 opacity-80 text-[15px]">
                                          <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                          </span>
                                    </div>
                                    <div className="flex pl-3 relative">
                                          <div className="flex justify-center flex-col relative">
                                            <span className="text-[15px] text-red-600   font-light ">Contas a pagar em atraso</span>
                                            <span className="text-[19px] text-red-600 #FF8900 font-semibold">{!_loaded.includes('bills_to_pay') ? '-' : _cn(_get_stat('bills_to_pay').delayed)}</span>
                                          </div>
                                          <span className="absolute -bottom-2 right-2 opacity-80 text-[15px]">
                                          <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                          </span>
                                    </div>
                                </div> 

                                
                                <div className="flex w-[50%] [&>_div]:w-[50%]  items-center bg-white px-2 py-2 border-b-[#3CD856] border-[1px]">
                                  <div className="flex border-r pr-3 relative">
                                        <div className="flex justify-center flex-col">
                                          <span className="text-[15px] text-[#A3AED0] font-light">Contas a receber hoje</span>
                                          <span className="text-[19px] text-[#3CD856] font-semibold">{!_loaded.includes('bills_to_pay') ? '-' : _cn(_get_stat('bills_to_receive').today)}</span>
                                        </div>
                                        <span className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                        <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                        </span>
                                  </div>
                                  <div className="flex pl-3 relative">
                                        <div className="flex justify-center flex-col relative">
                                          <span className="text-[15px] text-[#3CD856] font-light">Contas a receber em atraso</span>
                                          <span className="text-[19px] text-[#3CD856] font-semibold">{!_loaded.includes('bills_to_pay') ? '-' : _cn(_get_stat('bills_to_receive').delayed)}</span>
                                        </div>
                                        <span onClick={()=>navigate('/bills-to-pay?status=delayed')} className="absolute -bottom-2 right-2 opacity-80 text-[15px] cursor-pointer">
                                          <ArrowCircleRightOutlinedIcon  sx={{color:'#A3AED0',width:20}}/>
                                        </span>
                                  </div>
                              </div>


                        </div> 

                        

       
       </div>



  
   <div className="flex mb-2">




  {Object.keys(_get_stat('upcomming_payments')).map((i,_i)=>(

<div key={_i} className={`w-[50%]  rounded-[0.3rem] border ${_i==0} mr-2 bg-white`}>
        

<div>
    <span className="flex p-2 px-4 justify-between items-center"><label className={`${i=="inflows" ? 'text-green-500':'text-red-600'} font-semibold`}>{i=="inflows" ? ' Contas a receber' :'Contas a pagar '}</label><label className="text-gray-600 text-[13px]">Nos próximos 7 dias</label></span>
</div>        


<div class="relative overflow-x-auto w-[100%]">
<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
          <th scope="col" class="px-6 py-3 font-medium">
              Origem
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
              Descrição
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
              Valor
             
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
             Vencimento
          </th>
          <th></th>
      </tr>
  </thead>
  <tbody>

      {_get_stat('upcomming_payments')[i].map((f,_f)=>(
             <tr key={_f} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 px-1">
             <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                 {_categories.filter(i=>i.field==f.account_origin)[0].name}
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
             <td><button onClick={()=>navigate('/'+(i=="inflows" ? "bills-to-receive" : "bills-to-pay")+"/"+f._id)} className="mr-2 px-2 py-1 bg-blue-400 text-white rounded hover:opacity-70">Ver</button></td>
         </tr>
      ))}
  </tbody>
</table>

{!_get_stat('upcomming_payments')[i].length && (
  <div className="p-6 flex justify-center">
          <span className="text-[13px] opacity-70">Nenhum registro</span>
  </div>
)}

</div>
   


</div>



      ))}

      


  </div>

  <div className="flex w-full  mb-2">
           
<div class="w-[48.8%] dark:bg-gray-800 min-w-[560px] p-4  mb-3 rounded-[0.3rem] border bg-white mr-2 ">
  
  <div class="flex justify-between mb-3">
      <div class="flex justify-center items-center">
          <h5 class="text-xl font-semibold leading-none text-gray-900 dark:text-white pe-1">Desempenho do mês por categorias</h5>
          
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

  <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
    <div class="flex justify-between items-center pt-5">
       <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="lastDaysdropdown"
        data-dropdown-placement="bottom"
        class="hidden text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
        type="button">
        Last 7 days
        <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
            </li>
          </ul>
      </div>
      <a
        onClick={()=>navigate('/reports/cash-management/monthly')}
        class="uppercase cursor-pointer text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
         Mais detalhes 
        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
      </a>
    </div>
  </div>
</div>


  <div class="mb-3 p-2 flex flex-col rounded-[0.3rem] border bg-white flex-1">
      <div class="flex p-2 pt-1">
          <h5 class="text-xl font-medium leading-none text-gray-900 dark:text-white pt-1">Saldo por contas</h5>
          
      </div>
      <div>
      <MixedChart {..._get_stat('accounts_balance')} />
      </div>
  </div>


  </div>














  <div className="flex w-full  mb-2">
           
    

    {Object.keys(_get_stat('accounts_cat_balance')).map((i,_i)=>(



<div key={_i} class={`${_i==0 ? 'w-[48.8%]':'w-[50%]'}  dark:bg-gray-800 p-4  mb-3 rounded-[0.3rem] border bg-white ${_i==0 ? 'mr-2':''}`}>
   
  <div class="flex justify-between mb-3">
      <div class="flex justify-center items-center">
          <h5 class="text-xl font-semibold leading-none text-gray-900 dark:text-white pe-1">{i=="in" ? 'Entradas por plano de contas' :'Saídas por plano de contas'}</h5>
          
      </div>
      <div>
           
      </div>
  </div>



  <div class="py-6 relative" id="donut-chart">
      <div className={`${!_get_stat('accounts_cat_balance')[i].datasets.some(i=>i!=0) == false ? 'hidden':''} absolute left-[10%] top-[50%] -translate-y-[50%]`}>
      <svg xmlns="http://www.w3.org/2000/svg" height="140px" viewBox="0 -960 960 960" fill="rgba(107,114,128 , 0.09)"><path d="M441-82Q287-97 184-211T81-480q0-155 103-269t257-129v120q-104 14-172 93t-68 185q0 106 68 185t172 93v120Zm80 0v-120q94-12 159-78t79-160h120q-14 143-114.5 243.5T521-82Zm238-438q-14-94-79-160t-159-78v-120q143 14 243.5 114.5T879-520H759Z"/></svg>
  </div>
      <Doughnut {..._get_stat('accounts_cat_balance')[i]}/>
  </div>

  <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
    <div class="flex justify-between items-center pt-5">
       <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="lastDaysdropdown"
        data-dropdown-placement="bottom"
        class="hidden text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
        type="button">
        Last 7 days
        <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
            </li>
          </ul>
      </div>
      <a
        onClick={()=>navigate('/reports/cash-management/monthly')}
        class="uppercase cursor-pointer text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
         Mais detalhes 
        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
      </a>
    </div>
  </div>
</div>



    ))}

 


  </div>
 


 <div className="flex">
                
<div className="max-w-sm w-full bg-white rounded-[0.3rem] border dark:bg-gray-800 p-4 md:p-6">
  <div className="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
    <dl>
      <dt className={`text-base font-medium  text-gray-500  dark:text-gray-400 pb-1`}>Saldo da semana</dt>
      <dd className={`leading-none text-3xl font-bold ${ _get_stat('this_week_transations').balance < 0 ? 'text-red-600' :'text-gray-900'} dark:text-white`}>{_cn(_get_stat('this_week_transations').balance)}</dd>
    </dl>
    <div className="hidden">
      <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
        </svg>
        23.5% da semana passada
      </span>
    </div>
  </div>

  <div className="grid grid-cols-2 py-3">
    <dl>
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Entradas ({_get_stat('this_week_transations').inflows_total})</dt>
      <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">{_cn(_get_stat('this_week_transations').inflows)}</dd>
    </dl>
    <dl>
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Saidas ({_get_stat('this_week_transations').outflows_total})</dt>
      <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">{_get_stat('this_week_transations').outflows ? '-' :''}{_cn(_get_stat('this_week_transations').outflows)}</dd>
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
    <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
      <div className="flex justify-between items-center pt-5">
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="lastDaysdropdown"
          data-dropdown-placement="bottom"
          className="inline-flex hidden text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center  items-center dark:hover:text-white"
          type="button">
          Last 6 months
          <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>
        <div id="lastDaysdropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 6 months</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last year</a>
              </li>
            </ul>
        </div>
        <a
         
          onClick={()=>navigate('/reports/cash-management/monthly')}
          className="uppercase cursor-pointer  text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
          Ver detalhes
          <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
        </a>
      </div>
    </div>
</div>



<div className="relative flex-1 bg-white border rounded-[0.3rem] ml-3">

                <div className="p-3 flex justify-between items-center">
                  <span className="font-semibold">Fluxo de caixa mensal {filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].items[filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].selected_ids[0] - 1].name}</span>

                  <select value={filterOptions.filter(i=>i.id=="monthy_cm")[0].groups[0].selected_ids[0]} onChange={(e)=>setFilterOPtions(filterOptions.map(i=>{
                      if(i.id=="monthy_cm"){
                        return {...i,groups:[
                            {...i.groups[0],selected_ids:[parseInt(e.target.value)]}
                        ]}
                      }else{
                        return i
                      }
                  }))} id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block p-1 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
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

       </div>

       </DefaultLayout>
    </>
  )
}

export default App

