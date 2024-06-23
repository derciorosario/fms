import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAltOutlined';
import ChartIcon from '@mui/icons-material/PieChartOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import BurgerIcon from '@mui/icons-material/Menu'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import {useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useTranslation } from 'react-i18next';

function App({float}) {
    const { t } = useTranslation();
    const {user}=useAuth()
    const {_setMenu,_menu}=useData()

    let {pathname} = useLocation()
    //const [open,setOpen]=React.useState(() => localStorage.getItem('menu_open'))

    const [openDropDown, setOpenDropDown] = React.useState([]); 
    const navigate = useNavigate();

    function openCloseMenu(){
        _setMenu({..._menu,open:float ? true : !_menu.open})

        if(_menu.open){
            localStorage.removeItem('menu_open');
        }else{
            localStorage.setItem('menu_open',true);
        }
        
    }


    function changeOpenDropdown(link,path){
       
       if(openDropDown.includes(link)){
            setOpenDropDown(openDropDown.filter(i=>i!=link))
        }else{
            if(!_menu.open && !float) _setMenu({..._menu,float:true})
            setOpenDropDown([...openDropDown,link])
       } 

       

       if(path) to(path)
   }

   function to(path){
     // setActivePath(path)
      navigate(path)
   }

 
   React.useEffect(()=>{

       menuItems.forEach(item=>{
          if(checkActive(item) && !openDropDown.includes(pathname))  {
             setOpenDropDown([...openDropDown,item.field])
          }
       })

      // if(pathname) setActivePath(pathname)

   },[pathname])



   function checkActive(item,isSub){
       if(!item) return false
       let macth=false

       if(isSub || !item.sub_menus){
        

         item.paths.forEach(p=>{
              let _pathname=p.includes(':') ? pathname.split('/').filter((_,_i)=>_i!=pathname.split('/').length - 1).join('') : pathname.split('/').join('')
              let path=p.split('/').join('').split(':')[0]

              if(path == _pathname) {
                macth=true
              }
         })
          
         return macth

       }else{

       

         item.sub_menus.forEach(sub=>{
              sub.paths.forEach(p=>{
                let _pathname=p.includes(':') ? pathname.split('/').filter((_,_i)=>_i!=pathname.split('/').length - 1).join('') : pathname.split('/').join('')
                let path=p.split('/').join('').split(':')[0]
  
                if(path == _pathname) {
                    macth=true
                }
              })
         })
         return macth
       }
   }

 
  
   
    let menuItems=[
        {name:t('sidebar.main.dashboard'),path:'/',paths:[''],field:'dashboard',icon:'GridViewIcon'},

        {name:t('sidebar.main.accounts'),field:'payments',icon:'PaymentsOutlinedIcon',sub_menus:[
            {name:t('sidebar.accounts.toPay'),path:'/bills-to-pay',paths:['bills-to-pay','bills-to-pay/create','bills-to-pay/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.accounts.toReceive'),path:'/bills-to-receive',paths:['bills-to-receive','bills-to-receive/create','bills-to-receive/:id'],icon:'PaymentsOutlinedIcon'},   
        ]},
        {name:t('sidebar.main.cashManagement'),field:'cash-management',icon:'MonetizationOnOutlinedIcon',sub_menus:[
            {name:'Entradas',path:'/cash-management/inflow/',field:'cash-management/inflow',paths:['/cash-management/inflow','/cash-management/inflow/create','/cash-management/inflow/:id'],icon:'MonetizationOnOutlinedIcon'},
            {name:'Saídas',path:'/cash-management/outflow/',field:'cash-management/outflow',paths:['/cash-management/outflow','/cash-management/outflow/create','/cash-management/outflow/:id'],icon:'MonetizationOnOutlinedIcon'},   
        ]},
        {name:t('sidebar.main.register'),field:'register',icon:'PeopleAltIcon',sub_menus:[
            {name:t('sidebar.register.clients'),path:'/clients',field:'clients',paths:['/clients','/clients/create/','/client/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.register.suppliers'),path:'/suppliers',field:'suppliers',paths:['/suppliers','/suppliers/create/','/supplier/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.register.investors'),path:'/investors',field:'investors',paths:['/investors','/investors/create/','/investor/:id'],icon:'PaymentsOutlinedIcon'},
        ]},

        

        {name:t('sidebar.main.investments'),path:'/investments',paths:['/investments','/investments/create','investments/:id'],field:'investments',icon:'Inventory2OutlinedIcon'},

        /*{name:'Controle de orçamento',paths:['/budget-management','/budget-management/create','/budget-management/reports'],field:'budget-management',icon:'PriceChangeOutlinedIcon',sub_menus:[
            {name:'Orçamentos',path:'/budget-management',field:'budget-management',paths:['/budget-management','budget-management/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Relatórios',path:'/budget-management/reports',field:'budget-management',paths:['/budget-management/reports'],icon:'PaymentsOutlinedIcon'},
        ]},*/
        
        
        {name:t('sidebar.main.finacialReconciliation'),path:'/financial-reconciliation',paths:['/financial-reconciliation'],field:'financial-reconciliation',icon:'CurrencyExchangeOutlinedIcon'},
       
        {name:t('sidebar.main.reports'),field:'reports',icon:'ChartIcon',sub_menus:[
            {name:t('sidebar.reports.monthlyCashManagement'),path:'/reports/cash-management/monthly',field:'cash-management/monthly',paths:['/reports/cash-management/monthly'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.reports.weeklyCashManagement'),path:'/reports/cash-management/daily',field:'cash-management/daily',paths:['/reports/cash-management/daily'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.reports.dre'),path:'/reports/dre',field:'/reports/dre',paths:['/reports/dre','/reports/dre/daily','/reports/dre/monthly'],icon:'PaymentsOutlinedIcon'},
        ]},

        {name:t('sidebar.main.settings'),field:'settings',icon:'SettingsIcon',sub_menus:[
            {name:t('sidebar.settings.accountsPlan'),path:'/account-categories',field:'account-categories',paths:['/account-categories','/account-categories/create','/account-categories/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.accounts'),path:'/accounts',field:'accounts',paths:['/accounts','/accounts/create','/account/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.paymentMethods'),path:'/payment-methods',field:'payment-methods',paths:['/payment-methods','/payment-methods/create','/payment-methods/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.managers'),path:'/managers',field:'managers',paths:['/managers','/managers/create','/manager/:id'],icon:'PaymentsOutlinedIcon'},
        ]},

        {name:t('sidebar.main.companies'),path:'/companies',paths:['/companies','/companies/create'],icon:'CorporateFareIcon',field:'companies'},
        
        {name:t('sidebar.main.userPreferences'),path:'/user-preferences',paths:['/user-preferences'],field:'user-preferences',icon:'TuneIcon'},
       
       ]
    
    const getIconStyle = (fieldName) =>{

           let item=menuItems.filter(i=>i.field==fieldName)[0]

           
          return {
            color: checkActive(item) ? '#fff' : '#737791',
            width: '25px',
            height: '25px',
          }
    }
    

    const iconMapping = {
        GridViewIcon: <GridViewIcon style={getIconStyle('dashboard')} />,
        PaymentsOutlinedIcon: <PaymentsOutlinedIcon style={getIconStyle('payments')} />,
        PeopleAltIcon: <PeopleAltIcon style={getIconStyle('register')} />,
        ChartIcon:<ChartIcon style={getIconStyle('reports')}/>,
        SettingsIcon:<SettingsIcon style={getIconStyle('settings')}/>,
        CorporateFareIcon:<CorporateFareIcon style={getIconStyle('companies')}/>,
        Inventory2OutlinedIcon:<Inventory2OutlinedIcon style={getIconStyle('investments')}/>,
        TuneIcon:  <TuneIcon style={getIconStyle('user-preferences')}/>,
        CurrencyExchangeOutlinedIcon:<PublishedWithChangesOutlinedIcon style={getIconStyle('financial-reconciliation')}/>,
        MonetizationOnOutlinedIcon: <MonetizationOnOutlinedIcon style={getIconStyle('cash-management')} />,
       
    }
  
    return (
    <>
      <div onMouseEnter={()=>{
       if(!float && !_menu.open)  _setMenu({..._menu,float:true})
      }}
     onMouseLeave={()=>{
       if(float)  _setMenu({..._menu,float:false})
     }} className={`bg-[#fff] h-lvh pl-2 pr-4 py-4 ${_menu.open ? 'min-w-[100px]':''} ${float && !_menu.float ? '-translate-x-[100%]':''} transition duration-75 ease-in-out shadow overflow-y-auto ${float && _menu.open? 'hidden':''} ${float ? 'absolute z-10':'relative'} overflow-x-hidden`}>
         <div className="mb-3 flex items-center">
              <div  className="cursor-pointer translate-x-1" onClick={openCloseMenu}><BurgerIcon style={{width:30,height:30}}/></div>
              <div className={`${!_menu.open && !float ? 'hidden' :''}  ml-4 text-[19px] font-bold`}>{user?.company?.name}</div>
          </div>
         
          <div className={`relative ${_menu.open || float ? 'min-w-[180px]' : ''}  `}>
            
            <div className={`${_menu.open && !float ? 'min-w-[150px]':''} absolute flex items-center justify-center flex-col`}>

            {menuItems.map(item=>(
                <div key={item.field} className={`w-full ${!_menu.open ? 'mb-2':''}`}>
                <div onClick={()=>changeOpenDropdown(item.field,item.path)} className={`${checkActive(item) && 'bg-blue-500'} rounded-lg flex p-1 items-center justify-between w-full cursor-pointer`}>
                    <div className="flex items-center">
                        <div className={`rounded-lg flex justify-center ${checkActive(item) && 'bg-blue-500'} p-0.5`}>
                        {iconMapping[item.icon]}
                        </div>
                        <span className={`${!_menu.open && !float ? 'hidden' :''} max-w-[150px] ${checkActive(item) ? 'text-white' : 'text-[#737791]'}  p-1 text-[16px]`}>
                            {item.name}
                        </span>
                    </div>
                    <div className={`${openDropDown.includes(item.field) && 'rotate-180 translate-y-1'}`}>
                        {(item.sub_menus?.length && (_menu.open || float)) && <ExpandMoreOutlinedIcon style={{color:checkActive(item) ? '#fff' :'#000'}}/>}
                    </div>
                </div>
                {item.sub_menus?.length && item.sub_menus.map(i=>(
                    <div key={i.name} className={`items-center p-1 ${_menu.open || float ? 'ml-[35px]' :''}  ${openDropDown.includes(item.field) && (_menu.open || float)  ? 'flex' : 'hidden'}`}>
                    <span onClick={()=>to(i.path)} className={` max-w-[150px] text-[16px] text-[#737791] cursor-pointer hover:opacity-90 ${checkActive(i,true) ? 'text-blue-500' :''}`}>{i.name}</span>
                    </div>
                ))}

                </div>
            ))}


            </div>
          </div>
      </div>
    </>
  )
}

export default App