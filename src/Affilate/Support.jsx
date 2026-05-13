import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { faAngleLeft, faBell, faClose, faCreditCard, faGift, faRotate, faUser, faWallet } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useRef, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import { ChevronDown, X } from "lucide-react";
import { Accordion } from "react-bootstrap";
import { getApiData, getSecureApiData, securePostData, updateApiData } from "../services/api";
import { base_url } from "../baseUrl";
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getWebisteSetting } from "../services/globalFunction";




function AffiliateSupport() {
    const inputRef = useRef(null);
    const navigate = useNavigate()
    const [key, setKey] = useState("request");
    const [firstBonus, setFirstBonus] = useState()
    const [activeType, setActiveType] = useState()
    const [siteLang, setSiteLang] = useState('en')
    const dispatch = useDispatch()
    // Wallet BTN oFFcanvas
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const [activeData, setActiveData] = useState([])
    const isLogin = useSelector((state) => state.auth.isLogin);
    const [userRequest, setUserRequest] = useState([])
    const [selected, setSelected] = useState(0);
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [activeSubject, setActiveSubject] = useState('verification')
    const { userData, userSetting } = useSelector((state) => state.user);
    const { walletUse, activeTicker, demoWallet, defaultCurrency, dollerToInr, hideBalance } = useSelector((state) => state.wallet);
    const [requestForm, setRequestForm] = useState({ attachment: null, issue: '', subject: 'other' })
    const [faqData, setFaqData] = useState([])
    const userId = JSON.parse(localStorage.getItem('userId'))

    const generalFaqs =
        faqData?.find(item => item?.type?.toLowerCase() === 'general')?.content || [];

    async function getFaqData() {
        try {
            const result = await getApiData(`get-faq`)
            if (result.success) {
                setFaqData(result.allFaq)
                setActiveType(result?.allFaq[0]?.type)
                setActiveData(result?.allFaq[0]?.content)
            }
        } catch (error) {

            toast.error(error?.message || 'An error occured')
        }
    }
    useEffect(() => {
        getFaqData()

    }, []);
    const half = Math.ceil(activeData.length / 2);
    const leftColumn = activeData.slice(0, half);
    const rightColumn = activeData.slice(half);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setRequestForm({ ...requestForm, attachment: selectedFile });
        } else {
            alert('Only jpg, jpeg, png, and pdf files are allowed.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setRequestForm({ ...requestForm, attachment: droppedFile })
        } else {
            alert('Only jpg, jpeg, png, and pdf files are allowed.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return file && allowedTypes.includes(file.type);
    };
    const sendReport = async (e) => {
        e.preventDefault()
        if (!requestForm.issue || !requestForm.attachment) {
            toast.error('Please provie issue and image')
            return
        }
        const data = new FormData()
        data.append('userId', userId)
        data.append('issue', requestForm.issue)
        data.append('attachment', requestForm.attachment)
        data.append('subject', 'other')
        try {
            const result = await securePostData('add-user-request', data)
            if (result.message) {
                getRequestsData()
                toast.success("Request sent")
                setRequestForm({ attachment: null, issue: '', subject: 'other' })
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    async function getRequestsData() {
        try {
            const result = await getSecureApiData(`get-user-request/${userId}`)
            if (result.success) {
                setUserRequest(result.userRequest)
            }
            else {
                if (result.message == 'Session Timeout') {
                    const loginData = JSON.parse(localStorage.getItem('loginData'))
                    localStorage.clear()

                    if (loginData) {
                        localStorage.setItem('loginData', JSON.stringify(loginData))
                    }
                    navigate('/login')
                }
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getRequestsData()
    }, [])
    useEffect(() => {
        if (!userId) {
            navigate('/login')
        }
    }, [])
    async function getPanelData() {
        const data = await getWebisteSetting()
        setFirstBonus(data.firstBonus);
    }
    useEffect(() => {
        getPanelData()
    }, [])
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (userSetting && userSetting.language) {

            changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
            setSiteLang(userSetting.language == 'english' ? 'en' : 'hi')
        }
    }, [userSetting]);
    async function updateSetting() {
        const currency = userData.currency == 'inr' ? 'usd' : 'inr'
        let liveAmount = userData.liveAmount
        let demoAmount = userData.demoAmount
        const exchangeRate = dollerToInr || Number(import.meta.VITE_USD_TO_INR) || 87;
        if (currency == 'inr') {
            liveAmount = userData.liveAmount * exchangeRate
            demoAmount = userData.demoAmount * exchangeRate
        } else {
            liveAmount = userData.liveAmount / exchangeRate
            demoAmount = userData.demoAmount / exchangeRate
        }
        const data = { ...userData, userId, currency, liveAmount, demoAmount }
        try {
            const result = await updateApiData(`update-user-data`, data);
            if (result.success) {
                dispatch(fetchUserData());
                dispatch(setDefaultCurrency(currency))
                toast.success('Currency updated');
            }
        } catch (error) {
            toast.error(error.message)
                ;
        }
    }
    return (
        <>
            <section className="affiliate-support">
                <div className="container-fluid">
                    <div className="row ">
                        <div className="col-lg-12">
                            <div className="setting-tab-section">
                                <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3  p-2 rounded-3 setting-tab-btn">
                                    <Nav.Item>
                                        <Nav.Link eventKey="request" className="rounded-pill px-4 setting-tab-link"> {t('myRequest')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="create" className="rounded-pill ">{t('createRequest')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="faq" className="rounded-pill ">{t('faq')}</Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <div className="">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="request" active={key === "request"}>
                                            <Row>
                                                <Col md={12}>
                                                    {userRequest?.length === 0 ? <div className="d-flex justify-content-center align-items-center flex-column supprt-requt-bx ">
                                                        <img src="/assets/images/faqs.png" alt="" />
                                                        <h4>{t('noRequest')} </h4>
                                                        <p>{t('noRequestDesc')}</p>
                                                        <div className="">
                                                            <button onClick={() => setKey("create")} className="tour-join-details-btn ">{t('createRequest')}</button>
                                                        </div>
                                                    </div> :

                                                        <div className="affiliate-section">
                                                            <div className="table-responsive">
                                                                <table className="table align-middle">
                                                                    <thead className="table-light">
                                                                        <tr>
                                                                            <th>{t('id')}</th>
                                                                            <th>{t('issue')}</th>
                                                                            <th>{t('photo')}</th>
                                                                            <th>{t('status')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {userRequest?.map((item, key) => (
                                                                            <tr key={key}>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item?.issue}</td>
                                                                                <td>
                                                                                    <div className="support-picture">
                                                                                        <img src={`${base_url}/${item?.attachment}`} width={80} alt="" srcset="" />
                                                                                    </div>

                                                                                </td>
                                                                                <td>{item?.status}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>



                                                    }
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Security Tab */}
                                        <Tab.Pane eventKey="create" active={key === "create"}>
                                            <Row >
                                                <Col md={6} className="mb-3">

                                                    <div className="deposit-main-section">
                                                        <div className="tour-faq-bx">
                                                            <div>
                                                                <Accordion flush>
                                                                    {generalFaqs.length > 0 &&
                                                                        generalFaqs.map((item, index) => (
                                                                            <Accordion.Item eventKey={index.toString()} className="mb-3" key={index}>
                                                                                <Accordion.Header>{siteLang == 'en' ? item?.question : item?.hindiQuestion}</Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    {siteLang == 'en' ? item?.answer : item?.hindiAnswer}
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                        ))
                                                                    }
                                                                </Accordion>
                                                            </div>
                                                        </div>

                                                    </div>


                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <div className="deposit-main-section">
                                                        <div className="reqeust-bx">
                                                            <div className="reqeust-bx-crd">
                                                                <img src="/assets/images/p-bill.png" alt="" />
                                                                <div>
                                                                    <h5>{t('faqRequestHeading')}</h5>
                                                                    <button className="cutm-supptr">{t('contactSupport')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="requst-subject mt-3">
                                                            <h5 className="select-title">{t('selectSubject')}</h5>
                                                        </div>
                                                        <div className="requst-btm-bx">
                                                            <div className=" ">
                                                                {/* Tabs */}
                                                                <div className="d-flex gap-2 justify-content-center flex-column flex-lg-row mb-3">
                                                                    {faqData?.some(item => item.type?.toLowerCase().includes('verification')) &&
                                                                        <button onClick={(e) => {
                                                                            setSelectedQuestion(null)
                                                                            setActiveSubject('verification')
                                                                        }} className="custom-tab ">{t('verification')}</button>}
                                                                    {faqData?.some(item => item.type?.toLowerCase().includes('deposit') || item.type?.toLowerCase().includes('withdraw')) &&
                                                                        <button onClick={(e) => {
                                                                            setSelectedQuestion(null)
                                                                            setActiveSubject('deposit')
                                                                        }} className="custom-tab">{t('depositWithdraw')}</button>}
                                                                    <button onClick={(e) => setActiveSubject('other')} className="custom-tab">{t('other')}</button>
                                                                </div>
                                                                {/* Card Box */}
                                                                {activeSubject == 'verification' && <div className="custom-card-box">
                                                                    {/* Header */}
                                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                                        <h6 className="mb-0 text-white">{t('verification')}</h6>
                                                                        <button className="btn-close btn-close-white"></button>
                                                                    </div>

                                                                    {/* Radio Options */}
                                                                    <div className="mb-3">
                                                                        {faqData &&
                                                                            faqData.filter(item => item?.type?.toLowerCase().includes('verification')).map((item, index) => (
                                                                                item.content?.map((qa, key) => (
                                                                                    <div
                                                                                        key={key}
                                                                                        className="form-check text-white mb-2"
                                                                                        onClick={() => setSelectedQuestion(qa)}
                                                                                    >
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="radio"
                                                                                            checked={selectedQuestion?.question === qa.question}
                                                                                            onChange={() => setSelectedQuestion(qa)}
                                                                                        />
                                                                                        <label className="form-check-label">
                                                                                            {siteLang == 'en' ? qa?.question : qa?.hindiQuestion}
                                                                                        </label>
                                                                                    </div>))))}
                                                                    </div>

                                                                    {/* Info Box */}
                                                                    {siteLang == 'en' ? <p className="text-white fz-14">{selectedQuestion?.answer}</p> : selectedQuestion?.hindiAnswer &&
                                                                        <div className="custom-info-box text-white">
                                                                            {siteLang == 'en' ? selectedQuestion?.answer : selectedQuestion?.hindiAnswer || ``}

                                                                        </div>}
                                                                </div>}
                                                                {activeSubject == 'deposit' && <div className="custom-card-box">
                                                                    {/* Header */}
                                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                                        <h6 className="mb-0 text-white">{t('depositWithdraw')}</h6>
                                                                        <button className="btn-close btn-close-white"></button>
                                                                    </div>

                                                                    {/* Radio Options */}
                                                                    <div className="mb-3">
                                                                        {faqData &&
                                                                            faqData.filter(item => item?.type?.toLowerCase().includes('deposit') || item?.type?.toLowerCase().includes('withdraw')).map((item, index) => (
                                                                                item.content?.map((qa, key) => (
                                                                                    <div
                                                                                        key={key}
                                                                                        className="form-check text-white mb-2"
                                                                                        onClick={() => setSelectedQuestion(qa)}
                                                                                    >
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="radio"
                                                                                            checked={selectedQuestion?.question === qa.question}
                                                                                            onChange={() => setSelectedQuestion(qa)}
                                                                                        />
                                                                                        <label className="form-check-label">
                                                                                            {siteLang == 'en' ? qa?.question : qa?.hindiQuestion}
                                                                                        </label>
                                                                                    </div>))))}
                                                                    </div>
                                                                    {/* Info Box */}
                                                                    {selectedQuestion?.answer && <div className="custom-info-box text-white">
                                                                        {siteLang == 'en' ? selectedQuestion?.answer : selectedQuestion?.hindiAnswer || ``}
                                                                    </div>}
                                                                </div>}
                                                            </div>
                                                        </div>
                                                        {activeSubject == 'other' &&
                                                            <div className="requst-subject w-100">
                                                                <div className="">
                                                                    <div className="issue-box">
                                                                        <div className="issue-header">
                                                                            <h6 className="text-white">{t('other')} {t('issue')}</h6>
                                                                            <button className="close-btn"><FontAwesomeIcon icon={faClose} /></button>
                                                                        </div>

                                                                        <div className="mb-3 login-section py-0">
                                                                            <label htmlFor="" className="login-email text-white">{t("message")}</label>
                                                                            <textarea
                                                                                className="form-control message-box"
                                                                                placeholder={t('yourMessage')}
                                                                                required
                                                                                style={{ height: "100px", resize: "auto" }}
                                                                                value={requestForm?.issue}
                                                                                onChange={(e) => setRequestForm({ ...requestForm, issue: e.target.value })}
                                                                            />
                                                                        </div>


                                                                        <div className="upload-area">
                                                                            <input
                                                                                type="file"
                                                                                required
                                                                                id="uploadFile"
                                                                                hidden
                                                                                accept=".jpg,.jpeg,.png,.pdf"
                                                                                ref={inputRef}
                                                                                onChange={handleFileChange}
                                                                            />
                                                                            <label
                                                                                htmlFor="uploadFile"
                                                                                className="upload-content"
                                                                                onDrop={handleDrop}
                                                                                onDragOver={handleDragOver}
                                                                            >
                                                                                <div className="upload-icon" />
                                                                                <strong className="text-white">{t('attachementFiles')}</strong>
                                                                                <small>{t('clickAndDrop')}</small>
                                                                                <small>{t('format')}</small>
                                                                            </label>

                                                                            {/* Optional: Show selected file name */}
                                                                            {file && (
                                                                                <div className="text-white mt-2">
                                                                                    <small>Selected file:</small>
                                                                                    <p style={{ wordBreak: 'break-word' }}>{file.name}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>


                                                                        {/* Confirm Button */}
                                                                        <button type="button" className="thm-btn  w-100" onClick={sendReport}>
                                                                            {t('confirmAndSend')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>}

                                                    </div>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Notification Tab */}
                                        <Tab.Pane eventKey="faq" active={key === "faq"}>
                                            <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                    <div className="deposit-main-section">
                                                        <div className="tab-faq-section">
                                                            <h5>{t('faqFull')}</h5>

                                                            <div className="faq-main-crd-bx unicorn-faq-cards">
                                                                {faqData?.length > 0 &&
                                                                    faqData?.map((item, key) => (
                                                                        <div className={item?.type == activeType ? "faq-bx-crd unicorn-faq-active" : "faq-bx-crd faq-bx-crd"} key={key} onClick={() => {
                                                                            setActiveType(item?.type)
                                                                            setActiveData(item?.content)
                                                                        }}>
                                                                            <img src={item?.image ? `${base_url}/${item.image}` : "/assets/images/menu.png"} alt="" />
                                                                            <h6 className="mb-0">{siteLang == 'en' ? item?.type : item?.hindiType}</h6>
                                                                        </div>))}
                                                                {/* <div className="faq-bx-crd">
                                      <img src="/assets/images/faq-check.png" alt="" />
                                      <h6 className="mb-0">Tournaments</h6>
                                    </div> */}


                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mt-3">
                                                {/* Left Column */}
                                                <Col lg={6} md={6} sm={12} className="mb-3">
                                                    <div className="deposit-main-section">
                                                        <div className="tour-faq-bx">
                                                            <Accordion flush>
                                                                {leftColumn?.length > 0 &&
                                                                    leftColumn.map((item, index) => (
                                                                        <Accordion.Item
                                                                            eventKey={index.toString()}
                                                                            className=""
                                                                            key={`left-${index}`}
                                                                        >
                                                                            <Accordion.Header>{siteLang == 'en' ? item?.question : item?.hindiQuestion}</Accordion.Header>
                                                                            <Accordion.Body>{siteLang == 'en' ? item?.answer : item?.hindiAnswer}</Accordion.Body>
                                                                        </Accordion.Item>
                                                                    ))}
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </Col>

                                                {/* Right Column */}
                                                <Col lg={6} md={6} sm={12} className="mb-3">
                                                    <div className="deposit-main-section">
                                                        <div className="tour-faq-bx">
                                                            <Accordion flush>
                                                                {rightColumn?.length > 0 &&
                                                                    rightColumn.map((item, index) => (
                                                                        <Accordion.Item
                                                                            eventKey={index.toString()}
                                                                            className=""
                                                                            key={`right-${index}`}
                                                                        >
                                                                            <Accordion.Header>{siteLang == 'en' ? item?.question : item?.hindiQuestion}</Accordion.Header>
                                                                            <Accordion.Body>{siteLang == 'en' ? item?.answer : item?.hindiAnswer}</Accordion.Body>
                                                                        </Accordion.Item>
                                                                    ))}
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>


        </>
    )
}

export default AffiliateSupport