
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";



function TradeSecond() {
   const series = [
    {
      data: [
        {
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33],
        },
        {
          x: new Date(1538780400000),
          y: [6632.01, 6643.59, 6620, 6630.11],
        },
        {
          x: new Date(1538782200000),
          y: [6630.71, 6648.95, 6623.34, 6635.65],
        },
        {
          x: new Date(1538784000000),
          y: [6635.65, 6651, 6629.67, 6638.24],
        },
        {
          x: new Date(1538785800000),
          y: [6638.24, 6640, 6620, 6624.47],
        },
        {
          x: new Date(1538787600000),
          y: [6624.53, 6636.03, 6621.68, 6624.31],
        },
        {
          x: new Date(1538789400000),
          y: [6624.61, 6632.2, 6617, 6626.02],
        },
        {
          x: new Date(1538791200000),
          y: [6627, 6627.62, 6584.22, 6603.02],
        },
        {
          x: new Date(1538793000000),
          y: [6605, 6608.03, 6598.95, 6604.01],
        },
        {
          x: new Date(1538794800000),
          y: [6604.5, 6614.4, 6602.26, 6608.02],
        },
      ],
    },
  ];

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Basic Candlestick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
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

        <section>
             <div className="layout-container">
      {/* 🔹 Left Sidebar */}
      <aside className="left-sidebar">
       <div className="left-navigation">
              <ul className="nav flex-column">
              <h5 className="text-uppercase small mb-2">Binary</h5>
                <li className="nav-item ">
                  <NavLink to="/dashbaord" className="nav-link text-white "><img src="/assets/images/trade.png" alt="" /> {t('trades')}</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/sale" className="nav-link text-white"><img src="/assets/images/market.png" alt="" /> Market </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/project" className="nav-link text-white"><img src="/assets/images/leaderboad.png" alt="" /> Leader board</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/documents" className="nav-link text-white active"><img src="/assets/images/tournament.png" alt="" /> Tournaments</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/documents" className="nav-link text-white active"><img src="/assets/images/trade.png" alt="" /> Support</NavLink>
                </li>

              </ul>


              <ul>
                <li className="nav-item ">
                  <NavLink to="/dashbaord" className="nav-link text-white "><img src="/assets/images/social-media.png" alt="" /> Referral</NavLink>
                </li>
              </ul>


            </div>
      </aside>

      {/* 🔹 Right Section */}
      <div className="right-section">
        {/* Header */}
        <header className="top-header">
         <div className="d-flex justify-content-between align-items-center gap-2">
            <div>
               <div>
                <a href="javascript:void(0)" className="btn btn-primary tp-header-btn">+</a>
               </div>
            </div>
            <div>
<div className="tp-middle-box">
    <a href="" className="tp-middle-btn"><img src="/assets/images/dimond.png" alt="" />Get a 60% Bonus on your  First Order </a>
</div>
            </div>
            <div>
                <div className="d-flex gap-2 align-items-center">
                    <a href="javascript:void(0)" className="tp-bell-header"><FontAwesomeIcon icon={faBell} /> </a>
                    <a href="javascript:void(0)" className="tp-wallet-header">Wallet</a>
                    <Link to="/deposit?type=account" className="tp-users-header"><FontAwesomeIcon icon={faUser} /> </Link>
                </div> 

            </div>
         </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
         <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12">
             <div className="p-4">
   <Chart options={options} series={series} type="candlestick" height={750} />
    </div>
          </div>

        <div className="col-lg-4 col-md-4 col-sm-12">
          
        </div>
         </div>
    
        </main>
      </div>
    </div>
        </section>

        
        </>
    )
}

export default TradeSecond