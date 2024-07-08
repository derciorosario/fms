

import React, { useState,useEffect } from 'react';
import LinearWithValueLabel from '../../../components/progress/uploadFile';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useData } from '../../../contexts/DataContext';
function UploadCompanylogo({formData,setFormData}) {
   
     const data= useData()

        const [upload,setUpload]=React.useState({
            uploading:false,
            file:{},
            progress:0
        })
        const fileInputRef_1 = React.useRef(null);

        function clearFileInputs(){
            if(fileInputRef_1.current) fileInputRef_1.current.value=""
        }


const handleFileChange = async (event) => {
    let {name,size,path} = event.target.files[0]
    let orginal_name=name
    let generated_name=new Date().toISOString().split('T')[0] +`-${uuidv4().slice(1,8)}-`+ name
    let file={name:orginal_name,path,size,generated_name,local:false}

    if(size/1024/1024 > 5){
       toast.error('Arquivo não pode der maior que 2MB')
       return
    }

   

       const _formData = new FormData();
       _formData.append('from',file.from);
       _formData.append('from_id',file.from_id);
       _formData.append('file',event.target.files[0]);
       setUpload(prev=>({...prev,uploading:true,progress:0,file}))

       try {
        const res = await axios.post(data.APP_BASE_URL+'/api/upload-file', _formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const progress = Math.floor((loaded * 100) / total);
            setUpload(prev=>({...prev,progress}))
          }
        });

        setUpload(prev=>({...prev,uploading:false}))
        setFormData({...formData,company:{...formData.company,logo:{...file,generated_name:res.data,exists:true}}})
        clearFileInputs()

      }catch (err) {

          if(err.code=="ERR_NETWORK"){
            toast.error('Verifique sua internet e tente novamente')
          }else{
            toast.error('Erro inesperado! detalhes do erro:'+err)
          }

          setUpload({
            uploading:false,
            file:{},
            progress:0
          })

          console.log(err)

          
      }
      clearFileInputs()
    


  
    
  }


  return (
    <>

                 
        <div class="col-span-full mt-6">
          <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Logotipo <span className="font-[12px] text-gray-400">(opcional)</span></label>
           <div class="mt-2 flex items-center gap-x-3">
           <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${data.APP_BASE_URL+"/file/"+formData.company?.logo?.generated_name?.replaceAll(' ','%20')}")`}} className="w-[60px] h-[60px] border overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
              {!formData.company?.logo?.generated_name &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>}
           </div>
            <label className="flex relative items-center">
                <input accept=".png,.jpg" ref={fileInputRef_1} type="file" onChange={handleFileChange} className="w-full h-full absolute opacity-0 left-0 top-0"/> 
                {!upload.uploading && <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{formData.company?.logo?.generated_name ? 'Alterar' :' Selecionar imagem'} </button>}
                {upload.uploading && <LinearWithValueLabel progress={upload.progress}/>}
             </label>
             {formData.company?.logo?.generated_name && <span onClick={()=> setFormData({...formData,company:{...formData?.company,logo:{}}})} className="ml-1 cursor-pointer opacity-80 hover:opacity-100">Remover</span>}
            
           </div>
        </div>


    </>   
  )

}

export default UploadCompanylogo

