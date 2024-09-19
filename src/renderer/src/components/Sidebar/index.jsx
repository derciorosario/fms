import React, { useEffect, useState } from 'react';
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
import colors from '../../assets/colors.json'
import { useTranslation } from 'react-i18next';

function App({float}) {
    const { t } = useTranslation();
    const {user,_change_company}=useAuth()
    const {_setMenu,_menu,_openPopUps,_closeAllPopUps,_showPopUp}=useData()
    const [keepFloat,setKeepFloat]=useState(window.innerWidth <= 1024)

    let {pathname} = useLocation()


  
    useEffect(()=>{

       
        if(keepFloat){
            _setMenu(prev=>({...prev,open:false}))

        }

       
      


    },[keepFloat])

    
    function handleResize(){
        setKeepFloat(window.innerWidth <= 1024)
    }
    
    useEffect(() => {
        window.addEventListener("resize", handleResize);
       /* return () => {
          document.removeEventListener("resize", handleResize);
        };*/
    }, []);


    const navigate = useNavigate();

    function openCloseMenu(){

        _closeAllPopUps()

        if(keepFloat){
              _setMenu({..._menu,float:true})
              return
        }
        _setMenu({..._menu,open:float ? true : !_menu.open})

     

        if(_menu.open){
            localStorage.removeItem('menu_open');
        }else{
            localStorage.setItem('menu_open',true);
        }
        
    }


    function changeOpenDropdown(link,path){
       
       if(_menu.openDropDown.includes(link)){
            _setMenu({..._menu,openDropDown:_menu.openDropDown.filter(i=>i!=link)})
        }else{
            //if(!_menu.open && !float) _setMenu({..._menu,float:true})
            if(!path && !_menu.open){
                _setMenu({..._menu,openDropDown:[..._menu.openDropDown,link],float:true})
           
            }else{
                _setMenu({..._menu,openDropDown:[..._menu.openDropDown,link]})
           
            } 
       } 

       if(path) to(path)
   }

   function to(path){
      navigate(path)
   }

 
   React.useEffect(()=>{

       menuItems.forEach(item=>{
          if(checkActive(item) && !_menu.openDropDown.includes(pathname))  {
             _setMenu((prev)=>({...prev,openDropDown:[...prev.openDropDown,item.field]}))
          }
       })

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
        {name:t('sidebar.main.dashboard'),path:'/dashboard',paths:['/dashboard'],field:'dashboard',icon:'GridViewIcon'},

        {name:t('sidebar.main.accounts'),field:'payments',icon:'PaymentsOutlinedIcon',sub_menus:[
            {name:t('sidebar.accounts.toPay'),path:'/bills-to-pay',paths:['bills-to-pay','bills-to-pay/create','bills-to-pay/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.accounts.toReceive'),path:'/bills-to-receive',paths:['bills-to-receive','bills-to-receive/create','bills-to-receive/:id'],icon:'PaymentsOutlinedIcon'},   
        ]},
        {name:t('sidebar.main.cashManagement'),field:'cash-management',icon:'MonetizationOnOutlinedIcon',sub_menus:[
            {name:t('common.inflows'),path:'/cash-management/inflow/',field:'cash-management/inflow',paths:['/cash-management/inflow','/cash-management/inflow/create','/cash-management/inflow/:id'],icon:'MonetizationOnOutlinedIcon'},
            {name:t('common.outflows'),path:'/cash-management/outflow/',field:'cash-management/outflow',paths:['/cash-management/outflow','/cash-management/outflow/create','/cash-management/outflow/:id'],icon:'MonetizationOnOutlinedIcon'},   
        ]},
        {name:t('sidebar.main.register'),field:'register',icon:'PeopleAltIcon',sub_menus:[
            {name:t('sidebar.register.clients'),path:'/clients',field:'clients',paths:['/clients','/clients/create/','/client/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.register.suppliers'),path:'/suppliers',field:'suppliers',paths:['/suppliers','/suppliers/create/','/supplier/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.register.investors'),path:'/investors',field:'investors',paths:['/investors','/investors/create/','/investor/:id'],icon:'PaymentsOutlinedIcon'},
        ]},

        

        {name:t('sidebar.main.investments'),path:'/investments',paths:['/investments','/investments/create','investments/:id'],field:'investments',icon:'Inventory2OutlinedIcon'},
        {name:t('sidebar.main.loans'),path:'/loans',paths:['/loans','/loans/create','loans/:id'],field:'loans',icon:'PriceChangeOutlinedIcon'},

        /*{name:'Controle de orçamento',paths:['/budget-management','/budget-management/create','/budget-management/reports'],field:'budget-management',icon:'PriceChangeOutlinedIcon',sub_menus:[
            {name:'Orçamentos',path:'/budget-management',field:'budget-management',paths:['/budget-management','budget-management/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Relatórios',path:'/budget-management/reports',field:'budget-management',paths:['/budget-management/reports'],icon:'PaymentsOutlinedIcon'},
        ]},*/
        
        
        {name:t('sidebar.main.finacialReconciliation'),path:'/financial-reconciliation',paths:['/financial-reconciliation'],field:'financial-reconciliation',icon:'CurrencyExchangeOutlinedIcon'},
       
        {name:t('sidebar.main.reports'),field:'reports',icon:'ChartIcon',sub_menus:[
            {name:t('sidebar.reports.accountsAndBalance'),path:'/reports/global',field:'/reports/global',paths:['/reports/global'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.reports.monthlyCashManagement'),path:'/reports/cash-management/monthly',field:'cash-management/monthly',paths:['/reports/cash-management/monthly'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.reports.dailyCashManagement'),path:'/reports/cash-management/daily',field:'cash-management/daily',paths:['/reports/cash-management/daily'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.reports.dre'),path:'/reports/dre',field:'/reports/dre',paths:['/reports/dre','/reports/dre/daily','/reports/dre/monthly'],icon:'PaymentsOutlinedIcon'},
        ]},

        {divide:true, name:t('sidebar.main.settings'),field:'settings',icon:'SettingsIcon',sub_menus:[
           // {name:t('sidebar.settings.accountsPlan'),path:'/account-categories',field:'account-categories',paths:['/account-categories','/account-categories/create','/account-categories/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.accounts'),path:'/accounts',field:'accounts',paths:['/accounts','/accounts/create','/account/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.paymentMethods'),path:'/payment-methods',field:'payment-methods',paths:['/payment-methods','/payment-methods/create','/payment-methods/:id'],icon:'PaymentsOutlinedIcon'},
            {name:t('sidebar.settings.managers'),path:'/managers',field:'managers',paths:['/managers','/managers/create','/manager/:id'],icon:'PaymentsOutlinedIcon'},
           
        ]},

        {name:t('sidebar.main.companies'),path:'/companies',paths:['/companies','/companies/create','/company/:id'],icon:'CorporateFareIcon',field:'companies'},
        
        {name:t('sidebar.main.userPreferences'),path:'/user-preferences',paths:['/user-preferences'],field:'user-preferences',icon:'TuneIcon'},
       
       ]
    
    const getIconStyle = (fieldName) =>{

           let item=menuItems.filter(i=>i.field==fieldName)[0]

           
          return {
            color: checkActive(item) ? colors.app_orange[500] : 'rgb(156 163 175)',
            width: '20px',
            height: '20px',
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
        PriceChangeOutlinedIcon:<PriceChangeOutlinedIcon style={getIconStyle('loans')}/>,
        TuneIcon:  <TuneIcon style={getIconStyle('user-preferences')}/>,
        CurrencyExchangeOutlinedIcon:<PublishedWithChangesOutlinedIcon style={getIconStyle('financial-reconciliation')}/>,
        MonetizationOnOutlinedIcon: <MonetizationOnOutlinedIcon style={getIconStyle('cash-management')} />,
       
    }
    
  

    return (
    <>
      <div

      style={{boxShadow:'rgba(0, 0, 0, 0.1) 0px 10px 30px'}}
      
      onMouseEnter={()=>{
        // if(!float && !_menu.open)  _setMenu({..._menu,float:true})
      }}
     onMouseLeave={()=>{
       if(float)  _setMenu({..._menu,float:false,openDropDown:[]})
     }} className={` bg-app_black-900 h-lvh pl-2 _sidebar py-4 ${_menu.open ? ' min-w-[150px]':'min-w-[48px]'} ${float && !_menu.float ? '-translate-x-[100%]':''} transition duration-75 ease-in-out  overflow-y-auto ${float && _menu.open? 'hidden':''} ${float ? 'absolute z-10':'relative'} overflow-x-hidden`}>
           <div className="mb-8 flex items-center">
              <div  className="cursor-pointer translate-x-1" onClick={openCloseMenu}><BurgerIcon sx={{color:'#ddd'}} style={{width:30,height:30}}/></div>
              
               <div className={`relative ${!_menu.open && !float ? 'hidden' :''}`}>
                    <button onClick={()=>{
                        if(user?.companies_details?.length >=2){
                            if(_openPopUps.menu_companies){
                                _closeAllPopUps()
                            }else{
                                _showPopUp('menu_companies')
                            }
                        }
                    }} id="dropdownDefaultButton"  className={`text-white ${user?.companies_details?.length == 1 ? 'cursor-default':''} truncate bg-transparent  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
                     type="button">
                       {user?.companies_details.filter(i=>i.id==user?.selected_company)?.[0]?.name?.slice(0,50)}{user?.companies_details.filter(i=>i.id==user?.selected_company)?.[0]?.name.length > 50 && '...'} 
                       {user?.companies_details?.length >= 2 && <svg  className={`w-2.5 h-2.5 ms-3 ${_openPopUps.menu_companies ? 'rotate-180':''} transition duration-150 ease-in-out`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>}
                    </button>
                   
                      <div id="dropdown" className={`max-h-[350px] overflow-y-auto ${_openPopUps.menu_companies ? 'z-10 opacity-1' :'opacity-0 translate-y-2 pointer-events-none'} left-[-20px] absolute transition duration-150 ease-in-out max-w-[180px]  bg-white divide-y divide-gray-200 rounded-lg shadow w-44`}>
                       {user.companies_details?.filter(i=>i.id!=user?.selected_company).map((i,_i)=>(
                            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                                    <li onClick={()=>_change_company(i.id)}>
                                        <a className="block px-4 py-2 cursor-pointer hover:text-app_orange-400">{i.name}</a>
                                    </li>
                                </ul>
                            ))}
                        </div>
                    
               </div>


          </div>
         
          <div className={`relative ${_menu.open || float ? 'min-w-[200px]' : ''}  `}>
            
            <div className={`${_menu.open && !float ? 'min-w-[200px]':''} absolute flex items-center justify-center flex-col`}>

            {menuItems.map(item=>(
                <>
              <div key={item.field} className={`w-full ${!_menu.open && !float ? 'mb-2':''}`}>
                <div onClick={()=>changeOpenDropdown(item.field,item.path)} className={`${checkActive(item) && 'bg-app_orange-transparent'} relative  flex py-1 px-2 items-center justify-between w-full cursor-pointer`}>
                    <div className="flex items-center">
                        <div className={`rounded-lg flex justify-center  p-0.5`}>
                        {iconMapping[item.icon]}
                        </div>
                        <span className={`${!_menu.open && !float ? 'hidden' :''} max-w-[150px] ${checkActive(item) ? ' text-app_white-700' : ' text-gray-400'} hover:text-app_white-700  p-1 text-[15px]`}>
                            {item.name}
                        </span>
                        <span className={`flex h-full absolute right-0 top-0 w-1 ${checkActive(item) ?'bg-app_orange-500':''}`}></span>
                    </div>
                    <div className={`${_menu.openDropDown.includes(item.field) && 'rotate-180 translate-y-1'}`}>
                        {(item.sub_menus?.length && (_menu.open || float)) && <ExpandMoreOutlinedIcon style={{color:checkActive(item) ? '#ddd' :'#737791'}}/>}
                    </div>
                </div>
                {item.sub_menus?.length && item.sub_menus.map(i=>(
                    <div key={i.name} className={`items-center p-1 ${_menu.open || float ? 'ml-[35px]' :''}  ${_menu.openDropDown.includes(item.field) && (_menu.open || float)  ? 'flex' : 'hidden'}`}>
                    <span onClick={()=>to(i.path)} className={`hover:text-app_white-700 max-w-[150px] text-[14px] text-[#737791] cursor-pointer hover:opacity-90 ${checkActive(i,true) ? ' text-app_white-700' :''}`}>{i.name}</span>
                    </div>
                ))}

                </div>
                  {item.divide && <div className="w-full bg-gray-500 my-3 h-[1px]"></div>}
                </>
            ))}


            </div>
          </div>
      </div>
    </>
  )
}

export default App