import * as React from 'react';
import Alert from '@mui/material/Alert';
import { WarningAmberRounded } from '@mui/icons-material';
import colors from '../../assets/colors.json'
import { CircularProgress } from '@mui/material';
export default function transationNextDate({res,show,loading,message,buttons}) {
  return (
<>


<div id="authentication-modal" tabindex="-1" aria-hidden="true" className={`overflow-y-auto bg-[rgba(0,0,0,0.3)] ${show ?' z-10':'translate-y-2 opacity-0 -z-10'} flex overflow-x-hidden fixed top-0 right-0 left-0  justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}>
    <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
            <div className={`${loading ? 'hidden' :'flex'} items-center justify-between p-4 md:p-5 border-b rounded-t`}>
                <h3 className={`text-xl font-semibold text-gray-900 `}>
                   Tem certeza que quer continuar?
                </h3>
                <button onClick={()=>res(false)} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className={`${loading ? 'hidden' :''} py-4 px-4`}>
                <div className="space-y-4" action="#">

                <div class="py-2 text-center">


                {message &&  <Alert severity="warning">{message}</Alert>}
                


                </div>

              
                  {/**<button  onClick={()=>res(i.id)} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                  {i.name}
                                </button> */}
                  
                    {buttons.map(i=>(
                    <>
                        {
                            i.type=="danger" ? (
                                <button onClick={()=>res(i.id)} className={`w-full text-white bg-red-600 hover:opacity-60 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                                    {i.name}
                                </button>
                    
                            ) :  i.type=="alert" ? (
                                <button onClick={()=>res(i.id)} className={`w-full text-white  bg-orange-400 hover:opacity-60  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                                   {i.name}
                                </button>
                            ): (
                                
                                <button onClick={()=>res(i.id)} className="w-full bg-white text-gray-700 border hover:opacity-60  font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    {i.name}
                                </button>
                            )
                        }
                        
                    </>
                 ))}


                </div>
            </div>
            
            {loading &&  <div className="mt-5 flex flex-col items-center py-8">
                            <span className="block mb-2">A carregar...</span>
                            <CircularProgress/>
            </div>}
        </div>
    </div>
</div> 

      </>
  );
}