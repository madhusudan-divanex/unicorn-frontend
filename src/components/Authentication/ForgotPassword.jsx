import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { securePostData } from '../../services/api';
import { base_url } from '../../baseUrl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
    const params = useParams()
    const navigate = useNavigate()
    const { defaultLang } = useSelector(state => state.wallet)
    const [isPassword, setIsPassword] = useState(false)
    const [passForm, setPassForm] = useState({ token: "", newPassword: "", confirmPassword: '' });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPassForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            toast.error('Password was not match')
            return
        }
        try {
            const res = await fetch(`${base_url}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': params.token
                },
                body: JSON.stringify(passForm)
            });
            const result = await res.json()
            if (result.success) {
                toast.success("Password Change successfully");
                setPassForm({ token: "", newPassword: "", confirmPassword: '' })
                navigate('/login')
            } else {
                toast.error(result.message || "Login failed");
                navigate('/password-recovery')
            }
        } catch (error) {
            toast.error("Something went wrong", error.message);
        }
    };
    useEffect(() => {
        setPassForm({ ...passForm, token: params.token })
    }, [params])
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (defaultLang) {
            changeLanguage(defaultLang);
        }
    }, [defaultLang]);
    const { userData } = useSelector((state) => state.user);
    useEffect(() => {
        if (userData && Object.keys(userData)?.length > 0) {
            navigate('/')
        }
    }, [userData])

    return (
        <>

            <section className="password-recovr-section login-section email-chck-sec">
                <div className="container">
                    <div className="row">
                        <h2>{t('passwordRecovery')}</h2>
                        <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                            <form onSubmit={handleSubmit} className="password-recovery-box">
                                <p>
                                    {t('enterNewPassword')}
                                </p>
                                <div className="custom-frm-bx mt-3">
                                    <input
                                        type={isPassword ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        value={passForm?.newPassword}
                                        placeholder=" "
                                        onChange={handleChange}
                                        name='newPassword'
                                        required=""
                                    />
                                    <label htmlFor="password">{t('newPassword')}</label>
                                    {isPassword ? <i className="fas fa-eye-slash" onClick={() => setIsPassword(!isPassword)} /> :
                                        <i className="fas fa-eye" onClick={() => setIsPassword(!isPassword)} />}
                                </div>
                                <div className="custom-frm-bx mt-3">
                                    <input
                                        type={isPassword ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        value={passForm?.confirmPassword}
                                        placeholder=" "
                                        onChange={handleChange}
                                        name="confirmPassword"
                                        required=""
                                    />
                                    <label htmlFor="confirmPassword">{t('confirmNewPassword')}</label>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type='submit' className="btn signIn-btn mt-3">
                                        {t('continue')}
                                        <i className="fas fa-arrow-right" />
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="footer-btm-image-section" />



        </>

    )
}

export default ForgotPassword
