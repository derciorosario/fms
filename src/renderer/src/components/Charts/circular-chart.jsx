import React from 'react'

function Circularchart({percentage,stroke,strokebg,maxHeight,icon}) {
  return (
     <div className="relative flex justify-center circular-chart-container">
           {percentage!=0 && <svg viewBox="0 0 36 36" style={{stroke:stroke || '#ff7626',maxHeight:maxHeight || '80px'}} className="circular-chart progress">
                            <path class="circle"
                                stroke-dasharray={`${percentage || 0},100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
            </svg>}

            <svg viewBox="0 0 36 36" style={{stroke:strokebg || '#e4e4e4',maxHeight:maxHeight || '80px'}} className="circular-chart">
                            <path class="circle"
                                stroke-dasharray={`100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
            </svg>


            <div className="center flex flex-col items-center">
                 <div className="opacity-65">
                     {icon}
                 </div>
                 <span>{percentage || 0}%</span>
            </div>
     </div>
  )
}

export default Circularchart