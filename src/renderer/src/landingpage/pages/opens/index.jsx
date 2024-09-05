import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useHomeData } from '../../../contexts/HomeDataContext'
import i18n from '../../../i18n'
import { t } from 'i18next'

function Faq() {


      const data=useHomeData()


      useEffect(()=>{
        data._scrollToSection('top')
      },[])

      
  return (
    <DefaultLayout>

           <div className="w-full min-h-[200px] mt-[50px] flex items-center p-6 bg-[#ff7626]">
               <h2 className="text-white text-[31px]">{t('common.opens')}</h2>
           </div>

           
           <div className="px-7 my-14">
                <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('common.opens')}</h3>
                <div className="max-w-[700px] mx-auto">
                    <span className="flex items-center">{t('messages.no-opens-in-the-momment')}</span>
                </div>
         </div>

    </DefaultLayout>
  )
}

export default Faq