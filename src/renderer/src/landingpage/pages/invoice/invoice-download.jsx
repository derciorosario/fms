import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from 'i18next'
import { useHomeData } from '../../../contexts/HomeDataContext'

function InvoiceDownload() {
  const data=useHomeData()
  const [invoice,setinvoice]=useState(data.invoice)
  const {pathname} = useLocation()
  useEffect(()=>{
        if(data.form.invoice?.invoice_number){
            setTimeout(()=>data.downloadPDF(),1000)
        }
        setinvoice(data.invoice)

        console.log({v:data.form})

  },[data.form.invoice])
  const [sub,setSub]=useState(0)

  return (
    <div>


        <div className={`bg-white max-w-[600px] hidden p-10 mx-auto fixed left-0 z-[-99] ${pathname.includes('/invoice/') ? '_print':''}`} id="content-to-download">
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
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('invoice.invoice-number')}</span><span className="text-[15px]">#{invoice?.invoice_number}</span></div>
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
  )
}

export default InvoiceDownload