import * as React from 'react';
import Alert from '@mui/material/Alert';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function transationNextDate({formData,show,setShow,setFormData,SubmitForm,last_date}) {
  return (
<>


<div id="authentication-modal" tabindex="-1" aria-hidden="true" className="overflow-y-auto bg-[rgba(0,0,0,0.3)] flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
    <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Data do proximo pagamento
                </h3>
                <button onClick={()=>setShow(false)} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-4 md:p-5">
                <div className="space-y-4" action="#">
                <Alert severity="warning">Este pagamento está em atraso, recomendamos que troque a data do proximo pagamento para o valor em falta. (data definida:{last_date})</Alert>
                <div>
                            <LocalizationProvider adapterLocale={'en-gb'} dateAdapter={AdapterDayjs} style={{paddingTop:0}} size="small">
                                <DatePicker minDate={dayjs(new Date())} value={dayjs(formData.next_payday).$d.toString() != "Invalid Date" ? dayjs(new Date(formData.next_payday)) : null}  inputFormat="DD-MM-YYYY" onChange={(e)=>setFormData({...formData,next_payday:e.$d})} error={true} size="small" label="Data de proximo pagamento*"  style={{padding:0}}  sx={{width:'100%','& .MuiInputBase-root':{height:40,paddingTop:0}, 
                                    '& .Mui-focused.MuiInputLabel-root': { top:0 },
                                    '& .MuiStack-root': { paddingTop:0},'& .MuiInputLabel-root':{ top:-8}}}
                                    />
                            </LocalizationProvider>
                </div>
                  
                   {/***
                    *  <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    */}
                   {/** <div className="flex justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label for="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div> */}

                    <button onClick={()=>SubmitForm(false)} className={`w-full text-white ${formData.next_payday ? 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none' :'bg-gray-300 cursor-not-allowed'} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>Alterar</button>
                    <button onClick={()=>{
                        SubmitForm('ignore_next_payday')
                    }} className={`w-full text-white  bg-orange-400  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>Manter como atrasado</button>
                    <button onClick={()=>setShow(false)} className="w-full bg-white text-gray-700 border  font-medium rounded-lg text-sm px-5 py-2.5 text-center">Cancelar</button>
                   
                   
                    {/*<div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                    </div>*/}
                </div>
            </div>
        </div>
    </div>
</div> 

      </>
  );
}