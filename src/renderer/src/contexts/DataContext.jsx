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
  const [_filtered_content,_setFilteredContent]=useState([])

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

 function _sort_by_date(data,feild,type){
      const parseDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day);
      };

      data.sort((a, b) => {
          const dateA = parseDate(type=='full-string' ? a[feild].split('T')[0] : a[feild]);
          const dateB = parseDate(type=='full-string' ? b[feild].split('T')[0] : b[feild]);
          return dateA - dateB;
      })

      return data
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
      selected.update(_sort_by_date(docs.rows.map(i=>i.doc).filter(i=>!i.deleted),'createdAt','full-string'))
   }
   
    handleLoaded('add',from)

  }


  function _get_cash_managment_stats(filterOptions,period){
   
      let labels=period=="m" ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : Array.from({ length: 31 }, (_,i) => i+1)

      let p_length=period=="m" ? 12 : 31
      let projected=Array.from({ length: p_length }, () => [])
      let done=Array.from({ length: p_length }, () => [])


      _bills_to_pay.forEach(t=>{
          let month=new Date(t.payday).getMonth()
          let year=new Date(t.payday).getFullYear()
          let day=new Date(t.payday).getDate()
          projected[period=="m" ? month : day].push({...t,_type:'out',amount:-(t.amount),month,year,day})
      })

      _bills_to_receive.forEach(t=>{
          let month=new Date(t.payday).getMonth()
          let year=new Date(t.payday).getFullYear()
          let day=new Date(t.payday).getDate()
          projected[period=="m" ? month : day].push({...t,_type:'in',month,year,day})
      })

      _transations.forEach(t=>{
          let month=new Date(t.createdAt).getMonth()
          let year=new Date(t.createdAt).getFullYear()
          let day=new Date(t.createdAt).getDate()
          done[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      })



      if(filterOptions){

        filterOptions.forEach(f=>{
          let g=f.groups
          let igual=f.igual
    
          g.filter(g=>{
    
                 if(g.field=='_year'){
                    projected.forEach((_,i)=>{
                       projected[i]=projected[i].filter(i=>new Date(i.payday).getFullYear() <= parseInt(g.selected_ids[0]))
                    })
    
                    done.forEach((_,i)=>{
                      done[i]=done[i].filter(i=>new Date(i.createdAt).getFullYear() <= parseInt(g.selected_ids[0]))
                   })
                 }
    
    
                 if(g.field=='_accounts' && g.selected_ids.length){
                    done.forEach((_,i)=>{
                        done[i]=done[i].filter(i=>(igual ?  g.selected_ids.includes(i.transation_account.id) : !g.selected_ids.includes(i.transation_account.id)))
                    })
                 }
    
                 
    
                 if(g.field=='_month'){
                    projected.forEach((_,i)=>{
                      projected[i]=projected[i].filter(i=>i.month == parseInt(g.selected_ids[0]))
                    })
    
                    done.forEach((_,i)=>{
                      console.log()
                      done[i]=done[i].filter(i=>i.month == parseInt(g.items.findIndex(i=>i.selected)))
                  })
                 }
                  
          })
    
    
        })


      }


   


      let _projected=[]
      let _done=[]



      //categories
      let sub_categories={client:[],supplier:[],state:[],investments:[],others:[],expenses:[]}
      let categories={
         bills_to_receive:[
          {name:'Clientes',field:'client'},
          {name:'Investimentos',field:'investments'}
        ],
        bills_to_pay:[
          {name:'Fornecedor',field:'supplier'},
          {name:'Estado',field:'state'}
        ]
      }



    

      _account_categories.forEach(c=>{
              sub_categories[c.account_origin].push({name:c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
              let id=Math.random()
              let row={projected:0,done:0}
              _projected[id]=projected
              _done[id]=done
              row['projected']=_projected[id][_i].filter(i=>i.account_origin==c.account_origin).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
              row['done']=_done[id][_i].filter(i=>i.reference.type==c.account_origin).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)


              row['percentage']=!row['done'] && !row['projected']  ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
              return row
            })})

      })


      
      Object.keys(categories).forEach(from=>{
  
        categories[from].forEach(c=>{
            let index=categories[from].findIndex(i=>i.field==c.field)
            categories[from][index]={...c,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
                  let id=Math.random()
                  let row={projected:0,done:0}
                  _projected[id]=projected
                  _done[id]=done
                  row['projected']=_projected[id][_i].filter(i=>i._type=="in" && i.account_origin==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
                  row['done']=_done[id][_i].filter(i=>i.type=="in" && i.reference.type==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      
                  row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
                  return row
                })}

                if(sub_categories[c.field].length) categories[from][index].sub=sub_categories[c.field]


                    
            
        })
    })




   
     let data=[
        {name:'Total de saldo',field:'balance',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['balance']
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        })},


        {name:'Saldo do mês anterior',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
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
        })},

        {name:'Total de recebimentos',field:'inflow',color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['inflow']
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].filter(i=>i._type=="in").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(i=>i.type=="in").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)

          row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100: !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        }),sub:categories.bills_to_receive
      },

      {name:'Total de pagamentos',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
        let id=['outflow']
        let row={projected:0,done:0}
        _projected[id]=projected
        _done[id]=done
        row['projected']=_projected[id][_i].filter(i=>i._type=="out").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
        row['done']=_done[id][_i].filter(i=>i.type=="out").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)

        row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
        return row
      }),sub:categories.bills_to_pay
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

    if(filterOptions) datasets=datasets.filter(g=>filterOptions.filter(i=>i.field=="_show_projected")[0].groups.some(i=>i.selected_ids.includes(g.show_in[0]) || i.selected_ids.includes(g.show_in[1])))


    
     
    if(period=='d'){
        let d=[]
        let inflow=data.filter(i=>i.field=='inflow')[0].items
        let outflow=data.filter(i=>i.field=='outflow')[0].items
        let balance=data.filter(i=>i.field=='balance')[0].items
        Array.from({ length: 31 }, (_,i) => i+1).forEach((i,_i)=>{
            d[_i]={
               day:_i + 1,
               items:[inflow[_i],outflow[_i],{projected:inflow[_i].projected - outflow[_i].projected,done:inflow[_i].done - outflow[_i].done,percentage:0},balance[_i]]
            }
        })

        data=d
    }

    return {data,datasets,labels}    
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


  function _get_stat(name,data){

          let period=data?.period

          let labels=period=="m" ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] : Array.from({ length: 31 }, (_,i) => i+1)

    

        if(name=="upcomming_payments"){
         let outflows=_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) >=0 && daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) <= 7)
         let inflows=_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) >=0 && daysBetween(new Date(_today()),new Date(i.payday.split('T')[0]))  <= 7)
          
        
         return {inflows,outflows}

        }

        if(name=="cash_account_balance"){
             let main_id=_accounts.filter(i=>i.main)[0]?.id
             if(!main_id) return 0
             return  _transations.filter(i=>i.transation_account.id==main_id).map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0)
   
        }

        if(name=="bills_to_pay"){
           let today=_bills_to_pay.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0)
           let delayed=_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0)
           return {today,
                   delayed,
                   today_total:_bills_to_pay.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").length,
                   delayed_total:_bills_to_pay.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").length
                  }
        }

        if(name=="bills_to_receive"){
          let today=_bills_to_receive.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0)
          let delayed=_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").map(item => (item.type=="out" ? - (item.amount) : item.amount)).reduce((acc, curr) => acc + curr, 0)
          return {today,
                  delayed,
                  today_total:_bills_to_receive.filter(i=>i.payday.split('T')[0]==new Date().toISOString().split('T')[0] && i.status!="paid").length,
                  delayed_total:_bills_to_receive.filter(i=>daysBetween(new Date(_today()),new Date(i.payday.split('T')[0])) < 0 && i.status!="paid").length
          }
       }

       if(name=="monthly_cat_performace"){


         
            let datasets={}
            let total=0
         
            let categories=[
              {name:'Clientes',field:'client',color:'rgb(34 197 94)',total:0},
              {name:'Investimentos',field:'investments',color:'gold',total:0},
              {name:'Despesas',field:'expenses',color:'red',total:0},
              {name:'Fornecedor',field:'supplier',color:'crimson',total:0},
              {name:'Estado',field:'state',color:'brown',total:0},
              {name:'Outros',field:'others',color:'gray',total:0}
            ]

            
            _bills_to_pay.forEach(t=>{
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
            })

            /*_transations.forEach(t=>{
              let month=new Date(t.payday).getMonth()
              let day=new Date(t.payday).getDate()

              let ref=t.reference.type != "none" ? t.reference.type : "others"
              if(!datasets[ref]) datasets[ref]=Array.from({ length: (period=="m" ? 12 : 7) }, () => 0)
              let amount=(t.type=='out' ? t.amount : -(t.amount))
              if(t.account_origin){
                 datasets[ref][period=="m" ? month : day]+=amount
              }
              total+=amount

             })*/

            let _datasets=[]

            Object.keys(datasets).forEach((d,_i)=>{
                let cat=categories.filter(i=>i.field==d)[0]
                let _t=datasets[d].map(item => item).reduce((acc, curr) => acc + curr, 0)
                categories[categories.findIndex(i=>i.field==d)].total=_t
                _datasets.push({data:datasets[d],label:cat.name,type:'bar',backgroundColor:cat.color,yAxisID: 'y'}) 
            })

            return {bar:{labels,datasets:_datasets},doughnut:{labels:categories.map(i=>`${i.name}`),datasets:categories.map(i=>i.total),backgroundColor:categories.map(i=>i.color)}}

       }






       if(name=="accounts_balance"){
             let accounts=_accounts.map(i=>({...i,total:0}))

             
             _transations.forEach(t=>{
              let account_index=accounts.findIndex(i=>i.id==t.transation_account.id)

              if(account_index >= 0){
                let amount=(t.type=='out' ? t.amount : -(t.amount))
                 accounts[account_index].total+=amount
              }
             
             })

             return {labels:accounts.map(i=>`${i.name} (${i.total})`),datasets:[{
                data:accounts.map(i=>i.total),
                label:'Saldo',
                type:'bar',
                backgroundColor:'rgb(59 130 246)',yAxisID: 'y'
             }]}


       }


      if(name=="accounts_cat_balance"){

            let outflows=['expenses','state','supplier']
            let inflows=['investments','client']
            
            let accounts=_account_categories.map(i=>({...i,total:0,color:generate_color(),type:inflows.includes(i.account_origin) ? 'in' : 'out'}))
            accounts.push({total:0,color:'gray',type:'in',name:'Outros',id:'others-in'})
            accounts.push({total:0,color:'gray',type:'out',name:'Outros',id:'others-out'})

            _transations.forEach(t=>{

            let amount=(t.type=='out' ? t.amount : (t.amount))

            
            let find_from=t.type=="in" ? _bills_to_receive : _bills_to_pay
            let a=find_from.filter(i=>i.id==t.account.id)[0]

            if(a){
              let account_index=accounts.findIndex(i=>i.id==a.account_id)
              accounts[account_index].total+=amount
            }else{
              let account_index=accounts.findIndex(i=>i.id==(t.type=="in" ? 'others-in':'others-out'))
              accounts[account_index].total+=amount
            }
            
          })

           return {
            in:{labels:accounts.filter(i=>i.type=="in").map(i=>`${i.name}`),datasets:accounts.filter(i=>i.type=="in").map(i=>i.total),backgroundColor:accounts.filter(i=>i.type=="in").map(i=>i.color)},
            out:{labels:accounts.filter(i=>i.type=="out").map(i=>`${i.name}`),datasets:accounts.filter(i=>i.type=="out").map(i=>i.total),backgroundColor:accounts.filter(i=>i.type=="out").map(i=>i.color)}
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
            let outflows_total=transactionsThisWeek.filter(i=>i.type=="in").length

           
            transactionsThisWeek.forEach(t=>{
              let day=new Date(t.createdAt) 
              day=day.getDay()
              if(t.type=="in") inflows_datasets[day]=t.amount
              if(t.type=="out") outflows_datasets[day]=t.amount
              compare_datasets[day]=t.type=="in" ? t.amount : -(t.amount)
           })


           let inflows=inflows_datasets.map(item => item).reduce((acc, curr) => acc + curr, 0)
           let outflows=outflows_datasets.map(item => item).reduce((acc, curr) => acc + curr, 0)

           return {inflows,outflows,balance:inflows - outflows,compare_datasets,inflows_datasets,outflows_datasets,inflows_total,outflows_total}

         
       }
       
  }


  function _cn(number){

   return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number)
     
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
    _sort_by_date,
    _filtered_content,
    _setFilteredContent,
    _get_cash_managment_stats,
    _get_stat,
    _cn,
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