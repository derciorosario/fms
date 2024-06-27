import * as React from 'react';
import CreatePaymentMethod from '../../pages/settings/payment-methods/create'
import { useData } from '../../contexts/DataContext';
export default function CreatePopUp() {
const data=useData()
  return (
   <>
        {data._openCreatePopUp=="payment_methods" && <CreatePaymentMethod isPopUp={true}/>}
   </>
  );
}
