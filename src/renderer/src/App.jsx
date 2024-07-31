/*import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App

*/



import React from 'react';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import Home from './pages/dashboard/index';
import BillsToPay from './pages/payments/bills-to-pay/index'
import BillsToReceive from './pages/payments/bills-to-receive/index'
import CreateBills from './pages/payments/bills/create'




import CreateClientSupplierInvestor from './pages/register/create'

import Clients from './pages/register/clients/index'

import Sullpiers from './pages/register/suppliers/index'

import Investors from './pages/register/investors/index'

import Managers from './pages/settings/managers/index'
import CreateManager from './pages/settings/managers/create'

import Companies from './pages/companies/index'
import CreateCompanies from './pages/companies/create'

import InflowsPage from './pages/cash-management/inflows/index'
import OutflowsPage from './pages/cash-management/outflows/index'
import CreateTransation from './pages/cash-management/transations/create'

import CashManagementAccounts from './pages/cash-management/accounts/index'
import CreateCashManagementAccount from './pages/cash-management/accounts/create'


import AccountCategories from './pages/settings/account-categories/index'

import Accounts from './pages/settings/accounts/index'
import CreateAccounts from './pages/settings/accounts/create/'

import PaymentMethods from './pages/settings/payment-methods/index'
import CreatePaymentMethods from './pages/settings/payment-methods/create/'

import CashManagementReports from './pages/reports/cash-management/index'

import DREReports from './pages/reports/dre/index'

import Login from './pages/login/index'

import FinancialReconciliation from './pages/financial-reconciliation/index'

import Investments from './pages/investments/index'

import BudgetManagement from './pages/budget-management/index'
import BudgetManagementReports from './pages/budget-management/reports'

import CreateBudgetManagement from './pages/budget-management/create'
import CreateInvestments from './pages/investments/create'

import CreateLoans from './pages/loans/create'
import Loans from './pages/loans/index'


import ProtectedRoute from './components/ProjectedRoute'

import Admin from './pages/admin'
import FirstStart from './pages/setup/index'

import UserPreferences from './pages/user-preferences/index'

import NotFound from './pages/404/index';


