import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../../../contexts/DataContext';

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

const PayPalButton2 = () => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const alertsRef = useRef(null);
  const paypalRef = useRef(null);
  const d=useData()

  useEffect(() => {
    const paypalSdkUrl = "https://www.paypal.com/sdk/js";
    const clientId = "AXJKJcDXlH8mKhbcdQQHTAsotX-s7w5oMtsOJVsGAARUUhUDfBfSKCHxd6rP36m-qsyY8-cc0fk_K0OR";
    const currency = "USD";
    const intent = "capture";

    // Load PayPal SDK
    loadScript(`${paypalSdkUrl}?client-id=${clientId}&enable-funding=venmo&currency=${currency}&intent=${intent}`)
      .then(() => setPaypalLoaded(true))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (paypalLoaded && window.paypal && !paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return fetch("http://localhost:4000/api/v1/paypal/create_order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture" })
          })
            .then(response => response.json())
            .then(order => {
              if (!order || !order.id) {
                throw new Error('Order ID not received from server');
              }
              return order.id;
            })
            .catch(error => {
              console.error('Error creating order:', error);
              throw new Error('Failed to create order');
            });
        },
        onApprove: (data, actions) => {
          const orderId = data.orderID;
          return fetch("http://localhost:4000/api/v1/paypal/complete_order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture", "order_id": orderId, })
          })
            .then(response => response.json())
            .then(orderDetails => {
              const intentObject = "captures";
              alertsRef.current.innerHTML = `<div class='ms-alert ms-action'>Thank you ${orderDetails.payer.name.given_name} ${orderDetails.payer.name.surname} for your payment of ${orderDetails.purchase_units[0].payments[intentObject][0].amount.value} ${orderDetails.purchase_units[0].payments[intentObject][0].amount.currency_code}!</div>`;
              window.paypal.Buttons().close();
            })
            .catch(error => {
              console.error('Error completing order:', error);
              alertsRef.current.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p></div>`;
            });
        },
        onCancel: () => {
          alertsRef.current.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p></div>`;
        },
        onError: (err) => {
          console.error('PayPal Error:', err);
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
    <div>
      <div id="loading">Loading...</div>
      <div id="content">
        <div id="payment_options"></div>
      </div>
      <div id="alerts" ref={alertsRef}></div>
    </div>
  );
};

export default PayPalButton2;
