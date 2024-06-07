import * as React from 'react';
import { useData  } from '../../contexts/DataContext';
export default function filter({open,options,filterOptions,setFilterOPtions}) {


  const handleOutsideClick = (event) => {
    if (!event.target.closest(`.__${options.field}`)) {
        document.removeEventListener('click', handleOutsideClick);
        setFilterOPtions(prev=>([...prev.map(f=>{return f.field==options.field ? {...f,open:false} : f})]))
    }
};

const  handleClickFilter = () => {
     document.addEventListener('click', handleOutsideClick);
     setFilterOPtions(filterOptions.map(f=>{return f.field==options.field ? {...f,open:!f.open} : f}))
};


  const [openIgualOpions,setOpenIgualOptions]=React.useState(false)
  
  function selectIgualOrNot(value){
     setOpenIgualOptions(false)
     setFilterOPtions(filterOptions.map(f=>{return f.field==options.field ? {...f,igual:value} : f}))
  }

  function check_and_uncheck(group_field,item){
    setFilterOPtions(filterOptions.map(f=>{
        
        return f.field==options.field ? {...f,groups:f.groups.map(g=>{
              if(g.field==group_field){
                 return {...g,items:g.items.map(i=>{return i.id==item.id ? {...i,selected:!i.selected} : i}),selected_ids:item.selected ? g.selected_ids.filter(id=>id!=item.id) : [...g.selected_ids,item.id]}
              }else{
                 return g
              }
        })} : f
    }))
  }


  const data=useData()
 

  React.useEffect(()=>{
    if(options.not_fetchable) return

    /**(async()=>{
                
                setItems(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
            })() */

   
      (async()=>{
        let groups=[]


        for (let i = 0; i < options.groups.length; i++) {
            if(options.get_deleted){
                let docs=await data.dbs.filter(d=>d.name==options.groups[i].db_name)[0].db.allDocs({ include_docs: true })
                docs=docs.rows.map(i=>i.doc).filter(d=>data._transations.some(t=>t.transation_account.id==d.id))
                groups[i]={...options.groups[i],items:docs.map(item=>{return {...item,selected:options.groups[i].selected_ids.includes(item.id)}})}
            }else{
                groups[i]={...options.groups[i],items:data[options.groups[i].field].map(item=>{return {...item,selected:options.groups[i].selected_ids.includes(item.id)}})}
            }
        }

        setFilterOPtions(filterOptions.map(f=>{return f.field==options.field ? {...f,groups:groups} : f}))
    })()
    
     

  },[])



  function clear(){
    alert('still working one it!')
    return
   
    setFilterOPtions(filterOptions.map(f=>{
        
      return f.field==options.field ? {...f,groups:f.groups.map(g=>{
            if(g.field==group_field){
               return {...g,items:g.items.map(i=>{return i.id==item.id ? {...i,selected:!i.selected} : i}),selected_ids:item.selected ? g.selected_ids.filter(id=>id!=item.id) : [...g.selected_ids,item.id]}
            }else{
               return g
            }
      })} : f


  }))
  }


 
  return (
       <>

 <div className={`__${options.field} flex items-center justify-center p-1 relative`}>
   
    <button  onClick={()=>handleClickFilter()}
    id="dropdownDefault" data-dropdown-toggle="dropdown"
    className={`${!options.groups.some(i=>i.selected_ids.length) ? 'text-[#42526E] bg-gray-100' :' text-blue-600 bg-blue-100'} outline-none font-medium rounded-lg text-sm  ${!options.groups.map(i=>i.selected_ids.length).reduce((acc, curr) => acc + curr, 0) ? 'py-2 px-4' : 'px-2'} text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
    type="button">
    <span className={`${!options.groups.map(i=>i.selected_ids.length).reduce((acc, curr) => acc + curr, 0) ? 'hidden' :''} my-[6px] px-2 py-[2px] mr-2 bg-slate-50 flex rounded-[4px] text-gray-700`}>{options.igual ? '=' :'!='}</span>
    {options.name}
    <svg className={`w-4 h-4 ml-2 ${open ? 'rotate-180' : ''}`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
    <span className={`${!options.groups.map(i=>i.selected_ids.length).reduce((acc, curr) => acc + curr, 0) ? 'hidden' :''} px-2 py-[2px] ml-2 bg-blue-200 flex rounded-[4px] text-blue-700`}>{options.groups.map(i=>i.selected_ids.length).reduce((acc, curr) => acc + curr, 0) == 1 ? options.groups.map(i=>i.items.filter(f=>f.selected)[0]).filter(i=>i)[0]?.name : options.groups.map(i=>i.selected_ids.length).reduce((acc, curr) => acc + curr, 0) }</span>
  </button>

  {/***Dropdown menu */}

  <div id="dropdown" className={`${!open ? 'hidden' :''} z-10 absolute top-0 translate-y-[40px] right-0 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700`}>
     <div className="w-full">

     <div className="flex justify-between items-center mb-1">
      <span onClick={clear} className="text-blue-600 text-[15px] hover:underline cursor-pointer">Limpar</span>
    </div>

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


     
     <div className="max-w-md mx-auto mb-2">   
           <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input onChange={e=> setFilterOPtions(filterOptions.map(f=>{return f.field==options.field ? {...f,search:e.target.value} : f}))} value={options.search} type="search" id="default-search" className="block  outline-none w-full p-[4px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-[5px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pesquisar..." />
           </div>
    </div>



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
                          <input onChange={()=>({})} onClick={()=>check_and_uncheck(g.field,i)} id={`fitbit`+g.field+_i} type="checkbox" checked={i.selected && true} value=""
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
  </div>
</div>
      </>
  );
}