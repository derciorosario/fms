import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import colors from '../../assets/colors.json'
import { t } from 'i18next';

export default function TransaparentPageLoader({setLoading}) {


return (
    <div className="flex justify-center w-full flex-col fixed left-0 top-0 z-50 items-center  h-[100vh] bg-[rgba(0,0,0,0.4)]">    
                  <CircularProgress style={{color:'#fff'}} value={30} />

                  <div className={`transition hidden duration-1000 ease-in-out  absolute items-start justify-center translate-y-[100px] py-7`}>
                        <span onClick={()=>{
                             setLoading(false)
                        }} className="text-[13px] text-white hover:underline cursor-pointer underline">{t('common.close')}</span>
                 </div>
                  
    </div>
    

  );
}