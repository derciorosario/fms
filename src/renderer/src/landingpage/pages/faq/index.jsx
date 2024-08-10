import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useHomeData } from '../../../contexts/HomeDataContext'

function Faq() {


    const data=useHomeData()

    const [faq,setFaq]=useState([
        {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
        {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
        {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'},
        {title:'What is Forex trading, and how does it work?',content:'Forex trading is the practice of buying and selling currencies in order to make a profit. It works by taking advantage of fluctuations in exchange rates between different currencies. For example, if you believe that the value of the US dollar will rise against the euro, you can buy dollars and sell euros. If your prediction is correct, you will make a profit.'}
      ])
    
      const [openFaq,setOpenFaq]=useState(null)

      useEffect(()=>{
        data._scrollToSection('home')
      },[])

      
  return (
    <DefaultLayout>

           <div className="w-full min-h-[200px] mt-[50px] flex items-center p-6 bg-[#ff7626]">
               <h2 className="text-white text-[31px]">FAQ</h2>
           </div>

           
           <div className="px-7 my-14">
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

    </DefaultLayout>
  )
}

export default Faq