import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, Outlet , useLocation} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, redirectTo = '/',path}) => {

  const { isAuthenticated, user, login, loading, token,logout } = useAuth();

  
  
  if(redirectTo=="/logout" && token && user){
    logout() 
    toast.remove()
    toast.success('Logout successfuly!')
    return <Navigate to={'/login'} replace />
  }


  if (loading) {
      return <Outlet/>;
  }else if(!user && !loading){
      
      return <Navigate to={'/login'} replace />
  }else{
    
    return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
  }

};

export default ProtectedRoute;



