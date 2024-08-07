import React, { useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import CircularIndeterminate from '../../loaders/progress';
import colors from '../../../assets/colors.json'
import { useHomeData } from '../../../../contexts/HomeDataContext';

// Helper function to load external scripts
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject('Error loading script.');
    document.head.appendChild(script);
  });
};

const PayPalButton = ({method,setMedthod,activePage,setActvePage}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef(null);
  const [message,setMessage]=useState('')
  const _dataRef = useRef({});
  const d=useHomeData()
  const invoice_number=Math.random().toString().slice(2,10)
  const key=Math.random().toString().slice(3,15)
  function paymentSuccessfully(){
       d.setForm({...d.form,done:2,invoice:{
        id:null,
        approved:false,
        proof:null,
        key,
        to_name:d.form.name,
        to_email:d.form.email,
        invoice_number: invoice_number,
        payment_method:'Paypal',
        date:new Date().toISOString(),
        payment_items: [
          {name:'Conta Pro',quantity:1,price:75000}
        ]
       }})
       setActvePage(activePage + 1)
       d.setkey(key)
       localStorage.setItem('form',JSON.stringify({...d.form,restart:true}))

  }


  

  useEffect(() => {
       _dataRef.current={
         name:d.form.name,
         email:d.form.email,
         email_is_registered:d.email_is_registered
       }
  }, [d.form])

  useEffect(() => {
    d.setLoading(true)
  }, [])



  useEffect(() => {
    const paypalSdkUrl = "https://www.paypal.com/sdk/js";
    const clientId = "AXJKJcDXlH8mKhbcdQQHTAsotX-s7w5oMtsOJVsGAARUUhUDfBfSKCHxd6rP36m-qsyY8-cc0fk_K0OR";
    const currency = "USD";
    const intent = "capture";

    loadScript(`${paypalSdkUrl}?client-id=${clientId}&enable-funding=venmo&currency=${currency}&intent=${intent}`)
      .then(() => {
        setPaypalLoaded(true)
        d.setLoading(false)
    })

    .catch(error => console.error(error));
  }, [])

  useEffect(() => {
    if (paypalLoaded && window.paypal && !paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return fetch(d.APP_BASE_URL +"/api/v1/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture", "form" : {..._dataRef.current,invoice_number,method:'Paypal'} })
          })
            .then(response => response.json())
            .then(order => order.id);
        },
        onApprove: (data, actions) => {
          const orderId = data.orderID;
          return fetch(d.APP_BASE_URL +"/api/v1/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture", "order_id": orderId,"key":key,"email":_dataRef.current.email,"form" : {..._dataRef.current,invoice_number,method:'Paypal'}})
          })
            .then(response => response.json())
            .then(orderDetails => {
              const intentObject = "capture";
              console.log({orderDetails})
              window.paypal.Buttons().close();
              paymentSuccessfully(orderDetails.key)
            })
            .catch(error => {
              console.error(error);
              console.log({error})
              setMessage(t('messages.try-again'))
            });
        },
        onCancel: () => {
             setMessage(t('message.payment-cancelled'))
        },
        onError: (err) => {
          console.error(err);
        },
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal'
        }
      }).render('#payment_options');

      paypalRef.current = true;
    }
  }, [paypalLoaded]);

  // Handle close alert
  const handleClose = (event) => {
    const alertElement = event.target.closest(".ms-alert");
    if (alertElement) {
      alertElement.remove();
    }
  };

  // Add event listener for close alerts
  useEffect(() => {
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };

  }, []);



  return (
    <div className={`w-full flex items-center justify-center ${d.form.method!="Paypal" ? 'hidden':'' } transition-all duration-75 ease-in `}>
        <div className="w-[500px] flex items-center justify-center flex-col">
             <h2 className="text-center max-w-[300px] text-[23px] font-semibold mb-10">Paypal</h2>

             {message  && <div id="alert-2" className="flex items-center w-full p-4 my-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div className="ms-3 text-sm font-medium">
                            {message}
                        </div>
                        <button onClick={()=>setMessage('')} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
                            <span className="sr-only">Close</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
            </div>}

            <div id="loading"> </div>

            {(d.loading) &&
                    <div className="flex justify-center flex-col items-center my-10">
                        <div className=""><CircularIndeterminate color={colors.app_pimary[500]}/></div>
                        <span className="flex mt-4">{t('common.wait')}</span>
                    </div>
             }

            <div id="content" className={`w-[300px] flex ${d.loading ? 'opacity-0 pointer-events-none':''} justify-center flex-col`}>
                <div id="payment_options"></div>
            </div>
           
        </div>
    </div>
  );
};

export default PayPalButton;
