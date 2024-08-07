import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { ButtonBase, CircularProgress } from '@mui/material';
import Dropdown from '../MenuDropdown/index'
import DropdownTest from '../MenuDropdown/add'
import DropDownProfile from '../MenuDropdown/profile'
import DropDownLangs from '../MenuDropdown/languages'
import NotificationPopUp from '../PopUps/notifications';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Search from '../PopUps/search';
import colors from '../../assets/colors.json'
import { useData } from '../../contexts/DataContext';


function App({details,_isLoading}) {
    const {user}=useAuth() 
    const [addMenuAnchorEl, setAddMenuAnchorEl] = React.useState(null);
    const [openPopUps, setOpenPopUps] = React.useState({
        nots:false,
        search:false
    });
    const navigate = useNavigate();
    const data=useData()

    
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
       <div className="flex justify-between relative items-center px-3 bg-white shadow-sm">
           
            {/*shadow*/}

            <div><span className="text-gray-600 font-semibold text-[18px] max-lg:text-[15px]">{details && details.name}</span></div>
           
           
            <div className="flex items-center hidden">

                
            <div onClick={(e)=>console.log(e.currentTarget)} className="overflow-hidden relative border-app_orange-500 rounded-full mr-2 cursor-pointer size-9 border flex items-center justify-center">
                  
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

              

                
                
            </div>


            <div className="flex items-center justify-center">

              {_isLoading && <div className=" scale-[0.6] mr-4">
                <CircularProgress style={{color:colors.app_orange[500]}} />
              </div>}

             <div onClick={(e)=>console.log(e.currentTarget)} className="overflow-hidden relative mr-2 cursor-pointer size-9 flex items-center justify-center">
                  <div className="max-lg:hidden">
                       
                  <ButtonBase style={{width:'100%',height:'100%',transform:'translateX(59px)'}}><AddIcon style={{ color: colors.app_orange[500] }} /></ButtonBase>
             
                  </div>
                  <DropdownTest/>
                  <Dropdown style={{display:'none'}} items={[
                      {name:'Conta a receber',path:'/bills-to-pay'},
                      {name:'Conta a pagar',path:'/payments-to-receive'}
                  ]}

                  

                  handleClose={handleAddMenuClose}
                  anchorEl={addMenuAnchorEl}
                  />
               </div>

               <span className="border-r flex b-1 h-full"></span>

                <div onClick={()=>data._showPopUp('search')} className="flex h-full _search  items-center px-4 rounded-lg relative cursor-pointer">
                    <span className="text-white"><SearchIcon style={{ color: colors.app_orange[500] }}/></span>
                   
                </div>
                
                <div className="flex items-center h-14">


                <span className="border-r flex b-1 h-full"></span>
                     <div className="flex items-center h-full">
                       
                       <DropDownLangs/>
                       
                      
                     </div>

                    <span className="border-r flex b-1 h-full"></span>
                    <div className="_nots size-10 rounded-l mx-3 justify-center flex items-center md:relative">
                        <div className="cursor-pointer" onClick={()=>handleOpenPopUps('nots')}>

                            {data.not_seen_nots && <span className="absolute top-1 left-1 size-2 rounded-full bg-app_orange-500"></span>}
                            <NotificationsNoneIcon  style={{ color: colors.app_orange[500],width:'60px' }}/>

                        </div>
                        
                        <NotificationPopUp show={openPopUps.nots} setOpenPopUps={setOpenPopUps}/>

                        
                    </div>
                    <span className="border-r flex b-1 h-full"></span>
                    
                    <DropDownProfile/>
                    <div className="flex-col pl-2 justify-center hidden">
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