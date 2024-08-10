import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, Outlet , useLocation} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageLoader from './progress/pageLoader';
import Home from '../../src/landingpage/pages/home/index'
 const ProtectedRoute =  ({ children, redirectTo = '/',path}) => {

  localStorage.removeItem('first-company-created-message')
  const { goToApp,isAuthenticated, user, loading, token,logout,destroying,reload} = useAuth();

  if(localStorage.getItem('l')){
    return <Navigate to={'/login'} replace />
  }

  if(goToApp==false){
     return <Home/>
  }

  if(redirectTo=="reset" || goToApp==null){
    return <PageLoader/>;
  }
  
  if((redirectTo=="/logout" && token && user) || goToApp==null){
    logout() 
    toast.remove()
    return <PageLoader/>;
  }


  if (loading || destroying) {
      return <PageLoader/>;
  }else if(!user && !loading && !destroying){
      return <Navigate to={'/login'} replace />
  }else {
    return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
  }

};

export default ProtectedRoute;



