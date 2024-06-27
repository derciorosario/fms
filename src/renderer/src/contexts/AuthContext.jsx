import axios from 'axios';
import { createContext, useContext, useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
import { useData } from './DataContext';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  
  let process={env:'https://server-fms.onrender.com'}  //https://server-fms.onrender.com
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [loadingLocalUser,setloadingLocalUser]=useState(null)
  const [destroying,setDestroying]=useState(localStorage.getItem('destroying') ? true : false)

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
    user:new PouchDB('user'),
    companies:new PouchDB('companies')
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


  const login =  async (userData, authToken) => {
    
   
    let {name,email,id,token_value,company,last_name,companies}=userData
    



   
  try{
    await deleteAllDocuments(db.companies)
    await deleteAllDocuments(db.user)
    await _add('companies',companies)
    await db.user.put({name,id,email,token_value,last_name,_id:'user',company,companies})
    if(localStorage.getItem('token')) localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
    return {ok:true}
  }catch(e){
    await reset()
    return {ok:false,error:e}
  }
 
};


  


  async function deleteAllDocuments(db) {
    try {
      const allDocs = await db.allDocs({ include_docs: true });
      const docsToDelete = allDocs.rows.map(row => ({
        ...row.doc,
        _deleted: true
      }));
      const result = await db.bulkDocs(docsToDelete);
      console.log('All documents deleted successfully', result);
      return {ok:true}
    } catch (err) {
      console.error('Error deleting all documents', err);
      return {error:err}
    }
  }




  async function deleteDocuments(docIds) {
    try {
      const { rows } = await db.allDocs({ include_docs: true, keys: docIds });
      const docsToDelete = rows
        .filter(row => row.doc)  // Filter out rows without documents
        .map(row => ({ ...row.doc, _deleted: true })); // Mark documents for deletion
  
      const result = await db.bulkDocs(docsToDelete);
      console.log('Documents deleted successfully', result);
    } catch (err) {
      console.error('Error retrieving or deleting documents', err);
    }
  }


  async function reset(){
      let db_names=Object.keys(db).filter(i=>i!="categories")

      try{
        for (let i = 0; i < db_names.length; i++) {
          await deleteAllDocuments(db[db_names[i]])
        }

    
        setTimeout(()=>{
          localStorage.removeItem('destroying')
          localStorage.removeItem('token');
          setDestroying(false)
          setUser(null);
          setToken(null);
          //window.location.href="/login";
        },200)
    }catch(e){
        return {ok:false,error:e}
    }

  }

  useEffect(()=>{
           if(destroying) {
                reset()
           }
  },[destroying])


  const logout =async () => {

    localStorage.setItem('destroying',true)
    setDestroying(true)
    await reset()

  };

  const isAuthenticated = () => {
    return !!token;
  };

  async function _add(from,array){
    try{
     
      for (let i = 0; i < array.length; i++) {
        let d={index_position:i+1,...array[i]}
        delete d.__v
        await db[from].put(d)
      }
      
      return {ok:true}

    }catch(e){
      return {ok:false,error:e}
    } 

  }



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
    <AuthContext.Provider value={{ user,setDestroying,destroying,login, logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
