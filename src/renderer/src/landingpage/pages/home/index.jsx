import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/header'
import DefaultLayout from '../../layout/DefaultLayout'
import IntroImage from '../../assets/images/intro.png'
import VideoIntro from '../../components/Dialogs/video-intro'
import { useHomeData } from '../../../contexts/HomeDataContext'
import colors from '../../assets/colors.json'
import ForexImage from '../../assets/images/forex.webp'
import i18n from '../../../i18n'
import { t } from 'i18next'
import DownloadProcess from '../../components/Dialogs/DownloadProcess'
import toast from 'react-hot-toast';
import DownloadPopUp from '../../components/Dialogs/download-popup'
import { useNavigate } from 'react-router-dom'
import TransaparentPageLoader from '../../../components/progress/transparentPageloader'

function index() {
  const [showVideo,setShowVideo]=useState(false)
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
        if(!openStart) setOpenSart('demo')
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

    if(!data.form.email1) {
        toast(t('common.insert-email'))
        return
    }

    if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email1))){
              toast(t('common.invalid-email'))
              return
    }

   


    if(openStart=="demo"){
        setLoading(true)

        try{

            await data.makeRequest({method:'get',url:`request-demo/`+data.form.email1, error: ``},0);
            toast.success(t('common.email-sent-2'))
            setLoading(false)
            setOpenSart(null)


        }catch(e){

            if(e.code=="ERR_NETWORK"){
                toast.error(t('common.check-network'))
            }else{
                toast.error(t('messages.try-again'))
            }
            setLoading(false)

        }

        return
    }

  

    data.register()
    setShowDownloadProcess(true)
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


           <div onClick={()=>{

            data._scrollToSection('home')

            }} className={`bg-[#ff4800] ${data.scrollY > 300 ? 'opacity-1':' translate-y-[100px]'} transition ease-in cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 bottom-3 z-20 rounded-full flex items-center justify-center`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg></div>

               <div id="home">

                    <div className="w-full hero h-[80vh] max-md:min-h-[100vh] bg-[#ff7626] flex items-center justify-center flex-col px-7">
                    <div className="circle">

                    </div>
                   
    	                  		
    	                  		 
    	                  	


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
                                    if(openStart=="demo"){
                                        validate_email()
                                    }else{
                                        setOpenSart("demo")
                                    }
                                    document.getElementById('demo').focus()
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
                    <div className="absolute left-0 top-0 w-full h-[50%] bg-[#ff7626]">

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



                 <div className="flex items-center justify-center">
                            <span onClick={()=>{
                                data.setDialogs({...data.dialogs,download:true})
                            }} className="text-white  max-sm:hidden text-[16px] min-w-[100px] flex justify-center px-5 py-3 rounded-full bg-[#ff7626]  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                               Download
                            </span>
                 </div>




               
                      
                <div id="features" className="relative z-10 mt-[100px] px-7">
                    <h2 className="text-center text-[20px] font-semibold mb-5 uppercase text-[#ff7626]">Porquê ProConta</h2>
                    <h3 className="max-w-[700px] max-md:text-[27px] mx-auto text-center text-[45px] font-semibold mb-6">Optimize your risk with trading tools tailored to your needs</h3>
                    <p className="max-w-[600px] mx-auto text-center text-gray-400">We offer a wide range of Forex trading services to meet the unique needs of our clients. Our services include:</p>


                    <div className="flex w-full items-center justify-center my-[80px] max-md:flex-wrap">
                       
                       {whyItems.map((i,_i)=>(
                         <div className="bg-[#F7F7F8] hover:shadow-xl rounded-[0.8rem] flex flex-col justify-center items-center p-10 max-w-[300px]">
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







               <div id="support" className="w-full px-7 flex-col items-center pb-[200px] bg-[#fff] flex border-t border-t-gray-200   mt-20">
                       
                        <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 text-white  max-md:text-[27px] mt-20">Have more questions? Don’t hesitate to reach us</h3>
                       
                        <div className="flex items-center mb-5">                
                              <span className="flex w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" fill={'#ff7626'}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                              </span>
                              <span className="text-gray-500 ml-3 text-[20px] hover:underline"><a href="mailto:proconta@alinvest-group.com" target="_blank">proconta@alinvest-group.com</a></span>
                        </div>
                        <div className="flex items-center mb-3">  
                             <span className="flex w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#ff7626"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                             
                            </span>              
                              <span className="text-gray-500 ml-3 text-[19px]"><a>+258 87 870 7590</a></span>
                        </div>

                        <div className="flex items-center mb-2">
                                <span className="flex cursor-pointer hover:underline w-[30px] h-[30px] rounded-full items-center border-[2px] border-[#ff7626] justify-center">
                                <svg  xmlns="http://www.w3.org/2000/svg" width="18px"  fill="#ff7626" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"></path></svg>
                                
                               </span>                  
                               <span className="text-gray-500 ml-3 text-[19px] cursor-pointer hover:underline"><a target="_blank" href="https://wa.me/258878707590">{t('common.our-whatsapp')}</a></span>
                        </div>

                     
               </div>










        







     </div>
    </DefaultLayout>
  )
}

export default index