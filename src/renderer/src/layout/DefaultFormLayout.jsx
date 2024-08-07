
import React, { useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import FormCard from '../components/Cards/form_totals';
import LinearProgressBar from '../components/progress/LinearProgress';
import DefaultButton from '../components/Buttons/default';
import { v4 as uuidv4 } from 'uuid';
import { t } from 'i18next';
const FormLayout = ({name,formTitle,maxWidth, children, topLeftContent,loading,isPopUp}) => {
         
  return (

    <>
      <DefaultLayout isPopUp={isPopUp} details={{name}}>
               <div style={{maxWidth:maxWidth ? maxWidth :'100%'}} className={`bg-white  pb-5 shadow rounded-[0.3rem]`}>

               <div className="py-[7px] px-5 opacity-75 flex justify-between items-center relative">
                  {loading && <div className="absolute top-0 left-0 w-full rounded-t-[0.5rem] overflow-hidden">
                         <LinearProgressBar />
                  </div>}
                  <span className="font-medium text-[16px]">{formTitle}</span>
                  {topLeftContent}
               </div>

                <span className="flex border-t border-zinc-200 w-[98%] mx-auto mb-4"></span>
              

                <div className={`${loading ?'opacity-40':''}`}>
                        {children}
                </div>

            </div>
        </DefaultLayout>
        
    </>

  )
}




FormLayout.Section = ({maxWidth,children,id,style}) => {
         
    return (
                 
        <div style={style ? {...style,maxWidth:maxWidth ? maxWidth :'100%'} : {maxWidth:maxWidth ? maxWidth :'100%'}} id={id ? id : uuidv4()} className={`flex flex-wrap p-4   [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]`}>
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

    update_text=!text?.update ? t('common.update') : text?.update
    create_text=!text?.create ? t('common.send') : text?.create
    update_loading_text=!text?.update_loading ? t('common.updating') : text?.update_loading
    create_loading_text=!text?.create_loading ? t('common.sending') : text?.create_loading
         
    return (
                 <div className="px-3 mb-2 mt-7 flex">
                    <DefaultButton loading={loading} goTo={SubmitForm} disabled={!Boolean(valid)} text={loading ? `${id ? update_loading_text : create_loading_text}`:`${id ? update_text : create_text}`}/>
                 </div>
    )
}




export default FormLayout

