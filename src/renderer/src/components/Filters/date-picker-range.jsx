import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from '../../contexts/DataContext';
import moment from 'moment';


export default function DatePickerRange({open,options,setFilterOPtions}) {
const data = useData();
const [endDate,setEndDate]=React.useState('')
const [startDate,setStartDate]=React.useState('')
const [defaultDates,setDefaultDates]=React.useState({end:'',start:''}) 
const [openIgualOpions,setOpenIgualOptions]=React.useState(false)

const handleOutsideClick = (event) => {
    if (!event.target.closest(`.__date-picker-period`) && !event.target.closest(`.react-datepicker__month-container`) ) {
        document.removeEventListener('click', handleOutsideClick); 
        setFilterOPtions(prev=>({...prev,open:false}))
    }
};


const  handleClickFilter = () => {
    document.addEventListener('click', handleOutsideClick);
    setFilterOPtions({...options,open:true})
};

function selectIgualOrNot(value){
    setOpenIgualOptions(false)
    setFilterOPtions({...options,igual:value})
 }


 React.useEffect(()=>{
      let data_from=data[options.field]

      data_from=data._sort_by_date(data_from,'createdAt','full-string')
      
      
      if((!options.endDate || !options.startDate) && data_from.length){
          let start=new Date(data_from[0].createdAt.split('T')[0])
          let end=new Date(data_from[data_from.length - 1].createdAt.split('T')[0])
          setFilterOPtions({...options,startDate:start,endDate:end})
          setDefaultDates({end,start})
      }
 },[data[options.field]])

 React.useEffect(()=>{
   
    if(options.endDate){
          const [year,month,day]=options.endDate?.toISOString()?.split('T')[0].split('-')
          setEndDate(`${day}-${month}-${year}`)
    }

    if(options.startDate){
        const [year,month,day]=options.startDate?.toISOString()?.split('T')[0].split('-')
        setStartDate(`${day}-${month}-${year}`)
    }

    
},[options])


function check_and_uncheck(group_field,item){
  setFilterOPtions({...options,groups:options.groups.map(g=>{
            if(g.field==group_field){
               return {...g,items:g.items.map(i=>{return i.id==item.id ? {...i,selected:true} : {...i,selected:false}}),selected_ids:[item.id]}
            }else{
               return g
            }
      })
  })
}
 
  return (
       <>

 <div className={`__date-picker-period flex items-center justify-center p-1 relative`}>
    <button  onClick={()=>handleClickFilter()}

    

    id="dropdownDefault" data-dropdown-toggle="dropdown"
    className={`${(options.startDate && options.startDate!=defaultDates.start || options.endDate && options.endDate!=defaultDates.end) ? 'text-blue-600 bg-blue-100' :' text-[#42526E] bg-gray-100'} outline-none font-medium rounded-lg text-sm px-2 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
    type="button">
    <span className={`border my-[4px] px-2 py-[2px] mr-2 bg-slate-50 flex rounded-[4px] text-gray-700`}>{options.igual ? '=' :'!='}</span>
    {options.name}
    <svg className={` w-4 h-4 ml-2 ${open ? 'rotate-180' : ''}`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
    <span className={`px-2 py-[2px] ml-2 ${(options.startDate && options.startDate!=defaultDates.start || options.endDate && options.endDate!=defaultDates.end) ? 'bg-blue-200' :''}  flex rounded-[4px]`}>{startDate ? startDate : '-'} até {endDate ? endDate :'-'}</span>
  </button>

  {/***Dropdown menu */}

  <div id="dropdown" className={`${!open ? 'hidden' :''} z-10 absolute top-0 translate-y-[40px] right-0 w-72 p-3 bg-white rounded-lg shadow dark:bg-gray-700`}>
     <div className="w-full">

  

     <div className="mb-2">
             <button onClick={()=>setOpenIgualOptions(!openIgualOpions)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className={`bg-gray-200 border-[2px] text-zinc-500 w-full hover:bg-white focus:outline-none  font-medium rounded-[5px] text-sm  p-[5px] text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-between items-center`} type="button">
              <span>{options.name} {options.igual ? '= (igual a)' :'!= (diferente de)'}</span>
                 <svg className={`w-2.5 h-2.5 ms-3 ${openIgualOpions ? 'rotate-180' :'' }`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>

            <div className={`relative ${!openIgualOpions ? 'hidden' :'' }`}>
                   <div id="dropdown" className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <a onClick={()=>selectIgualOrNot(true)} className={`block cursor-pointer px-4 py-2 ${!options.igual ? 'hover:bg-gray-100' :' text-blue-500 hover:bg-blue-200 bg-blue-100'}  dark:hover:bg-gray-600 dark:hover:text-white`}>{options.name} = (igual a)</a>
                            </li>
                            <li>
                                <a onClick={()=>selectIgualOrNot(false)} className={`block cursor-pointer px-4 py-2 ${options.igual ? 'hover:bg-gray-100' :' text-blue-500 hover:bg-blue-200 bg-blue-100'}  dark:hover:bg-gray-600 dark:hover:text-white`}>{options.name} != (diferente de)</a>
                            </li>
                        </ul>
                    </div>
            </div>   
     </div>


     <div className="mb-3 border-b pb-2">
      

    {options.groups.map((g,_g)=>(
            <>
            <h6 key={_g} className={`mb-3 ${options.groups.length==1 ? 'hidden' :''} border-b-[1px] text-sm font-medium text-gray-900 dark:text-white flex justify-between items-center`}>
            <span>{options.name}</span>
            <svg className="w-5 hidden" aria-hidden="true" data-accordion-icon="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z">
                </path>
            </svg>
            </h6>

            <ul className="space-y-2 text-sm mt-3" aria-labelledby="dropdownDefault">
                  {g.items.filter((i,_i)=>i.name.toLowerCase().includes(options.search.toLowerCase())).map((i,_i)=>(
                        <li key={_i}  className="flex items-center">
                          <input onChange={()=>({})} name="date-picker" onClick={()=>check_and_uncheck(g.field,i)} id={`fitbit`+g.field+_i} type="radio" checked={i.selected && true} value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />

                          <label htmlFor={`fitbit`+g.field+_i} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {i.name}
                          </label>
                        </li>
                  ))}
            </ul>
           
           </>
            


      ))}

     </div>


     <div className="flex items-center">

      
      <div className="relative">
       
        <span className="flex items-center p-1">
            
            <div className="inset-y-0 start-0 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <label className="text-[13px] ml-1">Data inicial</label>
        </span>
        
        <DatePicker
          selected={options.startDate}
          onChange={(date) =>  setFilterOPtions({...options,startDate:date})}
          selectsStart
          startDate={options.startDate}
          dateFormat="dd-MM-yyyy"
          endDate={options.endDate}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholderText="Data de inicio"
        />
      </div>
      <span className="mx-4 text-gray-500 flex h-[30px] self-end">Até</span>
      <div className="relative">
      <span className="flex items-center p-1">
            
            <div className="inset-y-0 start-0 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <label className="text-[13px] ml-1">Data final</label>
        </span>
        
        <DatePicker
          selected={options.endDate}
          onChange={(date) => setFilterOPtions({...options,endDate:date})}
          selectsEnd
          dateFormat="dd-MM-yyyy"
          startDate={options.startDate}
          endDate={options.endDate}
          minDate={defaultDates.startDate}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholderText="Date de fim"
        />
      </div>
    </div>



    

    

    </div>
  </div>
</div>
      </>
  );
}