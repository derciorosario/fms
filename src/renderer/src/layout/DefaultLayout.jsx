import React, { useState } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { useData } from '../contexts/DataContext';
import { Box, CircularProgress } from '@mui/material';
import Search from '../components/PopUps/search';
import CreatePopUp from '../components/PopUps/create';
import PageLoader from '../components/progress/pageLoader';

const DefaultLayout = ({ children , details ,isPopUp,loading}) => {
  const [sidebarOpen, setSidebarOpen,_setOpenCreatePopUp,_openCreatePopUp] = useState(false);

  const {_loaded,dbs,_categories,_openPopUps} = useData()


  if(_loaded.length < dbs.length || !_categories.length || loading){
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
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar float={true}/>

        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <div className={` justify-end ${_openCreatePopUp!=null ? 'flex' :'hidden'} items-center h-[100vh] w-full z-10 bg-[rgba(0,0,0,0.2)]  fixed right-0 top-0`}>
                    <div className="flex flex-1" onClick={()=>_setOpenCreatePopUp('')}></div>
                    <div className={`h-full flex  ${!_openCreatePopUp ? 'translate-x-[100%]' :'' } transition duration-150 ease-in-out py-2`}>
                       <CreatePopUp/>
                    </div>
                    
              </div>
          <Search show={_openPopUps.search}/>
          {/* <!-- ===== Header Start ===== --> */}
          <Header details={details} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
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
  );
};

export default DefaultLayout;
