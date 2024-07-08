import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, Outlet , useLocation} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageLoader from './progress/pageLoader';
 const ProtectedRoute =  ({ children, redirectTo = '/',path}) => {


  localStorage.removeItem('first-company-created-message')
  
  const { isAuthenticated, user, loading, token,logout,destroying} = useAuth();

  if(redirectTo=="reset"){
    return <pageLoader/>;
  }
  
  if(redirectTo=="/logout" && token && user){
    logout() 
    toast.remove()
    return <PageLoader/>;
  }


  if (loading || destroying) {
      return <PageLoader/>;
  }else if(!user && !loading && !destroying){
      return <Navigate to={'/login'} replace />
  }else{
    return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
  }

};

export default ProtectedRoute;



