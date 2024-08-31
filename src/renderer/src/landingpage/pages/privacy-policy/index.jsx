import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useHomeData } from '../../../contexts/HomeDataContext'
import { t } from 'i18next'

function Privacy() {


    const data=useHomeData()

      useEffect(()=>{
        data._scrollToSection('top')
      },[])

      
  return (
    <DefaultLayout>

           <div className="w-full min-h-[200px] mt-[50px] flex items-center p-6 bg-[#ff7626]">
               <h2 className="text-white text-[31px]">{t('common.privacy')}</h2>
           </div>
           
           <div className="px-7 my-14">
                <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('common.privacy')}</h3>
               
         </div>

         <div className="divide">
  <div className="left"></div>
  <div className="right">
    <div className="section-item">
      <span><strong>Última atualização:</strong> 1 de Abril de 2024</span>
      <br/><br/>
      <p>ProConta valoriza a privacidade e a segurança dos dados dos usuários de nossa plataforma. Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais quando você usa a Plataforma.</p>

      <h2>1. Informações coletadas</h2>
      <span>Podemos coletar dados pessoais necessários quando você se registra na Plataforma. O tipo de dados recolhidos e utilizados depende do tipo de conta e privilégios do usuário na plataforma. Estes podem incluir:</span>
      <ul>
        <li>Nome completo</li>
        <li>Correio eletrônico</li>
        <li>Palavra-chave de acesso</li>
        <li>Morada</li>
        <li>Número de telefone</li>
        <li>NUIT</li>
      </ul>
    </div>
 
    <div className="section-item">
      <h2>2. Uso dos dados</h2>
      <span>Os dados coletados são utilizados para:</span>
      <ul>
        <li><strong>Fornecimento de Serviços:</strong> Utilizamos suas informações para operar, manter e fornecer os serviços da plataforma, incluindo processamento de transações, autenticação de usuários e fornecimento de suporte ao cliente, gestão de contratos, acompanhamento de pagamentos, emissão de relatórios.</li>
        <li><strong>Comunicações:</strong> Podemos enviar comunicações relacionadas aos serviços, como atualizações, alterações na política ou informações sobre sua conta.</li>
        <li><strong>Melhorias e Personalização:</strong> Utilizamos as informações para melhorar e personalizar sua experiência na Plataforma, oferecendo conteúdo relevante e recursos aprimorados.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>3. Compartilhamento de Dados</h2>
      <span>Os dados pessoais coletados não serão vendidos ou alugados para terceiros. No entanto, podemos compartilhar seus dados com:</span>
      <ul>
        <li><strong>Órgãos governamentais:</strong> quando exigido por lei ou para cumprir uma ordem judicial.</li>
        <li><strong>Terceiros de Confiança:</strong> Podemos compartilhar informações com prestadores de serviços confiáveis que nos auxiliam na operação da Plataforma, como processamento de pagamentos, análises de dados e hospedagem.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>4. Segurança dos Dados</h2>
      <span>A ProConta se compromete a proteger seus dados pessoais contra acessos não autorizados, uso indevido, divulgação, alteração ou destruição. Para isso, utilizamos diversas medidas de segurança, como:</span>
      <ul>
        <li><strong>Criptografia de dados:</strong> Seus dados são armazenados em servidores criptografados.</li>
        <li><strong>Controle de acesso:</strong> Apenas usuários autorizados têm acesso aos seus dados.</li>
      </ul>
    </div>

    <div className="section-item">
      <h2>5. Seus Direitos</h2>
      <span>Você tem o direito de:</span>
      <ul>
        <li><strong>Acesso e Atualização:</strong> Você pode acessar e atualizar suas informações de conta na Plataforma.</li>
        <li><strong>Comunicações:</strong> Pode optar por não receber notificações de e-mail ou SMS através das configurações da plataforma.</li>
      </ul>
      <span>Para exercer seus direitos, você pode entrar em contato conosco através do e-mail: <a href="mailto:proconta@alinvest-group.com">proconta@alinvest-group.com</a></span>
    </div>

    <div className="section-item">
      <h2>6. Menores de idade</h2>
      <span>Nossa Plataforma não é destinada a menores de 18 anos, e não coletamos intencionalmente informações de crianças menores dessa idade.</span>
    </div>

    <div className="section-item">
      <h2>7. Atualizações da Política</h2>
      <span>Esta Política pode ser atualizada periodicamente. A versão mais recente da Política estará sempre disponível na Plataforma.</span>
    </div>

    <div className="section-item">
      <h2>8. Contacto</h2>
      <span>Se você tiver alguma dúvida sobre esta Política, entre em contato conosco através do e-mail: <a href="mailto:proconta@alinvest-group.com">proconta@alinvest-group.com</a>.</span>
    </div>

    <div className="section-item">
      <h2>9. Vigência</h2>
      <span>Esta Política entra em vigor na data de sua publicação na Plataforma.</span>
    </div>
    <br/><br/>

    <span>Ao utilizar nossa Plataforma, você concorda com os termos descritos nesta Política de Privacidade da ProConta.</span>
  </div>
</div>


    </DefaultLayout>
  )
}

export default Privacy