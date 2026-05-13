import React, { useEffect, useRef, useState } from 'react'
import { testimonials } from '../../staticData'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Link } from 'react-router-dom';
import { base_url } from '../../baseUrl';
import { getApiData } from '../../services/api';

import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';


function Partner() {
    const [workData, setWorkData] = useState([])
    const [partnerData, setPartnerData] = useState({})
    const [reviewsData, setReviewsData] = useState([])
    const [partnerFeature, setPartnerFeature] = useState([])
    const [partnerCategories, setPartnerCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [aboutData, setAboutData] = useState()
    const [generalData, setGeneralData] = useState({})
    useEffect(() => {
        async function getData() {
            try {
                // Fire all requests at once
                const [rData, data, wData, pCData, aData, gData] = await Promise.all([
                    getApiData('get-reviews'),
                    getApiData('get-partner-data'),
                    getApiData('how-it-work'),
                    getApiData('get-partner-category'),
                    getApiData('get-about'),
                    getApiData('get-general-data')
                ]);

                // Process and set state
                setReviewsData(rData?.reviews.filter(item => item.type === 'partner'));
                setPartnerData(data?.partnerData);
                setWorkData(wData?.workData.filter(item => item.type === 'partner'));
                setPartnerCategories(pCData?.partnerCategory);
                setAboutData(aData?.aboutData);
                setGeneralData(gData?.generalData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);
    const firstHalf = reviewsData.slice(0, Math.ceil(reviewsData.length / 2))
    const secondHalf = reviewsData.slice(Math.ceil(reviewsData.length / 2))

    const headerFeature = partnerFeature?.filter(item => item.type == 'header')
    const footerFeature = partnerFeature?.filter(item => item.type == 'footer')

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
            {loading ? <Loader />
                :
                <>

                    <section className="about-section all-hm-banner" data-aos="fade-up">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-7  col-sm-12 ">
                                    <div className='contact-content text-center'>
                                        <h2>{t('Partner With Us')}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='p-100 ' data-aos="fade-up" >
                        <div className="container">
                            <div className="row">
                                <div className='col-lg-6 col-md-12 col-sm-12 mb-3'>
                                    <div className='unicorn-mb-bx'>
                                        <p className='grow-first-title'><span className='grow-title'>{t('About us')}</span></p>
                                    </div>

                                    <div className='grow-about-content'>
                                        <h4>{defaultLang == "en" ? partnerData?.header?.heading : partnerData?.header?.hindiHeading}</h4>
                                    </div>

                                    <div className='mt-3 parter-box'>
                                        <Link to='/affiliate/login' className='thm-btn'>Become A Partner</Link>

                                    </div>

                                </div>
                                <div className='col-lg-6 col-md-12 col-sm-12 mb-3'>
                                    <img src={`${base_url}/${partnerData?.header?.image}`} alt="" />
                                    {/* <div className='unicorn-partner-card'> */}

                                    {/* </div> */}
                                </div>
                            </div>
                        </div>

                    </section>

                    <section className='unicorn-work-section ' data-aos="fade-up" >
                        <div className='red-shape-circle'></div>

                        <div className='container'>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div >
                                        <div className='grow-about-content text-start'>
                                            <div className='unicorn-mb-bx'>
                                                <p className='grow-first-title'><span className='grow-title'>How It Works</span></p>
                                            </div>
                                            <h4>{defaultLang == "en" ? partnerData?.howWorksHeading : partnerData?.hindiHowWorksHeading}</h4>

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

                    {/* <section className='unicorn-counter-section'>
                    <div className='container'>
                        <div className="row">
                            <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                                <div className='grow-about-content counter-content'>
                                    <h4 className='grow-first-title'>500K+</h4>
                                    <p>Active Users</p>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                                <div className='grow-about-content counter-content'>
                                    <h4 className='grow-first-title'>100+</h4>
                                    <p>Supported Cryptocurrencies</p>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                                <div className='grow-about-content counter-content'>
                                    <h4 className='grow-first-title'>$1B+</h4>
                                    <p>Assets Managed</p>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                                <div className='grow-about-content counter-content'>
                                    <h4 className='grow-first-title'>100K+</h4>
                                    <p>Trade Transactions</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </section> */}

                    <section className='unicorn-counter-section ' data-aos="fade-up" >
                        <div className='container'>
                            <div className="row">
                                {partnerData?.statusCounter?.map((item, key) => <div className='col-lg-3 col-md-4 col-sm-6 mb-3' key={key}>
                                    <div className='grow-about-content counter-content'>
                                        <h4 className='grow-first-title'>{item?.statusValue}</h4>
                                        <p>{item?.statusName}</p>
                                    </div>
                                </div>)}



                            </div>
                        </div>
                    </section>


                    <section className='unicorn-trust-section ' data-aos="fade-up" >
                        <div className='container'>
                            <div className="row">
                                <div className='grow-about-content text-center mb-4'>
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
                                                type: "loop",
                                                perPage: 3,
                                                autoplay: true,
                                                interval: 2000,     // slide change time
                                                speed: 600,         // animation speed
                                                pauseOnHover: true,
                                                pauseOnFocus: false,
                                                arrows: false,
                                                gap: "1rem",
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
                                                                <p className='mb-0'>{defaultLang == "en" ? item?.locationEnglish : item?.locationHindi}</p>
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

                                                interval: 3000,
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
                                                                <p className='mb-0'>{defaultLang == "en" ? item?.locationEnglish : item?.locationHindi}</p>
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





                    {/* <section className="about-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center">
                                <div className='nw-partner-bx'>
                                    <h2>{defaultLang == 'en' ? partnerData?.header?.heading : partnerData?.header?.hindiHeading}</h2>
                                    <Link to='/affiliate/login' className="thm-btn mt-3">
                                        {t('becomePartner')} <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="about-right-image">
                                    <img src={`${base_url}/${partnerData?.header?.image}` || "assets/images/partner.png"} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                    {/* <section className="partner-section " data-aos="fade-up"  >
                    <div className="container">
                        <div className="row">
                            {headerFeature?.length > 0 &&
                                headerFeature?.map((item, key) => (
                                    <div className="col-lg-4 col-md-4 col-sm-12" key={key} >
                                        <div className="prtner-card">
                                            <div className="prtner-content-crd">
                                                <h4>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h4>
                                                <p>{defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}</p>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                                                <div className="partner-circle mb-4 ">
                                                    <img src={`${base_url}/${item?.image}` || "assets/images/partner-crd-referral.png"} alt="" />
                                                </div>
                                                <div className="prtner-btm-text">
                                                    <div>
                                                        <h6>Up to</h6>
                                                        <h3>{item?.value}</h3>
                                                    </div>
                                                    <div>
                                                        <img src="assets/images/vector-arrow.png" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="partner-botm-image" />
                                        </div>
                                    </div>))}
                        </div>
                        <div className="row mt-3">
                            {footerFeature?.length > 0 &&
                                footerFeature?.slice(0, 2)?.map((item, key) => (
                                    <div className="col-lg-6 col-md-6 col-sm-12" key={key}>
                                        <div className="custom-crd-box">
                                            <div>
                                                <img src={`${base_url}/${item?.image}` || "assets/images/csutom-crd-second.png"} alt="" />
                                            </div>
                                            <div>
                                                <h4>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h4>
                                                <p>
                                                    {defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}
                                                </p>
                                            </div>
                                            <div></div>
                                        </div>
                                    </div>))}
                        </div>
                    </div>
                </section> */}

                    {/* <section className="eran-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div>
                                    <h2>
                                        {defaultLang == 'en' ? partnerData?.featureDesc : partnerData?.hindiFeatureDesc}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                    {/* <section className="live-trade-section" data-aos="fade-up" >
                    <div className="container">
                        <div className="mb-4">
                            <h2 className="text-center">{defaultLang == 'en' ? partnerData?.featureHeading : partnerData?.hindiFeatureHeading}</h2>
                        </div>
                        <div className="row trade-crd-box mt-5">
                            {footerFeature?.length > 0 &&
                                footerFeature?.slice(2).map((item, key) => (
                                    <div className="col-lg-4 col-md-4 col-sm-12 mb-3" key={key}>
                                        <div className="otc-card p-4 position-relative">
                                            <div className="icon-circle mb-3">
                                                <img src={`${base_url}/${item?.image}` || "assets/images/card-icon.png"} alt="Icon" />
                                            </div>
                                            <div className="my-3">
                                                <h4>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h4>
                                                <p>
                                                    {defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}
                                                </p>
                                            </div>
                                            <div className={(key % 2 === 0) ? "bottom-pattern-one" : "bottom-pattern-two"} />
                                        </div>
                                    </div>))}
                        </div>
                        <div className="row ">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="about-section d-flex justify-content-center">
                                    <Link to='/affiliate/login' className="thm-btn mt-3">
                                        {t('becomePartner')} <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                    {/* <section className="trusted-section" data-aos="fade-up" >
                    <div className="container-fluid">
                        <div className="mb-5">
                            <h2 className="text-center">{defaultLang == 'en' ? partnerData?.testimonialHeading : partnerData?.hindiTestimonialHeading}</h2>
                            <p className="text-center">
                                {defaultLang == 'en' ? partnerData?.testimonialSubHeading : partnerData?.hindiTestimonialSubHeading}
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="testimonial-slider">
                                    <Splide
                                        options={{
                                            type: 'loop',
                                            perPage: 4,
                                            autoplay: true,
                                            interval: 3000,
                                            pauseOnHover: true,
                                            arrows: true,
                                            direction: 'rtl',
                                            gap: '1rem',
                                            pagination: true,
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
                                        aria-label="Testimonials"
                                    >
                                        {firstHalf.map((item, index) => (
                                            <SplideSlide key={index}>
                                                <div className="testimonial-card slide-left">
                                                    <img src={`${base_url}/${item.image}`} alt="User" />
                                                    <p className="my-3">{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                                    <h6>{item?.reviewUser}</h6>
                                                </div>
                                            </SplideSlide>
                                        ))}
                                    </Splide>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12">
                                <div className="testimonial-slider">
                                    <Splide
                                        options={{
                                            type: 'loop',
                                            perPage: 4,
                                            autoplay: true,
                                            direction: 'ltr',
                                            gap: '1rem',
                                            interval: 3000,
                                            pauseOnHover: true,
                                            arrows: true,
                                            pagination: true,
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
                                        aria-label="Testimonials"
                                    >
                                        {secondHalf?.map((item, index) => (
                                            <SplideSlide key={index}>
                                                <div className="testimonial-card slide-left">
                                                    <img src={`${base_url}/${item.image}`} alt="User" />
                                                    <p className="my-3">{defaultLang == 'en' ? item?.reviewDesc : item?.hindiReviewDesc}</p>
                                                    <h6>{item?.reviewUser}</h6>
                                                </div>
                                            </SplideSlide>
                                        ))}
                                    </Splide>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                    {/* <section className="partner-people-section" data-aos="fade-up" >
                    <div className="container">
                        <div className="row">
                            <h2 className="text-center">{defaultLang == 'en' ? partnerData?.weHeading : partnerData?.hindiWeHeading}</h2>
                            {partnerCategories?.length > 0 &&
                                partnerCategories?.map((item, key) => (
                                    <div className="col-lg-4 col-md-4 col-sm-12 mb-3" key={key}>
                                        <div className="partner-people-card">
                                            <div>
                                                <h5>{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h5>
                                                <p>
                                                    {defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}
                                                </p>
                                            </div>
                                            <div className="partner-people-image" >
                                                <img className='partner-category' src={`${base_url}/${item?.image}`} alt="" srcset="" />
                                            </div>
                                        </div>
                                    </div>))}

                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="partner-peo-btn d-flex justify-content-center">
                                    <Link to='/affilate/login' className="thm-btn mt-3">
                                        {t('becomePartner')} <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                    {/* <section className="how-it-work">
                    <div className="container">
                        <h2 className="text-center pb-3 text-white">{defaultLang == 'en' ? partnerData?.howWorksHeading : partnerData?.hindiHowWorksHeading}</h2>
                        <div className="row">
                            {workData?.length > 0 &&
                                workData.map((item, key) => (
                                    <div className="col-lg-4 col-md-4 col-ms-12" key={key}>
                                        <div className="how-it-wrk-box">
                                            <div className="how-it-wrk-content-box">
                                                <img src={`${base_url}/${item?.image}` || "assets/images/how-it-wk-frist.png"} alt="" />
                                                <h5 className="py-3 mb-0">{defaultLang == 'en' ? item?.heading : item?.hindiHeading}</h5>
                                                <p>{defaultLang == 'en' ? item?.subHeading : item?.hindiSubHeading}</p>
                                            </div>
                                        </div>
                                    </div>))}

                        </div>
                    </div>
                </section> */}

                </>

            }
        </>

    )
}

export default Partner
