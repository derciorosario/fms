import React, { useState } from 'react';
import colors from '../../assets/colors.json'

function DefaultButton({disabled,goTo,text,no_bg,style}) {

   // alert(disabled)

   
  return (
                    <button onClick={()=>{
                        if(!disabled) goTo()
                    }} style={!style ? {} : style} className={`flex   ${no_bg ? 'border border-app_orange-400  text-app_orange-400 '+(disabled ?' opacity-65 pointer-events-none':'cursor-pointer hover:opacity-80' ) : (!disabled ? 'bg-app_orange-500 cursor-pointer text-gray-100 hover:opacity-80 focus:outline-none' :'bg-gray-400 text-white cursor-not-allowed')} font-medium shadow-lg rounded-[0.3rem] text-sm px-5 py-2.5 text-center`}>
                         {text}
                    </button>
  )
}

export default DefaultButton

