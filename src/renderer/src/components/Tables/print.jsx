import * as React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLocation } from 'react-router-dom';
export default function PrintTable() {
 const {_printData} = useData()
 const {pathname}= useLocation()
 
 console.log(_printData)

  return (
      <>  
           <div  className={` ${((!pathname.includes('/reports/') || _printData.type=="array") && _printData.data.length) ? 'print-table':''} _float_print_t bg-white absolute min-w-full min-h-lvh overflow-x-auto opacity-0 pointer-events-none`}>
                    <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="w-full border-b bg-gray-100">
                        {_printData.type=="array" ? <>

                         {_printData.data.filter((_,_i)=>_i==0).map(i=>(
                              <>
                                   {i.map(f=>(
                                        <th className="py-2 px-4 text-left">{f}</th>
                                   ))}
                              </>
                         ))}

                        </>:<>
                         {Object.keys(_printData.data.length ? _printData.data[0] : {}).map(i=>(
                              <th className="py-2 px-4 text-left">{i}</th>
                         ))}
                        </>}

                        
                    </tr>
                    </thead>
                    <tbody>

                      {_printData.type=="array" ? <>
                         
                         {_printData.data.filter((_,_i)=>_i!=0).map(i=>(
                             <tr className="w-full border-b">
                                   {i.map(f=>(
                                        <td className={`py-2 px-4 ${f && f.toString().includes('-') && !isNaN(f) ? 'text-red-600': f && !isNaN(f) ? 'text-green-500':''}`}>{f}</td>
                                   ))}
                            </tr>
                         ))}
                          
                      </>:<>

                              {_printData.data.map(i=>(
                                   <tr className="w-full border-b">
                                        {Object.keys(i).map(f=>(
                                             <td className={`py-2 px-4 ${f=="Valor" && i[f].includes('-') ? 'text-red-600': f=="Valor" ? 'text-green-500':''}`}>{i[f]}</td>
                                        ))}
                                   </tr>
                              ))} 
                      
                      </>}
                     
                    </tbody>
                </table>
           </div>
      </>
  );
}