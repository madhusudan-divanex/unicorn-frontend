import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useSearchParams, useNavigate } from "react-router-dom";
import {
  faAngleLeft,
  faAreaChart,
  faArrowDown,
  faArrowUp,
  faBarChart,
  faBell,
  faCakeCandles,
  faClockFour,
  faCopy,
  faCreditCard,
  faInfoCircle,
  faL,
  faRotate,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
// import ReactApexChart from "react-apexcharts";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import TradeHeader from "./TradeHeader";
import TradeSidebar from "./TradeSidebar";
import TradeReferral from "./TradeReferral";
import SearchTrade from "./SearchTrade";
import Wallet from "./Wallet";
import { base_url } from "../baseUrl";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createChart, CrosshairMode } from "lightweight-charts";
import ForexChart from "./ForexChart";
import {
  getApiData,
  getSecureApiData,
  securePostData,
  updateApiData,
} from "../services/api";
import { fetchUserData } from "../redux/features/userSlice";
import ChatBox from "./Chat";
import { io } from "socket.io-client";
import {
  removeTickerFromWatchList,
  setActiveTicker,
  setDefaultCurrency,
  setDefaultLanguage,
  setDollerToInr,
  toggleActiveTicker,
} from "../redux/features/walletSlice";
import NotificationPanel from "./Notification";
import { login } from "../redux/features/authSlice";
import { postApiData } from "../services/api";
import { setDemoWallet } from "../redux/features/walletSlice";
import TechnicalAnalysis from "./TechnicalAnalysis";
import { useTranslation } from "react-i18next";
// import calculateZigZag, {
//   calculateEMA,
//   calculateIchimoku,
//   calculateMACD,
//   calculateParabolicSAR,
//   calculateRSI,
//   calculateSMA,
// } from "./TradeFeature";
import { MdCandlestickChart } from "react-icons/md";
import { MdOutlineCandlestickChart } from "react-icons/md";
import { getWebisteSetting, saveFcmToken } from "../services/globalFunction";
import AccountModal from "./AccountModal";
import {
  calculateSMA,
  calculateEMA,
  calculateMACD,
  calculateRSI,
  calculateADX,
  calculateATR,
  calculateBollingerBands,
  calculateStochastic,
  calculateMFI,
  calculateOBV,
  calculateVWAP,
  calculateIchimoku,
  calculateParabolicSAR,
  calculateZigZag,
  calculateWEMA,
  calculateTEMA,
  calculateWilliamsR,
  calculateCCI,
  calculateROC,
  calculateWMA,
  calculateVolumeProfile,
} from "../utils/indicators";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
const CustomChart = React.lazy(() => import("./CustomChart"));
import { c2c, formatActivityMessage, generateTimeSlots, getRemainingSeconds } from "../utils/globalFunction";
import ClockSyncedTimer from "../utils/CurrentSecondTimer";
import AOS from "aos";
import "aos/dist/aos.css";
import throttle from "lodash.throttle";
import ChartSkeleton from "./ChartTest";
import Loader from "../components/frontend/Loader";
import { ChartLoader } from "./ChartLoader";
import PlatFormStatus from "./PlatFormStatus";
import { MarketClosedOverlay } from "./MarkerClose";
// const socket = io(base_url);
function TradeFirst() {
  const [data, setData] = useState([]);
  const [marketStatus, setMarketStatus] = useState({});
  const [allData, setAllData] = useState([])
  const [searchParam] = useSearchParams();
  const [chatShow, setChatShow] = useState(false);
  const [historyTab, setHistoryTab] = useState("trades");
  const [timeList, setTimeList] = useState(false);
  const [bidMarkers, setBidMarkers] = useState([]);
  const [firstBonus, setFirstBonus] = useState(0);
  const [minAmount, setMinAmount] = useState(undefined);
  const [maxAmount, setMaxAmount] = useState(undefined);
  const [bidData, setBidData] = useState({});
  const [winPer, setWinPer] = useState(50);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [activeMenu, setActiveMenu] = useState(null);
  const [timeFrame, setTimeFrame] = useState(60);
  const [results, setResults] = useState([]);
  const timeFrameRef = useRef(timeFrame);
  const [isChartOption, setIsChartOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeOption, setIsTimeOption] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const [activities, setActivities] = useState([])
  const activityQueue = useRef([]);
  const isShowing = useRef(false);

  useEffect(() => {
    timeFrameRef.current = timeFrame;
  }, [timeFrame]);

  const toggleMenu = (name) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  const [openAnalysis, setOpenAnalysis] = useState(false);
  const { userData, userTrade, totalUserTrade, totalUserOrder, userOrder } =
    useSelector((state) => state.user);
  const [ipAddress, setIpAddress] = useState();
  const [chartType, setChartType] = useState("candle");
  const [durationSeconds, setDurationSeconds] = useState(60); // 01:00 default (60 seconds)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    walletUse,
    activeTicker,
    demoWallet,
    watchList,
    defaultCurrency,
    dollerToInr,
    hideBalance,
  } = useSelector((state) => state.wallet);
  const [pair, setPair] = useState(activeTicker || "AAPL");
  const userId = JSON.parse(localStorage.getItem("userId"));
  const { t, i18n } = useTranslation();
  const { userSetting } = useSelector((state) => state.user);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (userSetting && userSetting.language) {
      const data =
        userSetting.language && userSetting.language == "english"
          ? "en"
          : "hi" || "en";
      localStorage.setItem("defaultLang", data);
      dispatch(setDefaultLanguage(data));
      changeLanguage(userSetting.language == "english" ? "en" : "hi");
    }
  }, [userSetting]);
  const [tradeForm, setTradeForm] = useState({
    amount: minAmount || 20,
    time: Number(localStorage.getItem("tradeTime") || 60),
    pendingTrade: false,
    autoMartingale: false,
  });
  useEffect(() => {
    setTradeForm(prev => ({ ...prev, amount: minAmount }));
  }, [minAmount]);
  useEffect(() => {
    setPair(activeTicker);
    localStorage.setItem("tick", activeTicker);
  }, [activeTicker]);
  const handleTrade = async (direction) => {
    if (!tradeForm?.amount || !tradeForm?.time) {
      toast.error("Please enter both amount and time.");
      return;
    }
    if (minAmount && maxAmount && userData) {
      const exchangeRate =
        dollerToInr || Number(import.meta.env.VITE_USD_TO_INR) || 87; // fallback

      // Convert input amount to USD for comparison
      const amountUSD =
        userData.currency === "inr"
          ? Number(tradeForm.amount) / exchangeRate
          : Number(tradeForm.amount);

      // Convert min and max to USD for comparison
      const minUSD =
        userData.currency === "inr"
          ? Number(minAmount) / exchangeRate
          : Number(minAmount);

      const maxUSD =
        userData.currency === "inr"
          ? Number(maxAmount) / exchangeRate
          : Number(maxAmount);

      // FIXED: validate using USD-converted values (INR users were compared against INR min/max incorrectly)
      if (amountUSD > maxUSD) {
        toast.error(
          `Amount must be less than ${userData.currency === "usd"
            ? `${maxAmount} USD`
            : `${maxAmount} INR`
          }`,
        );
        return;
      }

      if (amountUSD < minUSD) {
        toast.error(
          `Amount must be greater than ${userData.currency === "usd"
            ? `${minAmount} USD`
            : `${minAmount} INR`
          }`,
        );
        return;
      }
    }
    const currentCandle = data[data.length - 1];
    setIsSubmitting(true);
    try {
      if (userId == null || userId == undefined) {
        const tradeData = {
          ...tradeForm,
          openPrice: data.length > 0 ? data[data.length - 1].open : 0,
          type: direction,
          tradeTime: currentCandle.time,
          userId: ipAddress,
          tradePair: pair,
        };
        if (tradeForm.amount > demoWallet) {
          toast.error("Insufficient demo wallet balance");
          return;
        }
        if (tradeForm.autoMartingale) {
          toast.error("Login requried for Auto Martingale");
          navigate("/login");
          return;
        }
        // Optimistic update - turant dikhao
        const audio = new Audio("/assets/priceReached.mp3");
        audio.play();
        toast.success(
          `Trade opend with price ${tradeData?.openPrice} pair ${pair}`,
          {
            className: "trade-open-price",
            autoClose: 2000,
          },
        );
        const amount = Number(demoWallet) - tradeForm.amount;
        sessionStorage.setItem("demoWallet", amount);
        dispatch(setDemoWallet());

        const result = await postApiData("join-demo-trade", tradeData);
        if (!result.success) {
          toast.error(result.message);
          // Revert wallet on failure
          sessionStorage.setItem("demoWallet", demoWallet);
          dispatch(setDemoWallet());
        }
      } else {
        let tradeData = {
          ...tradeForm,
          ipAddress,
          openPrice: data.length > 0 ? data[data.length - 1].open : 0,
          high: data.length > 0 ? data[data.length - 1].high : 0,
          low: data.length > 0 ? data[data.length - 1].low : 0,
          close: data.length > 0 ? data[data.length - 1].close : 0,
          tradeTime: data.length > 0 ? data[data.length - 1].time : 0,
          type: direction,
          userId,
          tradePair: pair,
          walletUse,
        };
        if (tradeForm?.autoMartingale) {
          const unit = selectedTime.charAt(0); // 'M' or 'H'
          const value = parseInt(selectedTime.slice(1)); // e.g., 5 from 'M5'
          let seconds = 0;
          if (unit === "M") {
            seconds = value * 60;
          } else if (unit === "H") {
            seconds = value * 3600;
          }
          tradeData.orderTime = seconds;
          // Optimistic update - turant audio dikhao
          const audio = new Audio("/assets/priceReached.mp3");
          audio.play();
          setTradeForm({ ...tradeForm, autoMartingale: false });

          const response = await securePostData("open-order", tradeData);
          if (response.success) {
            dispatch(fetchUserData());
          } else {
            toast.error(response.message);
          }
        } else {
          // Optimistic update - turant bid marker aur audio dikhao
          const audio = new Audio("/assets/priceReached.mp3");
          audio.play();
          const nowSec = Math.floor(Date.now() / 1000);
          const tempId = crypto.randomUUID();
          const endTimeMs = Date.now() + Number(tradeForm.time) * 1000;
          const endDate = new Date(endTimeMs);
          endDate.setSeconds(0, 0);
          const endTimeSec = Math.floor(endDate.getTime() / 1000);
          const actualDuration = endTimeSec - nowSec;
          const optimisticMarker = {
            _id: tempId,
            pair,
            time: tradeData.tradeTime,
            price: data[data.length - 1].close,
            direction,
            currency: defaultCurrency,
            amount: Number(tradeForm.amount),
            duration: actualDuration,
            startTime: nowSec,
          };
          lsAdd(optimisticMarker);
          // setBidMarkers((prev) => [...prev, optimisticMarker]);
          dispatch(fetchUserData());

          const response = await securePostData("join-trade", tradeData);
          if (response.success) {
            // Server se actual _id aur price update karo
            const actualId = response?.marker?._id;
            setBidMarkers((prev) => [...prev, optimisticMarker]);
            if (actualId && actualId !== tempId) {
              setBidMarkers((prev) =>
                prev.map((m) =>
                  m._id === tempId
                    ? {
                      ...m,
                      _id: actualId,
                      price: response?.marker?.close || m.price,
                    }
                    : m,
                ),
              );
            }
            dispatch(fetchUserData());
          } else {
            toast.error(response.message);
            // Revert marker on failure
            setBidMarkers((prev) => prev.filter((m) => m._id !== tempId));
          }
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRepeat = () => {
    const lastTrade = userTrade[0]
    setTradeForm({
      ...tradeForm,
      amount: lastTrade?.amount,
      time: lastTrade?.time,
      tradePair: lastTrade?.tradePair
    })
    handleTrade(lastTrade?.type)

  }
  function formatTime(totalSeconds) {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }
  const throttledCandleUpdate = useRef(
    throttle((newCandle) => {
      setData((prev) => {
        if (!prev.length) return [newCandle];

        const last = prev[prev.length - 1];

        // same candle — track high/low from close (server's high/low are inaccurate)
        if (last.time === newCandle.time) {
          const updated = {
            ...last,
            high: Math.max(last.high, newCandle.close),
            low: Math.min(last.low, newCandle.close),
            close: newCandle.close,
          };
          return [...prev.slice(0, -1), updated];
        }

        // new candle — start fresh high/low from open/close only
        const newOpen = newCandle.open ?? last.close;
        return [
          ...prev,
          {
            ...newCandle,
            open: newOpen,
            high: Math.max(newOpen, newCandle.close),
            low: Math.min(newOpen, newCandle.close),
          },
        ];
      });
    }, 500), // 🔥 500ms throttle (adjust if needed)
  ).current;

  const increaseTime = () => {
    // max 60 min rakh le (tu apne hisaab se change kar sakta hai)
    if (tradeForm.time < 3600) {
      const newTime = tradeForm.time + 60;

      localStorage.setItem("tradeTime", newTime);

      setTradeForm({
        ...tradeForm,
        time: newTime,
      });
    }
  };

  const decreaseTime = () => {
    // minimum 1 min
    if (tradeForm.time > 60) {
      const newTime = tradeForm.time - 60;

      localStorage.setItem("tradeTime", newTime);

      setTradeForm({
        ...tradeForm,
        time: newTime,
      });
    }
  };

  const fetchTrade = async () => {
    // NOTE: setData([]) and setLoading(true) now called from useEffect synchronously
    // so old candles never flash on new pair
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const SEVEN_DAYS = 7 * 24 * 60 * 60;
      const candleCount = Math.floor(SEVEN_DAYS / timeFrame);

      const response = await fetch(
        `${base_url}/history?pair=${pair}&timeframe=${timeFrame}&endDate=${now}&count=${candleCount}`,
      );
      const result = await response.json();

      const formattedData = (result.data || []).map((item) => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // ── FIX: synchronous clear BEFORE async fetch ──
    // All 3 state updates batch into ONE render → ChartLoader shows immediately
    // Old pair's candles NEVER briefly appear on new pair
    setData([]);
    setBidMarkers([]);
    setLoading(true);
    fetchTrade();
    fetchBidMarkers();
  }, [pair, timeFrame]);
  // ── localStorage helpers ─────────────────────────────────────────────
  // FIXED: demo users (null userId) get unique key via ipAddress to avoid shared storage
  const LS_KEY = `bidMarkers_${userId || ipAddress || "guest"}`;
  const lsGet = () => {
    try {
      const nowSec = Math.floor(Date.now() / 1000);
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      return raw.filter(
        (m) => Number(m.startTime) + Number(m.duration) > nowSec,
      );
    } catch {
      return [];
    }
  };
  const lsSave = (markers) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(markers));
    } catch { }
  };
  const lsAdd = (marker) => {
    const list = lsGet().filter((m) => m._id !== marker._id);
    lsSave([...list, marker]);
  };
  const lsRemove = (id) => lsSave(lsGet().filter((m) => m._id !== id));
  // ─────────────────────────────────────────────────────────────────────

  async function fetchBidMarkers() {
    try {
      const encodedPair = encodeURIComponent(pair);
      const res = await getSecureApiData(
        `bid-markers/${userId}/${encodedPair}`,
      );
      const cached = lsGet(); // localStorage = source of truth

      if (res.success && res.markers?.length > 0) {
        const merged = res.markers.map((m) => {
          // Match by _id OR by pair+time+direction (in case _id differs)
          const local = cached.find(
            (lm) =>
              lm._id === m._id ||
              (lm.pair === m.pair &&
                Number(lm.time) === Number(m.time) &&
                lm.direction === m.direction),
          );
          // If found in localStorage, trust it completely (has correct duration)
          if (local) return local;
          // Not in localStorage — use API data (new marker we didn't save locally)
          return {
            ...m,
            time: Number(m.time),
            price: Number(m.price),
            startTime: Number(m.startTime),
            duration: Number(m.duration),
          };
        });
        // FIXED: filter merged to current pair only (was showing all pairs' markers)
        setBidMarkers(merged.filter((m) => m.pair === pair));
      } else {
        // API ne kuch nahi diya — localStorage se lo
        const local = cached.filter((m) => m.pair === pair);
        setBidMarkers(local);
      }
    } catch (error) {
      console.error(error);
      const local = lsGet().filter((m) => m.pair === pair);
      if (local.length > 0) setBidMarkers(local);
    }
  }
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  // Wallet BTN oFFcanvas
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleAnalysis = () => setOpenAnalysis(false);
  const handleChatClose = () => setChatShow(false);
  const handleShow = () => setShow(!show);
  useEffect(() => {
    // const socket = io(base_url);
    const socket = io(`${base_url}`, {
      transports: ["websocket", "polling"],
      secure: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("subscribeTicker", { ticker: pair, timeframe: timeFrame }); // send timeframe
      // socket.emit('bidData', pair);
      if (userId) socket.emit("registerUser", userId);
      else if (ipAddress) socket.emit("registerDemoUser", ipAddress);
    });
    socket.on("tradeActivity", (data) => {
      activityQueue.current.push(data);
      processQueue();
    });

    socket.on("tick", (tick) => {
      if (tick.symbol?.toUpperCase() !== pair?.toUpperCase()) return;
      throttledCandleUpdate(tick);
    });
    socket.on("marketStatus", (data) => {
      setMarketStatus(data);
    });

    socket.on("tradeResult", (data) => {
      setBidMarkers((prev) =>
        prev.filter((m) => !data.results.some(r => r.tradeId === m.tradeId))
      );
      for (const r of data.results) {
        if (r?.userId === userId) {
          if (r?.result === "win") {
            const audio = new Audio("/assets/priceReached.mp3");
            audio.play();
          }
          if (r?._id) {
            lsRemove(r._id);
            setBidMarkers((prev) => prev.filter((m) => m._id !== r._id));
          }
        }
      }
      dispatch(fetchUserData());
      const winResults = data.results.filter(
        (r) => r?.userId === userId && r?.result === "win",
      );

      // FIXED: append new wins, don't replace (prevents wiping existing results)
      setResults((prev) => [...prev, ...winResults]);
      // FIXED: use ref-tracked timeout to allow cleanup
      const t = setTimeout(() => {
        setResults((prev) => prev.slice(winResults.length));
      }, 5000);
      // Note: timeout is fire-and-forget here; component unmount race is acceptable
      // for a non-critical UI notification
    });

    if (!userId) {
      socket.on("demoTradeResult", (data) => {
        const result = data.results[0];
        for (const r of data.results) {
          if (r?.userId === ipAddress) {
            const audio = new Audio("/assets/priceReached.mp3"); // Adjust the path as needed
            audio.play();

            toast.success(`Trade ${data?.tradePair} for ${r?.profit} `, {
              className: "trade-open-price",
              autoClose: 2000,
            });
            if (r.result == "win") {
              // console.log(demoWallet)
              var session_val = sessionStorage.getItem("demoWallet");
              const amount =
                Number(session_val) + Number(r?.profit) + Number(r?.amount);
              // console.log(amount)
              sessionStorage.setItem("demoWallet", amount);
              dispatch(setDemoWallet());
            }
          }
        }
      });
    }
    // socket.on("bidPercentage", (data) => {
    //   if (data.symbol !== pair) return;
    //   setBidData(data)
    // });
    socket.on("disconnect", () => {
      setIsConnected(false);
      // console.log("Disconnected from backend WebSocket");
    });
    socket.on("connect_error", () => {
      setIsConnected(false);
    });

    return () => {
      socket.emit("unsubscribeTicker", { ticker: pair, timeframe: timeFrame });
      socket.disconnect();
    };
  }, [pair, userId, ipAddress, timeFrame]);
  const processQueue = () => {
    if (isShowing.current) return;
    if (activityQueue.current.length === 0) return;

    isShowing.current = true;

    const data = activityQueue.current.shift();

    const id = Date.now();
    let text = "";

    if (!data.result) {
      text = `🚀 ${data.user} placed ${convertAmount(data?.amount, data?.currency, userData?.currency)} ${userData?.currency == "inr" ? "₹" : "$"} on ${data.symbol} ${data.type}`;
    } else if (data.result === "WIN") {
      text = `📈 ${data.user} won ${data.profit} on ${data.symbol}`;
    } else if (data.result === "LOSS") {
      text = `📉 ${data.user} lost ${convertAmount(data?.amount, data?.currency, userData?.currency)} ${userData?.currency == "inr" ? "₹" : "$"} on ${data.symbol}`;
    }

    const newActivity = { id, text };

    setActivities([newActivity]); // 👈 always only ONE

    // remove after 5 sec
    setTimeout(() => {
      setActivities(prev => prev.filter(a => a.id !== id));
    }, 5000);

    // next item delay (IMPORTANT)
    setTimeout(() => {
      isShowing.current = false;
      processQueue();
    }, 800); // 👈 speed control (800ms gap)
  };
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  async function getPanelData() {
    try {
      const data = await getWebisteSetting();
      setFirstBonus(data.firstBonus);
      const adata =
        defaultCurrency == "inr"
          ? data.minTradeAmount * data.dollerToInr
          : data.minTradeAmount;
      setMinAmount(adata);
      // const mdata = defaultCurrency == 'inr' ? (data.maxTradeAmount / data.dollerToInr)  :data.maxTradeAmount
      // setMaxAmount(mdata)
      dispatch(setDollerToInr(Number(data.dollerToInr)));
    } catch (error) { }
  }
  useEffect(() => {
    sessionStorage.setItem("demoWallet", 100000);
  }, [defaultCurrency]);
  useEffect(() => {
    if (userData?._id) {

      getPanelData();
    }
  }, [userData?._id]);
  useEffect(() => {
    if (!userId) {
      const userIdFromQuery = searchParam.get("user");
      const tokenFromQuery = searchParam.get("token");
      if (userIdFromQuery && tokenFromQuery) {
        localStorage.setItem("userId", JSON.stringify(userIdFromQuery));
        localStorage.setItem("token", JSON.stringify(tokenFromQuery));
        dispatch(login(userIdFromQuery));
        dispatch(fetchUserData());
        navigate("/trade", { replace: true });
      }
    }
  }, [dispatch, searchParam, userId]);
  useEffect(() => {
    if (userData?.currency) {
      dispatch(setDefaultCurrency(userData?.currency));
    }
    const data =
      defaultCurrency == "inr"
        ? userData?.levelId?.maxTradeAmount?.ft * dollerToInr
        : userData?.levelId?.maxTradeAmount?.ft;
    setMaxAmount(data);
    setWinPer(userData?.levelId?.rateOfReturn);
  }, [userData]);

  const getIpAddress = async () => {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    setIpAddress(ipData.ip);
  };

  useEffect(() => {
    getIpAddress();
  }, []);
  const formatSecondsToHHMMSS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      // hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };
  async function updateSetting(currency) {
    let liveAmount = userData.liveAmount;
    let demoAmount = userData.demoAmount;
    const exchangeRate = dollerToInr || 90;
    if (currency == "inr") {
      liveAmount = userData.liveAmount * exchangeRate;
      demoAmount = userData.demoAmount * exchangeRate;
    } else {
      liveAmount = userData.liveAmount / exchangeRate;
      demoAmount = userData.demoAmount / exchangeRate;
    }
    const data = { ...userData, userId, currency, liveAmount, demoAmount };
    try {
      const result = await updateApiData(`update-user-data`, data);
      if (result.success) {
        dispatch(fetchUserData());
        dispatch(setDefaultCurrency(currency));
        toast.success("Currency updated");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function closeOrder(orderId) {
    const data = { orderId, userId };
    try {
      const result = await securePostData("close-order", data);
      if (result.success) {
        dispatch(fetchUserData());
        toast.success(`Order cancel`, {
          className: "trade-open-price",
          autoClose: 2000,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) { }
  }
  const [selectedTime, setSelectedTime] = useState("M1");

  const times = ["M1", "M2", "M5", "M15", "M30", "M45", "H1", "H2", "H4"];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeList(false); // Close dropdown after selection
  };
  function formatOrderTime(seconds) {
    if (seconds < 60) {
      return `${seconds}S`;
    } else if (seconds < 3600) {
      return `M${seconds / 60}`;
    } else {
      return `H${seconds / 3600}`;
    }
  }
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // TradeTimer - endTime based
  const TradeTimer = React.memo(({ endTime }) => {
    const [remaining, setRemaining] = useState(
      Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000))
    );

    useEffect(() => {
      if (remaining <= 0) return;
      const interval = setInterval(() => {
        const r = Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000));
        setRemaining(r);
        if (r <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }, [endTime]);

    return <span>{formatSecondsToHHMMSS(remaining)}</span>;
  });
  // Helper function to format a date to "1 December"
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  };

  // Group trades by date
  const groupTradesByDate = (trades) => {
    return trades.reduce((acc, trade) => {
      const dateKey = formatDateHeader(trade.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(trade);
      return acc;
    }, {});
  };

  async function handleDemoBalance() {
    try {
      const response = await securePostData(`set-demo-balance/${userId}`, {});
      if (response.success) {
        dispatch(fetchUserData());
      }
    } catch (error) { }
  }
  const handleTimeChange = (e) => {
    let value = e.target.value;

    // only digits
    value = value.replace(/\D/g, "");

    // max MMSS
    if (value.length > 4) value = value.slice(0, 4);

    let minutes = 0;
    let seconds = 0;

    if (value.length <= 2) {
      minutes = parseInt(value || "0", 10);
    } else {
      minutes = parseInt(value.slice(0, 2), 10);
      seconds = parseInt(value.slice(2), 10);
    }

    if (seconds > 59) seconds = 59;

    const totalSeconds = minutes * 60 + seconds;

    localStorage.setItem("tradeTime", totalSeconds);
    setTradeForm((prev) => ({
      ...prev,
      time: totalSeconds,
    }));
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const loadMoreHistory = async (beforeTime) => {
    try {
      const response = await fetch(
        `${base_url}/history?pair=${pair}&timeframe=${timeFrame}&before=${beforeTime}&count=500`,
      );

      const result = await response.json();

      console.log("API RESULT 👉", result);

      const newCandles = Array.isArray(result.data) ? result.data : [];

      if (!newCandles.length) return; // no data → exit

      setData((prev) => {
        const merged = [...newCandles, ...prev];

        const unique = Array.from(
          new Map(merged.map((c) => [c.time, c])).values(),
        );

        return unique.sort((a, b) => a.time - b.time); // FIXED: ensure sorted order
      });
    } catch (err) {
      console.log("loadMoreHistory error", err);
    }
  };
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
  const trend = data?.slice(-5).every(c => c.close > c.open) ? "UP" : "DOWN";

  const formatExpireTime = (val) => {
    const date = val instanceof Date ? val : new Date(Date.now() + (Number(val) || 60) * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };



  const { leftTimes, rightTimes } = generateTimeSlots();
  return (
    <>
      {/* Main Content */}
      <main className="main-content">
        <div className="main-trade-container">
          {/* <div className="col-lg-10 col-md-12 col-sm-12  px-lg-0 left-trade-graph"> */}
          <div className="nw-trade-chart-bx">
            <div className="position-relative">
              <div className="unicorn-mobile-showing w-100">
                <div className="tabs-assest-box">
                  {watchList?.length > 0 &&
                    watchList?.map((item, index) => {
                      const cleanPair = item?.startsWith("OTC")
                        ? item?.slice(3)
                        : item;
                      const [base, quote] = cleanPair?.split("/") || [];

                      const isActive = item === pair;


                      const nowSec = Math.floor(Date.now() / 1000);
                      const pairActiveBids = bidMarkers.filter(
                        (m) =>
                          m.pair === item &&
                          m.duration - (nowSec - m.startTime) > 0,
                      );
                      const activeBidCount = pairActiveBids.length;

                      const selectedCurrency = userData?.currency || "inr";

                      const livePnl = pairActiveBids.reduce((sum, m) => {
                        const currentPrice = data[data.length - 1]?.close;

                        const isWinning =
                          currentPrice &&
                          ((m.direction === "UP" &&
                            currentPrice > m.price) ||
                            (m.direction === "DOWN" &&
                              currentPrice < m.price));

                        if (!isWinning) return sum;

                        const profit =
                          (Number(m.amount) * (winPer || 70)) / 100;

                        const convertedProfit = convertAmount(
                          profit,
                          m.currency || "inr",
                          selectedCurrency,
                        );

                        return sum + convertedProfit;
                      }, 0);


                      const profitPct =
                        userData?.levelId?.rateOfReturn || winPer || 70;

                      return (
                        <div
                          key={index}
                          onClick={() => dispatch(setActiveTicker(item))}
                          className="new-assest-tabs-box"
                          style={{

                            background: isActive ? "#14532d" : "#1e293b",
                            border: isActive
                              ? "1px solid #22c55e"
                              : "1px solid #334155",

                          }}
                        >

                          <div
                            style={{
                              position: "relative",
                              width: "28px",
                              height: "20px",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={`https://flagcdn.com/w20/${c2c[base] || "un"}.png`}
                              alt={base}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              style={{
                                width: "16px",
                                height: "12px",
                                borderRadius: "2px",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                border: "1px solid rgba(255,255,255,0.3)",
                                objectFit: "cover",
                              }}
                            />
                            <img
                              src={`https://flagcdn.com/w20/${c2c[quote] || "un"}.png`}
                              alt={quote}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              style={{
                                width: "16px",
                                height: "12px",
                                borderRadius: "2px",
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                border: "1px solid rgba(255,255,255,0.3)",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              lineHeight: 1.2,
                            }}
                          >
                            <span
                              style={{
                                // color: isActive ? "#86efac" : "#e2e8f0",
                                color: isActive ? "#fff" : "#e2e8f0",
                                fontSize: "11px",
                                fontWeight: "700",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cleanPair}
                            </span>
                            <span
                              style={{
                                // color: isActive ? "#4ade80" : "#94a3b8",
                                color: isActive ? "#fff" : "#94a3b8",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {profitPct}%
                            </span>
                          </div>
                          {activeBidCount > 0 && (
                            <span
                              style={{
                                background: "#1d4ed8",
                                color: "#fff",
                                fontSize: "9px",
                                fontWeight: "700",
                                borderRadius: "10px",
                                padding: "1px 5px",
                                minWidth: "16px",
                                textAlign: "center",
                              }}
                            >
                              +{activeBidCount}
                            </span>
                          )}
                          {livePnl > 0 && (
                            <span
                              style={{
                                background: "#166534",
                                color: "#4ade80",
                                fontSize: "9px",
                                fontWeight: "700",
                                borderRadius: "4px",
                                padding: "1px 4px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              +{livePnl.toFixed(0)}{" "}
                              {userData?.currency === "inr" ? "₹" : "$"}
                            </span>
                          )}
                          {watchList.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(removeTickerFromWatchList(item));
                              }}
                              style={{
                                background: "#1e293b",
                                border: "1px solid #475569",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: "0 3px",
                                fontSize: "9px",
                                lineHeight: "14px",
                                borderRadius: "3px",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
                <div className="unicorn-trade-live-box">
                  {isConnected && (
                    <div className="d-flex gap-2 align-items-center">
                      <span className="unicorn-lv-title">Live</span>
                      <a
                        href="javascript:void(0)"
                        className="d-lg-none d-sm-block tp-header-btn plus-unicorn-btn"
                        data-bs-toggle="modal"
                        onClick={() => setSearchShow(true)}
                        data-bs-target="#quotesHistoryModalTrade"
                      >
                        +
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-body mt-0 unicorn-tp-space custom-grid-item overflow-hidden bg-slate-gradient">
                  <div className=" w-100 text-center d-flex flex-column align-items-center position-relative h-100">
                    {/* <div ref={containerRef} className="my-chart" />  */}
                    <div className="activity-feed">
                      {activities.map((item, index) => (
                        <div key={index} className="activity-item">
                          <h6>{item?.text}</h6>
                        </div>
                      ))}

                    </div>

                    <div className="chart-wrapper">
                      {isConnected ? (
                        marketStatus.isOpen ?
                          <CustomChart
                            key={`${pair}-${timeFrame}`}
                            convertAmount={convertAmount}
                            loading={loading}
                            data={data}
                            userSetting={userSetting}
                            connected={isConnected}
                            pair={pair}
                            bidMarkers={bidMarkers}
                            chartType={chartType}
                            TIMEFRAME_SEC={Number(timeFrame)}
                            onLoadMore={loadMoreHistory}
                          /> :
                          <MarketClosedOverlay pair={pair} />
                      ) : (
                        <ChartLoader />
                        // <Loader/>
                      )}
                    </div>
                    <div className="trade-result text-center">
                      {/* <div  className="wining-trade mb-1"
                          
                          data-aos="fade-down"
                        >
                          <h6>Trade 46546555 for 8945455</h6>
                        </div> */}

                      {results?.map((item, key) => (
                        <div
                          className="wining-trade win mb-1"
                          key={key}
                          data-aos="fade-down"
                        >
                          <h6>Trade {item?.tradePair} for {item?.profit}</h6>
                        </div>
                      ))}
                    </div>
                    {/* <TvAdvancedChart symbol={pair} bidMarkers={bidMarkers} /> */}
                  </div>
                </div>
                <div className=" nw-trade-tp-bx">
                  {/* ✅ QxBroker style watchlist — chart ke upar */}
                </div>
              </div>

              {isConnected && marketStatus?.isOpen && (
                <div className="chart-bttm-box">
                  <button
                    type="button"
                    className="chrts-btm-btn"
                    onClick={() => {
                      setIsTimeOption(!isTimeOption);
                      setIsChartOption(false);
                    }}
                    disabled={chartType == "area" ? true : false}
                  >
                    {timeFrame < 60
                      ? `${timeFrame}S`
                      : `${timeFrame / 60}M`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChartOption(!isChartOption);
                      setIsTimeOption(false);
                    }}
                    className="chrts-btm-btn"
                  >
                    <img src="/assets/images/candel.png" alt="" />
                  </button>
                  {/* <button type="button" className="chrts-btm-btn"><img src="/assets/images/wifi.png" alt="" /></button>
                      <button type="button" onClick={() => setOpenAnalysis(!openAnalysis)} className="chrts-btm-btn"><img src="/assets/images/compass.png" alt="" /></button> */}
                </div>
              )}

              <div className="chart-bttm-box chart-bttm-box-thrd">
                {isChartOption && (
                  <ul className="nw-chrt-list">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChartOption(false);
                          setChartType("area");
                        }}
                        className="chrts-btm-btn d-flex"
                        disabled={chartType == "area" ? true : false}
                      >
                        {" "}
                        <FontAwesomeIcon icon={faAreaChart} /> Area
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setChartType("candle");
                          setIsChartOption(false);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        <MdCandlestickChart />
                        Candle
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setChartType("bar");
                          setIsChartOption(false);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        <FontAwesomeIcon icon={faBarChart} />
                        Bars{" "}
                      </button>
                    </li>
                    {/* <li><button type="button" onClick={() => setOpenAnalysis(!openAnalysis)} className="chrts-btm-btn"><MdOutlineCandlestickChart /> Heiken Ashi</button></li> */}
                  </ul>
                )}
                {isTimeOption && (
                  <ul className="nw-chrt-list chart-time d-flex">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(5);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        05S
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(15);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        15S
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(30);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        30S
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(60);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        01M
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(300);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        05M
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeOption(false);
                          setTimeFrame(600);
                        }}
                        className="chrts-btm-btn d-flex"
                      >
                        {" "}
                        10M
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* <div id="tv_chart_container" >
                      <div ref={containerRef} style={{ height: '750px', width: '100%' }} />
                    </div> */}
              {tradeForm?.autoMartingale && (
                <div className="toggle-switch-bx">
                  <ul className="nav nav-tabs toggle-bx-tab  mb-3">
                    <li className="nav-item">
                      <button
                        className="nav-link tab-new-btn active text-white  border-0"
                        id="quote-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#quote"
                        type="button"
                      >
                        {t("quote")}
                      </button>
                    </li>
                    <li className="nav-item ">
                      <button
                        className="nav-link tab-new-btn text-white border-0"
                        id="time-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#time"
                        type="button"
                      >
                        {t("time")}
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content border-top-0 rounded">
                    <div
                      className="tab-pane fade show active"
                      id="quote"
                      role="tabpanel"
                      aria-labelledby="quote-tab"
                    >
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          {t("current")} {t("quote")}
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value={data[data.length - 1]?.close}
                        />
                      </div>
                      <p className="current-pra">
                        {t("current")} {t("quote")}:{" "}
                        {data[data.length - 1]?.close}
                      </p>
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          {t("time")}
                        </label>
                        <input
                          type="text"
                          onClick={() => setTimeList(!timeList)}
                          className="form-control bg-dark text-white apl-frm"
                          value={selectedTime}
                          readOnly
                        />

                        {timeList && (
                          <div
                            className="d-flex flex-wrap bg-dark text-white border p-2"
                            style={{
                              position: "absolute",
                              zIndex: 1000,
                              top: "100%",
                              left: 0,
                              width: "100%",
                            }}
                          >
                            {times.map((time) => (
                              <div
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                style={{
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  margin: "5px",
                                  border: "1px solid gray",
                                  borderRadius: "4px",
                                }}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="pb-lg-0 pb-sm-5 mt-3">
                          <div>
                            <button
                              type="button"
                              disabled={isSubmitting || !marketStatus?.isOpen}
                              onClick={() => {
                                handleTrade("UP");
                              }}
                              className="btn btn-primary right-up-btn"
                            >
                              <div>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {t("up")}
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowUp}
                                className="fa-arrow-up"
                              />
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              disabled={isSubmitting || !marketStatus?.isOpen}
                              onClick={() => {
                                handleTrade("DOWN");
                              }}
                              className="btn btn-primary right-down-btn"
                            >
                              <div>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {t("down")}
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowDown}
                                className="fa-arrow-up fa-arrow-down"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Time Tab */}
                    <div
                      className="tab-pane fade"
                      id="time"
                      role="tabpanel"
                      aria-labelledby="time-tab"
                    >
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          Time
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="25/07 17:45:00"
                        />
                      </div>
                      <p className="current-pra">Current time:17:43:48</p>
                      <div className=" mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          Period
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="M1"
                        />

                        <div className="pb-lg-0 pb-sm-5 mt-3">
                          <div>
                            <button
                              type="button"
                              disabled
                              onClick={() => {
                                handleTrade("UP");
                              }}
                              className="btn btn-primary right-up-btn"
                            >
                              <div>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {t("up")}
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowUp}
                                className="fa-arrow-up"
                              />
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              disabled
                              onClick={() => {
                                handleTrade("DOWN");
                              }}
                              className="btn btn-primary right-down-btn"
                            >
                              <div>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {t("down")}
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowDown}
                                className="fa-arrow-up fa-arrow-down"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="trade-open-price">
                    <div className="trade-close-price">
                      <p>Trade opened with prive</p>
                      <button className=" tp-btm-second-xlose"><i className="fas fa-close"> </i></button>
                    </div>
                  </div> */}
          </div>

          <div className="nw-right-chrt-bx">
            <div className="main-right-trade-section ">
              {/* <div className="right-main-bx">
                      <div className="d-flex align-items-center gap-2">

                        <span>{pair?.startsWith('OTC') ? pair?.slice(3) : pair || "AUD/JPY"}</span>
                      </div>
                      <div className="tp-right-content">

                      </div>
                    </div> */}

              <div className="unicorn-live-content unicorn-mobile-live">
                <div>
                  <h6>Trading Panel</h6>
                  <p>Manage trades & track performance</p>
                </div>

                {isConnected && (
                  <div className="d-flex gap-2 align-items-center">
                    {marketStatus?.isOpen && <span className="unicorn-lv-title">Live</span>}
                    <a
                      href="javascript:void(0)"
                      className="d-lg-none d-sm-block tp-header-btn plus-unicorn-btn"
                      data-bs-toggle="modal"
                      onClick={() => setSearchShow(true)}
                      data-bs-target="#quotesHistoryModalTrade"
                    >
                      +
                    </a>
                  </div>
                )}
              </div>

              <div className="unicorn-divide-line"></div>

              <div className="rounded">
                <div className=" tp-auto-heading-secnd">
                  <div className="tp-auto-heading ">
                    <h6 className="fw-600 text-uppercase">
                      {" "}
                      <FontAwesomeIcon icon={faClockFour} />{" "}
                      {t("pending")} {t("trade")}
                    </h6>
                  </div>
                  <div className="form-check form-switch frm-switch-secnd">
                    <label htmlFor=""></label>
                    <input
                      className="form-check-input hp-check-inpt"
                      type="checkbox"
                      role="switch"
                      id="switchCheckChecked"
                      checked={tradeForm?.autoMartingale}
                      style={{ cursor: "pointer" }}
                      onChange={(e) =>
                        setTradeForm({
                          ...tradeForm,
                          pendingTrade: false,
                          autoMartingale: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-investment-chart">
                  <div className="text-secondary small">Investment</div>
                  <div className="text-secondary small">
                    Min {defaultCurrency == "usd" ? "$" : "₹"}
                    {minAmount} • Max{" "}
                    {defaultCurrency == "usd" ? "$" : "₹"}
                    {maxAmount}
                  </div>
                </div>

              </div>
              <div className="investment-box ">
                {/* <div className="d-flex justify-content-between">
                        <div className="text-secondary small">Investment</div>
                        <div className="text-secondary small">
                          Min {defaultCurrency == "usd" ? "$" : "₹"}
                          {minAmount} • Max{" "}
                          {defaultCurrency == "usd" ? "$" : "₹"}
                          {maxAmount}
                        </div>
                      </div> */}

                <div className="login-section right-login-section pt-0 pb-0 pb-lg-0 position-relative">
                  <div className="trade-input-box ">
                    <span
                      className="label"
                      data-bs-toggle="modal"
                      data-bs-target="#timgingModal"
                    >
                      Time
                    </span>
                    <div className="trade-control">
                      <button className="ctrl-btn" onClick={decreaseTime}>
                        −
                      </button>
                      <input
                        type="text"
                        className="trade-input"
                        value={formatExpireTime(tradeForm.time)}
                        readOnly
                        style={{ cursor: "pointer" }}
                        data-bs-toggle="modal"
                        data-bs-target="#timgingModal"
                      />
                      <button className="ctrl-btn" onClick={increaseTime}>
                        +
                      </button>
                    </div>
                    <div
                      className="modal step-modal fade"
                      id="timgingModal"
                      data-bs-backdrop="true"
                      data-bs-keyboard="false"
                      tabindex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-right modal-sm nw-timing-trade-modal">
                        <div className="modal-content timing-all-bx">
                          <div className="modal-body p-0">
                            <div className=" grid-btn-bx">
                              <div className="timging-grid-btn px-2 d-flex gap-3">

                                {/* LEFT SIDE (15 min slots) */}
                                <ul>
                                  {leftTimes.map((time, i) => (
                                    <li key={i}>
                                      <button
                                        className="trade-timing-btn"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                          let diffSec = Math.floor((time.getTime() - Date.now()) / 1000);
                                          if (diffSec < 60) diffSec = 60;
                                          setTradeForm({
                                            ...tradeForm,
                                            time: diffSec,
                                          });
                                          localStorage.setItem("tradeTime", diffSec);
                                        }}
                                      >
                                        {formatExpireTime(time)}
                                      </button>
                                    </li>
                                  ))}
                                </ul>

                                {/* RIGHT SIDE (next minutes) */}
                                <ul>
                                  {rightTimes.map((time, i) => (
                                    <li key={i}>
                                      <button
                                        className="trade-timing-btn"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                          let diffSec = Math.floor((time.getTime() - Date.now()) / 1000);
                                          if (diffSec < 60) diffSec = 60;
                                          setTradeForm({
                                            ...tradeForm,
                                            time: diffSec,
                                          });
                                          localStorage.setItem("tradeTime", diffSec);
                                        }}
                                      >
                                        {formatExpireTime(time)}
                                      </button>
                                    </li>
                                  ))}
                                </ul>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* desktop show start*/}
                <div className="desktop-unicorn-ammount-box">
                  <button
                    onClick={() =>
                      setTradeForm({
                        ...tradeForm,
                        amount:
                          tradeForm.amount > 10
                            ? tradeForm.amount - 10
                            : 10,
                      })
                    }
                    className="invest-btn d-flex align-items-center justify-content-center"
                  >
                    −
                  </button>

                  <div className="flex-fill text-center invest-amount">
                    <div className="trade-unicorn-amount-content">
                      <span className="unicron-price-title">Amount {defaultCurrency == "usd" ? "$" : "₹"}</span>
                    </div>
                    <div className="fs-6 fw-bold text-white d-flex align-items-center justify-content-center text-center">
                      <input
                        type="number"
                        className="form-control amountInput text-center mb-0 pb-0 pt-0"
                        min={0}
                        onChange={(e) =>
                          setTradeForm({
                            ...tradeForm,
                            amount: e.target.value,
                          })
                        }
                        value={tradeForm?.amount}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setTradeForm({
                        ...tradeForm,
                        amount: tradeForm.amount + 10,
                      })
                    }
                    className="invest-btn d-flex align-items-center justify-content-center"
                  >
                    +
                  </button>
                </div>
                {/* desktop show end*/}

                {/* mobile show start*/}
                <div className="mobile-unicorn-amount-box">


                  <div className="flex-fill text-center invest-amount">
                    <button
                      onClick={() =>
                        setTradeForm({
                          ...tradeForm,
                          amount:
                            tradeForm.amount > 10
                              ? tradeForm.amount - 10
                              : 10,
                        })
                      }
                      className="invest-btn d-flex align-items-center justify-content-center"
                    >
                      −
                    </button>

                    <div className="mobile-invest-amount">
                      <div className="trade-unicorn-amount-content">
                        <span className="unicron-price-title">Amount {defaultCurrency == "usd" ? "$" : "₹"}</span>
                      </div>
                      <div className="fs-6 fw-bold text-white d-flex align-items-center justify-content-center text-center">
                        <input
                          type="number"
                          className="form-control amountInput text-center mb-0 pb-0"
                          min={0}
                          onChange={(e) =>
                            setTradeForm({
                              ...tradeForm,
                              amount: e.target.value,
                            })
                          }
                          value={tradeForm?.amount}
                        />
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        setTradeForm({
                          ...tradeForm,
                          amount: tradeForm.amount + 10,
                        })
                      }
                      className="invest-btn d-flex align-items-center justify-content-center"
                    >
                      +
                    </button>

                  </div>


                </div>
                {/* mobile show end*/}

                <div>
                  {defaultCurrency == "inr" ? (
                    <ul className="quick-btn-list">
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 500 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}500
                        </button>
                      </li>
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 1000 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}1000
                        </button>
                      </li>
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 5000 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}5000
                        </button>
                      </li>
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 10000 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}10000
                        </button>{" "}
                      </li>
                    </ul>
                  ) : (
                    <ul className="quick-btn-list">
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 5 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}5
                        </button>
                      </li>
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 10 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}10
                        </button>
                      </li>
                      <li className="quick-item">
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 50 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}50
                        </button>
                      </li>
                      <li className="quick-item">
                        {" "}
                        <button
                          onClick={() =>
                            setTradeForm({ ...tradeForm, amount: 100 })
                          }
                          className="quick-btn"
                        >
                          {defaultCurrency == "usd" ? "$" : "₹"}100
                        </button>{" "}
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              {marketStatus?.isOpen && <div className=" payout-card mobile-pay-cards">
                <span className="ai-title"> <b className="fz-14"> 🤖 Unicorn Mascot </b><br />
                  {pair?.startsWith('OTC') ? pair?.slice(3) : pair} trending {trend}</span>
                {userTrade?.length > 0 && <button className="btn-repeat-btn" onClick={handleRepeat}>Repeat</button>}
              </div>}
              <div className=" payout-card">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div>
                    <div className="">
                      <span className="payout-title">Your payout</span>
                    </div>
                    <div className="">
                      <span className="currency-title"> {" "}
                        {userData?.currency === "inr" ||
                          defaultCurrency === "inr"
                          ? " ₹"
                          : " $"}{" "}
                        {(
                          Number(tradeForm?.amount) +
                          (Number(tradeForm?.amount) * (winPer || 50)) / 100
                        ).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="">
                      <span className="payout-title">Return</span>
                    </div>
                    <div className="">
                      <span className="profit-inrr-title"> +{userData?.levelId?.rateOfReturn || 0}%{" "}
                        {t("profit")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {tradeForm?.pendingTrade && (
                <div className="mobile-toggle ">
                  <ul className="nav nav-tabs toggle-bx-tab  mb-3">
                    <li className="nav-item ">
                      <button
                        className="nav-link active text-white border-0"
                        id="m-quote-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#m-quote"
                        type="button"
                      >
                        {t("quote")}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link text-white border-0"
                        id="m-time-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#m-time"
                        type="button"
                      >
                        {t("time")}
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content border-top-0 rounded">
                    <div
                      className="tab-pane fade show active"
                      id="m-quote"
                      role="tabpanel"
                      aria-labelledby="m-quote-tab"
                    >
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          {t("current")} {t("quote")}
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="96.967"
                        />
                      </div>
                      <p className="current-pra">
                        {t("current")} {t("quote")}: 96.962
                      </p>
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          {t("time")}
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="M1"
                        />
                      </div>
                      <div className="pb-lg-0 pb-sm-5 mt-3">
                        <div>
                          <button
                            type="button"
                            disabled={isSubmitting || !marketStatus?.isOpen}
                            onClick={() => {
                              handleTrade("UP");
                            }}
                            className="btn btn-primary right-up-btn"
                          >
                            <div>
                              <i className="fa-regular fa-clock"></i>{" "}
                              {t("up")}
                            </div>
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              className="fa-arrow-up"
                            />
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            disabled={isSubmitting || !marketStatus?.isOpen}
                            onClick={() => {
                              handleTrade("DOWN");
                            }}
                            className="btn btn-primary right-down-btn"
                          >
                            <div>
                              <i className="fa-regular fa-clock"></i>{" "}
                              {t("down")}
                            </div>
                            <FontAwesomeIcon
                              icon={faArrowDown}
                              className="fa-arrow-up fa-arrow-down"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Time Tab */}
                    <div
                      className="tab-pane fade"
                      id="m-time"
                      role="tabpanel"
                      aria-labelledby="m-time-tab"
                    >
                      <div className="mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          Time
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="25/07 17:45:00"
                        />
                      </div>
                      <p className="current-pra">Current time:17:43:48</p>
                      <div className=" mb-2 custom-frm-bx apl-bx">
                        <label className="form-label text-secondary">
                          Period
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white apl-frm"
                          value="M1"
                        />
                      </div>

                      <div className="pb-lg-0 pb-sm-5 mt-3">
                        <div>
                          <button
                            type="button"
                            disabled={isSubmitting || !marketStatus?.isOpen}
                            onClick={() => {
                              handleTrade("UP");
                            }}
                            className="btn btn-primary right-up-btn"
                          >
                            <div>
                              <i className="fa-regular fa-clock"></i>{" "}
                              {t("up")}
                            </div>
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              className="fa-arrow-up"
                            />
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            disabled={isSubmitting || !marketStatus?.isOpen}
                            onClick={() => {
                              handleTrade("DOWN");
                            }}
                            className="btn btn-primary right-down-btn"
                          >
                            <div>
                              <i className="fa-regular fa-clock"></i>{" "}
                              {t("down")}
                            </div>
                            <FontAwesomeIcon
                              icon={faArrowDown}
                              className="fa-arrow-up fa-arrow-down"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!tradeForm?.autoMartingale && (
                <div className="pb-lg-0">
                  <div className="mb-up-down-bx">
                    <div className="mb-up-down-btn">
                      <button
                        type="button"
                        disabled={isSubmitting || !marketStatus?.isOpen}
                        onClick={() => {
                          handleTrade("UP");
                        }}
                        className="btn btn-primary right-up-btn"
                      >
                        {t("up")}
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="fa-arrow-up"
                        />
                      </button>
                    </div>

                    <div className="mb-up-down-btn">
                      <button
                        type="button"
                        disabled={isSubmitting || !marketStatus?.isOpen}
                        onClick={() => {
                          handleTrade("DOWN");
                        }}
                        className="btn btn-primary right-down-btn"
                      >
                        {t("down")}{" "}
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="fa-arrow-up fa-arrow-down"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {userTrade?.length > 4 &&
                userTrade?.slice(0, 5)?.every(item => item.status == "win") &&
                <span className="win-info">5 Wins in a row! You are on fire! 🔥</span>
              }
            </div>

            {isLogin && !tradeForm.autoMartingale && (
              <div className=" mt-3 position-relative mobile-nw-data-tabs">
                <div className="panel-body ">
                  <ul
                    className="nav-tabs nav-fill d-flex tp-nw-data-tabs border-0 pb-0 mb-0"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <button
                        onClick={() => setHistoryTab("trades")}
                        className={`nav-link ${historyTab == "trades" && "active"}`}
                        id="trade-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#trades"
                      >
                        Trades ({totalUserTrade})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        onClick={() => setHistoryTab("orders")}
                        className={`nav-link ${historyTab == "orders" && "active"}`}
                        id="orders-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#orders"
                      >
                        Orders ({totalUserOrder})
                      </button>
                    </li>
                  </ul>

                  <div className="left-navigation tab-content first-tab-content mt-2">
                    {historyTab == "trades" && (
                      <div
                        className="tab-pane fade show active"
                        id="trades"
                      >
                        <div className="first-side-trade">

                          {userTrade?.length > 0 &&
                            Object.entries(
                              userTrade.reduce((acc, trade) => {
                                const dateKey = new Date(
                                  trade.createdAt,
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                });

                                if (!acc[dateKey]) acc[dateKey] = [];
                                acc[dateKey].push(trade);
                                return acc;
                              }, {}),
                            ).map(([date, trades], dateIndex) => (
                              <div key={dateIndex}>
                                <div className="trade-date-header">
                                  <h5>{date}</h5>
                                </div>
                                {trades.slice(0, 9).map((item, key) => (
                                  <div
                                    className="trade-tab-box trade-tab-fv-bx position-relative"
                                    key={key}
                                  >
                                    <div className="d-flex align-items-center justify-content-between" style={{ cursor: "default" }}>
                                      <div className="trde-tab-image-bx trde-tab-image-bx-secnd">
                                        <h6 className="mb-0">
                                          {item?.tradePair?.startsWith(
                                            "OTC",
                                          )
                                            ? item?.tradePair?.slice(3)
                                            : item?.tradePair}
                                        </h6>
                                      </div>
                                      <div className="trade-contant">
                                        {new Date(item?.endTime) > new Date() ? (
                                          <TradeTimer endTime={item?.endTime} />
                                        ) : (
                                          <p className="mb-0">
                                            {isConnected && formatSecondsToHHMMSS(item?.time || 30)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className="d-flex align-items-center justify-content-between trade-inr"
                                      style={{ fontSize: "15px", cursor: "default" }}
                                    >
                                      <div>
                                        <a
                                          href="javascript:void(0)"
                                          className="text-success text-uppercase "
                                          style={{ cursor: "default" }}

                                        >
                                          <FontAwesomeIcon
                                            icon={
                                              item?.type === "UP"
                                                ? faArrowUp
                                                : faArrowDown
                                            }
                                            className="fa-arrow-up"
                                          />
                                          {/* {item?.amount} {item?.currency} */}
                                          {convertAmount(
                                            Number(item?.amount),
                                            item?.currency || "INR", // trade kis currency me lagi thi
                                            userData?.currency, // user ne kya select kiya hai (USD/INR)
                                          ).toFixed(2)}{" "}
                                          {userData?.currency}
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          href="javascript:void(0)"
                                          className="text-danger text-uppercase"
                                          style={{ cursor: "default" }}
                                        >
                                          {item?.status === "pending" &&
                                            pair === item?.tradePair &&
                                            ((item?.type === "UP" &&
                                              item?.close <
                                              data[data?.length - 1]
                                                ?.close) ||
                                              (item?.type === "DOWN" &&
                                                item?.close >
                                                data[data?.length - 1]
                                                  ?.close)) ? (
                                            <span className="text-success">
                                              +
                                              {convertAmount(
                                                Number(item?.amount) +
                                                (Number(item?.amount) *
                                                  winPer) /
                                                100,
                                                item?.currency || "INR", // trade kis currency me lagi thi
                                                userData?.currency, // user ne kya select kiya hai (USD/INR)
                                              ).toFixed(2)}{" "}
                                              {userData?.currency}
                                            </span>
                                          ) : item?.status === "win" ? (
                                            <span className="text-success">
                                              +
                                              {convertAmount(
                                                Number(item?.amount) +
                                                Number(item?.profit),
                                                item?.currency || "INR",
                                                userData?.currency,
                                              ).toFixed(2)}{" "}
                                              {userData?.currency}
                                            </span>
                                          ) : (
                                            `0 ${userData?.currency}`
                                          )}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>

                        {userTrade?.length > 9 && (
                          <div className="trade-view-bx">
                            <Link
                              to="/deposit?type=trades"
                              className="trade-view-all-btn"
                            >
                              View All History
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                    {historyTab == "orders" && (
                      <div
                        className="tab-pane fade show active"
                        id="orders"
                      >
                        <div className="first-side-trade">
                          {userOrder?.length > 0 ? (
                            userOrder?.map((item, key) => (
                              <div
                                key={key}
                                className="trade-tab-box trade-tab-fv-bx position-relative"
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="trde-tab-image-bx trde-tab-image-bx-secnd">
                                    <h6 className="mb-0">
                                      {item?.tradePair?.startsWith("OTC")
                                        ? item?.tradePair?.slice(3)
                                        : item?.tradePair}
                                    </h6>
                                  </div>
                                  <div className="trade-contant">
                                    <a
                                      href=""
                                      className="trade-inr-btn trade-inr-btn-dwn"
                                    >
                                      <FontAwesomeIcon
                                        icon={
                                          item?.type == "UP"
                                            ? faArrowUp
                                            : faArrowDown
                                        }
                                        className="fa-arrow-up"
                                      />
                                    </a>
                                  </div>
                                </div>
                                <div className=" trade-inr trade-ordr-bx">
                                  <ul>
                                    <li>
                                      {t("amount")}:
                                      <span className="text-uppercase">
                                        {item?.amount} {item?.currency}
                                      </span>
                                    </li>
                                    <li>
                                      {t("time")}:
                                      <span>
                                        {formatOrderTime(item?.time)}
                                      </span>
                                    </li>
                                    <li>
                                      {t("openingQuote")}:
                                      <span>{item?.openPrice}</span>
                                    </li>
                                    <li>
                                      {t("profit")}:
                                      <span className="text-uppercase">
                                        {item?.profit?.toFixed() || 0}{" "}
                                        {item?.currency}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="order-view-bx">
                                  {item?.status !== "closed" ? (
                                    <button
                                      className="trade-view-all-btn"
                                      onClick={() =>
                                        closeOrder(item?._id)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  ) : (
                                    <span
                                      className="text-capitalize cursor-none"
                                      style={{ cursor: "text" }}
                                    >
                                      {item?.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-white">
                              No orders found
                            </span>
                          )}
                          {totalUserOrder.length > 9 && (
                            <div className="trade-view-bx">
                              <a href="" className="trade-view-all-btn">
                                View All History
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bttm-robot-box ms-auto mt-3 me-3">
              <button
                type="button chat-btn-fixed"
                onClick={() => setChatShow(true)}
              >
                <img src="/assets/images/right-bottom.png" alt="" />
              </button>
            </div>
            {/* <div className="bttm-robot-box ms-auto" onClick={onToggle}>
                    <a href="javascript:void(0)">
                      <img src="/assets/images/right-bottom.png" alt="open chat" />
                    </a>
                  </div> */}
          </div>
        </div>
      </main>

      <SearchTrade show={searchShow} handleClose={() => setSearchShow(false)} />

      {/* Modal */}
      {/* <Wallet show={show} handleClose={handleClose} /> */}
      <ChatBox show={chatShow} handleClose={handleChatClose} />
      {/* <TechnicalAnalysis openAnalysis={openAnalysis} handleAnalysis={handleAnalysis}/> */}







    </>
  );
}

export default TradeFirst;
