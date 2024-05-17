
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DefaultLayout from '../../../layout/DefaultLayout';
function App() {
 
  return (
    <>
       <DefaultLayout details={{name:'Nova conta a pagar'}}>
            <div className="bg-white py-1 pb-5 max-w-[800px]">

               <div className="p-[15px] border-b border-zinc-300 mb-4 opacity-75">
                  <span className="font-medium text-[18px]">Adicionar nova conta a pagar</span>
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

