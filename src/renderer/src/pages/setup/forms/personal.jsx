import React, { useState } from 'react';
import VerifiedIcon from '../compnents/valid-icon';
import _var from '../../../assets/vaiables.json'

function FirstUsePerson({formData,setFormData,useExistingAccount,IsRegister}) {

    console.log({f:formData.personal})

  return (
    <>

         {!useExistingAccount && <div class="md:col-span-3">
            <label for="full_name">Nome</label>
           <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,name:e.target.value}})} value={formData.personal.name} name="name"  placeholder="Seu nome" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.name.trim().length >= 2 && <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount && <div class="md:col-span-2">
            <label for="full_name">Apelido</label>
           <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,last_name:e.target.value}})} value={formData.personal.last_name} name="name"  placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.last_name.trim().length >= 2 && <VerifiedIcon/> }
           </div>
        </div>}

        <div class={`${useExistingAccount ? 'md:col-span-3':'md:col-span-5'}`}>
            <label for="email">Email</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input disabled={IsRegister} onChange={(e)=>setFormData({...formData,personal:{...formData.personal,email:e.target.value.replaceAll(' ','')}})} value={formData.personal.email} name="state"  placeholder={`${useExistingAccount ?'Email registrado':''}`} style={{opacity:IsRegister ? '0.4':'1'}} class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())) && <VerifiedIcon/> }
           </div>
        </div>

        <div class="md:col-span-3">
            <label for="address">{useExistingAccount ? 'Senha' : 'Nova senha'}</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,password:e.target.value.replaceAll(' ','')}})} value={formData.personal.password} placeholder="Deve ter pelo menos 8 caracteres" id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.password.length >= 8  && <VerifiedIcon/> }
           </div>
        </div>

        {!useExistingAccount &&  <div class="md:col-span-2">
            <label for="state">Contacto</label>
           
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <select onChange={(e)=>setFormData({...formData,personal:{...formData.personal,contact_code:e.target.value}})} value={formData.contact_code} className="bg-transparent">
                        {_var.contry_codes.map(i=>(
                            <option selected={formData.personal.contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                        ))}
                  </select>
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,contact:e.target.value.toString().length  <= 9 ?  e.target.value : formData.personal.contact}})} type="number" value={formData.personal.contact} name="state" id="state" placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {(formData.personal.contact.length == 9) &&  <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount &&  <div class="md:col-span-3">
            <label for="address">Enderenço</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,address:e.target.value}})} value={formData.personal.address} name="state" id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.address.length >= 3 && <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount &&  <div class={`md:col-span-2 ${formData.personal.contact_code!="258" ? 'hidden':''}`}>
            <label for="state">Provincia / Cidade</label>
            <div class="h-10 bg-gray-50  flex border border-gray-200 rounded items-center mt-1">
                <select onChange={(e)=>setFormData({...formData,personal:{...formData.personal,state:e.target.value}})} value={formData.personal.state} className="w-full h-full px-2">
                        <option selected value="" disabled>Selecione</option>
                        <option value="maputo">Maputo</option>
                        <option value="maputo-provincia">Maputo (Província)</option>
                        <option value="gaza">Gaza</option>
                        <option value="inhambane">Inhambane</option>
                        <option value="sofala">Sofala</option>
                        <option value="manica">Manica</option>
                        <option value="tete">Tete</option>
                        <option value="zambezia">Zambézia</option>
                        <option value="nampula">Nampula</option>
                        <option value="niassa">Niassa</option>
                        <option value="cabo-delgado">Cabo Delgado</option>
                        <option value="matola">Matola</option>
                        <option value="xai-xai">Xai-Xai</option>
                        <option value="inhambane-cidade">Inhambane (Cidade)</option>
                        <option value="beira">Beira</option>
                        <option value="chimoio">Chimoio</option>
                        <option value="tete-cidade">Tete (Cidade)</option>
                        <option value="quelimane">Quelimane</option>
                        <option value="nampula-cidade">Nampula (Cidade)</option>
                        <option value="pemba">Pemba</option>
                        <option value="lichinga">Lichinga</option>
                </select>
                {formData.personal.state && <VerifiedIcon/> }
            </div>
        </div>}

       

       


    </>

           
  )

}

export default FirstUsePerson

