import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarToday from '@mui/icons-material/CalendarMonthOutlined'
export default function NotificationPopUp({show,setOpenPopUps}) {

  

  return (
   <>
     <div className={`_nots transition duration-75 ease-in-out ${show ? 'translate-y-2  z-10' : ' opacity-0 translate-y-4'} flex absolute flex-col rounded-[0.3rem] right-0 top-[100%] w-[350px] h-[400px] bg-white shadow`}>
     <div className="flex items-center justify-between p-2 border-b">
        <span>Notifications</span> 
        <span onClick={()=>setOpenPopUps({nots:false,search:false})} className="cursor-pointer hover:opacity-95"><CloseIcon sx={{width:20}}/></span>
    </div> 

   <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700 p-3 flex-1 overflow-auto">
     {Array.from({length:5},()=>null).map((_,i)=>(
        <li class="py-2 border-b">
        <div class="items-center rtl:space-x-reverse">
          
           <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                 Neil Sims
              </p>
              <p class={`text-sm text-gray-500 ${0==0 ? '':'truncate'} dark:text-gray-400`}>
                 email@flowbite.com asdasdasd asdasdasda asdasd asdasdasd sadasdasd asdasdas
              </p>
           </div>
           <div class="mt-2 inline-flex items-center text-[14px] opacity-75 font-medium text-gray-900 dark:text-white">
              <CalendarToday sx={{width:16}}/> <span>20/32</span>
           </div>
        </div>
     </li>
     ))}
   
</ul>


     </div>
   </>
  );
}
