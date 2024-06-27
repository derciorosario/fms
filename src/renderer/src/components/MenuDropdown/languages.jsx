import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import colors from '../../assets/colors.json'


export default function FadeMenu() {
  let langs=['pt','en']
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedLang, setSelectedLang] = React.useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : langs[0]);
  const { t, i18n } = useTranslation();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {

     setAnchorEl(event.currentTarget);

  };
  const handleClose = () => {
     setAnchorEl(null);
  };

  

  React.useEffect(()=>{



  },[])
 
  
  
  const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      setSelectedLang(lng)
      localStorage.setItem('lang',lng)
      handleClose()
  };




  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{color:'#000'}}
      >

         <div className="hidden"> <LanguageIcon sx={{opacity:'.8'}}/></div>
                      
         <span className="mx-2 capitalize text-gray-800">{selectedLang}</span>
        <KeyboardArrowDownIcon sx={{color:'rgb(31 41 55 / 70%)'}}/>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {langs.filter(i=>i!=selectedLang).map((i,_i)=>(
              <MenuItem onClick={()=>changeLanguage(i)}><span className=" capitalize min-w-[60px] flex text-gray-800">{i}</span></MenuItem>
        ))}
        
        {/**<MenuItem onClick={handleClose}>Español</MenuItem>
        <MenuItem onClick={handleClose}>Français</MenuItem>
        <MenuItem onClick={handleClose}>Deutsch</MenuItem>
        <MenuItem onClick={handleClose}>Italiano</MenuItem>
        <MenuItem onClick={handleClose}>中文 (Chinese)</MenuItem>
        <MenuItem onClick={handleClose}>日本語 (Japanese)</MenuItem>
        <MenuItem onClick={handleClose}>한국어 (Korean)</MenuItem>
        <MenuItem onClick={handleClose}>Русский (Russian)</MenuItem>
        <MenuItem onClick={handleClose}>العربية (Arabic)</MenuItem> */}

      </Menu>
    </div>
  );
}
