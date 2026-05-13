import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiData, postApiData } from '../../services/api'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

function PasswordRecovery() {
  const [byEmail, setByEmail] = useState(true)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (byEmail) {
      if (email == '') {
        return;
      }
      const result = await getApiData(`password-mail/${email}`)
      if (result.success) {
        navigate(`/password-mail/${email}`)
        toast.success('Mail sent')
      }
      else {
        toast.error(result.message)
      }
    } else {
      if (!phone) {
        return;
      }
      const result = await getApiData(`password-link/${phone}`)
      if (result.success) {
        navigate(`/password-mail/${phone}`)
        toast.success('Link sent')
      }
      else {
        toast.error(result.message)
      }
    }
  }
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

      <section className='contact-us-sec'>
        <div className="container">
          <div className="row justify-content-center">
            <div className='col-lg-6'>
            <div className='unicorn-main-form'>

              <form onSubmit={handleSubmit} className="password-recovery-box">
                <p className='recovery-para'>
                  {t('recoveryDesc')}
                </p>

                {byEmail ? 
                
                <div className="custom-frm-bx">
                  <label htmlFor="email">{t('email')}</label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control new-form-control"
                    name='email'
                    id="email"
                    placeholder=" "
                  />

                  
                </div> :

                  <div className="custom-frm-bx">
                    <label htmlFor="phone">{t('mobile')}</label>
                    <input
                      type="text"
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="form-control new-form-control"
                      name='phone'
                      id="phone"
                      value={phone}
                      placeholder=""
                      maxLength={10}
                      minLength={10}
                    />
                    
                  </div>}

                <div className="text-center mt-3">
                  <button type="submit" className="thm-btn ">
                    {t('continue')}
                  </button>
                </div>

                {byEmail ? <div className="text-center mt-3">
                  {defaultLang == 'hi' ?
                    <span>
                      <button onClick={() => setByEmail(false)} className="toggle-unicorn-btn">
                        Mobile Number
                      </button>
                      {t("recoverByMobile")}
                    </span>
                    :
                    <span className='toggle-unicorn-title'>
                      {t('recoverByMobile')}
                      <button onClick={() => setByEmail(false)} className="toggle-unicorn-btn">
                        Mobile Number
                      </button>
                    </span>
                  }
                </div> :
                  <div className="text-center mt-3">
                    {defaultLang == 'hi' ?
                      <span>
                        <button onClick={() => setByEmail(true)} className="toggle-unicorn-btn">
                          {t('email')}
                        </button>
                        {t("recoverByMobile")}
                      </span>
                      :
                      <span className='toggle-unicorn-title'>
                        {t('recoverByMobile')}
                        <button onClick={() => setByEmail(true)} className="toggle-unicorn-btn">
                          {t("email")}
                        </button>
                      </span>
                    }

                  </div>}
              </form>



            </div>
            </div>
          </div>
        </div>
      </section>


      {/* <section className="password-recovr-section login-section">
        <div className="container">
          <div className="row">
            <h2>{t('passwordRecovery')}</h2>
            <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
              <form onSubmit={handleSubmit} className="password-recovery-box">
                <p>
                  {t('recoveryDesc')}
                </p>
                {byEmail ? <div className="custom-frm-bx mt-3">
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    name='email'
                    id="email"
                    placeholder=" "
                  />
                  <label htmlFor="email">{t('email')}</label>
                </div> :
                  <div className="custom-frm-bx mt-3">
                    <input
                      type="text"
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="form-control"
                      name='phone'
                      id="phone"
                      value={phone}
                      placeholder=""
                      maxLength={10}
                      minLength={10}
                    />
                    <label htmlFor="phone">{t('mobile')}</label>
                  </div>}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn signIn-btn mt-3">
                    {t('continue')}
                    <i className="fas fa-arrow-right" />
                  </button>
                </div>
                {byEmail ? <div className="text-center mt-3">
                  {defaultLang == 'hi' ?
                    <span>
                      <button onClick={() => setByEmail(false)} className="mob-num">
                        Mobile Number
                      </button>
                      {t("recoverByMobile")}{" "}
                    </span>
                    :
                    <span>
                      {t('recoverByMobile')}
                      <button onClick={() => setByEmail(false)} className="mob-num">
                        Mobile Number
                      </button>
                    </span>
                  }
                </div> :
                  <div className="text-center mt-3">
                    {defaultLang == 'hi' ?
                      <span>
                        <button onClick={() => setByEmail(true)} className="mob-num">
                          {t('email')}
                        </button>
                        {t("recoverByMobile")}{" "}
                      </span>
                      :
                      <span>
                        {t('recoverByMobile')}
                        <button onClick={() => setByEmail(true)} className="mob-num">
                          {t("email")}
                        </button>
                      </span>
                    }

                  </div>}
              </form>
            </div>
          </div>
        </div>
      </section> */}
      {/* <section className="footer-btm-image-section" /> */}
    </>

  )
}

export default PasswordRecovery
