import React, { useEffect, useState } from 'react'
import { getApiData } from '../../services/api'
import { base_url } from '../../baseUrl'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import AOS from "aos";
import "aos/dist/aos.css";

function Features() {
    const [activeFeature, setActiveFeature] = useState(null)
    const [homeData, setHomeData] = useState({})
    const [generalData, setGeneralData] = useState({})
    const [featuresData, setFeaturesData] = useState([])
    useEffect(() => {
        async function getData() {
            const hData = await getApiData('get-home-data')
            setHomeData(hData?.homeData)
            const data = await getApiData('get-general-data')
            setGeneralData(data.generalData)
            const ftData = await getApiData('get-features')
            setFeaturesData(ftData?.features)
        }
        getData()
    }, [])
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
    return (
        <>

            <section className='about-section all-hm-banner ' data-aos="fade-up">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className='contact-content  text-center'>
                                <h2 className=''>{defaultLang == 'en' ? generalData?.featureHeading : generalData?.featureHindiHeading}</h2>
                                <p>{defaultLang == 'en' ? generalData?.featureSubHeading : generalData?.hindiFeatureSubHeading}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section className='trade-feature-section p-50' data-aos="fade-up">
                <div className="container">
                    <div className="row">
                        <div className='grow-about-content text-center mb-4'>
                            <p className='grow-first-title'><span className='grow-title'>Features</span></p>
                            <h4>{defaultLang == 'en' ? homeData?.featureHeading : homeData?.hindiFeatureHeading} </h4>
                            <p style={{ color: "#BDBDBD" }}>{defaultLang == 'en' ? homeData?.featureDesc : homeData?.hindiFeatureDesc}</p>
                        </div>

                        {featuresData?.map((item, key) =>
                            <div key={key} className='col-lg-4 col-md-6 col-sm-12 mb-4'>
                                <div className='featured-card'>
                                    <div className='featured-sub-card'>
                                        <div className='feature-picture-first-box'>
                                            <div className='feature-picture-second-box'>
                                                <div className='feature-picture-third-box'>
                                                    <img src={item?.icon ? `${base_url}/${item?.icon}` : "/assets/images/feature_01.png"} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='feature-content'>
                                            <h5>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h5>

                                            <p>{defaultLang == 'en' ? item?.description : item?.hindiDescription}</p>
                                        </div>
                                    </div>

                                </div>

                            </div>)}


                    </div>
                </div>


            </section>




            {/* <section className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 d-flex flex-column align-items-start justify-content-center">
                            <div>
                                <h2>Unicorn Options {t('features')}</h2>
                                <p>
                                    {generalData?.featureSubHeading || `Join a growing community of investors who choose Cryptix for its
                                    seamless experience, security, and premium design.`}
                                </p>
                            </div>
                            <div className='mb-3  text-center'>
                                <span className='chart-title'>Charts are powered by </span><a target='_blank' href='https://www.tradingview.com/' className='trade-view-btn'>TradingView</a>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="about-right-image">
                                <img src={`${base_url}/${generalData?.featureImg}` || "assets/images/features.png"} className="w-100" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <section className="live-trade-section" data-aos="fade-up" >
                <div className="container">
                    <div className="mb-4">
                        <h2 className="text-center">{defaultLang == 'en' ? homeData?.featureHeading : homeData?.hindiFeatureHeading}</h2>
                        <p>
                            {defaultLang == 'en' ? homeData?.featureDesc : homeData?.hindiFeatureDesc}
                        </p>
                    </div>
                    {featuresData?.length > 0 &&
                        <div className="row live-trade-card g-0">
                            <div className="col-12 col-lg-6 p-4 d-flex flex-column justify-content-center">
                                <div className="icon-circle mb-3">
                                    <img src={`${base_url}/${featuresData[0]?.icon}` || "assets/images/trade-icon.png"} alt="Trading Icon" />
                                </div>
                                <h4 className="">{defaultLang == 'en' ? featuresData[0]?.heading : featuresData[0].hindiHeading}</h4>
                                <p>
                                    {defaultLang == 'en' ? featuresData[0]?.subHeading : featuresData[0].hindiSubHeading}
                                </p>
                                {activeFeature === 0 && <p className="mb-3">
                                    {defaultLang == 'en' ? featuresData[0]?.description : featuresData[0].hindiDescription}
                                </p>}
                                {activeFeature === 0 ?
                                    <Link to="" className="learn-more" onClick={() => setActiveFeature(null)}>
                                        {t('hide')}
                                    </Link> :
                                    <Link to="" className="learn-more" onClick={() => setActiveFeature(0)}>
                                        {t('learnMore')}
                                    </Link>}
                            </div>
                            <div className="col-lg-6 col-sm-12">
                                <div className="right-graph" />
                            </div>
                        </div>}
                    <div className="row trade-crd-box mt-5">
                        {featuresData?.length > 0 &&
                            featuresData?.slice(1)?.map((item, index) => {
                                const currentIndex = index + 1
                                return <div className="col-lg-4 col-md-4 col-sm-12" key={currentIndex}>
                                    <div className="otc-card p-4 position-relative">
                                        <div className="icon-circle mb-3">
                                            <img src={`${base_url}/${item?.icon}` || "assets/images/card-icon.png"} alt="Icon" />
                                        </div>
                                        <div className="my-3">
                                            <h4 className="mb-2">{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h4>
                                            <p className="mb-3">
                                                {defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}
                                            </p>
                                            {activeFeature === currentIndex && <p className="mb-3">
                                                {defaultLang == 'en' ? item?.description : item?.hindiDescription}
                                            </p>}
                                            <div>
                                                {activeFeature === currentIndex ?
                                                    <Link to="" className="learn-more" onClick={() => setActiveFeature(null)}>
                                                        {t('hide')}
                                                    </Link> :
                                                    <Link to="" className="learn-more" onClick={() => setActiveFeature(currentIndex)}>
                                                        {t('learnMore')}
                                                    </Link>}
                                            </div>
                                        </div>
                                        <div className="bottom-pattern-one" />
                                    </div>
                                </div>
                            })}

                    </div>
                </div>
            </section> */}
        </>

    )
}

export default Features
