//import './assets/main.css'
import '../../styles/tailwind.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SearchProvider } from './contexts/SearchContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <SearchProvider>
        <DataProvider>
            
                <Toaster/>
                <App />
            
       </DataProvider>
       </SearchProvider>
   </AuthProvider>
)






