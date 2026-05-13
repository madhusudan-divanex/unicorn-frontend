import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { faqList, testimonials } from '../../staticData';
import { MdOutlineTrendingUp } from "react-icons/md";
import { IoTrendingDownOutline } from "react-icons/io5";
import CountUp from "react-countup";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { PiHandDepositBold } from "react-icons/pi";
import { FaCreativeCommonsNc } from "react-icons/fa";
import { BiLineChart } from "react-icons/bi";







import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../Layout/Header';
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AOS from "aos";
import "aos/dist/aos.css";
import Preloader from '../Preloader';
function Home() {
    const [loading, setLoading] = useState(true)
    const [activeFeature, setActiveFeature] = useState(null)
    const [openIndex, setOpenIndex] = useState(null);
    const [homeData, setHomeData] = useState({})
    const [generalData, setGeneralData] = useState({})
    const [reviewsData, setReviewsData] = useState([])
    const [faqData, setFaqData] = useState([])
    const [aboutData, setAboutData] = useState()
    const [featuresData, setFeaturesData] = useState([])
    const [workData, setWorkData] = useState([])
    const toggleFaq = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    useEffect(() => {
        async function getData() {
            try {
                const [
                    gData,
                    hData,
                    fData,
                    rData,
                    ftData,
                    aData,
                    wData
                ] = await Promise.all([
                    getApiData('get-general-data'),
                    getApiData('get-home-data'),
                    getApiData('get-faq'),
                    getApiData('get-reviews'),
                    getApiData('get-features'),
                    getApiData('get-about'),
                    getApiData('how-it-work')
                ]);

                setGeneralData(gData?.generalData);
                setHomeData(hData?.homeData);
                setFaqData(fData?.allFaq);
                setReviewsData(rData?.reviews);
                setFeaturesData(ftData?.features);
                setAboutData(aData?.aboutData);

                const data = wData?.workData?.filter(item => item.type === 'user');
                setWorkData(data);

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);
    // Split reviewsData into two halves
    const firstHalf = reviewsData.slice(0, Math.ceil(reviewsData.length / 2))
    const secondHalf = reviewsData.slice(Math.ceil(reviewsData.length / 2))

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
            duration: 2000,
            once: false,
        });
    }, []);


    const [users, setUsers] = useState(0);
    const [crypto, setCrypto] = useState(0);
    const [assets, setAssets] = useState(0);
    const [trades, setTrades] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setUsers((prev) => (prev < 500 ? prev + 5 : 500));
            setCrypto((prev) => (prev < 100 ? prev + 2 : 100));
            setAssets((prev) => (prev < 1 ? prev + 1 : 1));
            setTrades((prev) => (prev < 100 ? prev + 2 : 100));

        }, 40);

        return () => clearInterval(interval);

    }, []);


    return (
        <>
            {loading ? <Loader /> : <div>
                {/* {loading ? <Preloader /> : <div> */}

                <section className="main-banner-section hm-banner-section" data-aos="fade-up">


                    <div className="container-fluid">


                        <div className="row justify-content-center">
                            <div className="col-lg-7  col-sm-12 " data-aos="fade-up">

                                {/* <div className='unicorn-sm-box'>
                                    <span className='unicorn-title'>Launched oBy Unicorn </span>
                                </div> */}

                                <div className="hero-section-title unicorn-hp-title px-0">
                                    <h1>{defaultLang == 'en' ? homeData?.header?.heading : homeData?.header?.hindiHeading}</h1>

                                    <p className="py-3 ">
                                        {defaultLang == 'en' ? homeData?.header?.subHeading : homeData?.header?.hindiSubHeading}
                                    </p>

                                    {/* <Link to="/register" className="btn hro-btn">
                                        {t('createFreeAccount')} <i className="fas fa-arrow-right" />
                                    </Link> */}

                                    <div className='register-box'>
                                        {/* <Link to='/register' className='thm-lg-btn'>{t('createFreeAccount')}</Link> */}
                                        <button className='thm-lg-btn outline'>Learn More</button>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>


                </section>

                <section className='unicorn-about-section' data-aos="fade-up">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-6 mb-3'>
                                {/* <div className='unicorn-about-picture'> */}
                                    <img src={`${base_url}/${aboutData?.aboutPhoto}`} alt="" className='w-100 h-100' />
                                {/* </div> */}
                            </div>

                            <div className='col-lg-6'>
                                <div className='px-lg-4 px-sm-0'>
                                    <div className='unicorn-mb-bx'>
                                        <p className='grow-first-title'><span className='grow-title'>{t('aboutUs')}</span></p>
                                    </div>

                                    <div className='grow-about-content'>
                                        <h4>{defaultLang == 'en' ? aboutData?.aboutHeading : aboutData?.hindiAboutHeading}</h4>

                                        <p>{defaultLang == 'en' ? aboutData?.aboutDesc : aboutData?.hindiAboutDesc}</p>

                                        <div className='mt-5 unicorn-mb-bx'>
                                            <Link to={'/about'} className='thm-lg-btn'>Learn More</Link>
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>
                </section>

                <section className='trade-feature-section' data-aos="fade-up">
                    <div className="container">
                        <div className="row">
                            <div className='grow-about-content text-center'>
                                <p className='grow-first-title'><span className='grow-title'>Features</span></p>
                                <h4>{defaultLang == 'en' ? homeData?.featureHeading : homeData?.hindiFeatureHeading}</h4>
                                <p>{defaultLang == 'en' ? homeData?.featureDesc : homeData?.hindiFeatureDesc}
                                </p>
                            </div>

                            {featuresData?.map((item, key) => {
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

                                                <p> {defaultLang == 'en' ? item?.description : item?.hindiDescription}</p>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            })}

                        </div>
                    </div>


                </section>

                <section className='unicorn-work-section' data-aos="fade-up">
                    <div className='red-shape-circle'></div>

                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-6">
                                <div >
                                    <div className='grow-about-content text-start'>
                                        <div className='unicorn-mb-bx'>
                                            <p className='grow-first-title'><span className='grow-title'>How It Works</span></p>
                                        </div>
                                        <h4>{defaultLang == "en" ? aboutData?.platFormWorkHeading : aboutData?.hindiPlatFormWorkHeading}</h4>

                                    </div>
                                </div>

                            </div>

                            <div className='col-lg-6'>
                                <div className="timeline">
                                    {workData?.length > 0 &&
                                        workData?.map((item, key) =>
                                            <div className="timeline-item" key={key}>
                                                <div className='second-timeline-icon'>
                                                    <div className="timeline-icon ">{key + 1}</div>
                                                </div>
                                                <div className="timeline-content">
                                                    <span ><img src={`${base_url}/${item.image}` || "assets/images/second-crd.png"} className="icon-box" /> </span>
                                                    <h5>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h5>
                                                    <p>{defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}</p>
                                                </div>
                                            </div>)}


                                    {/* <div className="timeline-item">
                                        <div className="timeline-icon">02</div>
                                        <div className="timeline-content">
                                            <span ><PiHandDepositBold className="icon-box" />
                                            </span>
                                            <h5>Deposit Your Funds</h5>
                                            <p>Easily connect your bank account or crypto wallet to fund your Coinzy account. We support multiple payment methods.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-icon">03</div>
                                        <div className="timeline-content">
                                            <span ><FaCreativeCommonsNc className="icon-box" />
                                            </span>
                                            <h5>Choose a Cryptocurrency</h5>
                                            <p>Explore top cryptocurrencies like Bitcoin and Ethereum, plus emerging tokens. Invest your way.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-icon">04</div>
                                        <div className="timeline-content">
                                            <span ><BiLineChart className="icon-box" />
                                            </span>
                                            <h5>Start Trading Instantly</h5>
                                            <p>Buy, sell, or hold your assets in real time with full control at your fingertips.</p>
                                        </div>
                                    </div> */}

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* <section className='integration-section'>
                    <div className="container">
                        <div className="row">
                            <div className='col-lg-12'>
                                <div className='grow-about-content text-center'>
                                    <p className='grow-first-title'><span className='grow-title'>Integration</span></p>
                                    <h4>Seamless Integrations for a Connected Crypto Experience</h4>
                                    <p>Easily connect your favorite platforms and wallets for a smooth and efficient crypto experience.</p>

                                    <div className='integration-picture'>
                                        <img src="/assets/images/integration_01.png" alt="" />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </section> */}

                <section className='unicorn-counter-section ' data-aos="fade-up" >
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

                <section className='unicorn-trust-section' data-aos="fade-up">
                    <div className='container'>
                        <div className="row">
                            <div className='grow-about-content text-center'>
                                <p className='grow-first-title'><span className='grow-title'>Testimonial</span></p>
                                <h4>{defaultLang == 'en' ? generalData?.testimonial?.heading : generalData?.testimonial?.hindiHeading}</h4>
                            </div>

                            {/* <div className='col-lg-4 '>
                                <div className='review-card'>
                                    <div className='reveiw-content'>
                                        <p>"Coinzy makes crypto simple! As a beginner, I was able to set up my account and start trading in no time. The intuitive design makes learning about crypto stress-free and enjoyable."</p>
                                    </div>

                                    <div className='review-detail'>
                                        <div>
                                            <img src="/assets/images/chat-user.png" alt="" />
                                        </div>

                                        <div className='grow-about-content'>
                                            <h4 className='fz-24 lh-sm mb-0' >Sarah Thompson</h4>
                                            <p className='mb-0'>Freelance Designer</p>
                                        </div>

                                    </div>

                                </div>

                            </div> */}

                            <div className='col-lg-12 mb-3'>
                                <div className="review-slider">
                                    <Splide
                                        options={{
                                            type: 'loop',
                                            perPage: 3,
                                            autoplay: true,
                                            interval: 2000,
                                            speed: 1000,
                                            pauseOnHover: true,
                                            arrows: false,
                                            gap: '1rem',
                                            pagination: false,
                                            breakpoints: {
                                                1200: {
                                                    perPage: 3,
                                                },
                                                992: {
                                                    perPage: 2,
                                                },
                                                768: {
                                                    perPage: 1,
                                                },
                                            },
                                        }}
                                        aria-label="Review"
                                    >

                                        {firstHalf?.map((item, key) =>
                                            <SplideSlide key={key}>
                                                <div className='review-card'>
                                                    <div className='reveiw-content'>
                                                        <p>{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                                    </div>

                                                    <div className='review-detail'>
                                                        {/* <div>
                                                            <img src={item?.image ? `${base_url}/${item?.image}` : "/assets/images/chat-user.png"} alt="" />
                                                        </div> */}

                                                        <div className='grow-about-content'>
                                                            <h4 className='fz-24 lh-sm mb-0' >{item?.reviewUser}</h4>

                                                            <p className='mb-0 fz-16'>{defaultLang == "en" ? item?.locationEnglish : item?.locationHindi}</p>
                                                        </div>

                                                    </div>

                                                </div>
                                            </SplideSlide>)}
                                    </Splide>
                                </div>
                            </div>


                            <div className='col-lg-12 mb-3'>
                                <div className="reviews-slider">
                                    <Splide
                                        options={{
                                            type: 'loop',
                                            perPage: 3,
                                            autoplay: true,
                                            interval: 2000,
                                            speed: 1000,
                                            pauseOnHover: true,
                                            arrows: false,
                                            gap: '1rem',
                                            pagination: false,
                                            breakpoints: {
                                                1200: {
                                                    perPage: 3,
                                                },
                                                992: {
                                                    perPage: 2,
                                                },
                                                768: {
                                                    perPage: 1,
                                                },
                                            },
                                        }}
                                        aria-label="Reviews"
                                    >

                                        {secondHalf?.map((item, key) =>
                                            <SplideSlide key={key}>
                                                <div className='review-card'>
                                                    <div className='reveiw-content'>
                                                        <p>{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                                    </div>

                                                    <div className='review-detail'>
                                                        {/* <div>
                                                            <img src={item?.image ? `${base_url}/${item?.image}` : "/assets/images/chat-user.png"} alt="" />
                                                        </div> */}

                                                        <div className='grow-about-content'>
                                                            <h4 className='fz-24 lh-sm mb-0' >{item?.reviewUser}</h4>

                                                            <p className='mb-0 fz-16'>{defaultLang == "en" ? item?.locationEnglish : item?.locationHindi}</p>

                                                        </div>

                                                    </div>

                                                </div>
                                            </SplideSlide>)}
                                    </Splide>
                                </div>
                            </div>
                        </div>

                    </div>

                </section>





                {/* <section className="live-trade-section" data-aos="fade-up">
                    <div className="container">
                        <div className="mb-4">
                            <h2 className="text-center">{defaultLang == 'en' ? homeData?.featureHeading : homeData?.hindiFeatureHeading}</h2>
                            <p>
                                {defaultLang == 'en' ? homeData?.featureDesc : homeData?.hindiFeatureDesc}
                            </p>
                        </div>
                        {featuresData.length > 0 &&
                            <div className="row live-trade-card g-0">
                                <div className="col-12 col-lg-6 p-4 d-flex flex-column justify-content-center">
                                    <div className="icon-circle mb-3">
                                        <img src={`${base_url}/${featuresData[0]?.icon}` || "assets/images/trade-icon.png"} alt="Trading Icon" />
                                    </div>
                                    <h4 className="">{defaultLang == 'en' ? featuresData[0]?.heading : featuresData[0]?.hindiHeading}</h4>
                                    <p>
                                        {defaultLang == 'en' ? featuresData[0]?.subHeading : featuresData[0]?.hindiSubHeading}
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
                            {featuresData.length > 0 &&
                                featuresData.slice(1, 4).map((item, index) => {
                                    const currentIndex = index + 1
                                    return <div className="col-lg-4 col-md-6 col-sm-12" key={currentIndex}>
                                        <div className="otc-card p-4 position-relative">
                                            <div className="icon-circle mb-3">
                                                <img src={`${base_url}/${item?.icon}` || "assets/images/card-icon.png"} alt="Icon" />
                                            </div>
                                            <div className="my-3">
                                                <h4 className="mb-2">{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h4>
                                                <p className="mb-3">
                                                    {defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}                                            </p>
                                                {activeFeature === currentIndex && <p className="mb-3">
                                                    {defaultLang == 'en' ? item?.description : item?.hindiDescription}
                                                </p>}
                                                <div>
                                                    {activeFeature === currentIndex ?
                                                        <Link to="" className="learn-more" onClick={() => setActiveFeature(null)}>
                                                            Hide
                                                        </Link> :
                                                        <Link to="" className="learn-more" onClick={() => setActiveFeature(currentIndex)}>
                                                            Learn More
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

                {/* <section className="demo-account-section" data-aos="fade-up">
                    <div className="container">
                        <h2 className="text-center">{defaultLang == 'en' ? homeData?.accountInfo?.heading : homeData?.accountInfo?.hindiHeading}</h2>
                        <p className="text-center">
                            {defaultLang == 'en' ? homeData?.accountInfo?.subHeading : homeData?.accountInfo?.hindiSubHeading}
                        </p>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="demo-acct-picture">
                                    <img src="assets/images/demo-account.jpg" alt="" />
                                    <div className="demo-account-text">
                                        <h3>{defaultLang == 'en' ? homeData?.demoAccount?.heading : homeData?.demoAccount?.hindiHeading}</h3>
                                        <p>
                                            {defaultLang == 'en' ? homeData?.demoAccount?.subHeading : homeData?.demoAccount?.hindiSubHeading}
                                        </p>
                                        <Link to="/register" className="learn-more">
                                            {t('tryNow')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* <section className="trusted-section" data-aos="fade-up">
                    <div className="container">
                        <div className="mb-5">
                            <h2 className="text-center">
                                {defaultLang == 'en' ? generalData?.testimonial?.heading : generalData?.testimonial?.hindiHeading} </h2>
                            <h3 className="text-center">
                                {defaultLang == 'en' ? generalData?.testimonial?.subHeading : generalData?.testimonial?.hindiSubHeading}
                            </h3>
                        </div>
                        <div className="row">

                            {reviewsData?.map((item, index) => (
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-3" key={index}>
                                    <div className="testimonial-card slide-left">
                                        <img src={`${base_url}/${item.image}`} alt="User" />
                                        <p className="my-3">{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                        <h6>{item?.reviewUser}</h6>
                                    </div>
                                </div>
                            ))}
                            {reviewsData?.map((item, index) => (
                                <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
                                    <div className="testimonial-card slide-left">
                                        <img src={`${base_url}/${item.image}`} alt="User" />
                                        <p className="my-3">{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                        <h6>{item?.reviewUser}</h6>
                                    </div>
                                </div>
                            ))}


                        </div>

                    </div>
                </section> */}

                {/* <section className="trade-faq-section" data-aos="fade-up">
                    <div className="container">
                        <div className="mb-5">
                            <h2 className="text-center"> {defaultLang == 'en' ? homeData?.faq?.heading : homeData?.faq?.hindiHeading}</h2>
                            <p className="text-center">
                                {defaultLang == 'en' ? homeData?.faq?.subHeading : homeData?.faq?.hindiSubHeading}
                            </p>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-10 col-md-10 col-sm-12">
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



            </div>}
        </>
    )
}

export default Home
