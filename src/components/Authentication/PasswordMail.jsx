import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

function PasswordMail() {
  const params = useParams()
  const { defaultLang } = useSelector((state) => state.wallet);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (defaultLang) {
      changeLanguage(defaultLang);
    }
  }, [defaultLang]);
  return (
    <>

       <section className="about-section py-0 all-hm-banner" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7  col-sm-12 ">
              <div className='contact-content text-center' >
                    <h2>{t('passwordRecovery')}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6'>
              <div className='unicorn-main-form email-chck-sec'>
                 <div className="password-recovery-box email-chck-box">
                <div className="text-center">
                  <img src="/assets/images/email.png" alt="" />
                  <h3 className='mb-0'>{t('linkSent')}</h3>
                  <h5>
                    <a href="javascript:void(0)" className="send-mail">
                      {params?.email}
                    </a>
                  </h5>
                </div>
                <div className="sending-mail-box">
                  <a href="javascript:void(0)">
                    {t('passwordSentDesc')}
                  </a>
                </div>
              </div>

              </div>

            </div>

          </div>
          
        </div>

      </section>



      {/* <section className="password-recovr-section login-section email-chck-sec">
        <div className="container">
          <div className="row">
            <h2>{t('passwordRecovery')}</h2>
            <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
              <div className="password-recovery-box email-chck-box">
                <div className="text-center">
                  <img src="/assets/images/email.png" alt="" />
                  <h3>{t('linkSent')}</h3>
                  <h5>
                    <a href="javascript:void(0)" className="send-mail">
                      {params?.email}
                    </a>
                  </h5>
                </div>
                <div className="sending-mail-box">
                  <a href="javascript:void(0)">
                    {t('passwordSentDesc')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="footer-btm-image-section" /> */}


    </>

  )
}

export default PasswordMail
