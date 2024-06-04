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
    suppliers:new PouchDB('suppliers'),
    account_categories:new PouchDB('account_categories'),
    bills_to_pay:new PouchDB('bills_to_pay'),
    bills_to_receive:new PouchDB('bills_to_receive'),
    accounts:new PouchDB('accounts'),
    transations:new PouchDB('transations')
  }

  const [_managers,setManagers]=useState([])
  const [_clients,setClients]=useState([])
  const [_suppliers,setSuppliers]=useState([])
  const [_account_categories,setAccountCategories]=useState([])
  const [_bills_to_pay,setABillsToPay]=useState([])
  const [_bills_to_receive,setABillsToReceive]=useState([])
  const [_accounts,setAccounts]=useState([])
  const [_transations,setTransations]=useState([])
  const [_loaded,setLoaded]=useState([])

  let dbs=[
    {name:'managers',update:setManagers,db:db.managers,remote:true},
    {name:'clients',update:setClients,db:db.clients},
    {name:'suppliers',update:setSuppliers,db:db.suppliers},
    {name:'account_categories',update:setAccountCategories,db:db.account_categories},
    {name:'bills_to_pay',update:setABillsToPay,db:db.bills_to_pay},
    {name:'bills_to_receive',update:setABillsToReceive,db:db.bills_to_receive},
    {name:'accounts',update:setAccounts,db:db.accounts},
    {name:'transations',update:setTransations,db:db.transations}
  ]

  useEffect(()=>{
    (async()=>{
      for (let i = 0; i < dbs.length; i++) {
        let docs=await  dbs[i].db.allDocs({ include_docs: true })
        dbs[i].update(docs.rows.map(i=>i.doc).filter(i=>!i.deleted))
        handleLoaded('add',dbs[i].name)
      }
      init()
    })()
  },[])



  async function init() {

     try{
        //check main-account
       let main_account=await db.accounts.get('main')
       console.log(main_account)
     }catch(e){
         if(e?.status=='404'){
              db.accounts.put({
                id:'main',
                _id:'main',
                name:'Caixa',
                description:'',
                main:true,
                deleted:false
             }) 
         }
     }
  }


 async function _add(from,array){
       await dbs.filter(i=>i.name==from)[0].db.put({...array[0]})
        _get(from)
 }
 
 async function _update(from,array){
      let selected=dbs.filter(i=>i.name==from)[0]
      array=array.map(i=>{
        delete i.__v
        return i
      })
      let docs=await selected.db.get(array[0]._id)
      await selected.db.put({...array[0],_rev:docs._rev})
      _get(from)
 }

  async function _get(from){
    let selected=dbs.filter(i=>i.name==from)[0]

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
       
       let selected=dbs.filter(i=>i.name==from)[0]
       console.log(from,selectedItems)

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
    _suppliers,
    _account_categories,
    _bills_to_pay,
    _bills_to_receive,
    _accounts,
    _transations,
    dbs
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