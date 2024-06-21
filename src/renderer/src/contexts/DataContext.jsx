import { createContext, useContext, useState ,useEffect} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import PouchDB from 'pouchdb';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  let process={env:{REACT_APP_BASE_URL:'https://server-fms.onrender.com'}}

  const {token} = useAuth();
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
    budget:new PouchDB('budget')
  }

  const [_managers,setManagers]=useState([])
  const [_clients,setClients]=useState([])
  const [_suppliers,setSuppliers]=useState([])
  const [_investors,setInvestors]=useState([])
  const [_account_categories,setAccountCategories]=useState([])
  const [_bills_to_pay,setABillsToPay]=useState([])
  const [_bills_to_receive,setABillsToReceive]=useState([])
  const [_accounts,setAccounts]=useState([])
  const [_transations,setTransations]=useState([])
  const [_investments,setInvestments]=useState([])
  const [_categories,setACategories]=useState([])
  const [_payment_methods,setPaymentMethods]=useState([])
  const [_budget,setBudget]=useState([])
  const [_loaded,setLoaded]=useState([])
  const [_firstUpdate,setFirstUpdate]=useState(false)
  const [_filtered_content,_setFilteredContent]=useState([])

  let dbs=[
    {name:'managers',update:setManagers,db:db.managers, remote:true,get:_managers},
    {name:'clients',update:setClients,db:db.clients,get:_clients},
    {name:'suppliers',update:setSuppliers,db:db.suppliers,get:_suppliers},
    {name:'investors',update:setInvestors,db:db.investors,get:_investments},
    {name:'account_categories',update:setAccountCategories,db:db.account_categories,get:_account_categories},
    {name:'investments',update:setInvestments,db:db.investments,get:_investments},
    {name:'bills_to_pay',update:setABillsToPay,db:db.bills_to_pay,get:_bills_to_pay},
    {name:'bills_to_receive',update:setABillsToReceive,db:db.bills_to_receive,get:_bills_to_receive},
    {name:'accounts',update:setAccounts,db:db.accounts,get:_accounts},
    {name:'categories',update:setACategories,db:db.categories,get:_categories},
    {name:'payment_methods',update:setPaymentMethods,db:db.payment_methods,get:_payment_methods},
    {name:'transations',update:setTransations,db:db.transations,get:_transations},
    {name:'budget',update:setBudget,db:db.budget,get:_budget}
  ]

  useEffect(()=>{
    (async()=>{
      for (let i = 0; i < dbs.length; i++) {
        let docs=await  dbs[i].db.allDocs({ include_docs: true })
        docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
        docs.sort((a, b) => a.index_position - b.index_position)
        dbs[i].update(docs)
        handleLoaded('add',dbs[i].name)

        if(i==dbs.length - 1) setFirstUpdate(true)
      }
      
    })()

    
  },[])


  useEffect(()=>{
     if(_firstUpdate) init()
  },[_firstUpdate])


  const _scrollToSection = (to) => {
    const Section = document.getElementById(to);

    

    console.log({Section,to})
    if (Section) {
      Section.scrollIntoView({ behavior: 'smooth' });
    }
 }


  async function init() {

    /*let default_categories = [
      { name: 'Produtos', field: 'products_in', dre: 'inflows', type: 'in', sub_name: 'Produtos (entradas)', color: 'rgb(0, 128, 0)', total: 0 },  // green
      { name: 'Serviços', field: 'services_in', dre: 'inflows', type: 'in', sub_name: 'Serviços (entradas)', color: 'rgb(0, 255, 127)', total: 0 },  // spring green
      { name: 'Outras receitas', field: 'other-sales-revenue', dre: 'capital', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  // spring green
      
      { name: 'Despesas operacionais', field: 'expenses_out', dre: 'expenses', type: 'out', color: 'rgb(255, 0, 0)', total: 0 },  // red
      { name: 'Custo de mercadorias vendidas ', field: 'products_out', dre: 'direct-costs', type: 'out', sub_name: 'Produtos (saídas)', color: 'rgb(220, 20, 60)', total: 0 },  // crimson
      { name: 'Custo de serviços prestados', field: 'services_out', dre: 'direct-costs', type: 'out', sub_name: 'Serviços (saídas)', color: 'rgb(255, 99, 71)', total: 0 },  // tomato
      { name: 'Empréstimos', field: 'loans_out', dre: 'loans', type: 'out', color: 'rgb(128, 0, 0)', total: 0 },  // maroon
      { name: 'Investimentos', field: 'investments_out', dre: 'investments', type: 'out', color: 'rgb(255, 215, 0)', total: 0 },  // gold
      { name: 'Outros custos directos', field: 'state_out', dre: 'direct-costs', type: 'out', color: 'rgb(139, 69, 19)', total: 0, dre_name: 'Taxas e impostos' }  // saddle brown
  ]*/

      
    let default_categories = [
      { name: 'Produtos', field: 'products_in', dre: 'inflows', type: 'in', color: 'rgb(0, 128, 0)', total: 0 },  // green
      { name: 'Serviços', field: 'services_in', dre: 'inflows', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  // spring green
      { name: 'Empréstimos ou Financiamentos', field: 'loans_in', dre: 'inflows', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  // spring green
      { name: 'Outras receitas', field: 'other-sales-revenue', dre: 'capital', type: 'in', color: 'rgb(0, 255, 127)', total: 0 },  // spring green
      
      { name: 'Despesas operacionais', field: 'expenses_out', dre: 'expenses', type: 'out', color: 'rgb(255, 0, 0)', total: 0 },  // red
      { name: 'Custo de mercadorias vendidas ', field: 'products_out', dre: 'direct-costs', type: 'out', color: 'rgb(220, 20, 60)', total: 0 },  // crimson
      { name: 'Custo de serviços prestados', field: 'services_out', dre: 'direct-costs', type: 'out', color: 'rgb(255, 99, 71)', total: 0 },  // tomato
      { name: 'Empréstimos', field: 'loans_out', dre: 'loans', type: 'out', color: 'rgb(128, 0, 0)', total: 0 },  // maroon
      { name: 'Investimentos', dre: 'outflows',field: 'investments_out', dre: 'investments', type: 'out', color: 'rgb(255, 215, 0)', total: 0 },  // gold
      { name: 'Outros custos directos', field: 'state_out', dre: 'direct-costs', type: 'out', color: 'rgb(139, 69, 19)', total: 0}  // saddle brown
  
  ]

  
  if(!_categories.length){

    try{

        for (let i = 0; i < default_categories.length; i++) {

         
          await db.categories.put({...default_categories[i],index_position:i + 1,_id:Math.random().toString(),deleted:false,id:Math.random().toString()})  

        }

    }catch(e){
           console.log(e)
           console.log(`Ocorreu um erro de inicialização. Messagem de erro (${e.toString()})`)  
    }

  }
}


 async function _add(from,array){



        try{
         
          for (let i = 0; i < array.length; i++) {
            let index_position=dbs.filter(i=>i.name==from)[0].get.length + 1
            await dbs.filter(i=>i.name==from)[0].db.put({index_position,...array[i],createdAt:new Date().toISOString()})
          }
          _get(from)

          return {ok:true}

        }catch(e){
             return {ok:false,error:e}
        }

   
        

 }


 let _initial_form={
    transations:{
      id:'',
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
      fine:'',
      link_payment:false
  }
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
    let selected=dbs.filter(i=>i.name==from)[0]

   let response
   if(selected.remote){
      response = await makeRequest({method:'get',url:`api/users`, error: ``});
      response=response.map(i=>{
        delete i.__v
        return i
      })
      selected.db.bulkDocs(response)
      response.sort((a, b) => a.index_position - b.index_position)
      selected.update(response)
   }else{
      let docs=await  selected.db.allDocs({ include_docs: true })
      docs=docs.rows.map(i=>i.doc).filter(i=>!i.deleted)
      docs.sort((a, b) => a.index_position - b.index_position)
      selected.update(docs)

      if(from=="categories" && !docs.length){
           setTimeout(()=>_get('categories'),2000)
           console.log('--------------------------------')
      }
   }
      handleLoaded('add',from)

  }

   

/*
   let _payment_methods=[
    {name:'Cartão',id:'card'},
    {name:'Cheque',id:'check'},
    {name:'Transferência',id:'transfer'},
    {name:'Mkesh',id:'mkesh'},
    {name:'E-mola',id:'e-mola'},
    {name:'M-pesa',id:'m-pesa'},
    {name:'PayPal',id:'paypal'},
    {name:'Stripe',id:'stripe'},
    {name:'Strill',id:'Strill'},
    {name:'Dinheiro',id:'cash'},
    {name:'Valor inicial',id:'initial'},
]*/



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


  function get_stat_data(filterOptions,period){

    let p_length=period=="m" ? 12 : 31
    let projected=Array.from({ length: p_length }, () => [])
    let projected_budget=Array.from({ length: p_length }, () => [])
    let done=Array.from({ length: p_length }, () => [])
    let projected_in=Array.from({ length: p_length }, () => [])
    let done_in=Array.from({ length: p_length }, () => [])
    let projected_out=Array.from({ length: p_length }, () => [])
    let done_out=Array.from({ length: p_length }, () => [])
    let amortizations=Array.from({ length: p_length }, () => [])

   _investments.forEach(t=>{

    let end=t.period=="year" ? calculateEndDateWithYears(t.createdAt,parseInt(t.time)) : calculateEndDateWithMonths(t.createdAt,parseInt(t.time))
    let time=t.period=="year" ? t.time : Math.ceil(parseInt(t.time)/12)
    let cost=parseFloat(t.amount) / parseInt(time)
    let devide_with=period=='m' ? calculateMonthsDifference(t.createdAt.split('T')[0],end.toISOString().split('T')[0]) : daysBetween(t.createdAt.split('T')[0],end.toISOString().split('T')[0])
    

    for (let i = 0; i < p_length; i++) { 

       let year=new Date().getFullYear()
       let first_month=new Date(t.createdAt).getMonth()
       let first_year=new Date(t.createdAt).getFullYear()

       if((first_year==year && i >= first_month)){
           amortizations[i].push({...t,amount:cost/devide_with,end})
       }

       if(end.getFullYear() <= year && year >= first_year){
         //&& (end.getFullYear()==year && i <= end.getMonth())
         
       }
        
    }

})

  _bills_to_pay.forEach(t=>{
      let month=new Date(t.payday).getMonth()
      let year=new Date(t.payday).getFullYear()
      let day=new Date(t.payday).getDate()
      projected[period=="m" ? month : day].push({...t,_type:'out',amount:-(t.amount),month,year,day})
      projected_out[period=="m" ? month : day].push({...t,_type:'out',amount:-(t.amount),month,year,day})
  })

  _bills_to_receive.forEach(t=>{
      let month=new Date(t.payday).getMonth()
      let year=new Date(t.payday).getFullYear()
      let day=new Date(t.payday).getDate()
      projected[period=="m" ? month : day].push({...t,_type:'in',month,year,day})
      projected_in[period=="m" ? month : day].push({...t,_type:'in',month,year,day})
  })

  _transations.forEach(t=>{
      let month=new Date(t.createdAt).getMonth()
      let year=new Date(t.createdAt).getFullYear()
      let day=new Date(t.createdAt).getDate()
      done[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      if(t.type=='in'){
        done_in[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
      }else{
        done_out[period=="m" ? month : day].push({...t,amount:t.type=="out" ? -(t.amount) : t.amount,month,year,day})
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


  let category_types_ob={}

  _categories.forEach(e=>category_types_ob[e.field]=[])


  _account_categories.forEach(c=>{
          category_types_ob[c.account_origin].push({name:c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=Math.random()
          let row={projected:0,done:0}
          _projected[id]=projected
          _done[id]=done
          row['projected']=_projected[id][_i].filter(i=>i.account_origin==c.account_origin).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(i=>i.account_origin==c.account_origin).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)

          row['percentage']=!row['done'] && !row['projected']  ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
          return row
        })})

  })


let transations_types={inflows:[],outflows:[]}

_categories.forEach((c,index)=>{
      let from=c.type == "in" ? 'inflows' :'outflows'
      transations_types[from][index]={...c,name:c.dre_name ? c.dre_name : c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
        let id=Math.random()
        let row={projected:0,done:0}
        _projected[id]=projected
        _done[id]=done
        row['projected']=_projected[id][_i].filter(i=>i._type==c.type && i.account_origin==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
        row['done']=_done[id][_i].filter(i=>i.type==c.type && i.account_origin==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
        row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
        return row
      })}

      if(category_types_ob[c.field].length) transations_types[from][index].sub=category_types_ob[c.field]
      
})

let transations_types_budget={inflows:[],outflows:[]}

_categories.forEach((c,index)=>{
  let from=c.type == "in" ? 'inflows' :'outflows'
  transations_types_budget[from][index]={...c,name:c.dre_name ? c.dre_name : c.name,color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let id=Math.random()
    let row={projected:0,done:0}
    _projected[id]=projected_budget
    _done[id]=done
    row['projected']=_projected[id][_i].filter(i=>i.account_origin==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>i.type==c.type && i.account_origin==c.field).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    return row
  })}
  //if(category_types_ob[c.field].length) transations_types[from][index].sub=category_types_ob[c.field]
  
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
                  done[i]=done[i].filter(i=>i.month == parseInt(g.items.findIndex(i=>i.selected)))
              })
             }
              
      })


    })


  }



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
            items:[inflow[_i],outflow[_i],{projected:inflow[_i].projected - outflow[_i].projected,done:inflow[_i].done - outflow[_i].done,percentage:0},balance[_i]]
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
        }),sub:transations_types.inflows
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
      row['projected']=_projected[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      return row
    })},


    {name:'Categorias de entrada',field:'inflow',color:'#16a34a',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['inflow']
      let row={projected:0,done:0}
      _projected[id]=projected_budget
      _done[id]=done
      row['projected']=_projected[id][_i].filter(i=>i.transation_type=="in").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].filter(i=>i.type=="in").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100: !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      return row
    }),sub:transations_types_budget.inflows
  },

  {name:'Categorias de saida',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let id=['outflow']
    let row={projected:0,done:0}
    _projected[id]=projected
    _done[id]=done
    row['projected']=_projected[id][_i].filter(i=>i.transation_type=="out").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>i.type=="out").map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)

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
      row['projected']=_projected[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : row['done'] && !row['projected'] ? 100 : !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      
      return row
    }),sub:transations_types.inflows},


    {icon:'remove',name:'Custos directos',field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
      let id=['direct-costs']
      let row={projected:0,done:0}
      _projected[id]=projected_out
      _done[id]=done_out
      row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='direct-costs' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
      row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
      resuts[id]
      return row
    }),sub:transations_types.outflows.filter(i=>i.dre=="direct-costs")
  }
