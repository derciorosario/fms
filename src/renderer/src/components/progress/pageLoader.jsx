import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import colors from '../../assets/colors.json'
export default function PageLoader({loading}) {
  return (


    <div className="flex justify-center items-center h-lvh bg-white">
                      <CircularProgress style={{color:colors.app_orange[500]}} />
    </div>
    

  );
}