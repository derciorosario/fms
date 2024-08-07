import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
export default function CircularIndeterminate({color}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress sx={{color}} />
    </Box>
  );
}