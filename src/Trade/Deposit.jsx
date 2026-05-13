import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { faAngleLeft, faArrowDown, faArrowRight, faArrowUp, faBank, faBell, faCheck, faCircleInfo, faClock, faClose, faCopy, faCreditCard, faGift, faInfo, faPen, faQuestion, faRotate, faStar, faTrash, faUser, faWallet, } from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import { useEffect, useRef, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Tab, Nav, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FaUser, FaLock, FaBell, FaFileAlt, FaHeadset, FaWallet, FaCopy, FaCheckSquare } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckCircle } from "lucide-react";
import TradeHeader from "./TradeHeader";
import Wallet from "./Wallet";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/features/userSlice";
import { base_url } from "../baseUrl";
import axios, { all } from "axios";
import { deleteApiData, getApiData, getSecureApiData, postApiData, securePostData, updateApiData } from "../services/api";
import { toast } from "react-toastify";
import { logout } from "../redux/features/authSlice";
import { CSVLink } from "react-csv";
import TradeReferral from "./TradeReferral";
import EnterCode from "../Modal/EnterCode";
import NotificationPanel from "./Notification";
import { useTranslation } from "react-i18next";
import { setDefaultCurrency, setDefaultLanguage } from "../redux/features/walletSlice";
import { getWebisteSetting } from "../services/globalFunction";
import AccountModal from "./AccountModal";
import TradeHistoryChart from "./TradeHistoryChart";
import { SiPhonepe } from "react-icons/si";




