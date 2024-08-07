import React, { useEffect, useState } from 'react'
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

function index() {
  const [showVideo,setShowVideo]=useState(false)
  const [showDownloadProcess,setShowDownloadProcess]=useState(false)
  const navigate=useNavigate()
  const data=useHomeData()

  function validate_email(){
    toast.remove()

    if(!data.form.email1) {
        toast(t('common.insert-email'))
        return
    }

    if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email1))){
              toast(t('common.invalid-email'))
              return
    }

    data.register()
    setShowDownloadProcess(true)
  }

  const [whyItems,setWhyItems]=useState([])
  const [features,setFeatures]=useState([])
  const [faq,setFaq]=useState([
    {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
    {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
    {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
    {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'}
  ])

  const [openFaq,setOpenFaq]=useState(null)


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
},[i18n.language])


  return (
    <DefaultLayout> 
           <DownloadPopUp/>
           <DownloadProcess show={showDownloadProcess} setShow={setShowDownloadProcess}/>
           <VideoIntro show={showVideo} setShow={setShowVideo}/>

           <div onClick={()=>{

            data._scrollToSection('home')

            }} className={`bg-[#ff4800] ${data.scrollY > 300 ? 'opacity-1':' translate-y-[100px]'} transition ease-in cursor-pointer hover:opacity-90 w-[40px] h-[40px] fixed right-3 bottom-3 z-20 rounded-full flex items-center justify-center`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg></div>

               <div id="home">
                    <div className="w-full h-[100vh] bg-[#ff7626] flex items-center justify-center flex-col px-7">
                        <h2 className="lg:text-[70px] md:text-[50px] max-md:text-[35px] max-w-[900px] mx-auto text-center text-white font-bold p-0 mt-4">ProConta - Seu negócio sempre na mão</h2>
                        
                        <p className="text-white opacity-70 my-6 mx-auto max-w-[700px] text-center">At FinFlow, we are dedicated to providing our clients with a professional and reliable Forex trading experience.</p>
                        
                        <span onClick={()=>{
                            navigate('/login')
                        }} className="text-gray-700  my-5 mb-8  sm:hidden text-[16px] inline-table px-5 py-3 rounded-full bg-white  hover:bg-yellow-500 hover:scale-[1.1] transition-all duration-75 ease-linear cursor-pointer">
                            {t('common.login')}
                        </span>
                         
                        <div className="md:min-w-[500px] max-sm:flex-col max-sm:w-full rounded-[0.3rem] sm:rounded-full bg-white p-1 flex items-center">
                            <div className="w-full flex items-center h-[50px]">
                                <span className="pl-3"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg></span>
                                <input onChange={(e=>(
                                    data.setForm({...data.form,email1:e.target.value})
                                ))} value={data.form.email1} placeholder="seunome@empresa.com" className="outline-none flex-1 px-3 bg-transparent" />
                            
                            </div>
                            <button onClick={validate_email} className="px-7 sm:h-full h-[40px] max-sm:w-full  rounded-[0.3rem] hover:scale-[1.1] transition-all duration-100 sm:rounded-full bg-black text-white">Registar</button>
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
                    <div className="w-[80%] translate-y-[-20px] mx-auto rounded-[1rem] overflow-hidden intro-image-div z-10 relative">
                        <img className="w-full" src={IntroImage}/>
                        <a href="#">
                            <div onClick={()=>setShowVideo(true)} className="play-btn w-[70px] h-[70px] rounded-full bg-red-500 absolute top-[50%] left-[50%] flex items-center justify-center">
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
                            <h2 className="text-[20px]  font-semibold  mb-5 uppercase text-[#ff7626]">Advanced Algorithmic Trading</h2>
                            <h3 className="text-[36px]  font-semibold mb-6">Smarter investing made simple</h3>
                            <p className="text-gray-400 text-[17px]">The industry-leading trading platform, offering advanced charting tools, real-time market data, and customizable indicators.</p>
                        
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
                          <div className="w-[55px] h-[55px] rounded-full border-[3px] bg-app_primary-300 border-white t-avatar">

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





               <div className="px-7">

                      <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">FAQ</h3>
                      <div className="max-w-[700px] mx-auto">
                          {faq.map((i,_i)=>(
                                <div className={`faq-item ${openFaq==_i ?'active' :''}`}>
                                  <div className={`flex rounded-[0.3rem] justify-between p-3 cursor-pointer hover:bg-white ${openFaq==_i ?'bg-white' :''}`}  onClick={()=>{
                                        if(openFaq != _i) {
                                        setOpenFaq(_i)
                                        }else{
                                        setOpenFaq(null)
                                        }
                                  }}>
                                        <h3 className=" font-semibold">{i.title}</h3>
                                        <div>
                                            {openFaq==_i && <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M200-440v-80h560v80H200Z"/></svg>}
                                            {openFaq!=_i && <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>}
                                        </div>
                                  </div>
                                  <div className="p-3 faq-content">
                                     <p className="text-[15px]">{i.content}</p>
                                  </div>
                            </div>
                          ))}
                      </div>
               </div>


               <div id="support" className="w-full px-7 flex-col items-center pb-[200px] bg-[#ff7626] flex   mt-20">
                       
                        <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 text-white  max-md:text-[27px] mt-20">Have more questions? Don’t hesitate to reach us</h3>
                       
                        <div className="flex items-center mb-5">                
                              <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" fill={'#ddd'}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                              <span className="text-white ml-3 text-[20px]"><a href="mailto:hello@proconta.com">hello@proconta.com</a></span>
                        </div>
                        <div className="flex items-center mb-2">                
                              <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" fill="#ddd"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                              <span className="text-white ml-3 text-[20px]"><a href="mailto:hello@proconta.com">+258 856462304</a></span>
                        </div>

                     
               </div>










        







     </div>
    </DefaultLayout>
  )
}

export default index