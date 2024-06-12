import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { ButtonBase } from '@mui/material';
import Dropdown from '../MenuDropdown/index'
import DropdownTest from '../MenuDropdown/add'
import DropDownProfile from '../MenuDropdown/profile'
import DropDownLangs from '../MenuDropdown/languages'

import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function App({details}) {
    const {user}=useAuth()
    const [addMenuAnchorEl, setAddMenuAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    
     

    const handleAddMenuClose = (i) => {
         navigate(i.path)
         setAddMenuAnchorEl(()=>false)
    };
     
  return (

     

    <>
       <div className="flex justify-between items-center p-4 h-16 bg-white border-b">
            <div><span className="text-black font-normal text-[18px]">{details && details.name}</span></div>
            <div className="flex items-center">

                <div onClick={(e)=>console.log(e.currentTarget)} className="overflow-hidden relative rounded-full mr-2 cursor-pointer size-9 border border-indigo-500 flex items-center justify-center">
                  
                    <ButtonBase style={{width:'100%',height:'100%',transform:'translateX(59px)'}}><AddIcon style={{ color: '#5D5FEF' }} /></ButtonBase>
               
                    <DropdownTest/>
                    <Dropdown style={{display:'none'}} items={[
                        {name:'Conta a receber',path:'/bills-to-pay'},
                        {name:'Conta a pagar',path:'/payments-to-receive'}
                    ]}

                    

                    handleClose={handleAddMenuClose}
                    anchorEl={addMenuAnchorEl}
                    />
                 </div>
            

                
                <div className="flex h-10 w-80 bg-slate-100 items-center px-2 rounded-lg">
                    <span className="text-white"><SearchIcon style={{ color: '#5D5FEF' }}/></span>
                    <input placeholder="Pesquisar..." type="text" className="outline-none bg-transparent flex-grow px-2 text-indigo-500"/>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex items-center">
                     
                     <div className="mr-6 flex items-center">
                       
                       <DropDownLangs/>
                       
                      
                     </div>
                    <div className="size-10 rounded-l bg-amber-50 justify-center flex items-center relative">
                        <span className="absolute top-1 left-1 size-2 rounded-full bg-[#FFA412]"></span>
                        <NotificationsNoneIcon style={{ color: '#FFA412',width:'60px' }}/>
                    </div>
                    
                    <DropDownProfile/>
                    <div className="flex flex-col pl-2 justify-center">
                         <span className="font-semibold text-lg p-0 m-0 leading-none">{user.name}</span>
                         <span className="p-0 m-0 leading-none">{user.last_name}</span>
                    </div>
                </div>
            </div>
        </div>

    </>
  )
}

export default App