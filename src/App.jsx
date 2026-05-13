import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/frontend/Home'
import '../public/assets/css/style.css'
import '../public/assets/css/responsive.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify'
import React, { Suspense, lazy, useEffect } from "react";
import { AppInitializer } from './services/AppInitializer';

// Frontend
const About = lazy(() => import('./components/frontend/About'));
const Faq = lazy(() => import('./components/frontend/Faq'));
const Contact = lazy(() => import('./components/frontend/Contact'));
const Partner = lazy(() => import('./components/frontend/Partner'));
const Review = lazy(() => import('./components/frontend/Review'));
const Features = lazy(() => import('./components/frontend/Features'));
const Error404 = lazy(() => import('./components/frontend/NotFound'));
const Blog = lazy(() => import('./components/frontend/Blog'));


// Layout
const Layout = lazy(() => import('./components/Layout/Layout'));

// Authentication
const Register = lazy(() => import('./components/Authentication/Register'));
const Login = lazy(() => import('./components/Authentication/Login'));
const ForgotPassword = lazy(() => import('./components/Authentication/ForgotPassword'));
const PasswordRecovery = lazy(() => import('./components/Authentication/PasswordRecovery'));
const PasswordMail = lazy(() => import('./components/Authentication/PasswordMail'));
const TwoFactor = lazy(() => import('./components/Authentication/TwoFactor'));
const PrivacyPolicy = lazy(() => import('./components/Authentication/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/Authentication/Terms&Conditions'));

// Trade
const Deposit = lazy(() => import('./Trade/Deposit'));
const Support = lazy(() => import('./Trade/Support'));
const AccountLevels = lazy(() => import('./Trade/AccountLevels'));
const Referral = lazy(() => import('./Trade/Referral'));
const Tournaments = lazy(() => import('./Trade/Tournaments'));
const TournamentDetails = lazy(() => import('./Trade/TournamentDetails'));
const TournamentActive = lazy(() => import('./Trade/TournamentActive'));
const LeaderBoard = lazy(() => import('./Trade/LeaderBoard'));
const SearchTrade = lazy(() => import('./Trade/SearchTrade'));
const Chat = lazy(() => import('./Trade/Chat'));
const TechnicalAnalysis = lazy(() => import('./Trade/TechnicalAnalysis'));
const PrivateRoute = lazy(() => import('./Trade/ProtectedRoute'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));

// Affiliate
const AffiliateRegister = lazy(() => import('./Affilate/Register'));
const AffiliateLogin = lazy(() => import('./Affilate/Login'));
const Dashboard = lazy(() => import('./Affilate/Dashboard'));
const AffiliateLayout = lazy(() => import('./Affilate/AffiliateLayout'));
const UserList = lazy(() => import('./Affilate/UserList'));
const UserTradesList = lazy(() => import('./Affilate/UserTrade'));
const AffiliateSupport = lazy(() => import('./Affilate/Support'));
const TopAffiliate = lazy(() => import('./Affilate/TopAffiliate'));
const ReferralPage = lazy(() => import('./Affilate/RefferalLink'));
const Withdraw = lazy(() => import('./Affilate/Withdraw'));
import Loader from './components/frontend/Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './i18n'; // Importing the i18n configuration to initialize i18next
import MainLayout from './Layout/MainLayout'
const BlogDetail = lazy(() => import('./components/frontend/BlogDetail'));

const TradeFirst = React.lazy(() => import('./Trade/TradeFirst'))


function App() {
  // const [count, setCount] = useState(0)
  const { t, i18n } = useTranslation();
  const { userSetting, loading, } = useSelector((state) => state.user);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (userSetting && userSetting.language) {
      changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
    }
  }, [userSetting]);
  // useEffect(() => {
  //   const handleRightClick = (e) => {
  //     e.preventDefault();
  //   };
  //   window.addEventListener("contextmenu", handleRightClick);

  //   const handleKeyDown = (e) => {
  //     // F12
  //     if (e.key === "F12") {
  //       e.preventDefault();
  //     }

  //     if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
  //       e.preventDefault();
  //     }

  //     if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
  //       e.preventDefault();
  //     }

  //     if (e.ctrlKey && e.key.toLowerCase() === "u") {
  //       e.preventDefault();
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("contextmenu", handleRightClick);
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
  return (
    <>
      {/* <h1>{t('greeting')}</h1> */}
      <Suspense >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='about' element={<About />} />
              <Route path='faq' element={<Faq />} />
              <Route path='review' element={<Review />} />
              <Route path='register' element={<Register />} />
              <Route path='forgot-password/:token' element={<ForgotPassword />} />
              <Route path='login' element={<Login />} />
              <Route path='two-factor/:userId' element={<TwoFactor />} />
              <Route path='password-recovery' element={<PasswordRecovery />} />
              <Route path='password-mail/:email' element={<PasswordMail />} />
              <Route path='contact' element={<Contact />} />
              <Route path='partner' element={<Partner />} />
              <Route path='features' element={<Features />} />
              <Route path='blog' element={<Blog />} />
              <Route path='blog-detail/:heading/:id' element={<BlogDetail />} />
              <Route path='privacy-policy' element={<PrivacyPolicy />} />
              <Route path='terms-of-service' element={<TermsAndConditions />} />

              <Route path='affiliate/login' element={<AffiliateLogin />} />
              <Route path='affiliate/register' element={<AffiliateRegister />} />

              <Route path='*' element={<Error404 />} />

              {/* Trade */}
              {/* <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}> */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route
                    path='trade'
                    element={<TradeFirst />}
                  />
                  {/* <Route
                path='trade'
                element={<TradeFirst />}
                /> */}

                  <Route
                    path='deposit'
                    element={<Deposit />}
                  />

                  <Route
                    path='support'
                    element={<Support />}
                  />

                  <Route
                    path='account-level'
                    element={<AccountLevels />}
                  />

                  <Route
                    path='referral'
                    element={<Referral />}
                  />

                  <Route
                    path='tournaments'
                    element={<Tournaments />}
                  />

                  <Route
                    path='tournament-detail/:id'
                    element={<TournamentDetails />}
                  />

                  <Route
                    path='tournament-active'
                    element={<TournamentActive />}
                  />

                  <Route
                    path='leaderboard'
                    element={<LeaderBoard />}
                  />

                  <Route
                    path='search-trade'
                    element={<SearchTrade />}
                  />

                  <Route
                    path='chat'
                    element={<Chat />}
                  />

                  <Route
                    path='analysis'
                    element={<TechnicalAnalysis />}
                  />
                </Route>
              </Route>

              {/* </Route> */}
            </Route>

            <Route path='/affiliate' element={<ProtectedRoute />}>
              <Route element={<AffiliateLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='support' element={<AffiliateSupport />} />
                <Route path='user-list' element={<UserList />} />
                <Route path='refferal-link' element={<ReferralPage />} />
                <Route path='withdraw' element={<Withdraw />} />
                <Route path='commission-list' element={<UserTradesList />} />
                <Route path='top-affiliate' element={<TopAffiliate />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App