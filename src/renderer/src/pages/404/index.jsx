import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate=useNavigate()
  return (
     <DefaultLayout>
          <div className="w-full h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4">
                   <span>Página não encontrada!</span>
                </div>
                <button onClick={()=>{
                    navigate('/')
                }} className="bg-app_orange-400 text-white px-3 py-2 rounded-[0.3rem] mt-3 cursor-pointer hover:opacity-75">Página inical</button>
              </div>
          </div>
     </DefaultLayout>
  )
}

export default App