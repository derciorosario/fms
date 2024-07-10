import React, { useState } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { useData } from '../contexts/DataContext';
import { Box, CircularProgress } from '@mui/material';
import Search from '../components/PopUps/search';
import CreatePopUp from '../components/PopUps/create';
import PageLoader from '../components/progress/pageLoader';
import Close from '@mui/icons-material/Close';
import PrintTable from '../components/Tables/print';
import { useAuth } from '../contexts/AuthContext';

const DefaultLayout = ({ children , details ,isPopUp,loading,_isLoading}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {changingCompany} = useAuth()

  const {_openPopUps,_loading,_openCreatePopUp,_setOpenCreatePopUp,initSyncStatus} = useData()

  
  if(loading || _loading || changingCompany || (initSyncStatus!="completed" && initSyncStatus!="cancelled")){
     return (

         <PageLoader/>
             
     )
  }

 
  if(isPopUp) {
     return (
        <>
          {children}
        </>
     )
  }
  
  return (
      <>

      <PrintTable/>
     <div>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar float={true}/>

        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div  className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden _dashbord">
              <div className={` justify-end ${!_openCreatePopUp ? 'opacity-0 pointer-events-none' :''} flex items-center h-[100vh] w-full z-10 bg-[rgba(0,0,0,0.7)]  fixed right-0 top-0`}>
                    <div className="flex flex-1 h-full" onClick={()=>_setOpenCreatePopUp('')}></div>
                    <div className={`h-full flex  ${!_openCreatePopUp ? 'translate-x-[10%] opacity-0' :'' } transition duration-300 ease-in-out py-2`}>
                       <CreatePopUp/>
                    </div>
                    <div className="flex absolute top-6 left-6 cursor-pointer hover:opacity-65" onClick={()=>_setOpenCreatePopUp('')}>
                       <div className="mr-2 shadow-sm  bg-app_orange-400 flex items-center justify-center rounded-sm">
                          <Close sx={{color:'#fff'}}/>
                       </div>
                      <span className="text-white">Fechar</span>
                    </div>
                    
              </div>
          <Search show={_openPopUps.search}/>
          {/* <!-- ===== Header Start ===== --> */}
          <Header details={details} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} _isLoading={_isLoading} />
          
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== PagePath Start ===== --> */}

          <div>
               <span></span>
          </div>
          
          {/* <!-- ===== PagePath End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
             
              <div/>
                {children}
              </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
      </>
  );
};

export default DefaultLayout;
