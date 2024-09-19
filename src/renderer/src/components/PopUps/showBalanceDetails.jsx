import { Close } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next'
import { useAuth } from '../../contexts/AuthContext'

function ShowBalanceDetails({show,full}) {
  const data=useData()
  const {db} = useAuth()

  const [totals,setTotals]=useState({
     final:0,
     moviments:0,
     initial:0,
  })
  
  useEffect(()=>{

    let mov=parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)))
    let initial=parseFloat(data._payment_methods.map(i=>i.has_initial_amount ? i.initial_amount : 0).reduce((acc, curr) => acc + curr, 0))
   
    setTotals({
      moviments:mov,
      initial:initial,
      final: mov + initial
    })

  },[data.payment_methods])

  useEffect(()=>{

   
      data._get(['payment_methods','transations'])


  },[db])
  return (
    <div className={`${!full ? 'fixed':'overflow-y-auto'}  _balance_details z-10 left-0 ${show ? 'flex':" opacity-0 pointer-events-none"} items-center justify-center top-0  w-full ${!full ? 'h-[100vh] bg-[rgba(0,0,0,0.4)]':''}`}>
              

          <div className={`md:${full ? 'w-full' : 'w-[600px] overflow-y-auto shadow-lg border-t'} flow-y-auto w-full md:h-[300px] h-full ${show ? 'translate-y-2 z-10 ' : ' opacity-0 pointer-events-none translate-y-4'}  flex-col flex relative transition duration-150 ease-in-out    bg-white rounded-[0.5rem] _search`}>
                <div className={`flex justify-between border-b ${full ? 'px-2':'p-2'}`}>
                   
                     <span className="text-[17px] font-semibold">{t('common.balance-details')}</span>
                     <div className="flex hidden">
                         
                          <div className="flex flex-col items-center">
                               <span className="text-[13px] font-medium p-1 bg-gray-200 rounded-[0.2rem]">{t('common.total-initial-balance')}</span>
                               <label className="text-[13px]">{data._cn(totals.initial)}</label>
                          </div>

                          <span className="mx-1">+</span>

                          <div className="flex flex-col items-center">
                               <span className="text-[13px] font-medium p-1 bg-gray-200 rounded-[0.2rem]">{t('common.total-moviments')}</span>
                               <label className="text-[13px]">{data._cn(totals.moviments)}</label>
                          </div>

                          <span className="mx-1">=</span>

                          <div className="flex flex-col items-center">
                               <span className="text-[13px] font-medium p-1 bg-gray-200 rounded-[0.2rem]">{t('common.final-balance')}</span>
                               <label className="text-[13px]">{data._cn(totals.final)}</label>
                          </div>
                     </div>
                     {!full &&  <div className="cursor-pointer top-2 left-2" onClick={()=>data._closeAllPopUps()}>
                          <Close sx={{width:20}}/>
                      </div>}

                </div>
                <div>
                     
                <table class="w-full text-sm text-left rtl:text-right  rounded-[0.2rem]  ">
                  <thead class="text-xs text-gray-900 uppercase rounded-[1rem]">
                      <tr className="[&>_th]:px-3 [&>_th]:py-2">

                          <th scope="col">
                                 <span>{t('common.name')}</span>
                          </th>
                          <th scope="col">
                                  <span>{t('common.initial-balance')}</span>
                                  
                          </th>
                          <th scope="col">
                                  <span>{t('common.moviments')}</span>
                          </th>
                          {full && <th scope="col">
                                  <span>{t('common.final-balance')}</span>
                          </th>}
                      </tr>
                  </thead>

                  <tbody>

                        {data._payment_methods.map(i=>(
                            <tr class="bg-white [&>_td]:px-3 [&>_td]:py-2 [&>_td]:border-b cursor-pointer">
                                <th scope="row" class="px-3 py-2 border-b font-medium text-gray-900 whitespace-nowrap">
                                    <span className="text-[13px] p-1 rounded bg-gray-100">{i.name}</span>
                                </th>
                                <td>
                                  {data._cn(parseFloat((i.has_initial_amount ? i.initial_amount : 0)))}
                                </td>
                                <td className="min-w-0">
                                    <span className="truncate">{data._cn(parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==i.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((i.has_initial_amount ? i.initial_amount : 0)) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==i.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))))}</span>
                                </td>
                                {full && <td className="min-w-0">
                                    <span className="truncate">{data._cn(parseFloat((data._transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==i.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((i.has_initial_amount ? i.initial_amount : 0)) - parseFloat((data._transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==i.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0))) + parseFloat((i.has_initial_amount ? i.initial_amount : 0)))}</span>
                                </td>}
                           </tr>
                        ))}

                  </tbody>

               </table>

                </div>
 
 
               
         </div>


    </div>
  )
}

export default ShowBalanceDetails