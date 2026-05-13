import React, { useEffect, useState } from 'react'
import { faqList } from '../../staticData'
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AOS from "aos";
import "aos/dist/aos.css";


function About() {
    const [loading, setLoading] = useState(true)
    const [openIndex, setOpenIndex] = useState(null);
    const [homeData, setHomeData] = useState({})
    const [faqData, setFaqData] = useState([])
    const [workData, setWorkData] = useState([])
    const [aboutData, setAboutData] = useState([])
    const [featureData, setFeatureData] = useState([])
    const [generalData, setGeneralData] = useState()
    const toggleFaq = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    useEffect(() => {
        async function getData() {
            try {
                const [
                    hData,
                    aData,
                    fData,
                    wData,
                    gData, featureData
                ] = await Promise.all([
                    getApiData('get-home-data'),
                    getApiData('get-about'),
                    getApiData('get-faq'),
                    getApiData('how-it-work'),
                    getApiData('get-general-data'),
                    getApiData('get-about-feature')
                ])

                setHomeData(hData?.homeData)
                setAboutData(aData?.aboutData)
                setFeatureData(featureData?.features)
                setFaqData(fData?.allFaq)

                const data = wData?.workData?.filter(
                    item => item.type === 'user'
                )

                setGeneralData(gData?.generalData)
                setWorkData(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
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

        <>{loading ? <Loader /> : <>


            <section className="about-section all-hm-banner" data-aos="fade-up">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-sm-12 ">
                            <div className='contact-content text-center'>
                                <h2 className='mb-3'>{defaultLang == "en" ? generalData?.aboutPageHeading : generalData?.aboutPageHindiHeading}</h2>
                                <p>{defaultLang == "en" ? generalData?.aboutPageSubHeading : generalData?.aboutPageHindiSubHeading}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className='p-50' data-aos="fade-up">
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-6 col-md-12 col-sm-12 mb-3 mb-lg-0 order-2 order-lg-1'>
                            <div className='unicorn-mb-bx'>
                                <p className='grow-first-title'><span className='grow-title'>{t('aboutUs')}</span></p>
                            </div>
                            <div className='grow-about-content'>
                                <h4 className='pb-4'>{defaultLang == "en" ? aboutData?.aboutHeading : aboutData?.hindiAboutHeading}</h4>
                                <p style={{ color: "#BDBDBD" }}>{defaultLang == "en" ? aboutData?.aboutDesc : aboutData?.hindiAboutDesc}</p>

                            </div>

                        </div>

                        <div className='col-lg-6 col-md-12 col-sm-12 order-1 order-lg-2 mb-3'>
                            {/* <div className='platform-card'> */}
                            <img src={`${base_url}/${aboutData?.aboutPhoto}`} alt="" />
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </section>


            <section className='p-50' data-aos="fade-up">
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-5 col-md-12 col-sm-12 mb-3 mb-lg-0'>
                            {/* <div className='mission-picture-box'> */}
                            <img src={`${base_url}/${aboutData?.aboutInfo?.image}`} alt="" />
                            {/* </div> */}

                        </div>

                        <div className='col-lg-7 col-md-12 col-sm-12 ps-lg-4'>
                            <div className='grow-about-content'>
                                <h4>{defaultLang == "en" ? aboutData?.aboutInfo?.heading :
                                    aboutData?.aboutInfo?.hindiHeading}</h4>

                                <p style={{ color: "#BDBDBD" }}>{defaultLang == "en" ? aboutData?.aboutInfo?.desc :
                                    aboutData?.aboutInfo?.hindiDesc}</p>

                                <div className='mt-5 unicorn-mb-bx'>
                                    <Link to={'/about'} className='thm-lg-btn'>Learn More</Link>
                                </div>
                            </div>


                        </div>

                    </div>

                </div>

            </section>

            <section className='unicorn-counter-section' data-aos="fade-up" >
                <div className='container'>
                    <div className="row">
                        {generalData?.statusCounter?.map((item, key) => <div className='col-lg-3 col-md-4 col-sm-6 mb-3' key={key}>
                            <div className='grow-about-content counter-content'>
                                <h4 className='grow-first-title'>{item?.statusValue}</h4>
                                <p>{item?.statusName}</p>
                            </div>
                        </div>)}



                    </div>
                </div>
            </section>

            <section className='unicorn-about-section' data-aos="fade-up">
                <div className='container'>
                    <div className='row justify-content-center mb-4'>
                        <div className='col-lg-8'>
                            <div className='unicorn-mb-bx text-center'>
                                <p className='grow-first-title'><span className='grow-title'>{t('Core Values')}</span></p>
                            </div>
                            <div className='grow-about-content'>
                                <h4 className='text-center'>{defaultLang == "en" ? aboutData?.coreValueHeading : aboutData?.coreValueHindiHeading}</h4>


                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        {featureData?.map((item, key) => <div className='col-lg-4 col-md-6 col-sm-12 mb-3'>
                            <div className='core-cards'>
                                <div className='core-picture-box'>
                                    <span><img src={`${base_url}/${item?.icon}`} alt="" onError={(e) => e.target.src = '/assets/images/unicorn-lock.png'} /></span>
                                </div>
                                <div className='core-content'>
                                    <h5>{defaultLang == "en" ? item?.heading : item?.hindiHeading}</h5>
                                    <p>{defaultLang == "en" ? item?.subHeading : item?.hindiSubHeading}</p>
                                </div>
                            </div>
                        </div>)}


                    </div>


                </div>

            </section>







            {/* <section className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center">
                            <div>
                                <h2>{t('aboutUs')}</h2>
                                <h4>{defaultLang == 'en' ? aboutData?.aboutHeading : aboutData?.hindiAboutHeading}</h4>
                                <p>
                                    {defaultLang == 'en' ? aboutData?.aboutDesc : aboutData?.hindiAboutDesc}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="about-right-image">
                                <img src={`${base_url}/${aboutData?.aboutPhoto}` || "assets/images/about-image.png"} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* <section className="live-trade-section">
                <div className="container">
                    <div className="row live-trade-card g-0">
                        <div className="col-lg-6 col-sm-12 p-4 d-flex flex-column justify-content-center">
                            <div className="about-crd-box">
                                <img src={`${base_url}/${aboutData?.aboutInfo?.image}` || "assets/images/about-trades.png"} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 d-flex flex-column justify-content-end position-relative">
                            <div className="right-graph" />
                            <div className="about-trade-content">
                                <h3>
                                    {defaultLang == 'en' ? aboutData?.aboutInfo?.heading : aboutData?.aboutInfo?.hindiHeading}
                                </h3>
                                <p>
                                    {defaultLang == 'en' ? aboutData?.aboutInfo?.desc : aboutData?.aboutInfo?.hindiDesc}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* <section className="live-trade-section" data-aos="fade-up" >
                <div className="container">
                    <h2>{defaultLang == 'en' ? aboutData?.modernPlatForm : aboutData?.hindiModernPlatForm}</h2>
                    <div className="row trade-crd-box">
                        {aboutData?.modernPeople?.slice(1).map((item, key) =>
                            <div className="col-lg-4 col-md-4 col-sm-12" key={key}>
                                <div className="otc-about-card  p-4 position-relative">
                                    <div className="my-3">
                                        <p className="mb-3">
                                            {defaultLang == 'en' ? item?.english : item?.hindi}
                                        </p>
                                    </div>
                                    <div className="bottom-pattern-about" />
                                </div>
                            </div>)}

                    </div>
                    {aboutData?.modernPeople?.length > 0 &&
                        <div className="row mt-4">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="otc-about-card otc-about-card otc-about-card-full  p-4 position-relative">
                                    <div className="my-3">
                                        <p className="mb-3">
                                            {defaultLang == 'en' ? aboutData?.modernPeople[0].english : aboutData?.modernPeople[0].hindi}
                                        </p>
                                    </div>
                                    <div className="bottom-pattern-about-second" />
                                </div>
                            </div>
                        </div>}
                </div>
            </section> */}

            {/* <section className="how-it-wrk-section live-trade-section py-0" data-aos="fade-up">
                <div className="container ">
                    <h2 className="text-center">{defaultLang == "en" ? aboutData?.platFormWorkHeading : aboutData?.hindiPlatFormWorkHeading}</h2>
                    <div className="row about-how-it-wrk-btm-first">


                        {workData?.length > 0 &&
                            workData.map((item, key) => (
                                <div className="col-lg-3 col-md-3 col-sm-12" key={key}>
                                    <div className="how-it-wk-crd">
                                        <div className="second-bx-sec third-pic-box">
                                            <div className="second-bx-sec-pic">
                                                <img src={`${base_url}/${item.image}` || "assets/images/second-crd.png"} alt="" />
                                            </div>
                                        </div>
                                        <h5>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h5>
                                        <p>{defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}</p>
                                    </div>
                                </div>
                            ))}

                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="how-it-wk-full">
                                <img src="assets/images/left-vec.png" alt="" />
                                <p>
                                    {defaultLang == "en" ? aboutData?.quoteHeading : aboutData?.hindiQuoteHeading}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-how-it-wrk-btm">
                    <img src="assets/images/platform-wrk.png" alt="" />
                </div>
            </section> */}

            {/* <section className="main-banner-section " data-aos="fade-up">
                <div className="container-fluid">
                    <div className="row ">
                        <div className="col-lg-5 col-md-5 col-sm-12 row-spce-rm d-lg-flex align-items-center flex-column justify-content-center">
                            <div className="hero-section-title">
                                <h1>{defaultLang == "en" ? aboutData?.aboutSecion?.heading : aboutData?.aboutSection?.hindiHeading}</h1>
                                <div className="d-flex gap-3 mt-3 pltform-btn">
                                    <Link to="/register" className="thm-btn">
                                        {t('createFreeAccount')} <i className="fas fa-arrow-right" />
                                    </Link>
                                    <Link to="/register" className="thm-btn">
                                        {t('demoAccount')} <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-12 row-spce-rm" >
                            <div className="hero-banner-image">
                                <img src={`${base_url}/${aboutData?.aboutSection?.photo}` || "assets/images/banner.png"} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 ">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="otc-about-card otc-about-card otc-about-card-full position-relative">
                                <div className="bottom-pattern-about-three" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* <section className="trade-faq-section" data-aos="fade-up">
                <div className="container">
                    <div className="mb-5">
                        <h2 className="text-center"> {defaultLang == 'en' ? homeData?.faq?.heading : homeData?.faq?.hindiHeading}</h2>
                        <p className="text-center">
                            {defaultLang == "en" ? homeData?.faq?.subHeading : homeData?.faq?.hindiSubHeading}
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 .col-lg-12">
                            <div className="faq-bx">
                                {faqData?.length > 0 && faqData[0]?.content?.slice(0, 5).map((faq, index) => (
                                    <div key={index} className="faq-item">
                                        <div
                                            className="faq-question"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <span>{defaultLang == 'en' ? faq?.question : faq?.hindiQuestion}</span>
                                            <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'}`} />
                                        </div>
                                        {index == openIndex && <div className='faq-answer'>
                                            {defaultLang == 'en' ? faq?.answer : faq?.hindiAnswer}
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

        </>}
        </>


    )
}

export default About
