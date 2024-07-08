import React, { useState } from 'react';
import colors from '../../assets/colors.json'
import { CircularProgress } from '@mui/material';

function DefaultButton({disabled,goTo,text,no_bg,style,onClick,loading}) {

  return (
                   <span className={`justify-center items-center relative`}>
                      
                      <div className="absolute scale-[0.6] flex items-center justify-center left-0 top-0 w-full h-full">
                         {loading && <CircularProgress style={{color: '#fff'}} />}
                      </div>

                      <button onClick={onClick ? onClick : ()=>{
                            if(!disabled) goTo()
                        }} style={!style ? {} : style} className={`flex ${loading ?' pointer-events-none':''}   ${no_bg ? 'border border-app_orange-400  text-app_orange-400 '+(disabled ?' opacity-65 pointer-events-none':'cursor-pointer hover:opacity-80' ) : (!disabled ? 'bg-app_orange-500 cursor-pointer text-gray-100 hover:opacity-80 focus:outline-none' :'bg-gray-400 text-white cursor-not-allowed')} font-medium shadow-lg rounded-[0.3rem] text-sm px-5 py-2.5 text-center`}>
                              <span className={`${loading ? 'opacity-0':''} pointer-events-none`}>{text}</span>
                      </button>

                   </span>
                   
  )
}

export default DefaultButton

