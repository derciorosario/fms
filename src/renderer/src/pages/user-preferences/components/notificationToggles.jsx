import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Checkbox, Switch } from '@mui/material';
import { useData } from '../../../contexts/DataContext';

function NotificationToggles() {
 const { t } = useTranslation();
 const [page,setPage]=React.useState('notifications')
  

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
                                onChange={()=>{}}/><span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">PopUps</span>
                                </label>
                                <label for="email" className="relative inline-flex cursor-pointer items-center">
                                <Switch
                                disabled={0===1 ? true : false}
                                inputProps={{ 'aria-label': 'controlled' }}
                                onChange={()=>{}}/><span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                                </label>
                                <label for="sms" className="relative inline-flex cursor-pointer items-center">

                                    <Switch
                                disabled={0===1 ? true : false}
                                inputProps={{ 'aria-label': 'controlled' }}
                                onChange={()=>{}}/>
                                {/*<input type="checkbox" value="" id="sms" className="peer sr-only" />
                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>*/}
                                <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Whatsapp</span>
                                </label>
                            </div>
                        </div>
          
    </>

  )

}

export default NotificationToggles

