import * as React from 'react';
import Close from '@mui/icons-material/Close';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import colors from '../../assets/colors.json'
export default function Search({show}) {
  const [searchContent,setSearchContent] = React.useState('')

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

<div className={`fixed z-10 left-0 ${show ? 'flex':" opacity-0 pointer-events-none"} items-center justify-center top-0 bg-[rgba(0,0,0,0.4)] w-full h-[100vh]`}>
      

     <div className={`w-[600px] h-[300px] ${show ? 'translate-y-2 z-10 ' : ' opacity-0 pointer-events-none translate-y-4'} border-t flex-col flex transition duration-150 ease-in-out   shadow-lg bg-white rounded-[0.5rem] _search`}>
            <div className="flex justify-between p-3 border-b">
                <div className="flex items-center">
                <div className="flex h-10 bg-slate-100 items-center px-2 rounded-lg relative">
                    <span className="text-white"><SearchIcon style={{ color:colors.app_orange[500] }}/></span>
                    <input value={searchContent} onChange={(e)=>{
                        setSearchContent(e.target.value)
                    }} placeholder="Pesquisar..." type="text" className="_search outline-none bg-transparent flex-grow px-2"/>
                    {/** <Search setSearchContent={setSearchContent} searchContent={searchContent} show={openPopUps.search} setOpenPopUps={setOpenPopUps}/> */}

                </div>

                {(searchContent.length!=0) && <span className="ml-2">Resultados: ({content.length})</span>}
                
                
                </div>

                

                <div className="cursor-pointer" onClick={()=>data._closeAllPopUps()}>
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
                    data._closeAllPopUps()
                 }} class="bg-white [&>_td]:px-3 [&>_td]:py-2 [&>_td]:border-b hover:bg-gray-100 cursor-pointer">
                 <th scope="row" class="px-3 py-2 border-b font-medium text-gray-900 whitespace-nowrap dark:text-white">
                     <span className="text-[13px] p-1 rounded bg-gray-100">{i.n}</span>
                 </th>
                 <td className="min-w-0">
                    <span className="truncate">{(i.description ? i.description : i.name ? i.name  : i.notes).slice(0,35)}{(i.description ? i.description : i.name ? i.name  : i.notes).length >= 35 && '...'}</span>
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

     </div>
 
   </>
  );
}
