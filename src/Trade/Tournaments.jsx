
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { faAngleLeft, faBell, faCreditCard, faGift, faRotate, faUser, faWallet, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";
import TradeHeader from "./TradeHeader";
import TradeSidebar from "./TradeSidebar";
import { getApiData, postApiData, securePostData, updateApiData } from "../services/api";
import Wallet from "./Wallet";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/features/userSlice";
import TradeReferral from "./TradeReferral";
import NotificationPanel from "./Notification";
import { useTranslation } from "react-i18next";
import { getWebisteSetting } from "../services/globalFunction";
import { setDefaultCurrency } from "../redux/features/walletSlice";
import AccountModal from "./AccountModal";

function Tournaments() {
    const [key, setKey] = useState("active");
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const isLogin = useSelector((state) => state.auth.isLogin);
    const userId = JSON.parse(localStorage.getItem('userId'))
    const { walletUse, defaultLang, defaultCurrency, dollerToInr, demoWallet, hideBalance } = useSelector((state) => state.wallet);
    const { userData, userSetting, loading, error, joinedTournament } = useSelector((state) => state.user);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const dispatch = useDispatch()
    const [tournamentData, setTournamentData] = useState([])
    // useEffect(() => {
    //     dispatch(fetchUserData())
    // }, [dispatch])

    async function getTournament() {
        const data = await getApiData('get-tournament')
        setTournamentData(data?.allTournament)
    }
    async function joinTournament(id) {
        if (!userId) {
            navigate('/login')
        }
        if (walletUse !== 'live') {
            toast.warning('Use live amount for join a tournament')
            return
        }
        const data = { userId, tournamentId: id }
        try {
            const result = await securePostData('join-tournament', data)
            if (result.success) {
                dispatch(fetchUserData())
                getTournament()
                toast.success("Tournament Joined")
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(data.message)
        }
    }
    useEffect(() => {
        getTournament()
    }, [])

    function calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        // Calculate the difference in milliseconds
        const durationMillis = end - start;

        // Convert milliseconds to minutes
        const durationMinutes = durationMillis / (1000 * 60);

        // Convert minutes to hours and minutes
        const hours = Math.floor(durationMinutes / 60);
        const minutes = Math.floor(durationMinutes % 60);

        return { hours, minutes };
    }

    useEffect(() => {
        if (!userId) {
            navigate('/login')
        }
    }, [])

    
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (userSetting && userSetting.language) {

            changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
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
                        <main className="main-content">
                            <div className="deposit-main-section setting-tab-section">
                                <div className="setting-tab-details">
                                    <h6 className="fw-bold mb-3 left-side-boder"> {t('tournament')}</h6>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-lg-12">
                                        <div className="setting-tab-section">
                                            <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3  p-2 rounded-3 setting-tab-btn">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="active" className="rounded-pill px-4 setting-tab-link">{t('active')}</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="completed" className="rounded-pill ">{t('completed')}</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <div className="shadow-sm rounded-3 setting-tab-details">
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="active" active={key === "active"}>
                                                        <Row>
                                                            {tournamentData?.length > 0 &&
                                                                tournamentData.filter(item => new Date(item.endTime) > new Date() && item.status == 'active').map((item, key) => {
                                                                    // Calculate duration for each tournament
                                                                    const { hours, minutes } = calculateDuration(item.startTime, item.endTime);
                                                                    return (
                                                                        <Col lg={4} md={6} sm={12} key={key} className="mb-3">
                                                                            <div className="touranment-main-bx h-100 ">
                                                                                <div className="d-flex align-items justify-content-between">
                                                                                    <div className="tour-bx">
                                                                                        <a href="#" className="tour-btn">{t('activeNow')}</a>
                                                                                    </div>
                                                                                    <div className="tour-contxt-bx">
                                                                                        <h6 className="mb-0">{t('prizePool')}</h6>
                                                                                        <h4 className="mb-0">USD {item?.prizePool}</h4>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="touranment-winning-pic">
                                                                                    <div className="crazy-bx">
                                                                                        <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                                                        <p className="text-capitalize">{defaultLang == 'en' ? item?.name : item?.hindiName}</p>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center justify-content-between tour-entry-bx">
                                                                                        <div>
                                                                                            <h4 className="mb-0 text-uppercase ">USD {item?.entryFee}</h4>
                                                                                            <p className="mb-0">{t('entryFee')}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="mb-0">{item?.participantsCount}</h4>
                                                                                            <p className="mb-0">{t('participants')}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="mb-0">{hours}h {minutes}m</h4>
                                                                                            <p className="mb-0">{t('duration')}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="tour-join-box login-section py-0">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                // Only join if the item._id is not found in joinedTournament
                                                                                                if (!joinedTournament?.some(joinedItem => joinedItem?.tournamentId?._id === item._id)) {
                                                                                                    joinTournament(item._id);
                                                                                                }
                                                                                            }}
                                                                                            className="tour-join-details-btn"
                                                                                        >
                                                                                            {joinedTournament?.some(joinedItem => joinedItem?.tournamentId?._id === item._id) ?
                                                                                                t('joined') :
                                                                                                t('joinNow')}
                                                                                        </button>

                                                                                        <Link to={`/tournament-detail/${item._id}`} className="signIn-btn">{t('details')}</Link>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    );
                                                                })
                                                            }
                                                            {/* <Col lg={4} md={4} sm={12}>
                                                                <div className="touranment-main-bx">
                                                                    <div className="d-flex align-items justify-content-between">
                                                                        <div className="tour-bx">
                                                                            <a href="" className="tour-btn">Until start: 3 days</a>
                                                                        </div>
                                                                        <div className="tour-contxt-bx">
                                                                            <h6 className="mb-0">Prize Pool</h6>
                                                                            <h4 className="mb-0">INR 5000</h4>
                                                                        </div>
                                                                    </div>

                                                                    <div className="touranment-winning-pic">
                                                                        <div className="crazy-bx">
                                                                            <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                                            <p>Weekend Battle</p>
                                                                        </div>

                                                                        <div className="d-flex align-items-center justify-content-between tour-entry-bx">
                                                                            <div>
                                                                                <h4 className="mb-0">INR 100</h4>
                                                                                <p className="mb-0">Entry fee</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="mb-0">351</h4>
                                                                                <p className="mb-0">Participants</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="mb-0">1 Day</h4>
                                                                                <p className="mb-0">Duration</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="tour-join-box login-section  py-0 ">
                                                                            <a href="" className="tour-join-details-btn ">Join Now</a>
                                                                            <a href="" className="signIn-btn  ">Details</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col> */}
                                                        </Row>
                                                    </Tab.Pane>

                                                    {/* Security Tab */}
                                                    <Tab.Pane eventKey="completed" active={key === "completed"}>
                                                        <Row>
                                                            {tournamentData?.length > 0 &&
                                                                tournamentData
                                                                    .filter(item => new Date(item.endTime) < new Date() && item.status == 'completed') // Ensure the tournament has ended
                                                                    .map((item, key) => {
                                                                        // Calculate duration for each tournament
                                                                        const { hours, minutes } = calculateDuration(item.startTime, item.endTime);

                                                                        // Calculate how many days have passed since the endTime
                                                                        const endTime = new Date(item.endTime);
                                                                        const currentDate = new Date();
                                                                        const timeDifference = currentDate - endTime;
                                                                        const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

                                                                        return (
                                                                            <Col lg={4} md={6} sm={12} key={key} className="mb-3">
                                                                                <div className="touranment-main-bx h-100 ">
                                                                                    <div className="d-flex align-items justify-content-between">
                                                                                        <div className="tour-bx">
                                                                                            {/* Display days passed instead of "Active Now" */}
                                                                                            <a href="#" className="tour-btn">
                                                                                                {daysPassed > 0 ? `${daysPassed} ${t('dayAgo')}` : 'Ended Today'}
                                                                                            </a>
                                                                                        </div>
                                                                                        <div className="tour-contxt-bx">
                                                                                            <h6 className="mb-0">{t('prizePool')}</h6>
                                                                                            <h4 className="mb-0">USD {item?.prizePool}</h4>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="touranment-winning-pic">
                                                                                        <div className="crazy-bx">
                                                                                            <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                                                            <p className="text-capitalize">{defaultLang == 'en' ? item?.name : item?.hindiName}</p>
                                                                                        </div>

                                                                                        <div className="d-flex align-items-center justify-content-between tour-entry-bx">
                                                                                            <div>
                                                                                                <h4 className="mb-0 text-uppercase">USD {item?.entryFee}</h4>
                                                                                                <p className="mb-0">{t('entryFee')}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <h4 className="mb-0">{item?.participantsCount}</h4>
                                                                                                <p className="mb-0">{t('participants')}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <h4 className="mb-0">{hours}h {minutes}m</h4>
                                                                                                <p className="mb-0">{t('duration')}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tour-join-box login-section py-0">
                                                                                            <Link to={`/tournament-detail/${item._id}`} className="signIn-btn">{t('details')}</Link>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        );
                                                                    })
                                                            }
                                                            {/* <Col lg={4} md={4} sm={12}>
                                                                <div className="touranment-main-bx">
                                                                    <div className="d-flex align-items justify-content-between">
                                                                        <div className="tour-bx">
                                                                            <a href="" className="tour-btn">Until start: 3 days</a>
                                                                        </div>
                                                                        <div className="tour-contxt-bx">
                                                                            <h6 className="mb-0">Prize Pool</h6>
                                                                            <h4 className="mb-0">INR 5000</h4>
                                                                        </div>
                                                                    </div>

                                                                    <div className="touranment-winning-pic">
                                                                        <div className="crazy-bx">
                                                                            <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                                            <p>Weekend Battle</p>
                                                                        </div>

                                                                        <div className="d-flex align-items-center justify-content-between tour-entry-bx">
                                                                            <div>
                                                                                <h4 className="mb-0">INR 100</h4>
                                                                                <p className="mb-0">Entry fee</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="mb-0">351</h4>
                                                                                <p className="mb-0">Participants</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="mb-0">1 Day</h4>
                                                                                <p className="mb-0">Duration</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="tour-join-box login-section  py-0 ">

                                                                            <a href="" className="signIn-btn  ">Details</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col> */}

                                                        </Row>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </main>
                   
        </>
    )
}

export default Tournaments