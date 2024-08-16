import React, { useEffect, useRef, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import IntroImage from '../../assets/images/intro.png'
import VideoIntro from '../../components/Dialogs/video-intro'
import { useHomeData } from '../../../contexts/HomeDataContext'
import colors from '../../assets/colors.json'
import ForexImage from '../../assets/images/forex.webp'
import AppStore from '../../assets/images/app-store.png'
import GooglePlay from '../../assets/images/google-play.png'
import i18n from '../../../i18n'
import { t } from 'i18next'
import DownloadProcess from '../../components/Dialogs/DownloadProcess'
import toast from 'react-hot-toast';
import DownloadPopUp from '../../components/Dialogs/download-popup'
import { useNavigate } from 'react-router-dom'
import TransaparentPageLoader from '../../../components/progress/transparentPageloader'
import Demostration from '../../components/Dialogs/demostration'

function index() {
  const [showVideo,setShowVideo]=useState(false)
  const [showDemoPopUp,setShowDemoPopUp]=useState(false)
  const [showDownloadProcess,setShowDownloadProcess]=useState(false)
  const navigate=useNavigate()
  const data=useHomeData()
  const [openStart,setOpenSart]=useState(null)
  const [loading,setLoading]=useState(false)
  const [translateTextY,setTranslateTextY]=useState(0)
  const elementRef = useRef(null);


  const [isMobileSize,setIsMobileSize]=useState(window.innerWidth <= 1024)
  useEffect(()=>{
      if(isMobileSize){
        if(!openStart) setOpenSart('sub')
      }
  },[isMobileSize])
  function handleResize(){
      setIsMobileSize(window.innerWidth <= 1024)
  }
  useEffect(() => {
      window.addEventListener("resize", handleResize);
     /* return () => {
        document.removeEventListener("resize", handleResize);
      };*/
  }, []);



  async function validate_email(){
    toast.remove()


    if(openStart!="sub" && (!data.form.email1 || !data.form.name || !data.form.contact || !data.form.company_name)){
        toast.error(t('common.fill-fields'))
        return false
    }


    if(!data.form.email1) {
        toast(t('common.insert-email'))
        return
    }


    if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email1))){
              toast(t('common.invalid-email'))
              return
    }


    setShowDemoPopUp(false)


    if(openStart!="sub"){
        setLoading(true)

        try{

            await data.makeRequest({method:'get',url:`request-demo/`+data.form.email1, error: ``},0);
            toast.success(t('common.email-sent-2'))
            setLoading(false)
            setOpenSart(null)
            data.reset()


        }catch(e){

            if(e.code=="ERR_NETWORK"){
                toast.error(t('common.check-network'))
            }else{
                toast.error(t('messages.try-again'))
            }
            setLoading(false)

            if(openStart!="sub"){
                setShowDemoPopUp(true)
            }

        }

        return
    }else{
        
       data._scrollToSection('plans')

    }

  

    /*data.register()
    setShowDownloadProcess(true)*/
  }

  const [whyItems,setWhyItems]=useState([])
  const [features,setFeatures]=useState([])
  const [slideMessages,setSlideMessages]=useState([])



  useEffect(()=>{

    const time_=3000
    let current_trans_value=0
    let index=0
    setInterval(()=>{
           if(elementRef.current) elementRef.current.style.transition = "0.7s";
          current_trans_value+=1
          index++
         setTranslateTextY(current_trans_value)
          if (index >= 3) {
                index=0
                setTimeout(()=>{
                    if(elementRef.current) elementRef.current.style.transition = "0s";
                    index=0
                    current_trans_value=0
                    setTranslateTextY(0)
                },700)
          }

    },time_)
},[])


 

  useEffect(()=>{
    setWhyItems([
        {title:t('common.best-speakers'),img:'micro',content:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, distinctio qui? '},
        {title:t('common.inspiring-keynotes'),img:'light',content:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, distinctio qui? '},
        {title:t('common.networking-fun-food'),img:'networking',content:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, distinctio qui?'}
    ])

    setFeatures([ 
        {sub_title:'Event',title:t('titles.new-era-in-theworkspace'),text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, distinctio qui? Inventore deserunt fugiat unde iste laboriosam officia dignissimos consequuntur soluta aliquid exercitationem tempora a sed ratione, similique nesciunt explicabo!'},
        {sub_title:'Event',title:t('titles.new-era-in-theworkspace'),text:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, distinctio qui? Inventore deserunt fugiat unde iste laboriosam officia dignissimos consequuntur soluta aliquid exercitationem tempora a sed ratione, similique nesciunt explicabo!'}
    ])

    setSlideMessages([
        t('slides.msg-1'),
        t('slides.msg-2'),
        t('slides.msg-3'),
        t('slides.msg-1')
    ])
},[i18n.language])



  return (
    <DefaultLayout> 
           {loading && <TransaparentPageLoader setLoading={setLoading}/>}
           <DownloadPopUp/>
           <DownloadProcess show={showDownloadProcess} setShow={setShowDownloadProcess}/>
           <VideoIntro show={showVideo} setShow={setShowVideo}/>
           <Demostration show={showDemoPopUp} setShow={setShowDemoPopUp} validate_email={validate_email}/>


           <div onClick={()=>{

            data._scrollToSection('home')

            }} className={`bg-[#ff4800] ${data.scrollY > 300 ? 'opacity-1':' translate-y-[100px]'} transition ease-in cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 bottom-3 z-20 rounded-full flex items-center justify-center`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg></div>

               <div id="home">

                    <div className="w-full hero h-[80vh] max-md:min-h-[100vh] bg-[#ff7626] flex items-center justify-center flex-col px-7">
                    <div className="circle circle-1"></div>	<div className="circle circle-2"></div> <div className="circle circle-3"></div>		


                        <h2 className="lg:text-[70px] md:text-[50px] max-md:text-[35px] max-w-[900px] mx-auto text-center text-white font-bold p-0 mt-4">ProConta</h2>
                        <div class="animated-container">
    	                  		 	<div className="w-full h-[60px] overflow-hidden mt-2 mb-8 flex justify-center">
                                        <div class="animated-div h-[60px]" ref={elementRef} style={{transform:`translateY(-${translateTextY * 60}px)`}}>
                                                        {slideMessages.map(i=>(
                                                            <span  className="h-[60px] text-[50px] text-center justify-center max-md:text-[20px] font-bold flex items-center text-white">{i}</span>
                                                        ))}
                                                                
                                        </div>
                                    </div>
    	                </div>
                        <p className="text-white hidden opacity-70 my-6 mx-auto max-w-[700px] text-center">At FinFlow, we are dedicated to providing our clients with a professional and reliable Forex trading experience.</p>
                        
                        <span onClick={()=>{
                            navigate('/login')
                        }} className="text-gray-700  my-5 mb-8  sm:hidden text-[16px] inline-table px-5 py-3 rounded-full bg-white  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                            {t('common.go-to-app')}
                        </span>
                         
                        <div className="flex max-sm:flex-col w-full justify-center">
                        
                            <div className={`mr-4 transition-all max-sm:mb-0 duration-150 ease-in ${openStart=="sub" ? 'md:min-w-[500px] bg-white':'0 overflow-hidden'}   max-sm:flex-col max-sm:w-full rounded-[0.3rem] sm:rounded-full  p-1 flex items-center`}>
                                 <div className={`overflow-hidden  ${openStart=="sub" ? 'w-full':'w-0'}  flex items-center h-[50px]`}>
                                    <span className="pl-3"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                                    <input id="sub" onChange={(e=>(
                                        data.setForm({...data.form,email1:e.target.value})
                                    ))} value={data.form.email1} placeholder={t('common.email-mask')} className="outline-none flex-1 px-3 bg-transparent" />
                                </div>
                                <button onClick={()=>{
                                    if(openStart=="sub"){
                                        validate_email()
                                    }else{
                                        setOpenSart("sub")
                                    }
                                    document.getElementById('sub').focus()
                                }} className={`px-7  sm:h-full h-[100%]  max-sm:w-full max-sm:h-auto max-sm:py-3  rounded-full  transition-all duration-100 sm:rounded-full border-[2px] border-[transaparent] ${openStart=="sub" ? 'bg-[#ff7626] hover:scale-[1.1] text-white':'text-gray-500 bg-white'} `}>{t('common.make-subscription')}</button>
                            </div>


                            <div className={`${openStart=="demo" && isMobileSize ? 'mt-4':''} transition-all duration-150 ease-in ${openStart=="demo" ? 'md:min-w-[500px] bg-white':'0 overflow-hidden'} max-md:${openStart!="demo" ? 'translate-y-[-20px]': ''}   max-sm:flex-col max-sm:w-full rounded-[0.3rem] sm:rounded-full  p-1 flex items-center`}>
                                 <div className={`overflow-hidden  ${openStart=="demo" ? 'w-full':'w-0'}  flex items-center h-[50px]`}>
                                    <span className="pl-3"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                                    <input id="demo" onChange={(e=>(
                                        data.setForm({...data.form,email1:e.target.value})
                                    ))} value={data.form.email1} placeholder={t('common.email-mask')} className="outline-none flex-1 px-3 bg-transparent" />
                                </div>
                                <button onClick={()=>{
                                    setShowDemoPopUp(true)
                                }} className={`px-7  sm:h-full h-[100%] max-sm:w-full max-sm:h-auto max-sm:py-3  rounded-full   transition-all duration-100 sm:rounded-full border-[2px] border-[transaparent] ${openStart=="demo" ? 'bg-[#ff7626] hover:scale-[1.1] text-white':'text-white'} `}>{t('common.ask-for-demostration')}</button>
                            </div>

                            

                        </div>

                </div>


            <div className="relative">

                <div className="absolute left-0 top-0 h-full w-full flex justify-center z-[-2]">
                    <div className="h-full border-l border-l-gray-200 w-[240px]"></div>
                    <div className="h-full border-l border-l-gray-200 w-[240px]"></div>
                    <div className="h-full border-x border-x-gray-200 w-[240px]"></div>
                </div>

               

                <div className="w-full relative mb-20">
                    <div className="absolute left-0 top-0 w-full h-[50%] bg-[#ff7626] overflow-hidden">
                            <div className="dots middle-dots-bg w-full h-[100vh]">

                            </div>
                    </div>
                    <div className="w-[80%] translate-y-[0px] mx-auto rounded-[1rem] overflow-hidden intro-image-div z-10 relative">
                        <img className="w-full" src={IntroImage}/>
                        <a href="#">
                            <div onClick={()=>setShowVideo(true)} className="play-btn w-[70px] h-[70px] rounded-full bg-red-500 absolute top-[50%] left-[50%] max-md:top-[25%] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#fff"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                                    
                        </div>
                        </a>
                    </div>
                 </div>



                



                 <div className="items-center justify-center hidden">
                            <span onClick={()=>{
                                data.setDialogs({...data.dialogs,download:true})
                            }} className="text-white  max-sm:hidden text-[16px] min-w-[100px] flex justify-center px-5 py-3 rounded-full bg-[#ff7626]  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                               Download
                            </span>
                 </div>


                 <div className="w-full mt-[130px]  min-h-[200px] px-10">

                     <h2 className="text-center text-[20px] font-semibold mb-5 uppercase text-[#ff7626]">Download <span className="text-gray-950">ProConta</span></h2>
                     <p className="max-w-[600px] mx-auto text-center text-gray-400">{t('common.available-in')}</p>


                    <div className="flex download-icons-c items-center justify-center [&>_div]:border-2 [&>_div]:border-app_orange-400 [&>_div]:p-2  max-sm:[&>_div]:p-1 mt-10 [&>_div]:rounded-[0.4rem] [&>_div]:mx-7">

                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="40px" fill="#ff7626"> <path d="M 2.0996094 6.9609375 L 2.0996094 42.939453 L 27.550781 42.939453 L 29.679688 42.939453 L 48 42.939453 L 48 6.9609375 L 29.039062 6.9609375 L 26.599609 6.9609375 L 2.0996094 6.9609375 z M 27.679688 8.9609375 L 46 8.9609375 L 46 40.939453 L 29.009766 40.939453 C 28.739766 39.989453 28.540391 39.020781 28.400391 38.050781 C 28.290391 37.280781 28.229453 36.530547 28.189453 35.810547 L 28.189453 35.800781 C 28.197008 35.799475 28.20345 35.796383 28.210938 35.794922 C 28.213204 35.858583 28.208154 35.916455 28.210938 35.980469 C 28.870937 35.940469 29.529453 35.890547 30.189453 35.810547 C 33.709453 35.400547 37.179688 34.469062 40.429688 33.039062 L 39.630859 31.210938 C 36.640859 32.520937 33.450937 33.389063 30.210938 33.789062 C 29.550938 33.869062 28.880938 33.940469 28.210938 33.980469 C 28.21 34.000469 28.211816 34.02291 28.210938 34.042969 C 28.207058 34.04213 28.203118 34.041812 28.199219 34.041016 C 28.199457 34.034135 28.198978 34.026406 28.199219 34.019531 C 28.199219 33.999531 28.200937 33.990469 28.210938 33.980469 C 28.200937 33.910469 28.210938 33.849063 28.210938 33.789062 C 28.300938 32.099063 28.580156 30.600313 28.910156 29.320312 C 28.960156 29.130312 29.010547 28.949297 29.060547 28.779297 C 29.070547 28.769297 29.070078 28.750469 29.080078 28.730469 C 29.210078 28.270469 29.36 27.839453 29.5 27.439453 L 29.990234 26.099609 L 29.966797 26.099609 L 21.25 26.099609 C 21.83 22.079609 22.980156 18.180469 24.660156 14.480469 C 25.530156 12.570469 26.529688 10.720937 27.679688 8.9609375 z M 11.910156 13.972656 L 13.947266 13.972656 C 13.948266 15.658656 13.950172 17.34425 13.951172 19.03125 C 13.267172 19.02625 12.582437 19.021625 11.898438 19.015625 C 11.901438 17.334625 11.906156 15.653656 11.910156 13.972656 z M 34.009766 14.009766 L 34.009766 18.980469 L 35.875 18.980469 L 35.875 14.009766 L 34.009766 14.009766 z M 10.365234 31.150391 C 14.376234 32.920391 18.626281 33.889297 22.988281 34.029297 C 24.051281 34.059297 25.115734 34.050469 26.177734 33.980469 C 26.147734 34.620469 26.147734 35.290469 26.177734 35.980469 C 25.465734 36.030469 24.74225 36.050781 24.03125 36.050781 C 23.66025 36.050781 23.300687 36.039297 22.929688 36.029297 C 18.307688 35.879297 13.804734 34.860469 9.5527344 32.980469 L 10.365234 31.150391 z"/></svg>
                             <p className="absolute top-[100%]">MacOS</p>
                        </div>

                        <div className="relative">
                             <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="40px" fill="#ff7626"><path d="M4 4H24V24H4zM26 4H46V24H26zM4 26H24V46H4zM26 26H46V46H26z"/></svg>
                             <p className="absolute top-[100%]">Windows</p>
                        </div>

                        <div className="relative">
                                    <svg fill="#ff7626" height="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                        viewBox="0 0 304.998 304.998" xml:space="preserve">
                                    <g id="XMLID_91_"><path id="XMLID_92_" d="M274.659,244.888c-8.944-3.663-12.77-8.524-12.4-15.777c0.381-8.466-4.422-14.667-6.703-17.117
                                            c1.378-5.264,5.405-23.474,0.004-39.291c-5.804-16.93-23.524-42.787-41.808-68.204c-7.485-10.438-7.839-21.784-8.248-34.922
                                            c-0.392-12.531-0.834-26.735-7.822-42.525C190.084,9.859,174.838,0,155.851,0c-11.295,0-22.889,3.53-31.811,9.684
                                            c-18.27,12.609-15.855,40.1-14.257,58.291c0.219,2.491,0.425,4.844,0.545,6.853c1.064,17.816,0.096,27.206-1.17,30.06
                                            c-0.819,1.865-4.851,7.173-9.118,12.793c-4.413,5.812-9.416,12.4-13.517,18.539c-4.893,7.387-8.843,18.678-12.663,29.597
                                            c-2.795,7.99-5.435,15.537-8.005,20.047c-4.871,8.676-3.659,16.766-2.647,20.505c-1.844,1.281-4.508,3.803-6.757,8.557
                                            c-2.718,5.8-8.233,8.917-19.701,11.122c-5.27,1.078-8.904,3.294-10.804,6.586c-2.765,4.791-1.259,10.811,0.115,14.925
                                            c2.03,6.048,0.765,9.876-1.535,16.826c-0.53,1.604-1.131,3.42-1.74,5.423c-0.959,3.161-0.613,6.035,1.026,8.542
                                            c4.331,6.621,16.969,8.956,29.979,10.492c7.768,0.922,16.27,4.029,24.493,7.035c8.057,2.944,16.388,5.989,23.961,6.913
                                            c1.151,0.145,2.291,0.218,3.39,0.218c11.434,0,16.6-7.587,18.238-10.704c4.107-0.838,18.272-3.522,32.871-3.882
                                            c14.576-0.416,28.679,2.462,32.674,3.357c1.256,2.404,4.567,7.895,9.845,10.724c2.901,1.586,6.938,2.495,11.073,2.495
                                            c0.001,0,0,0,0.001,0c4.416,0,12.817-1.044,19.466-8.039c6.632-7.028,23.202-16,35.302-22.551c2.7-1.462,5.226-2.83,7.441-4.065
                                            c6.797-3.768,10.506-9.152,10.175-14.771C282.445,250.905,279.356,246.811,274.659,244.888z M124.189,243.535
                                            c-0.846-5.96-8.513-11.871-17.392-18.715c-7.26-5.597-15.489-11.94-17.756-17.312c-4.685-11.082-0.992-30.568,5.447-40.602
                                            c3.182-5.024,5.781-12.643,8.295-20.011c2.714-7.956,5.521-16.182,8.66-19.783c4.971-5.622,9.565-16.561,10.379-25.182
                                            c4.655,4.444,11.876,10.083,18.547,10.083c1.027,0,2.024-0.134,2.977-0.403c4.564-1.318,11.277-5.197,17.769-8.947
                                            c5.597-3.234,12.499-7.222,15.096-7.585c4.453,6.394,30.328,63.655,32.972,82.044c2.092,14.55-0.118,26.578-1.229,31.289
                                            c-0.894-0.122-1.96-0.221-3.08-0.221c-7.207,0-9.115,3.934-9.612,6.283c-1.278,6.103-1.413,25.618-1.427,30.003
                                            c-2.606,3.311-15.785,18.903-34.706,21.706c-7.707,1.12-14.904,1.688-21.39,1.688c-5.544,0-9.082-0.428-10.551-0.651l-9.508-10.879
                                            C121.429,254.489,125.177,250.583,124.189,243.535z M136.254,64.149c-0.297,0.128-0.589,0.265-0.876,0.411
                                            c-0.029-0.644-0.096-1.297-0.199-1.952c-1.038-5.975-5-10.312-9.419-10.312c-0.327,0-0.656,0.025-1.017,0.08
                                            c-2.629,0.438-4.691,2.413-5.821,5.213c0.991-6.144,4.472-10.693,8.602-10.693c4.85,0,8.947,6.536,8.947,14.272
                                            C136.471,62.143,136.4,63.113,136.254,64.149z M173.94,68.756c0.444-1.414,0.684-2.944,0.684-4.532
                                            c0-7.014-4.45-12.509-10.131-12.509c-5.552,0-10.069,5.611-10.069,12.509c0,0.47,0.023,0.941,0.067,1.411
                                            c-0.294-0.113-0.581-0.223-0.861-0.329c-0.639-1.935-0.962-3.954-0.962-6.015c0-8.387,5.36-15.211,11.95-15.211
                                            c6.589,0,11.95,6.824,11.95,15.211C176.568,62.78,175.605,66.11,173.94,68.756z M169.081,85.08
                                            c-0.095,0.424-0.297,0.612-2.531,1.774c-1.128,0.587-2.532,1.318-4.289,2.388l-1.174,0.711c-4.718,2.86-15.765,9.559-18.764,9.952
                                            c-2.037,0.274-3.297-0.516-6.13-2.441c-0.639-0.435-1.319-0.897-2.044-1.362c-5.107-3.351-8.392-7.042-8.763-8.485
                                            c1.665-1.287,5.792-4.508,7.905-6.415c4.289-3.988,8.605-6.668,10.741-6.668c0.113,0,0.215,0.008,0.321,0.028
                                            c2.51,0.443,8.701,2.914,13.223,4.718c2.09,0.834,3.895,1.554,5.165,2.01C166.742,82.664,168.828,84.422,169.081,85.08z
                                            M205.028,271.45c2.257-10.181,4.857-24.031,4.436-32.196c-0.097-1.855-0.261-3.874-0.42-5.826
                                            c-0.297-3.65-0.738-9.075-0.283-10.684c0.09-0.042,0.19-0.078,0.301-0.109c0.019,4.668,1.033,13.979,8.479,17.226
                                            c2.219,0.968,4.755,1.458,7.537,1.458c7.459,0,15.735-3.659,19.125-7.049c1.996-1.996,3.675-4.438,4.851-6.372
                                            c0.257,0.753,0.415,1.737,0.332,3.005c-0.443,6.885,2.903,16.019,9.271,19.385l0.927,0.487c2.268,1.19,8.292,4.353,8.389,5.853
                                            c-0.001,0.001-0.051,0.177-0.387,0.489c-1.509,1.379-6.82,4.091-11.956,6.714c-9.111,4.652-19.438,9.925-24.076,14.803
                                            c-6.53,6.872-13.916,11.488-18.376,11.488c-0.537,0-1.026-0.068-1.461-0.206C206.873,288.406,202.886,281.417,205.028,271.45z
                                            M39.917,245.477c-0.494-2.312-0.884-4.137-0.465-5.905c0.304-1.31,6.771-2.714,9.533-3.313c3.883-0.843,7.899-1.714,10.525-3.308
                                            c3.551-2.151,5.474-6.118,7.17-9.618c1.228-2.531,2.496-5.148,4.005-6.007c0.085-0.05,0.215-0.108,0.463-0.108
                                            c2.827,0,8.759,5.943,12.177,11.262c0.867,1.341,2.473,4.028,4.331,7.139c5.557,9.298,13.166,22.033,17.14,26.301
                                            c3.581,3.837,9.378,11.214,7.952,17.541c-1.044,4.909-6.602,8.901-7.913,9.784c-0.476,0.108-1.065,0.163-1.758,0.163
                                            c-7.606,0-22.662-6.328-30.751-9.728l-1.197-0.503c-4.517-1.894-11.891-3.087-19.022-4.241c-5.674-0.919-13.444-2.176-14.732-3.312
                                            c-1.044-1.171,0.167-4.978,1.235-8.337c0.769-2.414,1.563-4.91,1.998-7.523C41.225,251.596,40.499,248.203,39.917,245.477z"/>
                                    </g>
                                    </svg>
                                    <p className="absolute top-[100%]">Linux</p>
                        </div>

                    </div>


                    <div className="flex items-center justify-center mt-16">
                          <span className="flex w-[140px]"> {t('common.soon-in-app')}</span>

                          <div className="ml-3">                
                               <img src={AppStore} className="h-[30px] w-auto"/>
                          </div>

                          <label className="mx-3">{t('common.and')}</label>

                          <div className="ml-1">
                              <img src={GooglePlay} className="h-[30px] w-auto"/>
                          </div>
                    </div>

 
                 </div>


               
                      
                <div id="features" className="relative z-10 py-[100px] px-7 bg-white mt-[100px] features">
                    <h2 className="text-center text-[20px] font-semibold mb-5 uppercase text-[#ff7626] hidden">Porquê ProConta</h2>
                    <h3 className="max-w-[700px] max-md:text-[27px] mx-auto text-center text-[45px] font-semibold mb-6">Optimize your risk with trading tools tailored to your needs</h3>
                    <p className="max-w-[600px] mx-auto text-center text-gray-400">We offer a wide range of Forex trading services to meet the unique needs of our clients. Our services include:</p>


                    <div className="flex w-full items-center justify-center my-[80px] max-md:flex-wrap">
                       
                       {whyItems.map((i,_i)=>(
                         <div className={`bg-[#F7F7F8] hover:shadow-xl ${_i!=1 ? 'rounded-[0.8rem]':' max-sm:rounded-[0.8rem]'} ${_i==2 ? 'rounded-s-none max-sm:rounded-s-[0.8rem]':''} ${_i==0 ? 'rounded-e-none max-sm:rounded-e-[0.8rem]':''}  max-md:mb-4 flex flex-col justify-center items-center p-10 max-w-[300px]`}>
                                <span className="flex mb-2"><svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" fill={colors.app_pimary[400]}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                                <span className="text-[20px] font-semibold mb-3 flex">Forex Trading</span>
                                <p className="text-center text-gray-400 text-[17px]">We offer competitive spreads, leverage of up to 1:500.</p>
                         </div>
                       ))}
                    </div>
                </div>

                


               <div className="w-[80%] mx-auto md:flex justify-between mt-[200px]">

                   <div className="max-w-[380px] relative">
                       <div className="_image_item absolute left-0 top-0 w-full h-full z-[-1]"></div>
                       <img className="w-full" src={ForexImage}/>
                   </div>
                   <div className="ml-10 flex flex-col justify-center max-md:mt-10">
                         <div className="max-w-[500px]">
                            <h2 className="text-[20px]  font-semibold  mb-5 uppercase text-[#ff7626]">{t('section.ask-for-accounting-3')}</h2>
                            <h3 className="text-[36px]  font-semibold mb-6">{t('section.ask-for-accounting-2')}</h3>
                            <p className="text-gray-400 text-[17px]">{t('section.ask-for-accounting-1')}</p>
                        

                            <div className="flex mt-7">
                                <span  className="text-white  text-[16px] min-w-[100px] flex justify-center px-5 py-3 rounded-full bg-[#ff7626]  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                                    <a href="https://alinvest-group.com">{t('common.know-more')}</a>
                                </span>
                            </div>
                         </div> 
                    </div>
               </div>


            </div>



               <div className="max-w-[80%] my-[190px] p-16 rounded-[1.4rem] bg-[#ff7626] mx-auto testemunial relative">
                      <div className="tesmemunial-bg absolute top-0 left-0 w-full h-full"></div>
                      <p className="text-white text-[30px] font-semibold max-md:text-[20px]">
                        “I have been trading with FinFlow for over a year now, and I couldn't be happier with the results. The platform is easy to use, the support team is responsive and knowledgeable, and the pricing is unbeatable.”
                      </p>

                      <div className="flex mt-4 items-center">
                          <div className="w-[55px] h-[55px] t-avatar rounded-full border-[3px] bg-app_primary-300 border-white t-avatar">

                          </div>
                          <span  className="text-white text-[20px] ml-2">Ana Maia</span>
                          <span  className="text-white text-[20px] opacity-65 ml-2">CEO Vinhos Maria</span>
                      </div>
                    
               </div>










               <div id="plans" className="px-7">

                      <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">Choose the best plan for you, without the fuss and guesswork.</h3>
                      
                      <div  className="flex w-full max-md:flex-col items-center justify-center my-[80px]">
                       
                       
                         <div className="bg-[#F7F7F8] mb-10 shadow-xl mx-4 rounded-[0.8rem] flex flex-col justify-center items-center p-10 max-w-[320px]">
                                     <span className="text-[20px] mb-3 flex">Basico</span>
                                     <p className="text-center text-gray-400 text-[17px]">Sit id ut tempor est arcu ac praesent morbi por 3 dias</p>
                                     <span className="text-[26px] font-semibold mt-3 flex">Free</span>
                                     <button onClick={()=>{
                                            data.register()
                                     }} className="bg-black text-white px-10 w-full cursor-pointer hover:bg-app_primary-300 hover:scale-[1.1]  transition-all duration-75 py-3 my-5 rounded-full">Comprar</button>
                                     <div className="flex flex-col">
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">Lobortis laoreet gravida</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">Facilisi velit ornare sit viverra</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">Pellentesque commodo</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px]">Non ipsum metus vulputate</label>
                                         </span>
                                     </div>
                         </div>



                         <div className="bg-[#ff7626]  mb-10 shadow-xl mx-4 rounded-[0.8rem] flex flex-col justify-center items-center p-10 max-w-[320px]">
                                     <span className="text-[20px] mb-3 flex text-white">Basico</span>
                                     <p className="text-center text-[17px] text-white opacity-85">Sit id ut tempor est arcu ac praesent morbi por 3 dias</p>
                                     <span className="text-[26px] font-semibold mt-3 flex text-white">Standard</span>
                                     <button  onClick={()=>{
                                            data.register()
                                     }}className="text-black bg-white px-10 w-full cursor-pointer hover:bg-app_primary-300 transition-all duration-75 py-3 my-5 rounded-full hover:scale-[1.1]">Comprar</button>
                                     <div className="flex flex-col">
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px] text-white">Lobortis laoreet gravida</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px] text-white">Facilisi velit ornare sit viverra</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px] text-white">Pellentesque commodo</label>
                                         </span>
                                         <span className="flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="green"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                                            <label className="ml-2 text-[15px] text-white">Non ipsum metus vulputate</label>
                                         </span>
                                     </div>
                         </div>




                       
                    </div>
               </div>







               <div id="support" className="w-full px-7 flex-col items-center pb-[100px] relative bg-[#fff] flex   mt-20  overflow-hidden">
                        <div className="circle circle-4"></div><div className="circle circle-5"></div>
                        <h3 className="max-w-[700px] mx-auto text-center text-[35px] font-semibold mb-6 text-gray-800  max-md:text-[27px] mt-20 z-10">{t('common.has_questions')}</h3>
                       
                        <div className="flex items-center mb-5 z-10">                
                              <span className="flex w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" fill={'#ff7626'}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                              </span>
                              <span className="text-gray-500 ml-3 text-[20px] hover:underline"><a href="mailto:proconta@alinvest-group.com" target="_blank">proconta@alinvest-group.com</a></span>
                        </div>
                        <div className="flex items-center mb-3 z-10">  
                             <span className="flex w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#ff7626"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                             
                            </span>              
                              <span className="text-gray-500 ml-3 text-[19px]"><a>+258 87 870 7590</a></span>
                        </div>

                        <div className="flex items-center mb-2 z-10">
                                <span className="flex cursor-pointer hover:underline w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                                <svg  xmlns="http://www.w3.org/2000/svg" width="18px"  fill="#ff7626" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"></path></svg>
                                
                               </span>                  
                               <span className="text-gray-500 ml-3 text-[19px] cursor-pointer underline"><a target="_blank" href="https://wa.me/258878707590">{t('common.our-whatsapp')}</a></span>
                        </div>

                     
               </div>










        







     </div>
    </DefaultLayout>
  )
}

export default index