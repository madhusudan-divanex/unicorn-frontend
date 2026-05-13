import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/features/authSlice';
import { useTranslation } from 'react-i18next';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchUserData } from '../../redux/features/userSlice';
import { setDefaultLanguage } from '../../redux/features/walletSlice';

function Header() {
    const isLogin = useSelector((state) => state.auth.isLogin);
    const { defaultLang } = useSelector((state) => state.wallet);
    const { userSetting } = useSelector((state) => state.user);
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (defaultLang) {
            changeLanguage(defaultLang);
        }
    }, [defaultLang]);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserData())
    }, []);
    const navigate = useNavigate()
    async function handleLogout() {
        const loginData = JSON.parse(localStorage.getItem('loginData'))
        localStorage.clear()
        if (loginData) {
            localStorage.setItem('loginData', JSON.stringify(loginData))
        }
        dispatch(logout())
        dispatch(setDefaultLanguage('en'))
        navigate('/')
    }
    const closeMenu = () => {
        const nav = document.getElementById('navbarSupportedContent');
        if (nav) {
            const bsCollapse = bootstrap.Collapse.getInstance(nav) || new bootstrap.Collapse(nav, { toggle: false });
            bsCollapse.hide(); // Force close, don't toggle
        }
    };
    const handleDemo = () => {
        sessionStorage.setItem('wallet', 'demo')
        dispatch(setWalletUse('demo'))
        navigate('/trade');
    }
    const handleLive = () => {
        sessionStorage.setItem('wallet', 'live')
        dispatch(setWalletUse('live'))
        navigate('/trade');
    }



    return (
        <header className="main-header">
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container">
                    <div className='mobile-toglle-btn'>
                        <div className='mobile-res-logo'>
                            <NavLink to="/">
                                <img src="/assets/images/chart-nw-logo.png" className="chart-logo" />
                            </NavLink>
                        </div>
                        <button className="navbar-toggler w-100 text-end px-0" style={{ boxShadow: "none" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon text-bg-danger fs-5 "></span>
                        </button>
                    </div>

                    <div className="mobile-overlay" id="mobileOverlay" />
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <button
                            className="close-menu text-white"
                            type="button"
                            onClick={closeMenu}
                            aria-label="Close menu"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="navigation-btn">
                            <Link to="/">
                                <img src='/assets/images/unicorn-wb-logo.png' className='unicorn-logo' />
                            </Link>
                        </div>
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item ">
                                <Link className="nav-link active" to="/" onClick={closeMenu}>
                                    {t('home')}
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/about" onClick={closeMenu}>
                                    {t('aboutUs')}
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/blog">
                                    {t('blogs')}
                                </Link>
                            </li>


                            <li className="nav-item">
                                <Link className="nav-link" to="/features" onClick={closeMenu}>
                                    {t('ourServices')}
                                </Link>
                            </li>



                            <li className="nav-item">
                                <Link className="nav-link" to={isLogin ? "/trade" : "/register"} onClick={() => handleDemo()}>
                                    {t('demoAccount')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className='nav-link' to={isLogin ? "/trade" : "/register"} onClick={() => handleLive()}>
                                    {t('liveAccount')}
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/partner" onClick={closeMenu}>
                                    {t('partner')}
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className='nav-link' to="/contact" onClick={closeMenu}>
                                    {t('contact')}
                                </Link>
                            </li>

                        </ul>
                        <div className="navigation-btn">
                            {isLogin ?
                                <>
                                    <Link to='' onClick={handleLogout} className="thm-btn">{t('logout')}</Link>
                                    <Link to="/deposit?type=account" className="thm-btn">{t('account')}
                                        {/* <FontAwesomeIcon icon={faUser} />{" "} */}
                                    </Link>
                                </>
                                : <>
                                    <Link to="/register" className="thm-btn" onClick={closeMenu}>
                                        {t('registerBtn')}
                                    </Link>

                                    <Link to="/login" className="thm-btn" onClick={closeMenu}>
                                        {t('loginBtn')}
                                    </Link>

                                </>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
