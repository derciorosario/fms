import React, { useState } from 'react';
import VerifiedIcon from '../compnents/valid-icon';
import _var from '../../../assets/vaiables.json'
import { t } from 'i18next';

function FirstUsePerson({formData,setFormData,useExistingAccount,IsRegister,exists}) {

  const [showPassword,setShowPassword]=useState(false)

  return (
    <>

         {!useExistingAccount && <div class={`md:col-span-3 ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="full_name">{t('common.name')}</label>
           <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,name:e.target.value}})} value={formData.personal.name} name="name"  placeholder="Seu nome" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.name.trim().length >= 2 && <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount && <div class={`md:col-span-2 ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="full_name">{t('common.surname')}</label>
           <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,last_name:e.target.value}})} value={formData.personal.last_name} name="name"  placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.last_name.trim().length >= 2 && <VerifiedIcon/> }
           </div>
        </div>}

        <div class={`${useExistingAccount ? 'md:col-span-3':'md:col-span-5'} ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="email">Email</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1 opacity-70">
                  <input disabled={true} onChange={(e)=>setFormData({...formData,personal:{...formData.personal,email:e.target.value.replaceAll(' ','')}})} value={formData.personal.email} name="state"  placeholder={`${useExistingAccount ?'Email registrado':''}`} style={{opacity:IsRegister ? '0.4':'1'}} class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())) && <VerifiedIcon/> }
           </div>
        </div>

        {!exists && <div class={`md:col-span-3 relative`}>
            <label for="address">{useExistingAccount ? t('common.password') : t('common.new-password')}</label>
            <label onClick={()=>setShowPassword(!showPassword)} className="absolute top-0 cursor-pointer hover:underline right-0 text-blue-400 text-[0.8rem]">{t(`common.${showPassword ? 'hide-password':'show-password'}`)}</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input type={showPassword ? 'text':'password'} onChange={(e)=>setFormData({...formData,personal:{...formData.personal,password:e.target.value.replaceAll(' ','')}})} value={formData.personal.password} placeholder={t('common.password-was-to-have-more-than-8')} id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.password.length >= 8  && <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount &&  <div class={`md:col-span-2 ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="state">{t('common.contact')}</label>
           
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <select onChange={(e)=>setFormData({...formData,personal:{...formData.personal,contact_code:e.target.value}})} value={formData.contact_code} className="bg-transparent pointer-events-none">
                        {_var.contry_codes.map(i=>(
                            <option selected={formData.personal.contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                        ))}
                  </select>
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,contact:e.target.value.toString().length  <= 9 ?  e.target.value : formData.personal.contact}})} type="number" value={formData.personal.contact} name="state" id="state" placeholder="" class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {(formData.personal.contact.length == 9) &&  <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount &&  <div class={`md:col-span-3 ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="address">{t('common.address')}</label>
            <div class="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                  <input onChange={(e)=>setFormData({...formData,personal:{...formData.personal,address:e.target.value}})} value={formData.personal.address} name="state" id="state"  class="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                  {formData.personal.address.length >= 3 && <VerifiedIcon/> }
           </div>
        </div>}

        {!useExistingAccount &&  <div class={`md:col-span-2 ${formData.personal.contact_code!="258" ? 'hidden':''} ${exists ? 'opacity-65  pointer-events-none':''}`}>
            <label for="state">{t('common.city-or-pronvice')}</label>
            <div class="h-10 bg-gray-50  flex border border-gray-200 rounded items-center mt-1">
                <select onChange={(e)=>setFormData({...formData,personal:{...formData.personal,state:e.target.value}})} value={formData.personal.state} className="w-full h-full px-2">
                        <option selected value="" disabled>{t('common.select')}</option>
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

