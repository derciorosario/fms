import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { t } from 'i18next';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (to) => {
    setAnchorEl(null);
     
   if(typeof to=="string")  navigate(`${to}`)

  };
  

  return (
    <div>
      <Button
        sx={{opacity:0}}
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Options
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>handleClose('/bills-to-pay/create')} disableRipple>
        {t('common.dbItems.billsToPay')}
        </MenuItem>
        <MenuItem onClick={()=>handleClose('/bills-to-receive/create')} disableRipple>
        {t('common.dbItems.billsToReceive')}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={()=>handleClose('/cash-management/inflow/create')} disableRipple>
        {t('common.inflow')}
        </MenuItem>
        <MenuItem onClick={()=>handleClose('/cash-management/outflow/create')} disableRipple>
        {t('common.outflow')}
        </MenuItem>
        <MenuItem onClick={()=>handleClose('/account/create')} disableRipple>
        {t('common.account')}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={()=>handleClose('/client/create')} disableRipple>
        {t('common.client')}
        </MenuItem>
        <MenuItem onClick={()=>handleClose('/supplier/create')} disableRipple>
        {t('common.supplier')}
        </MenuItem>
      
      </StyledMenu>
    </div>
  );
}
