import React, { useState } from 'react';
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';

function FilterOptions({formData,setFormData,initialized}) {

  const data=useData()

  function check_and_uncheck(account){
    let new_accounts=formData.settings?.bills_not?.accounts.includes(account) ? formData.settings?.bills_not?.accounts.filter(i=>i!=account) : [...formData.settings.bills_not.accounts,account]
  
     setFormData({...formData,settings:{...formData.settings,bills_not:{...formData.settings?.bills_not,accounts:new_accounts}}})
  }

  
  return (

    <div className={`${data._openPopUps.not_bill_accounts ? 'flex' :'hidden'} items-center justify-center py-1 absolute left-0 top-full`}>
 
  <div id="dropdown" className="z-10 w-56 p-3 bg-white rounded-lg shadow">
    <h6 className="mb-3 text-sm font-medium text-gray-900">
      Contas
    </h6>
    {<ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
        {data._account_categories.map((i,_i)=>(

                <li onClick={()=>check_and_uncheck(i.id)} className="flex items-center" key={_i}>
                        <input id="apple" type="checkbox" checked={formData.settings?.bills_not?.accounts.includes(i.id) ? true : false} value=""
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />

                        <label for="apple" className="ml-2 text-sm font-normal text-gray-900">
                           {i.name}
                        </label>
                </li>
            
        ))}
    </ul>}

     {data._account_categories.length==0 && <span className="text-gray-300 font-normal">Nenhuma conta disponivel</span>}
  </div>
</div>

           
  )

}

export default FilterOptions

