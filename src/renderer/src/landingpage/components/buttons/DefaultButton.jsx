import React from 'react'

function DefaultButton({text,className,onClick}) {
  return (
    <button onClick={onClick} className={`min-w-[100px] bg-[#ff7626] text-white hover:text-gray-50 rounded-full px-5 py-[0.5rem] hover:opacity-80 `+className}>{text}</button>
  )
}

export default DefaultButton