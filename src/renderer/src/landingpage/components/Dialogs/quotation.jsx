import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useHomeData } from '../../../contexts/HomeDataContext'
import colors from '../../assets/colors.json'
import CircularIndeterminate from '../loaders/progress'
import { CorporateFareOutlined } from '@mui/icons-material'
import toast from 'react-hot-toast'


function Quotation({show, setShow,send_quotation}) {
  
  const data=useHomeData()
  const [step,setStep] = useState(0)
  const [valid,setValid] = useState(false)

console.log({a:data.form})
  useEffect(()=>{

    if(step==0){

        setValid(data.form.name && data.form.location && data.form.company_name && data.form.email && data.form.contact)

    }else{

        setValid(data.form.workers_amount && data.form.business_volume && data.form.work_field)

    }
  },[data.form,step])
  return (
    <div className={`flex fixed top-0 left-0 z-50 items-center transition-all ease-in duration-200 ${show ? '':'opacity-0 pointer-events-none'} justify-center min-h-[100vh] w-full bg-[rgba(0,0,0,0.5)] px-[1rem]`}>
                 <div className={`pb-[30px] transition-all ease-in duration-200 ${show ? 'scale-100':'scale-75'} bg-white rounded-[0.4rem] w-[400px] px-[0.5rem]`}>

                    <div className="flex justify-between p-2 items-center border-b">
                       <span className="text-[23px] font-normal">{t('common.ask-for-quotation')}</span>
                       <div onClick={()=>setShow(false)} className="bg-[#ff4800] cursor-pointer hover:opacity-90 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>
                    </div>

                    <div className="py-6 px-4">

                           {step==0 && <>

                            <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={colors.app_pimary[300]}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,name:e.target.value})
                            ))} value={data.form.name} placeholder={t('form.representer-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                           <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill={colors.app_pimary[300]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                           <input  onChange={(e=>(
                                        data.setForm({...data.form,email:e.target.value})
                            ))} value={data.form.email} placeholder={'Email'} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#ff7626"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"></path></svg></span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,contact:e.target.value.replace(/[^0-9]/g, '')})
                            ))} value={data.form.contact} placeholder={t('form.contact')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                        
                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">
                                <CorporateFareOutlined sx={{color:colors.app_pimary[400]}}/>
                            </span>
                            <input  onChange={(e=>(
                                        data.setForm({...data.form,company_name:e.target.value})
                            ))} value={data.form.company_name} placeholder={t('form.company-name')} className="flex-1 h-full px-2 outline-none bg-transparent"/>
                        </div>

                     

                        <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center justify-center bg-white">           
                              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7626"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            </span>
                            <select value={data.form.location} onChange={(e)=>data.setForm({...data.form,location:e.target.value})}   className="outline-none bg-transparent w-full">
                                <option selected disabled value={""}>{t('form.location')}</option>
                                <option value="maputo">Maputo</option>
                                <option value="maputo-provincia">Maputo (Província)</option>
                                <option value="gaza">Gaza</option>
                                <option value="inhambane">Inhambane</option>
                                <option value="sofala">Sofala</option>
                                <option value="manica">Manica</option>
                                <option value="tete">Tete</option>
                                <option value="zambezia">Zambézia</option>
                                <option value="nampula">Nampula</option>
                                <option value="niassa">Niassa</option>
                                <option value="cabo-delgado">Cabo Delgado</option>
                                <option value="matola">Matola</option>
                                <option value="xai-xai">Xai-Xai</option>
                                <option value="inhambane-cidade">Inhambane (Cidade)</option>
                                <option value="beira">Beira</option>
                                <option value="chimoio">Chimoio</option>
                                <option value="tete-cidade">Tete (Cidade)</option>
                                <option value="quelimane">Quelimane</option>
                                <option value="nampula-cidade">Nampula (Cidade)</option>
                                <option value="pemba">Pemba</option>
                                <option value="lichinga">Lichinga</option>
                            </select>
                            </div>
                        
                           </> } 


                           {step==1 && <>
                            <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">      
                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7626"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                            </span>
                            <select value={data.form.workers_amount} onChange={(e)=>data.setForm({...data.form,workers_amount:e.target.value})} className="outline-none bg-transparent w-full">
                                <option selected disabled value={""}>{t('form.workers-amount')}</option>
                                <option value={'1-to-10'}>{t('form._1-of-10')}</option>
                                <option value={'11-to-30'}>{t('form._11-of-30')}</option>
                                <option value={'31-to-100'}>{t('form._31-of-100')}</option>
                            </select>
                            </div>

                            <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">
                                       <svg  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7626"><path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z"/></svg>
                            </span>
                            <select value={data.form.business_volume} className="outline-none bg-transparent w-full" onChange={(e)=>data.setForm({...data.form,business_volume:e.target.value})}>
                                <option selected disabled value={""}>{t('form.business-volume')}</option>
                                <option value={'until-3M'}>{t('form.to-3M')}</option>
                                <option value={'until-30M'}>{t('form.to-30M')}</option>
                                <option value={'until-160M'}>{t('form.to-160M')}</option>
                            </select>
                            </div>

                            {data.form.business_volume && <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">                     
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7626"><path d="M120-120v-560h160v-160h400v320h160v400H520v-160h-80v160H120Zm80-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg>
                            </span>
                            <span className="opacity-60 pointer-events-none ml-2">{data.form.business_volume=="until-3M" ? t('form.micro-company') : data.form.business_volume=="until-30M" ? t('form.small-company') : t('form.medium-company') }</span>
                            </div>}

                            <div className="w-full max-sm:w-full items-center flex h-[43px] rounded-[0.3rem] bg-slate-100 mb-5">
                            <span className="flex px-2 h-[85%] ml-[3px] rounded-[0.3rem] items-center  justify-center bg-white">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff7626"><path d="M120-120v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-320v-80h80v80h-80Zm0-320v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-320v-80h80v80h-80Zm0-320v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Z"/></svg>
                            </span>
                            <select value={data.form.work_field} className=" bg-transparent w-full outline-none" onChange={(e)=>data.setForm({...data.form,work_field:e.target.value})}>

                                <option selected disabled value={""}>{t('form.work-field')}</option>
                                <option value={t('form.agriculture')}>{t('form.agriculture')}</option>
                                <option value={t('form.automotive')}>{t('form.automotive')}</option>
                                <option value={t('form.banking')}>{t('form.banking')}</option>
                                <option value={t('form.construction')}>{t('form.construction')}</option>
                                <option value={t('form.consulting')}>{t('form.consulting')}</option>
                                <option value={t('form.education')}>{t('form.education')}</option>
                                <option value={t('form.energy')}>{t('form.energy')}</option>
                                <option value={t('form.entertainment')}>{t('form.entertainment')}</option>
                                <option value={t('form.fashion')}>{t('form.fashion')}</option>
                                <option value={t('form.finances')}>{t('form.finances')}</option>
                                <option value={t('form.food_and_beverages')}>{t('form.food_and_beverages')}</option>
                                <option value={t('form.health')}>{t('form.health')}</option>
                                <option value={t('form.hospitality')}>{t('form.hospitality')}</option>
                                <option value={t('form.insurance')}>{t('form.insurance')}</option>
                                <option value={t('form.it')}>{t('form.it')}</option>
                                <option value={t('form.legal')}>{t('form.legal')}</option>
                                <option value={t('form.logistics')}>{t('form.logistics')}</option>
                                <option value={t('form.manufacturing')}>{t('form.manufacturing')}</option>
                                <option value={t('form.media')}>{t('form.media')}</option>
                                <option value={t('form.mining')}>{t('form.mining')}</option>
                                <option value={t('form.non_profit')}>{t('form.non_profit')}</option>
                                <option value={t('form.pharmaceutical')}>{t('form.pharmaceutical')}</option>
                                <option value={t('form.real_estate')}>{t('form.real_estate')}</option>
                                <option value={t('form.retail')}>{t('form.retail')}</option>
                                <option value={t('form.security')}>{t('form.security')}</option>
                                <option value={t('form.sports')}>{t('form.sports')}</option>
                                <option value={t('form.technology')}>{t('form.technology')}</option>
                                <option value={t('form.telecommunications')}>{t('form.telecommunications')}</option>
                                <option value={t('form.tourism')}>{t('form.tourism')}</option>
                                <option value={t('form.transportation')}>{t('form.transportation')}</option>
                                <option value={t('form.utilities')}>{t('form.utilities')}</option>
                                <option value={t('form.wholesale')}>{t('form.wholesale')}</option>
                                <option value={t('form.wholesale')}>{t('common.another')}</option>
                            </select>
                            </div>


                           </>}


                           

                        <div className="overflow-hidden h-[46px] w-full  max-sm:w-full relative flex items-center rounded-[0.3rem] justify-center bg-[#ff7626]">
                           {data.loading && <div className="scale-[0.8]"><CircularIndeterminate color={'#fff'}/></div>}
                           {!data.loading && <button onClick={()=>{
                              if(step==0){
                                if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email))){
                                    toast(t('common.invalid-email'))
                                    return
                                }
                                setStep(1)
                              }else{
                                send_quotation()
                              }
                           }} className={`w-full h-full ${(valid)  ? 'bg-[#ff7626]':'bg-gray-400 pointer-events-none'} text-white  cursor-pointer hover:scale-[1.1] transition-all ease-in`}>{step == 0 ? t('common.step') : t('common.send')} <span className="text-[15px]">{step + 1}/2</span></button>}
                     
                      </div>

                    </div>

                    <div className="w-full flex justify-center">
                            {step==1 && <span onClick={()=>setStep(0)} className="text-[15px] cursor-pointer">{t('common.go-back')}</span>}
                    </div>
                    

                 </div>
    </div>
  )
}

export default Quotation