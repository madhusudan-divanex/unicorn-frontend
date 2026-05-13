import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getApiData, postApiData } from '../services/api';
import { login } from '../redux/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { base_url } from '../baseUrl';
import { useTranslation } from 'react-i18next';
import Loader from '../components/frontend/Loader';

function AffiliateLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { defaultLang } = useSelector((state) => state.wallet);
    const [timer, setTimer] = useState(0); // countdown in seconds
    const [isDisabled, setIsDisabled] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [codeRequire, setCodeRequire] = useState(false)
    const [isPassword, setIsPassword] = useState(false)
    const [isRemember, setIsRemember] = useState(false)
    const [userId, setUserId] = useState()
    const [token, setToken] = useState()
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading,setLoading]=useState(false)
    const newErrors = {};
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    useEffect(() => {
        const rowData = localStorage.getItem('loginData')
        if (rowData) {
            const data = JSON.parse(rowData)
            setIsRemember(true)
            setLoginData({ email: data.email, password: data.password })
        }
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ipAddress = ipData.ip;

        // 2. Attach IP address to login data
        const loginPayload = {
            ...loginData,
            ipAddress
        };
        try {
            const result = await postApiData('login-user', loginPayload);
            if (result.success) {
                setUserId(result.userId)
                setToken(result.token)
                if (isRemember) {
                    localStorage.setItem('loginData', JSON.stringify(loginData))
                }
                setLoginData({ email: "", password: "" })
                if (result.codeRequire) {
                    navigate(`/two-factor/${result.userId}?account=affiliate`)                   
                    return
                }
                else {
                    // toast.success(result.message);
                    localStorage.setItem("token", JSON.stringify(result.token));
                    localStorage.setItem("userId", JSON.stringify(result.userId));
                    dispatch(login(result.userId));
                    navigate(`/affiliate/dashboard`)
                }
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (error) {
            toast.error("Something went wrong",error.message);
        } finally{
            setLoading(false)
        }
    };
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
    const handleVerify = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        const data = { code: finalOtp, userId }
        try {
            const result = await postApiData('verify-code', data);
            if (result.success) {
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("userId", JSON.stringify(userId));
                dispatch(login(result.userId));
                navigate('/trade')
            } else {
                toast.error(result.message || "Login failed");
                setCodeRequire(false)
            }
        } catch (error) {
           toast.error("Something went wrong",error.message);
        }
    };
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer]);


  
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (defaultLang) {
            changeLanguage(defaultLang);
        }
    }, [defaultLang]);
    return (
        <div>
            {loading?<Loader/>
            :

            <>

   <section className="about-section py-0 all-hm-banner" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7  col-sm-12 ">
              <div className='contact-content text-center' >
                <h2>{t('signToAffAccount')}</h2>
              </div>
            </div>
          </div>
        </div>
    </section>

    <section className='contact-us-sec'>
        <div className="container">
            <div className="row justify-content-center">
                <div className='col-lg-6'>
                <div className='unicorn-main-form'>
                         <form onSubmit={handleSubmit}>
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="login-email">{t('Email Address*')}</label>
                                                    <input
                                                        type="email"
                                                        className="form-control new-form-control"
                                                        id="login-email"
                                                        placeholder="Enter your email address "
                                                        required
                                                        name="email"
                                                        value={loginData.email}
                                                        onChange={handleChange}
                                                    />
                                                    
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="login-password">{t('Password *')}</label>
                                                    <input
                                                        type={isPassword ? "text" : "password"}
                                                        className="form-control new-form-control"
                                                        id="login-password"
                                                        placeholder="Enter your password"
                                                        required
                                                        name="password"
                                                        value={loginData.password}
                                                        onChange={handleChange}
                                                    />
                                                    
                                                    <div className='pass-toggle-box'>
                                                        {isPassword ? <i className="fas fa-eye-slash" onClick={() => setIsPassword(!isPassword)} /> :
                                                        <i className="fas fa-eye" onClick={() => setIsPassword(!isPassword)} />}
                                                    </div>
                                                </div>

                                                {/* <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        name='isRemember'
                                                        checked={isRemember}
                                                        onChange={(e) => setIsRemember(e.target.checked)}
                                                        className="form-check-input"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label" htmlFor="rememberMe">
                                                        {t('rememberMe')}
                                                    </label>
                                                    <Link to="/password-recovery" className="float-end forgot-pass">
                                                        {t('forgotPassword')}
                                                    </Link>
                                                </div> */}

                                                <div className="d-flex justify-content-center">
                                                    <button type="submit" className="thm-btn mt-3">
                                                        {t('signIn')}
                                                    </button>
                                                </div>
                                              
                        </form>

                 </div>
                </div>
            </div>
        </div>

    </section>
            
           
            
            {/* <section className="login-section">
               <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                                <div className="login-card p-4">
                                    <ul className="nav nav-tabs mb-3" id="tabMenu" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <Link
                                                className="nav-link active text-center"
                                                id="login-tab"
                                                type="button"
                                                to='/affiliate/login'
                                            >
                                                {t('login')}
                                            </Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link
                                                className="nav-link text-center"
                                                id="register-tab"
                                                to='/affiliate/register'
                                                type="button"
                                            >
                                                {t('register')}
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="login"
                                            role="tabpanel"
                                        >
                                            <form onSubmit={handleSubmit}>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="login-email"
                                                        placeholder=" "
                                                        required
                                                        name="email"
                                                        value={loginData.email}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="login-email">{t('email')}</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type={isPassword ? "text" : "password"}
                                                        className="form-control"
                                                        id="login-password"
                                                        placeholder=" "
                                                        required
                                                        name="password"
                                                        value={loginData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="login-password">{t('password')}</label>
                                                    {isPassword ? <i className="fas fa-eye-slash" onClick={() => setIsPassword(!isPassword)} /> :
                                                        <i className="fas fa-eye" onClick={() => setIsPassword(!isPassword)} />}
                                                </div>
                                                <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        name='isRemember'
                                                        checked={isRemember}
                                                        onChange={(e) => setIsRemember(e.target.checked)}
                                                        className="form-check-input"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label" htmlFor="rememberMe">
                                                        {t('rememberMe')}
                                                    </label>
                                                    <Link to="/password-recovery" className="float-end forgot-pass">
                                                        {t('forgotPassword')}
                                                    </Link>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <button type="submit" className="thm-btn mt-3">
                                                        {t('signIn')} <i className="fas fa-arrow-right" />
                                                    </button>
                                                </div>
                                              
                                            </form>
                                        </div>

                                        <div className="tab-pane fade" id="register" role="tabpanel">
                                            <div className="">
                                                <div className="custom-frm-bx">
                                                    <select required="" className="form-control">
                                                        <option value="IN">India</option>
                                                        <option value="US">USA</option>
                                                    </select>
                                                    <label>Country / Region of residence</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <select required="" className="form-control">
                                                        <option value="INR">INR</option>
                                                        <option value="USD">USD</option>
                                                    </select>
                                                    <label>Currency</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        placeholder=" "
                                                        required=""
                                                    />
                                                    <label htmlFor="email">Email</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="num"
                                                        placeholder=" "
                                                        required=""
                                                    />
                                                    <label htmlFor="num">Phone Number</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type="date"
                                                        placeholder=" "
                                                        className="form-control"
                                                        required=""
                                                    />
                                                    <label>Date of Birth</label>
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="cpass"
                                                        placeholder=" "
                                                        required=""
                                                    />
                                                    <label htmlFor="cpass">Password</label>
                                                    <i className="fas fa-eye-slash" />
                                                </div>
                                                <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="remember-con"
                                                    />
                                                    <label className="form-check-label" htmlFor="remember-con">
                                                        I confirm that I am 18 years old or older and accept{" "}
                                                        <a href="javascript:void(0)" className="srvice-link">
                                                            Service Agreement
                                                        </a>
                                                    </label>
                                                </div>
                                                <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="remember-dec"
                                                    />
                                                    <label className="form-check-label" htmlFor="remember-dec">
                                                        I declare and confirm that I am not a citizen or resident of
                                                        the US for tax purposes
                                                    </label>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <a href="javascript:void(0)" className="btn signIn-btn mt-3">
                                                        Registration <i className="fas fa-arrow-right" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </section> */}

             </>
            
            }

        </div>
    )
}

export default AffiliateLogin
