import { createContext, useContext, useState ,useEffect, act} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import PouchDB from 'pouchdb';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import io from 'socket.io-client';
const socket = io('https://proconta.alinvest-group.com');
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import PouchDBFind from 'pouchdb-find';
import toast from 'react-hot-toast';

PouchDB.plugin(PouchDBFind);
const DataContext = createContext();
let DBUpdateID=Math.random()

let app_db=new PouchDB('app')
   
export const DataProvider = ({ children }) => {

    const {user,APP_BASE_URL,remoteDBs,db,FRONT_URL,token,setUser,COUCH_DB_CONNECTION, update_user_data_from_db}=useAuth()

    const [_required_data,_setRequiredData]=useState([])


    

    
    const { t } = useTranslation();

    let initial_filters={
      search: '',
      status: [],
      end_date:'',
      start_date:'',
      bill:'',
      bill_to_pay:'',
      accounts:[],
      bill_to_receive:'',
      email:'',
      invite:'',
      company:'',
      see_bill_transations:'',
      payment_type:[]
    }
    
    const [_filters, setFilters] = useState(initial_filters);

    function _sendFilter(searchParams){


        let params_names=Object.keys(_filters)

        let options={}

        params_names.forEach(p=>{

          if(typeof _filters[p]=="object"){
             options[p]=searchParams.get(p) ? searchParams.get(p).split(',') : []
          }else{
             options[p]=searchParams.get(p) || ''
          }

        })

        setFilters(options);
        return options
        
       
    }


    const _updateFilters = async (newFilters,setSearchParams) => {

      let params_names=Object.keys(_filters)
     
      const updatedFilters = { ..._filters, ...newFilters };

      const queryParams = {};

      params_names.forEach(p=>{
          if(p=="end_date" || p=="start_date"){
            if(typeof updatedFilters[p] == "object"){
               queryParams[p] = updatedFilters[p].toISOString().split('T')[0]
            }
          }else if(typeof _filters[p]=="object"){
              if(updatedFilters[p].length > 0) {
                 queryParams[p] = updatedFilters[p].join(',');
              }
          }else{
              if(updatedFilters[p])  {
                queryParams[p] = updatedFilters[p];
              }
              
          }
      })

      setSearchParams(queryParams);

      return
    };

    const [online,setOnline]=useState(false)
    const [activeReplicationTo,setActiveReplicationTo]=useState([])
    const [activeReplicationFrom,setActiveReplicationFrom]=useState()
    const [ReplicationFromWaitingList,setReplicationFromWaitingList]=useState([])
    const [initSynced,setInitSynced]=useState([])
    const [initSyncStatus,setInitSyncStatus]=useState(null)
    const [startReplicationTo,setStartReplicationTo]=useState(false)
    const [notsUpdater,setNotsUpdater]=useState(uuidv4())
    const [not_seen_nots,setNotSeenNots]=useState(false)
    const [_app,setApp]=useState({})
    

    function _add_to_update_list(db){
         setReplicationFromWaitingList(prev=>([...prev.filter(i=>i!=db),db]))
    }


    useEffect(()=>{


        if(!activeReplicationFrom && ReplicationFromWaitingList.length){
              replicate('from',ReplicationFromWaitingList[0])
              let next=ReplicationFromWaitingList.filter((_,_i)=>_i!=0)
              setReplicationFromWaitingList(next)
              setActiveReplicationFrom(next)
        }

    },[ReplicationFromWaitingList,activeReplicationFrom])


    useEffect(()=>{
      (async()=>{

         let default_app_v1={_id:uuidv4(),id:uuidv4(),v:1,developer:{contact:'258856462304',email:'derciorosario55@gmail.com'}}
      
          let d=await app_db.allDocs({ include_docs: true })
          d=d.rows.map(i=>i.doc)

          if(!d[0]){
               await app_db.put(default_app_v1)
               setApp(default_app_v1)
          }else{
               setApp(d[0])
          }

         
      })()
  },[])



    function replicate(type,dbName,live){

              const localDB = new PouchDB(dbName);
              const remoteDB = new PouchDB(`${COUCH_DB_CONNECTION}/${dbName}`)

              let ref=localDB.replicate[type](remoteDB, {
                live: live ? live : false,
                retry: true,
              }).on('change', (info) => {
               console.log(`Change detected and synced in ${dbName}:`, info);
                dbName.includes('managers-')
                let db=dbName.split('-')[0]
                if(!live){
                    _get(db)
                }
                if(db=="user"){
                  socket.emit('update-database')
                  update_user_data_from_db()
                } 
                
                if(dbName.includes('managers-')){
                  socket.emit('update-database')
                }
              }).on('paused', (err) => {
                console.log(`Replication paused in ${dbName}:`, err);
              }).on('active', () => {
                console.log(`Replication active in ${dbName}`);
              }).on('denied', (err) => {
                console.error(`Replication denied in ${dbName}:`, err);
              }).on('complete', (info) => {
                console.log(`Replication complete in ${dbName}:`, info);
                if(!live){
                  ref.cancel()
                  setActiveReplicationFrom(null)
                }
              }).on('error', (err) => {
              //  console.error(`Replication error in ${dbName}:`, err);
              })
              
    }


    
    useEffect(() => {

      localStorage.removeItem('connect-retries')

      socket.on('db-update',(db)=>{
            _add_to_update_list(db)
      })

      socket.on('remove-company',async(company_id)=>{

    

            let u=new PouchDB('user')
            let docs=await u.allDocs({ include_docs: true })
            let user=docs.rows.map(i=>i.doc)[0]
            let user_db=new PouchDB('user-'+user.id)
            user_db.createIndex({index: { fields: ['id'] }})
            let _user=await user_db.find({selector: { id:user.id }})
            user=_user.docs[0]
           
            let new_user_content={...user,companies:user.companies.filter(i=>i!=company_id),companies_details:[...user.companies_details.filter(i=>i.id!=company_id)]}
            await user_db.put(new_user_content)
            setUser({...new_user_content,_rev:user.rev})

            if(user.selected_company==company_id){
               toast.error('Usuário removido')
               window.location.href="/#/login"
            }
           
      })

      socket.on('update-nots',()=>{
          setNotsUpdater(uuidv4())
      })
     
      socket.on('disconnect', (data) => {
           setOnline(false)
      });
      socket.on('connect', (data) => {
           setOnline(true)
           localStorage.setItem('connect-retries',0)
           socket.emit('update-database')
      });

      socket.on('connect_error', (err) => {

         let connectRetries=localStorage.getItem('connect-retries') || 1

         localStorage.setItem('connect-retries',parseInt(connectRetries) + 1)

         if(parseInt(connectRetries) >= 2)setInitSyncStatus('cancelled')

      });
  
      socket.on('reconnect_failed', () => {
        console.log('Reconnection failed.');
      });

      return () => {
        socket.disconnect();
        socket.off('connect');
        socket.off('connect_error');
        socket.off('reconnect_failed');
      };

    }, []);

    
  

  
  const db_user=new PouchDB('user')
  const [_managers,setManagers]=useState([])
  const [_clients,setClients]=useState([])
  const [_suppliers,setSuppliers]=useState([])
  const [_investors,setInvestors]=useState([])
  const [_notifications,setNotifications]=useState([])
  const [_account_categories,setAccountCategories]=useState([])
  const [_bills_to_pay,setABillsToPay]=useState([])
  const [_bills_to_receive,setABillsToReceive]=useState([])
  const [_accounts,setAccounts]=useState([])
  const [_transations,setTransations]=useState([])
  const [_investments,setInvestments]=useState([])
  const [_loans,setLoans]=useState([])
  const [_payment_methods,setPaymentMethods]=useState([])
  const [_companies,setCompanies]=useState([])
  const [_budget,setBudget]=useState([])
  const [_settings,setSettings]=useState([])
  const [_loading,setLoading]=useState(true)
  const [_loaded,setLoaded]=useState([])
  const [_firstUpdate,setFirstUpdate]=useState(false)
  const [_filtered_content,_setFilteredContent]=useState([])
  const [_all_loaded,setAllLoaded]=useState([])
  const [_all,setAll]=useState({})


  function emitNewUpdateMessage(db){

    socket.emit('db-update',{
       time:new Date().toISOString(),
       db,
       update_id:DBUpdateID,
       company:user.selected_company
    })
  }

  function updateRemote(){
    socket.emit('update-database')
  }
 

  async function _get_all(from){

    let cps=user.companies_details
    let docs=[]
    
    for (let i = 0; i < cps.length; i++) {
       let c=new PouchDB(`${from}-`+cps[i].id)
       let d=await c.allDocs({ include_docs: true })
       d=d.rows.map(i=>i.doc).filter(i=>!i.deleted).map(f=>{
          return {...f,company_id:cps[i].id}
       })
       docs=[...docs,...d]
       setAllLoaded(prev=>([...prev.filter(i=>i!=from),from]))

    }
    
    setAll({..._all,[from]:docs})  
    return docs
  }


  let dbs=[
    {name:'managers',edit_name:'manager',update:setManagers,db:db.managers,get:_managers,n:t('common.dbItems.managers')},
    {name:'clients',edit_name:'client',update:setClients,db:db.clients,get:_clients,n:t('common.dbItems.clients')},
    {name:'suppliers',edit_name:'supplier',update:setSuppliers,db:db.suppliers,get:_suppliers,n:t('common.dbItems.suppliers')},
    {name:'investors',edit_name:'investor',update:setInvestors,db:db.investors,get:_investments,n:t('common.dbItems.investors')},
    {name:'account_categories',edit_name:'accounts',update:setAccountCategories,db:db.account_categories,get:_account_categories,n:t('common.dbItems.accounts')},
    {name:'investments',edit_name:'investment',update:setInvestments,db:db.investments,get:_investments,n:t('common.dbItems.investments')},
    {name:'loans',edit_name:'loan',update:setLoans,db:db.loans,get:_loans,n:t('common.dbItems.loans')},
    {name:'bills_to_pay',edit_name:'bills-to-pay',update:setABillsToPay,db:db.bills_to_pay,get:_bills_to_pay,n:t('common.dbItems.billsToPay')},
    {name:'bills_to_receive',edit_name:'receive',update:setABillsToReceive,db:db.bills_to_receive,get:_bills_to_receive,n:t('common.dbItems.billsToreceive')},
    {name:'accounts',edit_name:'account',update:setAccounts,db:db.accounts,get:_accounts},
    {name:'payment_methods',edit_name:'payment_methods',update:setPaymentMethods,db:db.payment_methods,get:_payment_methods,n:t('common.dbItems.paymentMethods')},
    {name:'transations',edit_name:'transations',update:setTransations,db:db.transations,get:_transations,n:t('common.dbItems.transations')},
    {name:'budget',update:setBudget,db:db.budget,get:_budget},
    {name:'settings',update:setSettings,db:db.settings,get:_settings},
    {name:'notifications',update:setNotifications,db:db.notification,get:_notifications},
  ]



  const _categories=[
    { name: 'Produtos', field: 'products_in', dre: 'inflows', type: 'in', color: 'rgb(0, 128, 0)', total: 0 },  
    { name: 'Serviços', field: 'services_in', dre: 'inflows', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  
    { name: 'Empréstimos ou Financiamentos', field: 'loans_in', dre: 'inflows', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  
    { name: 'Outras receitas', field: 'other-sales-revenue', dre: 'capital', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  
    { name: 'Despesas operacionais', field: 'expenses_out', dre: 'expenses', type: 'out', color: 'rgb(255, 0, 0)', total: 0 },  
    { name: 'Custo de mercadorias vendidas ', field: 'products_out', dre: 'direct-costs', type: 'out', color: 'rgb(220, 20, 60)', total: 0 },  
    { name: 'Custo de serviços prestados', field: 'services_out', dre: 'direct-costs', type: 'out', color: 'rgb(255, 99, 71)', total: 0 }, 
    { name: 'Empréstimos', field: 'loans_out', dre: 'loans', type: 'out', color: 'rgb(128, 0, 0)', total: 0 },  
    { name: 'Investimentos',field: 'investments_out', dre: 'investments', type: 'out', color: 'rgb(255, 215, 0)', total: 0 },  
    { name: 'Outros custos directos', field: 'state_out', dre: 'direct-costs', type: 'out', color: 'rgb(139, 69, 19)', total: 0}  
]
 


function replicateNextDatabase(currentDB){

        if(initSyncStatus=="cancelled") return


        

       
        if(currentDB){
             let next=remoteDBs.findIndex(i=>i==currentDB || i=='__'+currentDB) + 1  
             if(next!=remoteDBs.length){
                 initSync(remoteDBs[next])
             }else{
                 setTimeout(()=>setInitSyncStatus('completed'),1000)
             }
        }else{
           initSync(remoteDBs[0])
        } 
}


function initSync(dbName){


 
  dbName=dbName.startsWith('__') ? dbName.slice(2,dbName.length) : dbName
  
  const localDB = new PouchDB(dbName);
  const remoteDB = new PouchDB(`${COUCH_DB_CONNECTION}/${dbName}`);


  let ref=localDB.sync(remoteDB, {
    live: false,
    retry: true,
  }).on('change', () => {
    //console.log(`Change detected and synced in ${dbName}:`, info);
    let db=dbName.split('-')[0]
    if(_required_data.includes(db)){
      _get(db)
    }
    if(db=="user")  update_user_data_from_db()

    if(dbName.includes('managers-') || dbName.includes('user-')){
        socket.emit('update-database')
    }

  }).on('paused', (err) => {
   // console.log(`Replication paused in ${dbName}:`, err);
  }).on('active', () => {
   //console.log(`Replication active in ${dbName}`);
    ///ref.cancel();
  }).on('denied', (err) => {
    console.error(`Replication denied in ${dbName}:`, err);
  }).on('complete', (info) => {
    //console.log(`Replication complete in ${dbName}:`, info);
    replicateNextDatabase(dbName)
    ref.cancel();
  }).on('error', (err) => {
   // console.error(`Replication error in ${dbName}:`, err);
  })

  setInitSynced(prev=>([...prev,{name:dbName,ref}]))

    
}




useEffect(()=>{
    if(!remoteDBs.length || !online || initSyncStatus) return

     replicateNextDatabase()
     setInitSyncStatus('started')

},[db,online])


const [mainReplicationStarted,setMainReplicationStarted]=useState(false)


useEffect(()=>{

    if(!user || mainReplicationStarted || !(initSyncStatus=="completed" || initSyncStatus=="cancelled")) return 

    replicate('from','user-'+user.id,true)

    setMainReplicationStarted(true)

},[user,initSyncStatus])






useEffect(()=>{


    if(startReplicationTo) return
   
   
    if(initSyncStatus=="completed" || initSyncStatus=="cancelled"){
         
         remoteDBs.forEach(dbName=>{

             //console.log({dbName})

              dbName=dbName.startsWith('__') ? dbName.slice(2,dbName.length) : dbName

              const localDB = new PouchDB(dbName);
              const remoteDB = new PouchDB(`${COUCH_DB_CONNECTION}/${dbName}`)

              let ref=localDB.replicate.to(remoteDB, {
                live: true,
                retry: true,
              }).on('change', () => {
                console.log(`Change - detected and synced in ${dbName}:`, info);

                if(dbName!="user") emitNewUpdateMessage(dbName)
                if(dbName.includes('managers-') || dbName.includes('user-')){
                    socket.emit('update-database')
                }

              }).on('paused', (err) => {
                console.log(`Replication paused in ${dbName}:`, err);
                if(dbName!="user" && err) emitNewUpdateMessage(dbName)
              }).on('active', () => {
               console.log(`Replication active in ${dbName}`);
              }).on('denied', (err) => {
               console.error(`Replication denied in ${dbName}:`, err);
              }).on('complete', (info) => {
                console.log(`Replication complete in ${dbName}:`, info);
              }).on('error', (err) => {
                //console.error(`Replication error in ${dbName}:`, err);
              })

              setActiveReplicationTo(prev=>([...prev,{name:dbName,ref}]))
              
         })
         setStartReplicationTo(true)
    }





    
  
    

},[initSyncStatus])







  
 




   useEffect(()=>{

      if(!user) return


         socket.emit('user-info',{
            email:user.email,
            id:user.id,
            update_id:DBUpdateID,
            companies:user.companies,
            selected_company:user.selected_company
         })


         if(online && (initSyncStatus=="completed" || initSyncStatus=="cancelled")){
              remoteDBs.forEach(dbName=>{
                _add_to_update_list(dbName)
              })
         }


         remove_user(user)
        

   },[user,online])



   async function remove_user(user){

      if(!user) return

      if(!user.companies.includes(user.selected_company) || !user.companies.length){

       // console.log(user.companies,user.selected_company)

        

            if(!user.selected_company) return

            let new_companies=user.companies.filter(i=>i!=user.selected_company)
            let user_db=new PouchDB('user-'+user.id)

            console.log({new_companies})

            if(new_companies.length){

              let new_user_content={...user,companies:new_companies,companies_details:[...user.companies_details.filter(i=>i.id!=user.selected_company)],selected_company:null}
              await user_db.put(new_user_content)
              setUser({...new_user_content,_rev:res.rev})

            }else{
               user_db.destroy()
               setUser(null)
            }

         
          
            toast.error('Usuário removido')
            window.location.href="/#/login"
            window.location.reload()

         
     }

   }


  useEffect(()=>{
   if(_loaded.length || !user) return
    (async()=>{
      _update_all()
    })()
  },[user])


 async function  _change_company(selected_company){
      setLoading(true)
      let user=await db_user.get('user-'+user.id)
      await db_user.put({...user,selected_company,_rev:user._rev})
      setUser({...user,selected_company})
 }


 async function _update_all(){

    setLoading(false)
    return {ok:true}
    
 }


  function _clearData(){

    dbs.filter(i=>i!="categories").forEach(i=>{
        dbs.filter(f=>f.name==i.name)[0].update([])
    })

  }


  const _scrollToSection = (to) => {
    const Section = document.getElementById(to);
    if (Section) {
      Section.scrollIntoView({ behavior: 'smooth' });
    }
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



async function init() {



}


 async function _add(from,array){

        try{
         
          for (let i = 0; i < array.length; i++) {
            await dbs.filter(i=>i.name==from)[0].db.put({...array[i],createdAt:new Date().toISOString(),created_by:user.id,updated_by:user.id,_id:array[i]._id ? array[i]._id : new Date().toISOString()})
          }
          _get(from)

          return {ok:true}

        }catch(e){
             return {ok:false,error:e}
        } 

 }

 const [_openCreatePopUp,_setOpenCreatePopUp]=useState('')
 const [_openDialogRes,_setOpenDialogRes]=useState({item:null,page:null})


function _showCreatePopUp(page,from,details){
    _setOpenCreatePopUp(page)
    _setOpenDialogRes({from,details})
}

 let _initial_form={
    transations:{
      id:uuidv4(),
      type:'',
      description:'',
      deleted:false,
      amount:'',
      createdAt:new Date().toISOString(),
      reference:{id:null,type:'none',name:''},
      transation_account:{id:null,name:''},
      account:{id:null,name:''},
      payments:[{account_id:null,amount:'',name:''}],
      account_origin:'',
      has_fees:false,
      invoice_number:'',
      invoice_emission_date:'',
      files:[],
      fine:'',
      link_payment:false
  },
  bills:{
      id:uuidv4(),
      account_id:'',
      type:'',
      description:'',
      account_origin:'',
      deleted:false,
      installments:[],
      paid:0,
      payday:'',
      total_installments:'',
      invoice_number:'',
      invoice_emission_date:'',
      amount:'',
      payment_origin:'cash',
      reference:{id:null,name:''},
      status:'pending',
      pay_in_installments:false,
      repeat_details:{repeat:false,times:1,period:'month'},
      createdAt:new Date().toISOString(),
      files:[]
  }

 }


 const [_menu, _setMenu] = useState({
     open:Boolean(localStorage.getItem('menu_open')),
     float:false,
     openDropDown:[]
 });

 
 async function _update(from,array){
      let selected=dbs.filter(i=>i.name==from)[0]

      array=array.map(i=>{
        delete i.__v
        return i
      })

      try{
      let docs=await db[selected.name].get(array[0]._id)
      await db[selected.name].put({...array[0],updated_by:user.id,_rev:docs._rev})
      await _get(from)
      return {ok:true}

      }catch(e){
             return {ok:false,error:e}
      }

 }

 function _sort_by_date(data,field,type){
      const parseDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day);
      };

      data.sort((a, b) => {
          const dateA = parseDate(type=='full-string' ? a[field].split('T')[0] : a[field]);
          const dateB = parseDate(type=='full-string' ? b[field].split('T')[0] : b[field]);
          return dateA - dateB;
      })
      return data
 }

  async function _get(from){
    
    let items=typeof from == "string" ? [from] : from

    let _data={}

    for (let f = 0; f < items.length; f++) {
      let selected=dbs.filter(i=>i.name==items[f])[0]

      if(db[selected.name]){
        let docs=await  db[selected.name].allDocs({ include_docs: true })
        docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
        selected.update(docs)
        handleLoaded('add',items[f])
        _data[selected.name]=docs

      }
        
    }

    return _data
   
  }




   const [uploadedToClound,setUploadedToClound]=useState([])
   const [filesToUploadStatus, setFilesToUploadStatus]=useState('not_started')
   const [filesToUploadUpdater, setFilesToUploadUpdater]=useState()
   const [filesToUploadIndexUpdater, setFilesToUploadIndexUpdater]=useState()


    function f_to_upload(clear){
            if(clear){
              localStorage.setItem('files-to-upload',JSON.stringify([]))
            }else{
              return  JSON.parse(localStorage.getItem('files-to-upload') ? localStorage.getItem('files-to-upload') : "[]")
            }
            
    }

    function f_to_upload_current(set){
        if(set!=undefined || set==0){
          localStorage.setItem('files-to-upload-index',set)
          setFilesToUploadIndexUpdater(uuidv4())
          if(set==-1){
            f_to_upload('clear')
            setFilesToUploadStatus('stopped')
          }
        }else{
          return !localStorage.getItem('files-to-upload-index') ? null : parseInt(localStorage.getItem('files-to-upload-index'))
        }
       
    }

    async function search_stored_files(){
      let file_db=new PouchDB('stored_files')
      let docs=await  file_db.allDocs({ include_docs: true })
      docs=docs.rows.map(i=>i.doc)
      console.log({docs})
      setFilesToUploadUpdater(uuidv4())  
      localStorage.setItem('files-to-upload',JSON.stringify([...f_to_upload(),...docs.filter(i=>!i.uploaded)]))
    }

    useEffect(()=>{
           f_to_upload_current(-1)
           search_stored_files()
           f_to_upload('clear')
      
    },[])



  async  function uploadToCloud(file){

        const formData = new FormData();
        let _file=JSON.parse(JSON.stringify(file))
        delete _file.base64
        delete _file.exists
        delete _file.save_doc
        formData.append('file', JSON.stringify(_file));  
        formData.append('base64', file.base64); 
        formData.append('user', localStorage.getItem('__user')); 
        
        
        try{
            let res=await makeRequest({method:'post',url:`api/upload-to-cloud`,data:formData, error: ``},0);

             console.log(res.status)
            if(res.status==200){

              setUploadedToClound(prev=>([...prev,_file.id]))

              
              console.log('uploaded')

              if(file.save_doc){
                let item =  await db[file.from].find({selector: {id:file.from_id}})
                item=item.docs[0]
                await _update(file.from,[{...item,files:[_file]}])
             }

              let file_db=new PouchDB('stored_files')
              let f=await file_db.get(file._id)
              await file_db.remove(f)
  
              if(f_to_upload()[f_to_upload_current() + 1]){
                  f_to_upload_current(f_to_upload_current() + 1)
              }else{
                  f_to_upload_current(-1)
              }

             


            }else if(res.status==409){

              let file_db=new PouchDB('stored_files')
              let f=await file_db.get(file._id)
              await file_db.remove(f)

            }else{
                setTimeout(()=>filesToUploadIndexUpdater,3000)
            }
           

    
        }catch(e){
          if(e.code=="ERR_NETWORK"){
            
          }else{
            if(f_to_upload()[f_to_upload_current() + 1]){
                f_to_upload_current(f_to_upload_current() + 1)
            }else{
                f_to_upload_current(-1)
            } 
          }

          console.log(e)
        }
        
    }

    useEffect(()=>{

      if(!window.electron) return

      window.electron.ipcRenderer.on('read-file',async(event,res)=>{
          
          if(res.exists){
               uploadToCloud(res)
               if(res._id){
                     try{

                      let file_db=new PouchDB('stored_files')
                      let f=await file_db.get(file._id)
                      await file_db.remove(f)

                     }catch(e){}
               }
          }else{

            if(f_to_upload()[f_to_upload_current() + 1]){
                 f_to_upload_current(f_to_upload_current() + 1)
            }else{
                 f_to_upload_current(-1)
            }
            
          }
      })
    },[])


    useEffect(()=>{

    
      if(!f_to_upload().length  || !filesToUploadUpdater || !user || !online || (initSyncStatus!="completed" && initSyncStatus!="cancelled")) return
      localStorage.setItem('__user',JSON.stringify({id:user.id,selected_company:user.selected_company}))


      if(f_to_upload_current()==-1){
           f_to_upload_current(0)
           setFilesToUploadStatus('started')
      }

 
    },[filesToUploadUpdater,user,online,initSyncStatus])


    useEffect(()=>{
      if(filesToUploadStatus!="started" && online){
          search_stored_files()
      }
    },[online])
    


    useEffect(()=>{

      if(f_to_upload_current()==-1  || !filesToUploadIndexUpdater || !window.electron || !f_to_upload().length) return

      window.electron.ipcRenderer.send('read-file',f_to_upload()[f_to_upload_current()])

    },[filesToUploadIndexUpdater])


   



  async function store_uploaded_file_info(file,action){

     if(!file) return

     let file_db=new PouchDB('stored_files')

     if(action!="get"){

      let f=await  file_db.find({selector: { from_id:file.from_id }})
      f=f.docs[0]


      if(f){
        await file_db.put({...f,...file,id:f.id,_rev:f._rev})
        search_stored_files()
      }else{
        await file_db.put({...file,_id:uuidv4()})
        search_stored_files()
      }
        
     }else{
      let f=await  file_db.find({selector: { from_id:file.from_id}})
      return f.docs[0]
    }

    return

  }


 

function _divideDatesInPeriods(startDate, periods, periodType) {
  /**
   * Divide a range of dates into periods.
   *
   * Parameters:
   * - startDate: The starting date as a string in the format 'YYYY-MM-DD'.
   * - periods: The number of periods.
   * - periodType: The period type for division ('week', 'month', 'year').
   *
   * Returns:
   * - An array of arrays where each sub-array contains the start and end date of each period.
   */

  // Helper function to add days to a date
  function addDays(date, days) {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
  }

  // Helper function to add months to a date
  function addMonths(date, months) {
      let result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
  }

  // Helper function to add years to a date
  function addYears(date, years) {
      let result = new Date(date);
      result.setFullYear(result.getFullYear() + years);
      return result;
  }

  // Convert string date to Date object
  let currentStart = new Date(startDate);

  // Initialize the result array
  let periodsArray = [];

  for (let i = 0; i < periods; i++) {
      let currentEnd;

      if (periodType === 'week') {
          currentEnd = addDays(currentStart, 6);
      } else if (periodType === 'month') {
          currentEnd = addMonths(currentStart, 1);
          currentEnd.setDate(currentEnd.getDate() - 1);
      } else if (periodType === 'year') {
          currentEnd = addYears(currentStart, 1);
          currentEnd.setDate(currentEnd.getDate() - 1);
      } else {
          throw new Error("Invalid period type. Choose from 'week', 'month', or 'year'.");
      }

      periodsArray.push([currentStart.toISOString().split('T')[0], currentEnd.toISOString().split('T')[0]]);

      // Move to the next period
      currentStart = addDays(currentEnd, 1);
  }

  return periodsArray;

  /***
   * exemple
    let startDate = '2023-01-01';
    let periods = 12;
    let periodType = 'month';
    let dividedDates = divideDates(startDate, periods, periodType);
    dividedDates.forEach(([start, end]) => {
      console.log(`Start: ${start}, End: ${end}`);
    });
   * 
   */

}


function calculateEndDateWithYears(startDate, yearsToAdd) {
  let date = new Date(startDate);
  date.setFullYear(date.getFullYear() + yearsToAdd);
  return date;
}

function calculateEndDateWithMonths(startDate, monthsToAdd) {
  let date = new Date(startDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
}






function calculateMonthsDifference(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let yearsDifference = end.getFullYear() - start.getFullYear();
  let monthsDifference = end.getMonth() - start.getMonth();
  let totalMonths = (yearsDifference * 12) + monthsDifference;
  return totalMonths;
}


function _calculateInvestmentCost(t,period="m"){
  if(!t.buyday || !t.amount) {
     return {amount:0,end:null}
  }
  let end=calculateEndDateWithYears(t.buyday,parseInt(t.time)) // for month priod calculateEndDateWithMonths(t.buyday,parseInt(t.time))
  let time=t.time // for month priod Math.ceil(parseInt(t.time)/12)
  let devide_with=(parseInt(time) * 12)  //period=='m' ? calculateMonthsDifference(t.buyday.split('T')[0],end.toISOString().split('T')[0]) : daysBetween(t.buyday.split('T')[0],end.toISOString().split('T')[0])
  end.setMonth(end.getMonth() - new Date(t.buyday).getMonth())
  return {amount:parseFloat(t.amount) / devide_with,end}
  
}


function get_stat_data(filterOptions,period){

    let _year=new Date().getFullYear()

    if(filterOptions){

      if(filterOptions.some(i=>i.field=="_year")){
        _year=parseInt(filterOptions.filter(i=>i.field=="_year")[0].groups[0].selected_ids[0])
      }
     
    }

    let p_length=period=="m" ? 12 : 32
    let projected=Array.from({ length: p_length }, () => [])
    let projected_budget=Array.from({ length: p_length }, () => [])
    let done=Array.from({ length: p_length }, () => [])
    let projected_in=Array.from({ length: p_length }, () => [])
    let done_in=Array.from({ length: p_length }, () => [])
    let projected_out=Array.from({ length: p_length }, () => [])
    let done_out=Array.from({ length: p_length }, () => [])
    let amortizations=Array.from({ length: p_length }, () => [])

   _investments.forEach(t=>{

    const {end,amount} = _calculateInvestmentCost(t)
  
    for (let i = 0; i < p_length; i++) { 

       let year=new Date(_today()).getFullYear()
       let first_month=new Date(t.buyday).getMonth()
       let first_year=new Date(t.buyday).getFullYear()

       if((first_year==year && i >= first_month && new Date(_today()) <= end)){
           amortizations[i].push({...t,amount,end})
       }
        
    }

})

  _bills_to_pay.forEach(t=>{
      let month=new Date(t.payday).getMonth()
      let year=new Date(t.createdAt).getFullYear()
      let day=new Date(t.payday).getDate()
      if(year>=_year) projected[period=="m" ? month : day].push({...t,_type:'out',amount:-(t.amount),month,year,day})
      if(year>=_year) projected_out[period=="m" ? month : day].push({...t,_type:'out',amount:-(t.amount),month,year,day})
  })

  _bills_to_receive.forEach(t=>{
      let month=new Date(t.payday).getMonth()
      let year=new Date(t.createdAt).getFullYear()
      let day=new Date(t.payday).getDate()
      if(year>=_year) projected[period=="m" ? month : day].push({...t,_type:'in',month,year,day})
      if(year>=_year) projected_in[period=="m" ? month : day].push({...t,_type:'in',month,year,day})
  })

  _transations.forEach(t=>{
      let month=new Date(t.createdAt).getMonth()
      let year=new Date(t.createdAt).getFullYear()
      let day=new Date(t.createdAt).getDate()
      if(year>=_year) done[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      if(t.type=='in'){
        if(year>=_year)  done_in[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      }else{
        if(year>=_year) done_out[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      }
  })

  _budget.forEach(t=>{
      Array.from({ length: p_length }, () => []).forEach((_,_i)=>{

             let amount=t.items.filter(f=>new Date(f.picker.startDate)[period=="m" ? 'getMonth' : 'getDay']()==_i).map(item => parseFloat(item.value)).reduce((acc, curr) => acc + curr, 0)

             if(amount){
                 projected_budget[_i].push({...t,amount,month:_i,day:_i})
             }
      })
  })


  
let _projected=[]
let _done=[]


 
  let account_origin_in_filters=[]
  let accounts_in_filters=[]
  let isAccountsFilterOn=false

  if(filterOptions){
      if(filterOptions.filter(i=>i.field=="_account_categories")[0]){
         isAccountsFilterOn=filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].selected_ids.length
         accounts_in_filters=filterOptions.filter(i=>i.field=="_account_categories")[0].groups[0].selected_ids
         account_origin_in_filters=_account_categories.filter(i=>accounts_in_filters.includes(i.id)).map(i=>i.account_origin)

      }
     
  }



 
  let category_types_ob={}
  _categories.forEach(e=>category_types_ob[e.field]=[])


  _account_categories.filter(i=>accounts_in_filters.includes(i.id) || !isAccountsFilterOn).forEach(c=>{
          category_types_ob[c.account_origin].push({name:c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=uuidv4()
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].filter(i=>i.account_origin==c.account_origin).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(i=>i.account_origin==c.account_origin).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)

          row['percentage']=!row['done'] && !row['projected']  ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        })})

  })


let transations_types={inflows:[],outflows:[]}

_categories.filter(i=>account_origin_in_filters.includes(i.field) || !isAccountsFilterOn).forEach((c,index)=>{
      let from=c.type == "in" ? 'inflows' :'outflows'
     transations_types[from][index]={...c,name:c.dre_name ? c.dre_name : c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
        let id=uuidv4()
        let row={projected:0,done:0}
        _projected[id]=projected
        _done[id]=done
        row['projected']=_projected[id][_i].filter(i=>i._type==c.type && i.account_origin==c.field).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
        row['done']=_done[id][_i].filter(i=>i.type==c.type && i.account_origin==c.field).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
        row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
        return row
      })}

      if(category_types_ob[c.field].length) transations_types[from][index].sub=category_types_ob[c.field]
      
})

let transations_types_budget={inflows:[],outflows:[]}

_categories.forEach((c,index)=>{
  let from=c.type == "in" ? 'inflows' :'outflows'
  transations_types_budget[from][index]={...c,name:c.dre_name ? c.dre_name : c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let id=uuidv4()
    let row={projected:0,done:0}
    _projected[id]=projected_budget
    _done[id]=done
    row['projected']=_projected[id][_i].filter(i=>i.account_origin==c.field).map(item =>parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>i.type==c.type && i.account_origin==c.field).map(item =>parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    return row
  })}
  //if(category_types_ob[c.field].length) transations_types[from][index].sub=category_types_ob[c.field]
  
})



  //if(filterOptions){

    filterOptions.forEach(f=>{
      let g=f.groups
      let igual=f.igual

      g.filter(g=>{

             if(g.field=='_year'){
                projected.forEach((_,i)=>{
                   projected[i]=projected[i].filter(i=>new Date(i.payday).getFullYear() == parseInt(g.selected_ids[0]))
                })

                done.forEach((_,i)=>{
                  done[i]=done[i].filter(i=>new Date(i.createdAt).getFullYear() == parseInt(g.selected_ids[0]))
               })
             }

             if(g.field=="_account_categories" && g.selected_ids.length){
                done.forEach((_,i)=>{
                    done[i]=done[i].filter(i=>(igual ?  g.selected_ids.includes(i.transation_account.id) : !g.selected_ids.includes(i.transation_account.id)))
                })
                projected.forEach((_,i)=>{
                  projected[i]=projected[i].filter(i=>(igual ?  g.selected_ids.includes(i.account_id) : !g.selected_ids.includes(i.account_id)))
                })
             }

             
             if(g.field=='_month'){
                projected.forEach((_,i)=>{
                  projected[i]=projected[i].filter(i=>i.month == parseInt(g.selected_ids[0]))
                })

                done.forEach((_,i)=>{
                  done[i]=done[i].filter(i=>i.month == parseInt(g.items.findIndex(i=>i.selected)))
              })
             }


            
              
      })


    })


  //}



  return {projected,done,done_in,done_out,projected_in,projected_out,transations_types,amortizations,projected_budget,transations_types_budget}


        
}


