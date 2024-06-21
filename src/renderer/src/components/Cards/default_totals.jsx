import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
function TotalCard({items,page}) {

    const {_loaded} = useData()
  
  return (
    <div className="flex items-center pr-[1rem] [&>_div]:shadow-sm [&>_div]:rounded-[0.4rem] mb-5 [&>_div]:min-h-[80px] [&>_div]:min-w-[170px] [&>_div]:mr-[10px] justify-start">
                       {items.map((i,_i)=>(
                            <div className="flex border items-center bg-white  px-2 py-2" key={_i}>
                            <div className="mr-3 opacity-70  flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div> 
                            <div className="flex justify-center flex-col">
                                <span className="text-[15px] text-[#A3AED0] ">{i.name}</span>
                                <span className="text-[19px] text-[#2B3674]">{_loaded.includes(page) ? i.value :'-'}</span>
                            </div>
                            <span className="absolute hidden bottom-1 right-2 opacity-80 text-[15px]"></span>
                    
                            </div>
                       ))}
    </div>
  )
}

export default TotalCard

