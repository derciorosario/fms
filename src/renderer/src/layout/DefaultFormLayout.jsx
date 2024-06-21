
import React, { useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FormCard from '../components/Cards/form_totals';

const FormLayout = ({name,formTitle,maxWidth, children, topLeftContent}) => {
         
  return (

    <>
      <DefaultLayout details={{name}}>
               <div style={{maxWidth:maxWidth ? maxWidth :'100%'}} className={`bg-white py-1 pb-5 border rounded-[0.3rem]`}>

               <div className="p-[15px] opacity-75 flex justify-between items-center">
                  <span className="font-medium text-[18px]">{formTitle}</span>
                  {topLeftContent}
               </div>

                <span className="flex border-t border-zinc-200 w-[98%] mx-auto mb-4"></span>
              

               {children}

            </div>
        </DefaultLayout>
        
    </>

  )
}




FormLayout.Section = ({maxWidth,children,id,style}) => {
         
    return (
                 
        <div style={style ? {...style,maxWidth:maxWidth ? maxWidth :'100%'} : {maxWidth:maxWidth ? maxWidth :'100%'}} id={id ? id : Math.random().toString()} className={`flex flex-wrap p-4   [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]`}>
            {children}
        </div>
    )
}


FormLayout.Cards = ({topInfo}) => {
         
    return (
                 
               <FormCard items={topInfo}/>
    )
}




FormLayout.SendButton = ({SubmitForm,valid,loading,id,text}) => {

    let update_text
    let create_text
    let update_loading_text
    let create_loading_text

    update_text=!text?.update ? "Actualizar" : text?.update
    create_text=!text?.create ? "Enviar" : text?.create
    update_loading_text=!text?.update_loading ? "a actualizar..." : text?.update_loading
    create_loading_text=!text?.create_loading ? "a anviar..." : text?.create_loading
         
    return (
                 <div className="px-3 mb-2 mt-7">
                        <LoadingButton
                           onClick={SubmitForm}
                           endIcon={<SendIcon />}
                           loading={loading}
                           loadingPosition="end"
                           variant="contained"
                           disabled={!valid}
                        >
                           <span>{loading ? `${id ? update_loading_text : create_loading_text}`:`${id ? update_text : create_text}`}</span>
                     </LoadingButton>
                 </div>
    )
}




export default FormLayout

