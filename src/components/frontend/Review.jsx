import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { faqList, testimonials } from '../../staticData';
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';

import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


function Review() {
    const [generalData, setGeneralData] = useState({})
    const [reviewsData, setReviewsData] = useState([])
    useEffect(() => {
        async function getData() {
            const rData = await getApiData('get-reviews')
            const userReview = rData.reviews?.filter(item => item?.type == 'user')
            setReviewsData(userReview)
            const data = await getApiData('get-general-data')
            
            setGeneralData(data.generalData)
        }
        getData()
    }, [])
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
            duration: 1000,
            once: false,
        });
    }, []);
    return (
        <>
            <section className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center">
                            <div>
                                <h2>{t('review')}</h2>
                                <p>
                                    {defaultLang=='en'? generalData?.reviewDesc : generalData?.hindiReviewDesc}{" "}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="about-right-image">
                                <img src={`${base_url}/${generalData?.reviewImg}` || "assets/images/review.png"} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="trusted-section" data-aos="fade-up" >
                <div className="container">
                    <div className="mb-5">
                        <h2 className="text-center">{defaultLang=='en'? generalData?.testimonial?.heading :generalData?.testimonial?.hindiHeading} </h2>
                        <h3 className="text-center">
                            {defaultLang=='en'?  generalData?.testimonial?.subHeading :generalData?.testimonial?.hindiSubHeading}
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="testimonial-slider">
                                <Splide
                                    options={{
                                        type: 'loop',
                                        perPage: 2.8,
                                        autoplay: true,
                                        interval: 3000,
                                        pauseOnHover: true,
                                        arrows: false,
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
                                    {firstHalf?.map((item, index) => (
                                        <SplideSlide key={index}>
                                            <div className="testimonial-card slide-right">
                                                <img src={`${base_url}/${item.image}`} alt="User" />
                                                <p className="my-3">{defaultLang=='en'?  item?.reviewDesc : item?.hindiReviewDesc}</p>
                                                <h6>{item?.reviewUser}</h6>
                                            </div>
                                        </SplideSlide>
                                    ))}
                                </Splide>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-12">
                            <div className="testimonial-slider">
                                <Splide
                                    options={{
                                        type: 'loop',
                                        perPage: 2.8,
                                        autoplay: true,
                                        interval: 3000,
                                        pauseOnHover: true,
                                        arrows: false,
                                        direction: 'ltr',
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
                                    {secondHalf?.map((item, index) => (
                                        <SplideSlide key={index}>
                                            <div className="testimonial-card slide-right">
                                                <img src={`${base_url}/${item.image}`} alt="User" />
                                                <p className="my-3">{defaultLang=='en'? item?.reviewDesc :item?.hindiReviewDesc}</p>
                                                <h6>{item?.reviewUser}</h6>
                                            </div>
                                        </SplideSlide>
                                    ))}
                                </Splide>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Review
