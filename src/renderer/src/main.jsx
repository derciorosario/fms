//import './assets/main.css'
import '../../styles/tailwind.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from 'react-hot-toast';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <DataProvider>
                <Toaster/>
                <App />
       </DataProvider>
   </AuthProvider>
)






