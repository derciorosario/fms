import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from '../../contexts/DataContext';
import moment from 'moment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function DatePickerRange({id,options,formData,current_item,setFormData,open}) {

const data = useData();
const [minMaxDates,setMinMaxDates]=React.useState({end:'',start:''})

const {_convertDateToWords} = data

const handleOutsideClick = (event) => {
    if (!event.target.closest(`.__date-picker-period-`+id) && !event.target.closest(`.react-datepicker__month-container`) ) {
        document.removeEventListener('click', handleOutsideClick); 
        
        setFormData((prev)=>({...prev,items:prev.items.map(i=>{
            if(i.id==current_item.id) {
            return {...i,picker:{...i.picker,[id+'_open']:false}}
            }else{
             return   i
            }
       })}))
    }
};


const  handleClickFilter = () => {
    document.addEventListener('click', handleOutsideClick);

    
    setFormData({...formData,items:formData.items.map(i=>{
        if(i.id==current_item.id) {
           return {...i,picker:{...i.picker,[id+'_open']:true}}
        }else{
          return i
        }
   })})

  
   
};



function changeDate(date){
    setFormData({...formData,items:formData.items.map(i=>{
        if(i.id==current_item.id) {
           return {...i,picker:{...i.picker,[id+'Date']:date}}
        }else{
          return i
        }
   })}) 
}





React.useEffect(()=>{
   


},[formData])




React.useEffect(()=>{

    let start={min:null,max:null}
    let end={min:null,max:null}
   
    let item_index=formData.items.findIndex(i=>i.id==current_item.id)
    let next_index=formData.items.findIndex(i=>i.endDate && i.id!==current_item.id)
    start.min = item_index == 0  && next_index == -1  ? null : null
    start.max = options.endDate ? options.endDate : null

    end.min = options.startDate ? options.startDate : null

    setMinMaxDates({end,start})


},[options])





function check_and_uncheck(group_field,item){


      setFormData({...formData,items:formData.items.map(i=>{
        if(i.id==current_item.id) {
           return {...i,picker:{...i.picker,[id+'_groups']:i.picker[id+'_groups'].map(g=>{
                if(g.field==group_field){
                    return {...g,items:g.items.map(i=>{return i.id==item.id ? {...i,selected:true} : {...i,selected:false}}),selected_ids:[item.id]}
                }else{
                    return g
                }
           })}}
        }else{
           return i
        }
      })}) 

  
  if(group_field=="_day" || group_field=="_month"){


    let day=group_field=="_day" ? item.id : options[id+'_groups'].filter(i=>i.field=="_day")?.[0]?.selected_ids?.[0]
    let month=group_field=="_month" ? item.id : options[id+'_groups'].filter(i=>i.field=="_month")?.[0]?.selected_ids?.[0]
      

    if(month!=undefined && day!=undefined)  check_dates(day,month) 


  }

}


function check_dates(day,month){

    

    if(day!=undefined && month!=undefined){
        let date=new Date()
        date.setDate(day + 1)
        date.setMonth(month)
        setFormData({...formData,items:formData.items.map(i=>{
            if(i.id==current_item.id) {
               return {...i,picker:{...i.picker,[id+'Date']:date}}
            }else{
              return i
            }
       })}) 
    }else{

       if(options[id+'Date'])  {
             let date=options[id+'Date']

                setFormData({...formData,items:formData.items.map(i=>{
                    if(i.id==current_item.id) {
                       return {...i,picker:{...i.picker,[id+'_groups']:i.picker[id+'_groups'].map(g=>{
                            if(g.field=="_day"){
                                return {...g,items:g.items.map(i=>{return i.id==date.getDate() - 1 ? {...i,selected:true} : {...i,selected:false}}),selected_ids:[date.getDate() - 1]}
                            }if(g.field=="_month"){
                                return {...g,items:g.items.map(i=>{return i.id==date.getMonth() + 1 ? {...i,selected:true} : {...i,selected:false}}),selected_ids:[date.getMonth()]}
                            }else{
                            return g
                            }
                       })}}
                    }else{
                      return  i
                    }
                  })}) 
       }
    }


}



React.useEffect(()=>{
   
   

    check_dates()


},[options.startDate,options.endDate])
 
 
  return (
       <>
          <div className={`__date-picker-period-${id}`}>

            <button onClick={()=>handleClickFilter()} type="button" className="cursor-text text-gray-900 bg-white flex hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-[0.3rem] text-sm px-3 py-[8px] text-center items-center me-2 mb-2">
            <span className="text-[14px]">{!options[id+'Date'] ? 'Selecione a data' : _convertDateToWords(options[id+'Date']?.toJSON()?.split('T')?.[0], options[id+'Date']?.toString()?.split(' ')?.[2])}</span><ArrowDropDownIcon/>
            </button>
           
           <div id="dropdown"  className={`${!open ? 'hidden' :''}  z-10 absolute top-1 translate-y-[40px] left-0 w-56 p-3 bg-white rounded-lg shadow`}>

<div className="w-full">


<div className="mb-3 pb-2">
      

      {options[id+'_groups'].map((g,_g)=>(
              <>


              <div className="flex border-b-[1px] items-center pb-2 mb-2">

                    <h6 key={_g} className={`mb-3 ${options[id+'_groups'].length==1 ? 'hidden' :''} mr-2 text-sm font-medium text-gray-900 flex justify-between items-center`}>
                    <span>{g.name}</span>
                    <svg className="w-5 hidden" aria-hidden="true" data-accordion-icon="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z">
                        </path>
                    </svg>
                    </h6>

                    <div class={`${!g.dropdown ? 'hidden' :''} col-span-2 sm:col-span-1 flex-1`}>
                          <label for="category" class="hidden text-sm font-medium text-gray-900">Category</label>
                          <select value={g.selected_ids[0]} onChange={(e)=>check_and_uncheck(g.field,g.items[parseInt(e.target.value)])} id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                          <option value="" selected disabled>Selecione</option>
                          {g.items.map((i,_i)=>(
                            
                              <>
                                
                                 <option value={_i} key={_i} selected={i.selected}>{i.name}</option>
                              </>
                             

                          ))}
                          </select>
                   </div>

              </div>
             
  
              
             
             </>
              
  
  
        ))}
  
       </div>

<div className="flex items-center">

 <span className="flex items-center p-1">
     
     <div className="inset-y-0 start-0 flex items-center pointer-events-none">
       <svg
         className="w-4 h-4 text-gray-500"
         aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg"
         fill="currentColor"
         viewBox="0 0 20 20"
       >
         <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
       </svg>
     </div>
 </span>
 
 <div className={`flex-1 ${id!="start" ? "hidden" :""}  ml-1 [&>_div]:w-full`}>
       <DatePicker
          selected={options.startDate}
          onChange={(date) => changeDate(date)}
          selectsStart
          minDate={minMaxDates.start.min}
          maxDate={minMaxDates.start.max}
          startDate={options.startDate}
          dateFormat="dd-MM-yyyy"
          endDate={options.endDate}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholderText="Data de inicio"
        />

 </div>

<div className={`flex-1 ${id!="end" ? "hidden" :""}  ml-1 [&>_div]:w-full`}>
        <DatePicker
          selected={options.endDate}
          onChange={(date) => changeDate(date)}
          selectsEnd
          dateFormat="dd-MM-yyyy"
          startDate={options.startDate}
          endDate={options.endDate}
          minDate={minMaxDates.end.min}
          maxDate={minMaxDates.end.max}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholderText="Data de fim"
        />
</div>



</div>







</div>
</div>
</div>
      </>
  );
}