import { createContext, useContext, useState ,useEffect} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import PouchDB from 'pouchdb';

const DataContext = createContext();

export const DataProvider = ({ children }) => {


  let process={env:{REACT_APP_BASE_URL:'https://server-fms.onrender.com'}}

  const {token,user} = useAuth();

  const db={
    managers:new PouchDB('managers'),
    clients:new PouchDB('clients'),
    suppliers:new PouchDB('suppliers')
    
  }


  const [_managers,setManagers]=useState([])
  const [_clients,setClients]=useState([])
  const [_suppliers,setSuppliers]=useState([])
  const [_loaded,setLoaded]=useState([])

  

  useEffect(()=>{
    (async()=>{
      let dbs=[
        {name:'managers',update:setManagers,db:db.managers},
        {name:'clients',update:setClients,db:db.clients},
        {name:'suppliers',update:setSuppliers,db:db.suppliers}
      ]

      for (let i = 0; i < dbs.length; i++) {
        let docs=await  dbs[i].db.allDocs({ include_docs: true })
        dbs[i].update(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
        handleLoaded('add',dbs[i].name)
      }
      
    })()
  },[])




 function _add(from,array){
        let selected={
            db:from=="manager" ? db.managers : from=="client" ? db.clients : db.suppliers,
        }
        selected.db.put({...array[0]})
 }
 
 async function _update(from,array){
            let selected={
              update:from=="manager" ? setManagers: from=="client" ? setClients :setSuppliers,
              db:from=="manager" ? db.managers : from=="client" ? db.clients : db.suppliers,
           }
           array=array.map(i=>{
            delete i.__v
            return i
           })

          
            let docs=await selected.db.get(array[0]._id)
            selected.db.put({...array[0],_rev:docs._rev})
         
 }

  async function _get(from){
    let selected={
      update:from=="managers" ? setManagers: from=="clients" ? setClients :setSuppliers,
      db:from=="managers" ? db.managers : from=="clients" ? db.clients : db.suppliers,
      remote:from=="managers"? true : false
    }

    let response
   if(selected.remote){
      response = await makeRequest({method:'get',url:`api/users`, error: ``});
      response=response.map(i=>{
        delete i.__v
        return i
      })
      selected.db.bulkDocs(response)
      selected.update(response.reverse())
   }else{
      let docs=await  selected.db.allDocs({ include_docs: true })
      selected.update(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
   }
   
   handleLoaded('add',from)

  }


  function handleLoaded(action,item){
      if(action=='add'){
         setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
      }else{
         setLoaded((prev)=>prev.filter(i=>i!=item))
      }
  }

 async function _delete(selectedItems,from){
       
       let selected={
        update:from=="managers" ? setManagers: from=="clients" ? setClients :setSuppliers,
        db:from=="managers" ? db.managers : from=="clients" ? db.clients : db.suppliers,
          
       }

       let docs=await selected.db.allDocs({ include_docs: true })
       docs=docs.rows.map(i=>i.doc).filter(i=>selectedItems.includes(i._id)).map(i=>{
         return {...i,deleted:true}
       })
       await selected.db.bulkDocs(docs)

       _get(from)
       
  }



  const value = {
    makeRequest,
    _add,
    _get,
    _update,
    _delete,
    _clients,
    _loaded,
    _managers,
    _suppliers
  };


  async function makeRequest(options={data:{},method:'get'},maxRetries = 6, retryDelay = 3000) {
  
    let postData=options.data ? options.data : {}
   
    try {
     let response 
     let headers={
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
     }

     if(options.method=="post") {
          response = await axios.post(`${process.env.REACT_APP_BASE_URL}/`+options.url,postData,{headers}); 
     }else if(options.method=="delete"){
          response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/`+options.url,{headers});
     }else{
          response = await axios.get(`${process.env.REACT_APP_BASE_URL}/`+options.url,{headers});
     }
      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);

      if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay)); 
            return makeRequest(options, maxRetries - 1, retryDelay); 
      } else {
            throw error; 
      }
       
    }
}
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
   return useContext(DataContext);
};