function convert_stat_data_to_daily(data,filterOptions){

      if(!data.filter(i=>i.field=='inflow')[0]){
           alert('Ainda em desevolvimento')   
      }
  
      let d=[]
      let inflow=data.filter(i=>i.field=='inflow')[0].items
      let outflow=data.filter(i=>i.field=='outflow')[0].items
      let balance=data.filter(i=>i.field=='balance')[0].items
      Array.from({ length: 31 }, (_,i) => i+1).forEach((i,_i)=>{
          d[_i]={
            day:_i + 1,
            items:[inflow[_i],outflow[_i],
            //{projected:inflow[_i].projected - outflow[_i].projected,done:inflow[_i].done - outflow[_i].done,percentage:0},
            balance[_i]]
          }
      })


    return d
}





  function _get_cash_managment_stats(filterOptions,period){
   
      let labels=period=="m" ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : Array.from({ length: 31 }, (_,i) => i+1)
    
      let {done,projected,transations_types} = get_stat_data(filterOptions,period)

      let p_length=period=="m" ? 12 : 31
     
   
      let _projected=[]
      let _done=[]

   
     let data=[
        {name:'Total de saldo',field:'balance',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['balance']
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        })},


        /*{name:'Saldo do mês anterior',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let month=new Date().getMonth()
          let year=new Date().getFullYear()
          let id=['last_balance']
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].filter(i=>!(i.year==year && i.month>=month)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(i=>!(i.year==year && i.month==month)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 :  (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        })},*/

        {name:'Total de recebimentos',field:'inflow',color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['inflow']
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].filter(i=>i._type=="in").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(i=>i.type=="in").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)

          row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100: !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        }),sub:transations_types.inflows
      },

      {name:'Total de pagamentos',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
        let id=['outflow']
        let row={projected:0,done:0}
        _projected[id]=projected
        _done[id]=done
        row['projected']=_projected[id][_i].filter(i=>i._type=="out").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
        row['done']=_done[id][_i].filter(i=>i.type=="out").map(item =>parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)

        row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
        return row
      }),sub:transations_types.outflows
    },
  ]

  
    let datasets=[
      {
        type: 'line',
        label: 'Saldo',
        data: data.filter(i=>i.field=="balance")[0].items.map(i=>i.done),
        borderColor: 'rgb(59 130 246)',
        backgroundColor: 'rgb(59 130 246)',
        fill: false,
        yAxisID: 'y',
        tension: 0.2, 
        show_in:[1,2]
      },
      {
        type: 'line',
        label: 'Saldo previsto',
        data:data.filter(i=>i.field=="balance")[0].items.map(i=>i.projected),
        borderColor: 'rgb(107 114 128)',
        backgroundColor: 'rgb(107 114 128)',
        fill: false,
        borderDash: [5, 5],
        yAxisID: 'y',
        tension: 0.2, 
        show_in:[1,3]// Optional: for smoother curves
      },
      {
        type: 'bar',
        label: 'Recebimentos',
        data: data.filter(i=>i.field=="inflow")[0].items.map(i=>i.done),
        backgroundColor: '#39d739',
        borderColor: '#39d739',
        borderWidth: 1,
        yAxisID: 'y',
        stack: 'Stack 0',
        show_in:[1,2]
      },
      {
          type: 'bar',
          label: 'Recebimentos previstos',
          data: data.filter(i=>i.field=="inflow")[0].items.map(i=>i.projected),
          backgroundColor: 'rgb(57 215 57 / 50%)',
          borderColor: '#39d739',
          borderWidth: 1,
          yAxisID: 'y',
          stack: 'Stack 0',
          show_in:[1,3]
        },
      {
        type: 'bar',
        label: 'Pagamentos',
        data: data.filter(i=>i.field=="outflow")[0].items.map(i=>i.done),
        backgroundColor: 'crimson',
        borderColor: 'crimson',
        borderWidth: 1,
        yAxisID: 'y',
        stack: 'Stack 1',
        show_in:[1,2]
      },
      {
          type: 'bar',
          label: 'Pagamentos previstos',
          data: data.filter(i=>i.field=="outflow")[0].items.map(i=>i.projected),
          backgroundColor: 'rgb(237 20 61 / 50%)',
          borderColor: 'crimson',
          borderWidth: 1,
          yAxisID: 'y',
          stack: 'Stack 1',
          show_in:[1,3]
        }
    ]

   
    if(filterOptions.some(i=>i.field=="_show_projected")) datasets=datasets.filter(g=>filterOptions.filter(i=>i.field=="_show_projected")[0].groups.some(i=>i.selected_ids.includes(g.show_in[0]) || i.selected_ids.includes(g.show_in[1])))
    
    if(period=='d'){
        data=convert_stat_data_to_daily(data,filterOptions)
    }
    return {data,datasets,labels}    
}
  


