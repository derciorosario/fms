import { createContext, useContext, useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import PouchDB from 'pouchdb';
const AuthContext = createContext();
let env="pro"
export const AuthProvider = ({ children }) => {
  
  let APP_BASE_URL= env=="dev" ? 'http://localhost:4000' :  'https://procontadev.alinvest-group.com' 
  let FRONT_URL=env=="dev" ? 'http://localhost:4000' : 'https://procontadev.alinvest-group.com'
  let COUCH_DB_CONNECTION= env=="dev" ? "http://admin:password@localhost:5000": 'https://admin:secret@procontacouch.derflash.online' //'http://admin:secret@localhost:5984' //'https://admin:secret@procontacouch.derflash.online'
  let [reload,setReload]=useState(false)
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
  const [db_names,setDBNames]=useState({})
  const [goToApp,setGoToApp]=useState(null)


  function hasToGoToApp(){
       if(window.electron) {
          return true
       }
       return Boolean(localStorage.getItem('go_to_app'))
  }

  useEffect(()=>{
      setGoToApp(hasToGoToApp())   
  },[])




  async function  update_user_data_from_db(){

    try {
      let u=new PouchDB('user')
      let {id}=await u.get('user')
      db.user=new PouchDB('user-'+id)
      db.user.createIndex({index: { fields: ['id'] }})
      let user=await  db.user.find({selector: { id }})
      user=user.docs[0]



      if(user){

        setloadingLocalUser(true)
        setLoading(false)
        setUser(user)
        setToken(user.token_value)
        setAuth(true)

      }else{
       
        /*setAuth(false)
        setloadingLocalUser(false)
        setLoading(false)
        window.location.href="/#/login"*/
       

      }
     
     
    } catch (error) {
      console.log(error)
      setloadingLocalUser(false)
    }

  }

  
  useEffect(()=>{
     update_user_data_from_db()
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

         {name:'managers',db_name:'managers-'+user.selected_company}, //+'-user-'+user.companies_details.filter(i=>i.id==user.selected_company)[0].admin_id},
         {name:'bills_to_pay',db_name:'bills_to_pay-'+user.selected_company},
         {name:'account_categories',db_name:'account_categories-'+user.selected_company},
         {name:'bills_to_receive',db_name:'bills_to_receive-'+user.selected_company},
         {name:'payment_methods',db_name:'payment_methods-'+user.selected_company},
         {name:'transations',db_name:'transations-'+user.selected_company},
         {name:'loans',db_name:'loans-'+user.selected_company},
         {name:'investors',db_name:'investors-'+user.selected_company},
         {name:'suppliers',db_name:'suppliers-'+user.selected_company},
         {name:'investments',db_name:'investments-'+user.selected_company},
         {name:'settings',db_name:'settings-'+user.id+'-'+user.selected_company},
         {name:'notifications',db_name:'notifications-'+user.id+'-'+user.selected_company},
         {name:'clients',db_name:'clients-'+user.selected_company},

      ]


      let temp_dbs=['__user-'+user.id]

      temp_dbs=[...temp_dbs,...user.companies.filter(i=>i!=user.selected_company).map(i=>'__managers-'+i)]

      setRemoteDBs([...db_names.map(i=>i.db_name),...temp_dbs])

      let _db={}


      db_names.forEach(i=>{
         _db[i.name]=new PouchDB(i.db_name)
         register_db(i.db_name)
      })
      setDB(_db)    
  }


   async function _change_company(company_id,_user,redirect){

    localStorage.setItem('go_to_app',true)
    setGoToApp(true)

    if(_user){

      _user.selected_company=company_id
       await update_user(_user)

    }else{
      let user_db=new PouchDB('user-'+user.id)
      let _user=await  user_db.find({selector: { id:user.id }})
      _user=_user.docs[0]
      await user_db.put({..._user,selected_company:company_id})
    }


    setChangingCompany(true)
    

    if(redirect){
        if(window.electron){
          setTimeout(()=>setReload(redirect+"&&?rondom="+Math.random().toString()),500)
        }else{
          window.location.href=redirect+"&&?rondom="+Math.random().toString()
          setTimeout(()=>window.location.reload(),500)
        }
    }else{

        if(!window.electron){
          setTimeout(()=>window.location.href="/",500)
        }else{
          setTimeout(()=>setReload('/'),500)
        }
    }

    return
   
  }



   async function startover(_r){
      setLoading(true)
     

      for (let i = 0; i < remoteDBs.length; i++) {
          let d=await  PouchDB(remoteDBs[i])
          await d.destroy()
      }

      let d1=new PouchDB('stored_files')
      let d2=new PouchDB('user')
      await d1.destroy()
      await d2.destroy()
      localStorage.removeItem('token');

      if(_r){
        return
      }else{
        if(window.electron){
          window.electron.ipcRenderer.send('relaunch')
        }else{
          window.location.reload()
        }
      }

  }


const login =  async (userData, authToken) => {
      if(authToken) localStorage.setItem('token', authToken);
      setToken(authToken);
      delete userData.__v
      await  _change_company(userData.selected_company,userData)
      return {ok:true}
}





async function update_user(userData){

  delete userData.__v

  try{

        let u=new PouchDB('user')
        
        let docs=await u.allDocs({ include_docs: true })
        let user=docs.rows.map(i=>i.doc)[0]

        if(user){
         
           //await u.put({id:user.id,_rev:user._rev,_id:user._id})
           await u.put({id: userData.id,_rev:user._rev,_id: user._id})
          
        }else{
           await u.put({_id:'user',id:userData.id})
        }

        let user_db=new PouchDB('user-'+userData.id)
        user_db.createIndex({index: { fields: ['id'] }})
        let _user=await user_db.find({selector: { id:userData.id }})
        _user=_user.docs[0]

        if(_user){
           await user_db.put({...userData,_rev:_user._rev})
           //setUser({...userData,_rev:_user._rev})
        }else{
           await user_db.put(userData)
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


  const logout = async () => {

    await startover()
    localStorage.removeItem('token')
    localStorage.removeItem('go_to_app')

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
    <AuthContext.Provider value={{setReload,reload,goToApp,setGoToApp,startover,update_user_data_from_db,changingCompany,remoteDBs,setRemoteDBs,_change_company,db,APP_BASE_URL,COUCH_DB_CONNECTION,FRONT_URL,user,update_user,setDestroying,destroying,login, logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
