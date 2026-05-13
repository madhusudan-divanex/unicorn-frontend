import React, { useEffect, useRef, useState } from 'react'
import { getApiData, postApiData } from '../../services/api'
import { base_url } from '../../baseUrl'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import AOS from "aos";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'



function Contact() {
  const imgFile = useRef()
  const [supportForm, setSupportForm] = useState({ name: "", email: "", image: null, message: "" })
  const [contactInfo, setContactInfo] = useState({})
  const [generalData, setGeneralData] = useState({})

  useEffect(() => {
    async function getData() {
      const gData = await getApiData('get-general-data')
      setGeneralData(gData.generalData)
      setContactInfo(gData?.generalData?.contactInfo)
    }
    getData()
  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target
    setSupportForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.append('name', supportForm.name)
    data.append('email', supportForm.email)
    data.append('message', supportForm.message)
    if (supportForm.image) {
      data.append('image', supportForm.image)
    }
    try {
      const result = await postApiData('frontend-support', data);
      if (result.success) {
        toast.success(result.message);
        setSupportForm({ name: "", email: "", image: null, message: "" })
      } else {
        toast.error(result.message || "Support failed");
      }
    } catch (error) {
      toast.error("Something went wrong", error.message);
    }
  };
  const { defaultLang } = useSelector(state => state.wallet)
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (defaultLang) {
      changeLanguage(defaultLang);
    }
  }, [defaultLang]);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);




  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (key) => {
    setOpenFaq((prev) => (prev === key ? null : key));
  };
  const [faqData, setFaqData] = useState([])

  useEffect(() => {
    async function getData() {
      const data = await getApiData('get-faq')
      const gData = await getApiData('get-general-data')
      setGeneralData(gData?.generalData)
      setFaqData(data?.allFaq)
    }
    getData()
  }, [])



  useEffect(() => {
    if (defaultLang) {
      changeLanguage(defaultLang);
    }
  }, [defaultLang]);

  return (
    <>
      <section className="about-section all-hm-banner" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7  col-sm-12 ">
              <div className='contact-content text-center'>
                <h2>{defaultLang == "en" ? generalData?.contactInfo?.contactHeading : generalData?.contactInfo?.hindiContactHeading}</h2>
                <p>
                  {defaultLang == "en" ? contactInfo?.description : contactInfo?.hindiContactDescription}{" "}
                </p>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="about-right-image">
                <img src={`${base_url}/${generalData?.contactImg}` || "assets/images/contact-us.png"} alt="" />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className='contact-us-sec ' data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className='col-lg-6 col-md-12 col-sm-12 mb-3'>
              <div className='unicorn-mb-bx'>
                <p className='grow-first-title'><span className='grow-title'>{t('Contact Information')}</span></p>
              </div>
              <div className='grow-about-content'>
                <h4>{defaultLang == "en" ? generalData?.contactInfo?.contactHeading : generalData?.contactInfo?.hindiContactHeading}</h4>
                <p>{defaultLang == "en" ? generalData?.contactInfo?.contactDescription : generalData?.contactInfo?.hindiContactDescription}</p>
              </div>

              <div className='row mb-4'>
                <div className='col-lg-6 mb-4'>
                  <div className='contact-info-box'>
                    <div className='unicorn-contact-title'>

                      <span className='unicorn-contact-icon'>
                        <FontAwesomeIcon icon={faPhone} />
                      </span>

                      <div>
                        <h6>Phone</h6>
                      </div>
                    </div>

                    <div>
                      <h4>{generalData?.contactInfo?.phoneNumber}</h4>
                    </div>

                  </div>

                </div>

                <div className='col-lg-6 mb-4'>
                  <div className='contact-info-box'>
                    <div className='unicorn-contact-title'>

                      <span className='unicorn-contact-icon'>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>

                      <div>
                        <h6>E-mail</h6>
                      </div>
                    </div>

                    <div>
                      <h4>{generalData?.contactInfo?.email}</h4>
                    </div>

                  </div>

                </div>

                <div className='col-lg-12'>
                  <div className='contact-info-box'>
                    <div className='unicorn-contact-title'>

                      <span className='unicorn-contact-icon'>
                        <FontAwesomeIcon icon={faLocationDot} />
                      </span>

                      <div>
                        <h6>Address</h6>
                      </div>
                    </div>

                    <div>
                      <h4>{generalData?.contactInfo?.address}</h4>
                    </div>

                  </div>

                </div>

              </div>
              {/* <img src={`${base_url}/${generalData?.contactImg}`} alt="" srcset="" /> */}
              {/* <div className='unicorn-map-box'>
              </div> */}

            </div>

            <div className='col-lg-6 col-md-12 col-sm-12'>
              <div className='unicorn-main-form'>
                {/* <div>
                  <p>If you have questions or need assistance, feel free to reach out through our contact form below. </p>
                </div> */}

                <form onSubmit={handleSubmit}>

                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className="custom-frm-bx ">
                        <label htmlFor="">{t("First Name*")} </label>
                        <input
                          type="text"
                          className="form-control new-form-control"
                          name='name'
                          value={supportForm.name}
                          required
                          onChange={handleChange}
                          placeholder="Enter your first name"
                        />
                      </div>

                    </div>

                    <div className='col-lg-6'>
                      <div className="custom-frm-bx ">
                        <label htmlFor="">{t("Last Name*")} </label>
                        <input
                          type="text"
                          className="form-control new-form-control"
                          name='name'
                          value={supportForm.name}
                          required
                          onChange={handleChange}
                          placeholder="Enter your last name"
                        />
                      </div>

                    </div>

                    <div className='col-lg-12'>
                      <div className="custom-frm-bx ">
                        <label htmlFor="">{t('Email Address*')}</label>
                        <input
                          type="email"
                          className="form-control new-form-control"
                          name='email'
                          required
                          value={supportForm.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className='col-lg-12'>
                      <div className='custom-frm-bx'>
                        <label htmlFor=""> {t('Subject')}</label>
                        <select name="" id="" className='form-select new-form-select'>
                          <option value="">Select a message subject</option>
                        </select>

                      </div>

                    </div>

                    <div className='col-lg-12'>
                      <div className="custom-frm-bx">
                        <label htmlFor="">{t("Message*")} </label>
                        <div className="form-floating">
                          <textarea
                            className="form-control new-form-control pt-2"
                            name='message'
                            required
                            value={supportForm.message}
                            onChange={handleChange}
                            id="message"
                            rows={4}
                            placeholder="Enter your message here"
                          />
                        </div>
                      </div>

                    </div>

                    <div className='text-center'>
                      <button type="submit" className="thm-btn">
                        {t('Send Message')}
                      </button>
                    </div>
                  </div>





                  {/* <div className="upload-box d-flex flex-column align-items-center" id="uploadBox" onClick={() => imgFile.current.click()}>
                  <i className="fas fa-image" />
                  <h6>{t('attachementFiles')}</h6>
                  <small>{t("clickAndDrop")}</small>
                  <small>{t('format')} </small>
                  <input
                    type="file"
                    ref={imgFile}
                    required
                    id="fileInput"
                    accept="image/*"
                    multiple={false}
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.type.startsWith("image/")) {
                        setSupportForm({ ...supportForm, image: file });
                      } else {
                        // Optional: reset file or show error
                        e.target.value = null; // Clear the input
                        toast.error("Please select a valid image file");
                      }
                    }}
                  />

                </div> */}


                </form>


              </div>



            </div>
          </div>
        </div>

      </section>

      <section className='unicorn-faq-section' data-aos="fade-up">
        <div className="container">
          <div className='row mb-lg-5 mb-sm-3'>
            <div className='grow-about-content text-center'>
              <p className='grow-first-title'>
                <span className='grow-title'>FAQ</span>
              </p>
              <h4>
                {defaultLang == "en" ? generalData?.faqDesc : generalData?.hindiFaqDesc}
              </h4>
            </div>
          </div>

          {faqData?.map((item, sectionKey) => {
            const half = Math.ceil(item.content.length / 2);
            const leftColumn = item.content.slice(0, half);
            const rightColumn = item.content.slice(half);

            return (
              <section key={sectionKey} className="trade-faq-section py-0 faq-pg-section custom-faq-section">
                {/* <div className="mb-2">
                <h2 className="text-start custom-faq-title">
                    {defaultLang === 'en' ? item?.type : item?.hindiType}
                </h2>
            </div> */}

                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="faq-bx custom-faq-wrapper">

                      {leftColumn.map((faq, index) => {
                        const uniqueKey = `${sectionKey}-left-${index}`;

                        return (
                          <div className="faq-item custom-faq-card" key={uniqueKey}>

                            <div
                              className="faq-question custom-faq-question"
                              onClick={() => toggleFaq(uniqueKey)}
                            >
                              <span className="custom-faq-text">
                                {defaultLang === 'en'
                                  ? faq?.question
                                  : faq?.hindiQuestion}
                              </span>

                              {/* <i className={`fas fa-chevron-down custom-faq-icon 
                                            ${openFaq === uniqueKey ? "custom-faq-rotate" : ""}`} 
                                        /> */}
                            </div>

                            {openFaq === uniqueKey && (
                              <div className="faq-answer custom-faq-answer">
                                {defaultLang === 'en'
                                  ? faq?.answer
                                  : faq?.hindiAnswer}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="faq-bx custom-faq-wrapper">

                      {rightColumn.map((faq, index) => {
                        const uniqueKey = `${sectionKey}-right-${index}`;

                        return (
                          <div className="faq-item custom-faq-card" key={uniqueKey}>

                            <div
                              className="faq-question custom-faq-question"
                              onClick={() => toggleFaq(uniqueKey)}
                            >
                              <span className="custom-faq-text">
                                {defaultLang === 'en'
                                  ? faq?.question
                                  : faq?.hindiQuestion}
                              </span>

                              {/* <i className={`fas fa-chevron-down custom-faq-icon 
                                            ${openFaq === uniqueKey ? "custom-faq-rotate" : ""}`} 
                                        /> */}
                            </div>

                            {openFaq === uniqueKey && (
                              <div className="faq-answer custom-faq-answer">
                                {defaultLang === 'en'
                                  ? faq?.answer
                                  : faq?.hindiAnswer}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </section>
            );
          })}

        </div>
      </section>

      {/* <section className="contact-us-sec" data-aos="fade-up" >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="contact-card">
                <div className="d-flex align-items-center gap-3">
                  <p className="contact-icon-crd">
                    <i className="fas fa-phone fa-rotate-90" />
                  </p>
                  <h2 className="mb-0">{t('Call Now')}</h2>
                </div>
                <div className="contct-supp my-2">
                  <a href="javascript:void(0)">{contactInfo?.phoneNumber || '+91-9876543210'}</a>
                </div>
                <h6>{t('available24/7')}</h6>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="contact-card">
                <div className="d-flex align-items-center gap-3">
                  <p className="contact-icon-crd">
                    <i className="fas fa-envelope" />
                  </p>
                  <h2 className="mb-0">{t('email')}</h2>
                </div>
                <div className="contct-supp my-2">
                  <a href="javascript:void(0)">{contactInfo?.email || 'support-hi@Binary.com'}</a>
                </div>
                <h6>
                  {t('contactEmailDesc')}
                </h6>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="contact-card">
                <div className="d-flex align-items-center gap-3">
                  <p className="contact-icon-crd">
                    <i className="fas fa-map-marker-alt" />
                  </p>
                  <h2 className="mb-0">{t('address')}</h2>
                </div>
                <div className="contct-supp my-2">
                  <h3>{contactInfo?.address || '276, Govant Building, Kumul Highway, India<'}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="contct-frm-sec">
        <div className="container">
          <div className="row form-container">
            <div className="col-lg-5 left-box d-flex flex-column align-items-center justify-content-center">
              <h4>{generalData?.socialNetwork?.socialHeading || "Connect with Us Across Social Networks!"}</h4>
              <img src="assets/images/contact-frm.png" alt="Girl with Laptop" />
              <a target='_blank' href={generalData?.socialNetwork?.facebook} className="social-btn social-facebook">
                {t('facebook')} <i className="fab fa-facebook-f" />
              </a>
              <a target='_blank' href={generalData?.socialNetwork?.instagram} className="social-btn social-instagram">
                {t("instagram")} <i className="fab fa-instagram" />
              </a>
              <a target='_blank' href={generalData?.socialNetwork?.twitter} className="social-btn social-twitter">
                {t('twitter')} <i className="fab fa-twitter" />
              </a>
            </div>
            <div className="col-lg-7 right-box">
              <h4 className="mb-4 fw-bold">{t('formToSupport')}</h4>
              <form onSubmit={handleSubmit}>
                <div className="custom-frm-bx ">
                  <label htmlFor="">{t("name")} </label>
                  <input
                    type="text"
                    className="form-control"
                    name='name'
                    value={supportForm.name}
                    required
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>
                <div className="custom-frm-bx ">
                  <label htmlFor="">{t('email')}</label>
                  <input
                    type="email"
                    className="form-control"
                    name='email'
                    required
                    value={supportForm.email}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>
                <div className="custom-frm-bx">
                  <label htmlFor="">{t("message")} </label>
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      name='message'
                      required
                      value={supportForm.message}
                      onChange={handleChange}
                      id="message"
                      rows={4}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="upload-box d-flex flex-column align-items-center" id="uploadBox" onClick={() => imgFile.current.click()}>
                  <i className="fas fa-image" />
                  <h6>{t('attachementFiles')}</h6>
                  <small>{t("clickAndDrop")}</small>
                  <small>{t('format')} </small>
                  <input
                    type="file"
                    ref={imgFile}
                    required
                    id="fileInput"
                    accept="image/*"
                    multiple={false}
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.type.startsWith("image/")) {
                        setSupportForm({ ...supportForm, image: file });
                      } else {
                        // Optional: reset file or show error
                        e.target.value = null; // Clear the input
                        toast.error("Please select a valid image file");
                      }
                    }}
                  />

                </div>
                <button type="submit" className="submit-btn">
                  {t('submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </>

  )
}

export default Contact
