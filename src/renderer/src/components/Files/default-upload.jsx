import * as React from 'react';
import LinearWithValueLabel from '../../components/progress/uploadFile';
import { Add, Download, RefreshOutlined } from '@mui/icons-material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Autocomplete, Button, Checkbox} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';

export default function DefaultUpload({formData,setFormData,from,show}) {

    const data = useData()
   
    const [upload,setUpload]=React.useState({
        uploading:false,
        file:{},
        progress:0
      })
      const fileInputRef_1 = React.useRef(null);
      const fileInputRef_2 = React.useRef(null);


   
    
    function clearFileInputs(){
        if(fileInputRef_1.current) fileInputRef_1.current.value=""
        if(fileInputRef_2.current) fileInputRef_2.current.value=""
    }


    const handleFileChange = async (event) => {
        let {name,size,path} = event.target.files[0]
        let orginal_name=name
        let generated_name=new Date().toISOString().split('T')[0] +`-${uuidv4().slice(1,8)}-`+ name
        let file={name:orginal_name,path,size,generated_name,local:Boolean(window.electron)}

        if(size/1024/1024 > 5){
           toast.error('Arquivo não pode der maior que 2MB')
           return
        }

        file.from=from
        file.from_id=formData.id
       
        if(!window.electron) {

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
            setFormData({...formData,files:[{...file,generated_name:res.data,exists:true}]})
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
          return
        };


        setUpload(prev=>({...prev,uploading:true,progress:0,file}))
        window.electron.ipcRenderer.send('file-upload',{...file,exists:true})
      
        
      }


      React.useEffect(()=>{

            if(!window.electron) return

             window.electron.ipcRenderer.on('file-progress',(event,progress)=>{
                 setUpload(prev=>({...prev,progress}))
             })

             window.electron.ipcRenderer.on('upload-complete',(event,file)=>{
                setUpload(prev=>({...prev,uploading:false}))
                setFormData({...formData,files:[file]})
             })
             
             window.electron.ipcRenderer.on('file-exists-result',(event,exists)=>{
                  if(formData.files[0]?.path && !formData.files[0]?.checked){
                      if(formData.files[0]?.exists!=exists) setFormData({...formData,files:[{...formData.files[0],exists,checked:true}]})
                  }    
             })

             window.electron.ipcRenderer.on('download-complete',(event,desc)=>{
              setUpload(prev=>({...prev,downloading:false}))
              console.log({v:formData.files[0]})
              setFormData({...formData,files:[{...upload.file,local_path:desc}]})
             })


      },[])

      React.useEffect(()=>{
        if(formData.files[0]?.checked && window.electron){
           window.electron.ipcRenderer.send('check-file-exists',formData.files[0].path)
        }
      },[formData])

     
      function openFileInFolder(){
        window.electron.ipcRenderer.send('open-file-in-folder',formData.files[0].path)
      }

      function openFile(){
        if(!formData.files[0].local){
          window.open(data.APP_BASE_URL+'/file/'+formData.files[0].generated_name, '_blank')
          return
        }

        if(formData.files[0]?.exists)  window.electron.ipcRenderer.send('open-file',formData.files[0].path)

      }
      const downloadFile = () => {

        let download_url=data.APP_BASE_URL+`/download/${formData.files[0].generated_name}`
        

        setUpload(prev=>({...prev,downloading:true,progress:0,file:formData.files[0]}))


        if(window.electron){
             window.electron.ipcRenderer.send('download-file',`http://localhost:4000/download/2024-06-30-ce2e4e3e-a9d2-41ce-9dbe-7b297acba8c2%20-%20ars-c-data.json`)
        }

        axios({
          url: download_url,
          method: 'GET',
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.total;
            const current = progressEvent.loaded;
            
            setUpload(prev=>({...prev,progress:(current / total) * 100}))
           
          },
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', formData.files[0].name); 
            document.body.appendChild(link);
            link.click();
            link.remove();
          })
          .catch((error) => {
            console.error('Download error', error);
            setUpload(prev=>({...prev,progress:0,downloading:false}))

            if(error.code=="ERR_NETWORK"){
              toast.error('Verifique sua internet e tente novamente')
            }else{
              toast.error('Erro inesperado! detalhes do erro:'+error)
            }
          })
          .finally(() => {
            setUpload(prev=>({...prev,progress:0,downloading:false}))
          });
      };



  return (
      <>
            
            <div className={`${show ? 'hidden':'block'} w-full px-4`}>
                                <div className={`border min-h-[80px] p-3 flex-col justify-center items-center rounded-[2px] border-dashed relative ${!formData.files[0] ?'cursor-pointer' :''}`}>
                                        <div className="flex items-center justify-center ">
                                          {(!upload.uploading && !upload.downloading) && !formData.files[0] && <label>
                                              <Button sx={{width:'100%'}} endIcon={<FilePresentIcon/>}>Anexar documento ou imagem max [2MB]</Button>
                                              <input ref={fileInputRef_1} onChange={handleFileChange} className="w-full h-full absolute top-0 left-0 opacity-0" type="file"/>
                                          </label>}
                                        </div>

                                        {(upload.uploading || upload.downloading) &&  <>
                                           <div className="flex items-center justify-center h-full">
                                             <LinearWithValueLabel progress={upload.progress}/>
                                           </div>
                                        </>}

                                        {formData.files[0] && (!upload.uploading && !upload.downloading) &&  <>
                                            <div className="flex flex-col">
                                              <span className={`text-center block mb-4`} onClick={openFile}><span className={`${formData.files[0]?.exists ? 'text-blue-500':''} ${formData.files[0]?.exists ? 'underline cursor-pointer':' opacity-50'} `}>{formData.files[0]?.name}</span> {!formData.files[0]?.exists && <label className="text-red-600 ml-2">(Removido)</label>}</span>
                                              <div className="text-center"> {formData.files[0]?.local==false && <span><Button onClick={downloadFile} startIcon={<Download style={{color:'rgb(59,130,246)'}}/>}>Baixar</Button></span>} {formData.files[0]?.exists && formData.files[0]?.local && <Button onClick={openFileInFolder}>Abrir pasta</Button>}<label className="ml-4 relative"><Button endIcon={<RefreshOutlined/>} variant="contained">Alterar</Button><input ref={fileInputRef_2} onChange={handleFileChange} className="w-full h-full absolute top-0 left-0 opacity-0" type="file"/></label></div>
                                            </div>
                                        </> }


                              </div>
                            </div>
      </>
  );
}