import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { faArrowDown, faArrowUp, faBookmark } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiData } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTicker } from "../redux/features/walletSlice";
import { useTranslation } from "react-i18next";
import { otcPair } from "../staticData";
import { setCrypto, setFx, setStocks } from "../redux/features/marketSlice";
import Loader from "../components/frontend/Loader";
import { Loader2 } from "lucide-react";
import { c2c, getPairParts } from "../utils/globalFunction";




function SearchTrade({ show, handleClose }) {
  const dispatch = useDispatch()
  const [otcPage, setOtcPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const { userData, userSetting } = useSelector((state) => state.user);
  const [key, setKey] = useState("commodities");
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState({
    stocks: [],
    crypto: [],
    fx: [],
    commodities: []
  });
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const { fx, crypto, stocks } = useSelector((state) => state.market);

  const getPairData = async (type) => {
    try {
      setLoading(true);

      const searchParam = searchText ? `&search=${searchText}` : "";
      const result = await getApiData(`all-pair?market=${type}${searchParam}`);

      if (result.success) {
        setMarketData(prev => ({
          ...prev,
          [type]: result.data
        }));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!show) return;

    // agar data already loaded hai → dubara call mat karo (cache)
    if (marketData[key]?.length === 0) {
      let apiKey = key;


      getPairData(apiKey);
    }

  }, [key, show]);



  const handleClick = (tick) => {
    sessionStorage.setItem('tick', tick)
    dispatch(setActiveTicker(tick))
   handleClose()

  }
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (userSetting && userSetting.language) {
      changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
    }
  }, [userSetting]);
  const handleSearch = () => {
    let apiKey = key;

    if (key === "fx") apiKey = "forex";

    getPairData(apiKey);
  };
  const currentData = marketData[key] || [];
  return (
    <>
      {/* Search Trade Modal */}
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        style={{ display: show ? "block" : "none" }}
      // id="quotesHistoryModalTrade"
      // tabIndex="-1"
      // aria-labelledby="quotesHistoryModalTrade"
      // aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content bx-modal-popup-trade-search-section text-white">
            <div className="modal-header  border-0 pb-0">
              <div>
                <h5 className="modal-title" id="quotesHistoryModalLabel">
                  {userSetting?.language == 'hindi' ? `${t('trade')} ${t('select')}` : 'Select Trade'}
                </h5>

              </div>
              <button
                type="button"
                id="closeSearch"
                onClick={() => handleClose()}
                className="btn-close btn-close-white me-2"
              // data-bs-dismiss="modal"
              // aria-label="Close"
              ></button>
            </div>

            <div className="modal-body  pb-0">
              <div className="">
                <div className="row ">
                  <div className="col-lg-12">
                    <div className=" search-trade">
                      <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 p-2  setting-tab-btn">
                        <Nav.Item>
                          <Nav.Link eventKey="forex" className="rounded-pill setting-tab-link"> {t('currency')}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="crypto" className="rounded-pill ">{t('crypto')}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="commodities" className="rounded-pill ">{t('commodities')}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="stocks" className="rounded-pill ">{t('stock')}</Nav.Link>
                        </Nav.Item>
                      </Nav>


                      <div className=" p-0 setting-tab-details search-trade-section pb-3" style={{ maxHeight: "600px", overflowY: "auto" }}>
                        <Tab.Content>

                          <Tab.Pane eventKey={key} active={key}>
                            <Row>
                              <Col md={12}>
                                <div className="market-container">
                                  <div className="search-bar mb-0">
                                    <div className="custom-frm-bx w-100 mb-3">
                                      <input type="text" className="form-control" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder={t("search")}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleSearch();
                                          }
                                        }} />
                                    </div>
                                    <div className="notification-icon">
                                      {/* <span>2</span> */}
                                      <FontAwesomeIcon icon={faBookmark} />
                                    </div>
                                  </div>

                                  <div className="table-responsive">
                                    <table className="market-table">
                                      <thead>
                                        <tr>
                                          <th>{t('name')}</th>
                                          <th>24h {t('changing')}</th>
                                          <th>{t('profit')}</th>
                                          <th>5+ min</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {loading ? (
                                          <tr>
                                            <td colSpan="5" className="text-center">
                                              <Loader2 className="animate-spin" />
                                            </td>
                                          </tr>
                                        ) : currentData.length === 0 ? (
                                          <tr>
                                            <td colSpan="5" className="text-center">
                                              No Data Found
                                            </td>
                                          </tr>
                                        ) : (
                                          currentData.map((item, index) => (
                                            <tr key={index} onClick={() => handleClick(item.symbol)}>
                                              <td className="pair-name">
                                                {(() => {
                                                  const [base, quote] = getPairParts(item.symbol);

                                                  return (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

                                                      {/* FLAGS / ICON */}
                                                      <div style={{
                                                        position: "relative",
                                                        width: "28px",
                                                        height: "20px",
                                                        flexShrink: 0
                                                      }}>

                                                        {/* CRYPTO */}
                                                        {item.marketType === "crypto" ? (
                                                          <img
                                                            src={`https://cryptoicons.org/api/icon/${base?.toLowerCase()}/32`}
                                                            alt={base}
                                                            onError={(e) => {
                                                              // 🔥 fallback image (default coin icon)
                                                              e.target.src = "https://cdn-icons-png.flaticon.com/512/1490/1490853.png";
                                                            }}
                                                            style={{
                                                              width: "18px",
                                                              height: "18px",
                                                              borderRadius: "50%"
                                                            }}
                                                          />
                                                        ) : (
                                                          <>
                                                            {/* BASE FLAG */}
                                                            <img
                                                              src={`https://flagcdn.com/w20/${c2c[base] || "un"}.png`}
                                                              alt={base}
                                                              onError={(e) => e.target.style.display = "none"}
                                                              style={{
                                                                width: "16px",
                                                                height: "12px",
                                                                borderRadius: "2px",
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                border: "1px solid rgba(255,255,255,0.3)",
                                                                objectFit: "cover"
                                                              }}
                                                            />

                                                            {/* QUOTE FLAG */}
                                                            {quote && (
                                                              <img
                                                                src={`https://flagcdn.com/w20/${c2c[quote] || "un"}.png`}
                                                                alt={quote}
                                                                onError={(e) => e.target.style.display = "none"}
                                                                style={{
                                                                  width: "16px",
                                                                  height: "12px",
                                                                  borderRadius: "2px",
                                                                  position: "absolute",
                                                                  bottom: 0,
                                                                  right: 0,
                                                                  border: "1px solid rgba(255,255,255,0.3)",
                                                                  objectFit: "cover"
                                                                }}
                                                              />
                                                            )}
                                                          </>
                                                        )}
                                                      </div>

                                                      {/* SYMBOL TEXT */}
                                                      <span className="fz-11">
                                                        {base}{quote ? `/${quote}` : ""} {key=="commodities"&&"(OTC)"}
                                                      </span>
                                                    </div>
                                                  );
                                                })()}
                                              </td>

                                              {item.changePercent > 0 ? (
                                                <td className="positive">
                                                  {item.changePercent?.toFixed(2)}% <FontAwesomeIcon icon={faArrowUp} />
                                                </td>
                                              ) : (
                                                <td className="negative">
                                                  {item.changePercent?.toFixed(2)}% <FontAwesomeIcon icon={faArrowDown} />
                                                </td>
                                              )}

                                              <td>{item.profit}</td>
                                              <td>{item.fiveMinute}</td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
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
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default SearchTrade