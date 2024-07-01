import React, { useState } from 'react';
import { useData  } from '../../../contexts/DataContext';
import FormLayout from '../../../layout/DefaultFormLayout';
import { Switch, Checkbox, Alert } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import toast from 'react-hot-toast';

function App() {
  const {_categories,_account_categories,_scrollToSection,_add,_get} = useData();
  const [loading,setLoading]=useState(false)
  const [openItems,setOpenItems]=useState([])
  const [formData,setFormData]=useState([])
  
  async function SubmitForm(formData){
           
    let res=await _add('categories',formData)

    if(res.ok){
        //toast.success('Plano de contas actualizado!')
    }else{
        toast.error(`Erro ao actualizar.  Messagem de erro: (${res.error})`)
    }


  }

  

  React.useEffect(()=>{
   
     _get('categories') 

   },[])

   
  React.useEffect(()=>{
   
      setFormData(_categories)
       

  },[_categories])

  return (
  <>

  <FormLayout maxWidth={'700px'} name={'Categorias gerais'} formTitle={'Categorias'}>

        <div>

        <div className="w-[97%] m-auto">
          
       {/*** <Alert severity="info">Selecione as categorias que deseja usar no seu negócio.</Alert> */}
           
          </div>    
                   
                   

                   {['in','out'].map((j,_j)=>(

                       <>
                  <span className={`mx-8 mb-5 font-medium mt-5 ${j=="in" ? `text-green-600 border-green-500`:`text-red-600 border-red-600`} text-[17px] table border-b`}>{j=="in" ? 'Entradas' : 'Saídas'} </span>
                   

                 {formData.filter(i=>i.type==j).map((i,_i)=>(
                    <div className="ml-10" key={_i} id={`category-list-`+_i+_j}>
                        <div className="flex px-[6px] items-center mt-3 pb-2 pl-3">
                              <Checkbox
                              disabled={0===1 ? true : false}
                              checked={!Boolean(i.disabled)}
                              inputProps={{ 'aria-label': 'controlled' }}
                              sx={{display:'none'}}
                              onChange={()=>{

                                SubmitForm(formData.map(f=>{
                                    return f.field!=i.field ? f : {...f,disabled:!Boolean(f.disabled)}
                                }))

                                 
                              }}/>
                              <label onClick={()=>{

                                if(!openItems.includes(i.field) && _account_categories.filter(f=>f.account_origin==i.field).length) setTimeout(()=>_scrollToSection('category-list-'+_i+_j),100)
                                
                                if(_account_categories.filter(f=>f.account_origin==i.field).length)   setOpenItems(openItems.includes(i.field) ? openItems.filter(f=>f!=i.field) : [...openItems,i.field])
                              
                              }} className={`flex items-center ${_account_categories.filter(f=>f.account_origin==i.field).length!=0 ? 'cursor-pointer':''} hover:opacity-90`}>
                                  {_account_categories.filter(f=>f.account_origin==i.field).length!=0 && <span className={`${openItems.includes(i.field) ? ' rotate-180' :' '} -ml-2`} ><ExpandMoreOutlinedIcon sx={{color:'gray'}}/></span>}
                                  <span className="text-gray-600">{i.name} {_account_categories.filter(f=>f.account_origin==i.field).length!=0 && <label className="mr-4 ml-3 text-[15px]"> ({_account_categories.filter(f=>f.account_origin==i.field).length})</label>}</span>
                              </label>
                             </div>

                           {openItems.includes(i.field) && <div>
                              {_account_categories.filter(f=>f.account_origin==i.field).map((f,_f)=>(
                                <div className="ml-16 mb-3">
                                  <div className="flex">
                                        <span className="text-gray-500">{f.name}</span>
                                  </div>
                                </div>
                              ))}

                          </div>}

                          
                    </div>
                   ))}

                  {_j==0 &&  <span className="flex border-b"></span>}
                          
                       </>

                   ))}
                   
                   

             
        </div>
    {/** 
        <FormLayout.SendButton text={{
            create:'Actualizar'
        }} SubmitForm={SubmitForm} loading={loading} valid={true} id={false}/>
     **/ }
  </FormLayout>
  </>
  )
  }

export default App

