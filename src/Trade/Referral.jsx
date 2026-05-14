import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faAngleLeft, faArrowDown, faArrowUp, faBell, faClose, faCopy, faGift, faUser, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";



function Referral() {
    const userId = JSON.parse(localStorage.getItem('userId'))

    const [open, setOpen] = useState(false);

    const [hover, setHover] = useState(false);


    // Wallet BTN oFFcanvas
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const inviteLink = `https://www.unicornoptions.com/register?invite=${userId}`;




    return (
        <>

            <section>
                <div className="layout-container">
                    <aside className="left-sidebar">
                        <div className="left-navigation">
                            <ul className="nav flex-column justify-content-between align-items-center sidebar bg-dark p-2">
                                <div>
                                    <h5 className="text-uppercase small mb-2 text-white">Binary</h5>
                                    <li className="nav-item">
                                        <NavLink
                                            to="#"
                                            className="nav-link text-white"
                                            onClick={() => setOpen(prev => !prev)}
                                        >
                                            <img src="/assets/images/trade.png" alt="" />  Trades
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="#" className="nav-link text-white">
                                            <img src="/assets/images/market.png" alt="" /> Market
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="#" className="nav-link text-white">
                                            <img src="/assets/images/leaderboad.png" alt="" /> Leader board
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="#" className="nav-link text-white active">
                                            <img src="/assets/images/tournament.png" alt="" /> Tournaments
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="#" className="nav-link text-white active">
                                            <img src="/assets/images/trade.png" alt="" /> Support
                                        </NavLink>
                                    </li>
                                </div>

                                <li className="nav-item nav-item-btm-trade">
                                    <NavLink to="#" className="nav-link text-white " data-bs-toggle="modal"
                                        data-bs-target="#addSalesModals"><img src="/assets/images/social-media.png" alt="" /> Trades</NavLink>
                                </li>
                            </ul>
                            <div className={`custom-panel ${open ? "show" : ""}`}>
                                <div className="panel-header d-flex justify-content-between align-items-center p-2">
                                    <h4 className="m-0"><a href="javascript:void(0)" className="custm-toggle-heading"><FontAwesomeIcon icon={faAngleLeft} />Trade</a></h4>
                                    <button className="btn-close" onClick={() => setOpen(false)}></button>
                                </div>

                                <div className="panel-body">
                                    {/* Tabs */}
                                    <ul className="nav-tabs nav-fill d-flex" role="tablist">
                                        <li className="nav-item" >
                                            <a href=""
                                                className="nav-link active"
                                                id="trade-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#trades"
                                            >
                                                Trades (2)
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href=""
                                                className="nav-link"
                                                id="orders-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#orders"
                                            >
                                                Orders (1)
                                            </a>
                                        </li>
                                    </ul>
                                    {/* Tab Content */}
                                    <div className="tab-content mt-2">
                                        <div className="tab-pane fade show active" id="trades">
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn"><FontAwesomeIcon icon={faArrowUp} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="trade-tab-box position-relative"
                                                onMouseEnter={() => setHover(true)}
                                                onMouseLeave={() => setHover(false)}
                                            >
                                                {/* Main card */}
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="#" className="trade-inr-btn trade-inr-btn-dwn">
                                                            <FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />
                                                            1.00 INR
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <a href="#" className="trade-inr-btn">+3.00 INR</a>
                                                    </div>
                                                </div>

                                                {/* Hover Detail Box */}
                                                {hover && (
                                                    <div className="trade-detail-box position-absolute">
                                                        <div className="trade-tab-box">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="trde-tab-image-bx">
                                                                    <img src="/assets/images/trade-tab.png" alt="" />
                                                                    <h6 className="mb-0">America...</h6>
                                                                </div>
                                                                <div className="trade-contant">
                                                                    <p className="mb-0">00:00:50</p>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-between trade-inr">
                                                                <div>
                                                                    <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                                </div>
                                                                <div>
                                                                    <a href="" className="trade-inr-btn">1.00 INR</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="trade-info mt-2">
                                                            <ul className="trade-info-list">
                                                                <li>Income: <span>+300.00 INR</span></li>
                                                                <li>Closed: <span>with a profit</span></li>
                                                                <li>Duration: <span>00:00:50</span></li>
                                                                <li>Amount : <span>+1.00 INR</span></li>
                                                                <li>Trade ID: <span>10965467991 <FontAwesomeIcon icon={faCopy} className="trade-cpy-id" /> </span></li>
                                                                <li>Trade opened: <span>Jul 30, 17:32:53.234</span></li>
                                                                <li>Trade closed: <span>Jul 30, 17:33:53.234</span></li>
                                                                <li>Opening quote: <span>5,852.15</span></li>
                                                                <li>Closing quote: <span>5,851.74</span></li>
                                                            </ul>

                                                            <p>You can see the tick-by-tick quotes for this trade in the <a href="javascript:void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#quotesHistoryModal">Quotes History</a></p>
                                                        </div>

                                                    </div>
                                                )}




                                            </div>

                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-tab-box">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <p className="mb-0">00:00:50</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between trade-inr">
                                                    <div>
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                                                    </div>
                                                    <div>
                                                        <a href="" className="trade-inr-btn">1.00 INR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="trade-view-bx">
                                                <a href="" className="trade-view-all-btn">View All History</a>
                                            </div>



















                                        </div>




                                        <div className="tab-pane fade" id="orders">
                                            <div className="trade-ordr-tab">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowUp} className="fa-arrow-up" /></a>
                                                    </div>
                                                </div>
                                                <div className=" trade-inr trade-ordr-bx">
                                                    <ul>
                                                        <li>Amount:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Period:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Price:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Current price:
                                                            <span>120 INR</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="trade-view-bx"><a href="" className="trade-view-all-btn">View All History</a></div>


                                            </div>
                                            <div className="trade-ordr-tab">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowUp} className="fa-arrow-up" /></a>
                                                    </div>
                                                </div>
                                                <div className=" trade-inr trade-ordr-bx">
                                                    <ul>
                                                        <li>Amount:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Period:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Price:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Current price:
                                                            <span>120 INR</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="trade-view-bx"><a href="" className="trade-view-all-btn">View All History</a></div>


                                            </div>
                                            <div className="trade-ordr-tab">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowUp} className="fa-arrow-up" /></a>
                                                    </div>
                                                </div>
                                                <div className=" trade-inr trade-ordr-bx">
                                                    <ul>
                                                        <li>Amount:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Period:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Price:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Current price:
                                                            <span>120 INR</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="trade-view-bx"><a href="" className="trade-view-all-btn">View All History</a></div>


                                            </div>
                                            <div className="trade-ordr-tab">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="trde-tab-image-bx">
                                                        <img src="/assets/images/trade-tab.png" alt="" />
                                                        <h6 className="mb-0">America...</h6>
                                                    </div>
                                                    <div className="trade-contant">
                                                        <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={faArrowUp} className="fa-arrow-up" /></a>
                                                    </div>
                                                </div>
                                                <div className=" trade-inr trade-ordr-bx">
                                                    <ul>
                                                        <li>Amount:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Period:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Price:
                                                            <span>120 INR</span>
                                                        </li>
                                                        <li>Current price:
                                                            <span>120 INR</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="trade-view-bx"><a href="" className="trade-view-all-btn">View All History</a></div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


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

                        {/* Main Content */}
                        <main className="main-content deposit-main-section ">
                            <div className="setting-tab-section">
                                <Row className="setting-tab-details account-level-main">
                                    <h6 className="left-side-boder">Statuses</h6>
                                    <p>Each status has its own path along the Trader’s Way, each with their own set of unique rewards. Get higher statuses by making deposits or working your way up the Trader’s Way.</p>

                                    <Col lg={4} md={4} sm={12}>
                                        <div className="account-level-card">
                                            <div className="account-level-bx">
                                                <div className="account-level-logo">
                                                    <img src="assets/images/wallet-tp.png" alt="" />
                                                    <h5 className="mb-0 text-white">starter</h5>
                                                </div>
                                                <div className="account-level-content">
                                                    <p>Default status with a basic set of accessible features</p>
                                                </div>
                                            </div>

                                            <div className="align-self-center account-level-status">
                                                <a href="" className="account-level-con">Your status</a>
                                            </div>

                                        </div>
                                    </Col>

                                    <Col lg={4} md={4} sm={12}>
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
                                                <a href="" className="account-level-advnce-tbn">Deposit $500</a>
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
                                                <a href="" className="account-level-advnce-tbn expert-btn">Deposit $1000</a>
                                            </div>

                                        </div>
                                    </Col>

                                </Row>

                                <Row className="mt-4">

                                    <Col lg={3} md={3} sm={12}>
                                        <div className="account-start-left-section">
                                            <div className="account-start-left-content">
                                                <p>Rate of return</p>
                                            </div>
                                        </div>
                                        <div className="account-start-left-section">
                                            <div className="account-start-left-content">
                                                <p>Commission discount</p>
                                            </div>
                                        </div>
                                        <div className="account-start-left-section">
                                            <div className="account-start-left-content">
                                                <p>Funds Withdrawal</p>
                                            </div>
                                        </div>
                                        <div className="account-start-left-section">
                                            <div className="account-start-left-content">
                                                <p>Maximum trade amount</p>
                                            </div>
                                        </div>
                                        <div className="account-start-left-section">
                                            <div className="account-start-left-content">
                                                <p>Maximum number of open positions</p>
                                            </div>
                                        </div>

                                    </Col>


                                    <Col lg={9} md={9} sm={12}>
                                        <div className="account-start-right-section">
                                            <div className="d-flex align-items-center justify-content-around">

                                                <div className="account-advance-tp">
                                                    <img src="assets/images/wallet-tp.png" alt="" />
                                                    <h5>starter</h5>
                                                </div>

                                                <div className="account-advance-tp">
                                                    <img src="assets/images/wallet-tp.png" alt="" />
                                                    <h5>starter</h5>
                                                </div>
                                                <div className="account-advance-tp">
                                                    <img src="assets/images/wallet-tp.png" alt="" />
                                                    <h5>starter</h5>
                                                </div>
                                            </div>

                                            <div className="account-advance-tp-bar"></div>


                                        </div>
                                        <div className="d-flex">
                                            <div className="account-advance-tp-bar-starter"></div>
                                            <div className="account-advance-tp-bar-starter-second"></div>
                                            <div className="account-advance-tp-bar-starter-third"></div>
                                        </div>

                                        <div className="account-expert-dta-bx">
                                            <div className="account-expert-dta-content">
                                                <h5>Up to 85%</h5>
                                                <span><a href="" className="account-ft-btn">FT</a></span>
                                            </div>
                                            <div className="account-expert-dta-content flex-column gap-0">
                                                <div className="d-flex gap-2 align-items-center">
                                                    <h5>Up to 85%</h5>
                                                    <span><a href="" className="account-ft-btn">FT</a></span>
                                                </div>
                                                <p className="mb-0">2 assets with increased rate of return</p>
                                            </div>
                                            <div className="account-expert-dta-content">
                                                <h5>Up to 85%</h5>
                                                <span><a href="" className="account-ft-btn">FT</a></span>
                                            </div>
                                        </div>
                                        <div className="account-expert-dta-bx">
                                            <div className="account-expert-dta-content">
                                                <h5>No</h5>

                                            </div>
                                            <div className="account-expert-dta-content flex-column gap-0">
                                                <div className="d-flex gap-2 align-items-center">
                                                    <h5>Up to 10%</h5>
                                                    <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                </div>

                                            </div>
                                            <div className="account-expert-dta-content">
                                                <h5>Up to 20%</h5>
                                                <span><a href="" className="account-ft-btn  account-fx-btn">FX</a></span>
                                            </div>
                                        </div>
                                        <div className="account-expert-dta-bx">
                                            <div className="account-expert-dta-content flex-column gap-0">
                                                <div className="d-flex gap-2 align-items-center ">
                                                    <h5>Normal Priority</h5>
                                                    <span><a href="" className="account-ft-btn">FT</a></span>
                                                    <span><a href="" className="account-ft-btn  account-fx-btn">FX</a></span>
                                                </div>
                                                <p className="text-start">Receive within 24 hours</p>

                                            </div>

                                            <div className="account-expert-dta-content flex-column gap-0">
                                                <div className="d-flex gap-2 align-items-center ">
                                                    <h5>High Priority</h5>
                                                    <span><a href="" className="account-ft-btn">FT</a></span>
                                                    <span><a href="" className="account-ft-btn  account-fx-btn">FX</a></span>
                                                </div>
                                                <p className="text-start">Receive your money faster</p>

                                            </div>

                                            <div className="account-expert-dta-content flex-column gap-0">
                                                <div className="d-flex gap-2 align-items-center ">
                                                    <h5>Top Priority</h5>
                                                    <span><a href="" className="account-ft-btn">FT</a></span>
                                                    <span><a href="" className="account-ft-btn  account-fx-btn">FX</a></span>
                                                </div>
                                                <p className="text-start">Receive your money in a few hours</p>

                                            </div>



                                        </div>

                                        <div className="account-expert-dta-bx">
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                        <div className="account-expert-dta-bx">
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="account-expert-dta-content">
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn">FT</a></span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <h5>$3,000</h5>
                                                        <span><a href="" className="account-ft-btn account-fx-btn">FX</a></span>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                        <div className="text-center">
                                            <a href="">View More</a>
                                        </div>




                                    </Col>


                                </Row>











                            </div>

                        </main>
                    </div>



                    <div className="wallet-offcanvas-section">
                        {/* Trigger Button */}
                        {/* Offcanvas (Right side) */}
                        <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white wallet-main-bx">
                            <Offcanvas.Header closeButton className="me-3">
                                <Offcanvas.Title><FontAwesomeIcon icon={faAngleLeft} />Wallet</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="d-grid align-content-between">
                                <div >
                                    <div className="d-flex gap-3 align-items-center wallet-tp-header mb-3">
                                        <div className="wallet-logo">
                                            <img src="/assets/images/wallet-user.png" className="wallet-main-logo" alt="" />
                                        </div>
                                        <div className="wallet-admin-details">
                                            <p className="mb-0">sunildivanextechnologies...</p>
                                            <small><span>ID : </span>63507268</small>
                                        </div>
                                    </div>

                                    {/* Accounts */}
                                    <div className="mb-3 wallet-tp-header wallet-tp-amount">
                                        {/* Live Account */}
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="account"
                                                id="liveAccount"
                                                defaultChecked
                                            />
                                            <label className="form-check-label d-flex flex-column" htmlFor="liveAccount">
                                                Live Account
                                                <strong>INR 0.00</strong>
                                            </label>
                                        </div>

                                        {/* Demo Account */}
                                        <div className="form-check mt-2">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="account"
                                                id="demoAccount"
                                            />
                                            <label className="form-check-label d-flex flex-column" htmlFor="demoAccount">
                                                Demo Account
                                                <strong>INR 89049.00</strong>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Currency */}
                                    <div className="d-flex justify-content-between align-items-center mb-3 wallet-current-status wallet-tp-header">
                                        <h6><span>Currency :</span> INR</h6>
                                        <a href="" variant="success" size="sm" className="wallet-change">
                                            Change
                                        </a>
                                    </div>

                                    {/* Buttons */}
                                    <div className="d-grid gap-2 wallet-deposit-btx">
                                        <a href="javascript:void(0)" className="wallet-deposit-btn" variant="primary">Deposit</a>
                                        <a href="javascript:void(0)" className="wallet-deposit-btn" variant="primary">Withdrawal</a>
                                        <a href="javascript:void(0)" className="wallet-deposit-btn" variant="primary">Transactions</a>
                                    </div>

                                </div>

                                {/* Bottom Card */}
                                <div className=" rounded  wallet-btm-card">
                                    <div className="wallet-btm-logo">
                                        <img src="/assets/images/wallet-tp.png" alt="" />
                                        <div className="wallet-btm-content">
                                            <p className="mb-0">STANDARD:</p>
                                            <h6 className="mb-0">+0% Profit</h6>
                                        </div>
                                    </div>

                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>


                        {/* Modal */}
                        <div className="container">
                            <div
                                className="modal fade"
                                id="addSalesModal"
                                tabIndex="-1"
                                aria-labelledby="addSalesModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content modal-coupan-content">
                                        <div className="modal-header modal-coupan-header">
                                            <div>
                                                <h5 className="modal-title title-heading" id="addSalesModalLabel">
                                                    Choose your bonus
                                                </h5>

                                            </div>
                                            <button
                                                type="button"
                                                className=" ms-auto text-white"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <FontAwesomeIcon icon={faClose} />
                                            </button>
                                        </div>
                                        <div className="modal-body login-section py-0">
                                            <div className="modal-coupan-bx">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h5 className="mb-0"><FontAwesomeIcon icon={faGift} />20% bonus</h5>
                                                        <h6 className="mb-0">INR 20.00</h6>
                                                        <p className="mb-0">If you deposit more than INR 100</p>

                                                    </div>
                                                    <div>
                                                        <a href="" className="signIn-btn">Apply</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-coupan-bx">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h5 className="mb-0"><FontAwesomeIcon icon={faGift} />20% bonus</h5>
                                                        <h6 className="mb-0">INR 20.00</h6>
                                                        <p className="mb-0">If you deposit more than INR 100</p>

                                                    </div>
                                                    <div>
                                                        <a href="" className="signIn-btn">Apply</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-coupan-bx">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h5 className="mb-0"><FontAwesomeIcon icon={faGift} />20% bonus</h5>
                                                        <h6 className="mb-0">INR 20.00</h6>
                                                        <p className="mb-0">If you deposit more than INR 100</p>

                                                    </div>
                                                    <div>
                                                        <a href="" className="signIn-btn">Apply</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer modal-coupan-footer">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Bouns Modal */}
                        <div className="container ">
                            <div
                                className="modal fade"
                                id="firstModal"
                                tabIndex="-1"
                                aria-labelledby="addSalesModalLabels"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content modal-coupan-content">
                                        <div className="modal-header modal-coupan-header">
                                            <div>
                                                <h5 className="modal-title title-heading" id="addSalesModalLabels">
                                                    <FontAwesomeIcon icon={faGift} style={{ color: "#FF7A00" }} /> Cashback
                                                </h5>

                                            </div>
                                            <button
                                                type="button"
                                                className=" ms-auto text-white"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <FontAwesomeIcon icon={faClose} />
                                            </button>
                                        </div>
                                        <div className="modal-body login-section py-0">
                                            <div className="modal-coupan-bx">
                                                <div className="">
                                                    <p className="mb-0 text-center">Enter your promo code now and activate it. You can use it at any time.</p>


                                                </div>
                                            </div>

                                            <div>
                                                <Form.Group className="mt-3">

                                                    <div className="custom-frm-bx">
                                                        <input type="text" className="form-control" id="cpass" placeholder=" " required />
                                                        <label for="cpass">Promo code</label>
                                                    </div>
                                                </Form.Group>
                                            </div>

                                            <div className="d-flex gap-4">
                                                <a href="" className="modal-active-btn">Yes, activate</a>
                                                <a href="" className="modal-active-btn modal-cancel-btn">Cancel</a>
                                            </div>


                                        </div>

                                        <div className="modal-footer modal-coupan-footer">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Refferal Modal */}
                        <div className="container">
                            <div
                                className="modal fade"
                                id="addSalesModals"
                                tabIndex="-1"
                                aria-labelledby="addSalesModalLabels"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-dialog-centered  refferal-main-crd">
                                    <div className="modal-content modal-coupan-content refferal-main-popup-bx">
                                        <div className="modal-header modal-coupan-header ">
                                            <div>
                                                <h5 className="modal-title title-heading" id="addSalesModalLabels">
                                                    Connect with Us Across Social Networks!
                                                </h5>
                                            </div>
                                            <button
                                                type="button"
                                                className=" ms-auto text-white"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <FontAwesomeIcon icon={faClose} />
                                            </button>
                                        </div>
                                        <div className="modal-body  ">
                                            <div className="referral-banner-pic">
                                                <img src="/assets/images/contact-frm.png" alt="" className="referral-bnner-logo" />
                                            </div>

                                            <div className="contct-frm-sec d-flex flex-column align-items-center justify-content-center">
                                                <a target='_blank' href="" className="social-btn social-facebook">
                                                    Facebook <i className="fab fa-facebook-f" />
                                                </a>
                                                <a target='_blank' href="" className="social-btn social-instagram">
                                                    Instagram <i className="fab fa-instagram" />
                                                </a>
                                                <a target='_blank' href="" className="social-btn social-twitter">
                                                    Twitter <i className="fab fa-twitter" />
                                                </a>
                                            </div>

                                        </div>

                                        <div className="modal-footer modal-coupan-footer">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Referral