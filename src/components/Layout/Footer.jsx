import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiData } from '../../services/api'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

function Footer() {
    const [generalData, setGeneralData] = useState({})

    const { defaultLang } = useSelector(state => state.wallet)
    // const [faqData, setFaqData] = useState([])

    useEffect(() => {
        async function getData() {
            // const data = await getApiData('get-faq')
            const gData = await getApiData('get-general-data')
            setGeneralData(gData.generalData)
            // setFaqData(data.allFaq)
        }
        getData()
    }, [])
    const { userSetting } = useSelector((state) => state.user);
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (userSetting && userSetting.language) {
            changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
        }
    }, [userSetting]);
    return (

        <>
            <section className='unicorn-crypto-section'>
                <div className='container'>
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='grow-about-content text-center nw-plb-space'>

                                <h4 className=''>{defaultLang == "en" ? generalData?.footerHeading : generalData?.footerHindiHeading}</h4>
                                <p>{defaultLang == "en" ? generalData?.footerSubHeading : generalData?.footerSubHindiHeading}</p>

                                <div className='mt-5'>
                                    <Link to='/register' className='thm-lg-btn'>Sign Up Today!</Link>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            <section className="footer-sections">
                <div className="container">
                    <div className='footer-line'>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div>
                                    <h2>{defaultLang == 'en' ? generalData?.orgName : generalData?.hindiOrgName}</h2>
                                    <p>
                                        {defaultLang == 'en' ? generalData?.orgDesc : generalData?.hindiOrgDesc}
                                    </p>
                                </div>

                                <div className='custom-frm-bx'>
                                    <input type="email" name="" id="" className='form-control email-control' placeholder='Enter your email' />
                                    <div className='email-send-box'>
                                        <button className='email-btn'>Send</button>
                                    </div>

                                </div>

                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="quicks-link">
                                    {/* <h4>{defaultLang == 'en' ? generalData?.orgName : generalData?.hindiOrgName}</h4> */}
                                    <h4>Explore</h4>
                                    <ul>
                                        <li>
                                            <Link to='/' >{t('home')}</Link>
                                        </li>
                                        <li>

                                            <Link to='/features' >{t('features')}</Link>
                                        </li>
                                        <li>
                                            <Link to='/review' >{t('reviews')}</Link>
                                        </li>
                                        <li>
                                            <Link to='/partner' >{t('partner')}</Link>
                                        </li>
                                        <li>
                                            <Link to='/faq' >{t('faq')}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="quicks-link nw-quick-link">
                                    <h4>{t('help')}</h4>
                                    <ul>
                                        <li>
                                            <Link to="/contact">{t('customerSupport')}</Link>
                                        </li>
                                        <li>
                                            <Link to="/terms-of-service">{t('termConditions')}</Link>
                                        </li>
                                        <li>
                                            <Link to="/privacy-policy">{t('privacyPolicy')}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="quicks-link nw-quick-link">
                                    <h4>{t('connect')}</h4>
                                    <ul>
                                        <li>
                                            <a href={generalData?.socialNetwork?.instagram} target='_blank'>Instagram</a>
                                        </li>
                                        <li>
                                            <a href={generalData?.socialNetwork?.facebook} target='_blank'>Facebook</a>
                                        </li>
                                        <li>
                                            <a href={generalData?.socialNetwork?.twitter} target='_blank'>Twitter/X</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        {/* <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center justify-content-start">
                        <p className="foot-para"> {defaultLang == 'en' ? generalData?.copyright : generalData?.hindiCopyright} </p>

                    </div> */}
                        <div className='col-lg-12 '>
                            {/* <div className='text-secondary d-flex align-items-center justify-content-center'>
                            Charts are powered by <a className='ms-1' target='_blank' href='https://www.tradingview.com/'> TradingView</a>
                        </div> */}
                            <div className='ftr-btm-content'>
                                <p className='text-center mb-0'>© 2025 Copyright by Unicorn Options. All Rights Reserved.</p>
                            </div>
                        </div>

                        {/* <div className="col-lg-4 col-md-4 col-sm-12">
                        <ul className="social-list">
                            <li>
                                <a target='_blank' href={generalData?.socialNetwork?.twitter}>
                                    <i className="fab fa-twitter" />
                                </a>
                            </li>
                            <li>
                                <a target='_blank' href={generalData?.socialNetwork?.facebook}>
                                    <i className="fab fa-facebook-f" />
                                </a>
                            </li>
                            <li>
                                <a target='_blank' href={generalData?.socialNetwork?.instagram}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </li>

                        </ul>
                    </div> */}
                    </div>
                </div>
            </section>

        </>


    )
}

export default Footer
