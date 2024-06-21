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
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';

function App({details}) {
    const {user}=useAuth()

    let {pathname} = useLocation()
    //const [open,setOpen]=React.useState(() => localStorage.getItem('menu_open'))

    const [open,setOpen]=React.useState(true)
    const [activePath,setActivePath]=React.useState('')
    const [openDropDown, setOpenDropDown] = React.useState([]); 
    const navigate = useNavigate();

    function openCloseMenu(){
        setOpen(!open)
        if (typeof window !== 'undefined') {
            localStorage.setItem('menu_open',!open);
        }
    }


    function changeOpenDropdown(link,path){
        setOpen(true)
       if(openDropDown.includes(link)){
            setOpenDropDown(openDropDown.filter(i=>i!=link))
        }else{
            setOpenDropDown([...openDropDown,link])
       } 

       if(path) to(path)
   }

   function to(path){
      setActivePath(path)
      navigate(path)
   }

 
   React.useEffect(()=>{

       menuItems.forEach(item=>{
          if(item.paths.includes(pathname) && !openDropDown.includes(pathname))  {
             setOpenDropDown([...openDropDown,item.field])
          }
       })

       if(pathname) setActivePath(pathname)

   },[pathname])

   
    let menuItems=[
        {name:'Dashboard',path:'/',paths:['/'],field:'dashboard',icon:'GridViewIcon'},

        {name:'Contas',paths:['/bills-to-pay','/bills-to-receive','/bills-to-receive/create','/bills-to-pay/create'],field:'payments',icon:'PaymentsOutlinedIcon',sub_menus:[
            {name:'A pagar',path:'/bills-to-pay',field:'bills-to-pay',paths:['/bills-to-pay','/bills-to-pay/create'],icon:'PaymentsOutlinedIcon'},
            {name:'A receber',path:'/bills-to-receive',field:'bills-to-receive',paths:['/bills-to-receive','/bills-to-receive/create'],icon:'PaymentsOutlinedIcon'},
       
                    
        ]},
        {name:'Gestão de caixa',paths:['/cash-management/outflow','/cash-management/outflow/create','/cash-management/inflow','/cash-management/inflow/create','/cash-management/account/create','/cash-management/accounts'],field:'cash-management',icon:'MonetizationOnOutlinedIcon',sub_menus:[
            {name:'Entradas',path:'/cash-management/inflow',field:'cash-management/inflow',paths:['/cash-management/inflow','/cash-management/inflow/create'],icon:'MonetizationOnOutlinedIcon'},
            {name:'Saídas',path:'/cash-management/outflow',field:'cash-management/outflow',paths:['/cash-management/outflow','/cash-management/outflow/create'],icon:'MonetizationOnOutlinedIcon'},
              
        ]},
        {name:'Cadastro',paths:['/register','/clients','/clients/create','/suppliers','/suppliers/create','/investors','/investors/create'],field:'register',icon:'PeopleAltIcon',sub_menus:[
            {name:'Clientes',path:'/clients',field:'clients',paths:['/clients','/clients/create/'],icon:'PaymentsOutlinedIcon'},
            {name:'Fornecedores',path:'/suppliers',field:'suppliers',paths:['/suppliers','/suppliers/create/'],icon:'PaymentsOutlinedIcon'},
            {name:'Investidores',path:'/investors',field:'investors',paths:['/investors','/investors/create/'],icon:'PaymentsOutlinedIcon'},
        ]},

        

        {name:'Investimentos',path:'/investments',paths:['/investments','/investments/create'],field:'investments',icon:'Inventory2OutlinedIcon'},

        /*{name:'Controle de orçamento',paths:['/budget-management','/budget-management/create','/budget-management/reports'],field:'budget-management',icon:'PriceChangeOutlinedIcon',sub_menus:[
            {name:'Orçamentos',path:'/budget-management',field:'budget-management',paths:['/budget-management','budget-management/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Relatórios',path:'/budget-management/reports',field:'budget-management',paths:['/budget-management/reports'],icon:'PaymentsOutlinedIcon'},
        ]},*/
        
        {name:'Conciliação financeira',path:'/financial-reconciliation',paths:['/financial-reconciliation'],field:'financial-reconciliation',icon:'CurrencyExchangeOutlinedIcon'},
       
        {name:'Relatórios ',paths:['/reports/dre','/reports/cash-management/monthly','/reports/cash-management/daily','/reports/cash-management/daily','/reports/cash-management','/reports/cash-management/monthly'],field:'reports',icon:'ChartIcon',sub_menus:[
            {name:'Fluxo de caixa mensal',path:'/reports/cash-management/monthly',field:'cash-management/monthly',paths:['/reports/cash-management/monthly'],icon:'PaymentsOutlinedIcon'},
            {name:'Fluxo de caixa Diário',path:'/reports/cash-management/daily',field:'cash-management/daily',paths:['/reports/cash-management/daily'],icon:'PaymentsOutlinedIcon'},
            {name:'Demonstração de resultados',path:'/reports/dre',field:'/reports/dre',paths:['/reports/dre','/reports/dre/daily','/reports/dre/monthly'],icon:'PaymentsOutlinedIcon'},
        ]},

        {name:'Configurações',paths:['/account-categories','/account-categories/create','/managers','/managers/create','/companies/create','/companies','/payment-methods/create','/payment-methods','/accounts/create','/accounts'],field:'settings',icon:'SettingsIcon',sub_menus:[
            {name:'Plano de contas',path:'/account-categories',field:'account-categories',paths:['/account-categories','/account-categories/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Contas',path:'/accounts',field:'accounts',paths:['/accounts','/accounts/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Meios de pagamento',path:'/payment-methods',field:'payment-methods',paths:['/payment-methods','/payment-methods/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Gestores',path:'/managers',field:'managers',paths:['/managers','/managers/create'],icon:'PaymentsOutlinedIcon'},
        ]},

        {name:'Filiais',path:'/companies',paths:['/companies','/companies/create'],icon:'CorporateFareIcon',field:'companies'},
    ]
    
    const getIconStyle = (fieldName) => ({
        color: menuItems.filter(i=>i.field==fieldName)[0].paths.includes(pathname) ? '#fff' : '#737791',
        width: '25px',
        height: '25px',
    });

    const iconMapping = {
        GridViewIcon: <GridViewIcon style={getIconStyle('dashboard')} />,
        PaymentsOutlinedIcon: <PaymentsOutlinedIcon style={getIconStyle('payments')} />,
        PeopleAltIcon: <PeopleAltIcon style={getIconStyle('register')} />,
        ChartIcon:<ChartIcon style={getIconStyle('reports')}/>,
        SettingsIcon:<SettingsIcon style={getIconStyle('settings')}/>,
        CorporateFareIcon:<CorporateFareIcon style={getIconStyle('companies')}/>,
        Inventory2OutlinedIcon:<Inventory2OutlinedIcon style={getIconStyle('investments')}/>,
        /*PriceChangeOutlinedIcon:<PriceChangeOutlinedIcon  style={getIconStyle('budget-management')}/>,*/
        CurrencyExchangeOutlinedIcon:<PublishedWithChangesOutlinedIcon style={getIconStyle('financial-reconciliation')}/>,
        MonetizationOnOutlinedIcon: <MonetizationOnOutlinedIcon style={getIconStyle('cash-management')} />,
       
    }
  
    return (
    <>
      <div className={`bg-[#fff] h-lvh p-4 ${open ? 'min-w-[100px]':''} border-r overflow-y-auto`}>
          <div className="mb-3 flex items-center">
              <div  className="cursor-pointer hidden translate-x-1" onClick={openCloseMenu}><BurgerIcon style={{width:30,height:30}}/></div>
              <div className={`${!open ? 'hidden' :''}  ml-4 text-[19px] font-bold`}>{user?.company?.name}</div>
          </div>
         
          <div className={`${open ? 'min-w-[150px]':''} flex items-center justify-center flex-col`}>

            {menuItems.map(item=>(
                  <div key={item.field} className="w-full">
                  <div onClick={()=>changeOpenDropdown(item.field,item.path)} className={`${item.paths.includes(pathname) && 'bg-blue-500'} rounded-lg flex p-1 items-center justify-between w-full cursor-pointer`}>
                     <div className="flex items-center">
                        <div className={`rounded-lg flex justify-center ${item.paths.includes(pathname) && 'bg-blue-500'} p-0.5`}>
                         {iconMapping[item.icon]}
                        </div>
                        <span className={`${!open ? 'hidden' :''} max-w-[150px]   ${item.paths.includes(pathname) ? 'text-white' : 'text-[#737791]'}  p-1 text-[16px]`}>
                            {item.name}
                        </span>
                     </div>
                     <div className={`${openDropDown.includes(item.field) && 'rotate-180 translate-y-1'}`}>
                         {(item.sub_menus?.length && open) && <ExpandMoreOutlinedIcon style={{color:item.paths.includes(pathname) ? '#fff' :'#000'}}/>}
                     </div>
                  </div>
                   {item.sub_menus?.length && item.sub_menus.map(i=>(
                     <div key={i.name} className={`items-center p-1 ${open ? 'ml-[35px]' :''}  ${(openDropDown.includes(item.field) || item.paths.includes(activePath))  && open ? 'flex' : 'hidden'}`}>
                       <span onClick={()=>to(i.path)} className={`${!open ? 'hidden' :'flex'} max-w-[150px] text-[16px] text-[#737791] cursor-pointer hover:opacity-90 ${i.paths?.includes(pathname) ? 'text-blue-500' :''}`}>{i.name}</span>
                     </div>
                   ))}
                </div>
            ))}


          </div>
      </div>
    </>
  )
}

export default App