import * as React from 'react';
import Close from '@mui/icons-material/Close';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

export default function Search({show,setOpenPopUps,searchContent,setSearchContent}) {

  const data = useData()

  const [content,setContent]=React.useState([])

  const navigate = useNavigate()
  
  
  React.useEffect(()=>{

      let array=[]

      if(!searchContent.replaceAll(' ','')){
          setContent([])
          return
      }

      data.dbs.filter(i=>i.n && i.get.length).forEach(i=>{
        array=array.concat(i.get.map(f=>({...f,n:i.n,_from:i.edit_name})))
      })


      setContent(data._search(searchContent,array).filter(i=>i.name || i.description || i.notes))


  },[data._loaded,searchContent])

 
  



  return (
   <>

      <div className={`w-[600px] ${show ? 'translate-y-2 z-10 ' : ' opacity-0 translate-y-4'} border-t flex-col flex h-[300px] top-[100%] shadow-lg bg-white rounded-[0.5rem] _search absolute left-[50%] -translate-x-[50%]`}>
            <div className="flex justify-between p-3 border-b">
                <div>
                <span>Resultados </span>{(searchContent.length!=0) && <span>({content.length})</span>}
                </div>

                <div className="cursor-pointer" onClick={()=>setOpenPopUps({nots:false,search:false})}>
                    <Close sx={{width:20}}/>
                </div>
                
               
            </div>

            <div className="flex-1 overflow-y-auto relative">

            
           {searchContent.length == 0 &&  <div className="text-center p-10 opacity-65">Comece a pesquisar...</div>}

           {searchContent.length != 0 && content.length==0 &&  <div className="text-center p-10 opacity-65">Sem resultados</div>}

           

            {content.length != 0  && <>

               
                <table class="w-full text-sm text-left rtl:text-right  rounded-[0.2rem] ">
        <thead class="text-xs text-gray-900 uppercase rounded-[1rem]  dark:text-gray-400">
            <tr className="[&>_th]:px-3 [&>_th]:py-2">
                <th scope="col">
                    
                </th>
                <th scope="col">
                        <span>Nome/Descrição</span>
                </th>
                <th scope="col">
                        <span>Data de criação</span>
                </th>
                
            </tr>
        </thead>

        <tbody>
                {content.map(i=>(
                 <tr onClick={()=>{
                    navigate(`/${i._from}/${i._id}`)
                    setOpenPopUps({nots:false,search:false})
                    setSearchContent('')
                 }} class="bg-white [&>_td]:px-3 [&>_td]:py-2 [&>_td]:border-b hover:bg-gray-100 cursor-pointer">
                 <th scope="row" class="px-3 py-2 border-b font-medium text-gray-900 whitespace-nowrap dark:text-white">
                     <span className="text-[13px] p-1 rounded bg-gray-100">{i.n}</span>
                 </th>
                 <td className="min-w-0">
                    <span className="truncate">{(i.description ? i.description : i.name ? i.name  : i.notes).slice(0,45)}{(i.description ? i.description : i.name ? i.name  : i.notes).length >= 45 && '...'}</span>
                 </td>
                 <td>
                    {data._convertDateToWords(i.createdAt.split('T')[0],null,'all')}
                 </td>
                 
                </tr>
               ))}
              
            

        </tbody>

    </table>
    </>}

 
            </div>
      </div>
 
   </>
  );
}
