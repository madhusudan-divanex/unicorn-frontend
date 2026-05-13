
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faArrowDown, faArrowUp, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
// import { useState } from "react";
// import ReactApexChart from "react-apexcharts";




function TradeSidebar() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const { userData, userSetting, loading, error, userDeposit, userWithdraw,  userTrade } = useSelector((state) => state.user);
  return (
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
            {userTrade?.length > 0 &&
              userTrade?.map((item, key) => (
                <div className="trade-tab-box">
                  <div className="d-flex align-items-center justify-content-between" key={key}>
                    <div className="trde-tab-image-bx">
                      <img src="/assets/images/trade-tab.png" alt="" />
                      <h6 className="mb-0">{item?.tradePair}</h6>
                    </div>
                    <div className="trade-contant">
                      <p className="mb-0">00:00:50</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between trade-inr">
                    <div>
                      <a href="" className="trade-inr-btn"><FontAwesomeIcon icon={item?.status=='win'?faArrowUp:faArrowDown} className="fa-arrow-up" />1.00 INR</a>
                    </div>
                    <div>
                      <a href="" className="trade-inr-btn">{item?.profit} INR</a>
                    </div>
                  </div>
                </div>))}
           
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
  )
}

export default TradeSidebar