function _get_budget_managment_stats(filterOptions,period){
   
  let labels=period=="m" ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : Array.from({ length: 31 }, (_,i) => i+1)

  let {done,projected_budget,transations_types_budget,projected} = get_stat_data(filterOptions,period)

  let p_length=period=="m" ? 12 : 31
 

  let _projected=[]
  let _done=[]


 let data=[

    {name:'Total de saldo',field:'balance',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['balance']
      let row={projected:0,done:0}
      _projected[id]=projected_budget
      _done[id]=done
      row['projected']=_projected[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      return row
    })},


    {name:'Categorias de entrada',field:'inflow',color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['inflow']
      let row={projected:0,done:0}
      _projected[id]=projected_budget
      _done[id]=done
      row['projected']=_projected[id][_i].filter(i=>i.type=="in").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].filter(i=>i.type=="in").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100: !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      return row
    }),sub:transations_types_budget.inflows
  },

  {name:'Categorias de saida',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let id=['outflow']
    let row={projected:0,done:0}
    _projected[id]=projected
    _done[id]=done
    row['projected']=_projected[id][_i].filter(i=>i.type=="out").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>i.type=="out").map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)

    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    return row
  }),sub:transations_types_budget.outflows
},
]


let datasets=[
  {
    type: 'line',
    label: 'Saldo',
    data: data.filter(i=>i.field=="balance")[0].items.map(i=>i.done),
    borderColor: 'rgb(59 130 246)',
    backgroundColor: 'rgb(59 130 246)',
    fill: false,
    yAxisID: 'y',
    tension: 0.2, 
    show_in:[1,2]
  },
  {
    type: 'line',
    label: 'Saldo previsto',
    data:data.filter(i=>i.field=="balance")[0].items.map(i=>i.projected),
    borderColor: 'rgb(107 114 128)',
    backgroundColor: 'rgb(107 114 128)',
    fill: false,
    borderDash: [5, 5],
    yAxisID: 'y',
    tension: 0.2, 
    show_in:[1,3]// Optional: for smoother curves
  },
  {
    type: 'bar',
    label: 'Recebimentos',
    data: data.filter(i=>i.field=="inflow")[0].items.map(i=>i.done),
    backgroundColor: '#39d739',
    borderColor: '#39d739',
    borderWidth: 1,
    yAxisID: 'y',
    stack: 'Stack 0',
    show_in:[1,2]
  },
  {
      type: 'bar',
      label: 'Recebimentos previstos',
      data: data.filter(i=>i.field=="inflow")[0].items.map(i=>i.projected),
      backgroundColor: 'rgb(57 215 57 / 50%)',
      borderColor: '#39d739',
      borderWidth: 1,
      yAxisID: 'y',
      stack: 'Stack 0',
      show_in:[1,3]
    },
  {
    type: 'bar',
    label: 'Pagamentos',
    data: data.filter(i=>i.field=="outflow")[0].items.map(i=>i.done),
    backgroundColor: 'crimson',
    borderColor: 'crimson',
    borderWidth: 1,
    yAxisID: 'y',
    stack: 'Stack 1',
    show_in:[1,2]
  },
  {
      type: 'bar',
      label: 'Pagamentos previstos',
      data: data.filter(i=>i.field=="outflow")[0].items.map(i=>i.projected),
      backgroundColor: 'rgb(237 20 61 / 50%)',
      borderColor: 'crimson',
      borderWidth: 1,
      yAxisID: 'y',
      stack: 'Stack 1',
      show_in:[1,3]
    }
]


