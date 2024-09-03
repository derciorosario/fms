import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import colors from '../../assets/colors.json'
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { t } from 'i18next';

export default function PageLoader({loading,message}) {
const {initSyncStatus, initSynced,setInitSyncStatus} = useData()
const {db,remoteDBs} = useAuth()
 

return (
    <div className="flex justify-center flex-col items-center relative h-lvh bg-white">
                  
                  {initSyncStatus!="started"
                   ? <CircularProgress style={{color:colors.app_orange[500]}} value={30} />
                   : <CircularProgress variant="determinate" style={{color:colors.app_orange[500]}} value={initSynced.length / remoteDBs.length * 100} /> }

                   {message && <div className="mt-2">
                       <span className="text-gray-500">{message}</span>
                   </div>}
                 <span className={`transition duration-300 ease-in-out mt-4 ${initSyncStatus=="started" ?'opacity-1':'opacity-0'}`}>{t('common.syncing')}...</span>
          <div className={`${initSyncStatus=="started" ?'opacity-1 delay-1000':'opacity-0 delay-0 pointer-events-none'} transition duration-1000 ease-in-out  absolute items-start justify-center bottom-0 py-7`}>
               <span onClick={()=>{
                 setInitSyncStatus('cancelled')
               }} className="text-[13px] text-gray-500 hover:underline cursor-pointer">{t('common.stop-syncing')}</span>
          </div>
                  
    </div>
    

  );
}