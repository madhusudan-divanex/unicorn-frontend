import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getApiData, postApiData } from '../../services/api';
import { login } from '../../redux/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { base_url } from '../../baseUrl';
import { useTranslation } from 'react-i18next';
import Loader from '../frontend/Loader';
import AOS from "aos";
import "aos/dist/aos.css";
import { saveFcmToken } from '../../services/globalFunction';

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { defaultLang } = useSelector((state) => state.wallet);
    const [timer, setTimer] = useState(0); // countdown in seconds
    const [isDisabled, setIsDisabled] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [codeRequire, setCodeRequire] = useState(false)
    const [isPassword, setIsPassword] = useState(false)
    const [isRemember, setIsRemember] = useState(false)
    const { userData } = useSelector((state) => state.user);
    const [userId, setUserId] = useState()
    const [token, setToken] = useState()
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
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
                    navigate(`/two-factor/${result.userId}`)
                    return
                }
                else {
                    // toast.success(result.message);
                    localStorage.setItem("token", JSON.stringify(result.token));
                    localStorage.setItem("userId", JSON.stringify(result.userId));
                    dispatch(login(result.userId));
                    await saveFcmToken()
                    navigate(`/trade`)
                }
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false)
        }
    };
    const inputsRef = useRef([]);

 
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

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
        });
    }, []);
   const {isLogin}=useSelector(state=>state.auth)
       useEffect(()=>{
           if(isLogin){
               navigate('/trade')
           }
       },[isLogin])
    return (
        <div>
            {loading ? <Loader />
                :

                <>

                    <section className="about-section all-hm-banner" data-aos="fade-up">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-7  col-sm-12 ">
                                    <div className='contact-content text-center' >
                                        <h2>{t('Sign In to Your Account')}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='contact-us-sec'>
                        <div className="container">
                            {/* <div className='unicorn-mb-bx'>
                <p className='grow-first-title'><span className='grow-title'>{t('Sign In')}</span></p>
              </div> */}

                            <div className='row justify-content-center'>
                                <div className='col-lg-6'>
                                    <div className='unicorn-main-form'>
                                        <form onSubmit={handleSubmit}>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="login-email">{t('Email Address*')}</label>
                                                <input
                                                    type="email"
                                                    className="form-control new-form-control"
                                                    id="login-email"
                                                    placeholder="Enter your email address"
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



                                            <div className='login-section py-0'>
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
                                            </div>

                                            <div className="mt-3 text-center">
                                                <button type="submit" className="thm-btn ">
                                                    {t('signIn')}
                                                </button>
                                            </div>

                                            {/* <div className='my-3 text-white text-center'>
                                                    Charts are powered by <a target='_blank' href='https://www.tradingview.com/' className='trade-view-btn'>TradingView</a>
                                                </div> */}

                                            <div className='login-section py-0'>
                                                <div className=" text-center text-white mt-3 sing-in-with">
                                                    <h5>{t('signWith')}</h5>
                                                </div>

                                            </div>

                                            <div className="text-center mt-3 login-section py-0">
                                                <a href={`${base_url}/auth/google`} target='_blank' className="social-btn google">
                                                    <i className="fab fa-google" />
                                                </a>
                                            </div>



                                        </form>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>



                    {/* <section className="login-section">
               <div className="container">
                        <h2>{t('signToAccount')}</h2>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                                <div className="login-card p-4">
                                    <ul className="nav nav-tabs mb-3" id="tabMenu" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <Link
                                                className="nav-link active text-center"
                                                id="login-tab"
                                               
                                                type="button"
                                              

                                                to='/login'
                                            >
                                                {t('login')}
                                            </Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link
                                                className="nav-link text-center"
                                                id="register-tab"
                                                to='/register'
                                               
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
                                                <div className='my-3 text-white text-center'>
                                                    Charts are powered by <a target='_blank' href='https://www.tradingview.com/' className='trade-view-btn'>TradingView</a>
                                                </div>
                                                <div className=" text-center text-white mt-3 sing-in-with">
                                                    <h5>{t('signWith')}</h5>
                                                </div>
                                                <div className="text-center mt-2">
                                                   
                                                    <a href={`${base_url}/auth/google`} target='_blank' className="social-btn google">
                                                        <i className="fab fa-google" />
                                                    </a>
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

                                                <div className=" text-center text-white mt-3 sing-in-with">
                                                    <h5>Sign in with</h5>
                                                </div>
                                                <div className="text-center mt-2">
                                                  
                                                    <a href={`${base_url}/auth/google`} target="_blank" rel="noopener noreferrer" className="social-btn google">
                                                        <i className="fab fa-google" />
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

export default Login