function Deposit() {
    const navigate = useNavigate()
    const userId = JSON.parse(localStorage.getItem('userId'))
    const [siteLang, setSiteLang] = useState('en')
    const [fileName, setFileName] = useState("");
    const [firstBonus, setFirstBonus] = useState(0)
    const [historyChart, setHistoryChart] = useState(false)
    const isLogin = useSelector((state) => state.auth.isLogin);
    const [historyData, setHistoryData] = useState()
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [timer, setTimer] = useState(0); // countdown in seconds
    const [isDisabled, setIsDisabled] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [key, setKey] = useState("trades");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(!show);
    const { walletUse, activeTicker, demoWallet, defaultCurrency, dollerToInr, hideBalance } = useSelector((state) => state.wallet);
    const [marketCode, setMarketCode] = useState({ marketId: null, code: '', name: '' })
    const [allPromo, setAllPromo] = useState([])
    const [allMarket, setAllMarket] = useState([])
    const [claimMarket, setClaimMarket] = useState([])
    const [paymentInfo, setPaymentInfo] = useState()
    const [btcOpen, setBtcOpen] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [dpLoading, setDpLoading] = useState(false)
    const { userData, userSetting, userKyc, loading, error, userDeposit, userWithdraw, userTrade, myRefferals } = useSelector((state) => state.user);

    const [withdrawForm, setWithdrawForm] = useState({ userId, method: 'bank', amount: undefined, holderName: '', upiId: '', accountNumber: undefined, ifscCode: '' })
    const [depositForm, setDepositForm] = useState({
        userId, transactionId: '', amount: undefined, method: '', paymentTime: null, notes: '', name: '', screenShot: null, scName: null,
        termAndCondition: { withRegistered: false, transactionId: false, screenshot: false, falseSubmission: false }
    })
    const [transactionFilter, setTransactionFilter] = useState({ date: null, status: '' })
    const [tradeFilter, setTradeFilter] = useState({ date: null, status: '' })
    const [orderFilter, setOrderFilter] = useState({ date: null, status: '' })
    const [kycForm, setKycForm] = useState({ userId, document: null, type: '' })
    const [currentTransPage, setCurrentTransPage] = useState(1);
    const transactionLimit = 10;
    const orderLimit = 10
    const [filterTrade, setFilterTrade] = useState([])
    const [filterOrder, setFilterOrder] = useState([])
    const [transactionList, setTransactionList] = useState([])
    const [withdrawList, setWithdrawList] = useState([])
    const [btcData, setBtcData] = useState({ name: '', img: '', type: '' })
    const [currentTradePage, setCurrentTradePage] = useState(1);
    const [totalTradePages, setTotalTradePages] = useState(1);
    const [currentOrderPage, setCurrentOrderPage] = useState(1);
    const [totalOrderPages, setTotalOrderPages] = useState(1);
    const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
    const [totalTransactionPages, setTotalTransactionPages] = useState(1)
    const tradeLimit = 10;
    const location = useLocation();
    const fileInputRef = useRef(null);
    const handlePencilClick = () => {
        fileInputRef.current.click(); // opens file selector
    };
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserForm({
                ...userForm,
                photo: file, // for uploading
                previewPhoto: URL.createObjectURL(file) // for showing in <img>
            });
        }
    };
    // Nested Tabs
    const [outerKey, setOuterKey] = useState("trades");
    const [innerKey, setInnerKey] = useState("trade-history");
    const [enterPlatform, setEnterPlatform] = useState(true);
    const [withdrawFunds, setWithdrawFunds] = useState(true);
    const [termData, setTermData] = useState(null)
    const [showTab, setShowTab] = useState(null);
    const dispatch = useDispatch();
    const [userForm, setUserForm] = useState({
        userId, nickName: '', lastName: '', email: '', phone: undefined, dob: undefined, currency: '',
        country: '', address: '', photo: undefined, previewPhoto: undefined, aadhar: ''
    })
    const [settingForm, setSettingForm] = useState({ userId, language: null, timezone: null, enterToPlatform: false, withdrawFund: false })
    const [passwordForm, setPasswordForm] = useState({ userId, oldPassword: '', newPassword: '', confirmPassword: '' })

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm({ ...passwordForm, [name]: value })
    }

    useEffect(() => {
        if (userData) {
            setUserForm(userData)
        }
        if (userSetting) {
            setSettingForm({ ...userSetting, userId })
        }

        if (userTrade) {
            setFilterTrade(userTrade)
        }
    }, [userData, userSetting, userTrade]);

    useEffect(() => {
        if (!userTrade) return;

        getUserTrade()
    }, [tradeFilter]);
    useEffect(() => {
        if (!userId) return;

        getUserOrder()
    }, [orderFilter]);

    async function updateSetting(updatedForm = settingForm) {
        try {
            const result = await updateApiData(`update-user-setting`, updatedForm);
            if (result.success) {
                dispatch(fetchUserData());
                toast.success('Setting updated');
            }
        } catch (error) {
            ;
        }
    }
    async function updateCurrencySetting(currency) {
        let liveAmount = userData.liveAmount
        let demoAmount = userData.demoAmount
        const exchangeRate = dollerToInr || 90;
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
                // toast.success('Currency updated');
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    async function updateUserSetting(e) {
        e.preventDefault()
        try {
            const result = await updateApiData(`update-user-setting`, settingForm);
            if (result.success) {
                if (settingForm.currency !== userSetting.currency) {
                    updateCurrencySetting(userForm.currency)
                }
                dispatch(fetchUserData());
                localStorage.setItem('defaultLang', settingForm.language == 'english' ? 'en' : 'hi')
                dispatch(setDefaultLanguage(settingForm.language == 'english' ? 'en' : 'hi'))
                toast.success('Setting updated');
            }
        } catch (error) {

        }
    }
    async function updateUserKyc(e) {
        e.preventDefault()
        const data = new FormData()
        data.append('userId', userId)
        data.append('type', kycForm.type)
        data.append('document', kycForm.document)
        try {
            const result = await securePostData(`add-kyc`, data);
            if (result.success) {
                setKycForm({ document: null, type: '' })
                dispatch(fetchUserData());
                toast.success('Kyc request has sent');
            }
        } catch (error) {
            ;
        }
    }
    async function handlePasswordSubmit(e) {
        e.preventDefault()
        if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
            toast.error('New and confirm password not match')
        }
        try {
            const result = await securePostData(`change-password`, passwordForm);
            if (result.success) {
                setPasswordForm({ userId, oldPassword: '', newPassword: '', confirmPassword: '' })
                toast.success('Password updated');
            }
            else {
                toast.error(result.message)
            }
        } catch (error) {
            ;
        }
    }
    async function getTermData() {
        try {
            const result = await getApiData(`get-withdraw-term`)
            if (result.success) {
                setTermData(result.term)
                setActiveTab(result.payment?.method[0].platForm)
                setPaymentInfo(result.payment)
            }
        } catch (error) {
            toast.error(error)
        }
    }
    async function getMarketData() {
        try {
            const result = await getSecureApiData(`get-user-market/${userId}`)
            if (result.success) {
                setAllMarket(result.marketData)
                setClaimMarket(result.claimMarket)
            }
        } catch (error) {
            toast.error(error)
        }
    }
    async function getPromoData() {
        try {
            const result = await getSecureApiData(`get-deposit-promo/${userId}`)
            if (result.success) {
                const filter = result.promoData.filter(item => item.status = 'active')
                setAllPromo(filter)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        if (termData == null) {
            getTermData()
        }
        if (allMarket.length == 0) {
            getMarketData()
        }
        // getPromoData()
    }, []);
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
    function withdrawChange(e) {
        const { name, value } = e.target
        setWithdrawForm({
            ...withdrawForm,
            [name]: value
        })
    }
    const withdrawSubmit = async (e) => {
        e.preventDefault();
        if (userSetting.withdrawFund) {
            resendCode();
            setShowWithdrawModal(true);
            return;
        }
        // No OTP required → submit withdraw immediately
        await submitWithdrawRequest();
    };

    const submitWithdrawRequest = async () => {
        try {
            const result = await securePostData('withdraw-amount', withdrawForm);
            if (result.success) {
                setWithdrawForm({ userId, type: 'bank', amount: undefined, holderName: '', upiId: '', accountNumber: undefined, ifscCode: '' });
                dispatch(fetchUserData());
                toast.success("Your withdraw request has been sent!");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred during withdrawal.");
        } finally {
            setShowDeposit(false);
        }
    };

    const marketSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { userId, marketId: marketCode.marketId, code: marketCode?.code }
            const result = await securePostData('apply-market-code', data)
            if (result.success) {
                setMarketCode({ marketId: null, code: '', name: '' })
                getMarketData()
                dispatch(fetchUserData())
                toast.success("Promo Code applied!")
            }
            else {
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    function depositChange(e) {
        const { name, value } = e.target
        setDepositForm({
            ...depositForm,
            [name]: value
        })
    }
    const depositSubmit = async (e) => {
        e.preventDefault();
        for (let i in depositForm) {
            if (!depositForm[i]) {
                return toast.error("Please fill all the fields")
            }
        }
        if (!depositForm.termAndCondition.withRegistered || !depositForm.termAndCondition.transactionId || !depositForm.termAndCondition.screenshot || !depositForm.termAndCondition.falseSubmission) {
            return toast.error("Please accept all the terms and conditions")
        }
        const form = new FormData()
        form.append('userId', depositForm.userId)
        form.append('amount', depositForm.amount)
        form.append('name', depositForm.name)
        form.append('notes', depositForm.notes)
        form.append('method', depositForm.method)
        form.append('paymentTime', depositForm.paymentTime)
        form.append('transactionId', depositForm.transactionId)
        form.append('termAndCondition', JSON.stringify(depositForm.termAndCondition))
        if (depositForm?.screenShot) {
            form.append('screenShot', depositForm.screenShot)
        }
        try {
            setDpLoading(true)
            const result = await securePostData('deposit-amount', form);
            if (result.success) {
                setDepositForm({
                    userId,
                    amount: undefined,
                    name: '',
                    screenShot: '', transactionId: '',
                    scName: null, notes: '', method: '', paymentTime: null,
                    promoCode: ''
                });
                dispatch(fetchUserData())
                setBtcOpen(false)
                toast.success("Your deposit request has been sent!");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setDpLoading(false)
        }
    };


    useEffect(() => {
        if (localStorage.getItem('key')) {
            setKey(localStorage.getItem('key'))
        }
    }, [])
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (type) {
            setKey(type);
        }
    }, [location.search]);
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setUserForm({ ...userForm, [name]: value })
    }
    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('userId', userId)
        data.append('nickName', userForm.nickName)
        data.append('lastName', userForm.lastName)
        data.append('phone', userForm.phone)
        data.append('address', userForm.address)
        data.append('country', userForm.country)
        data.append('aadhar', userForm.aadhar)
        data.append('dob', userForm.dob)
        data.append('email', userForm.email)
        if (userForm.phone) {
            data.append('photo', userForm.photo)
        }
        try {
            const result = await updateApiData('update-user-data', data)
            if (result.success) {
                dispatch(fetchUserData())
                toast.success('Profile Data Updated')
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    async function handleDelete() {
        try {
            const result = await deleteApiData(`delete-user/${userId}`);
            if (result.success) {
                toast.success('Account deleted')
                navigate('/login')
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
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
    async function getUserTrade(page = 1) {
        try {
            const { status, date } = tradeFilter;
            const queryParams = new URLSearchParams({
                page,
                limit: tradeLimit,
                userId,
                ...(status && status !== 'All' && { status }),
                ...(date && { date }),
            });
            const result = await getSecureApiData(`get-user-trades/${userId}?${queryParams.toString()}`);
            if (result.success) {
                setFilterTrade(result.userTrade);
                setTotalTradePages(result?.totalPages);
                setCurrentTradePage(page);
            } else {
                if (result.message === 'Session Timeout') {
                    const loginData = JSON.parse(localStorage.getItem('loginData'))
                    localStorage.clear()
                    if (loginData) {
                        localStorage.setItem('loginData', JSON.stringify(loginData))
                    }
                    navigate('/login')
                }
                // toast.error(result.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    async function getUserWithdraw() {
        try {
            const res = await getSecureApiData(`get-user-withdraw/${userId}`)
            if (res.success) {
                setWithdrawList(res.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getUserWithdraw()
    }, [userId])
    async function getUserTransaction(page = 1) {
        try {
            const { status, date } = tradeFilter;

            const queryParams = new URLSearchParams({
                page,
                limit: tradeLimit,
                ...(status && status !== 'All' && { status }),
                ...(date && { date }),
            });

            const result = await getSecureApiData(
                `my-transaction/${userId}?${queryParams.toString()}`
            );

            if (result.success) {
                const data = result.data;

                setTransactionList(data.list);
                setTotalTransactionPages(Math.ceil(data.total / tradeLimit));

            } else {
                if (result.message === 'Session Timeout') {
                    const loginData = JSON.parse(localStorage.getItem('loginData'))
                    localStorage.clear()
                    if (loginData) {
                        localStorage.setItem('loginData', JSON.stringify(loginData))
                    }
                    navigate('/login')
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleTradePrev = () => {
        if (currentTradePage > 1) {
            getUserTrade(currentTradePage - 1);
        }
    };
    const handleTradeNext = () => {
        if (currentTradePage < totalTradePages) {
            getUserTrade(currentTradePage + 1);
        }
    };
    async function getUserOrder(page = 1) {
        try {
            const { status, date } = orderFilter;
            const queryParams = new URLSearchParams({
                page,
                limit: orderLimit,
                userId,
                ...(status && status !== 'All' && { status }),
                ...(date && { date }),
            });
            const result = await getSecureApiData(`get-user-orders/${userId}?${queryParams.toString()}`);
            if (result.success) {
                setFilterOrder(result.userOrder);
                setTotalOrderPages(result?.totalPages);
                setCurrentOrderPage(page);
            } else {
                if (result.message === 'Session Timeout') {
                    const loginData = JSON.parse(localStorage.getItem('loginData'))
                    localStorage.clear()
                    if (loginData) {
                        localStorage.setItem('loginData', JSON.stringify(loginData))
                    }
                    navigate('/login')
                }
                // toast.error(result.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleOrderPrev = () => {
        if (currentOrderPage > 1) {
            getUserOrder(currentOrderPage - 1);
        }
    };
    const handleOrderNext = () => {
        if (currentOrderPage < totalOrderPages) {
            getUserOrder(currentOrderPage + 1);
        }
    };

    const handleTransPrev = () => {
        if (currentTransPage > 1) {
            setCurrentTransPage(currentTransPage - 1);
        }
    };
    const handleTransNext = () => {
        if (currentTransPage < totalTradePages) {
            setCurrentTransPage(currentTransPage + 1);
        }
    };
    useEffect(() => {
        if (!userId) {
            navigate('/login')
        } else {
            getUserTransaction(currentTransactionPage)
        }
    }, [])

    const inputsRef = useRef([]);

    const handleOtpChange = (element, index) => {
        const value = element.value.replace(/\D/, '');
        if (!value) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Focus next
        if (index < 5 && value) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];

        pasteData.forEach((char, i) => {
            if (i < 6 && /^\d$/.test(char)) {
                newOtp[i] = char;
            }
        });

        setOtp(newOtp);

        const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
        inputsRef.current[nextIndex]?.focus();
    };
    const resendCode = async () => {
        if (!userId) {
            return
        }
        const result = await getApiData(`send-mail/${userId}`)
        if (result.success) {
            toast.success('OTP sent!')
        }
        else {
            toast.error(result.message)
        }
    }
    const handleVerify = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        const data = { code: finalOtp, userId };

        try {
            const result = await postApiData('verify-code', data);
            if (result.success) {
                setShowWithdrawModal(false); // Close OTP modal
                await submitWithdrawRequest(); // ✅ Proceed to withdraw
            } else {
                toast.error(result.message || "Verification failed");
                setCodeRequire(false);
            }
        } catch (error) {
            toast.error("Something went wrong during OTP verification");
        }
    };


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
    function convertCurrency(amount, currency) {
        const exchangeRate = dollerToInr || Number(import.meta.VITE_USD_TO_INR) || 87;
        const from = currency == 'inr' ? 'inr' : 'usd';
        const to = defaultCurrency == 'usd' ? 'usd' : 'inr';
        if (from === to) return amount?.toFixed(2);

        if (from === 'usd' && to === 'inr') {
            return amount * exchangeRate;
        } else if (from === 'inr' && to === 'usd') {
            const finalAmount = amount / exchangeRate
            return finalAmount?.toFixed(2);
        } else {
            throw new Error('Unsupported currency conversion');
        }
    }
    async function updateCurrencySetting() {
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
        }
    }
    function historyClose() {
        setHistoryChart(false)
    }
    const formateTradeData = filterOrder.map(({ closingData, ...rest }) => ({
        ...rest,
        closingData_time: closingData?.time,
        closingData_symbol: closingData?.symbol,
        closingData_open: closingData?.open,
        closingData_high: closingData?.high,
        closingData_low: closingData?.low,
        closingData_close: closingData?.close,
    }));
    const formateOrderData = filterOrder.map(({ closingData, ...rest }) => ({
        ...rest,
        closingData_time: closingData?.time,
        closingData_symbol: closingData?.symbol,
        closingData_open: closingData?.open,
        closingData_high: closingData?.high,
        closingData_low: closingData?.low,
        closingData_close: closingData?.close,
    }));
    const convertAmount = (amount, from, to) => {
        if (from === to) return amount;
        // INR → USD
        if (from === "inr" && to === "usd") {
            return amount / dollerToInr;
        }

        // USD → INR
        if (from === "usd" && to === "inr") {
            return amount * dollerToInr;
        }

        return amount;
    };
    const getLocalDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const local = new Date(now.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
    };

    // Deposit pay Method
    const [activeTab, setActiveTab] = useState("upi");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const data = paymentInfo?.method.find(item => item?.platForm == activeTab)?.detail
            await navigator.clipboard.writeText(data);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (err) {
            console.log("Copy failed", err);
        }
    };

    return (
        <>


            {/* Main Content */}
            <main className="main-content">
                <div className="deposit-main-section">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="deposit-tp-crd">
                                <div className="deposit-mny-logo">
                                    <img src="/assets/images/money.png" alt="" />
                                    <div className="deposit-mny-content">
                                        <h6 className="mb-0">{t('availableForWithdraw')}</h6>
                                        <h4 className="mb-0">
                                            {defaultCurrency?.toUpperCase()}{' '}
                                            {
                                                convertCurrency(userData?.liveAmount, defaultCurrency) >= termData?.minWithdrawAmount
                                                    ? convertCurrency(userData?.liveAmount.defaultCurrency) > termData?.maxWithdrawAmount
                                                        ? termData.maxWithdrawAmount
                                                        : convertCurrency(userData?.liveAmount, defaultCurrency)
                                                    : 0
                                            }
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="deposit-tp-crd">
                                <div className="deposit-mny-logo">
                                    <img src="/assets/images/money.png" alt="" />
                                    <div className="deposit-mny-content">
                                        <h6 className="mb-0">{t("inTheAccount")}</h6>
                                        <h4 className="mb-0">{userData?.currency === 'inr' ? 'INR' : 'USD'} {convertCurrency(userData?.liveAmount, defaultCurrency)}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="min-deposit-amount-list">
                                <ul className="d-flex flex-wrap gap-2 mb-0">
                                    <li><FontAwesomeIcon icon={faStar} className="deposit-start-icon" />
                                        {t('minDepositAmount')}: <a href="" className="deposit-unicorn-btn">{convertCurrency(termData?.minDepositeAmount, 'usd')}</a></li>
                                    <li><FontAwesomeIcon icon={faStar} className="deposit-start-icon" />
                                        {t('maxWithdrawAmount')}: <a href="" className="deposit-unicorn-btn">{convertCurrency(termData?.maxWithdrawAmount, 'usd')}</a></li>
                                </ul>
                                <ul className="d-flex flex-wrap gap-2 mb-0">
                                    <li><FontAwesomeIcon icon={faStar} className="deposit-start-icon" />
                                        {t('minWithdrawAmount')}: <a href="" className="deposit-unicorn-btn">{convertCurrency(termData?.minWithdrawAmount, 'usd')}</a></li>
                                    <li><FontAwesomeIcon icon={faStar} className="deposit-start-icon" />
                                        {termData?.fee == 0 ? `Without  ${t('aFeeof')}` : `${t('aFeeof')} ${termData?.fee}%`}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-12">
                            <div className="setting-tab-section">
                                <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3  p-2 rounded-3 setting-tab-btn">
                                    <Nav.Item>
                                        <Nav.Link eventKey="deposit" onClick={() => setBtcOpen(false)} className="rounded-pill px-4 setting-tab-link">{t('deposit')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="withdrawal" className="rounded-pill ">{t('withdraw')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="transactions" className="rounded-pill ">{t('transaction')}</Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="trades" className="rounded-pill ">{t('trades')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="account" className="rounded-pill ">{t('account')}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="market" className="rounded-pill ">{t('market')}</Nav.Link>
                                    </Nav.Item>
                                    {/* <Nav.Item>
                                        <Nav.Link eventKey="auto" className="rounded-pill ">{t('autoMartingale')}</Nav.Link>
                                    </Nav.Item> */}
                                </Nav>


                                <div className="shadow-sm rounded-3 p-lg-3 p-sm-0 setting-tab-details ">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="deposit" active={key === "deposit"}>


                                            <div className="row">
                                                {/* <div className="col-lg-6">
                                                    <div className="unicorn-deposit-box">
                                                        <h6 >Name : </h6>
                                                        <h5 >{paymentInfo?.name}</h5>
                                                    </div>
                                                    <div className="unicorn-deposit-box">
                                                        <h6 >Qr Type : </h6>
                                                        <h5 >{paymentInfo?.qrType}</h5>
                                                    </div>
                                                        <div className="row">
                                                            {paymentInfo?.method?.map((item, index) => {
                                                                return (
                                                                    <div key={index} className="col-lg-6 d-flex justify-content-between">
                                                                        <span className="text-white mb-3 d-flex flex-column">{item?.platForm} 
                                                                            <span className="text-white">{item?.detail}</span></span> 
                                                                        <span className="text-white">{item?.time}</span>
                                                                        
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        
                                                    <div className="unicorn-deposit-box">
                                                        <h6 >Qr :</h6>
                                                        <img src={`${base_url}/${paymentInfo?.qr}`} alt="" srcset="" width={150} height={150} />
                                                    </div>
                                                    <div className="unicorn-deposit-box">
                                                        <h6 >Description :</h6>
                                                        <div dangerouslySetInnerHTML={{ __html: paymentInfo?.description }} />
                                                    </div>
                                                </div> */}

                                                <div className="col-lg-6">
                                                    <div className="unicorn-pay-unique-method">
                                                        <div className="deposit-tabs">
                                                            {paymentInfo?.method?.map((m, i) =>
                                                                <button onClick={() => setActiveTab(m?.platForm)} className={activeTab === m?.platForm ? "active" : ""}>
                                                                    <div>
                                                                        <img width={22} height={22} src={`${base_url}/${m?.icon}`} alt="" srcset="" />
                                                                    </div>
                                                                    {m?.platForm}
                                                                    <div>
                                                                        <span className="pay-instant-title">{m?.time}</span>
                                                                    </div>
                                                                </button>)}



                                                        </div>
                                                        <div className="deposit-content">

                                                            <div className="qr-box text-center">
                                                                <img src={`${base_url}/${paymentInfo?.qr}`} alt="" srcset="" width={200} height={200} />

                                                                <div className="pay-diffrent-method">
                                                                    <h5>{paymentInfo?.method.find(item => item?.platForm == activeTab)?.detail}</h5>
                                                                </div>
                                                                <div className="unicorn-pay-notes">
                                                                    <p>{t('qrDesc')}</p>
                                                                </div>
                                                                <div>
                                                                    <button onClick={handleCopy} className="cp-upi-btn">
                                                                        {copied ? (
                                                                            <>
                                                                                <FaCheckSquare /> Copied!
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaCopy /> Copy
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>




                                                        </div>
                                                    </div>

                                                    <div className="unicorn-deposit-rule">
                                                        <div className="unicorn-deposit-rule__header">
                                                            <span className="unicorn-deposit-rule__accent"></span>
                                                            <h3 className="unicorn-deposit-rule__title">{t('depositRules')}</h3>
                                                        </div>

                                                        <div className="unicorn-deposit-rule__row">
                                                            <span>{t('minimumDeposit')}</span>
                                                            <span className="unicorn-deposit-rule__value--green">{userData?.currency == "inr" ? "₹" : "$"}
                                                                {convertAmount(termData?.minDepositeAmount, "usd", userData?.currency)}</span>
                                                        </div>

                                                        {/* <div className="unicorn-deposit-rule__row">
                                                            <span>{t('maximumPerTransaction')}</span>
                                                            <span>{userData?.currency == "inr" ? "₹" : "$"}{convertAmount(termData?.maxDepositeAmount, userData?.currency)}</span>
                                                        </div> */}

                                                        <div className="unicorn-deposit-rule__row">
                                                            <span>{t('processingTime')}</span>
                                                            <span>{paymentInfo?.method.find(item => item?.platForm == activeTab)?.time}</span>
                                                        </div>

                                                        <div className="unicorn-deposit-rule__row">
                                                            <span>{t('bonusOnFirstDeposit')}</span>
                                                            <span className="unicorn-deposit-rule__value--yellow">
                                                                {firstBonus}% {t('bonus')}
                                                            </span>
                                                        </div>

                                                        {/* <div className="unicorn-deposit-rule__footer">
                                                            <div className="unicorn-deposit-rule__footer-left">
                                                                <span className="unicorn-deposit-rule__icon">⏱</span>
                                                                <span>Submit within session window</span>
                                                            </div>
                                                            <span className="unicorn-deposit-rule__expired">EXPIRED</span>
                                                        </div> */}
                                                    </div>



                                                </div>

                                                <div className="col-lg-6 login-section pt-0 pb-lg-0 ">
                                                    <form onSubmit={depositSubmit}>

                                                        <h6 className="fw-bold mb-3 left-side-boder">{t('paymentData')}</h6>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" name="name" value={depositForm.name} onChange={depositChange} className="form-control" id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('name')}</label>
                                                            </div>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="number" name="amount" value={depositForm.amount} min={termData?.minDepositeAmount}
                                                                    onChange={depositChange} className="form-control" id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('amount')}</label>
                                                            </div>
                                                        </Form.Group>
                                                        {/* <Form.Group className="mb-3">
                                                            <div className="d-flex gap-2 mb-3 flex-wrap">
                                                                {[10, 50, 100, 500, 1000, 1500, 100000].map((amt) => (
                                                                    <Button key={amt} variant="secondary" onClick={() => setDepositForm({ ...depositForm, amount: amt })}>
                                                                        {amt}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </Form.Group> */}
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <select required name="method" className="form-control" value={depositForm.method} onChange={depositChange}>
                                                                    <option value="">{t('select')}</option>
                                                                    <option value="paytm">Paytm</option>
                                                                    <option value="phone pe">Phone Pe</option>
                                                                    <option value="bhim">Bhim</option>
                                                                    <option value="amzone pay">Amzone Pay</option>
                                                                    <option value="google pay">Google Pay</option>
                                                                    <option value="bharat pay">Bharat Pay</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                                <label>Payment App</label>
                                                            </div>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="datetime-local"
                                                                    max={getLocalDateTime()} name="paymentTime" value={depositForm.paymentTime} onChange={depositChange} className="form-control" id="cpass" placeholder=" " required />
                                                                <label >Payment Date & Time</label>
                                                            </div>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" name="transactionId"
                                                                    value={depositForm.transactionId} onChange={depositChange} className="form-control" id="cpass" placeholder=" " required />
                                                                <label >{t('transactionId')}</label>
                                                            </div>
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                            <label className="text-white">Screen Shot</label>

                                                            <div className="upload-area2 text-start">
                                                                <input
                                                                    type="file"
                                                                    required
                                                                    id="uploadFile"
                                                                    hidden
                                                                    accept=".jpg,.jpeg,.png"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            const updatedForm = {
                                                                                ...depositForm,
                                                                                screenShot: file,
                                                                                scName: file.name,
                                                                            };
                                                                            setDepositForm(updatedForm);
                                                                        }
                                                                    }}
                                                                />

                                                                {!depositForm?.scName ? (
                                                                    <label htmlFor="uploadFile" className="file-label">
                                                                        Choose File
                                                                    </label>
                                                                ) : (
                                                                    <label htmlFor="uploadFile" className="file-label">
                                                                        {depositForm?.scName}
                                                                    </label>
                                                                )}
                                                            </div>

                                                            {/* IMAGE PREVIEW WITH CLOSE BUTTON */}
                                                            {depositForm?.screenShot && (
                                                                <div className="preview-wrapper mt-2 position-relative d-inline-block">

                                                                    <img
                                                                        src={URL.createObjectURL(depositForm.screenShot)}
                                                                        alt="Screen Shot"
                                                                        width={100}
                                                                        height={100}
                                                                        className="img-fluid"
                                                                    />

                                                                    {/* CLOSE BUTTON */}
                                                                    <button
                                                                        type="button"
                                                                        className="remove-btn"
                                                                        onClick={() =>
                                                                            setDepositForm({
                                                                                ...depositForm,
                                                                                screenShot: null,
                                                                                scName: "",
                                                                            })
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon icon={faClose} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Form.Group>
                                                        <label className="text-white">Remark / Notes</label>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                {/* <label className="text-white">Screen Shot</label> */}

                                                                <textarea rows={5} name="notes"
                                                                    value={depositForm.notes} onChange={depositChange} className="form-control" id="cpass" placeholder=" " required />
                                                            </div>
                                                        </Form.Group>

                                                        <div class="declaration-box mb-3">
                                                            <h6 class="declaration-title mb-3">{t('mandatoryDeclaration')}</h6>

                                                            <div class="form-check custom-check mb-3">
                                                                <input class="form-check-input" type="checkbox" id="check1" checked={depositForm.termAndCondition.withRegistered} onChange={(e) =>
                                                                    setDepositForm({ ...depositForm, termAndCondition: { ...depositForm.termAndCondition, withRegistered: e.target.checked } })} />
                                                                <label class="form-check-label" for="check1">
                                                                    {t('dpTermFirst')}
                                                                </label>
                                                            </div>

                                                            <div class="form-check custom-check mb-3">
                                                                <input class="form-check-input" type="checkbox" id="check2" checked={depositForm.termAndCondition.transactionId} onChange={(e) =>
                                                                    setDepositForm({ ...depositForm, termAndCondition: { ...depositForm.termAndCondition, transactionId: e.target.checked } })} />
                                                                <label class="form-check-label" for="check2">
                                                                    {t('dpTermSecond')}
                                                                </label>
                                                            </div>

                                                            <div class="form-check custom-check mb-3">
                                                                <input class="form-check-input" type="checkbox" id="check3" checked={depositForm.termAndCondition.screenshot} onChange={(e) =>
                                                                    setDepositForm({ ...depositForm, termAndCondition: { ...depositForm.termAndCondition, screenshot: e.target.checked } })} />
                                                                <label class="form-check-label" for="check3">
                                                                    {t('dpTermThird')}
                                                                </label>
                                                            </div>

                                                            <div class="form-check custom-check">
                                                                <input class="form-check-input" type="checkbox" id="check4" checked={depositForm.termAndCondition.falseSubmission} onChange={(e) =>
                                                                    setDepositForm({ ...depositForm, termAndCondition: { ...depositForm.termAndCondition, falseSubmission: e.target.checked } })} />
                                                                <label class="form-check-label" for="check4">
                                                                    {t('dpTermFourth')}
                                                                </label>
                                                            </div>

                                                        </div>





                                                        <div className="d-flex justify-content-end pb-lg-0 pb-3">
                                                            <Button variant="primary" disabled={dpLoading} className="signIn-btn " type="submit">{t('deposit')} <FontAwesomeIcon icon={faArrowRight} /> </Button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="withdrawal" active={key === "withdrawal"}>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <h6 className="fw-bold mb-3 left-side-boder">{t('accounts')}</h6>
                                                    <div className="depost-account-bx">
                                                        <h4>{t('inTheAccount')}:</h4>
                                                        <h5>{userData?.currency === 'inr' ? 'INR' : 'USD'}{' '} {userData?.liveAmount?.toFixed()}</h5>
                                                    </div>
                                                    <div className="depost-account-bx">
                                                        <h4>{t('availableForWithdraw')}:</h4>
                                                        <h5>
                                                            {userData?.currency === 'inr' ? 'INR' : 'USD'}{' '}
                                                            {(() => {
                                                                const userCurrency = userData?.currency; // e.g., 'inr' or 'usd'
                                                                const liveAmount = userData?.liveAmount || 0;

                                                                // Convert minWithdrawAmount & maxWithdrawAmount from USD → user's currency
                                                                const minWithdraw = convertAmount(termData?.minWithdrawAmount || 0, 'usd', userCurrency);
                                                                const maxWithdraw = convertAmount(termData?.maxWithdrawAmount || 0, 'usd', userCurrency);

                                                                if (liveAmount >= minWithdraw) {
                                                                    return liveAmount > maxWithdraw
                                                                        ? maxWithdraw.toFixed()
                                                                        : liveAmount.toFixed();
                                                                }
                                                                return 0;
                                                            })()}
                                                        </h5>
                                                    </div>
                                                    <div className="depost-account-bx">
                                                        <h4>{t('commission')}:</h4>
                                                        <h5>{termData?.fee} %</h5>
                                                    </div>
                                                </Col>
                                                <Col md={8} className="mb-3 login-section pt-0 pb-lg-0 ">
                                                    <div className="d-flex align-items-center justify-content-between depsit-withdral-box">
                                                        <h6 className="fw-bold mb-3 left-side-boder">{t("withdraw")}</h6>
                                                        <Link to="/support" className="with-help-coupan"><FontAwesomeIcon icon={faQuestion} className="fa-question-help" />{t('help')}</Link>
                                                    </div>
                                                    {!showDeposit && (
                                                        <div className="make-deposit-bx ">
                                                            <FontAwesomeIcon icon={faInfo} className="make-info-icon " />
                                                            <div className="make-deposit-details">
                                                                <p>
                                                                    {t('withdrawNote')}
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    className="mke-up-depost"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setShowDeposit(true);
                                                                    }}
                                                                >
                                                                    {t('makeWithdraw')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {showDeposit && (
                                                        <div className="deposit-box login-section mt-4  rounded" >
                                                            <form action="" onSubmit={withdrawSubmit}>
                                                                <div className="row mb-3">
                                                                    <div className="col-md-6">
                                                                        <Form.Group className="mb-3">
                                                                            <div className="custom-frm-bx">
                                                                                <input type="number" required min={convertCurrency(termData?.minWithdrawAmount, 'usd')} max={convertCurrency(termData?.maxWithdrawAmount, 'usd')} name="amount" className="form-control" value={withdrawForm.amount} onChange={withdrawChange} id="cpass" placeholder=" " />
                                                                                <label htmlFor="cpass">{t('amount')}</label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <Form.Group>
                                                                            <div className="custom-frm-bx"><select required name="method" className="form-control" value={withdrawForm.method} onChange={withdrawChange}>
                                                                                <option value="">{t('select')}</option>
                                                                                <option value="bank">{t('netBanking')}</option>
                                                                                <option value="upi">{t('upi')}</option>
                                                                            </select>
                                                                                <label>{t('paymentType')}</label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </div>
                                                                </div>
                                                                {withdrawForm?.method == 'bank' &&
                                                                    <>
                                                                        <Form.Group className="mb-3">
                                                                            <div className="custom-frm-bx">
                                                                                <input type="text" className="form-control" required name="holderName" value={withdrawForm.holderName} onChange={withdrawChange} id="cpass" placeholder=" " />
                                                                                <label htmlFor="cpass">{t('holderName')}</label>
                                                                            </div>
                                                                        </Form.Group>

                                                                        <Form.Group className="mb-3">
                                                                            <div className="custom-frm-bx">
                                                                                <input type="number" className="form-control" name="accountNumber" value={withdrawForm.accountNumber} onChange={withdrawChange} id="cpass" placeholder=" " required />
                                                                                <label htmlFor="accountNumber">{t('accountNumber')}</label>
                                                                            </div>
                                                                        </Form.Group>

                                                                        <Form.Group className="mb-3">
                                                                            <div className="custom-frm-bx">
                                                                                <input type="text" className="form-control" name="ifscCode" value={withdrawForm.ifscCode} onChange={withdrawChange} id="cpass" placeholder=" " required />
                                                                                <label htmlFor="ifscCode">{t("ifscCode")}</label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </>}
                                                                {withdrawForm?.method == 'upi' &&
                                                                    <>
                                                                        <Form.Group className="mb-3">
                                                                            <div className="custom-frm-bx">
                                                                                <input type="text" className="form-control" required name="upiId" value={withdrawForm.upiId} onChange={withdrawChange} id="cpass" placeholder=" " />
                                                                                <label htmlFor="cpass">{t('upiId')}</label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </>}

                                                                <div className="d-flex justify-content-end">
                                                                    <Button variant="primary" type="submit" className="signIn-btn ">
                                                                        {t('continue')} →
                                                                    </Button>
                                                                </div>
                                                            </form>

                                                            {/* Latest Requests */}
                                                            <div className="mt-5">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <h6 className="fw-bold mb-3 left-side-boder">Withdrawal Latest Request</h6>
                                                                    <button type="button" onClick={() => setKey('transactions')} className="float-end text-primary small">
                                                                        {t('viewAllHistory')} →
                                                                    </button>
                                                                </div>
                                                                <div className="table-responsive">
                                                                    <Table className="custom-table align-middle text-center mb-0">
                                                                        <thead className="tble-tp-header">
                                                                            <tr>
                                                                                <th>ID</th>
                                                                                <th>Date</th>
                                                                                <th>Status</th>
                                                                                <th>Type</th>
                                                                                <th>Amount</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {withdrawList?.length > 0 ? (
                                                                                withdrawList?.map((item, key) => (
                                                                                    <tr key={key}>
                                                                                        <td>{item?.customId}</td>
                                                                                        <td>{new Date(item?.createdAt)?.toLocaleString('en-GB')}</td>
                                                                                        <td>
                                                                                            {item.status == 'approve' ? (
                                                                                                <span className="text-success fw-semibold">
                                                                                                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                                                                                                    {item.status}
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span className="text-danger fw-semibold">
                                                                                                    {item?.status === 'reject' && <FontAwesomeIcon icon={faClose} className="me-1" />}
                                                                                                    {item.status}
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="fw-semibold text-capitalize">{item?.method}</td>
                                                                                        <td
                                                                                            className={
                                                                                                item?.amount
                                                                                                    ? "text-danger fw-semibold"
                                                                                                    : "text-success fw-semibold"
                                                                                            }
                                                                                        >
                                                                                            {item?.amount}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan="5" className="text-center text-muted py-3">
                                                                                        No records found
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Notification Tab */}
                                        <Tab.Pane eventKey="transactions" active={key === "transactions"}>
                                            <Row className="login-section ">
                                                <Col md={4} className="mb-3">
                                                    <div></div>
                                                </Col>
                                                <Col md={8} className="mb-3">
                                                    <Row>
                                                        <Col md={5} className="mb-3">
                                                            <Form.Group>
                                                                <div className="custom-frm-bx">
                                                                    <input placeholder=" " onChange={(e) => setTransactionFilter({ ...transactionFilter, date: e.target.value })} className="form-control" required="" max={new Date().toISOString().split('T')[0]} type="date" name="dob" />
                                                                    <label>{t('dateRange')}</label>
                                                                </div>
                                                            </Form.Group>

                                                        </Col>
                                                        <Col md={5} className="mb-3">
                                                            <Form.Group>
                                                                <div className="custom-frm-bx">
                                                                    <select required="" name="status" onChange={(e) => setTransactionFilter({ ...transactionFilter, status: e.target.value })} className="form-control">
                                                                        <option value="">All</option>
                                                                        <option value="complete">Complete</option>
                                                                        <option value="pending">Pending</option>
                                                                        <option value="reject">Reject</option>
                                                                    </select>
                                                                    <label>{t('status')}</label>
                                                                </div>
                                                            </Form.Group>

                                                        </Col>
                                                        <Col md={2} className="mb-3">
                                                            <Form.Group>
                                                                <div className="custom-frm-bx">
                                                                    {/* <select required="" name="currency" className="form-control" style={{ background: "" }}>
                                                                                <option value="INR">Export</option>
                                                                            </select> */}
                                                                    <CSVLink data={transactionList} className="d-flex align-items-center justify-content-center form-control pt-2 text-center" filename={`transaction_${Date.now()}.csv`}>
                                                                        {t('export')}</CSVLink>

                                                                </div>
                                                            </Form.Group>

                                                        </Col>
                                                    </Row>

                                                </Col>
                                            </Row>


                                            <Row >
                                                <Col md={12} className="pb-lg-0 pb-5">
                                                    <div className="table-responsive deposit-box">
                                                        <Table className="custom-table align-middle text-center mb-0">
                                                            <thead className="tble-tp-header">
                                                                <tr>
                                                                    <th>{t('id')}</th>
                                                                    <th>{t('date')}</th>
                                                                    <th>{t('status')}</th>
                                                                    <th>{t('type')}</th>
                                                                    <th>{t('amount')}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {transactionList.length > 0 ? (
                                                                    transactionList.map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item?.transactionId || item?._id}</td>
                                                                            <td>{new Date(item?.createdAt)?.toLocaleString('en-GB')}</td>
                                                                            <td>
                                                                                {item?.status === 'complete' || item?.status === 'approve' ? (
                                                                                    <span className="text-success text-capitalize fw-semibold">
                                                                                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                                                                                        {item?.status}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-danger text-capitalize fw-semibold">
                                                                                        <FontAwesomeIcon icon={faClose} className="me-1" />
                                                                                        {item?.status}
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="fw-semibold text-capitalize">{item?.type}</td>
                                                                            <td
                                                                                className={`text-uppercase fw-semibold ${item?.type === 'deposit' ? "text-danger" : "text-success"
                                                                                    }`}
                                                                            >
                                                                                {item?.status !== "pending" && (item?.type === 'deposit' ? '+' : '-')}
                                                                                {' '}
                                                                                {item?.type === "deposit" ? item?.amountToDeposit : item?.amount}
                                                                                {' '}
                                                                                {item?.status !== "pending" && (item?.currency === "usd" ? "$" : "₹")}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="5" className="text-center text-muted py-3">
                                                                            No records found
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>

                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        <button className='btn btn-outline-secondary' onClick={handleTransPrev} disabled={currentTransPage === 1}>
                                                            {t('previous')}
                                                        </button>
                                                        <span className='text-white'> Page {currentTransPage} of {totalTransactionPages} </span>
                                                        <button className='pagination-next-btn outline' onClick={handleTransNext} disabled={currentTransPage === totalTransactionPages}>
                                                            {t('next')}
                                                        </button>
                                                    </div>


                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Support Tab */}
                                        <Tab.Pane eventKey="trades" active={key === "trades"}>

                                            <Tab.Container activeKey={outerKey} onSelect={(k) => setOuterKey(k)}>
                                                <Nav variant="pills" className="mb-3 gap-2">
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="trades" onClick={() => setTradeFilter({ tradeFilter })}>{t('trades')} {t('history')}</Nav.Link>
                                                    </Nav.Item>
                                                    {/* <Nav.Item>
                                                                    <Nav.Link eventKey="settings" onClick={() => setTradeFilter({ ...tradeFilter, status: 'pending' })}>{t('pending')} {t('trades')}</Nav.Link>
                                                                </Nav.Item> */}
                                                </Nav>

                                                <Tab.Content>
                                                    {/* Outer Tab 1 */}
                                                    <Tab.Pane eventKey="trades">
                                                        {/* ✅ Inner Tab Container */}
                                                        <Tab.Container
                                                            activeKey={innerKey}
                                                            onSelect={(k) => setInnerKey(k)}
                                                        >
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="trade-history">
                                                                    <Row className="login-section py-0">
                                                                        <Col md={4} className="mb-3">
                                                                            <div></div>

                                                                        </Col>
                                                                        <Col md={8} className="mb-3">
                                                                            <Row>
                                                                                <Col md={5} className="mb-3">
                                                                                    <Form.Group>
                                                                                        <div className="custom-frm-bx">
                                                                                            <input placeholder=" " onChange={(e) => setTradeFilter({ ...tradeFilter, date: e.target.value })} className="form-control" required="" max={new Date().toISOString().split('T')[0]} type="date" name="date" />
                                                                                            <label>{t('dateRange')}</label>
                                                                                        </div>
                                                                                    </Form.Group>

                                                                                </Col>
                                                                                <Col md={5} className="mb-3">
                                                                                    <Form.Group>
                                                                                        <div className="custom-frm-bx"><select required="" name="status" onChange={(e) => setTradeFilter({ ...tradeFilter, status: e.target.value })} className="form-control">
                                                                                            <option value="">{t('all')}</option>
                                                                                            <option value="pending">{t('pending')}</option>
                                                                                            <option value="win">{t('win')}</option>
                                                                                            <option value="loss">{t('loss')}</option>
                                                                                        </select>
                                                                                            <label>{t('status')}</label>
                                                                                        </div>
                                                                                    </Form.Group>

                                                                                </Col>
                                                                                <Col md={2} className="mb-3">
                                                                                    <Form.Group>
                                                                                        <div className="custom-frm-bx">
                                                                                            {/* <select required="" name="currency" className="form-control" style={{ background: "" }}>
                                                                                                        <option value="INR">Export</option>
                                                                                                    </select> */}
                                                                                            <CSVLink data={formateTradeData} className="d-flex align-items-center justify-content-center form-control pt-2 text-center" filename={`trade_${Date.now()}.csv`}>
                                                                                                {t('export')}</CSVLink>

                                                                                        </div>
                                                                                    </Form.Group>

                                                                                </Col>
                                                                            </Row>

                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="pb-lg-0 pb-5 ">
                                                                        <Col md={12}>
                                                                            <div className="table-responsive">
                                                                                <Table className="mb-0 plain-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th className="text-start">{t('name')}</th>
                                                                                            <th>{t('info')}</th>
                                                                                            <th>{t('openingQuote')}</th>
                                                                                            <th>{t('closingQuote')}</th>
                                                                                            <th>{t('insteadOfIp')}</th>
                                                                                            {/* <th>{t('chart')}</th> */}
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {filterTrade?.length > 0 &&
                                                                                            filterTrade?.map((item, key) =>
                                                                                                <tr key={key}>
                                                                                                    <td className="text-start ">
                                                                                                        {/* <img src="/assets/images/trade-tab.png" alt="American Express" className="me-2" style={{ width: "22px", height: "22px" }} /> */}
                                                                                                        <span>{item?.tradePair?.startsWith('OTC') ? item?.tradePair?.slice(3) : item?.tradePair}</span>
                                                                                                        <p>{item?.customId || item?._id?.slice(-8)}</p>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {/* <div>85%</div> */}
                                                                                                        <div>{t('amount')}: {convertAmount(
                                                                                                            Number(item?.amount),
                                                                                                            item?.currency || "INR",   // trade kis currency me lagi thi
                                                                                                            userData?.currency                  // user ne kya select kiya hai (USD/INR)
                                                                                                        ).toFixed(2)} {userData?.currency?.toUpperCase()}</div>
                                                                                                        {item?.status == 'win' &&
                                                                                                            <div className="text-success">{t('profit')}:{convertAmount(
                                                                                                                Number(item?.profit),
                                                                                                                item?.currency || "INR",   // trade kis currency me lagi thi
                                                                                                                userData?.currency                  // user ne kya select kiya hai (USD/INR)
                                                                                                            ).toFixed(2)} {userData?.currency?.toUpperCase()}</div>}
                                                                                                        {item?.status == 'loss' &&
                                                                                                            <div className="text-danger">{t('loss')}: {convertAmount(
                                                                                                                Number(item?.amount),
                                                                                                                item?.currency || "INR",   // trade kis currency me lagi thi
                                                                                                                userData?.currency                  // user ne kya select kiya hai (USD/INR)
                                                                                                            ).toFixed(2)} {userData?.currency?.toUpperCase()}</div>}
                                                                                                        {item?.status == 'pending' &&
                                                                                                            <div className="text-muted">{t('pending')}</div>}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div>{item?.openPrice || ''}</div>
                                                                                                        <small>{new Date(item?.createdAt)?.toLocaleString('en-GB') || '26/07/2025, 11:23:48'}</small>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div>{item?.closingData?.open || ''}</div>
                                                                                                        <small>{item?.closingDate ? new Date(item?.closingDate)?.toLocaleString('en-GB') : ''}</small>
                                                                                                    </td>
                                                                                                    <td>{item?.ipAddress || '-'}</td>
                                                                                                    {/* <td>
                                                                                                                    <img src="/assets/images/chart.png" alt="" style={{ width: "22px", height: "22px", cursor: 'pointer' }} onClick={() => {
                                                                                                                        setHistoryData(item)
                                                                                                                        setHistoryChart(!historyChart)
                                                                                                                    }} />
                                                                                                                </td> */}
                                                                                                </tr>
                                                                                            )}
                                                                                    </tbody>
                                                                                </Table>

                                                                            </div>
                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                <button className='btn btn-outline-secondary' onClick={handleTradePrev} disabled={currentTradePage === 1}>
                                                                                    {t('previous')}
                                                                                </button>
                                                                                <span className='text-white'> Page {currentTradePage} of {totalTradePages} </span>
                                                                                <button className='pagination-next-btn outline' onClick={handleTradeNext} disabled={currentTradePage === totalTradePages}>
                                                                                    {t('next')}
                                                                                </button>
                                                                            </div>

                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Tab.Container>
                                                    </Tab.Pane>

                                                    {/* Outer Tab 2 */}
                                                    <Tab.Pane eventKey="settings">
                                                        <Row className="login-section py-0">
                                                            <Col md={4} className="mb-3">
                                                                <div></div>
                                                            </Col>
                                                            <Col md={8} className="mb-3">
                                                                <Row className="justify-content-end">
                                                                    <Col md={5} className="mb-3">
                                                                        <Form.Group>
                                                                            <div className="custom-frm-bx">
                                                                                <input placeholder=" " onChange={(e) => setTradeFilter({ ...tradeFilter, date: e.target.value })} className="form-control" required="" max={new Date().toISOString().split('T')[0]} type="date" name="date" />
                                                                                <label>Date Range</label>
                                                                            </div>
                                                                        </Form.Group>

                                                                    </Col>
                                                                    {/* <Col md={5} className="mb-3">
                                                                                    <Form.Group>
                                                                                        <div className="custom-frm-bx"><select required="" name="currency" className="form-control">
                                                                                            <option value="INR">All</option>
                                                                                        </select>
                                                                                            <label>Status</label>
                                                                                        </div>
                                                                                    </Form.Group>

                                                                                </Col> */}
                                                                    <Col md={2} className="mb-3">
                                                                        <Form.Group>
                                                                            <div className="custom-frm-bx">
                                                                                {/* <select required="" name="currency" className="form-control" style={{ background: "" }}>
                                                                                            <option value="INR">Export</option>
                                                                                        </select> */}
                                                                                <CSVLink data={filterTrade} className="d-flex align-items-center justify-content-center form-control pt-2 text-center" filename={`transaction_${Date.now()}.csv`}>
                                                                                    Export</CSVLink>

                                                                            </div>
                                                                        </Form.Group>

                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={12}>
                                                                <div className="table-responsive">
                                                                    <Table className="plain-trade-table mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="text-start">Name</th>
                                                                                <th>Open time/Price</th>
                                                                                <th>Info</th>
                                                                                <th>Period</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {filterTrade?.length > 0 ?
                                                                                filterTrade?.map((item, key) =>
                                                                                    <tr key={key}>
                                                                                        <td className="text-start">
                                                                                            <div className="d-flex align-items-start gap-2">
                                                                                                {/* <img src="/assets/images/trade-tab.png" alt="" style={{ width: 20, height: 20 }} /> */}
                                                                                                <div>
                                                                                                    <div>{item?.tradePair?.startsWith('OTC') ? item?.tradePair?.slice(3) : item?.tradePair}</div>
                                                                                                    <small className="text-muted">{item?._id}</small>
                                                                                                    <div><small className="text-muted">Open time: {new Date(item?.createdAt).toLocaleString('en-GB')}</small></div>

                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>{item?.openPrice || '1282.06'}
                                                                                            <div><small className="text-muted">{item?.endTime}</small></div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div>Trade amount: <span className="text-danger">{item?.currency?.toUpperCase()}</span></div>
                                                                                            <div>Profit: <span className="text-success">{item?.currency?.toUpperCase()}</span></div>
                                                                                            <div className="text-muted"><small>Closing quote</small></div>
                                                                                        </td>

                                                                                        <td>{formatSecondsToHHMMSS(item?.time || 0)}</td>
                                                                                    </tr>
                                                                                ) :
                                                                                <div className="mb-2">No Pending Trades</div>}
                                                                        </tbody>
                                                                    </Table>

                                                                </div>
                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                    <button className='btn btn-outline-secondary' onClick={handleTradePrev} disabled={currentTradePage === 1}>
                                                                        {t('previous')}
                                                                    </button>
                                                                    <span className='text-white'> Page {currentTradePage} of {totalTradePages} </span>
                                                                    <button className='pagination-next-btn outline' onClick={handleTradeNext} disabled={currentTradePage === totalTradePages}>
                                                                        {t('next')}
                                                                    </button>
                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Tab.Container>
                                        </Tab.Pane>


                                        <Tab.Pane eventKey="account" active={key === "account"}>
                                            <h6 className="fw-bold mb-3 left-side-boder">{t('account')}</h6>
                                            <Row className="align-items-center text-white rounded  account-tab-section">
                                                <Col xs={12} md={12} className="">
                                                    <div className="user-profile-btn d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center justify-content-between gap-3 position-relative">
                                                            {userForm?.previewPhoto ?
                                                                <img
                                                                    src={userForm?.previewPhoto}
                                                                    alt="profile"
                                                                />
                                                                :
                                                                <img
                                                                    src={
                                                                        userForm?.photo
                                                                            ? userForm.photo.startsWith('http')
                                                                                ? userForm.photo
                                                                                : `${base_url}/${userForm.photo}`
                                                                            : "/assets/images/wallet-user.png"
                                                                    }
                                                                    alt="profile"
                                                                />
                                                            }

                                                            {/* 🖊 Pencil Icon */}
                                                            <img
                                                                src="./assets/images/pencilIcon.png"
                                                                alt="Edit"
                                                                className="pencil-img"
                                                                onClick={handlePencilClick}
                                                                style={{ cursor: 'pointer' }}
                                                            />

                                                            {/* 🔒 Hidden File Input */}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                ref={fileInputRef}
                                                                onChange={handleImageChange}
                                                                style={{ display: 'none' }}
                                                            />

                                                            <div className="account-tab-user-details ">
                                                                <div className="fw-semibold">
                                                                    <h4>{userData?.email || 'sunildivanextechnologies@gmail.com'}</h4>
                                                                </div>
                                                                <div className="text-muted small">
                                                                    <h5><span>ID :</span> #{userData?.customId || '63507268'}</h5>
                                                                </div>
                                                                {userData?.isKycVerify && <span className="badge bg-success mt-1">✔ Verified</span>}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Button variant="danger" className="me-2" onClick={handleDelete} >
                                                                <FontAwesomeIcon icon={faTrash} /> {t('deleteAccount')}
                                                            </Button>
                                                            <Button variant="outline-danger" onClick={handleLogout}>{t('logout')}</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <form onSubmit={handleProfileSubmit}>
                                                <Row className="mt-3 login-section py-0">
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" className="form-control" name="nickName" onChange={handleProfileChange} value={userForm?.nickName} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('nickName')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" className="form-control" name="lastName" onChange={handleProfileChange} value={userForm?.lastName} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('lastName')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="number" className="form-control" name="phone" onChange={handleProfileChange} value={userForm?.phone} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('mobile')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="dob"
                                                                    onChange={handleProfileChange}
                                                                    value={userForm?.dob ? new Date(userForm.dob).toISOString().split('T')[0] : ''}
                                                                    id="dob"
                                                                    max={new Date().toLocaleDateString('en-CA')}
                                                                    placeholder=" "
                                                                    required
                                                                />

                                                                <label htmlFor="cpass">{t('dob')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="number" className="form-control" name="aadhar" onChange={handleProfileChange} value={userForm?.aadhar} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('aadhar')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="email" className="form-control" name="email" onChange={handleProfileChange} value={userForm?.email} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t("email")}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                {/* <input type="text" className="form-control" name="country" onChange={handleProfileChange} value={userForm?.country} id="cpass" placeholder=" " required /> */}
                                                                <select
                                                                    className="form-control"
                                                                    id="language"
                                                                    name="country"
                                                                    onChange={handleProfileChange} value={userForm?.country}
                                                                    required
                                                                >
                                                                    <option value="">{t('select')} {t('country')}</option>
                                                                    <option value="usa">USA</option>
                                                                    <option value="ind">IND</option>
                                                                </select>
                                                                <label htmlFor="cpass">{t('country')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" className="form-control" name="address" onChange={handleProfileChange} value={userForm?.address} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">{t('address')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="text" className="form-control" name="address" value={myRefferals} id="cpass" placeholder=" " required />
                                                                <label htmlFor="cpass">My Refferals</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={12}>
                                                        <div className="d-flex justify-content-end">
                                                            <button type="submit" className="signIn-btn  btn btn-primary">{t("save")} </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </form>


                                            {/* <Row>
                                                            <h6 className="fw-bold mb-3 left-side-boder">Documents verification</h6>
                                                            <Col md={6} col={6} sm={12}>
                                                                <div className="make-deposit-bx ">
                                                                    <FontAwesomeIcon icon={faInfo} className="make-info-icon " />
                                                                    <div className="make-deposit-details">
                                                                        <p>
                                                                            You need fill identity information before verification your profile.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row> */}
                                            <form onSubmit={updateUserKyc} className="login-section py-0">
                                                <h6 className="fw-bold mb-3 left-side-boder">{t('documentVerification')}</h6>
                                                {(!userKyc || userKyc?.status == 'reject') &&
                                                    <Row className="mt-3 login-section py-0">
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3">
                                                                <div className="upload-area2 text-start">
                                                                    <input
                                                                        type="file"
                                                                        required
                                                                        id="uploadKycFile"
                                                                        hidden
                                                                        accept=".jpg,.jpeg,.png"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0]; // <-- Single file
                                                                            if (file) {
                                                                                setFileName(file.name); // assuming setFileName is defined in state
                                                                                const updatedForm = { ...kycForm, document: file }; // store single file, not FileList
                                                                                setKycForm(updatedForm);
                                                                            }
                                                                        }}
                                                                    />


                                                                    {/* Show "Choose File" only if fileName is empty */}
                                                                    {!fileName && (
                                                                        <label htmlFor="uploadKycFile" className="file-label">
                                                                            Choose File
                                                                        </label>
                                                                    )}

                                                                    {/* Show file name if selected */}
                                                                    {fileName && (
                                                                        <label htmlFor="uploadKycFile" className="file-label">

                                                                            {fileName}
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3">
                                                                <div className="custom-frm-bx">
                                                                    <select
                                                                        className="form-control"
                                                                        id="type"
                                                                        name="type"
                                                                        value={kycForm?.type}
                                                                        onChange={(e) => {
                                                                            const updatedForm = { ...kycForm, type: e.target.value };
                                                                            setKycForm(updatedForm);
                                                                        }}
                                                                        required
                                                                    >
                                                                        <option value="">Select Type</option>
                                                                        <option value="aadhar">Aadhar</option>
                                                                        <option value="pan">Pan</option>
                                                                    </select>
                                                                    <label htmlFor="type">Type</label>
                                                                </div>

                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="d-flex justify-content-end">
                                                                <button type="submit" className="signIn-btn  btn btn-primary">{t('save')} </button>
                                                            </div>
                                                        </Col>
                                                    </Row>}
                                                {userKyc && userKyc?.status !== 'reject' &&
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={userKyc?.status}
                                                                    className="form-control text-white text-capitalize"
                                                                />
                                                                <label>{t('status')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>}
                                            </form>

                                            <Row className="mt-3">
                                                <h6 className="fw-bold mb-3 left-side-boder">{t('settings')}</h6>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CheckCircle className="text-success" size={20} />
                                                        <div>
                                                            <p className="fw-semibold mb-0 text-white">{t('twoFa')}</p>
                                                            <small className="text-secondary">{t('receiveCodeViaEmail')} <a href="#" className="edit-account-btn"><FontAwesomeIcon icon={faPen} /></a></small>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="form-check form-switch m-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="enterPlatformSwitch"
                                                                checked={settingForm?.enterToPlatform}
                                                                onChange={(e) => {
                                                                    const updatedForm = { ...settingForm, enterToPlatform: e.target.checked };
                                                                    setSettingForm(updatedForm);
                                                                    updateSetting(updatedForm);
                                                                }}

                                                            />
                                                        </div>
                                                        <label htmlhtmlFor="enterPlatformSwitch" className="form-check-label small text-white mb-0">
                                                            {t('toEnterToPlatform')}
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="form-check form-switch m-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="withdrawFundsSwitch"
                                                                checked={settingForm?.withdrawFund}
                                                                onChange={(e) => {
                                                                    const updatedForm = { ...settingForm, withdrawFund: e.target.checked };
                                                                    setSettingForm(updatedForm);
                                                                    updateSetting(updatedForm); // Pass the latest state
                                                                }}

                                                            />
                                                        </div>
                                                        <label htmlhtmlFor="withdrawFundsSwitch" className="form-check-label small text-white mb-0">
                                                            {t('toWithdrawFunds')}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <form onSubmit={handlePasswordSubmit}>
                                                <Row className="mt-3 login-section py-0">
                                                    <h6 className="fw-bold mb-3 left-side-boder">{t('security')}</h6>

                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="password" className="form-control" name="oldPassword" id="cpass" value={passwordForm?.oldPassword} onChange={handlePasswordChange} placeholder=" " required />
                                                                <label htmlFor="cpass">{t('oldPassword')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="password" className="form-control" name="newPassword" id="cpass" value={passwordForm?.newPassword} onChange={handlePasswordChange} placeholder=" " required />
                                                                <label htmlFor="cpass">{t('newPassword')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <input type="password" className="form-control" name="confirmPassword" id="cpass" value={passwordForm?.confirmPassword} onChange={handlePasswordChange} placeholder=" " required />
                                                                <label htmlFor="cpass">{t('confirmNewPassword')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col md={12}>
                                                        <div className="d-flex justify-content-end">
                                                            <button type="submit" className="signIn-btn  btn btn-primary">{t('changePassword')} </button>
                                                        </div>
                                                    </Col>


                                                </Row>
                                            </form>
                                            <form onSubmit={updateUserSetting}>
                                                <Row className="login-section ">
                                                    <h6 className="fw-bold mb-3 left-side-boder">{t('other')} {t('settings')}</h6>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">

                                                            <div className="custom-frm-bx">
                                                                <select
                                                                    className="form-control"
                                                                    id="language"
                                                                    name="language"
                                                                    value={settingForm?.language}
                                                                    onChange={(e) => {
                                                                        const updatedForm = { ...settingForm, language: e.target.value };
                                                                        setSettingForm(updatedForm);
                                                                    }}
                                                                    required
                                                                >
                                                                    <option value="">{t('select')} {t('language')}</option>
                                                                    <option value="english">English</option>
                                                                    <option value="hindi">Hindi</option>
                                                                </select>
                                                                <label htmlFor="language">{t('language')}</label>
                                                            </div>

                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                <select
                                                                    className="form-control"
                                                                    id="timezone"
                                                                    name="timeZone"
                                                                    value={settingForm?.timezone}
                                                                    onChange={(e) => {
                                                                        const updatedForm = { ...settingForm, timezone: e.target.value };
                                                                        setSettingForm(updatedForm);
                                                                    }}
                                                                    required
                                                                >
                                                                    <option value="">{t('select')} {t('chart')} {t('timezone')}</option>
                                                                    <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
                                                                    <option value="America/New_York">US (America/New_York)</option>
                                                                </select>
                                                                <label htmlFor="timezone">{t('chart')} {t('timezone')}</label>
                                                            </div>

                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group className="mb-3">
                                                            <div className="custom-frm-bx">
                                                                {/* <input type="text" className="form-control" name="country" onChange={handleProfileChange} value={userForm?.country} id="cpass" placeholder=" " required /> */}
                                                                <select
                                                                    className="form-control"
                                                                    id="language"
                                                                    name="currency"
                                                                    onChange={handleProfileChange} value={userForm?.currency}
                                                                    required
                                                                >
                                                                    <option value="">{t('select')} {t('currency')}</option>
                                                                    <option value="inr">INR</option>
                                                                    <option value="usd">USD</option>
                                                                </select>
                                                                <label htmlFor="cpass">{t('currency')}</label>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={12}>
                                                        <div className="d-flex justify-content-end pb-lg-0 pb-3">
                                                            <button type="submit" className="signIn-btn ">{t('save')} </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </form>

                                        </Tab.Pane>

                                        <Tab.Pane eventKey="market" active={key === "market"}>
                                            <h6 className="fw-bold mb-3 left-side-boder"> {t('market')}</h6>
                                            <div className="row pb-lg-0 pb-5">
                                                {allMarket?.length > 0 &&
                                                    allMarket.map((item, key) =>
                                                        <Col md={6} col={6} sm={12} key={key} className="mb-3" >
                                                            <div className="market-cards">
                                                                <div>
                                                                    <div className="market-main-card d-flex align-items-center justify-content-between">
                                                                        <div className="market-tp-logo">
                                                                            <img src={item?.photo ? `${base_url}/${item?.photo}` : "/assets/images/markets.png"} alt="" />
                                                                            <div className="market-tp-content">
                                                                                <h4>{siteLang == 'en' ? item?.name : item?.hindiName} </h4>
                                                                                <p>{item?.promoCode?.length || 0} promo codes available</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tooltip-container">
                                                                            <FontAwesomeIcon
                                                                                icon={faCircleInfo}
                                                                                className="info-icon circle-info-icon"
                                                                                onMouseEnter={() => setShowTab(item?._id)}
                                                                                onMouseLeave={() => setShowTab(null)}
                                                                            />
                                                                            {item?._id === showTab && (
                                                                                <div className="tooltip-box">
                                                                                    <div className="tooltip-arrow"></div>
                                                                                    <p>
                                                                                        {siteLang == 'en' ? item?.description : item?.hindiDescription}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="market-status-bx">
                                                                    <table className="w-100">
                                                                        <tr className="">
                                                                            <th><p>{t('promoCode')}</p> </th>
                                                                            <th><p>{t('status')}</p> </th>
                                                                            <th><p>{t('prize')}</p></th>
                                                                        </tr>
                                                                        {/* <p>Promo code</p>
                                                                                    <p>Status</p>
                                                                                    <p>Prize</p> */}
                                                                        {/* </div> */}

                                                                        {/* <div className="market-middle-box">
                                                                                <div className="market-middle-content"> */}
                                                                        {
                                                                            claimMarket?.filter(c => c.marketId === item._id).length > 0 &&
                                                                            claimMarket.filter(c => c.marketId === item._id).slice(0, 3).map((claim, index) => (
                                                                                <tr key={index}>
                                                                                    <td><p>{claim.code}</p></td>
                                                                                    <td><p>{claim.status}</p></td>
                                                                                    <td><p>{claim.amount} USD</p></td>
                                                                                </tr>
                                                                            ))

                                                                        }
                                                                        {/* </div>
                                                                        </div> */}
                                                                    </table>
                                                                </div>
                                                                {claimMarket?.filter(c => c.marketId === item._id).length == 0 &&
                                                                    <div className="text-center">
                                                                        <img src="/assets/images/m-market.png" alt="" />
                                                                        <p className="text-white fw-400">{t('noPromoHistory')}</p>
                                                                    </div>}


                                                                {claimMarket?.filter(c => c.marketId === item._id).length == 0 && <div className="login-section py-2 market-middle-btm ">
                                                                    <div>
                                                                        <button type="button" className="market-clock-shw"><FontAwesomeIcon icon={faClock} />{t('viewAllHistory')}</button>
                                                                    </div>
                                                                    <div>
                                                                        <button type="button" className="signIn-btn" onClick={() => setMarketCode({ ...marketCode, marketId: item._id, name: item?.name })}
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#marketModal">{t('enterMarketCode')}</button>
                                                                    </div>
                                                                </div>}
                                                            </div>
                                                        </Col>)}

                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="auto" active={key === "auto"}>

                                            <Tab.Container activeKey={outerKey} onSelect={(k) => setOuterKey(k)}>
                                                <Tab.Content>
                                                    <Tab.Container
                                                        activeKey={innerKey}
                                                        onSelect={(k) => setInnerKey(k)}
                                                    >
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey="trade-history">
                                                                <Row className="login-section py-0">
                                                                    <Col md={4} className="mb-3">
                                                                        <div></div>

                                                                    </Col>
                                                                    <Col md={8} className="mb-3">
                                                                        <Row>
                                                                            <Col md={5} className="mb-3">
                                                                                <Form.Group>
                                                                                    <div className="custom-frm-bx">
                                                                                        <input placeholder=" " onChange={(e) => setOrderFilter({ ...orderFilter, date: e.target.value })} className="form-control" required="" max={new Date().toISOString().split('T')[0]} type="date" name="date" />
                                                                                        <label>{t('dateRange')}</label>
                                                                                    </div>
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col md={5} className="mb-3">
                                                                                <Form.Group>
                                                                                    <div className="custom-frm-bx"><select required="" name="status" onChange={(e) => setOrderFilter({ ...orderFilter, status: e.target.value })} className="form-control">
                                                                                        <option value="">{t('all')}</option>
                                                                                        <option value="closed">{t('closed')}</option>
                                                                                        <option value="active">{t('active')}</option>
                                                                                    </select>
                                                                                        <label>{t('status')}</label>
                                                                                    </div>
                                                                                </Form.Group>

                                                                            </Col>
                                                                            <Col md={2} className="mb-3">
                                                                                <Form.Group>
                                                                                    <div className="custom-frm-bx">
                                                                                        {/* <select required="" name="currency" className="form-control" style={{ background: "" }}>
                                                                                                        <option value="INR">Export</option>
                                                                                                    </select> */}
                                                                                        <CSVLink data={formateOrderData} className="d-flex align-items-center justify-content-center form-control pt-2 text-center" filename={`order_${Date.now()}.csv`}>
                                                                                            {t('export')}</CSVLink>

                                                                                    </div>
                                                                                </Form.Group>

                                                                            </Col>
                                                                        </Row>

                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <div className="table-responsive">
                                                                            <Table className="mb-0 plain-table">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th className="text-start">{t('name')}</th>
                                                                                        <th>{t('info')}</th>
                                                                                        <th>{t('openingQuote')}</th>
                                                                                        <th>{t('closingQuote')}</th>
                                                                                        <th>{t('insteadOfIp')}</th>
                                                                                        {/* <th>{t('chart')}</th> */}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {filterOrder?.length > 0 &&
                                                                                        filterOrder?.map((item, key) =>
                                                                                            <tr key={key}>
                                                                                                <td className="text-start ">
                                                                                                    {/* <img src="/assets/images/trade-tab.png" alt="American Express" className="me-2" style={{ width: "22px", height: "22px" }} /> */}
                                                                                                    <span>{item?.tradePair?.startsWith('OTC') ? item?.tradePair?.slice(3) : item?.tradePair}</span>
                                                                                                    <p>{item?.customId || item?._id}</p>
                                                                                                </td>
                                                                                                <td>
                                                                                                    {/* <div>85%</div> */}
                                                                                                    <div>{t('amount')}: {item?.amount}</div>
                                                                                                    {item?.profit > 0 &&
                                                                                                        <div className="text-success">{t('profit')}: {item?.profit} {item?.currency?.toUpperCase()}</div>}
                                                                                                    {item?.profit == 0 &&
                                                                                                        <div className="text-danger">{t('loss')}: {item?.amount} {item?.currency?.toUpperCase()}</div>}
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div>{item?.openPrice || ''}</div>
                                                                                                    <small>{new Date(item?.createdAt)?.toLocaleString('en-GB') || '26/07/2025, 11:23:48'}</small>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div>{item?.closingData?.open || ''}</div>
                                                                                                    <small>{item?.closingDate ? new Date(item?.closingDate)?.toLocaleString('en-GB') : ''}</small>
                                                                                                </td>
                                                                                                <td>{item?.ipAddress || '-'}</td>
                                                                                                {/* <td>
                                                                                                                <img src="/assets/images/chart.png" alt="" style={{ width: "22px", height: "22px" }} />
                                                                                                            </td> */}
                                                                                            </tr>
                                                                                        )}
                                                                                </tbody>
                                                                            </Table>
                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                <button className='btn btn-outline-secondary' onClick={handleOrderPrev} disabled={currentOrderPage === 1}>
                                                                                    {t('previous')}
                                                                                </button>
                                                                                <span className='text-white'> Page {currentOrderPage} of {totalOrderPages} </span>
                                                                                <button className='pagination-next-btn outline' onClick={handleOrderNext} disabled={currentOrderPage === totalOrderPages}>
                                                                                    {t('next')}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Tab.Pane>
                                                        </Tab.Content>
                                                    </Tab.Container>
                                                </Tab.Content>
                                            </Tab.Container>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <EnterCode />
            {/* <Wallet show={show} handleClose={handleClose} /> */}
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
                                        {t('chooseBonus')}
                                    </h5>

                                </div>
                                <button
                                    type="button"
                                    className=" ms-auto text-white"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                            <div className="modal-body login-section py-0">
                                {allPromo?.length > 0 &&
                                    allPromo?.map((item, key) =>
                                        <div className="modal-coupan-bx" key={key}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h5 className="mb-0"><FontAwesomeIcon icon={faGift} />{item?.bonusPercentage}% bonus</h5>
                                                    <h6 className="mb-0">USD {item?.bonusPercentage}</h6>
                                                    <p className="mb-0">{t('ifYouDeposit')} USD 100</p>

                                                </div>
                                                <div>
                                                    <button type="button" onClick={() => setDepositForm({ ...depositForm, promoCode: item?.name })}
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close" className="signIn-btn">{t('apply')}</button>
                                                </div>
                                            </div>
                                        </div>)}

                            </div>

                            <div className="modal-footer modal-coupan-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="marketModal"
                tabIndex="-1"
                aria-labelledby="addSalesModalLabels"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content modal-coupan-content">
                        <div className="modal-header modal-coupan-header">
                            <div>
                                <h5 className="modal-title title-heading" id="addSalesModalLabels">
                                    <FontAwesomeIcon icon={faGift} style={{ color: "#FF7A00" }} /> {marketCode?.name}
                                </h5>
                            </div>
                            <button
                                type="button"
                                className=" ms-auto text-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                        <div className="modal-body login-section py-0">
                            <div className="modal-coupan-bx">
                                <div className="">
                                    <p className="mb-0 text-center">{t('enterMarketHeading')}</p>
                                </div>
                            </div>
                            <div>
                                <Form.Group className="mt-3">
                                    <div className="custom-frm-bx">
                                        <input type="text" className="form-control" value={marketCode?.code} onChange={(e) => setMarketCode({ ...marketCode, code: e.target.value })} id="cpass" placeholder=" " required />
                                        <label for="cpass">{t('promoCode')}</label>
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="d-flex gap-4">
                                <button type="button" className="modal-active-btn" onClick={marketSubmit} data-bs-dismiss="modal" >{t('yesActivate')}</button>
                                <button type="button" className="modal-active-btn modal-cancel-btn" data-bs-dismiss="modal">{t('cancel')}</button>
                            </div>
                        </div>
                        <div className="modal-footer modal-coupan-footer">

                        </div>
                    </div>
                </div>
            </div>
            {showWithdrawModal &&
                <div className="modal show d-block fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="otpModalLabel">Verification Code</h5>
                                <button type="button" className="btn-close" onClick={() => setShowWithdrawModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                                            <div className="login-card p-4 w-100">
                                                <form onSubmit={handleVerify} className="d-flex flex-column">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        {otp.map((digit, index) => (
                                                            <div className="custom-frm-bx mt-3" key={index}>
                                                                <input
                                                                    type="text"
                                                                    maxLength="1"
                                                                    value={digit}
                                                                    onPaste={handlePaste}
                                                                    onChange={(e) => handleOtpChange(e.target, index)}
                                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                                    ref={(el) => (inputsRef.current[index] = el)}
                                                                    className="form-control text-center p-0"
                                                                    style={{ width: '50px', fontSize: '18px' }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={resendCode}
                                                            disabled={isDisabled}
                                                            className="float-end forgot-pass btn btn-link"
                                                        >
                                                            {isDisabled ? `Resend in ${timer}` : 'Resend'}
                                                        </button>
                                                    </div>

                                                    <div className="d-flex justify-content-center">
                                                        <button type="submit" className="btn signIn-btn mt-3">
                                                            Verify <i className="fas fa-arrow-right" />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>}
            {historyChart && (

                <TradeHistoryChart tradeData={historyData} handleClose={historyClose} />

            )
            }
        </>
    )
}

export default Deposit