import { createContext, useContext,useState,useEffect, useRef} from 'react';
import axios from 'axios';
import Preloader from '../landingpage/assets/icon-2.png'
import html2pdf from 'html2pdf.js';

import _Img1 from '../landingpage/assets/images/forex.webp'
import _Img2 from '../landingpage/assets/images/app-store.png'
import _Img3 from '../landingpage/assets/images/google-play.png'
import _Img4 from '../landingpage/assets/images/intro.png'
import _Img5 from '../landingpage/assets/icon.png'
import _Img6 from '../landingpage/assets/main-logo.png'

const HomeDataContext = createContext();
export const HomeDataProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const imageUrls = [_Img1,_Img2,_Img3,_Img4,_Img5,_Img6];
    const [isPreloaderLoaded, setIsPreloaderLoaded] = useState(false);
    const [passedSeconds,setPassedSeconds]=useState(0)
    const [formUpdater,setFormUpdater]=useState(Math.random())
    const [invoices,setinvoices]=useState([])
    const [resetUpdater,setResetUpdater]= useState()
    const [imagesLoadedItems, setImagesLoadedItems] = useState([])
    const count_ref=useRef(0)
    const env="pro"
    const plataform_url= env=="dev" ? 'http://localhost:5173' : 'https://proconta.alinvest-group.com'
    const server_url= env=="dev" ? 'http://localhost:4000' : 'https://procontadev.alinvest-group.com'
    const APP_BASE_URL= env=="dev" ? 'http://localhost:4000' : 'https://procontadev.alinvest-group.com' 
    
    const [dialogs,setDialogs]=useState({
        download:false,
        register:false
    })

    const [loading,setLoading] = useState(false)

    let initial_form={
        done:0,
        name:'',
        email:'',
        contact:'',
        nuit:'',
        company_name:'',
        nuit:'',
        email1:'',
        code:'',
        key:'',
        method:null,
        proof_ok:false,
        email_is_registered:false,
        invoice:{payment_items: [
          {name:'Pro Conta',quantity:1,price:75000}
        ]} 
    }

    const [key,setkey]=useState('')

    function register(){
      setForm({...form,email:form.email1,done:form.email==form.email1 ? form.done : 0,name:'',proof_ok:false,method:null})
      setDialogs({...dialogs,register:true,download:false})
    }

    function  reset(){
      let f=JSON.parse(JSON.stringify(form))
      setForm(initial_form)
      saveLocal(initial_form)
      setResetUpdater(Math.random())
    }

    const retryDelay = 3000
    const maxRetries = 3; 

    useEffect(() => {

      if(!isLoading || !isPreloaderLoaded) return

      const timer = setTimeout(() => {
          setPassedSeconds(prev=> prev+1 )
      }, 1000);
      
      return () => clearTimeout(timer);
    }, [passedSeconds]);



    const downloadPDF = (id,name) => {

      const element = document.getElementById(id);
      const options = {
        margin: 1,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
  
      html2pdf().from(element).set(options).save();

    };

    useEffect(() => { 
      let timer= setInterval(() => {
           count_ref.current=parseInt(count_ref.current) + 1
           if(count_ref.current >= 20 && !isPreloaderLoaded && window.location.pathname=="/"){
                 //window.location.reload()
           }
      }, 1000);
    }, []);


    const preloadImage = (url, retries = 0) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = ()=>{
          if(imagesLoadedItems.length < imageUrls.length) setImagesLoadedItems(prev=>([...prev.filter(i=>i!=url),url]))
          resolve()
        };
        img.onerror = () => {
          if (retries < maxRetries) {
            setTimeout(() => {
              preloadImage(url, retries + 1).then(resolve).catch(reject);
            }, retryDelay);
          } else {
            reject();
          }
        };
      });
    };


      useEffect(() => {
        let isMounted = true;

        const loadPreloader = async () => {
          try {
            await preloadImage(Preloader,10);
            if (isMounted) {
            //  setIsPreloaderLoaded(true);
            }
          } catch (error) {
            console.error('Failed to load preloader GIF:', error);
          }
        };


        const loadImages = async () => {
          try {
            await Promise.all(imageUrls.map((url) => preloadImage(url)));
           
             /*if (isMounted) {
              let delay=passedSeconds < 3 ? 3000 : 0
              setTimeout(()=>{
                setImagesLoaded(true);
                setIsLoading(false);
              },delay)
            }*/

          
          
          } catch (error) {
            console.error('Failed to load images:', error);
          }
        };
    
        loadPreloader().then(loadImages);
    
        return () => {
          isMounted = false;
        };
      }, [imageUrls]);

     
      useEffect(()=>{

        if(imagesLoadedItems.length >= imageUrls.length){
           setTimeout(()=> setIsPreloaderLoaded(true),3000)
           _scrollToSection('top','instant')
        }

      },[imagesLoadedItems])

      const _scrollToSection = (to,instant) => {
      
          const Section = document.getElementById(to);
          console.log({to,Section})
          if (Section) {
            Section.scrollIntoView({ behavior: (to=="home" || to=="features" || to=="plans" || to=="support") && !instant ? 'smooth':'instant' });
          }else{
            setTimeout(()=>_scrollToSection(to),1000)
          }

      }


  const [initialized, setInitialized] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [form, setForm] = useState(initial_form); 

  const handleScroll = () => {
     setScrollY(window.scrollY)
  };

 
  useEffect(() => {

    if(!localStorage.getItem('form')){
       let f=JSON.stringify(initial_form)
       localStorage.setItem('form',f.done==2 ? initial_form : f)
    }else{
       let f=JSON.parse(localStorage.getItem('form'))
       if(f.restart){
        setForm(initial_form)
       }else{
        setForm(f)
       }
    }

    setInitialized(true)

    handleScroll()
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


 

  function saveLocal(formData){
    localStorage.setItem('form',JSON.stringify(formData || form))

  }

 

  function update(formData){
    setForm(formData)
    saveLocal({...formData,method:null})
  }


  useEffect(()=>{
      setFormUpdater(Math.random())
  },[form])


 function _cn(number){
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number)  
  }

  const value = {
    imagesLoadedItems,
    imageUrls,
    _scrollToSection,
    scrollY,
    initialized,
    form,
    setForm,
    dialogs,
    setDialogs,
    formUpdater,
    update,
    _cn,
    saveLocal,
    makeRequest,
    APP_BASE_URL,
    isLoading,
    isPreloaderLoaded,
    server_url,
    downloadPDF,
    register,
    loading,
    invoices,
    key,
    plataform_url,
    setkey,
    resetUpdater,
    setLoading,
    reset,
  };

  

  async function makeRequest(options={data:{},method:'get'},maxRetries = 200, retryDelay = 3000) {
  
    let postData=options.data ? options.data : {}
   
    try {
     let response 
     let headers={
      'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
     }

     if(options.method=="post") {
          response = await axios.post(`${APP_BASE_URL}/`+options.url,postData,{headers}); 
     }else if(options.method=="delete"){
          response = await axios.delete(`${APP_BASE_URL}/`+options.url,{headers});
     }else{
          response = await axios.get(`${APP_BASE_URL}/`+options.url,{headers});
     }
      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);

      if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay)); 
            return makeRequest(options, maxRetries - 1, retryDelay); 
      } else {
            throw error; 
      }
       
    }
}
  return <HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>;
};

export const useHomeData = () => {
   return useContext(HomeDataContext);
};