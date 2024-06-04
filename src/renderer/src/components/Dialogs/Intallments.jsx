import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete,Button} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

export default function CircularIndeterminate({setShow,show,items,setFormData,formData,page}) {
 

  function update_installments(id,value){

    console.log({id,value})
    let new_installments=items.map(f=>{
        if(f.id==id){
            console.log('hi')
            return {...f, date:value}
        }else{
            return f
        }
    })

    setFormData({...formData,installments: new_installments})
    
  }  
  return (
<>  
        <div id="static-modal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class={`${!show ? 'hidden':'flex'} overflow-y-auto overflow-x-hidden bg-[rgba(0,0,0,0.3)]  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}>
            <div class="relative p-4 w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Detalhes das parcelas
                        </h3>
                        <button onClick={()=>setShow(false)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div class="p-4 md:p-5 space-y-4">
                       

<div class="relative overflow-x-auto max-h-[260px]">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Valor a {page == 'pay' ? 'pagar' :'receber'}
                </th>
                <th scope="col" class="px-6 py-3">
                    {page == 'pay' ? 'Pago' :'Recebido'}
                </th>
                <th scope="col" class="px-6 py-3">
                    Data de {page == 'pay' ? 'pagamento' :'recebimento'}
                </th>
                <th scope="col" class="px-6 py-3">
                    Estado
                </th>
            </tr>
        </thead>

        <tbody>
            {items.map(i=>(
                    <tr class="bg-white dark:bg-gray-800">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {i.amount.toFixed(2)}
                    </th>
                    <td class="px-6 py-4">
                        {i.paid ? i.paid : '-'}
                    </td>
                    <td class="px-6 py-4">
                        <div>
                        <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                        <DatePicker onChange={(e)=>update_installments(i.id,e.$d)}  value={dayjs(i.date).$d.toString() != "Invalid Date" ? dayjs(new Date(i.date)) : null}   inputFormat="DD-MM-YYYY" error={true}  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                            '& .Mui-focused.MuiInputLabel-root': { top:0 },
                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                            />
                        </LocalizationProvider>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span style={{backgroundColor:!i.status || i.status=='paid' ? '#C9E8E8':i.status=='pending' ? 'rgb(255 244 198)': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {i.status=='paid' || !i.status ? 'Pago' : i.status=='pending' ? 'Pendente' : 'Vencido'}</span>
                    </td>
                </tr>
            ))}

            {!items.length && (
                   <tr class="bg-white dark:bg-gray-800">
                   <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      -
                   </th>
                   <td class="px-6 py-4">
                      -
                   </td>
                   <td class="px-6 py-4">
                     -
                   </td>
                   <td class="px-6 py-4">
                      -
                    </td>
               </tr>
            ) }
        </tbody>

    </table>
</div>


                    </div>
                    <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button onClick={()=>setShow(false)} data-modal-hide="static-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Fechar</button>
                        <button onClick={()=>setShow(false)} data-modal-hide="static-modal" type="button" class=" hidden py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Fechar</button>
                    </div>
                </div>
            </div>
        </div>



      </>
  );
}