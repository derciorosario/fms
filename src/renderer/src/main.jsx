//import './assets/main.css'
import '../../styles/tailwind.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import {HomeDataProvider} from './contexts/HomeDataContext'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <DataProvider>
                <HomeDataProvider>
                    <Toaster/>
                    <App />
                </HomeDataProvider>
       </DataProvider>
   </AuthProvider>
)






