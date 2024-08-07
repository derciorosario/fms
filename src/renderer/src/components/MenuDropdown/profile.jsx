import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import {Lock, Person, SwitchAccountOutlined} from '@mui/icons-material'
import {useLocation,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useData } from '../../contexts/DataContext';
import { t } from 'i18next';


export default function AccountMenu() {
  const {user,logout}=useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const data=useData()
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose = (to) => {

    setAnchorEl(null);
    
    
   if(typeof to=="string") {
      if(to=="/logout"){

        logout()

        return
      }
      if(to=="/lock"){
          to="/login"
          localStorage.setItem('l',true)
      }
    navigate(`${to}`)
   }

  };

  

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="perfil">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {user?.logo?.generated_name ? <>

             <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${data.APP_BASE_URL+"/file/"+user?.logo?.generated_name?.replaceAll(' ','%20')}")`}} className="w-[35px] h-[35px] rounded-full bg-slate-400">
                
             </div>
                    
            </>:<>
            <Avatar sx={{ width: 32, height: 32 }}>
               <Person/>
               <span className="hidden">{user.name.charAt().toUpperCase()}</span>
            </Avatar>
            </>}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={()=>handleClose('/user-preferences')}>
           <ListItemIcon>
           <Person/>
          </ListItemIcon>
           Perfil
        </MenuItem>
        <Divider />
        {/**<MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem> */}



        {!window.electron && <MenuItem onClick={()=>{
             handleClose('/login')
           }}>
          <ListItemIcon>
            <SwitchAccountOutlined/>
          </ListItemIcon>
             {t('common.change-account')}
       </MenuItem>}

         


        <MenuItem onClick={()=>{
            handleClose('/logout')
        }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
           {t('common.logout')}
        </MenuItem>


        
        <MenuItem onClick={()=>{
             handleClose('/lock')
        }}>
          <ListItemIcon>
             <Lock fontSize="small"/>
          </ListItemIcon>
          {t('common.lock')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
