import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateApiData } from "../services/api";
import { fetchUserData } from "../redux/features/userSlice";
import { setDefaultCurrency, setDefaultLanguage, setHideBalance, setWalletUse } from "../redux/features/walletSlice";
import { useTranslation } from "react-i18next";
import { logout } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AccountModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [siteLang, setSiteLang] = useState("en");
    const userId = JSON.parse(localStorage.getItem("userId"));
    const isLogin = useSelector((state) => state.auth.isLogin);

    const { walletUse, demoWallet, dollerToInr, defaultCurrency, hideBalance } = useSelector((state) => state.wallet);
    const { userData, userSetting } = useSelector((state) => state.user);
    const { t, i18n } = useTranslation();




    useEffect(() => {
        if (userSetting?.language) {
            const lang = userSetting.language === "english" ? "en" : "hi";
            changeLanguage(lang);
            setSiteLang(lang);
        }
    }, [userSetting]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    async function updateSetting() {
        if (!userData) return navigate("/login");

        const currency = userData.currency === "inr" ? "usd" : "inr";
        const exchangeRate = dollerToInr || Number(import.meta.VITE_USD_TO_INR) || 87;

        let liveAmount = currency === "inr" ? userData.liveAmount * exchangeRate : userData.liveAmount / exchangeRate;
        let demoAmount = currency === "inr" ? userData.demoAmount * exchangeRate : userData.demoAmount / exchangeRate;

        const data = { ...userData, userId, currency, liveAmount, demoAmount };

        try {
            const result = await updateApiData("update-user-data", data);
            if (result.success) {
                dispatch(fetchUserData());
                dispatch(setDefaultCurrency(currency));
                toast.success("Currency updated");
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    const getLevelImg = () => {
        const level = userData?.levelId?.name?.toLowerCase() || "";
        if (level.includes("starter")) return "/assets/images/wallet-tp.png";
        if (level.includes("expert")) return "/assets/images/advance.png";
        if (level.includes("advanced")) return "/assets/images/expert.png";
        return "/assets/images/wallet-tp.png"; // default
    };

    async function handleLogout() {
        dispatch(setDefaultLanguage('en'))
        const loginData = JSON.parse(localStorage.getItem('loginData'))
        localStorage.clear()
        sessionStorage.clear()
        if (loginData) {
            localStorage.setItem('loginData', JSON.stringify(loginData))
        }
        dispatch(logout())
        navigate('/login')
    }

    


    return (
        <div className="modal fade"
            id="accountModal"
            tabIndex="-1"
            aria-labelledby="accountModal"
            aria-hidden="true">

            <div className="modal-dialog notification-panel modal-md modal-dialog-end">
                <div className="modal-content">
                    <div className=" leftAccount rounded-0">
                          <div className="row">
                                    <div className="col-lg-6 col-sm-12 pe-lg-0  border-secondary">
                                        {/* <div className="d-flex justify-content-between align-items-center">
                                            <div className=" w-100 border-right d-flex gap-1 align-items-center justify-content-between">
                                                <div className="modalLevel d-flex lvl-img pe-5">
                                                    <img
                                                        src={
                                                            getLevelImg()}
                                                        alt=""
                                                    />
                                                    <div className="d-flex flex-column">
                                                        <strong className="fz-14 mb-0 text-secondary text-uppercase">{userData?.levelId?.name || 'standard'}:</strong>{" "}
                                                        <span className="fz-14">+{userData?.levelId?.rateOfReturn || 0}% {t("profit")}</span>
                                                    </div>
                                                </div>
                                                <Link to='/account-level' className="modalLevel px-3  py-3 text-white">
                                                    <i className="fa-solid fa-eye "></i>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mt-2 accoumt-title-bx">
                                            <h4 className="">{userData?.email ? userData?.email?.length > 20 ?
                                                userData?.email?.slice(0, 20) + '...' :
                                                userData?.email : 'demoAccount@gmail.com'}</h4>
                                            <div className="fz-14 text-gray">{t("id")}: {userData?.nickName || '63507268'}</div>
                                            <div className="">
                                                <span className="text-secondary">{t("currency")}: </span>
                                                <span className=" text-uppercase">{userData?.currency || defaultCurrency}</span>
                                                <button
                                                    className="change-amount-btn"
                                                    onClick={updateSetting}
                                                >
                                                    {t("change")}
                                                </button>
                                            </div>
                                        </div> */}





                                        <div className="mt-2 px-3">
                                            <div className="custom-radio-wrapper">
                                                <input type="radio" name="account"
                                                    onChange={() => {
                                                        if (!userId) {
                                                            navigate('/login')
                                                            toast.error('Please login to use live account')
                                                            return
                                                        }
                                                        sessionStorage.setItem('wallet', 'live')
                                                        dispatch(setWalletUse('live'))
                                                    }}
                                                    checked={walletUse == 'live'}
                                                    id="liveAccount" />
                                                <label htmlFor="liveAccount" className="custom-radio-label">{t("liveAccount")}</label>
                                                <div className="radio-subtext">
                                                    {defaultCurrency} {hideBalance ? '*******' : userData?.liveAmount?.toFixed()}
                                                </div>
                                            </div>

                                            {/* <div className="">
                                                <input type="radio" name="account"
                                                    onChange={() => {
                                                        sessionStorage.setItem('wallet', 'demo')
                                                        dispatch(setWalletUse('demo'))
                                                    }}
                                                    checked={walletUse == 'demo'}
                                                    id="demoAccount" defaultChecked />
                                                <label htmlFor="demoAccount " className="ms-2 mb-0">{t("demoAccount")}</label>
                                                <div className="text-secondary ms-4 text-uppercase">
                                                    {defaultCurrency} {userData?.demoAmount?.toFixed() || demoWallet}
                                                </div>
                                            </div> */}

                                            <div className="custom-radio-wrapper">
                                                <input
                                                    type="radio"
                                                    name="account"
                                                    id="demoAccount"
                                                    checked={walletUse === "demo"}
                                                    onChange={() => {
                                                        sessionStorage.setItem("wallet", "demo");
                                                        dispatch(setWalletUse("demo"));
                                                    }}
                                                />

                                                <label htmlFor="demoAccount" className="custom-radio-label">
                                                    {t("demoAccount")}
                                                </label>

                                                <div className="radio-subtext">
                                                    {defaultCurrency} {hideBalance?'*******':userData?.demoAmount?.toFixed() }
                                                </div>
                                            </div>

                                        </div>
                                        <div className="py-3 border-top">
                                          <div className="px-2">
                                              <button className="hide-btn" onClick={() => dispatch(setHideBalance(!hideBalance))}>
                                                <FontAwesomeIcon icon={hideBalance? faEyeSlash : faEye} />
                                                Hide Balance</button>
                                          </div>
                                        </div>
                                      


                                    </div>

                                      

                                    <div className="col-lg-6 col-sm-12 ps-0">
                                        <div className="rightAccount bg-black">
                                            <div className="ps-3 bg-black d-flex flex-column justify-content-between">
                                                <ul className=" list-unstyled">
                                                    <li className="mt-3">
                                                        <Link to="/deposit" className="text-white text-decoration-none">{t("deposit")}</Link>
                                                    </li>
                                                    <li className="mt-3">
                                                        <Link to="/deposit?type=withdrawal" className="text-white text-decoration-none">{t("withdraw")}</Link>
                                                    </li>
                                                    <li className="mt-3">
                                                        <Link to="/deposit?type=transactions" className="text-white text-decoration-none">{t("transaction")}</Link>
                                                    </li>
                                                    <li className="mt-3">
                                                        <Link to="/deposit?type=trades" className="text-white text-decoration-none">{t("trades")}</Link>
                                                    </li>
                                                    <li className="mt-3">
                                                        <Link to="/deposit?type=account" className="text-white text-decoration-none">{t("account")}</Link>
                                                    </li>
                                                    {isLogin ? <li className="text-danger text-decoration-none cursor-pointer mt-4" > <Link to='/login' className="text-danger" onClick={() => handleLogout()}>
                                                        <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>{t("logout")}
                                                    </Link>
                                                    </li> :
                                                        <div className="d-flex flex-column  text-decoration-none cursor-pointer mt-4">
                                                            <Link to='/login' className="text-success" onClick={() => handleLogout()}>
                                                                <i className="fa-solid fa-user-plus me-2"></i>{t("login")}
                                                            </Link>
                                                            <Link to='/register' className="text-primary" onClick={() => handleLogout()}>
                                                                <i className="fa-solid fa-arrow-right-from-bracket mt-3 me-2"></i>{t("register")}
                                                            </Link>
                                                        </div>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Types */}

                                </div>
                        <div className="p-0">
                            {/* Left Section */}
                          

                            {/* Right Section */}
                            {/* <div className="rightAccount bg-black">
                                <div className="px-4 bg-black d-flex flex-column justify-content-between">
                                    <ul className=" list-unstyled">
                                        <li className="mt-3">
                                            <Link to="/deposit" className="text-white text-decoration-none">{t("deposit")}</Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link to="/deposit?type=withdrawal" className="text-white text-decoration-none">{t("withdraw")}</Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link to="/deposit?type=transactions" className="text-white text-decoration-none">{t("transaction")}</Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link to="/deposit?type=trades" className="text-white text-decoration-none">{t("trades")}</Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link to="/deposit?type=account" className="text-white text-decoration-none">{t("account")}</Link>
                                        </li>
                                            {isLogin ?<li className="text-danger text-decoration-none cursor-pointer mt-4" > <Link to='/login' className="text-danger" onClick={() => handleLogout()}>
                                                <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>{t("logout")}
                                            </Link> 
                                            </li>:
                                            <div className="d-flex flex-column  text-decoration-none cursor-pointer mt-4">
                                            <Link to='/login' className="text-success" onClick={() => handleLogout()}>
                                                <i className="fa-solid fa-user-plus me-2"></i>{t("login")}
                                            </Link>
                                            <Link to='/register' className="text-primary" onClick={() => handleLogout()}>
                                                <i className="fa-solid fa-arrow-right-from-bracket mt-3 me-2"></i>{t("register")}
                                            </Link>
                                            </div>
                                            }
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Close button */}
                    {/* <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Close"
                        onClick={() => {
                            const modalEl = document.getElementById(modalId);
                            if (modalEl) modalEl.classList.remove("show", "d-block");
                        }}
                    ></button> */}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;

