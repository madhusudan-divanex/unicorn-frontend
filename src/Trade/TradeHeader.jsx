import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchUserData } from "../redux/features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAreaChart, faArrowDown, faArrowUp, faClose, faCopy, faDatabase } from "@fortawesome/free-solid-svg-icons";
import Wallet from "./Wallet";
import LeaderBoard from "./LeaderBoard";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";
import { MdLeaderboard } from "react-icons/md";
import SearchTrade from "./SearchTrade";

function TradeHeader({ bidData }) {
  // console.log("biddat",bidData)
  const location=useLocation()
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [hoverData, setHoverData] = useState({})
  const [searchShow,setSearchShow]=useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { userData, loading, error, userTrade, totalUserTrade } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUserData({ navigate }));
  }, [dispatch]);
  const [key, setKey] = useState("profile");

  const [open, setOpen] = useState(false);

  const [hover, setHover] = useState(null);


  // Wallet BTN oFFcanvas
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleLeaderClose = () => setLeaderboardOpen(false);
  const handleShow = () => setShow(!show);


  const [btcOpen, setBtcOpen] = useState(false);

  const [showDeposit, setShowDeposit] = useState(false);

  const requests = [
    { id: 895485, date: "26/07/2025, 11:23:48", status: "Field", type: "UPI", amount: "200 INR", success: false },
    { id: 895485, date: "26/07/2025, 11:23:48", status: "Successfully", type: "UPI", amount: "-150 INR", success: true },
    { id: 895485, date: "26/07/2025, 11:23:48", status: "Successfully", type: "Net banking", amount: "+150 INR", success: true },
    { id: 895485, date: "26/07/2025, 11:23:48", status: "Successfully", type: "UPI", amount: "-150 INR", success: true },
    { id: 895485, date: "26/07/2025, 11:23:48", status: "Successfully", type: "Net banking", amount: "+150 INR", success: true },
  ];

  // Nested Tabs
  const [outerKey, setOuterKey] = useState("trades");
  const [innerKey, setInnerKey] = useState("trade-history");

  const [enterPlatform, setEnterPlatform] = useState(true);
  const [withdrawFunds, setWithdrawFunds] = useState(true);


  const [showTab, setShowTab] = useState(false);
  const formatSecondsToHHMMSS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  const formatTradeDate = (dateStr) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    }); // → "Jul 30"

    const timePart = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }); // → "17:33:53"

    const milliseconds = '.' + String(date.getMilliseconds()).padStart(3, '0'); // → ".234"
    return `${datePart}, ${timePart}${milliseconds}`;
  };

  const { t, i18n } = useTranslation();
  const { userSetting, } = useSelector((state) => state.user);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (userSetting && userSetting.language) {

      changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
    }
  }, [userSetting]);

  return (
    <>
      <ul className="nav align-content-between justify-content-between justify-content-around align-items-center sidebar">
        <div className="trade-tp-header-bx">
          <div className="text-center" style={{cursor:"pointer"}} onClick={()=>{
            navigate('/')
          }}>
            <img src="/assets/images/chart-nw-logo.png" className="chart-logo" />
          </div>
          <div className="trde-mnu-list">

            {location.pathname=="/trade" ?
            <li className="nav-item lt-nav-item">
              <div className="">
                <a
                  href="javascript:void(0)"
                  className="tp-header-btn plus-unicorn-btn"
                  data-bs-toggle="modal"
                  onClick={()=>setSearchShow(true)}
                  data-bs-target="#quotesHistoryModalTrade"
                >
                  +
                </a>
              </div>
            </li>
            :
            <li className="nav-item lt-nav-item">
              <div className="">
                <a
                  href="javascript:void(0)"
                  className=""
                >
                  {/* + */}
                </a>
              </div>
            </li>
            }

            <li className="nav-item lt-nav-item">
              <NavLink
                to="/trade"
                className="nav-link text-white"
              // onClick={() => setOpen(prev => !prev)}
              >

                <FontAwesomeIcon icon={faAreaChart} className="trade-icon" />
                {t('trades')}
              </NavLink>
            </li>
            <li className="nav-item lt-nav-item">
              <NavLink to="/deposit" className="nav-link text-white">
                <FontAwesomeIcon icon={faDatabase} className="trade-icon" />

                {t('market')}
              </NavLink>
            </li>
            <li className="nav-item lt-nav-item">
              <NavLink to="" className="nav-link text-white" onClick={() => setLeaderboardOpen(prev => !prev)}>

                <MdLeaderboard className="trade-icon" />
                <Trans i18nKey="leaderboardMenu" />
                {/* {t('leaderboard')} */}
              </NavLink>
            </li>
            <li className="nav-item lt-nav-item">
              <NavLink to="/tournaments" className="nav-link text-white active">
                <i className="fa-solid fa-trophy trade-icon"></i>
                {/* {t('tournament')} */}
                <Trans i18nKey="tournamentMenu" />
              </NavLink>
            </li>
            <li className="nav-item lt-nav-item">
              <NavLink to="/support" className="nav-link text-white  active">
                <i className="fas fa-question-circle trade-icon"></i>  {t('support')}
              </NavLink>
            </li>
          </div>

        </div>

        {/* {Object.keys(bidData).length > 0 && (bidData?.upPercentage !== 0 && bidData?.downPercentage !== 0) &&
          <div className="ratio-wrapper">
            <div className="ratio-bar">
              <div className="ratio-fill" style={{ width: `${bidData?.downPercentage}%` }}></div>
            </div>
            <div className="ratio-labels">
              <span className="right" >{bidData?.downPercentage || 100}%</span>
              <span className="left" >{bidData?.upPercentage || 100}%</span>
            </div>
          </div>} */}



        {bidData && Object?.keys(bidData)?.length > 0 && (bidData?.upPercentage !== 0 && bidData?.downPercentage !== 0) &&
          <div className="ratio-wrapper-nw vertical-nw">
            <div className="ratio-labels-nw">
              <span className="top-nw">{bidData?.upPercentage || 100}%</span>
            </div>
            <div className="ratio-bar-nw">
              <div
                className="ratio-fill-nw green"
                style={{ height: `${bidData?.upPercentage || 100}%` }}
              ></div>

              <div
                className="ratio-fill-nw red"
                style={{ height: `${bidData?.downPercentage || 100}%` }}
              ></div>
            </div>

            <div className="ratio-labels-nw">
              <span className="bottom-nw">{bidData?.downPercentage || 100}%</span>
            </div>
          </div>}
        <li className="nav-item nav-item-btm-trade">
          <NavLink to="#" className="nav-link nav-trde-btm-link text-white" data-bs-toggle="modal"
            data-bs-target="#addSalesModals"><img src="/assets/images/social-media.png" alt="" /> {t('referral')}</NavLink>
        </li>
      </ul>
      <div className="mobile-bottom-nav">
        <NavLink
          to="/trade"
          className="nav-link"
        // onClick={() => setOpen(prev => !prev)}
        >
          <FontAwesomeIcon icon={faAreaChart} className="trade-icon" />
          <span>{t('trades')}</span>
        </NavLink>
        <NavLink to="/deposit" className="nav-link">
          <FontAwesomeIcon icon={faDatabase} className="trade-icon" />
          <span>{t('market')}</span>
        </NavLink>
        <NavLink
          to=""
          className="nav-link"
          onClick={() => setLeaderboardOpen(prev => !prev)}
        >
          <MdLeaderboard className="trade-icon" />
          <span>{t('leaderboard')}</span>
        </NavLink>
        <NavLink to="/tournaments" className="nav-link">
          <i className="fa-solid fa-trophy trade-icon"></i>
          <span>{t('tournament')}</span>
        </NavLink>
        <NavLink to="/support" className="nav-link">
          <i className="fas fa-question-circle trade-icon"></i>
          <span>{t('support')}</span>
        </NavLink>
      </div>
      <div className={`custom-panel ${open ? "show" : ""}`}>
        <div className="panel-header d-flex justify-content-between align-items-center p-2">
          <h4 className="m-0"><a href="javascript:void(0)" className="custm-toggle-heading"><FontAwesomeIcon icon={faAngleLeft} />Trade</a></h4>
          <button className=" text-white " onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faClose} />
          </button>
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
                Trades ({totalUserTrade})
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
              {userTrade?.length > 0 &&
                userTrade?.slice(0, 9).map((item, key) => (
                  <div className="trade-tab-box position-relative"
                    onMouseEnter={() => {
                      setHoverData(item)
                      setHover(item._id)
                    }}
                    onMouseLeave={() => setHover(null)}>
                    <div className="d-flex align-items-center justify-content-between" key={key}>
                      <div className="trde-tab-image-bx">
                        <img src="/assets/images/trade-tab.png" alt="" />
                        <h6 className="mb-0">{item?.tradePair}</h6>
                      </div>
                      <div className="trade-contant">
                        <p className="mb-0">{formatSecondsToHHMMSS(item?.time || 50)}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between trade-inr">
                      <div>
                        <a href="" className="trade-inr-btn"><FontAwesomeIcon icon={item?.status == 'win' ? faArrowUp : faArrowDown} className="fa-arrow-up" />{item?.profit} INR</a>
                      </div>
                      <div>
                        <a href="" className="trade-inr-btn">{item?.amount} INR</a>
                      </div>
                    </div>
                    {hover == item._id && (
                      <div className="trade-detail-box position-absolute">
                        <div className="trade-tab-box">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="trde-tab-image-bx">
                              <img src="/assets/images/trade-tab.png" alt="" />
                              <h6 className="mb-0">{item?.tradePair}</h6>
                            </div>
                            <div className="trade-contant">
                              <p className="mb-0">{formatSecondsToHHMMSS(item?.time || 50)}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between trade-inr">
                            <div>
                              <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={item?.status === 'win' ? faArrowUp : faArrowDown} className="fa-arrow-up" />
                                <span className={item?.status === 'win' ? 'trade-inr-btn' : 'text-danger'}>{item?.amount} INR </span></a>
                            </div>
                            <div>
                              <a href="" className="trade-inr-btn">{item?.profit} INR</a>
                            </div>
                          </div>
                        </div>
                        <div className="trade-info mt-2">
                          <ul className="trade-info-list">
                            <li>Income: <span>{item?.profit} INR</span></li>
                            <li>Closed: <span>{item?.status == 'win' ? 'with a profit' : item?.status == 'loss' ? 'with a loss' : 'pending'}</span></li>
                            <li>Duration: <span>{formatSecondsToHHMMSS(item?.time || 50)}</span></li>
                            <li>Amount : <span>{item?.amount} INR</span></li>
                            <li>Trade ID: <span>10965467991 <FontAwesomeIcon icon={faCopy} className="trade-cpy-id" onClick={() => {
                              navigator.clipboard.writeText(item?._id);
                              toast.success('Trade ID copied to clipboard!');
                            }} /> </span></li>
                            <li>Trade opened: <span>{formatTradeDate(item?.createdAt)}</span></li>
                            <li>Trade closed: <span>Jul 30, 17:33:53.234</span></li>
                            <li>Opening quote: <span>{item?.openPrice || '5,852.15'}</span></li>
                            <li>Closing quote: <span>{item?.closingData?.close}</span></li>
                          </ul>
                          <p>You can see the tick-by-tick quotes for this trade in the <a href="javascript:void(0)" data-bs-toggle="modal"
                            data-bs-target="#quotesHistoryModal">Quotes History</a></p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}


              <div className="trade-view-bx"><Link to="/deposit?type=trades" className="trade-view-all-btn">View All History</Link></div>
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
      <SearchTrade show={searchShow} handleClose={()=>setSearchShow(false)}/>
      <Wallet show={show} handleClose={handleClose} />
      <LeaderBoard leaderboardOpen={leaderboardOpen} handleClose={handleLeaderClose} />


    </>

  )
}

export default TradeHeader