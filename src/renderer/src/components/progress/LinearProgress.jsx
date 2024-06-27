import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import colors from '../../assets/colors.json'

export default function LinearProgressBar() {
  return (
   
     <Box sx={{ width: '100%' }}>
       <LinearProgress sx={{color:colors.app_black[400]}} />
    </Box>
  );
}