if(filterOptions.some(i=>i.field=="_show_projected")) datasets=datasets.filter(g=>filterOptions.filter(i=>i.field=="_show_projected")[0].groups.some(i=>i.selected_ids.includes(g.show_in[0]) || i.selected_ids.includes(g.show_in[1])))

if(period=='d'){
    data=convert_stat_data_to_daily(data,filterOptions)
}
return {data,datasets,labels}    
}


function _get_dre_stats(filterOptions,period){
  let p_length=period=="m" ? 12 : 31
  let {done_in,done_out,projected_in,projected_out,transations_types,amortizations} = get_stat_data(filterOptions,period)
  
  let _projected={}
  let _done={}

  let resuts={}


  let data=[
    { icon:`add`, name:'Receitas',color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['inflows']
      let row={projected:0,done:0}
      _projected[id]=projected_in
      _done[id]=done_in
      row['projected']=_projected[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      
      return row
    }),sub:transations_types.inflows},


    {icon:'remove',name:'Custos directos',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['direct-costs']
      let row={projected:0,done:0}
      _projected[id]=projected_out
      _done[id]=done_out
      row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      resuts[id]
      return row
    }),sub:transations_types.outflows.filter(i=>i.dre=="direct-costs")
  }
,

  
  {icon:'igual',name:'Margem bruta',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let row={projected:0,done:0,percentage:0}
    let projected_inflows=_projected['inflows'][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
    let done_inflows=_done['inflows'][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
    let projected_costs=_projected['direct-costs'][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    let done_costs=_done['direct-costs'][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    let id=['brute-margin']
    
    if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
    if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

    _projected[id][_i]=projected_inflows - (- projected_costs)
    _done[id][_i]=done_inflows - (- done_costs)

    row['projected']=_projected[id][_i]
    row['done']=_done[id][_i]
    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    return row
  })
},

{icon:'remove',name:'Despesas',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['expenses']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=JSON.parse(JSON.stringify(projected_out))
  if(!_done[id]) _done[id]=JSON.parse(JSON.stringify(done_out))
  row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='expenses' && f.field==i.account_origin)).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
  row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='expenses' && f.field==i.account_origin)).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
 }),sub:transations_types.outflows.filter(i=>i.dre=="expenses")
},

