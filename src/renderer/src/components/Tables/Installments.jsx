import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

export default function CircularIndeterminate({items,setFormData,formData,page,disabled}) {
 
  const [res,setRes]=React.useState([]) 

  function update_installments(id,value,field,index){
    let new_installments=items.map(f=>{
        if(f.id==id){
            return {...f, [field]:value}
        }else{
            return f
        }
    })

    setFormData({...formData,installments: new_installments,payday:(field=="date" && index==0) ? value : formData.payday})
  }
  
  React.useEffect(()=>{

     let _items=[]

     Array.from({ length:items.length }, () => null).forEach((i,_i)=>{
          let left=parseFloat(items[_i].amount) * (_i + 1) - parseFloat(formData.paid)
          let paid=parseFloat(items[_i].amount) - left
          _items[_i]={status:paid >= parseFloat(items[_i].amount) && paid && formData.paid ? 'paid' : 'pending', paid:paid <= parseFloat(items[_i].amount) && paid > 0 ? paid : paid > parseFloat(items[_i].amount) ? parseFloat(items[_i].amount) :   0}
          
     })

     setRes(_items)

     console.log({})

  },[formData])


  
  


  return (
<>  
  <div class={`relative bg-white overflow-x-auto mb-4 max-h-[200px] max-w-[800px] px-4 ${disabled ? 'opacity-70 pointer-events-none' :''}`}>
    <table class="w-full text-sm text-left rtl:text-right  border rounded-[0.2rem] ">
        <thead class="text-xs text-gray-900 uppercase rounded-[1rem]  dark:text-gray-400 bg-gray-100">
            <tr className="[&>_th]:px-3 [&>_th]:py-2">
                <th scope="col">
                    Valor a {page == 'pay' ? 'pagar' :'receber'}
                </th>
                <th scope="col">
                    {page == 'pay' ? 'Pago' :'Recebido'}
                </th>
                <th scope="col">
                    Data de {page == 'pay' ? 'pagamento' :'recebimento'}
                </th>
                <th scope="col">
                    Estado
                </th>
            </tr>
        </thead>

        <tbody>
            {items.map((i,_i)=>(
                    <tr class="bg-white [&>_td]:px-3 [&>_td]:py-2 [&>_td]:border-b">
                    <th scope="row" class="px-3 py-2 border-b font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {i.amount.toFixed(2)}
                    </th>
                    <td>
                        {res[_i]?.paid}
                    </td>
                    <td>
                        <div>
                        <LocalizationProvider  adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                        <DatePicker minDate={_i!=0 ? dayjs(formData.payday) : null} onChange={(e)=>update_installments(i.id,e.$d,'date',_i)}  value={dayjs(i.date).$d.toString() != "Invalid Date" ? dayjs(new Date(i.date)) : null}   inputFormat="DD-MM-YYYY" error={true}  style={{padding:0}}  sx={{width:'100%',maxWidth:'200px','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                            '& .Mui-focused.MuiInputLabel-root': { top:0 },
                            '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                            />
                        </LocalizationProvider>
                        </div>
                    </td>
                    <td>
                        <span style={{backgroundColor:res[_i]?.status=='paid' ? '#C9E8E8':res[_i]?.status=='pending' ? 'rgb(255 244 198)': '#F3D4D1', color: '#111' , padding:'0.5rem 0.8rem',borderRadius:'0.2rem',height:20,minWidth:'60px',justifyContent:'center'}}>  {res[_i]?.status=='paid' || !res[_i]?.status ? 'Pago' : i.status=='pending' ? 'Pendente' : 'Vencido'}</span>
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


      </>
  );
}