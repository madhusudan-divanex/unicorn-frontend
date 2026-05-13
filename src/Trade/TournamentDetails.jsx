
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { faAngleLeft, faAngleRight, faArrowDown, faArrowUp, faBell, faCopy, faCreditCard, faGift, faRotate, faUser, faWallet, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";
import { Accordion } from "react-bootstrap";
import { getApiData, securePostData, updateApiData } from "../services/api";
import TradeSidebar from "./TradeSidebar";
import TradeHeader from "./TradeHeader";
import { useDispatch, useSelector } from "react-redux";
import { base_url } from "../baseUrl";
import { fetchUserData } from "../redux/features/userSlice";
import Wallet from "./Wallet";
import { toast } from "react-toastify";
import NotificationPanel from "./Notification";
import TradeReferral from "./TradeReferral";
import { useTranslation } from "react-i18next";
import { getWebisteSetting } from "../services/globalFunction";
import { setDefaultCurrency } from "../redux/features/walletSlice";
import AccountModal from "./AccountModal";



function TournamentDetails() {
    const userId = JSON.parse(localStorage.getItem('userId'))
    const params = useParams()
    const [firstBonus, setFirstBonus] = useState()
    const [siteLang, setSiteLang] = useState('en')
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(false);
    // Wallet BTN oFFcanvas
    const { userData, loading, error, joinedTournament, userSetting } = useSelector((state) => state.user);
    const handleShow = () => setShow(!show);
    const navigate = useNavigate()
    const { walletUse, defaultLang, defaultCurrency, dollerToInr, hideBalance } = useSelector((state) => state.wallet);
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [tournamentData, setTournamentData] = useState({})
    const [participants, setParticipants] = useState([])
    const [filterParticipants, setFilterParticipants] = useState([])
    const [currentPartiPage, setCurrentPartiPage] = useState(1);
    const [totalPartiPages, setTotalPartiPages] = useState(1);
    const isLogin = useSelector((state) => state.auth.isLogin);
    const participantsLimit = 10;
    async function getTournamentDetail() {
        const data = await getApiData(`get-tournament-data/${params.id}`)
        setTournamentData(data?.tournament)
        setParticipants(data?.joinUsers)
    }
    useEffect(() => {

        getTournamentDetail()
    }, [])
    // utils.js
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
    const { hours, minutes } = calculateDuration(tournamentData?.startTime, tournamentData?.endTime);

    function formatDateTime(date) {
        if (!date) return '30 Jul 05:30'; // Fallback if no date is provided

        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        const formattedTime = new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${formattedDate} ${formattedTime}`;
    }
    const endTime = new Date(tournamentData?.endTime);
    const currentDate = new Date();
    const timeDifference = currentDate - endTime;
    const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24));

    const [faqData, setFaqData] = useState([]);

    async function getFaqData() {
        try {
            const result = await getApiData(`get-faq`);
            if (result.success) {
                const tournamentFaqs = result.allFaq.filter(item =>
                    item?.type === 'Tournament'
                );
                const allContent = tournamentFaqs.flatMap(faq => faq.content);

                setFaqData(allContent);
            }
        } catch (error) {
            ;
            toast.error(error?.message || 'An error occurred');
        }
    }

    useEffect(() => {
        getFaqData();
    }, []);
    async function joinTournament() {
        if (!userId) {
            navigate('/login')
        }
        if (walletUse !== 'live') {
            toast.warning('Use live amount for join a tournament')
            return
        }
        const data = { userId, tournamentId: params.id }
        try {
            const result = await securePostData('join-tournament', data)
            if (result.success) {
                dispatch(fetchUserData())
                getTournamentDetail()
                toast.success("Tournament Joined")
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {

        }

    }
    useEffect(() => {
        const start = (currentPartiPage - 1) * participantsLimit;
        const end = start + participantsLimit;
        const paginatedData = participants.slice(start, end);
        setTotalPartiPages(Math.ceil(participants?.length / participantsLimit))
        setFilterParticipants(paginatedData);
    }, [participants, currentPartiPage]);

    const handlePartiPrev = () => {
        if (currentPartiPage > 1) {
            setCurrentPartiPage(currentPartiPage - 1);
        }
    };

    const handlePartiNext = () => {
        if (currentPartiPage < totalPartiPages) {
            setCurrentPartiPage(currentPartiPage + 1);
        }
    };
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
        <main className="main-content">

                            <div className="deposit-main-section setting-tab-section">

                                <div className="setting-tab-details">
                                    <h6 className="fw-bold mb-3 left-side-boder"> {t('tournament')}</h6>
                                </div>

                                <Row>
                                    <Col lg={6} md={6} sm={12}>
                                        <div className="touranment-main-bx touranment-main-details-bx">
                                            <div className="d-flex align-items justify-content-between">
                                                <div className="tour-bx">
                                                    {new Date(tournamentData?.endTime) < new Date() ?
                                                        <div href="" className="tour-btn">{daysPassed > 0 ? `${daysPassed} ${t('dayAgo')}` : 'Ended Today'}</div>
                                                        : <a href="" className="tour-btn" style={{ color: "#00D563" }}>{t('active')}</a>}
                                                </div>
                                            </div>
                                            <div className="touranment-winning-pic">
                                                <div className="crazy-bx my-3 border-0">
                                                    <img src="/assets/images/winners.png" alt="" className="crazy-logo" />
                                                    <p className="text-capitalize">{defaultLang == 'en' ? tournamentData?.name : tournamentData?.hindiName}</p>
                                                </div>
                                                <div className="tour-join-box login-section d-flex justify-content-between  py-0 ">
                                                    <div className="tour-contxt-bx">
                                                        <h6 className="mb-0 text-start">{t('prizePool')}</h6>
                                                        <h4 className="mb-0">USD {tournamentData?.prizePool || '0'}</h4>
                                                    </div>
                                                    {new Date(tournamentData?.endTime) > new Date() &&
                                                        (joinedTournament?.some(item => item.tournamentId?._id === tournamentData?._id) ? <button className="tour-join-details-btn"> {t('joined')}</button> :
                                                            <button className="tour-join-details-btn" onClick={() => joinTournament()}>{t('joinNow')} {tournamentData?.entryFee || '0'} USD</button>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tournament-entry-main-bx">
                                            <div className="tournament-entry-list">
                                                <div className="text-center">
                                                    <span>UTC+05:30</span>
                                                    <h5> {formatDateTime(tournamentData?.startTime)} </h5>
                                                    <h6>{t('start')}</h6>
                                                </div>
                                                <div className="text-center">
                                                    <span>UTC+05:30</span>
                                                    <h5> {formatDateTime(tournamentData?.endTime)} </h5>
                                                    <h6>{t("end")}</h6>
                                                </div>
                                                <div>
                                                    <h5>{hours}h {minutes}m</h5>
                                                    <h6>{t('duration')}</h6>
                                                </div>
                                            </div>
                                            <div className="tournament-entry-list ">
                                                <div>
                                                    <h5>USD {tournamentData?.prizePool || '5000'} </h5>
                                                    <h6>{t('prizePool')}</h6>
                                                </div>
                                                <div>

                                                    <h5>USD {tournamentData?.entryFee || '100'} </h5>
                                                    <h6>{t('entryFee')}</h6>
                                                </div>
                                                <div>
                                                    {/* <h5>USD {tournamentData?.rebuyCost || '100'}</h5>
                                                    <h6>{t('rebuyCost')}</h6> */}
                                                </div>
                                            </div>
                                            {/* <div className="tournament-entry-list">
                                                <div>
                                                    <h5 >{tournamentData?.numberOfRebuys || '100'}</h5>
                                                    <h6>{t('numberOfReBuy')}</h6>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="mt-3 tour-desc-bx">
                                            <h4>{t('details')}</h4>
                                            <p>{defaultLang == 'en' ? tournamentData?.description : tournamentData?.hindiDescription}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                        <div className="tour-prize-pool-bx">
                                            <div className="tour-prize-crd">
                                                <img src="/assets/images/win.png" alt="" className="prize-logo" />
                                                <h5>{t('prizeDistribution')}</h5>
                                            </div>
                                            <div className="tour-prize-title d-flex justify-content-between">
                                                <h5>{t('position')}</h5>
                                                <h5>{t('prize')}</h5>
                                            </div>
                                            <div className="tour-prize-brd-bx">
                                                {tournamentData?.prizePosition?.map((item, key) => (
                                                    <div className="tour-prize-list" key={key}>
                                                        <ul>
                                                            <li>
                                                                <p>{item?.rank || '1'}</p>
                                                                USD {item?.prize || '2500'}
                                                            </li>
                                                        </ul>
                                                    </div>))}
                                            </div>
                                        </div>
                                        <div className="participant-bx mt-3">
                                            <div className="text-white ">
                                                {/* Header */}
                                                <div className="d-flex align-items-center mb-3">
                                                    <img
                                                        src="/assets/images/users.png"
                                                        alt="icon"
                                                        width="24"
                                                        className="me-2"
                                                    />
                                                    <h5 className="mb-0">{t('participants')}</h5>
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table custom-table table-borderless align-middle mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>{t('participants')}</th>
                                                                <th>{t('balance')}</th>
                                                                <th>{t('prize')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filterParticipants?.length > 0 ?
                                                                filterParticipants.map((item, key) => (
                                                                    <tr key={key}>
                                                                        <td>{key + 1}</td>
                                                                        <td className="d-flex align-items-center">
                                                                            <img
                                                                                // src="/assets/images/win-logo.png"
                                                                                src={item?.userId?.photo ?
                                                                                    `${base_url}/${item?.userId?.photo}`
                                                                                    :
                                                                                    "/assets/images/win-logo.png"
                                                                                }
                                                                                alt="user"
                                                                                className="me-2"
                                                                            />
                                                                            {item?.userId?.nickName || 'Floyd Miles'}
                                                                        </td>
                                                                        <td>{item?.tournamentWallet?.toFixed(2) || '0'} USD</td>
                                                                        <td className="text-success">{item?.prize || '0'} USD</td>
                                                                    </tr>)) : <div>
                                                                    No participants
                                                                </div>}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Footer */}
                                                <div className="d-flex justify-content-between align-items-center mt-3 small text-muted">
                                                    <span className="text-white">Showing {totalPartiPages == 0 ? 0 : currentPartiPage} of {totalPartiPages}</span>
                                                    <div>
                                                        <a type="button" onClick={handlePartiPrev} disabled={currentPartiPage === 1} className="participant-paging-btn"><FontAwesomeIcon icon={faAngleLeft} /></a>
                                                        <a type="button" onClick={handlePartiNext} disabled={currentPartiPage === totalPartiPages} className="participant-paging-btn"><FontAwesomeIcon icon={faAngleRight} /></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} className="pb-lg-0 pb-5">
                                        <div className="tour-faq-bx mt-4">
                                            <h5>{t('faq')}</h5>
                                            <div>
                                                <Accordion defaultActiveKey="0" flush>
                                                    {faqData?.length > 0 &&
                                                        faqData.map((item, key) => (
                                                            <Accordion.Item eventKey={key.toString()} className="mb-3" key={key}>
                                                                <Accordion.Header>{siteLang == 'en' ? item?.question : item?.hindiQuestion}</Accordion.Header>
                                                                <Accordion.Body>
                                                                    {siteLang == 'en' ? item?.answer : item?.hindiAnswer}
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        ))}
                                                </Accordion>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
        </main>
                        {/* <Wallet show={show} handleClose={handleClose} /> */}

           
        </>
    )
}

export default TournamentDetails