{icon:'igual',name:'Fluxo de Caixa Operacional (EBITDA)',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['EBITDA']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
  if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

  _projected[id][_i]=_projected['expenses'][_i]  - (- _projected['brute-margin'][_i]) 
  _done[id][_i]=_done['expenses'][_i] - (- _done['brute-margin'][_i]) 

  row['projected']=_projected[id][_i]
  row['done']=_done[id][_i]
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100

  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
  })
},




{icon:'remove',name:'Depreciações',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['amortizations']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=JSON.parse(JSON.stringify(amortizations))
  if(!_done[id]) _done[id]=JSON.parse(JSON.stringify(amortizations))
  row['projected']=_projected[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
  row['done']=_done[id][_i].map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row

 }),sub:_investments.map(i=>{
        return {name:i.description,field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['amortizations'+i.id]
          let row={projected:0,done:0,percentage:0}
          if(!_projected[id]) _projected[id]=JSON.parse(JSON.stringify(amortizations))
          if(!_done[id]) _done[id]=JSON.parse(JSON.stringify(amortizations))
          row['projected']=_projected[id][_i].filter(f=>f.id==i.id).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(f=>f.id==i.id).map(item => parseFloat(item.amount)).reduce((acc, curr) =>  acc + curr, 0)
          return row

        })}
 })
},


