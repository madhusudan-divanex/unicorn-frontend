
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faAngleLeft, faBell, faClose, faGift, faInfoCircle, faUser, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { getApiData } from "../services/api";
import Wallet from "./Wallet";
import AccountLevels from "./AccountLevels";
import { base_url } from "../baseUrl";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Loader from "../components/frontend/Loader";

function LeaderBoard({ leaderboardOpen, handleClose }) {
    // const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const userId = JSON.parse(localStorage.getItem('userId'))
    const [hover, setHover] = useState(null);
    const { userSetting } = useSelector((state) => state.user);
    const [leaderBoardData, setLeaderBoardData] = useState([])
    const [leaderBoardUser, setLeaderBoardUser] = useState()
    const { userData, } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false)

    const {
        dollerToInr,
    } = useSelector((state) => state.wallet);
    const [currentUser, setCurrentUser] = useState()
    const [userLead, setUserLead] = useState()
    // Wallet BTN oFFcanvas
    const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
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
    async function getLeaderBoard() {
        setLoading(true);
        try {
            const result = await getApiData(`get-leaderboard?userId=${userId}`)
            if (result.success) {
                setLeaderBoardData(result.leaderboard)
                setCurrentUser(result.currentUser)
            } else {
                localStorage.clear()
                sessionStorage.clear()

            }
        } catch (error) {
            localStorage.clear()
            sessionStorage.clear()
            toast.error(error?.message || 'An error occured')
        } finally {
            setLoading(false);
        }
    }
    const getLeaderBoardUser = async (id) => {
        try {
            const result = await getApiData(`leaderboard-user-data/${id}`)
            if (result.success) {
                setLeaderBoardUser(result.data)
            }
        } catch (error) {
            toast.error(error?.message || 'An error occured')
        }
    }
    useEffect(() => {
        if (leaderboardOpen && leaderBoardData?.length === 0) {

            getLeaderBoard()
        }
    }, [leaderboardOpen]);
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (userSetting && userSetting.language) {

            changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
        }
    }, [userSetting]);
    const convertAmount = (amount = 0, from, to) => {
        if (from === to) return amount;
        // INR → USD
        if (from === "inr" && to === "usd") {
            return amount / dollerToInr;
        }

        // USD → INR
        if (from === "usd" && to === "inr") {
            return amount * dollerToInr;
        }
        return amount;
    };
    return (
        <>
            {loading ? <Loader />
                : <div className={`custom-panel   leader-board-panel ${leaderboardOpen ? "show" : ""}`} >
                    <div className="panel-header d-flex justify-content-between align-items-center p-2" onClick={() => handleClose()}>
                        <h4 className="m-0">
                            <a href="javascript:void(0)" className="custm-toggle-heading">
                                <FontAwesomeIcon icon={faAngleLeft} /> {t('leaderboard')}
                            </a>
                        </h4>
                        <button className="btn-close" onClick={() => handleClose()}>
                            <FontAwesomeIcon icon={faClose} className="text-white" />
                        </button>
                    </div>

                    <div className="panel-body">
                        {/* Leaderboard List */}

                        <div className="leader-board-crd">
                            <div className="leader-board-tp-box">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="leader-tp-logo">
                                        <img src="/assets/images/flag-india.png" alt="" />
                                        <h4 className="mb-0">#{userData?.nickName}</h4>

                                    </div>

                                    <div>
                                        <h6>{currentUser?.totalProfit?.toFixed(2) || 0} {userData?.currency == "usd" ? "$" : "₹"}</h6>
                                    </div>
                                </div>

                                {/* <div className="leader-btm-bx">
                                <p><span>{t('yourPosition')} :</span> {currentUser?.position || 0}</p>
                            </div> */}
                            </div>

                            <div className="leader-board-wrk">
                                <div className="leader-info-bx">
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#howItWorks" >
                                        <FontAwesomeIcon icon={faInfoCircle} />{t('howDoesWork')}</button>

                                </div>
                            </div>

                            <div className="leader-btm-bx d-flex align-items justify-content-between px-2 mb-2">
                                <p className="mb-0">Raking</p>
                                <p className="mb-0">Profit</p>
                            </div>
                            {leaderBoardData?.length > 0 &&
                                leaderBoardData?.sort((a, b) => a?.position - b?.position).map((item, key) =>
                                    <div className="leader-board-list-bx" key={key}
                                        onMouseEnter={() => {
                                            setHover(item?.userId)
                                            setTimeout(() => {                                            
                                            getLeaderBoardUser(item?.userId)
                                            }, 500);
                                        }}
                                        onMouseLeave={() => {
                                            setLeaderBoardUser()
                                            setHover(null)
                                        }}>
                                        <div className="leader-board-list-crd">
                                            <div className={key == 0 ? "rank-badge" : key == 1 ? 'rank-badge-second' : key == 2 ? 'rank-badge-three' : ''}>
                                                {key + 1}
                                            </div>
                                            <div className="leader-board-list-logo">

                                                <div className="leader-board-list-double position-relative">
                                                    <img src={item?.country == 'ind' ? "/assets/images/flag-india.png" :
                                                        "/assets/images/flag-usa.png"} alt="" className="" />
                                                    <img src={item?.photo ? `${base_url}/${item?.photo}` : "/assets/images/leader-img.png"} alt=""
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/images/wallet-user.png";
                                                        }}
                                                        className="leader-board-img-double" />
                                                </div>

                                                <h4>{item?.name}</h4>
                                                <div className="leader-board-cash">
                                                    <h6>{convertAmount(item?.totalProfit?.toFixed(), "usd", userData?.currency)} {userData?.currency == "usd" ? "$" : "₹"}</h6>
                                                </div>
                                            </div>
                                        </div>

                                        {hover === item?.userId && (
                                            <div className="leader-board-hover-card">
                                                <div className="hover-header">
                                                    <img src={leaderBoardUser?.user?.photo ? 
                                                        `${base_url}/${leaderBoardUser?.user?.photo}` : 
                                                        "/assets/images/wallet-user.png"} alt="" className="hover-img"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/images/wallet-user.png";
                                                        }} />
                                                    <div className="hover-dimond-bx">
                                                        <img src="/assets/images/star.png" alt="" className="hover-dimond" />
                                                    </div>
                                                    <div className="hover-header-content">
                                                        <p className="text-uppercase">{leaderBoardUser?.user?.country || 'India'}</p>
                                                        <h3>{leaderBoardUser?.user?.nickName || 'Arlene McCoy'}</h3>
                                                    </div>
                                                </div>
                                                <div className="hover-stats">
                                                    <div>
                                                        <h6>{leaderBoardUser?.usersTrade || '54'}</h6>
                                                        <p>{t('tradesCount')}</p>
                                                    </div>
                                                    <div>
                                                        <h6>{leaderBoardUser?.profitableTrade}</h6>
                                                        <p>{t('tradesProfitCount')}</p>
                                                    </div>
                                                    <div>
                                                        <h6>USD {item?.totalProfit?.toFixed(2)}</h6>
                                                        <p>{t('tradeProfit')}</p>
                                                    </div>
                                                    <div>
                                                        <h6>USD {leaderBoardUser?.stats?.averageProfit?.toFixed(2)}</h6>
                                                        <p>{t('averageProfit')}</p>
                                                    </div>
                                                    <div>
                                                        <h6>USD {leaderBoardUser?.stats?.minAmount?.toFixed(2)}</h6>
                                                        <p>{t('minTradeAmount')}</p>
                                                    </div>
                                                    <div>
                                                        <h6>USD {leaderBoardUser?.stats?.maxAmount?.toFixed(2)}</h6>
                                                        <p>{t('maxTradeAmount')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>)}


                        </div>

                    </div>
                </div>}
            <div
                className="modal fade"
                id="howItWorks"
                tabIndex="-1"
                aria-labelledby="addSalesModalLabels"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content modal-coupan-content p-3">
                        <div className="modal-header modal-coupan-header justify-content-between">
                            <div>
                                <h3 className="text-white" id="addSalesModalLabels">
                                    {t('howDoesWork')}
                                </h3>
                            </div>
                            <button
                                type="button"
                                className=" me-3 text-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="fas fa-close text-white text-end fs-5 ms-auto"></i>
                                {/* <FontAwesomeIcon icon={faClose} className="text-white"/> */}
                            </button>
                        </div>
                        <div className="modal-body login-section py-0">
                            <div className="modal-coupan-bx">
                                <div className="">
                                    <p className="mb-0 text-start">{t('leaderDesc')}
                                    </p>
                                    <ul className="mt-2">
                                        <p className="mb-0 text-start"><span><i className="fa-regular fa-star me-2 mt-2"></i></span>
                                            {t('leaderPoint1')}</p>
                                        <p className="mb-0 text-start"><span><i className="fa-regular fa-star me-2 mt-2"></i></span>
                                            {t('leaderPoint2')}</p>
                                        <p className="mb-0 text-start"><span><i className="fa-regular fa-star me-2 mt-2"></i></span>
                                            {t('leaderPoint3')}</p>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* <section>
                <div className="layout-container">
                    <aside className="left-sidebar">
                        <div className="left-navigation">
                            <TradeHeader />
                            <TradeSidebar />
                        </div>
                    </aside>

                    <div className="right-section">
                        <header className="top-header">
                            <div className="d-flex justify-content-between align-items-center gap-2">
                                <div>
                                    <div className="tp-middle-box">
                                        <a href="" className="tp-middle-btn"><img src="/assets/images/dimond.png" alt="" />Get a 30% Bonus on your  First Order </a>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex gap-2 align-items-center">
                                        <a href="javascript:void(0)" className="tp-bell-header"><FontAwesomeIcon icon={faBell} /> </a>
                                        <a href="javascript:void(0)" className="tp-wallet-header" onClick={handleShow}>Wallet</a>
                                        <a href="javascript:void(0)" className="tp-users-header"><FontAwesomeIcon icon={faUser} /> </a>
                                    </div>

                                </div>
                            </div>
                        </header>
                       <AccountLevels/>
                    </div>                 
                </div>
                <TradeReferral />
                <SearchTrade />
            </section>

 <Wallet show={show} handleClose={handleClose} /> */}
        </>
    )
}

export default LeaderBoard