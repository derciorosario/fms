import axios from 'axios';
import { createContext, useContext, useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
import { useData } from './DataContext';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  
  let process={env:'http://server-fms.onrender.com'}  //https://server-fms.onrender.com
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [loadingLocalUser,setloadingLocalUser]=useState(null)

  const db={
    managers:new PouchDB('managers'),
    clients:new PouchDB('clients'),
    investors:new PouchDB('investors'),
    suppliers:new PouchDB('suppliers'),
    account_categories:new PouchDB('account_categories'),
    bills_to_pay:new PouchDB('bills_to_pay'),
    bills_to_receive:new PouchDB('bills_to_receive'),
    accounts:new PouchDB('accounts'),
    investments:new PouchDB('investments'),
    transations:new PouchDB('transations'),
    categories:new PouchDB('categories'),
    payment_methods:new PouchDB('payment_methods'),
    budget:new PouchDB('budget'),
    user:new PouchDB('user')
  }
  
  
  
  useEffect(()=>{
    (async()=>{
      try {
        let user=await  db.user.get('user')
        setloadingLocalUser(true)
        setLoading(false)
        setUser(user)
        setToken(user.token_value)
        setAuth(true)
      } catch (error) {
        setloadingLocalUser(false)
      }
    })()

    
  },[])


  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if(localStorage.getItem('token')) localStorage.setItem('token', authToken);
    let {name,email,id,token_value,company,last_name}=userData
    db.user.put({name,id,email,token_value,last_name,_id:'user',company})
  };


  const logout =async () => {
    //setUser(null);
    //setToken(null);
    let user=await  db.user.get('user')
    //db.user.remove(user)
    Object.keys(db).filter(i=>i!='user').forEach((i,_i)=>{
       db[i].destroy()
    })
    //localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!token;
  };


    useEffect(() => {


    //logout()
     
      const fetchUserData = async () => {

        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            login(userData, localStorage.getItem('token'));
            setAuth(true) 
          } else {

            if(response.status=="401"){
                  toast.remove()
                  toast.error('Sessão expirou!')
            }

            if(loadingLocalUser==false)  logout()

          }
        } catch (error) {
             console.error('Error fetching user data:', error);
             if(loadingLocalUser==false) logout()
        } finally {
          setLoading(false);
        }
      };

      if(loadingLocalUser==null || loadingLocalUser==true) {
        return
      }

      if (isAuthenticated && !user && loading && token) {
        fetchUserData();
      } else {
        setLoading(false);
      }
      

     }, [isAuthenticated, user, token,loadingLocalUser]);

   
   

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
