import * as React from 'react';
import LinearWithValueLabel from '../../components/progress/uploadFile';
import { Add, Download, RefreshOutlined } from '@mui/icons-material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Autocomplete, Button, Checkbox} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';
import { t } from 'i18next';

export default function DefaultUpload({formData,setFormData,from,show}) {

      const data = useData()
   
      const [upload,setUpload]=React.useState({
        uploading:false,
        file:{},
        progress:0
      })


      const [fileExists,setFileExists] = React.useState(null)


      React.useEffect(()=>{
             if(!upload.file.id || (fileExists!=null && fileExists!=undefined)) return
            
             if(!window.electron){
                setFileExists(false)
                console.log('check-1')
             }else{
                window.electron.ipcRenderer.send('check-file-exists',upload.file.generated_name)
             }
            
      },[upload])


      React.useEffect(()=>{
          if(!upload.file.generated_name && formData.files[0]){
              setUpload({...upload,file:formData.files[0]})
          }
      },[formData])


      React.useEffect(()=>{
           if(data.uploadedToClound.includes(upload.file?.id) && !upload.file?.uploaded){
              setUpload(prev=>({...prev,uploaded:true}))
              let f={...formData,files:[{...formData.files[0],uploaded:true}]}
              setFormData(f)
           }

        
      },[data.uploadedToClound])



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
        let file={id:uuidv4(),name:orginal_name,path,size,generated_name,uploaded:false,app_id:data._app.id,from__id:formData.id}

        if(size/1024/1024 > 5){
           toast.error(t('common.file-was-to-be-more-than')+' 2MB')
          // return
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

            setUpload(prev=>({...prev,uploading:false,uploaded:true}))
            console.log({res})
            let f={...formData,files:[{...file,generated_name:res.data,uploaded:true}]}
            setFormData(f)
            clearFileInputs()

          }catch (err) {

              if(err.code=="ERR_NETWORK"){
                toast.error(t('messages.check-internet'))
              }else{
                toast.error(t('common.unkown-error-see-details')+' '+err)
              }

              setUpload({
                uploading:false,
                file:{},
                progress:0
              })

               

          }
          clearFileInputs()

          return
        };


        setUpload(prev=>({...prev,uploading:true,progress:0,file}))
        window.electron.ipcRenderer.send('file-upload',{...file})
        setFileExists(true)
      
      }


      React.useEffect(()=>{

            if(!window.electron) return

             window.electron.ipcRenderer.on('file-progress',(event,progress)=>{
                 setUpload(prev=>({...prev,progress}))
             })

             window.electron.ipcRenderer.on('upload-complete',async(event,file)=>{
                let f={...JSON.parse(localStorage.getItem('current_form_data')),files:[file]}
                setUpload(prev=>({...prev,uploading:false,downloading:false}))
                
                /*try{
                  await data.store_uploaded_file_info(file)
                }catch(e){}*/
                setFormData(f)
             })

             window.electron.ipcRenderer.on('file-exists-result',(event,exists)=>{
                  setFileExists(exists)
             })

             window.electron.ipcRenderer.on('download-complete',async (event,file)=>{
                setFileExists(true)  
                setUpload(prev=>({...prev,downloading:false}))
                /*try{
                  await data.store_uploaded_file_info({...file},'update')
                }catch(e){}*/
                let f={...JSON.parse(localStorage.getItem('current_form_data')),files:[file]}
                setFormData({...f,files:[file]}) 

             })
      },[])



    
      React.useEffect(()=>{
         localStorage.setItem('current_form_data',JSON.stringify(formData))
      },[formData])

     
      function openFileInFolder(){
        window.electron.ipcRenderer.send('open-file-in-folder',formData.files[0].generated_name)
      }

     
      function openFile(){
        if(!fileExists && formData.files[0].uploaded){
          window.open(data.APP_BASE_URL+'/file/'+formData.files[0].generated_name, '_blank')
          return
        }

        if(fileExists)  window.electron.ipcRenderer.send('open-file',formData.files[0].generated_name)

        
      }
      const downloadFile = () => {

        let download_url=data.APP_BASE_URL+`/download/${formData.files[0].generated_name}`
        

        setUpload(prev=>({...prev,downloading:true,progress:0,file:formData.files[0]}))


        if(window.electron){
             window.electron.ipcRenderer.send('download-file',{file:formData.files[0],dest:data.APP_BASE_URL+'/file/'+formData.files[0].generated_name.replaceAll(' ','%20')})
             return
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
              toast.error(t('messages.check-internet'))
            }else{
              toast.error(t('common.unkown-error-see-details')+error)
            }
          })
          .finally(() => {
            setUpload(prev=>({...prev,progress:0,downloading:false}))
          });
      };

      //console.log({fileExists,files:formData.files,upload})



  return (
      <>
            
            <div className={`${show ? 'hidden':'block'} w-full px-4 relative`}>
                                <div className={`border min-h-[80px] p-3 flex-col justify-center items-center rounded-[2px] border-dashed relative ${!formData.files[0] ?'cursor-pointer' :''}`}>
                                        <div className="flex items-center justify-center ">
                                          {(!upload.uploading && !upload.downloading) && !formData.files[0] && <label>
                                              <Button sx={{width:'100%'}} endIcon={<FilePresentIcon/>}>{t('messages.attach-doc')} max [2MB]</Button>
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
                                              <span className={`text-center block mb-4`} onClick={openFile}><span className={`${(fileExists || formData.files[0]?.uploaded)  ? 'text-blue-500 underline cursor-pointer':' opacity-50'} hover:opacity-80`}>{formData.files[0]?.name}</span> {(!fileExists && window.electron && data._app.id==upload?.file?.app_id) && <label className="text-red-600 ml-2">({t('common.removed')})</label>}  {(!formData.files[0].uploaded && data._app.id!=upload?.file?.app_id) && <label className="ml-2">({t('common.not-uploaded')})</label>}</span>
                                              <div className="text-center"> {(!fileExists && formData.files[0].uploaded) && <span><Button onClick={downloadFile} startIcon={<Download style={{color:'rgb(59,130,246)'}}/>}>Download</Button></span>} {fileExists && <Button onClick={openFileInFolder}>{t('common.open-in-folder')}</Button>}<label className="ml-4 relative"><Button endIcon={<RefreshOutlined/>} variant="contained">{t('common.change')}</Button><input ref={fileInputRef_2} onChange={handleFileChange} className="w-full h-full absolute top-0 left-0 opacity-0" type="file"/></label></div>
                                            </div>
                                        </> }


                                  
                                      {formData.files[0]?.uploaded &&  <div className="absolute right-2 bottom-2"><svg xmlns="http://www.w3.org/2000/svg" fill={'green'} height="24px" viewBox="0 -960 960 960" width="24px" ><path d="m414-280 226-226-58-58-169 169-84-84-57 57 142 142ZM260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg></div>}

                              </div>
                            </div>
      </>
  );
}