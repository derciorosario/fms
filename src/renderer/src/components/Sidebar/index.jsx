import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BurgerIcon from '@mui/icons-material/Menu'
import {useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
            {name:'A receber',path:'/bills-to-receive',field:'bills-to-receive',paths:['/bills-to-receive','/bills-to-receive/create'],icon:'PaymentsOutlinedIcon'}
        ]},
        {name:'Cadastro',paths:['/register','/clients','/clients/create','/suppliers','/suppliers/create','/managers','/managers/create','/manager/'],field:'register',icon:'PeopleAltIcon',sub_menus:[
            {name:'Clientes',path:'/clients',field:'clients',paths:['/clients','/clients/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Fornecedores',path:'/suppliers',field:'suppliers',paths:['/suppliers','/suppliers/create'],icon:'PaymentsOutlinedIcon'},
            {name:'Gestores',path:'/managers',field:'managers',paths:['/managers','/managers/create','/manager/'],icon:'PaymentsOutlinedIcon'}
        ]}
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
        test: <PeopleAltIcon style={{color:'#737791'}} />,
    }
  
    return (
    <>
      <div className={`bg-[#fff] h-lvh p-4 ${open ? 'min-w-[100px]':''} shadow`}>
          <div className="mb-3 flex items-center">
              <div  className="cursor-pointer hidden translate-x-1" onClick={openCloseMenu}><BurgerIcon style={{width:30,height:30}}/></div>
              <div className={`${!open ? 'hidden' :''}  ml-4 text-[19px] font-bold`}>{user?.company?.name}</div>
          </div>
         
          <div className={`${open ? 'min-w-[150px]':''} flex items-center justify-center flex-col`}>

            {menuItems.map(item=>(
                  <div key={item.field} className="w-full">
                  <div onClick={()=>changeOpenDropdown(item.field,item.path)} className={`${item.paths.includes(pathname) && 'bg-blue-500'} mb-2 rounded-lg flex p-1 items-center justify-between w-full cursor-pointer`}>
                     <div className="flex items-center">
                        <div className={`rounded-lg flex justify-center ${item.paths.includes(pathname) && 'bg-blue-500'} p-0.5`}>
                         {iconMapping[item.icon]}
                        </div>
                        <span className={`${!open ? 'hidden' :''}  ${item.paths.includes(pathname) ? 'text-white' : 'text-[#737791]'}  p-1 text-[17px]`}>
                            {item.name}
                        </span>
                     </div>
                     <div className={`${openDropDown.includes(item.field) && 'rotate-180 translate-y-1'}`}>
                         {(item.sub_menus?.length && open) && <ExpandMoreOutlinedIcon style={{color:item.paths.includes(pathname) ? '#fff' :'#000'}}/>}
                     </div>
                  </div>
                   {item.sub_menus?.length && item.sub_menus.map(i=>(
                     <div key={i.name} className={`items-center p-1 mb-2 ${open ? 'ml-[35px]' :''}  ${(openDropDown.includes(item.field) || item.paths.includes(activePath))  && open ? 'flex' : 'hidden'}`}>
                        <div onClick={()=>to(i.path)} className={ `${open ? 'hidden' :''} cursor-pointer  rounded-lg flex justify-center ${i.paths?.includes(pathname) && 'bg-blue-500'} p-1`}>
                          {iconMapping['test']}
                        </div>
                       <span onClick={()=>to(i.path)} className={`${!open ? 'hidden' :''} text-[16px] text-[#737791] cursor-pointer hover:opacity-90 ${i.paths?.includes(pathname) ? 'text-blue-500' :''}`}>{i.name}</span>
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