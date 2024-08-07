import { useState } from 'react';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useData } from '../../../contexts/DataContext';
import { t } from 'i18next';

function StatsTable({content}) {

    const {_account_categories} = useData()

    
    let {period,data,filterOptions,showIcons,currentMenu} = content
    const [openItems,setOpenItems]=useState([])
    const [project,setProject]=useState(1)
    const [month,setMonth]=useState(0)
    const [year,setYear]=useState(new Date().getFullYear())

    React.useEffect(()=>{
             setProject(filterOptions.filter(i=>i.field=="_show_projected")[0].groups[0].selected_ids[0])
             setMonth(filterOptions.filter(i=>i.field=="_month")[0]?.groups?.[0]?.selected_ids?.[0])
             setYear(filterOptions.filter(i=>i.field=="_year")[0]?.groups?.[0]?.selected_ids?.[0])

    },[filterOptions])

    
    return (
    <>
      <div class={`relative overflow-x-auto shadow mb-[100px] _project_${project}`}>

{/***   monthly   *** */}
{period=="m" && <table class={` ${period=="d" ? 'hidden' :''} _show${currentMenu} ${project==2 ? '_done' :''} ${project==3 ? '_projected':''} _montly _table_stats w-full text-sm text-left rtl:text-right `}>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr className="[&>_th]:px-6 [&>_th]:py-3 [&>_th]:text-center">
            <th rowSpan={3}><span className="flex translate-y-2 mr-14">{t('common.entries-categories')}</span></th>

            {[
  t('common.months.january'),
  t('common.months.february'),
  t('common.months.march'),
  t('common.months.april'),
  t('common.months.may'),
  t('common.months.june'),
  t('common.months.july'),
  t('common.months.august'),
  t('common.months.september'),
  t('common.months.october'),
  t('common.months.november'),
  t('common.months.december')
].map((i,_i)=>(
                <th key={_i} colspan={project==1 ? 3 : 1} className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''}`}>{i}</th>
            )).filter((_,_i)=>currentMenu!=1 || _i==month)}
            
          
         </tr>
        
    </thead>
    <tbody>
        <tr  class="[&>_td]:px-6 [&>_td]:py-4 bg-white border-b">
            <td></td>
            {Array.from({ length: 12 }, () => 0).map((i,_i)=>(
                <>
                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''} ${project==2 ? 'hidden':''} `}>{t('common.projected')}</td>
                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''} ${project==3 ? 'hidden':''} `}>{t('common.done')}</td>
                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''} ${project!=1 ? 'hidden':''} `}>{t('common.achieved')} (%)</td>
                </>
            )).filter((_,_i)=>currentMenu!=1 || _i==month)}
        </tr>


        {data.map((i,_i)=>(
                       <>
                       <tr key={'i1'+_i}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b">
                       <td onClick={()=>setOpenItems(openItems.includes('i-'+_i) ? openItems.filter(o=>o!='i-'+_i) : [...openItems,'i-'+_i])}  className={` flex items-center relative font-medium`} style={{color:i.color,cursor:i.sub ? 'pointer':'initial'}}><span className={`border-l-[3px] flex w-full absolute left-0 top-[-2px]`} style={{height:'calc(100% + 4px)',borderColor:i.color}}></span>
                        
                        {i?.sub?.filter(i=>_account_categories.some(f=>f.account_origin==i.field)).length!=0  && i.sub && <div className={`${openItems.includes('i-'+_i) ? 'rotate-90':''}`}><KeyboardArrowRightIcon/></div>}
                        {i.icon=="add" && <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="21" fill={i.color}><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
                        {i.icon=="remove" && <svg className="mr-1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="21" fill={i.color}><path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
                        {i.icon=="igual" && <svg className="mr-1" fill="#111" width="21"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M15,13H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Zm0-4H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/></svg>}
                        <span className="pr-5">{i.name}</span>
                       </td>
                       {i.items.map((i2,_i2)=>(
                           
                            <>
                                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i2 ? 'bg-blue-50':''} ${project==2 ? 'hidden':''}`} style={{color:i2.projected < 0 ? 'crimson' : i.color }}>{i2.projected.toFixed(2)}</td>
                                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i2 ? 'bg-blue-50':''} ${project==3 ? 'hidden':''}`} style={{color:i2.done < 0 ? 'crimson' : i.color }}>{i2.done.toFixed(2)}</td>
                                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i2 ? 'bg-blue-50':''} ${project!=1 ? 'hidden':''}`} style={{color:i2.percentage < 0 ? 'crimson' : i.color }}>{i2.percentage.toFixed(0)}%</td>
                           </>

                        )).filter((_,_i)=>currentMenu!=1 || _i==month)}
                       </tr>

                       {(i.sub?.length ? true : false) && (

                             <>
                                {i.sub.filter(i=>_account_categories.some(f=>f.account_origin==i.field)).map((i2,_i2)=>(
                                    <>
                                    <tr key={'i2'+_i2} style={{display:openItems.includes('i-'+_i) ? 'table-row':'none'}}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b">
                                     <td onClick={()=>setOpenItems(openItems.includes('i2-'+_i2+'-'+i.field) ? openItems.filter(o=>o!='i2-'+_i2+'-'+i.field) : [...openItems,'i2-'+_i2+'-'+i.field])} style={{cursor:i2.sub ? 'pointer':'initial'}} className={` flex items-center relative font-medium`} ><span style={{borderColor:i.color}}  className={`border-l-[3px] h-full flex w-full absolute left-0 top-0`}></span>
                                     <span className="pl-10 flex items-center relative">
                                     {i2.sub?.length!=0 && i2.sub && <div className={`${openItems.includes('i2-'+_i2+'-'+i.field) ? 'rotate-90':''} absolute left-2 top-[50%] translate-y-[-50%]`}><KeyboardArrowRightIcon/></div>}
                                     {i2.name}
                                     </span>
                                    </td>
                                    {i2.items.map((i3,_i3)=>(
                                        
                                         <>
                                             <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i3 ? 'bg-blue-50':''} ${project==2 ? 'hidden':''}`} style={{color:i3.projected < 0 ? 'crimson' : 'initial' }}>{i3.projected.toFixed(2)}</td>
                                             <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i3 ? 'bg-blue-50':''} ${project==3 ? 'hidden':''}`} style={{color:i3.done < 0 ? 'crimson' : 'initial' }}>{i3.done.toFixed(2)}</td>
                                             <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i3 ? 'bg-blue-50':''} ${project!=1 ? 'hidden':''}`} style={{color:i3.percentage < 0 ? 'crimson' : 'initial' }}>{i3.percentage.toFixed(0)}%</td>
                                        </>
             
                                     )).filter((_,_i)=>currentMenu!=1 || _i==month)}
                                    </tr>

                                       {(i2.sub?.length ? true : false) && (
                                           <>
                                               {i2.sub.filter(i=>!i.disabled).map((i3,_i3)=>(
                                                     <tr key={'i3'+_i3} style={{display:openItems.includes('i2-'+_i2+'-'+i.field) && openItems.includes('i-'+_i) ? 'table-row':'none'}}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b ">
                                                        <td className={` flex items-center relative font-medium`} ><span style={{borderColor:i.color}} className={`border-l-[3px]  h-full flex w-full absolute left-0 top-0`}></span>
                                                          <span className="pl-14 flex items-center">
                                                            {i3.name}
                                                          </span>
                                                        </td>
                                                        {i3.items.map((i4,_i4)=>(
                                        
                                                              <>
                                                                    <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i4 ? 'bg-blue-50':''} ${project==2 ? 'hidden':''}`} style={{color:i4.projected < 0 ? 'crimson' : 'initial' }}>{i4.projected.toFixed(2)}</td>
                                                                    <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i4 ? 'bg-blue-50':''} ${project==3 ? 'hidden':''}`} style={{color:i4.done < 0 ? 'crimson' : 'initial' }}>{i4.done.toFixed(2)}</td>
                                                                    <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i4 ? 'bg-blue-50':''} ${project!=1 ? 'hidden':''}`} style={{color:i4.percentage < 0 ? 'crimson' : 'initial' }}>{i4.percentage.toFixed(0)}%</td>
                                                              </>
                                              
                                                        )).filter((_,_i)=>currentMenu!=1 || _i==month)}
                                                       </tr>
                                               ))}
                                           </>
                                       )}
                                    </>
                                ))} 
                             </>            
                                

                       )}
                    </>
        ))}

        
       
    </tbody>
</table>}


{/**  weekly ** */}
{period == 'd' && 
<table class={` ${period=="m" ? 'hidden' :''} _table_stats _daily w-full text-sm text-left rtl:text-right `}>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr className="[&>_th]:px-6 [&>_th]:py-3 [&>_th]:text-center">
            <th rowSpan={3}><span className="flex translate-y-2">{t('common.days')}</span></th>

            {[t('common.inflows'), t('common.outflows'), t('common.balance')].map((i,_i)=>(
                <th key={_i} colspan={project!=1 ? 1 : 2} className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''}`}>{i}</th>
            ))}
            
          
         </tr>
        
    </thead>
    <tbody>

    <tr  class="[&>_td]:px-6 [&>_td]:py-4 bg-white border-b">
           <td></td>
            {Array.from({ length: 3 }, () => 0).map((i,_i)=>(
                <>
                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''} ${project==2 ? 'hidden':''}`}>{t('common.projected')}</td>
                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==_i ? 'bg-blue-50':''} ${project==3 ? 'hidden':''}`}>{t('common.done')}</td>
                </>
            ))}
        </tr>
       
         
        {data.map((i,_i)=>(

                       <tr key={'i1'+_i}  class="[&>_td]:px-6 [&>_td]:py-4 [&>_td]:min-h-[50px] bg-white border-b">
                       <td className={` flex items-center relative font-medium`}><span className={`border-l-[3px] flex w-full absolute left-0 top-[-2px]`}></span>
                        {i.day}
                       </td>
                       {i.items.map((i2,_i2)=>(
                           
                            <>
                                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==88 ? 'bg-blue-50':''} ${project==2 ? 'hidden':''}`} style={{color:i2.projected < 0 || _i2==1 ? 'crimson' : _i2==0 ? 'rgb(22, 163, 74)' :  '#111' }}>{i2.projected.toFixed(2)}</td>
                                <td className={`${new Date().getFullYear() == year && new Date().getMonth()==99 ? 'bg-blue-50':''} ${project==3 ? 'hidden':''}`} style={{color:i2.done < 0 || _i2==1 ? 'crimson' : _i2==0 ? 'rgb(22, 163, 74)' : '#111'}}>{i2.done.toFixed(2)}</td>
                           </>

                        ))}
                       </tr>
        ))}
        
       
    </tbody>
</table>
}



</div>

    </>
  )
}

export default StatsTable