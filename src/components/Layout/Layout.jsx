import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from '../../redux/features/authSlice';
import { useTranslation } from 'react-i18next';

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const frontRoutes = ['', '*', 'terms-of-service', 'privacy-policy', 'two-factor', 'forgot-password',
    'about', 'faq', 'review', 'register', 'login', 'password-recovery', 'password-mail', 'contact', 'partner',
    'features', 'affiliate/login', 'affiliate/register', 'blog', 'blog-detail']
  const firstSegment = location.pathname.split('/')[1];

  // Determine if header/footer should be shown
  const showLayout =
    frontRoutes.includes(firstSegment) ||
    location.pathname === "/affiliate/login" ||
    location.pathname === "/affiliate/register";
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(checkLogin(!!token));
  }, [dispatch]);


  return (
    <div>
      {showLayout && <Header />}
      <main>
        <Outlet />
      </main>
      {showLayout && <Footer />}
    </div>
  )
}

export default Layout
