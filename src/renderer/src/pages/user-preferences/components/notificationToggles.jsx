import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Checkbox, Switch } from '@mui/material';
import { useData } from '../../../contexts/DataContext';

function NotificationToggles({activeAndDisable,email,whatsapp,field}) {
 const { t } = useTranslation();
 const [page,setPage]=React.useState('notifications')
  const data = useData()

  React.useEffect(()=>{
      
  

  },[])

  
 

  return (

    <>
                  <div className="mt-4 flex items-start sm:justify-end">
                            <div className="flex  gap-2">
                                <label for="push" className="relative inline-flex cursor-pointer items-center hidden">
                                <Switch
                                disabled={0===1 ? true : false}
                                inputProps={{ 'aria-label': 'controlled' }}
                                onChange={()=>{}}/><span className="ml-1 text-sm font-medium text-gray-900">PopUps</span>
                                </label>
                                <label for="email" className="relative inline-flex cursor-pointer items-center">
                                <Switch
                                checked={email}
                                inputProps={{ 'aria-label': 'controlled' }}
                                onChange={(e)=>{
                                    activeAndDisable(field,'email',e.target.value)
                                }}/><span className="ml-1 text-sm font-medium text-gray-900">Email</span>
                                </label>
                                <label for="sms" className="relative inline-flex cursor-pointer items-center">

                                    <Switch
                                checked={whatsapp}
                                inputProps={{ 'aria-label': 'controlled' }}
                                onChange={(e)=>{
                                  activeAndDisable(field,'whatsapp',e.target.value)
                                }}
                                />
                              <span className="ml-1 text-sm font-medium text-gray-900">Whatsapp</span>
                                </label>
                            </div>
                        </div>
          
    </>

  )

}

export default NotificationToggles

