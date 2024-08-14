import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { Link } from 'react-router-dom'

function index() {
  return (
    <DefaultLayout>
         <div className="flex items-center justify-center h-[100vh] w-full flex-col">
            <h3 className="pb-4 text-[25px]">{t('common.page-not-found')}</h3>
            <p><Link to={'/'} className="underline">Página inicial</Link></p>
        </div>
    </DefaultLayout>
  )
}

export default index