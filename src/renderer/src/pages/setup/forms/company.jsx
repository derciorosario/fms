import React, { useState } from 'react';
import VerifiedIcon from '../compnents/valid-icon';
import MainUploader from '../compnents/upload-company-logo';
import _var from '../../../assets/vaiables.json'

function FirstUsePerson({formData,setFormData,setUpload,upload}) {


  return (
    <>

        <div class="md:col-span-5">
            <label for="full_name">Nome da empresa</label>
           <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,company:{...formData.company,name:e.target.value}})} value={formData.company.name} name="name"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.company.name.length >= 2 && <VerifiedIcon/> }
           </div>
        </div>

        <div class="md:col-span-5">
            <label for="email">Email </label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,company:{...formData.company,email:e.target.value.replaceAll(' ','')}})} value={formData.company.email} name="state"  placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company.email.trim())) && <VerifiedIcon/> }
           </div>
        </div>

        <div class={`md:col-span-3  ${formData.company.contact_code!="258" ? 'hidden':''}`}>
            <label for="address">Nuit </label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,company:{...formData.company,nuit:e.target.value.toString().length  <= 9 && !isNaN(e.target.value) ?  e.target.value : formData.company.nuit}})} value={formData.company.nuit}  id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.company.nuit.length == 9   && <VerifiedIcon/> }
           </div>
        </div>

        <div class="md:col-span-2">
            <label for="state">Contacto </label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                   <select onChange={(e)=>setFormData({...formData,company:{...formData.company,contact_code:e.target.value}})} value={formData.contact_code} className="bg-transparent">
                        {_var.contry_codes.map(i=>(
                            <option selected={formData.company.contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                        ))}
                  </select>
                  <input onChange={(e)=>setFormData({...formData,company:{...formData.company,contact:e.target.value.toString().length  <= 9 ?  e.target.value : formData.company.contact}})} value={formData.company.contact} name="state" id="state" type="number" placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.company.contact.length == 9 && <VerifiedIcon/> }
           </div>
        </div>
       
        <div class="md:col-span-3">
            <label for="address">Enderenço </label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,company:{...formData.company,address:e.target.value}})} value={formData.company.address} name="state" id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.company.address.length >= 3 && <VerifiedIcon/> }
           </div>
        </div>

        <div class={`md:col-span-2 ${formData.company.contact_code!="258" ? 'hidden':''}`}>
            <label for="state">Provincia / Cidade </label>
            <div class="h-10 bg-gray-50  flex border border-gray-200 rounded items-center mt-1">
            <select onChange={(e)=>setFormData({...formData,company:{...formData.company,state:e.target.value}})} value={formData.company.state} className="w-full h-full px-2">
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
                {formData.company.state && <VerifiedIcon/> }
            </div>
        </div>




       <MainUploader setUpload={setUpload} upload={upload} formData={formData} setFormData={setFormData}/>
       

       


    </>

           
  )

}

export default FirstUsePerson

