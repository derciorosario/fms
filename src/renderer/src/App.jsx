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

export default App*/

import React from 'react';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import Home from './pages/dashboard/index';
import BillsToPay from './pages/payments/bills-to-pay/index'
import CreateBillsToPay from './pages/payments/bills-to-pay/create'
import BillsToReceive from './pages/payments/bills-to-receive/index'
import Clients from './pages/register/clients/index'
import CreateClient from './pages/register/clients/create'
import Sullpiers from './pages/register/suppliers/index'
import CreateSupplier from './pages/register/suppliers/create'
import Managers from './pages/register/managers/index'
import CreateManager from './pages/register/managers/create'
import Login from './pages/login/index'
import ProtectedRoute from './components/ProjectedRoute'
import Admin from './pages/admin'



function App() {
  return (

    <HashRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute redirectTo="/login"> <Home/></ProtectedRoute>} />
        <Route path="/bills-to-pay" element={<ProtectedRoute redirectTo="/login"> <BillsToPay/></ProtectedRoute>} />
        <Route path="/bills-to-receive" element={<ProtectedRoute redirectTo="/login"> <BillsToReceive/> </ProtectedRoute>} />
        <Route path="/bills-to-pay/create" element={<ProtectedRoute redirectTo="/login"> <CreateBillsToPay/> </ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute redirectTo="/login"> <Clients/> </ProtectedRoute>} />
        <Route path="/clients/create" element={<ProtectedRoute redirectTo="/login"> <CreateClient/> </ProtectedRoute>} />
        <Route path="/managers" element={<ProtectedRoute redirectTo="/login"> <Managers/> </ProtectedRoute>} />
        <Route path="/manager/:id" element={<ProtectedRoute redirectTo="/login"> <CreateManager/> </ProtectedRoute>} />
        <Route path="/client/:id" element={<ProtectedRoute redirectTo="/login"> <CreateClient/> </ProtectedRoute>} />
        <Route path="/supplier/:id" element={<ProtectedRoute redirectTo="/login"> <CreateSupplier/> </ProtectedRoute>} />
        <Route path="/managers/create" element={<ProtectedRoute redirectTo="/login"> <CreateManager/> </ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute redirectTo="/login"> <Sullpiers/> </ProtectedRoute>} />
        <Route path="/suppliers/create" element={<ProtectedRoute redirectTo="/login"> <CreateSupplier/> </ProtectedRoute>} />
        <Route path="/login" element={ <Login/>} />
        <Route path="/admin" element={ <Admin/>} />
        <Route path="/logout" element={<ProtectedRoute redirectTo="/logout">  </ProtectedRoute>} />
      </Routes>

    </HashRouter>

  );
}

export default App;


