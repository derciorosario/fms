
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DefaultLayout from '../../../layout/DefaultLayout';
import MonetizationOn from '@mui/icons-material/MonetizationOnOutlined'

function App() {
 
  return (
    <>
       <DefaultLayout details={{name:'Nova conta a pagar'}}>
               <div className="bg-white py-1 pb-5 max-w-[800px]">

               <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                  <span className="font-medium text-[18px]">Adicionar nova conta a pagar</span>
               </div>


               <div className="flex items-center px-[1rem] [&>_div]:rounded-[0.5rem] [&>_div]:min-h-[80px] [&>_div]:min-w-[110px] [&>_div]:mr-[10px] justify-start">

                     <div className="flex border items-center border-[#D9D9D9]  px-5 py-2">
                           {/*<div className="mr-3 flex items-center justify-center size-14 rounded-full bg-slate-200"><MonetizationOn style={{color:'rgb(59,130,246)',width:30,height:30}}/></div>*/} 
                            <div className="flex justify-center flex-col">
                                <span className="text-[15px] text-[#A3AED0] ">Valor em falta</span>
                                <span className="text-[19px] text-[#2B3674]">300,00MT</span>
                            </div>
                     </div>


                     <div className="flex border items-center border-[#D9D9D9]  px-5 py-3">
                            <div className="flex justify-center flex-col">
                                <span className="text-[15px] text-[#A3AED0] ">Saldo da conta</span>
                                <span className="text-[19px] text-[#2B3674]">1.400,00MT</span>
                            </div>
                     </div>


                     <div className="flex border items-center border-[#D9D9D9] px-5 py-3">
                            <div className="flex justify-center flex-col">
                                <span className="text-[15px] text-[#A3AED0] ">Estado</span>
                                <span className="text-[19px] text-[#2B3674]">Pago</span>
                            </div>
                     </div>
               </div>

               <div className="flex flex-wrap p-4 w-[100%] [&>_div]:mb-[20px] [&>_div]:mr-[20px] [&>_div]:w-[300px]">
                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Nome"
                    placeholder="Digite o nome"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>

                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Apelido"
                    placeholder="Digite o apelido"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>

                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Email"
                    placeholder="Digite o email"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>

                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Contacto"
                    placeholder="Digite o Contacto"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>


                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Nome da empresa"
                    placeholder="Digite o empresa"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>


                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Nome da empresa"
                    placeholder="Digite o empresa"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>

                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Endereço"
                    placeholder="Digite o endereço"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>

                <div>
                 <TextField
                    id="outlined-textarea"
                    label="Nuit"
                    placeholder="Digite o nuit"
                    multiline
                    sx={{width:'100%','& .MuiInputBase-root':{height:40}, '& .Mui-focused.MuiInputLabel-root': { top:0 },
                    '& .MuiFormLabel-filled.MuiInputLabel-root': { top:0},'& .MuiInputLabel-root':{ top:-8}}}
                    />
                </div>


                    
                
               </div>

               <div className="px-3">
                  <Button variant="contained">Adicionar</Button>
               </div>

               

            </div>
        </DefaultLayout>
    </>
  )
}

export default App

