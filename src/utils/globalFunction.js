 const getRemainingSeconds = (minute) => {
  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // agar same minute hai → current seconds se start
  if (currentMinute === minute) {
    return currentSecond;
  }

  // warna full minute ka countdown
  return 59;
};
const formatActivityMessage = (data) => {
  const { user, amount, symbol, type, result, profit } = data;

  // OTC remove karo
  const cleanSymbol = symbol.replace("OTC", "");

  // currency symbol
  let formattedAmount = amount;
  if (amount.toLowerCase().includes("inr")) {
    formattedAmount = "₹" + amount.replace("inr", "").trim();
  } else if (amount.toLowerCase().includes("usd")) {
    formattedAmount = "$" + amount.replace("usd", "").trim();
  }

  if (!result) {
    return `${user} just placed ${formattedAmount} on ${cleanSymbol} ${type}`;
  }

  if (result === "WIN") {
    return `💰 ${user} won ${formattedAmount} on ${cleanSymbol}`;
  }

  if (result === "LOSS") {
    return `❌ ${user} lost ${formattedAmount} on ${cleanSymbol}`;
  }
};
const c2c = {
  USD: "us", EUR: "eu", GBP: "gb", JPY: "jp",
  AUD: "au", CAD: "ca", CHF: "ch", NZD: "nz",
  INR: "in", CNY: "cn", HKD: "hk", SGD: "sg",
  MXN: "mx", BRL: "br", RUB: "ru", ZAR: "za",
  VND: "vn", NGN: "ng", COP: "co", QAR: "qa",
  YER: "ye", TRY: "tr", SEK: "se", NOK: "no",
};

const getPairParts = (symbol) => {
  const clean = symbol.startsWith("OTC")
    ? symbol.slice(3)
    : symbol;

  // Forex
  if (clean.includes("/")) {
    return clean.split("/");
  }

  // EURUSD type
  if (clean.length === 6) {
    return [clean.slice(0, 3), clean.slice(3)];
  }

  // Crypto
  if (clean.endsWith("USDT")) {
    return [clean.replace("USDT", ""), null];
  }

  return [clean, null];
};
const generateTimeSlots = () => {
  const now = new Date();

  // 🔹 RIGHT SIDE (running minutes)
  const rightTimes = [];
  for (let i = 1; i <= 5; i++) {
    const t = new Date(now.getTime() + i * 60000);
    rightTimes.push(t);
  }

  // 🔹 LEFT SIDE (15 min slots)
  const leftTimes = [];
  let base = new Date(now);

  // round to next 15 min
  const minutes = base.getMinutes();
  const next15 = Math.ceil(minutes / 15) * 15;
  base.setMinutes(next15, 0, 0);

  for (let i = 0; i < 5; i++) {
    leftTimes.push(new Date(base.getTime() + i * 15 * 60000));
  }

  return { leftTimes, rightTimes };
};
export {getRemainingSeconds,generateTimeSlots,formatActivityMessage,getPairParts,c2c}