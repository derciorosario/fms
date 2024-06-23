import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { ButtonBase } from '@mui/material';
import Dropdown from '../MenuDropdown/index'
import DropdownTest from '../MenuDropdown/add'
import DropDownProfile from '../MenuDropdown/profile'
import DropDownLangs from '../MenuDropdown/languages'
import NotificationPopUp from '../PopUps/notifications';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Search from '../PopUps/search';


function App({details}) {
    const {user}=useAuth()
    const [addMenuAnchorEl, setAddMenuAnchorEl] = React.useState(null);
    const [openPopUps, setOpenPopUps] = React.useState({
        nots:false,
        search:false
    });
    const navigate = useNavigate();

    const [searchContent,setSearchContent] = React.useState('')

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };


    /***
     * 
     * <h1>{t('dashboard.welcome', { name: userName })}</h1>
     */
    
    const handleOutsideClick = (event) => {
        if (!event?.target?.closest(`._nots`) && !event?.target?.closest(`._search`)) {
            document.removeEventListener('click', handleOutsideClick); 
            setOpenPopUps({nots:false,search:false})
        }
    };
    
    const  handleOpenPopUps = (option) => {
        setTimeout(()=>document.addEventListener('click', handleOutsideClick),100)
        setOpenPopUps({
            nots:false,
            search:false
        ,[option]:true})
    }
    

    const handleAddMenuClose = (i) => {
         navigate(i.path)
         setAddMenuAnchorEl(()=>false)
    };
     
  return (

     

    <>
       <div className="flex justify-between items-center p-4 h-16 bg-white shadow-sm">
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
            

                
                <div className="flex h-10 w-80 bg-slate-100 items-center px-2 rounded-lg relative">
                    <span className="text-white"><SearchIcon style={{ color: '#5D5FEF' }}/></span>
                    <input value={searchContent} onChange={(e)=>{
                        setSearchContent(e.target.value)
                        if(!e.target.value) {
                            handleOutsideClick()
                        }else{
                            handleOpenPopUps('search')
                        }
                    }} onClick={()=>{
                            handleOpenPopUps('search')
                       
                    }} placeholder="Pesquisar..." type="text" className="_search outline-none bg-transparent flex-grow px-2 text-indigo-500"/>
                    <Search setSearchContent={setSearchContent} searchContent={searchContent} show={openPopUps.search} setOpenPopUps={setOpenPopUps}/>

                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex items-center">
                     
                     <div className="mr-6 flex items-center">
                       
                       <DropDownLangs/>
                       
                      
                     </div>
                    <div className="_nots size-10 rounded-l bg-amber-50 justify-center flex items-center relative">
                        <div className="cursor-pointer" onClick={()=>handleOpenPopUps('nots')}>

                            <span className="absolute top-1 left-1 size-2 rounded-full bg-[#FFA412]"></span>
                            <NotificationsNoneIcon  style={{ color: '#FFA412',width:'60px' }}/>

                        </div>
                        
                        <NotificationPopUp show={openPopUps.nots} setOpenPopUps={setOpenPopUps}/>

                        
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