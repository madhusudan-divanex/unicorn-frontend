import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { faAngleLeft, faArrowDown, faArrowUp, faBell, faCopy, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";

import { Offcanvas, Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, userSlice } from '../redux/features/userSlice';
import { base_url } from '../baseUrl';
import { setDefaultCurrency, setWalletUse } from '../redux/features/walletSlice';
import { updateApiData } from '../services/api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
function Wallet({ show, handleClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [siteLang, setSiteLang] = useState('en')
    const userId = JSON.parse(localStorage.getItem('userId'))
    const isLogin = useSelector((state) => state.auth.isLogin);
    const { walletUse, demoWallet,dollerToInr } = useSelector((state) => state.wallet);
    const { userData, loading, error, userSetting } = useSelector((state) => state.user);
    useEffect(() => {
        // dispatch(fetchUserData());

    }, [dispatch]);
    //   useEffect(() => {
    //     console.log("calling")
    //     dispatch(fetchUserData());
    // }, []);
    async function updateSetting() {
        if(!userData){
            return navigate('/login')
        }
        const currency= userData.currency == 'inr' ? 'usd' : 'inr' 
        let liveAmount=userData.liveAmount
        let demoAmount=userData.demoAmount
         const exchangeRate =dollerToInr ||   Number(import.meta.VITE_USD_TO_INR) || 87;
        if(currency=='inr'){
            liveAmount=userData.liveAmount * exchangeRate
            demoAmount=userData.demoAmount * exchangeRate
        }else{
            liveAmount=userData.liveAmount / exchangeRate
            demoAmount=userData.demoAmount / exchangeRate
        }
        const data = { ...userData, userId,currency,liveAmount,demoAmount}
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
    const getLevelImg = () => {
        const level = userData?.levelId?.name?.toLowerCase() || '';
        if (level.includes('starter')) return "/assets/images/wallet-tp.png";
        if (level.includes('expert')) return "/assets/images/advance.png";
        if (level.includes('advanced')) return "/assets/images/expert.png";
        return "/assets/images/wallet-tp.png"; // default
    };

    return (

        <div className="wallet-offcanvas-section">
            {/* Trigger Button */}
            {/* Offcanvas (Right side) */}
            <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white wallet-main-bx">
                {/* <Offcanvas.Header closeButton className="me-3 text-white">
                    <Offcanvas.Title><FontAwesomeIcon icon={faAngleLeft} />{t('wallet')}</Offcanvas.Title>
                </Offcanvas.Header> */}

                <Offcanvas.Header className="me-3 text-white">
                    <Offcanvas.Title>
                        <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                        {t('wallet')}
                    </Offcanvas.Title>
                    {/* Custom Font Awesome close button */}
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-white ms-auto"
                        style={{ cursor: 'pointer', fontSize: '1.25rem' }}
                        onClick={handleClose}
                    />
                </Offcanvas.Header>

                <Offcanvas.Body className="d-grid align-content-between">
                    <div >
                        <div className="d-flex gap-3 align-items-center wallet-tp-header mb-3">
                            <div className="wallet-logo">
                                <img src={userData?.photo ? `${base_url}/${userData?.photo}` : "/assets/images/wallet-user.png"} className="wallet-main-logo" alt="" />
                            </div>
                            <div className="wallet-admin-details">
                                <p className="mb-0">{userData?.email || 'demoAccount...'}</p>
                                <small><span>{t('id')} : </span>{userData?.nickName || '63507268'}</small>
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
                                    id="liveAccount"
                                    defaultChecked
                                />
                                <label className="form-check-label d-flex flex-column" htmlFor="liveAccount">
                                    {t('liveAccount')}
                                    <strong>{userData?.currency === 'inr' ? 'INR' : 'USD'} {userData?.liveAmount?.toFixed() || '0.00'}</strong>
                                </label>
                            </div>

                            {/* Demo Account */}
                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="account"
                                    onChange={() => {
                                        sessionStorage.setItem('wallet', 'demo')
                                        dispatch(setWalletUse('demo'))
                                    }}
                                    checked={walletUse == 'demo'}
                                    id="demoAccount"
                                />
                                <label className="form-check-label d-flex flex-column" htmlFor="demoAccount">
                                    {t('demoAccount')}
                                    <strong>{userData?.currency === 'inr' ? 'INR' : 'USD'} {userData?.demoAmount?.toFixed() || demoWallet}</strong>
                                </label>
                            </div>
                        </div>

                        {/* Currency */}
                        <div className="d-flex justify-content-between align-items-center mb-3 wallet-current-status wallet-tp-header">
                            <h6><span>{t('currency')} :</span> {userData?.currency === 'inr' ? 'INR' : 'USD'}</h6>
                            <button onClick={() => updateSetting()} variant="success" size="sm" className="wallet-change">
                                {t('change')}
                            </button>
                        </div>

                        {/* Buttons */}
                        <div className="d-grid gap-2 wallet-deposit-btx">
                            <Link to="/deposit" className="wallet-deposit-btn" variant="primary">{t('deposit')}</Link>
                            <Link to="/deposit?type=withdrawal" className="wallet-deposit-btn" variant="primary">{t('withdraw')}</Link>
                            <Link to="/deposit?type=transactions" className="wallet-deposit-btn" variant="primary">{t('transaction')}</Link>
                        </div>

                    </div>

                    {/* Bottom Card */}
                    {isLogin && <div className=" rounded  wallet-btm-card">
                        <div className="wallet-btm-logo">
                            <img
                                src={
                                    getLevelImg()}
                                alt=""
                            />

                            <Link to='/account-level' className="wallet-btm-content">
                                <p className="mb-0">{userData?.levelId && siteLang == 'en' ? userData?.levelId?.name : userData?.levelId?.hindiName}:</p>
                                <h6 className="mb-0">+{userData?.levelId ? userData?.levelId?.rateOfReturn : '0'}% {t('profit')}</h6>
                            </Link>
                        </div>
                    </div>}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default Wallet
