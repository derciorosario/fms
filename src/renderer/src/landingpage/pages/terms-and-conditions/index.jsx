import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useHomeData } from '../../../contexts/HomeDataContext'
import { t } from 'i18next'

function Terms() {


    const data=useHomeData()

      useEffect(()=>{
        data._scrollToSection('top')
      },[])

      
  return (
    <DefaultLayout>

           <div className="w-full min-h-[200px] mt-[50px] flex items-center p-6 bg-[#ff7626]">
               <h2 className="text-white text-[31px]">{t('common.terms')}</h2>
           </div>
           
           <div className="px-7 my-14">
            <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('common.terms')}</h3>    
         </div>


<div className="divide">
  <div className="left"></div>
  <div className="right">
    <div className="section-item">
      <span><strong>Última atualização:</strong> 1 de Abril de 2024</span>
      <br/><br/>
      <p>Os seguintes Termos e Condições regem o uso da plataforma de gestão financeira ProConta. Ao acessar ou utilizar nossa plataforma, você concorda com estes Termos. Se você não concorda com estes Termos, não deverá acessar ou usar a Plataforma.</p>

      <h2>1. Descrição da Plataforma</h2>
      <span>ProConta é uma plataforma web que oferece ferramentas de gestão financeira. A Plataforma permite que os usuários gerenciem suas finanças, acompanhem pagamentos, emitam relatórios e realizem cobranças automatizadas.</span>
    </div>

    <div className="section-item">
      <h2>2. Uso da Plataforma</h2>
      <span>Você concorda em usar a Plataforma de acordo com estes Termos e com as leis e regulamentos aplicáveis.</span>

      <ul>
        <li><strong>Acesso:</strong> Ao se registrar na plataforma ProConta, você receberá credenciais de acesso. É sua responsabilidade manter a confidencialidade dessas credenciais e você é responsável por todas as atividades realizadas em sua conta.</li>
      </ul>
      <span>Você não deverá:</span>
      <ul>
        <li>Usar a Plataforma para fins ilegais ou fraudulentos.</li>
        <li>Coletar ou armazenar dados pessoais de outros usuários sem o seu consentimento.</li>
        <li>Acessar ou usar a conta de outro usuário sem autorização.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>3. Conteúdo do Usuário</h2>
      <span>Você é o único responsável pelo conteúdo que você publica na Plataforma. A ProConta não se responsabiliza por qualquer conteúdo do usuário que seja ilegal, ofensivo ou que viole os direitos de propriedade intelectual de terceiros.</span>
    </div>

    <div className="section-item">
      <h2>4. Conteúdo e Propriedade Intelectual</h2>
      <span>A ProConta detém todos os direitos de propriedade intelectual sobre a Plataforma, incluindo o código-fonte, o design e o conteúdo. Você não poderá copiar, modificar, distribuir ou vender qualquer parte da Plataforma sem a autorização da ProConta.</span>
    </div>

    <div className="section-item">
      <h2>5. Limitação de Responsabilidade</h2>
      <span>A ProConta não se responsabiliza por quaisquer danos causados pelo uso da Plataforma, incluindo, mas não se limitando a, danos diretos, indiretos, incidentais, especiais ou consequenciais.</span>
    </div>

    <div className="section-item">
      <h2>6. Modificações e Interrupções</h2>
      <ul>
        <li><strong>Modificações:</strong> A ProConta reserva-se o direito de modificar ou descontinuar a plataforma, temporária ou permanentemente, com ou sem aviso prévio.</li>
        <li><strong>Interrupções:</strong> A ProConta não será responsável por quaisquer interrupções na plataforma, incluindo, mas não se limitando a, interrupções devido a problemas técnicos, manutenção ou falhas de conexão.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>7. Links para Terceiros</h2>
      <span>A plataforma ProConta pode conter links para sites de terceiros. A ProConta não controla ou endossa o conteúdo desses sites e não será responsável por qualquer conteúdo, produtos, serviços ou práticas de privacidade desses sites.</span>
    </div>

    <div className="section-item">
      <h2>8. Disposições Gerais</h2>
      <ul>
        <li><strong>Lei Aplicável:</strong> Estes Termos serão regidos e interpretados de acordo com as leis da República de Moçambique, sem considerar conflitos de princípios legais.</li>
        <li><strong>Rescisão:</strong> A ProConta pode rescindir ou suspender seu acesso à plataforma a qualquer momento, por qualquer motivo, sem aviso prévio.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>9. Contacto</h2>
      <span>Se você tiver alguma dúvida sobre esta Política, entre em contato conosco através do e-mail: <a href="mailto:proconta@alinvest-group.com">proconta@alinvest-group.com</a>.</span>
    </div>

    <div className="section-item">
      <h2>10. Vigência</h2>
      <span>Esta Política entra em vigor na data de sua publicação na Plataforma.</span>
    </div>
    <br/><br/>

    <span>Ao utilizar a plataforma ProConta, você concorda em cumprir estes Termos e Condições.</span>
  </div>
</div>
    </DefaultLayout>
  )
}

export default Terms