,

  
  {icon:'igual',name:'Margem bruta',field:'outflow',color:'rgba(0,0,0,0.64)',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
    let row={projected:0,done:0,percentage:0}
    let projected_inflows=_projected['inflows'][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
    let done_inflows=_done['inflows'][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
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
  row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='expenses' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
  row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.dre=='expenses' && f.field==i.account_origin)).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
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
  row['projected']=_projected[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
  row['done']=_done[id][_i].map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
  _projected[id][_i]=row['projected']
  _done[id][_i]=row['done']
  return row

 }),sub:_investments.map(i=>{
        return {name:i.description,field:'outflow',color:'crimson',items:Array.from({ length: p_length }, () => []).map((_,_i)=>{
          let id=['amortizations'+i.id]
          let row={projected:0,done:0,percentage:0}
          if(!_projected[id]) _projected[id]=JSON.parse(JSON.stringify(amortizations))
          if(!_done[id]) _done[id]=JSON.parse(JSON.stringify(amortizations))
          row['projected']=_projected[id][_i].filter(f=>f.id==i.id).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
          row['done']=_done[id][_i].filter(f=>f.id==i.id).map(item => item.amount).reduce((acc, curr) =>  acc + curr, 0)
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

    row['projected']=_projected[id][_i].filter(i=>transations_types.outflows.some(f=>f.field==i.account_origin)).map(item => item.fees ?  parseInt(item.fees) : 0).reduce((acc, curr) =>  acc + curr, 0)
    row['done']=_done[id][_i].filter(i=>transations_types.outflows.some(f=>f.field==i.account_origin)).map(item =>item.fees ? parseInt(item.fees) : 0).reduce((acc, curr) =>  acc + curr, 0)
    row['percentage']=!row['done'] && !row['projected'] ? 0 : !row['done'] && row['projected'] ? 0 : !row['projected'] ? 100 : row['done'] && !row['projected'] ? 100 : (parseFloat(row['done']) / parseInt(row['projected'])) * 100
    _projected[id][_i]=row['projected']
    _done[id][_i]=row['done']
    return row
  })//,sub:transations_types.fees.filter(i=>i.dre=="expenses")
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
                let _t=datasets[d].map(item => item).reduce((acc, curr) => acc + curr, 0)
                categories[categories.findIndex(i=>i.field==d)].total=_t
                _datasets.push({data:datasets[d],label:cat.name,type:'bar',backgroundColor:cat.color,yAxisID: 'y'}) 
            })

           categories=categories.filter(i=>i.total || i.field=='others')

            return {bar:{labels,datasets:_datasets},doughnut:{labels:categories.map(i=>`${i.name}`),datasets:categories.map(i=>i.total),backgroundColor:categories.map(i=>i.color),borderColor:categories.map(()=>'#ddd')}}
           
       }



     


       if(name=="accounts_balance"){

              

             let accounts=_payment_methods.map(i=>({...i,total:0}))
             

             accounts.forEach((a,_i)=>{
                        let initial_amount=a.has_initial_amount ? a.initial_amount : 0
                        let _in=_transations.filter(f=>f.type == "in").map(f=>f.payments.filter(j=>j.account_id==a.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                        let _out=_transations.filter(f=>f.type == "out").map(f=>f.payments.filter(j=>j.account_id==a.id)).filter(f=>f[0]).map(f=>parseFloat(f[0].amount)).map(amount => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)
                        let _available=initial_amount + _in - _out
                        accounts[_i]={...accounts[_i],total:_available}
             })
            
             return {labels:accounts.map(i=>`${i.name} (${i.total})`),datasets:[{
                data:accounts.map(i=>i.total),
                label:'Saldo',
                type:'bar',
                backgroundColor:'rgb(59 130 246)',yAxisID: 'y'
             }]}


       }


      if(name=="accounts_cat_balance"){
           
            let accounts=_account_categories.map(i=>({...i,total:0,color:generate_color(),type:i.transation_type}))
            accounts.push({total:0,color:'gray',type:'in',name:'Outros',id:'others-in'})
            accounts.push({total:0,color:'gray',type:'out',name:'Outros',id:'others-out'})
 

            _transations.forEach(t=>{

            let amount=(t.type=='out' ? t.amount : (t.amount))
            
            let find_from=t.type=="in" ? _bills_to_receive : _bills_to_pay
            let a=find_from.filter(i=>i.id==t.account.id)[0]

            if(a){
              console.log({a})
              let account_index=accounts.findIndex(i=>i.id==a.account_id)
              accounts[account_index].total+=amount
            }else{
              let account_index=accounts.findIndex(i=>i.id==(t.type=="in" ? 'others-in':'others-out'))
              accounts[account_index].total+=amount
            }
            
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

  function _cn_op(string){
     return string.replace(/(?!^)[^0-9]/g, '').replace(/^\-?[^0-9]*$/, '$&')
  }

  function _cn_n(string){
    return string.replace(/[^0-9]/g, '')
  }

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
    return `${_day ? _day : day} de ${monthName}`;
}



  const value = {
    makeRequest,
    _add,
    _get,
    _update,
    _delete,
    _clients,
    _investors,
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
    _get_dre_stats,
    _get_budget_managment_stats,
    _get_stat,
    _categories,
    _payment_methods,
    _investments,
    _cn,
    _cn_n,
    _cn_op,
    _budget,
    _convertDateToWords,
    _scrollToSection,
    _divideDatesInPeriods,
    _initial_form,
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