{icon:'igual',name:'Fluxo de Caixa de Investimento  (EBIT)',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['EBIT']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
  if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

  _projected[id][_i]=_projected['EBITDA'][_i]  - (- _projected['amortizations'][_i]) 
  _done[id][_i]=_done['EBITDA'][_i] - (- _done['amortizations'][_i]) 

  row['projected']=_projected[id][_i]
  row['done']=_done[id][_i]
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100

  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
  })

},



{icon:'remove',name:'Juros',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let id=['fees']
    let row={projected:0,done:0,percentage:0}
    if(!_projected[id]) _projected[id]=JSON.parse(JSON.stringify(projected_out))
    if(!_done[id]) _done[id]=JSON.parse(JSON.stringify(done_out))

    row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.field==i.account_origin)).map(item => item.fees ?  parseFloat(item.fees) : 0).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.field==i.account_origin)).map(item =>item.fees ? parseFloat(item.fees) : 0).reduce((acc, curr) =>  acc + curr, 0)
    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    _projected[id][_i]=row['projected']
    _done[id][_i]=row['done']
    return row
  }),sub:transations_types.outflows.filter(i=>i.dre=="loans")
},

{icon:'igual',name:'Fluxo de Caixa de Financiamento (EBT)',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['EBT']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
  if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

  _projected[id][_i]=_projected['EBIT'][_i]  - ( _projected['fees'][_i]) 
  _done[id][_i]=_done['EBIT'][_i] - ( _done['fees'][_i]) 

  row['projected']=_projected[id][_i]
  row['done']=_done[id][_i]
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100

  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
  })

},

{icon:'remove',name:'IRPC',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['IRPC']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
  if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

  _projected[id][_i]=_projected['EBT'][_i] > 0  ? (_projected['EBT'][_i] / 100 ) * 32 : 0  
  _done[id][_i]=_done['EBT'][_i] > 0  ? (_done['EBT'][_i] / 100 ) * 32 : 0 

  

  row['projected']=_projected[id][_i]
  row['done']=_done[id][_i]
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100

  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
  })

},



{icon:'igual',name:'Resultado Líquido',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
  let id=['final']
  let row={projected:0,done:0,percentage:0}
  if(!_projected[id]) _projected[id]=Array.from({ length: p_length }, () => 1)
  if(!_done[id]) _done[id]=Array.from({ length: p_length }, () => 1)

  _projected[id][_i]=_projected['EBT'][_i]  - ( _projected['IRPC'][_i]) 
  _done[id][_i]=_done['EBT'][_i] - ( _done['IRPC'][_i]) 

  row['projected']=_projected[id][_i]
  row['done']=_done[id][_i]
  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100

  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row
})

},



 ]

 
    if(period=='d'){
        data=convert_stat_data_to_daily(data,filterOptions)
    }


   return {data}    
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
       try{
        let docs=await selected.db.allDocs({ include_docs: true })
        docs=docs.rows.map(i=>i.doc).filter(i=>selectedItems.includes(i.id)).map(i=>{
           return {...i,deleted:true}
        })
        await selected.db.bulkDocs(docs)
        _get(from)
        return {ok:true}
        }catch(e){
         return {ok:false,error:e}
        } 
  }


  const daysBetween=(date1,date2,d)=>{

   let milliseconds1
   let milliseconds2
   try{
    milliseconds1 = date1.getTime();
    milliseconds2 = date2.getTime();
   }catch(e){}
   
   const diff = milliseconds2 - milliseconds1;
   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
   return days;
 }

 function _today(){
   return new Date().toISOString().split('T')[0]
 }

 function startAndEndDateOfTheWeek(){
	const currentDate = new Date();
	const currentDayOfWeek = currentDate.getDay();
	const startDate = new Date(currentDate);
	startDate.setDate(startDate.getDate() - currentDayOfWeek);
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + 6);
	return {endDate, startDate}
}



function generate_color() {
  let r = Math.floor(Math.random() * 128) + 128;
  let g = Math.floor(Math.random() * 128) + 128;
  let b = Math.floor(Math.random() * 128) + 128;

  r = Math.floor((r + 255) / 2);
  g = Math.floor((g + 255) / 2);
  b = Math.floor((b + 255) / 2);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}



const _exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};

function exportToExcelArray(data,fileName){
  const wb = XLSX.utils.book_new();
  const wsData = data;
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
}


const [_printData,setPrintData]=useState({data:[],type:null/**array or object */})
const _print = (data,type,from) =>{
       setPrintData({data,type,from})
       setTimeout(()=> window.print(),100)
     
}