function App() {

  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  React.useEffect(() => {
    
       //console.log(ipcMain)
  
  }, []);

  return (

    <HashRouter>
      <Routes>

        <Route path="/" element={<ProtectedRoute redirectTo="/login"> <Home/></ProtectedRoute>} />
        <Route path="/bills-to-pay" element={<ProtectedRoute redirectTo="/login"> <BillsToPay/></ProtectedRoute>} />
        <Route path="/bills-to-receive" element={<ProtectedRoute redirectTo="/login"> <BillsToReceive/> </ProtectedRoute>} />
        <Route path="/bills-to-pay/create" element={<ProtectedRoute redirectTo="/login"> <CreateBills/> </ProtectedRoute>} />
        <Route path="/bills-to-pay/:id" element={<ProtectedRoute redirectTo="/login"> <CreateBills/> </ProtectedRoute>} />
        <Route path="/bills-to-receive/create" element={<ProtectedRoute redirectTo="/login"> <CreateBills/> </ProtectedRoute>} />
        <Route path="/bills-to-receive/:id" element={<ProtectedRoute redirectTo="/login"> <CreateBills/> </ProtectedRoute>} />
    
        <Route path="/account-categories" element={<ProtectedRoute redirectTo="/login"> <AccountCategories/> </ProtectedRoute>} />
        <Route path="/account/:id" element={<ProtectedRoute redirectTo="/login"> <CreateAccounts/> </ProtectedRoute>} />
        <Route path="/accounts/create" element={<ProtectedRoute redirectTo="/login"> <CreateAccounts/> </ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute redirectTo="/login"> <Accounts/> </ProtectedRoute>} />
        <Route path="/payment-methods/:id" element={<ProtectedRoute redirectTo="/login"> <CreatePaymentMethods/> </ProtectedRoute>} />
        <Route path="/payment-methods/create" element={<ProtectedRoute redirectTo="/login"> <CreatePaymentMethods/> </ProtectedRoute>} />
        <Route path="/payment-methods" element={<ProtectedRoute redirectTo="/login"> <PaymentMethods/> </ProtectedRoute>} />

        <Route path="/financial-reconciliation" element={<ProtectedRoute redirectTo="/login"> <FinancialReconciliation/> </ProtectedRoute>} />
      

        <Route path="/companies" element={<ProtectedRoute redirectTo="/login"> <Companies/> </ProtectedRoute>} />
        <Route path="/company/:id" element={<ProtectedRoute redirectTo="/login"> <CreateCompanies/> </ProtectedRoute>} />
        <Route path="/companies/create" element={<ProtectedRoute redirectTo="/login"> <CreateCompanies/> </ProtectedRoute>} />
        

        <Route path="/user-preferences" element={<ProtectedRoute redirectTo="/login"> <UserPreferences/> </ProtectedRoute>} />

        
        <Route path="/investments" element={<ProtectedRoute redirectTo="/login"> <Investments/> </ProtectedRoute>} />
        <Route path="/investments/create" element={<ProtectedRoute redirectTo="/login"> <CreateInvestments/> </ProtectedRoute>} />
        <Route path="/investments/:id" element={<ProtectedRoute redirectTo="/login"> <CreateInvestments/> </ProtectedRoute>} />

        <Route path="/loans" element={<ProtectedRoute redirectTo="/login"> <Loans/> </ProtectedRoute>} />
        <Route path="/loans/create" element={<ProtectedRoute redirectTo="/login"> <CreateLoans/> </ProtectedRoute>} />
        <Route path="/loans/:id" element={<ProtectedRoute redirectTo="/login"> <CreateLoans/> </ProtectedRoute>} />
        
        <Route path="/budget-management" element={<ProtectedRoute redirectTo="/login"> <BudgetManagement/> </ProtectedRoute>} />
        <Route path="/budget-management/create" element={<ProtectedRoute redirectTo="/login"> <CreateBudgetManagement/> </ProtectedRoute>} />
        <Route path="/budget-management/:id" element={<ProtectedRoute redirectTo="/login"> <CreateBudgetManagement/> </ProtectedRoute>} />
        <Route path="/budget-management/reports" element={<ProtectedRoute redirectTo="/login"> <BudgetManagementReports/> </ProtectedRoute>} />
        
        <Route path="/clients" element={<ProtectedRoute redirectTo="/login"> <Clients/> </ProtectedRoute>} />
        <Route path="/clients/create" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />
        <Route path="/managers" element={<ProtectedRoute redirectTo="/login"> <Managers/> </ProtectedRoute>} />
        <Route path="/manager/:id" element={<ProtectedRoute redirectTo="/login"> <CreateManager/> </ProtectedRoute>} />
        <Route path="/client/:id" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />
        <Route path="/supplier/:id" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />
        <Route path="/managers/create" element={<ProtectedRoute redirectTo="/login"> <CreateManager/> </ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute redirectTo="/login"> <Sullpiers/> </ProtectedRoute>} />
        <Route path="/suppliers/create" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />
        <Route path="/investors" element={<ProtectedRoute redirectTo="/login"> <Investors/> </ProtectedRoute>} />
        <Route path="/investors/create" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />
        <Route path="/investor/:id" element={<ProtectedRoute redirectTo="/login"> <CreateClientSupplierInvestor/> </ProtectedRoute>} />



        <Route path="/cash-management/inflow" element={<ProtectedRoute redirectTo="/login"> <InflowsPage/> </ProtectedRoute>} />
        <Route path="/cash-management/outflow" element={<ProtectedRoute redirectTo="/login"> <OutflowsPage/> </ProtectedRoute>} />
        <Route path="/cash-management/inflow/create" element={<ProtectedRoute redirectTo="/login"> <CreateTransation/> </ProtectedRoute>} />
        <Route path="/cash-management/outflow/create" element={<ProtectedRoute redirectTo="/login"> <CreateTransation/> </ProtectedRoute>} />
        <Route path="/cash-management/inflow/:id" element={<ProtectedRoute redirectTo="/login"> <CreateTransation/> </ProtectedRoute>} />
        <Route path="/cash-management/outflow/:id" element={<ProtectedRoute redirectTo="/login"> <CreateTransation/> </ProtectedRoute>} />
        <Route path="/cash-management/accounts" element={<ProtectedRoute redirectTo="/login"> <CashManagementAccounts/> </ProtectedRoute>} />
        <Route path="/cash-management/account/create" element={<ProtectedRoute redirectTo="/login"> <CreateCashManagementAccount/> </ProtectedRoute>} />
        <Route path="/cash-management/account/:id" element={<ProtectedRoute redirectTo="/login"> <CreateCashManagementAccount/> </ProtectedRoute>} />
       
        
        <Route path="reports/cash-management/monthly" element={<ProtectedRoute redirectTo="/login"> <CashManagementReports/> </ProtectedRoute>} />
        <Route path="reports/cash-management/daily" element={<ProtectedRoute redirectTo="/login"> <CashManagementReports/> </ProtectedRoute>} />
        <Route path="reports/dre/monthly" element={<ProtectedRoute redirectTo="/login"> <DREReports/> </ProtectedRoute>} />
        <Route path="reports/dre/daily" element={<ProtectedRoute redirectTo="/login"> <DREReports/> </ProtectedRoute>} />
        <Route path="reports/dre" element={<ProtectedRoute redirectTo="/login"> <DREReports/> </ProtectedRoute>} />
        
        
        <Route path="/reset" element={<ProtectedRoute redirectTo="/reset"> <Home/></ProtectedRoute>} />
    
        <Route path="/login" element={ <Login/>} />
        <Route path="/recover-password" element={ <Login/>} />
        <Route path="/admin" element={ <Admin/>} />
        <Route path="/new-company" element={ <FirstStart/>} />
        <Route path="/confirm-invite" element={ <FirstStart/>} />
        <Route path="/logout" element={<ProtectedRoute redirectTo="/logout">  </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </HashRouter>

  );
}

export default App;


