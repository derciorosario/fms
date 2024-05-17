import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({loading}) {
  return (

    <>
       {loading ? (
              <div className={`${!loading ? 'hidden':''}`}>
              <Box sx={{ display: 'flex' }}>
              <CircularProgress />
              </Box>
            </div>
       ): (
            <span className="text-l">Sem registros</span>
       )}
    </>
   

  );
}