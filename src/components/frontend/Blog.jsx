import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AOS from "aos";
import "aos/dist/aos.css";
import { faqList } from '../../staticData'
import { getApiData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";

function Blog() {
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null);
  const [homeData, setHomeData] = useState({})
  const [faqData, setFaqData] = useState([])
  const [workData, setWorkData] = useState([])
  const [aboutData, setAboutData] = useState([])
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

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [blogList, setBlogList] = useState([])
  const [catList, setCatList] = useState([])
  const [category, setCategory] = useState('')
  const [topPost, setTopPost] = useState()
  const [latestPost, setLatestPost] = useState([])

  async function getCategories() {
    try {
      const [catData] = await Promise.all([
        getApiData(`blog/category`)
      ])
      if (catData.success) {
        setCatList(catData?.category)
      }

    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])
  async function getBlogs() {
    try {
      const [blogData] = await Promise.all([
        getApiData(`blog/all?page=${currentPage}&category=${category}`)
      ])
      if (blogData.success) {
        setTotalPage(blogData?.totalPage)
        setTopPost(blogData?.topPost)
        setLatestPost(blogData?.latestPost)
        setBlogList(prev => [...prev, ...blogData?.blogs])
      }

    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getBlogs()
  }, [currentPage, category])
  useEffect(() => {
    setBlogList([])
    setCurrentPage(1)
  }, [category])

  return (
    <>
      <section className="about-section all-hm-banner" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8  col-sm-12 ">
              <div className='contact-content text-center'>
                <h2 className="mb-3">{defaultLang == "en" ? generalData?.blogPageHeading : generalData?.blogPageHindiHeading}</h2>
                <p>{defaultLang == "en" ? generalData?.blogPageSubHeading : generalData?.blogPageHindiSubHeading}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" data-aos="fade-up">
        <div className="container">
          <div className="blog-cards-section">
            {topPost && <div className="row">
              <div className="col-lg-7 col-md-6 col-sm-12 mb-3 mb-lg-0">
                {/* <div className="blog-picture-box">  */}
                <img style={{ width: '100%', height: "100%" }} src={`${base_url}/${topPost?.image}`} alt="" />
                {/* </div> */}

              </div>

              <div className="col-lg-5 col-md-6 col-sm-12">
                <div className='unicorn-mb-bx'>
                  <p className='grow-first-title lh-sm'><span className='grow-title'>{topPost?.category}</span></p>
                </div>
                <div className="bloging-page-content">
                  <h4>{defaultLang == "en" ? topPost?.heading : topPost?.hindiHeading} <span className="d-lg-block d-sm-inline"></span> </h4>

                  <div className="blog-date-box">
                    {/* <span className="blog-pic-circle"></span> */}
                    <div>
                      <h5> {new Date(topPost?.createdAt)?.toLocaleDateString('en-GB')}</h5>
                    </div>
                  </div>

                  <p>{defaultLang == "en" ? topPost?.subHeading : topPost?.hindiSubHeading}</p>

                </div>

                <div className="mt-4">
                  <Link to={`/blog-detail/${topPost?.heading}/${topPost?._id}`} className="thm-btn">Read More <FontAwesomeIcon icon={faArrowRight} /> </Link>
                </div>


              </div>
            </div>}

          </div>
        </div>

      </section>

      <section className="latest-post-section" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center">

            <div className="grow-about-content">
              <h4 className="text-center">Latest Post</h4>
            </div>

            <div className="col-lg-10">
              <div className="post-tab-box">
                <ul className="nav nav-tabs blog-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active blog-link" data-bs-toggle="tab" data-bs-target="#home" onClick={() => setCategory('')} type="button">
                      All Articles
                    </button>
                  </li>

                  {catList?.map((cat, key) =>
                    <li className="nav-item" role="presentation" key={key}>
                      <button className="nav-link blog-link" data-bs-toggle="tab" data-bs-target={cat} onClick={() => setCategory(cat)} type="button">
                        {cat}
                      </button>
                    </li>)}
                </ul>
              </div>

            </div>

            <div className="col-lg-12">
              <div className="tab-content mt-4">
                {/* <div className="tab-pane fade show active" id="home"> */}
                <div className="row">
                  {blogList?.map((blog, key) =>
                    <Link to={`/blog-detail/${blog?.heading}/${blog?._id}`} className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                      <div className="post-cards">
                        <div className="post-picture-box">
                          <img style={{ width: '100%', height: "100%" }} src={`${base_url}/${blog?.image}`} alt="" />
                        </div>
                        <div className="post-blog-content">
                          <h6>{new Date(blog?.createdAt)?.toLocaleDateString('en-GB')}</h6>
                          <span className="post-category-title">{blog?.category}</span>
                          <h5>{defaultLang == "en" ? blog?.heading : blog?.hindiHeading}</h5>
                        </div>
                      </div>
                    </Link>)}
                </div>
                {/* </div> */}



              </div>

              <div className="mt-3 text-center">
                {currentPage < totalPage && <div>
                  <button className="more-post-btn" onClick={() => setCurrentPage(prev => prev + 1)}>See More Posts</button>
                </div>}

              </div>

            </div>



          </div>

        </div>
      </section>

      <section className="latest-post-section" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="grow-about-content text-center mb-4">
              <h4 className="text-center">Latest Post</h4>
            </div>

            {latestPost?.map((item, key) =>
              <Link to={`/blog-detail/${item?.heading}/${item?._id}`} className="col-lg-6 col-md-6 col-sm-12 mb-3 mb-lg-0" key={key}>
                <div className="unicorn-post-crds">
                  <div className="unicorn-post-content">
                    <span className="post-category-title mt-0 mb-3">{item?.category}</span>
                    <h4>{defaultLang == "en" ? item?.heading : item?.hindiHeading}</h4>
                    <p>{defaultLang == "en" ? item?.subHeading : item?.hindiSubHeading}</p>
                    <h6>{new Date(item?.createdAt)?.toLocaleDateString('en-GB')}</h6>
                  </div>


                </div>

              </Link>
            )}

          </div>
        </div>

      </section>

    </>
  )
}

export default Blog