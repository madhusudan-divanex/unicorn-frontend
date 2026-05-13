import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { faAngleLeft, faArrowDown, faArrowUp, faBell, faCopy, faCreditCard, faGift, faRotate, faUser, faWallet, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";
import { getApiData, updateApiData } from "../services/api";
import TradeHeader from "./TradeHeader";
import { toast } from "react-toastify";
import TradeSidebar from "./TradeSidebar";
import Wallet from "./Wallet";
import { useDispatch, useSelector } from "react-redux";
import NotificationPanel from "./Notification";
import TradeReferral from "./TradeReferral";
import { useTranslation } from "react-i18next";
import { getWebisteSetting } from "../services/globalFunction";
import { fetchUserData } from "../redux/features/userSlice";
import { setDefaultCurrency } from "../redux/features/walletSlice";
import AccountModal from "./AccountModal";



function AccountLevels() {
    const { walletUse, activeTicker, demoWallet, defaultCurrency, dollerToInr, hideBalance } = useSelector((state) => state.wallet);
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const [siteLang, setSiteLang] = useState('en')
    const [firstBonus, setFirstBonus] = useState(0)
    const userId = JSON.parse(localStorage.getItem("userId"));
    const isLogin = useSelector((state) => state.auth.isLogin);
    const dispatch = useDispatch()
    const { userData, loading, error, joinedTournament, userSetting } = useSelector((state) => state.user);
    // Wallet BTN oFFcanvas
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const [levelData, setLevelData] = useState([])
    async function getLevelData() {
        try {
            const result = await getApiData(`get-level`)
            if (result.success) {
                setLevelData(result.allLevel)
            }
        } catch (error) {

            toast.error(error?.message || 'An error occured')
        }
    }
    useEffect(() => {
        getLevelData()
    }, []);
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
            {/* Main Content */}
            <main className="main-content deposit-main-section ">
                <div className="setting-tab-section account-level-section">
                    <Row className="setting-tab-details account-level-main">
                        <h6 className="left-side-boder">{t('statuses')}</h6>
                        <p>{t('levelDesc')}</p>
                        {levelData?.length > 0 &&
                            levelData?.map((item, key) =>
                                <Col lg={4} md={4} sm={12} key={key}>
                                    <div className="account-level-card">
                                        <div className="account-level-bx">
                                            <div className="account-level-logo">
                                                <img src={key == 0 ? "assets/images/wallet-tp.png" : key == 1 ? "assets/images/expert.png" :
                                                    key == 2 ? "assets/images/advance.png" : "assets/images/wallet-tp.png"} alt="" />
                                                <h5 className="mb-0 text-white">{siteLang == 'en' ? item?.name : item?.hindiName || 'starter'}</h5>
                                            </div>
                                            <div className="account-level-content">
                                                <p>{siteLang == 'en' ? item?.description : item?.hindiDescription || 'Default status with a basic set of accessible features'}</p>
                                            </div>
                                        </div>
                                        {userData?.levelId?._id === item?._id ? (
                                            <div className="align-self-center account-level-status">
                                                <button className="account-level-con">{t('yourStatus')}</button>
                                            </div>
                                        ) : (
                                            <div className="account-level-status">
                                                <button
                                                    className={`account-level-advnce-tbn ${item?.name === 'EXPERT' ? 'expert-btn' : ''}`}
                                                >
                                                    {t('minDepositAmount')} {userData?.currency == "inr" ? "₹" : "$"} {userData?.currency == "inr" ? item?.deposit * dollerToInr
                                                        : item?.deposit}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Col>)}
                        {/* <Col lg={4} md={4} sm={12}>
                                        <div className="account-level-card">
                                            <div className="account-level-bx">
                                                <div className="account-level-logo">
                                                    <img src="assets/images/expert.png" alt="" />
                                                    <h5 className="mb-0 text-white">advanced</h5>
                                                </div>
                                                <div className="account-level-content">
                                                    <p>Access to exclusive platform features for traders who want to apply more diverse strategies</p>
                                                </div>
                                            </div>

                                            <div className="account-level-status">
                                                <a href="#" className="account-level-advnce-tbn">Deposit $500</a>
                                            </div>

                                        </div>
                                    </Col>

                                    <Col lg={4} md={4} sm={12}>
                                        <div className="account-level-card">
                                            <div className="account-level-bx">
                                                <div className="account-level-logo">
                                                    <img src="assets/images/advance.png" alt="" />
                                                    <h5 className="mb-0 text-white">expert</h5>
                                                </div>
                                                <div className="account-level-content">
                                                    <p>The widest range of tools and features available, perfect for all kinds of complex and personalized trading styles</p>
                                                </div>
                                            </div>
                                            <div className=" account-level-status">
                                                <a href="#" className="account-level-advnce-tbn expert-btn">Deposit $1000</a>
                                            </div>
                                        </div>
                                    </Col> */}
                    </Row>
                    <Row className="mt-4">
                        <Col lg={3} md={3} sm={12} className="mt-5 pt-4">
                            <div className="account-start-left-section">
                                <div className="account-start-left-content">
                                    <p>{t('rateOfReturn')}</p>
                                </div>
                            </div>
                            <div className="account-start-left-section">
                                <div className="account-start-left-content">
                                    <p>{t("commissionDiscount")}</p>
                                </div>
                            </div>
                            <div className="account-start-left-section">
                                <div className="account-start-left-content">
                                    <p>{t('fundsWithdraw')}</p>
                                </div>
                            </div>
                            <div className="account-start-left-section">
                                <div className="account-start-left-content">
                                    <p>{t('maxTradeAmount')}</p>
                                </div>
                            </div>
                            <div className="account-start-left-section">
                                <div className="account-start-left-content">
                                    <p>{t('maxOpenPosition')}</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={9} md={9} sm={12}>
                            <div className="account-start-right-section">
                                <div className="d-flex align-items-center justify-content-around">

                                    {levelData?.length > 0 && levelData?.map((item, key) => (
                                        <div className="account-advance-tp" key={key}>
                                            <img src={key == 0 ? "assets/images/wallet-tp.png" : key == 1 ? "assets/images/expert.png" :
                                                key == 2 ? "assets/images/advance.png" : "assets/images/wallet-tp.png"} alt="" />
                                            <h5>{siteLang == 'en' ? item?.name : item?.hindiName}</h5>
                                        </div>))}
                                </div>
                                <div className="account-advance-tp-bar"></div>
                            </div>
                            <div className="d-flex">
                                <div className="account-advance-tp-bar-starter"></div>
                                <div className="account-advance-tp-bar-starter-second"></div>
                                <div className="account-advance-tp-bar-starter-third"></div>
                            </div>
                            <div className="account-expert-dta-bx">
                                {levelData?.length > 0 && levelData?.map((item, key) => (
                                    <div className="account-expert-dta-content" key={key}>
                                        {siteLang == 'en' ? <h5>{t('upTo')} {item?.rateOfReturn || '85'}%</h5> :
                                            <h5>{item?.rateOfReturn || '85'}% {t("upTo")}</h5>}

                                        <span><a href="#" className="account-ft-btn">FT</a></span>
                                    </div>
                                ))}
                            </div>
                            <div className="account-expert-dta-bx">
                                {levelData?.length > 0 && levelData?.map((item, key) => (
                                    <div className="account-expert-dta-content" key={key}>
                                        {siteLang == 'en' ? <h5>{t('upTo')} {item?.commissionDiscount}%</h5> :
                                            <h5>{item?.commissionDiscount || '85'}% {t("upTo")}</h5>}
                                        <span><a href="#" className="account-ft-btn  account-fx-btn">FX</a></span>
                                    </div>
                                ))}
                            </div>
                            <div className="account-expert-dta-bx">
                                {levelData?.length > 0 && levelData?.map((item, key) => (
                                    <div className="account-expert-dta-content flex-column gap-0">
                                        <div className="d-flex gap-2 align-items-center ">
                                            <h5 className="text-capitalize">{item?.fundsWithdraw || 'Normal Priority'}</h5>
                                            {/* <span><a href="#" className="account-ft-btn">FT</a></span>  */}
                                            {/* <span><a href="#" className="account-ft-btn  account-fx-btn">FX</a></span> */}
                                        </div>
                                        {/* <p className="text-start">Receive within 24 hours</p> */}
                                    </div>
                                ))}
                            </div>
                            <div className="account-expert-dta-bx">
                                {levelData?.length > 0 && levelData?.map((item, key) => (
                                    <div className="account-expert-dta-content" key={key}>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex gap-2">
                                                <h5>${item?.maxTradeAmount?.ft}</h5>
                                                <span><a href="#" className="account-ft-btn">FT</a></span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <h5>${item?.maxTradeAmount?.fx}</h5>
                                                <span><a href="#" className="account-ft-btn account-fx-btn">FX</a></span>
                                            </div>
                                        </div>
                                    </div>))}
                                {/* <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="#" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="#" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>
                                            </div> */}
                            </div>
                            <div className="account-expert-dta-bx">
                                {levelData?.length > 0 && levelData?.map((item, key) => (
                                    <div className="account-expert-dta-content">
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex gap-2">
                                                <h5>${item?.maxOpenPosition?.ft}</h5>
                                                <span><a href="#" className="account-ft-btn">FT</a></span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <h5>${item?.maxOpenPosition?.fx}</h5>
                                                <span><a href="#" className="account-ft-btn account-fx-btn">FX</a></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="#" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="#" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div> */}

                            </div>
                            {/* <div className="text-center">
                                            <a href="#">View More</a>
                                        </div> */}
                        </Col>
                    </Row>
                </div>
            </main>

        </>
    )
}

export default AccountLevels