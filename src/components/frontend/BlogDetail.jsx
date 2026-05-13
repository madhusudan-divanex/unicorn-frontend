import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AOS from "aos";
import "aos/dist/aos.css";
import { faqList } from '../../staticData'
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { Link, useParams } from 'react-router-dom';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";

function BlogDetail() {
    const { id } = useParams()
    const [generalData, setGeneralData] = useState()
    const toggleFaq = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    useEffect(() => {
        async function getData() {
            try {
                const [
                    gData
                ] = await Promise.all([
                    getApiData('get-general-data')
                ])

                setGeneralData(gData?.generalData)
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

    const [blogData, setBlogData] = useState()

    async function getBlogData() {
        try {
            const [blogData] = await Promise.all([
                getApiData(`blog/${id}`)
            ])
            if (blogData.success) {
                setBlogData(blogData?.blog)
            }

        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getBlogData()
    }, [id])

    return (
        <>
            <section className="about-section all-hm-banner" data-aos="fade-up">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8  col-sm-12 ">
                            <div className='contact-content text-center'>
                                <img style={{ width: '100%', height: "100%" }} src={`${base_url}/${blogData?.image}`} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blog-section" data-aos="fade-up">
                <div className="container">
                    <div className="blog-cards-section">
                        <div className="row">

                            <div className="bloging-page-content">
                                <h4>{defaultLang == "en" ? blogData?.heading : blogData?.hindiHeading} <span className="d-lg-block d-sm-inline"></span> </h4>

                                <div className="blog-date-box">
                                    <div className='unicorn-mb-bx'>
                                        <p className='grow-first-title lh-sm'><span className='grow-title'>{blogData?.category}</span></p>
                                    </div>
                                    {/* <span className="blog-pic-circle"></span> */}
                                    <div>
                                        <h5> {new Date(blogData?.createdAt)?.toLocaleDateString('en-GB')}</h5>
                                    </div>
                                </div>

                                <p>{defaultLang == "en" ? blogData?.subHeading : blogData?.hindiSubHeading}</p>
                                <p className="mt-3">{defaultLang == "en" ? <div
                                    dangerouslySetInnerHTML={{ __html: blogData?.content }} />
                                    : <div
                                        dangerouslySetInnerHTML={{ __html: blogData?.hindiContent }} />}</p>





                            </div>
                            <div className="text-center mt-3">
                                <Link className='thm-btn' to={-1}>Go Back</Link>
                            </div>
                        </div>

                    </div>
                </div>

            </section>



        </>
    )
}

export default BlogDetail