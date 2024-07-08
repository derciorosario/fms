import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Warning, WarningAmber, WarningAmberRounded, WarningRounded, WarningTwoTone } from '@mui/icons-material';
import colors from '../../assets/colors.json'
import { Alert } from '@mui/material';
export default function ConfirmDialog({res,show,loading,message,buttons}) {
  return (
<>
<div id="popup-modal" tabindex="-1" class={`${!show ? 'hidden':'flex'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center  items-center w-full md:inset-0 h-[100%] max-h-full bg-[rgba(0,0,0,0.3)]`}>
    <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow py-8">
           {!loading &&  <button onClick={()=>res('cancel')} type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Fechar</span>
            </button>}

            
            {!loading && <div class="p-4 md:p-5 text-center">
                <WarningAmberRounded sx={{width:60,height:60,color:colors.app_orange[600]}}/>
                <h3 class="mb-3 mt-2 text-lg font-normal text-gray-500 ">Tem certeza que quer continuar?</h3>
                <div className="mb-4 hidden">{message}</div>

                {message &&  <Alert severity="warning">{message}</Alert>}
                
               
               <div>
                



                <br/>

                 {buttons.map(i=>(
                    <>
                        {
                            i.type=="danger" ? (
                                <button onClick={()=>res(i.id)} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                {i.name}
                                </button>
                            ) :  i.type=="warning" ? (
                                <button  onClick={()=>res(i.id)} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                  {i.name}
                                </button>
                            ): (
                                <button  onClick={()=>res(i.id)} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                  {i.name}
                                </button>
                            )
                        }
                        
                    </>
                 ))}
                

                
                
               </div>
           
            </div>}





            {loading &&  <div className="mt-5 flex flex-col items-center">
                            <span className="block mb-2">A carregar...</span>
                            <CircularProgress/>
                        </div>}
                        
           
        </div>
    </div>
</div>
      </>
  );
}