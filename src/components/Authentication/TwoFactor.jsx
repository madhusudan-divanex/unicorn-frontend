import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { postApiData, securePostData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { login } from '../../redux/features/authSlice';
import { useDispatch } from 'react-redux';
import Loader from '../frontend/Loader';
import { saveFcmToken } from '../../services/globalFunction';

function TwoFactor() {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [isPassword, setIsPassword] = useState(false)
    const [factorForm, setFactorForm] = useState({ userId: undefined, code: '' });
    const inputsRef = useRef([]);

    const handleOtpChange = (element, index) => {
        const value = element.value.replace(/\D/, ''); // Only digits
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const finalOtp = otp.join('');
        const data = { code: finalOtp, userId: factorForm.userId }
        try {
            const result = await postApiData('verify-code', data);
            if (result.success) {
                localStorage.setItem("userId", JSON.stringify(result.user._id));
                localStorage.setItem("token", JSON.stringify(result.token));
                dispatch(login(result.user._id));
                if (searchParams.get('account') == "affiliate") {
                    navigate('/affiliate/dashboard')
                } else {
                    navigate('/trade')
                    await saveFcmToken()
                }
            } else {
                toast.error(result.message || "Login failed");
                navigate('/password-recovery')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        setFactorForm({ ...factorForm, userId: params.userId })
    }, [params])

    return (
        <>
            {loading?<Loader/>:<>
                <section className="about-section all-hm-banner" >
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7  col-sm-12 ">
                                <div className='contact-content text-center' >
                                    <h2>Verification Code</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='contact-us-sec'>
                    <div className='container'>
                        <div className='row justify-content-center'>
                            <div className='col-lg-6'>
                                <div className='unicorn-main-form'>
                                    <form onSubmit={handleSubmit} className="password-recovery-box">
                                        <p className='recovery-para'>Please enter verification code</p>

                                        <div className="d-flex justify-content-center align-items-center gap-3 " onPaste={handlePaste}>
                                            {otp.map((digit, index) => (
                                                <div className="custom-frm-bx mb-0">
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength="1"
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(e.target, index)}
                                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                                        ref={(el) => (inputsRef.current[index] = el)}
                                                        className="form-control text-center p-0 new-form-control"
                                                        style={{ width: '50px', fontSize: '18px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-4">
                                            <button type="submit" className="thm-btn">
                                                Continue <i className="fas fa-arrow-right" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>}
        </>

    )
}

export default TwoFactor
