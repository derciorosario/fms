import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';


export default function FadeMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
         <LanguageIcon/>
                      
         <span className="mx-2">Português</span>
        <KeyboardArrowDownIcon/>
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
       {/** <MenuItem onClick={handleClose}>Português</MenuItem> */}
        <MenuItem onClick={handleClose}>English</MenuItem>
        <MenuItem onClick={handleClose}>Español</MenuItem>
        <MenuItem onClick={handleClose}>Français</MenuItem>
        <MenuItem onClick={handleClose}>Deutsch</MenuItem>
        <MenuItem onClick={handleClose}>Italiano</MenuItem>
        <MenuItem onClick={handleClose}>中文 (Chinese)</MenuItem>
        <MenuItem onClick={handleClose}>日本語 (Japanese)</MenuItem>
        <MenuItem onClick={handleClose}>한국어 (Korean)</MenuItem>
        <MenuItem onClick={handleClose}>Русский (Russian)</MenuItem>
        <MenuItem onClick={handleClose}>العربية (Arabic)</MenuItem>

      </Menu>
    </div>
  );
}
