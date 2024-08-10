import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarToday from '@mui/icons-material/CalendarMonthOutlined'
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRightIcon } from '@mui/x-date-pickers/icons';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import i18n from '../../i18n';

export default function NotificationPopUp({show,setOpenPopUps}) {


  const {db,user} = useAuth();
  const navigate=useNavigate()

  const data=useData()
  const [nots,setNots]=React.useState([]) 
  const [converted,setConverted]=React.useState([])
  let required_data=['notifications']


  React.useEffect(()=>{
       setNots(data._notifications)
  },[data._notifications])



  async function get_nots(){
  
     try{

      let new_nots=await data.makeRequest({method:'post',url:`api/user/nots`,data:{company_id:user.selected_company}, error: ``},0);
      //let _nots=[...nots,...new_nots.filter(i=>!nots.some(f=>i.id==f.id))]
      setNots(new_nots)
      if(show) view_nots(new_nots)
      data.setNotSeenNots(new_nots.some(i=>i.seen==false))
      data._update('notifications',[new_nots])
      data._add([new_nots.filter(i=>!data._notifications.some(f=>f.id==i.id))])
   
   
     }catch(e){
      console.log(e)
     }
        
  }


  async function view_nots(_nots){

     try{
      let r=await data.makeRequest({method:'post',url:`api/user/nots/view`,data:{company_id:user.selected_company,ids:_nots.filter(i=>!i.seen).map(i=>i.id)}, error: ``},0);
      console.log(r)
   
     }catch(e){
      console.log(e)
     }


  }


  React.useEffect(()=>{
        
        get_nots()    
      
  },[show,user,data.notsUpdater,data.online])


  React.useEffect(()=>{
        
    if(show && user && nots.length) view_nots(nots)   
 
},[show,user,data.notsUpdater,nots])



  React.useEffect(()=>{

      let _nots=nots.map(i=>{
           let title
           let message
           let link
           let days_b=data.daysBetween(new Date(data._today()),new Date(i.date.split('T')[0]))
           let l=i18n.language
             
           
           if(i.content.id=="upcomming-bills"){
              let on=data.daysBetween(new Date(data._today()),new Date(i.date.split('T')[0])) + parseInt(i.content.days) >= 1
             title=t('common.accounts')
              if(i.content.bills_to_pay.length && i.content.bills_to_receive.length){
                    message=`${l=="pt" ? 'Tens':'You have'} ${i.content.bills_to_pay.length} ${on && l=="en" ? 'upcomming':''} ${l=="pt" ? 'conta(s) a pagar e':'account(s) to pay and'} ${i.content.bills_to_receive.length} ${l=="pt" ? 'a receber':'to receive'} ${on && l=="pt" ? 'se aproximando':''}`
              }else if(i.content.bills_to_pay.length){
                    message=`${l=="pt" ? 'Tens':'You have'} ${i.content.bills_to_pay.length} ${on && l=="en" ? 'upcomming':''} ${l=="pt" ? 'conta(s) a pagar':'account(s) to pay'} ${on && l=="pt" ? 'se aproximando':''}`
              }else{
                    message=`${l=="pt" ? 'Tens':'You have'} ${i.content.bills_to_receive.length} ${on && l=="en" ? 'upcomming':''} ${l=="pt" ? 'conta(s) a receber':'account(s) to receive'} ${on && l=="pt" ? 'se aproximando':''}`
              }

              if(on){
                 link=`/${i.content.bills_to_pay.length ? 'bills-to-pay':'bills-to-receive'}`
              }
           }

           return {title,message,date:(days_b==0 ? t('common.today') : days_b== -1 ? t('common.yesterday') :  i.date.split('T')[0]) + " " + i.date.split('T')[1].slice(0,5) ,link}
      }).reverse()

      setConverted(_nots)

  },[nots,i18n.language])

  React.useEffect(()=>{
   data._get(required_data.filter(i=>!data._loaded.includes(i)))    
 },[db])



  return (
   <>
     <div className={`_nots transition duration-75 ease-in-out ${show ? 'translate-y-2  z-10' : ' opacity-0 pointer-events-none translate-y-4'} flex absolute max-md:fixed flex-col rounded-[0.3rem] right-0 top-[100%] max-md:top-0 max-md:w-full w-[350px] h-[400px] max-md:h-[100vh] bg-white shadow`}>
     <div className="flex items-center justify-between p-2 border-b">
        <span>{t('common.notifications')}</span> 
        <span onClick={()=>setOpenPopUps({nots:false,search:false})} className="cursor-pointer hover:opacity-95"><CloseIcon sx={{width:20}}/></span>
    </div> 

   {!converted.length && <div className="h-full w-full flex items-center justify-center opacity-50 text-[14px]">
           <span>{t('common.no-nots')}</span>
    </div>}

   <ul class="max-w-md divide-y divide-gray-200 p-3 flex-1 overflow-auto">
     {converted.map((i,_i)=>(
        <li class="py-2 border-b">
        <div class="items-center rtl:space-x-reverse relative">
          
           <div class="flex-1 min-w-0">
              <p class="text-sm  text-app_black-main font-semibold truncate">
                 {i.title}
              </p>
              <p class={`text-sm text-gray-500 ${0==0 ? '':'truncate'}`}>
                 {i.message}
              </p>
           </div>
           <div class="mt-2 inline-flex items-center text-[14px] opacity-75 font-medium text-gray-900">
              <CalendarToday sx={{width:14,opacity:.7}}/> <span className="ml-1 font-semibold opacity-70">{i.date}</span>
           </div>

          {i.link && <div onClick={()=>{
             navigate(i.link)
             setOpenPopUps({nots:false,search:false})
          }} className="absolute p-2 right-0 bottom-1 text-app_orange-300 cursor-pointer hover:text-amber-600">
                 <ArrowRightIcon sx={{width:20}}/>
           </div>}
        </div>
     </li>
     ))}
   
</ul>


     </div>
   </>
  );
}
