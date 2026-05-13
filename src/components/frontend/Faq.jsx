import React, { useEffect, useState } from 'react'
import { faqList } from '../../staticData'
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AOS from "aos";
import "aos/dist/aos.css";

function Faq() {
    const [openFaq, setOpenFaq] = useState(null);
    const toggleFaq = (key) => {
        setOpenFaq((prev) => (prev === key ? null : key));
    };
    const [openIndex, setOpenIndex] = useState(null);
    const [generalData, setGeneralData] = useState({})
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


            <section className='unicorn-main-section all-hm-banner '  data-aos="fade-up">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className='contact-content nw-main-content text-center'>
                                <h2 className=''>FAQ</h2>
                                <p>is a modern financial trading platform offering fast, secure, and transparent binary <span className='d-lg-block d-sm-inline'>options and forex trading.</span> </p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>



            {/* <section className='unicorn-faq-section'>
                <div className='container'>
                    <div className='row'>
                        <div className='grow-about-content text-center'>
                            <p className='grow-first-title'><span className='grow-title'>FAQ</span></p>
                            <h4>Find Quick Answers to Common <span className='d-lg-block d-sm-inline'>Unicorn Options Questions.</span> </h4>
                        </div>

                        <div className='col-lg-6'>

                        </div>

                    </div>

                </div>

            </section> */}

            <section className='unicorn-faq-section'  data-aos="fade-up">
                <div className='container'>
                    <div className='row'>
                        <div className='grow-about-content text-center'>
                            <p className='grow-first-title'>
                                <span className='grow-title'>FAQ</span>
                            </p>
                            <h4>
                                Find Quick Answers to Common
                                <span className='d-lg-block d-sm-inline'>
                                    Unicorn Options Questions.
                                </span>
                            </h4>
                        </div>
                    </div>

                    {/* 👇 Niche wala FAQ yahin set kar diya */}
                    {faqData?.map((item, sectionKey) => {
                        const half = Math.ceil(item.content.length / 2);
                        const leftColumn = item.content.slice(0, half);
                        const rightColumn = item.content.slice(half);

                        return (
                            <section key={sectionKey} className="trade-faq-section py-0 faq-pg-section">
                                {/* <div className="mb-2">
                                    <h2 className="text-start">
                                        {defaultLang === 'en' ? item?.type : item?.hindiType}
                                    </h2>
                                </div> */}

                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="faq-bx">
                                            {leftColumn.map((faq, index) => {
                                                const uniqueKey = `${sectionKey}-left-${index}`;
                                                return (
                                                    <div className="faq-item" key={uniqueKey}>
                                                        <div
                                                            className="faq-question"
                                                            onClick={() => toggleFaq(uniqueKey)}
                                                        >
                                                            <span>
                                                                {defaultLang === 'en'
                                                                    ? faq?.question
                                                                    : faq?.hindiQuestion}
                                                            </span>

                                                            {/* <i className="fas fa-chevron-down" /> */}
                                                        </div>

                                                        {openFaq === uniqueKey && (
                                                            <div className="faq-answer">
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
                                        <div className="faq-bx">
                                            {rightColumn.map((faq, index) => {
                                                const uniqueKey = `${sectionKey}-right-${index}`;
                                                return (
                                                    <div className="faq-item" key={uniqueKey}>
                                                        <div
                                                            className="faq-question"
                                                            onClick={() => toggleFaq(uniqueKey)}
                                                        >
                                                            <span>
                                                                {defaultLang === 'en'
                                                                    ? faq?.question
                                                                    : faq?.hindiQuestion}
                                                            </span>
                                                            {/* <i className="fas fa-chevron-down" /> */}
                                                        </div>

                                                        {openFaq === uniqueKey && (
                                                            <div className="faq-answer">
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


            {/* <section className='unicorn-crypto-section'>
                <div className='container'>
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='grow-about-content text-center nw-plb-space'>
                                <h4 className=''>Start Your Crypto Journey <span className='d-lg-block d-sm-inline'>with Unicorn Options Today!</span> </h4>
                                <p>Join Unicorn Options and simplify your cryptocurrency journey!</p>

                                <div className='mt-5'>
                                    <button className='thm-lg-btn'>Sign Up Today!</button>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </section> */}


            {/* <section className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center">
                            <div>
                                <h2>{t('faq')}</h2>
                                <p>
                                    {defaultLang == 'en' ? generalData?.faqDesc : generalData?.hindiFaqDesc}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="about-right-image">
                                <img src={`${base_url}/${generalData?.faqImg}` || "assets/images/faq-pic.png"} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {faqData?.map((item, sectionKey) => {
                const half = Math.ceil(item.content.length / 2);
                const leftColumn = item.content.slice(0, half);
                const rightColumn = item.content.slice(half);

                return (
                    <section key={sectionKey} className="trade-faq-section py-0 faq-pg-section">
                        <div className="container">
                            {/* <div className="mb-2">
                                <h2 className="text-start">{defaultLang == 'en' ? item?.type : item?.hindiType}</h2>
                            </div> */}
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="faq-bx">
                                        {leftColumn.map((faq, index) => {
                                            const uniqueKey = `${sectionKey}-left-${index}`;
                                            return (
                                                <div className="faq-item" key={uniqueKey}>
                                                    <div className="faq-question" onClick={() => toggleFaq(uniqueKey)}>

                                                        <span>{defaultLang == 'en' ? faq?.question : faq?.hindiQuestion}</span>
                                                        {/* <i className="fas fa-chevron-down" /> */}
                                                        
                                                    </div>
                                                    <div className="faq-answer">
                                                        {openFaq === uniqueKey && (defaultLang == 'en' ? faq?.answer : faq?.hindiAnswer)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="faq-bx">
                                        {rightColumn.map((faq, index) => {
                                            const uniqueKey = `${sectionKey}-right-${index}`;
                                            return (
                                                <div className="faq-item" key={uniqueKey}>
                                                    <div className="faq-question" onClick={() => toggleFaq(uniqueKey)}>

                                                        <span>{defaultLang == 'en' ? faq?.question : faq?.hindiQuestion}</span>
                                                        {/* <i className="fas fa-chevron-down" /> */}

                                                    </div>
                                                    <div className="faq-answer">
                                                        {openFaq === uniqueKey && (defaultLang == 'en' ? faq?.answer : faq?.hindiAnswer)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}


        </>

    )
}

export default Faq
