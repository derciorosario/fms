import { createContext, useContext, useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  let APP_BASE_URL='https://server-fms.onrender.com' //'http://localhost:4000'  //https://server-fms.onrender.com
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [db, setDB] = useState({});
  const [loadingLocalUser,setloadingLocalUser]=useState(null)
  const [destroying,setDestroying]=useState(localStorage.getItem('destroying') ? true : false)
  const [changingCompany,setChangingCompany]=useState(false)
  if(!localStorage.getItem('dbs')) localStorage.setItem('dbs',JSON.stringify([]))
  const [remoteDBs,setRemoteDBs]=useState([])
 



  
  useEffect(()=>{
    (async()=>{

      try {
        let u=new PouchDB('user')
        let {id}=await u.get('user')
        db.user=new PouchDB('user-'+id)
        db.user.createIndex({index: { fields: ['id'] }})
        let user=await  db.user.find({selector: { id }})
        user=user.docs[0]
        setloadingLocalUser(true)
        setLoading(false)
        setUser(user)
        setToken(user.token_value)
        setAuth(true)
       
      } catch (error) {
        console.log(error)
        setloadingLocalUser(false)
      }
    })()
  },[])

  useEffect(()=>{

    if(!user) return

    update_dbs()

  },[user])



  function register_db(name){
     let dbs=JSON.parse(localStorage.getItem('dbs'))
     localStorage.setItem('dbs',JSON.stringify([...dbs.filter(i=>i!=name),name]))
  }
 

  function update_dbs(){

      let db_names=[
         {name:'managers',db_name:'managers-'+user.selected_company},
         {name:'bills_to_pay',db_name:'bills_to_pay-'+user.selected_company},
         {name:'account_categories',db_name:'account_categories-'+user.selected_company},
         {name:'bills_to_receive',db_name:'bills_to_receive-'+user.selected_company},
         {name:'payment_methods',db_name:'payment_methods-'+user.selected_company},
         {name:'transations',db_name:'transations-'+user.selected_company},
         {name:'account_categories',db_name:'account_categories-'+user.selected_company},
         {name:'loans',db_name:'loans-'+user.selected_company},
         {name:'clients',db_name:'clients-'+user.selected_company},
         {name:'investors',db_name:'investors-'+user.selected_company},
         {name:'suppliers',db_name:'suppliers-'+user.selected_company},
         {name:'investments',db_name:'investments-'+user.selected_company},
         {name:'settings',db_name:'settings-'+user.id+'-'+user.selected_company}

      ]

      setRemoteDBs(db_names.map(i=>i.db_name))

      let _db={}
      db_names.forEach(i=>{
         _db[i.name]=new PouchDB(i.db_name)
         register_db(i.db_name)
      })
      setDB(_db)    
  }


   async function _change_company(company_id){
    let user_db=new PouchDB('user-'+user.id)
    await user_db.put({...user,selected_company:company_id})
    setChangingCompany(true)
    setTimeout(()=>window.location.reload(),500)
  }


  const login =  async (userData, authToken) => {

    if(user?.selected_company==userData.selected_company){
      return {ok:true}
    }  

    try{
      await update_user(userData)
      if(localStorage.getItem('token')) localStorage.setItem('token', authToken);
      setUser(userData);
      setToken(authToken);
      return {ok:true}
    }catch(e){
      await reset()
      return {ok:false,error:e}
    }
 
};


async function update_user(userData){

  delete userData.__v

  try{

        let u=new PouchDB('user')
        let docs=await u.allDocs({ include_docs: true })
        let user=docs.rows.map(i=>i.doc)[0]

        if(user){
           u.put({id:user.id,_rev:user._rev,_id:user._id})
        }else{
           u.put({_id:'user',id:userData.id})
        }

        let user_db=new PouchDB('user-'+userData.id)
        user_db.createIndex({index: { fields: ['id'] }})
        let _user=await user_db.find({selector: { id:userData.id }})
        _user=_user.docs[0]

        if(_user){
           user_db.put({...userData,_rev:_user._rev})
        }else{
           user_db.put(userData)
        }

        return


  }catch(e){
     console.log(e)
     return
  }
   
  return
}

  


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
          const response = await fetch(`${APP_BASE_URL}/api/me`, {
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
    <AuthContext.Provider value={{changingCompany,remoteDBs,_change_company,db,APP_BASE_URL,user,update_user,setDestroying,destroying,login, logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
