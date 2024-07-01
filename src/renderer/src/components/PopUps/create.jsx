import * as React from 'react';
import CreatePaymentMethod from '../../pages/settings/payment-methods/create'
import { useData } from '../../contexts/DataContext';
import CreateAccounts from '../../pages/settings/accounts/create'
import CreateRegister from '../../pages/register/create'

export default function CreatePopUp() {
const data=useData()
  return (
   <>
        {data._openCreatePopUp=="payment_methods" && <CreatePaymentMethod isPopUp={true}/>}
        {data._openCreatePopUp=="accounts" && <CreateAccounts isPopUp={true}/>}
        {data._openCreatePopUp=="register" && <CreateRegister isPopUp={true}/>}
   </>
  );
}
