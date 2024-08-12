import * as React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
export default function PrintTable() {
 const data = useData()
 const {user} = useAuth()
 const {pathname}= useLocation()
 
 const [company,setCompany]=React.useState({})

 React.useEffect(()=>{

     if(!user) return
     setCompany({
          logo:user.companies_details.filter(i=>i.id==user.selected_company)[0]?.logo?.generated_name,
          name:user.companies_details.filter(i=>i.id==user.selected_company)[0]?.name,
     })
        
 },[user])

  return (
      <>  
           <div  className={` ${((!pathname.includes('/reports/') || data._printData.type=="array") && data._printData.data.length) ? 'print-table':''} ${data._printData.from=="stats" ? 'stats':''} _float_print_t bg-white absolute min-w-full min-h-lvh overflow-x-auto opacity-0 pointer-events-none`}>

                    <div className="flex items-center mb-10 justify-between">
                         <div className="flex items-center">
                                  {(data.online && company.logo) && <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${data.APP_BASE_URL+"/file/"+company.logo?.replaceAll(' ','%20')}")`}} className="w-[60px] h-[60px] mr-5 border overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                                  
                                  </div>}
                                  <span className="font-bold text-[25px]">{company.name}</span>
                         </div>

                         <div>{new Date().toISOString().split('T')[0]}</div>
                    </div>
                    
                    <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="w-full border-b bg-gray-100">
                        {data._printData.type=="array" ? <>

                         {data._printData.data.filter((_,_i)=>_i==0).map(i=>(
                              <>
                                   {i.map(f=>(
                                        <th className="py-2 px-4 text-left">{f}</th>
                                   ))}
                              </>
                         ))}

                        </>:<>
                         {Object.keys(data._printData.data.length ? data._printData.data[0] : {}).map(i=>(
                              <th className="py-2 px-4 text-left">{i}</th>
                         ))}
                        </>}

                        
                    </tr>
                    </thead>
                    <tbody>

                      {data._printData.type=="array" ? <>
                         
                         {data._printData.data.filter((_,_i)=>_i!=0).map(i=>(
                             <tr className="w-full border-b">
                                   {i.map(f=>(
                                        <td className={`py-2 px-4 ${f && f.toString().includes('-') && !isNaN(f) ? 'text-red-600': f && !isNaN(f) ? 'text-green-500':''}`}>{f}</td>
                                   ))}
                            </tr>
                         ))}
                          
                      </>:<>

                              {data._printData.data.map(i=>(
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