function _print_exportExcel(data,type,currentMenu,period,project_only,month,title,from){

  let _d=[]              
  let months=['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].filter((_,_i)=>currentMenu!=1 || _i==month)
  if(period=="m"){
        let header=['Categoria de lançamento']
        let extended_months_to_two_col=[]

        months.forEach((m,_i)=>{
          extended_months_to_two_col.push(m)
          if(project_only==1)  extended_months_to_two_col.push('')
        })
        
        header=[...header,...extended_months_to_two_col]

        _d.push(header)

        let sub_header=[''] 

        
      
        for (let f = 0; f < (currentMenu==1 ? 1 : 12); f++) {
           
            if(project_only==3 || project_only==1) sub_header.push('Previsto')
            if(project_only==2 || project_only==1) sub_header.push('Realizado')
        }

        _d.push(sub_header)
       

       data.forEach((i,_i)=>{
           let row=[]
           row.push(i.name)
           i.items.forEach((f,_i)=>{
             if(currentMenu!=1 || _i==month){
              if(project_only==3 || project_only==1) row.push(f.projected)
              if(project_only==2 || project_only==1) row.push(f.done)
             }
           })
           _d.push(row)

           if(i?.sub){
               i.sub.filter(f=>_account_categories.some(j=>j.account_origin==f.field)).forEach(f=>{
                  let row=[]
                  row.push(`  ${f.name}`)
                  f.items.forEach((j,_i)=>{
                    if(currentMenu!=1 || _i==month){
                      if(project_only==3 || project_only==1) row.push(j.projected)
                      if(project_only==2 || project_only==1) row.push(j.done)
                    }
                  })
                  _d.push(row)

                         if(f.sub){
                            f.sub.forEach(g=>{
                              let row=[]
                              row.push(`    ${g.name}`)
                              g.items.forEach((h,_i)=>{
                                if(currentMenu!=1 || _i==month){
                                  if(project_only==3 || project_only==1) row.push(h.projected)
                                  if(project_only==2 || project_only==1) row.push(h.done)
                                }
                              })
                              _d.push(row)
                            })

                         }

                        


               })
         }

         _d.push([])

       })

  }else if(period=="d"){

        let header=['Dias']
        
      
        
        let sub_header=['']
        for (let f = 0; f < (currentMenu==1 ? 4 : 12); f++) {
          if(project_only==3 || project_only==1) sub_header.push('Previsto')
          if(project_only==2 || project_only==1) sub_header.push('Realizado')
        }

        ['Saidas','Entradas','Resultado','Saldo'].forEach(i=>{
            header.push(i)
            if(project_only==1) header.push('')
        })

        
        _d.push(header)
        _d.push(sub_header)



        _d=[..._d,...data.map(i=>{
          let row=[i.day]
          i.items.forEach((h,_i)=>{
              if(project_only==3 || project_only==1) row.push(h.projected)
              if(project_only==2 || project_only==1) row.push(h.done)
          })
          return row
        })]

  }

  if(type=="excel"){
    _d.unshift([''])
    _d.unshift([title])
    exportToExcelArray(_d,`Relatorio ${period=="m" ? 'mensal' :'diário'} de fluxo de caixa - ${_convertDateToWords(_today(),null,'all')}  ${new Date().getHours()}_${new Date().getMinutes()}`)
  }else{
    _print(currentMenu==0 ? [] : _d,'array',from)
  }  
}




  function _get_stat(name,data){

    try{
          let period=data?.period

          let labels=period=="m" ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : Array.from({ length: 31 }, (_,i) => i+1)


        if(name=="upcomming_payments"){
         let outflows=_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) >=0 && daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) <= 7).filter(i=>i.status!="paid")
         let inflows=_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) >=0 && daysBetween(new Date(_today()),new Date(i.payday.split('T')[0]))  <= 7).filter(i=>i.status!="paid")
          
        
         return {inflows,outflows}

        }


        if(name=="bills_to_pay"){
           let today=_bills_to_pay.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").map(item => (item.type=="out" ? - (item.amount - parseFloat(item.paid ? item.paid : 0)) : (parseFloat(item.amount) - parseFloat(item.paid ? item.paid : 0)))).reduce((acc, curr) => acc + curr, 0)
           let delayed=_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").map(item => (item.type=="out" ? - (item.amount - parseFloat(item.paid ? item.paid : 0)) : (parseFloat(item.amount) - parseFloat(item.paid ? item.paid : 0)))).reduce((acc, curr) => acc + curr, 0)
           return {today,
                   delayed,
                   today_total:_bills_to_pay.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").length,
                   delayed_total:_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").length
                  }
        }

        if(name=="bills_to_receive"){
          let today=_bills_to_receive.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").map(item => (item.type=="out" ? - (parseFloat(item.amount) - parseFloat(item.paid ? item.paid : 0)) : (item.amount - parseFloat(item.paid ? item.paid : 0)))).reduce((acc, curr) => acc + curr, 0)
          let delayed=_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").map(item => (item.type=="out" ? - (parseFloat(item.amount) - parseFloat(item.paid ? item.paid : 0)) : (item.amount - parseFloat(item.paid ? item.paid : 0)))).reduce((acc, curr) => acc + curr, 0)
          return {today,
                  delayed,
                  today_total:_bills_to_receive.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").length,
                  delayed_total:_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").length
          }
       }

       if(name=="monthly_cat_performace"){


         
            let datasets={}
            let total=0
         
            let categories=JSON.parse(JSON.stringify(_categories))
            categories.push({name:'Outros',field:'others',color:'gray',total:0})

            
           /* _bills_to_pay.forEach(t=>{
              let month=new Date(t.payday).getMonth()
              let day=new Date(t.payday).getDate()
              if(!datasets[t.account_origin]) datasets[t.account_origin]=Array.from({ length: (period=="m" ? 12 : 7) }, () => 0)
              let amount=(t.amount)
              if(t.account_origin){
                 datasets[t.account_origin][period=="m" ? month : day]+=amount
              }
              total+=amount
            })

            _bills_to_receive.forEach(t=>{
              let month=new Date(t.payday).getMonth()
              let day=new Date(t.payday).getDate()
              if(!datasets[t.account_origin]) datasets[t.account_origin]=Array.from({ length: (period=="m" ? 12 : 7) }, () => 0)
              let amount=t.amount
              if(t.account_origin){
                 datasets[t.account_origin][period=="m" ? month : day]+=amount
              }
              total+=amount
            })*/


            _transations.forEach(t=>{
              let month=new Date(t.createdAt).getMonth()
              let day=new Date(t.createdAt).getDate()

             
              let ref=t.account_origin
              if(!datasets[ref]) datasets[ref]=Array.from({ length: (period=="m" ? 12 : 7) }, () => 0)
            
              let amount=(t.type=='out' ? t.amount : (t.amount))
              if(t.account_origin){
                 datasets[ref][period=="m" ? month : day]+=amount
              }
              total+=amount
             })

             let _datasets=[]

             Object.keys(datasets).forEach((d,_i)=>{
                let cat=categories.filter(i=>i.field==d)[0]
                let _t=datasets[d].map(item => parseFloat(item)).reduce((acc, curr) => acc + curr, 0)
                categories[categories.findIndex(i=>i.field==d)].total=_t
                _datasets.push({data:datasets[d],label:cat.name,type:'bar',backgroundColor:cat.color,yAxisID: 'y'}) 
            })

           categories=categories.filter(i=>i.total || i.field=='others')

            return {bar:{labels,datasets:_datasets},doughnut:{labels:categories.map(i=>`${i.name}`),datasets:categories.map(i=>i.total),backgroundColor:categories.map(i=>i.color),borderColor:categories.map(()=>'#ddd')}}
           
       }



     


       if(name=="accounts_balance"){

              

             let accounts=_payment_methods.map(i=>({...i,total:0}))

             

             accounts.forEach((a,_i)=>{
                        let initial_amount=a.has_initial_amount ? parseFloat(a.initial_amount) : 0
                        let _in=_transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==a.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                        let _out=_transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==a.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                        let _available=initial_amount + _in - _out
                        accounts[_i]={...accounts[_i],total:_available}
             })


            
             return {labels:accounts.map(i=>`${i.name} (${_cn(i.total)})`),datasets:[{
                data:accounts.map(i=>i.total),
                label:'Saldo',
                type:'bar',
                backgroundColor:'rgb(59 130 246)',yAxisID: 'y'
             }]}


       }


      if(name=="accounts_cat_balance"){
           
            let accounts=_account_categories.map(i=>({...i,total:0,color:generate_color(),type:i.type}))
            accounts.push({total:0,color:'gray',type:'in',name:'Outros',id:'others-in'})
            accounts.push({total:0,color:'gray',type:'out',name:'Outros',id:'others-out'})


            accounts.forEach((a,i)=>{
              let total=_transations.filter(i=>i.transation_account.id==a.id).map(item => i.type=="in" ? parseFloat(item.amount) : (parseFloat(item.amount))).reduce((acc, curr) =>  acc + curr, 0)
              accounts[i].total=total
            })
           
            accounts=accounts.filter(i=>i.total || i.id == "others-out" || i.id=="others-in")


           return {
            in:{labels:accounts.filter(i=>i.type=="in").map(i=>`${i.name} (${_cn(i.total)})`),datasets:accounts.filter(i=>i.type=="in").map(i=>i.total),backgroundColor:accounts.filter(i=>i.type=="in").map(i=>i.color)},
            out:{labels:accounts.filter(i=>i.type=="out").map(i=>`${i.name} (${_cn(i.total)})`),datasets:accounts.filter(i=>i.type=="out").map(i=>i.total),backgroundColor:accounts.filter(i=>i.type=="out").map(i=>i.color)}
          }
        }
          




       




       if(name=="this_week_transations"){

            let inflows_datasets=Array.from({ length: 7 }, () => 0)
            let outflows_datasets=Array.from({ length: 7 }, () => 0)
            let compare_datasets=Array.from({ length: 7 }, () => 0)

            const transactionsThisWeek = _transations.filter(t => {
              let transactionDate=new Date(t.createdAt.split('T')[0])
              let end=new Date(startAndEndDateOfTheWeek().endDate.toISOString().split('T')[0])
              let start=new Date(startAndEndDateOfTheWeek().startDate.toISOString().split('T')[0])
              return transactionDate >= start && transactionDate <= end;
            });

            let inflows_total=transactionsThisWeek.filter(i=>i.type=="in").length
            let outflows_total=transactionsThisWeek.filter(i=>i.type=="out").length
           

          //not tested..
            transactionsThisWeek.forEach(t=>{
              let day=new Date(t.createdAt) 
              day=day.getDay()
              if(t.type=="in") inflows_datasets[day]=t.amount
              if(t.type=="out") outflows_datasets[day]=t.amount
              compare_datasets[day]=t.type=="in" ? t.amount : -(t.amount)
           })


           let inflows=transactionsThisWeek.filter(i=>i.type=="in").map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0)
           let outflows=transactionsThisWeek.filter(i=>i.type=="out").map(item => parseFloat(item.amount)).reduce((acc, curr) => acc + curr, 0)

           return {inflows,outflows,balance:inflows - outflows,compare_datasets,inflows_datasets,outflows_datasets,inflows_total,outflows_total}

         
       }

        }catch(e){
              window.location.reload()
       }
       
  }


  function _cn(number){

   return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number)
     
  }

  function _cn_n(string){


   


    if (string.startsWith('0')) {
      string = string.replace('0', '');
    }
    return string.replace(/[^0-9]/g, '')
  }

  function _cn_op(string,allow_negative) {


    if(string.startsWith('.')){
        return string.slice(1,string.length).replaceAll(' ','')
    }

     //for now (not allow comma)
     string=string.replace(',', '')

     
    const isNegative = string.startsWith('-');
    if (isNegative) {
        string = string.slice(1); 
    }

    if (string.length > 1 && string.replace('-','').startsWith('0') && (string.replace('-','').indexOf('.')!=1 && string.replace('-','').indexOf(',')!=1)) {
        string = string.replace('0', '');
    }

    function cleanString(str, separator) {
        const parts = str.split(separator);
        if (parts.length > 2 || str.startsWith(separator)) {
            return str.slice(0, -1); 
        }
        return parts[0].replace(/[^0-9]/g, '') + (parts[1] !== undefined ? separator + parts[1].replace(/[^0-9]/g, '') : '');
    }

    function removeZeros(string){
        
        if(string){
            if(string.split('').some(i=>i!="0")==false && string.length > 1){
              string="0"
             }
        }
        return string
    }

   
    const hasDot = string.includes('.');
    const hasComma = string.includes(',');
    if (hasDot && hasComma) {
       if (isNegative && allow_negative) {
         string = '-' + string;
       }
       return removeZeros(string.slice(0, -1));
    }
    let cleanedString;
    if (hasDot) {
        cleanedString = cleanString(string, '.');
    } else if (hasComma) {
        cleanedString = cleanString(string, ',');
    } else {
        cleanedString = string.replace(/[^0-9]/g, '');
    }

    if (isNegative && allow_negative) {
        cleanedString = '-' + cleanedString;
    }

    

    return removeZeros(cleanedString) ;
}


