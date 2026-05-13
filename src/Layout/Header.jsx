import { faBell, faCreditCard, faInfoCircle, faRotate, faUser, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { t } from 'i18next';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { securePostData, updateApiData } from '../services/api';
import { fetchUserData } from '../redux/features/userSlice';
import { getWebisteSetting } from '../services/globalFunction';
import NotificationPanel from '../Trade/Notification';
import PlatFormStatus from '../Trade/PlatFormStatus';
import { toast } from 'react-toastify';
import { setDefaultCurrency } from '../redux/features/walletSlice';
import AccountModal from '../Trade/AccountModal';

function Header() {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [firstBonus, setFirstBonus] = useState()
    const isLogin = useSelector((state) => state.auth.isLogin);
    const {
        walletUse,
        activeTicker,
        demoWallet,
        watchList,
        defaultCurrency,
        dollerToInr,
        hideBalance,
    } = useSelector((state) => state.wallet);
    const { userData, userTrade, totalUserTrade, totalUserOrder, userOrder } =
        useSelector((state) => state.user);
    async function handleDemoBalance() {
        try {
            const response = await securePostData(`set-demo-balance/${userId}`, {});
            if (response.success) {
                dispatch(fetchUserData());
            }
        } catch (error) { }
    }
    async function updateSetting(currency) {
        let liveAmount = userData.liveAmount;
        let demoAmount = userData.demoAmount;
        const exchangeRate = dollerToInr || 90;
        if (currency == "inr") {
            liveAmount = userData.liveAmount * exchangeRate;
            demoAmount = userData.demoAmount * exchangeRate;
        } else {
            liveAmount = userData.liveAmount / exchangeRate;
            demoAmount = userData.demoAmount / exchangeRate;
        }
        const data = { ...userData, userId, currency, liveAmount, demoAmount };
        try {
            const result = await updateApiData(`update-user-data`, data);
            if (result.success) {
                dispatch(fetchUserData());
                dispatch(setDefaultCurrency(currency));
                toast.success("Currency updated");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    async function getPanelData() {
        try {
            const data = await getWebisteSetting();
            setFirstBonus(data.firstBonus);

        } catch (error) { }
    }
    useEffect(() => {
        if (!firstBonus) {
            getPanelData()
        }
    }, [])
    const handleShow = () => setShow(!show);

    useEffect(() => {
  const modal = document.getElementById("accountModal");

  if (modal) {
    modal.addEventListener("shown.bs.modal", () => {
      setShow(true);
    });

    modal.addEventListener("hidden.bs.modal", () => {
      setShow(false);
    });
  }

  return () => {
    if (modal) {
      modal.removeEventListener("shown.bs.modal", () => {});
      modal.removeEventListener("hidden.bs.modal", () => {});
    }
  };
}, []);

    return (
        <>
            <header className="top-header first-trade">
                <div className="header-data">
                    <div className="d-flex gap-2">
                        {/* <div className="ms-lg-3 ms-sm-0">
                        <a
                          href="javascript:void(0)"
                          className="btn btn-primary tp-header-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#quotesHistoryModalTrade"
                        >
                          +
                        </a>
                      </div> */}
                        <Link
                            to="/account-level"
                            className="d-lg-flex d-md-none align-items-center  justify-content-center tp-head-jpy-bx"
                        >
                            <strong className="fz-14 mb-0 text-secondary text-uppercase pe-1">
                                {userData?.levelId?.name || "standard"}:{" "}
                            </strong>{" "}
                            <span className="fz-14">
                                +{userData?.levelId?.rateOfReturn || 0}% {t("profit")}
                            </span>
                        </Link>
                        {/* <div className="d-flex align-items-center flex-column justify-content-center tp-head-jpy-bx">
                        <div className="tp-head-aud">
                          <img src="/assets/images/first-vector.png" alt="" />
                          <h4>{pair?.startsWith('OTC') ? pair?.slice(3) : pair || "AUD/JPY"}</h4>
                        </div>
                        <span>40%</span>
                      </div> */}
                    </div>
                    <div>
                        <div className="tp-middle-box">
                            <div className="tp-middle-btn">
                                <img src="/assets/images/rocket.png" alt="" />
                                {t("firstBonus").replace("30", firstBonus || '')}{" "}
                            </div>
                        </div>
                    </div>
                    <div className="header-left-data">
                        <Link to={"/"} className="d-lg-none d-sm-block">
                            <img
                                src="/assets/images/chart-nw-logo.png"
                                width={30}
                                height={30}
                            />
                        </Link>
                        <div className="d-flex gap-2 align-items-center">
                            <button
                                className="tp-bell-header mobile-info-circle"
                                data-bs-toggle="modal"
                                data-bs-target="#platFormModal"
                            >
                                <FontAwesomeIcon icon={faInfoCircle} />{" "}
                            </button>
                            <button
                                className="tp-bell-header"
                                data-bs-toggle="modal"
                                data-bs-target="#notificationModal"
                            >
                                <FontAwesomeIcon icon={faBell} />{" "}
                            </button>
                            <button
                                className="tp-bell-header"
                                onClick={() => handleDemoBalance()}
                            >
                                <FontAwesomeIcon icon={faRotate} />{" "}
                            </button>

                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#accountModal"
                                className="real-ammount-btn"
                                onClick={handleShow}
                            >
                                <span className="me-1">
                                    {walletUse == "demo"
                                        ? `${t("demo")} ${t("balance")}`
                                        : `${t("live")}  ${t("balance")}`}
                                </span>
                                {/* {userData ? userData?.currency === "inr" ? " ₹" : " $" : defaultCurrency === "inr" ? " ₹" : " $"} */}
                                {/* {walletUse == `demo`
                            ? hideBalance ? '*******' : userData?.demoAmount?.toFixed() ||
                              demoWallet.toFixed()
                            : hideBalance ? '*******' : userData?.liveAmount?.toFixed()} */}
                                {show ? (
                                    <i className="fa-solid fa-chevron-up"></i>
                                ) : (
                                    <i className="fa-solid fa-chevron-down"></i>
                                )}
                                <p className="mb-0 fz-15 text-start text-white fw-bold">
                                    {userData
                                        ? userData?.currency === "inr"
                                            ? " ₹"
                                            : " $"
                                        : defaultCurrency === "inr"
                                            ? " ₹"
                                            : " $"}

                                    {walletUse == `demo`
                                        ? hideBalance
                                            ? "*******"
                                            : new Intl.NumberFormat("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(userData?.demoAmount || 0) ||
                                            demoWallet.toFixed()
                                        : hideBalance
                                            ? "*******"
                                            : new Intl.NumberFormat("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(userData?.liveAmount || 0)}
                                </p>
                            </button>

                            <Link to={`/deposit?type=deposit`} className="deposit-btn">
                                <FontAwesomeIcon icon={faWallet} />{" "}
                                <span className="deposit-title-btn">Deposit</span>
                            </Link>

                            <Link
                                to={`/deposit?type=withdrawal`}
                                className="withdrawal-btn"
                            >
                                <FontAwesomeIcon icon={faCreditCard} />{" "}
                                <span className="deposit-title-btn">Withdraw</span>
                            </Link>

                            {isLogin && (
                                <select
                                    className="tp-bell-header  pay-select-btn"
                                    value={userData?.currency}
                                    onChange={(e) => updateSetting(e.target.value)}
                                >
                                    <option value="inr">INR</option>
                                    <option value="usd">USD</option>
                                </select>
                            )}

                            <Link
                                to="/deposit?type=account"
                                className="tp-users-header"
                            >
                                <FontAwesomeIcon icon={faUser} />{" "}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <NotificationPanel />
            <AccountModal />
            <PlatFormStatus />
        </>
    )
}

export default Header
