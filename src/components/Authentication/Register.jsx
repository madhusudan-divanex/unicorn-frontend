import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { base_url } from '../../baseUrl';
import { postApiData } from '../../services/api';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Loader from '../frontend/Loader';

function Register() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [isPassword, setIsPassword] = useState(false)
    const { defaultLang } = useSelector((state) => state.wallet);
    const { userData } = useSelector((state) => state.user);
    const [searchParams] = useSearchParams()
    const referedBy = searchParams.get('invite')
    const [checkData, setCheckData] = useState({ isAdult: false, isCitizen: false })
    const [registerData, setRegisterData] = useState({ email: "", password: "", phone: undefined, country: 'ind', currency: 'inr', dob: undefined, referedBy });
    const [errors, setErrors] = useState({});
    const newErrors = {};
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setLoading(true)
        if (referedBy) {
            registerData.referedBy = referedBy
        }
        try {
            const result = await postApiData('register-user', registerData);
            if (result.success) {
                toast.success(result.message);
                setRegisterData({ email: "", password: "", phone: undefined, country: 'ind', currency: 'inr', dob: undefined })
                navigate(`/two-factor/${result.user._id}`)
            } else {
                toast.error(result.message || "Register failed");
            }
        } catch (error) {
            toast.error("Something went wrong",error.message);
        } finally{
            setLoading(false)
        }
    };
    const validate = () => {
        const newErrors = {};
        if (!registerData.email) newErrors.email = "Email is required";
        if (!registerData.password) newErrors.password = "Password is required";
        if (!registerData.phone) newErrors.phone = "Phone number is required";
        if (!registerData.dob) newErrors.dob = "Date of birth is required";
        if (!checkData.isAdult) newErrors.isAdult = "Must be an adult";
        if (!checkData.isCitizen) newErrors.isCitizen = "Resident of the US for tax purposes is not allowed";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return false; // Validation failed
        }
        return true; // Validation passed
    };
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (defaultLang) {
            changeLanguage(defaultLang);
        }
    }, [defaultLang]);
    const {isLogin}=useSelector(state=>state.auth)
    useEffect(()=>{
        if(isLogin){
            navigate('/')
        }
    },[isLogin])
    return (
        <>
            {loading?<Loader/>
            :

            <>

        <section className="about-section all-hm-banner">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7  col-sm-12 ">
              <div className='contact-content text-center'>
                <h2>{t('Create Your Account')}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='contact-us-sec '>
        <div className="container">
             {/* <div className='unicorn-mb-bx'>
                <p className='grow-first-title'><span className='grow-title'>{t('Sign Up')}</span></p>
              </div> */}

               <div className='row justify-content-center'>
            <div className='col-lg-6'>
                <div className='unicorn-main-form'>
                    <form onSubmit={handleSubmit} className="">

                        <div className="custom-frm-bx">
                            <label htmlFor="email">Email Address*</label>
                                                <input
                                                    type="email"
                                                    className="form-control new-form-control"
                                                    id="email"
                                                    placeholder="Enter your email address"
                                                    required
                                                    name="email"
                                                    value={registerData.email}
                                                    onChange={handleChange}
                                                />
                                                
                                                {errors.email && <p className="text-danger">{errors.email}</p>}
                                            </div>

                                             <div className="custom-frm-bx">
                                                <label htmlFor="num">Phone Number *</label>
                                                <input
                                                    type="number"
                                                    className="form-control new-form-control"
                                                    id="num"
                                                    placeholder="Enter your phone"
                                                    required
                                                    name="phone"
                                                    value={registerData.phone}
                                                    onChange={handleChange}
                                                />
                                                
                                                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                            </div>

                                              <div className="custom-frm-bx">
                                                <label>Country</label>

                                                <select required
                                                    name="country"
                                                    value={registerData.country}
                                                    onChange={handleChange} className="form-control new-form-control">
                                                    <option value="ind">IND</option>
                                                    <option value="usa">USA</option>
                                                </select>
                                                {errors.country && <p className="text-danger">{errors.country}</p>}

                                            </div>

                                          
                                            <div className="custom-frm-bx">
                                                <label>Currency</label>
                                                <select required
                                                    name="currency"
                                                    value={registerData.currency}
                                                    onChange={handleChange} className="form-control new-form-control">
                                                    <option value="inr">INR</option>
                                                    <option value="usd">USD</option>
                                                </select>
                                                
                                                {errors.currency && <p className="text-danger">{errors.currency}</p>}

                                            </div>
                                            
                                           
                                            <div className="custom-frm-bx">
                                                <label>Date Of Birth *</label>
                                                <input
                                                    type="date"
                                                    placeholder=" "
                                                    className="form-control new-form-control"
                                                    required
                                                    max={new Date().toISOString().split('T')[0]}
                                                    name="dob"
                                                    value={registerData.dob}
                                                    onChange={handleChange}
                                                />
                                                
                                                {errors.dob && <p className="text-danger">{errors.dob}</p>}
                                            </div>

                                            <div className="custom-frm-bx">
                                                <label htmlFor="cpass">Password *</label>
                                                <input
                                                    type={isPassword ? "text" : "password"}
                                                    className="form-control new-form-control"
                                                    id="cpass"
                                                    placeholder=" "
                                                    required
                                                    name="password"
                                                    value={registerData.password}
                                                    onChange={handleChange}
                                                />
                                                
                                               <div className='pass-toggle-box'>
                                                 {isPassword ? <i className="fas fa-eye-slash" onClick={() => setIsPassword(!isPassword)} /> :
                                                    <i className="fas fa-eye" onClick={() => setIsPassword(!isPassword)} />}

                                               </div>
                                                {errors.password && <p className="text-danger">{errors.password}</p>}
                                            </div>

                                             <div className='login-section py-0'>
                                                <div className="mb-3 form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="remember-con"
                                                    checked={checkData.isAdult}
                                                    name='isAdult'
                                                    value={checkData.isAdult}
                                                    onChange={(e) => setCheckData({ ...checkData, isAdult: e.target.checked })}
                                                />
                                                <label className="form-check-label" htmlFor="remember-con">
                                                    {t("18Plus")}
                                                    <Link href="javascript:void(0)" className="srvice-link">
                                                        Service Agreement
                                                    </Link>
                                                </label>
                                                {errors.isAdult && <p className="text-danger">{errors.isAdult}</p>}
                                            </div>

                                            <div className="mb-3 form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={checkData.isCitizen}
                                                    name='isCitizen'
                                                    value={checkData.isCitizen}
                                                    onChange={(e) => setCheckData({ ...checkData, isCitizen: e.target.checked })}
                                                    id="remember-dec"
                                                />
                                                <label className="form-check-label" htmlFor="remember-dec">
                                                    {t("nonResident")}
                                                </label>
                                                {errors.isCitizen && <p className="text-danger">{errors.isCitizen}</p>}
                                            </div>
                                             </div>
                                          
                                            <div className="mt-3 text-center">
                                                <button
                                                    type='submit'
                                                    className="thm-btn "
                                                >
                                                    Sign Up 
                                                </button>
                                            </div>


                                            <div className='login-section py-0'>
                                                    {/* <div className='my-3 text-white text-center'>
                                                Charts are powered by <a target='_blank' href='https://www.tradingview.com/' className='trade-view-btn'>TradingView</a>
                                            </div> */}
                                            <div className="text-center text-white mt-3 sing-in-with">
                                                <h5>Sign in with</h5>
                                            </div>

                                            <div className="text-center mt-2">
                                              
                                                <a href={`${base_url}/auth/google`} target='_blank' className="social-btn google">
                                                    <i className="fab fa-google" />
                                                </a>
                                            </div>
                                            </div>
                                       
                                        </form>

                </div>

            </div>

        </div>

        </div>

       



      </section>



             {/* <section className="login-section">
                <div className="container">
                    <h2> {t('createAccount')}</h2>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                            <div className="login-card p-4">
                                <ul className="nav nav-tabs mb-3" id="tabMenu" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <Link
                                            className="nav-link text-center"
                                            id="login-tab"
                                            to='/login'
                                         
                                            type="button"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <Link
                                            className="nav-link active text-center"
                                            id="register-tab"
                                        
                                            type="button"
                                            to='/register'
                                        >
                                            Registration
                                        </Link>
                                    </li>
                                </ul>
                                <div className="tab-content" id="tabContent">
                                    <div className="tab-pane fade" id="login" role="tabpanel">
                                        
                                    </div>
                                    <div
                                        className="tab-pane fade show active"
                                        id="register"
                                        role="tabpanel"
                                    >
                                        <form onSubmit={handleSubmit} className="">
                                            <div className="custom-frm-bx">
                                                <select required
                                                    name="country"
                                                    value={registerData.country}
                                                    onChange={handleChange} className="form-control">
                                                    <option value="ind">IND</option>
                                                    <option value="usa">USA</option>
                                                </select>
                                                <label>Country / Region of residence</label>
                                                {errors.country && <p className="text-danger">{errors.country}</p>}

                                            </div>
                                            <div className="custom-frm-bx">
                                                <select required
                                                    name="currency"
                                                    value={registerData.currency}
                                                    onChange={handleChange} className="form-control">
                                                    <option value="inr">INR</option>
                                                    <option value="usd">USD</option>
                                                </select>
                                                <label>Currency</label>
                                                {errors.currency && <p className="text-danger">{errors.currency}</p>}

                                            </div>
                                            <div className="custom-frm-bx">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder=" "
                                                    required
                                                    name="email"
                                                    value={registerData.email}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="email">Email</label>
                                                {errors.email && <p className="text-danger">{errors.email}</p>}
                                            </div>
                                            <div className="custom-frm-bx">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="num"
                                                    placeholder=" "
                                                    required
                                                    name="phone"
                                                    value={registerData.phone}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="num">Phone Number</label>
                                                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                            </div>
                                            <div className="custom-frm-bx">
                                                <input
                                                    type="date"
                                                    placeholder=" "
                                                    className="form-control"
                                                    required
                                                    max={new Date().toISOString().split('T')[0]}
                                                    name="dob"
                                                    value={registerData.dob}
                                                    onChange={handleChange}
                                                />
                                                <label>Date of Birth</label>
                                                {errors.dob && <p className="text-danger">{errors.dob}</p>}
                                            </div>
                                            <div className="custom-frm-bx">
                                                <input
                                                    type={isPassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="cpass"
                                                    placeholder=" "
                                                    required
                                                    name="password"
                                                    value={registerData.password}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="cpass">Password</label>
                                                {isPassword ? <i className="fas fa-eye-slash" onClick={() => setIsPassword(!isPassword)} /> :
                                                    <i className="fas fa-eye" onClick={() => setIsPassword(!isPassword)} />}
                                                {errors.password && <p className="text-danger">{errors.password}</p>}
                                            </div>

                                            <div className="mb-3 form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="remember-con"
                                                    checked={checkData.isAdult}
                                                    name='isAdult'
                                                    value={checkData.isAdult}
                                                    onChange={(e) => setCheckData({ ...checkData, isAdult: e.target.checked })}
                                                />
                                                <label className="form-check-label" htmlFor="remember-con">
                                                    {t("18Plus")}
                                                    <Link href="javascript:void(0)" className="srvice-link">
                                                        Service Agreement
                                                    </Link>
                                                </label>
                                                {errors.isAdult && <p className="text-danger">{errors.isAdult}</p>}
                                            </div>

                                            <div className="mb-3 form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={checkData.isCitizen}
                                                    name='isCitizen'
                                                    value={checkData.isCitizen}
                                                    onChange={(e) => setCheckData({ ...checkData, isCitizen: e.target.checked })}
                                                    id="remember-dec"
                                                />
                                                <label className="form-check-label" htmlFor="remember-dec">
                                                    {t("nonResident")}
                                                </label>
                                                {errors.isCitizen && <p className="text-danger">{errors.isCitizen}</p>}
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <button
                                                    type='submit'
                                                    className="thm-btn mt-3"
                                                >
                                                    Registration <i className="fas fa-arrow-right" />
                                                </button>
                                            </div>

                                            <div className='my-3 text-white text-center'>
                                                Charts are powered by <a target='_blank' href='https://www.tradingview.com/' className='trade-view-btn'>TradingView</a>
                                            </div>
                                            <div className="text-center text-white mt-3 sing-in-with">
                                                <h5>Sign in with</h5>
                                            </div>

                                            <div className="text-center mt-2">
                                              
                                                <a href={`${base_url}/auth/google`} target='_blank' className="social-btn google">
                                                    <i className="fab fa-google" />
                                                </a>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            </>
            
           
            
            }


            {/* <section className="footer-btm-image-section" /> */}
        </>

    )
}

export default Register