/*
  function ___cn_op(string) {

    if (string.length > 1 && string.startsWith('0')) {
      string = string.replace('0', '');
    }
   
    // Function to validate and clean the string
    function cleanString(str, separator) {
        const parts = str.split(separator);
        // If more than one separator or separator at the beginning, return invalid
        if (parts.length > 2 || str.startsWith(separator)) {
            return str.slice(0, -1); // Remove the last character if invalid
        }
        // Remove all characters except digits and the valid separator
        return parts[0].replace(/[^0-9]/g, '') + (parts[1] !== undefined ? separator + parts[1].replace(/[^0-9]/g, '') : '');
    }

    // Determine the valid separator
    const hasDot = string.includes('.');
    const hasComma = string.includes(',');

    // If both separators are present, remove the last character
    if (hasDot && hasComma) {
        return string.slice(0, -1);
    }

   

    // Clean the string based on the existing separator
    if (hasDot) {
        return cleanString(string, '.');
    } else if (hasComma) {
        return cleanString(string, ',');
    } else {
        return string.replace(/[^0-9]/g, '');
    }
}




  function __cn_op(string){
    //old version
     let new_value=string.replaceAll(' ','').replace(/(?!^)[^0-9]/g, '').replace(/^\-?[^0-9]*$/, '$&')
     if(new_value && isNaN(new_value)){
        return new_value.slice(1,new_value.length)
     }
     return new_value  
  }

 

  function __cn_n(string) {
    // Function to validate and clean the string
    function cleanString(str, separator) {
        const parts = str.split(separator);
        // If more than one separator or separator at the beginning, return invalid
        if (parts.length > 2 || str.startsWith(separator)) {
            return str.slice(0, -1); // Remove the last character if invalid
        }
        // Remove all characters except digits and the valid separator
        let integerPart = parts[0].replace(/[^0-9]/g, '');
        if (integerPart.length > 1 && integerPart.startsWith('0')) {
            integerPart = integerPart.replace(/^0+/, ''); // Remove leading zeros entirely
        }
        const decimalPart = parts[1] !== undefined ? parts[1].replace(/[^0-9]/g, '') : '';
        return integerPart + (decimalPart ? separator + decimalPart : '');
    }

    // Determine the valid separator
    const hasDot = string.includes('.');
    const hasComma = string.includes(',');

    // If both separators are present, remove the last character
    if (hasDot && hasComma) {
        return string.slice(0, -1);
    }

    // Clean the string based on the existing separator
    if (hasDot) {
        return cleanString(string, '.');
    } else if (hasComma) {
        return cleanString(string, ',');
    } else {
        let cleanedString = string.replace(/[^0-9]/g, '');
        // Remove leading zeros from the whole number string
        if (cleanedString.length > 1 && cleanedString.startsWith('0')) {
            cleanedString = cleanedString.replace(/^0+/, '');
        }
        return cleanedString;
    }
}
*/

  function _convertDateToWords(dateString,_day,get) {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    

    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month) - 1];

    if(get=="month_and_year"){
      return `${monthName} de ${year}`;
    }
    if(get=="all"){
      return `${day} de ${monthName}, ${year}`;
    }
    return `${_day ? _day : day} de ${monthName}`;
}




function _search(search,array,filterOptions,periodFilters,settings={}){

 

  function search_from_object(object,text){
         text=search
         let add=false
         Object.keys(object).forEach(k=>{
            object[k] = JSON.stringify(object[k])
            if(object[k].toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
                  add=true
            }
         })

         return add
      }

    if (!array) return []

    let d=JSON.parse(JSON.stringify(array))


   if(periodFilters && !settings.disable_time){

    if(periodFilters.startDate){

         let date_by=filterOptions.filter(i=>i.groups.filter(f=>f.field=="date_by")[0])?.[0]?.groups?.[0]?.selected_ids?.[0]

        if(periodFilters.igual){
          d=d.filter(i=>new Date(i[date_by && i[date_by] ? date_by :'createdAt'].split('T')[0]).getTime() >= periodFilters.startDate.getTime())
        }else{
          d=d.filter(i=>new Date(i[date_by && i[date_by] ? date_by :'createdAt'].split('T')[0]).getTime() <= periodFilters.startDate.getTime())
        }


    }

    if(periodFilters.endDate){

         let date_by=filterOptions.filter(i=>i.groups.filter(f=>f.field=="date_by")[0])?.[0]?.groups?.[0]?.selected_ids?.[0]
       
        if(periodFilters.igual){
          d=d.filter(i=>new Date(i[date_by && i[date_by] ? date_by :'createdAt'].split('T')[0]).getTime() <= periodFilters.endDate.getTime())
        }else{
          d=d.filter(i=>new Date(i[date_by && i[date_by] ? date_by :'createdAt'].split('T')[0]).getTime() >= periodFilters.endDate.getTime())
        }
    }
   }



if(filterOptions){



    filterOptions.forEach(f=>{
         
         let g=f.groups
         let igual=f.igual
         g.filter(g=>{

                if(g.field=='transation_type' && g.selected_ids.length){
                   d=d.filter(i=>(igual ?  g.selected_ids.includes(i.type) : !g.selected_ids.includes(i.type)))
                }

                if(g.field=='payment_status' && g.selected_ids.length){
               
                  d=d.filter(i=>(igual ?  g.selected_ids.includes(new Date(_today()) > new Date(i.payday) && i.status!="paid" ? 'delayed' : i.status) : !g.selected_ids.includes(new Date(_today()) > new Date(i.payday) && i.status!="paid" ? 'delayed' : i.status)))
                }


                if(g.field=='_payment_methods' && g.selected_ids.length){
                   d=d.filter(i=>(igual ?  i.payments.some(f=>g.selected_ids.includes(f.account_id)) : !i.payments.some(f=>g.selected_ids.includes(f.account_id))))
                } 
                
                if((g.field=='categories_in' || g.field=='categories_out' ) && g.selected_ids.length){
                    d=d.filter(i=>(igual ?  g.selected_ids.includes(i.account_origin) : !g.selected_ids.includes(i.account_origin)))
                } 

                if(g.field=='_account_categories' && g.selected_ids.length){
                  d=d.filter(i=>(igual ?  g.selected_ids.includes(i.transation_account.id) : !g.selected_ids.includes(i.transation_account.id)))
                }    

         })


    })

  }
  


    let res=[]
    d.forEach((t,_)=>{
      if(search_from_object(t)) {
          res.push(array.filter(j=>t.id.toString().includes(j.id))[0])
      }
    })

    
  


 
    return res.filter(i=>i)

 }


  let initial_popups={
   nots:false,
   search:false,
   not_bill_accounts:false,
   menu_companies:false,
 }

  const [_openPopUps, _setOpenPopUps] = useState(initial_popups);

  function _closeAllPopUps(){
        _setOpenPopUps(initial_popups)
        _setOpenCreatePopUp(null)
  }


  const handleOutsideClick = (event) => {
    
    let close=true
    Object.keys(initial_popups).forEach(f=>{
        if(event?.target?.closest(`._${f}`))  {
          close=false
        }
    })


    if(close){
      document.removeEventListener('click', handleOutsideClick); 
      _closeAllPopUps()
    }

   
  };

  const  _showPopUp = (option) => {
      setTimeout(()=>document.addEventListener('click', handleOutsideClick),100)
      _setOpenPopUps({...initial_popups,[option]:true})
  }


  const value = {
    initSyncStatus,
    initSynced,
    makeRequest,
    _openPopUps,
    _today,
    _showPopUp,
    _closeAllPopUps,
    _openCreatePopUp,
    updateRemote,
    _setOpenCreatePopUp,
    _add,
    setInitSyncStatus,
    _get,
    _update,
    _delete,
    _search,
    _clients,
    _companies,
    _investors,
    _loaded,
    _get_all,
    _all,
    _all_loaded,
    _loans,
    _managers,
    _suppliers,
    _account_categories,
    _bills_to_pay,
    _bills_to_receive,
    _accounts,
    _transations,
    _notifications,
    not_seen_nots,
    setNotSeenNots,
    _sort_by_date,
    _filtered_content,
    _setFilteredContent,
    _menu,
    _setMenu,
    _update_all,
    _change_company,
    _get_cash_managment_stats,
    _get_dre_stats,
    _get_budget_managment_stats,
    _get_stat,
    _categories,
    _payment_methods,
    _investments,
    _filters,
    _print,
    _printData,
    _updateFilters,
    _cn,
    _cn_n,
    _cn_op,
    _budget,
    _setRequiredData,
    _showCreatePopUp,
    _convertDateToWords,
    _scrollToSection,
    _divideDatesInPeriods,
    _sendFilter,
    _clearData,
    _settings,
    _initial_form,
    _loading,
    _openDialogRes,
    FRONT_URL,
    _calculateInvestmentCost,
    deleteAllDocuments,
    APP_BASE_URL,
    notsUpdater,
    _setOpenDialogRes,
    _print_exportExcel,
    _exportToExcel,
    uploadedToClound,
    replicate,
    daysBetween,
    dbs,
    _app,
    _add_to_update_list,
    store_uploaded_file_info,
    online
  };


  async function makeRequest(options={data:{},method:'get'},maxRetries = 6, retryDelay = 3000) {
  
    let postData=options.data ? options.data : {}
   
    try {
     let response 
     let headers={
      'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
     }

     if(options.method=="post") {
          response = await axios.post(`${APP_BASE_URL}/`+options.url,postData,{headers}); 
     }else if(options.method=="delete"){
          response = await axios.delete(`${APP_BASE_URL}/`+options.url,{headers});
     }else{
          response = await axios.get(`${APP_BASE_URL}/`+options.url,{headers});
     }
      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);

      if (maxRetries > 0) {
            if(online) {
              updateRemote()
              console.log('--updating...')
            }
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