
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faBell, faClose, faCopy, faGift, faUser, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";
import { Accordion } from "react-bootstrap";



function TournamentActive() {

    const [open, setOpen] = useState(false);

    const [hover, setHover] = useState(false);


    // Wallet BTN oFFcanvas
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
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
                                    <NavLink to="#" className="nav-link text-white "><img src="/assets/images/social-media.png" alt="" /> Trades</NavLink>
                                </li>
                            </ul>

                            {/* Sliding Panel (Trades) */}
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
                        <main className="main-content">

                            <div className="deposit-main-section setting-tab-section">

                                <div className="setting-tab-details">
                                    <h6 className="fw-bold mb-3 left-side-boder"> Tournaments</h6>
                                </div>

                                <Row>
                                    <Col lg={6} md={6} sm={12}>
                                        <div className="touranment-main-bx touranment-main-details-bx">
                                            <div className="d-flex align-items justify-content-between">
                                                <div className="tour-bx">
                                                    <a href="" className="tour-btn" style={{ color: "#00D563" }}>Active</a>
                                                </div>

                                            </div>

                                            <div className="touranment-winning-pic">
                                                <div className="crazy-bx my-3 border-0">
                                                    <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                    <p>Crazy! Wednesday</p>
                                                </div>


                                                <div className="tour-join-box login-section d-flex justify-content-between  py-0 ">
                                                    <div className="tour-contxt-bx">
                                                        <h6 className="mb-0 text-start">Prize Pool</h6>
                                                        <h4 className="mb-0">INR 5000</h4>
                                                    </div>

                                                    <a href="" className="tour-join-details-btn">Join Now -100 INR</a>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="tournament-entry-main-bx">
                                            <div className="tournament-entry-list">
                                                <div className="text-center">
                                                    <span>UTC+05:30</span>
                                                    <h5>30 Jul 05:30 </h5>
                                                    <h6>Start</h6>
                                                </div>
                                                <div className="text-center">
                                                    <span>UTC+05:30</span>
                                                    <h5>31 Jul 05:30 </h5>
                                                    <h6>End</h6>
                                                </div>
                                                <div>

                                                    <h5>1 Day</h5>
                                                    <h6>Duration</h6>
                                                </div>

                                            </div>
                                            <div className="tournament-entry-list">
                                                <div>

                                                    <h5>INR 5000 </h5>
                                                    <h6>Prize pool</h6>
                                                </div>
                                                <div>

                                                    <h5>INR 100 </h5>
                                                    <h6>Entry fee</h6>
                                                </div>
                                                <div>

                                                    <h5>INR 100</h5>
                                                    <h6>Rebuy cost</h6>
                                                </div>

                                            </div>
                                            <div className="tournament-entry-list">
                                                <div>

                                                    <h5 >100</h5>
                                                    <h6>Number of rebuys</h6>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="mt-3 tour-desc-bx">
                                            <h4>Description</h4>
                                            <p>Total prize pool is $5000. To participate you need to register and pay the entrance fee, after that $100 will be deposited to a special tournament account. Initial conditions in the tournament are the same for all participants. During one day, participants need to make trades on the tournament account. And 5 traders with the biggest tournament balance will become winners.
                                            </p>
                                        </div>


                                        <div className="tour-faq-bx mt-4">
                                            <h5>FAQs</h5>
                                            <div>
                                                <Accordion defaultActiveKey="0" flush>
                                                    {/* Item 1 */}
                                                    <Accordion.Item eventKey="0" className="mb-3">
                                                        <Accordion.Header>What are digital options?</Accordion.Header>
                                                        <Accordion.Body>
                                                            Account banane ke liye top-right corner par "Sign Up" button pe click karein.
                                                            Form bharein (name, email, password) aur "Create Account" submit karein.
                                                            Email verification link par click karna mat bhoolna.
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    {/* Item 2 */}
                                                    <Accordion.Item eventKey="1" className="mb-3">
                                                        <Accordion.Header>What are digital options?</Accordion.Header>
                                                        <Accordion.Body>
                                                            Login page par "Forgot password?" link par click karein.
                                                            Apna registered email daalein, fir aapko reset link milega.
                                                            Link par jaake naya password set kar lo.
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    {/* Item 3 */}
                                                    <Accordion.Item eventKey="2" className="mb-3">
                                                        <Accordion.Header>What are digital options?</Accordion.Header>
                                                        <Accordion.Body>
                                                            Transaction fees depend karti hai payment method aur currency par.
                                                            Standard fee 1.5% se start hoti hai; exact fee transaction summary me dikhegi
                                                            jab aap checkout karoge.
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    {/* Item 4 */}
                                                    <Accordion.Item eventKey="3" className="mb-3">
                                                        <Accordion.Header>What are digital options?</Accordion.Header>
                                                        <Accordion.Body>
                                                            Haan — referral program available hai. Aap apna referral link share karo;
                                                            jab koi us link se signup kar ke eligible action karega to aap dono ko reward milega.
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    {/* Item 5 */}
                                                    <Accordion.Item eventKey="4" className="mb-3">
                                                        <Accordion.Header>What are digital options?</Accordion.Header>
                                                        <Accordion.Body>
                                                            Support ke liye footer me "Contact Us" link pe jao ya help@yourdomain.com par email karo.
                                                            Urgent issues ke liye live chat available hai (business hours ke dauran).
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </div>
                                        </div>




                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                        <div className="tour-prize-pool-bx">
                                            <div className="tour-prize-crd">
                                                <img src="/assets/images/win.png" alt="" className="prize-logo" />
                                                <h5>Prize pool distribution</h5>
                                            </div>

                                            <div className="tour-prize-title d-flex justify-content-between">
                                                <h5>Position</h5>
                                                <h5>Prize</h5>
                                            </div>

                                            <div className="tour-prize-brd-bx">
                                                <div className="tour-prize-list">
                                                    <ul>
                                                        <li>
                                                            <p>1</p>
                                                            INR 2500
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="tour-prize-list">
                                                    <ul>
                                                        <li>
                                                            <p>2</p>
                                                            INR 1500
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="tour-prize-list">
                                                    <ul>
                                                        <li>
                                                            <p>3</p>
                                                            INR 1000
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="participant-bx">
                                                <div className="  text-white ">
                                                    {/* Header */}
                                                    <div className="d-flex align-items-center mb-3">
                                                        <img
                                                            src="/assets/images/users.png"
                                                            alt="icon"
                                                            width="24"
                                                            className="me-2"
                                                        />
                                                        <h5 className="mb-0">Participant</h5>
                                                    </div>

                                                    <div className="table-responsive">
                                                        <table className="table custom-table table-borderless align-middle mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Participant</th>
                                                                    <th>Balance</th>
                                                                    <th>Prize</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Floyd Miles
                                                                    </td>
                                                                    <td>4500 INR</td>
                                                                    <td className="text-success">2500 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>2</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Kathryn Murphy
                                                                    </td>
                                                                    <td>5500 INR</td>
                                                                    <td className="text-success">1500 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>3</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Guy Hawkins
                                                                    </td>
                                                                    <td>6700 INR</td>
                                                                    <td className="text-success">1000 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>4</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Kristin Watson
                                                                    </td>
                                                                    <td>3578 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>5</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Leslie Alexander
                                                                    </td>
                                                                    <td>3578 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>6</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Annette Black
                                                                    </td>
                                                                    <td>6789 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>7</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Courtney Henry
                                                                    </td>
                                                                    <td>785 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>8</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Darlene Robertson
                                                                    </td>
                                                                    <td>468 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>9</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Ronald Richards
                                                                    </td>
                                                                    <td>789 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>10</td>
                                                                    <td className="d-flex align-items-center">
                                                                        <img
                                                                            src="/assets/images/win-logo.png"
                                                                            alt="user"
                                                                            className="me-2"
                                                                        />
                                                                        Jerome Bell
                                                                    </td>
                                                                    <td>6799 INR</td>
                                                                    <td className="text-muted">0 INR</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="d-flex justify-content-between align-items-center mt-3 small text-muted">
                                                        <span className="text-white">Showing 1-09 of 78</span>
                                                        <div>
                                                            <a href="" className="participant-paging-btn"><FontAwesomeIcon icon={faAngleLeft} /></a>
                                                            <a href="" className="participant-paging-btn"><FontAwesomeIcon icon={faAngleRight} /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>




                                        </div>




                                    </Col>


                                </Row>


                            </div>
                        </main>
                    </div>

                    {/* Modal */}
                    <div
                        className="modal fade "
                        id="quotesHistoryModal"
                        tabIndex="-1"
                        aria-labelledby="quotesHistoryModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content bx-modal-popup-section text-white">
                                <div className="modal-header  border-0">
                                    <div>
                                        <h5 className="modal-title" id="quotesHistoryModalLabel">
                                            Quotes History
                                        </h5>
                                        <small className="text-warning">American Express (OTC)</small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white me-2"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>

                                <div className="modal-body login-section pb-0">

                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="custom-frm-bx"><input placeholder=" " className="form-control" required="" max="2025-08-25" type="date" name="dob" /><label>Date </label></div>

                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom-frm-bx"><input placeholder=" " className="form-control" required="" max="2025-08-25" type="date" name="dob" /><label>Time</label></div>

                                        </div>
                                    </div>


                                    <div className="d-flex justify-content-between border-bottom  pb-2 mb-2">
                                        <strong className="text-white">Time</strong>
                                        <strong className="text-white">Quote</strong>
                                    </div>

                                    <div className="time-modal">
                                        <ul>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                            <li>11:39:00.560
                                                <span>5,847.29</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                <FontAwesomeIcon icon={faClose}/>
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
                        <div className="container">
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
                                                className="ms-auto text-white"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <FontAwesomeIcon icon={faClose}/>
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



                    </div>



                </div>


            </section>


        </>
    )
}

export default TournamentActive