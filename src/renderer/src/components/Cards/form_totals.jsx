import React, { useState } from 'react';
import colors from '../../assets/colors.json'
function FormCard({items}) {

   
  
  return (
    <div className="[&>_div]:shadow mb-3  [&>_div]:border-[#D9D9D9] flex items-center px-[1rem] [&>_div]:rounded-[0.3rem] [&>_div]:min-w-[110px] [&>_div]:mr-[10px]  justify-start">
                            
        {(items).map((i,_i)=>(
            <div key={_i} className={`items-center justify-center px-3 py-2 flex`}>
            <span className="text-[15px] text-app_black-800 mr-2">{i.name}</span>
            <span className="text-[19px]" style={{color:i.color ? i.color: colors.app_orange[400]}}>{i.value}</span>
            </div>
        ))}
  

   </div>
  )
}

export default FormCard

