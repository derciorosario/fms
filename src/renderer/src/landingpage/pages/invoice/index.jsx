import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
//import QRCodeGenerator from './QRCodeGenerator';
import { useLocation, useParams } from 'react-router-dom';
import DefaultButton from '../../components/buttons/DefaultButton';
import axios from 'axios';
import { useHomeData } from '../../../contexts/HomeDataContext';

function Invoice({}) {
  const { invoice_number } = useParams()
  const [message,setMessage]=useState('')
  const [status,setStatus] = useState('')
  const data = useHomeData()
  const [invoice,setInvoice] = useState()
  const [loading,setLoading] = useState(true)
  const {pathname} = useLocation()
  const [sub,setSub]=useState(0)


  async function get_invoice(){
    setSub(0)
    if(data.invoices.some(i=>i.invoice_number==invoice_number)){
            setInvoice(data.invoices.filter(i=>i.invoice_number==invoice_number)[0])
            setLoading(false)
            setStatus(200)
            setMessage('')
    }else{
        try{
            let r = await axios.get(`${data.APP_BASE_URL}/api/v1/invoice/`+invoice_number)
            if(r.data.invoice){
                setInvoice(r.data.invoice)
            }
            setStatus(r.data.status)
            setLoading(false)
        }catch(e){
            setStatus(500)
            setInvoice(null)
            setLoading(false)
        }
    }
  }

  useEffect(()=>{
        get_invoice()
  },[data.invoices,pathname])

  useEffect(()=>{
    data._scrollToSection('top')
  },[pathname])



useEffect(()=>{

    if(invoice){
        setSub(invoice?.payment_items?.map(i=>parseFloat(i.price) * parseInt(i.quantity))?.reduce((acc, curr) => acc + curr, 0))
    }else{
        setSub(0)
    }
      
},[invoice])



  
 
  useEffect(()=>{
      if(status==404){
        setMessage(t('common.item-not-found'))
      }
  },[status])

  if(loading){
     return (
        <DefaultLayout>
         <div className="flex justify-center flex-col h-[80vh]">
            <div className={`flex justify-center`}>
              <div className="_spinner-container"><div className="_spinner border-t-orange-500"></div></div>
            </div>
          </div>
          </DefaultLayout>
     )
  }
  
  return (
   <DefaultLayout>
           
           <div className={`${!message && status!=500 ? 'hidden' :'mt-20'} flex  min-h-[40vh] items-center justify-center flex-col`}>
               {message &&  <div id="alert-2" className="flex items-center w-[300px] p-4 my-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ms-3 text-sm font-medium">
                    {message}
                  </div>
                  
                </div>}

                {status==500 && <div onClick={()=>window.location.reload()}>

                    <DefaultButton text={t('messages.try-again')}/>

                </div>}
           </div>

            
            <div className={`min-h-[100vh]  py-32 pb-10 px-5 w-full ${message || status==500 ? 'hidden':''} bg-[#D9D9D9]`}>
                 <div className="max-w-[600px] px-3 pb-3 mx-auto flex items-center justify-between">
                     <h2 className="text-[27px]">{t('common.invoice')}</h2>
                     <button onClick={()=>{
                         window.print()
                     }} className=" bg-white rounded-[0.3rem] px-2 mt-6 py-1 cursor-pointer text-gray-600 shadow hover:underline mb-3"> {t('invoice.print')}</button>
                    </div>
                 <div className={`bg-white max-w-[600px] p-10 mx-auto ${pathname.includes('/invoice/') ? '_print':''}`}>
                        <div className="flex justify-between mb-10">
                               <span className="text-[26px] font-bold">PROCONTA</span>
                               <span className="text-[23px]">{t('common.invoice')}</span>
                        </div>

                        <div className="sm:flex justify-between">
                             <div className="max-sm:mb-5">
                                 <span className="text-[21px] font-semibold">{t('invoice.invoice-for')}</span>
                                 <p className="break-words block max-w-[220px] text-[17px] mb-2">{invoice?.to_name}</p>
                                 <p className="break-words block max-w-[220px] text-[17px]">{invoice?.to_number}</p>
                             </div>

                             <div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('invoice.date')}</span><span className="text-[15px]">{invoice?.date?.split('T')?.[0]}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('invoice.invoice-number')}</span><span className="text-[15px]">#{invoice_number}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('common.payment-method')}</span><span className="text-[15px]">{invoice?.payment_method}</span></div>
                             </div>
                        </div>
        <div className="w-full mt-10 mb-5">

                              

  <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-white">
        <thead class="text-xs text-white uppercase bg-[#367BF5] ">
            <tr>

                <th scope="col" class="px-6 py-3">
                    {t('invoice.description')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('invoice.quantity')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('common.price')}
                </th>
                <th scope="col" class="px-6 py-3">
                    Total
                </th>

            </tr>
        </thead>
        <tbody>

            {invoice?.payment_items?.map((i,_i)=>(
                   <tr class="bg-white border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {i.name}
                        </th>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                           {i.quantity}
                        </td>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                            {data._cn(i.price)} MT
                        </td>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                             {data._cn(parseFloat(i.quantity) * parseFloat(i.price))} MT
                        </td>
                    </tr>
            ))}
           
           
        </tbody>
    </table>
</div>
  </div>

     <div className="flex justify-end mb-10">
           <div className="table">
                <div className="flex justify-between border-b py-2">
                    <span className="mr-10 font-semibold">Total</span><span className="text-blue-400">{data._cn((invoice?.taxes ? invoice.taxes : 0) + sub)}</span>
                </div>
           </div>
     </div>

                        <div className="hidden">
                           {/***8<QRCodeGenerator link={`${data.server_url}/api/v1/invoice/`+invoice_number} /> */}
                        </div>

                        <div className="flex justify-center mt-20"><span className="mr-3">{t('invoice.generated-in')}:</span><label>{invoice?.date?.split('T')?.[0]}</label></div>
                 </div>
           </div>
   </DefaultLayout>
  )
}

export default Invoice