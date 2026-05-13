// indicators/indicators.js
import {
  SMA,
  EMA,
  WMA,
//   DEMA,
//   TEMA,
  WEMA,
  MACD,
  RSI,
  BollingerBands,
  Stochastic,
  ADX,
  ATR,
  MFI,//
  OBV,
  ROC,//
  VWAP,
  PSAR,//
  IchimokuCloud,
  TRIX,
//   AverageGain,
//   AverageLoss,
  WilliamsR,
  CCI,
//   ForceIndex,
//   KST,
//   PVT,
//   UltimateOscillator,
//   TR,
} from "technicalindicators";

// ---------------------------
// Utility
// ---------------------------
const getPriceArrays = (data) => ({
  close: data.map((d) => Number(d.close)),
  open: data.map((d) => Number(d.open)),
  high: data.map((d) => Number(d.high)),
  low: data.map((d) => Number(d.low)),
  volume: data.map((d) => Number(d.volume || 0)),
  time: data.map((d) => d.time),
});

// ---------------------------
// Moving Averages
// ---------------------------
export const calculateSMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = SMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateEMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = EMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateWMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = WMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateDEMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = DEMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateTEMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = TEMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateWEMA = (data, period = 20) => {
  const { close, time } = getPriceArrays(data);
  const values = WEMA.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

// ---------------------------
// Momentum / Oscillators
// ---------------------------
export const calculateRSI = (data, period = 14) => {
  const { close, time } = getPriceArrays(data);
  const values = RSI.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateStochastic = (data, period = 14, signalPeriod = 3) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = Stochastic.calculate({
    high,
    low,
    close,
    period,
    signalPeriod,
  });
  const start = data.length - values.length;
  return values.map((v, i) => ({
    time: time[i + start],
    k: v.k,
    d: v.d,
  }));
};

export const calculateWilliamsR = (data, period = 14) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = WilliamsR.calculate({ high, low, close, period });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateCCI = (data, period = 20) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = CCI.calculate({ high, low, close, period });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateTRIX = (data, period = 18) => {
  const { close, time } = getPriceArrays(data);
  const values = TRIX.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateUltimateOscillator = (data) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = UltimateOscillator.calculate({ high, low, close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

// ---------------------------
// Trend / Volatility
// ---------------------------
export const calculateADX = (data, period = 14) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = ADX.calculate({ high, low, close, period });
  const start = data.length - values.length;
  return values.map((v, i) => ({
    time: time[i + start],
    value: v.adx,
  }));
};

export const calculateATR = (data, period = 14) => {
  const { high, low, close, time } = getPriceArrays(data);
  const values = ATR.calculate({ high, low, close, period });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  const { close, time } = getPriceArrays(data);
  const values = BollingerBands.calculate({ period, values: close, stdDev });
  const start = data.length - values.length;
  return values.map((v, i) => ({
    time: time[i + start],
    upper: v.upper,
    middle: v.middle,
    lower: v.lower,
  }));
};

export const calculateParabolicSAR = (data, step = 0.02, max = 0.2) => {
  const { high, low, time } = getPriceArrays(data);
  const values = PSAR.calculate({ step, max, high, low });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateIchimoku = (data) => {
  const { high, low, close, time } = getPriceArrays(data);
  const ichimoku = IchimokuCloud.calculate({
    high,
    low,
    conversionPeriod: 9,
    basePeriod: 26,
    spanPeriod: 52,
    displacement: 26,
  });
  const start = data.length - ichimoku.length;
  return ichimoku.map((v, i) => ({
    time: time[i + start],
    tenkan: v.conversion,
    kijun: v.base,
    senkouA: v.spanA,
    senkouB: v.spanB,
    chikou: close[i + start - 26] || null,
  }));
};

// ---------------------------
// Volume / Money Flow
// ---------------------------
export const calculateMFI = (data, period = 14) => {
  const { high, low, close, volume, time } = getPriceArrays(data);
  const values = MFI.calculate({ high, low, close, volume, period });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateOBV = (data) => {
  const { close, volume, time } = getPriceArrays(data);
  const values = OBV.calculate({ close, volume });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateVWAP = (data) => {
  const { close, high, low, volume, time } = getPriceArrays(data);
  const values = VWAP.calculate({ close, high, low, volume });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculatePVT = (data) => {
  const { close, volume, time } = getPriceArrays(data);
  const values = PVT.calculate({ close, volume });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

// ---------------------------
// Other Indicators
// ---------------------------
export const calculateROC = (data, period = 12) => {
  const { close, time } = getPriceArrays(data);
  const values = ROC.calculate({ period, values: close });
  const start = data.length - values.length;
  return values.map((v, i) => ({ time: time[i + start], value: v }));
};

export const calculateMACD = (data) => {
  const { close, time } = getPriceArrays(data);
  const macd = MACD.calculate({
    values: close,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const start = data.length - macd.length;
  return {
    macd: macd.map((v, i) => ({ time: time[i + start], value: v.MACD })),
    signal: macd.map((v, i) => ({ time: time[i + start], value: v.signal })),
    histogram: macd.map((v, i) => ({
      time: time[i + start],
      value: v.histogram,
    })),
  };
};

// ---------------------------
// Custom (Non-Built-in)
// ---------------------------
export const calculateZigZag = (data, threshold = 0.0001) => { // threshold can be a percentage (e.g., 0.01 for 1%)
  if (!data || data.length === 0) return [];
  
  const zigZagData = [];
  let lastPivot = data[0];
  let lastPivotType = null; // 'low' or 'high'

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const priceChange = (current.close - lastPivot.close) / lastPivot.close;

    if (lastPivotType === null) {
      if (priceChange >= threshold) {
        // New high pivot
        zigZagData.push({ time: lastPivot.time, value: lastPivot.high });
        zigZagData.push({ time: current.time, value: current.high });
        lastPivot = current;
        lastPivotType = 'high';
      } else if (priceChange <= -threshold) {
        // New low pivot
        zigZagData.push({ time: lastPivot.time, value: lastPivot.low });
        zigZagData.push({ time: current.time, value: current.low });
        lastPivot = current;
        lastPivotType = 'low';
      }
    } else if (lastPivotType === 'high') {
      if (current.high > lastPivot.high) {
        // Continue the trend, update pivot
        lastPivot = current;
        zigZagData[zigZagData.length - 1].value = lastPivot.high;
        zigZagData[zigZagData.length - 1].time = lastPivot.time;
      } else if (priceChange <= -threshold) {
        // Reversal to a low pivot
        zigZagData.push({ time: current.time, value: current.low });
        lastPivot = current;
        lastPivotType = 'low';
      }
    } else if (lastPivotType === 'low') {
      if (current.low < lastPivot.low) {
        // Continue the trend, update pivot
        lastPivot = current;
        zigZagData[zigZagData.length - 1].value = lastPivot.low;
        zigZagData[zigZagData.length - 1].time = lastPivot.time;
      } else if (priceChange >= threshold) {
        // Reversal to a high pivot
        zigZagData.push({ time: current.time, value: current.high });
        lastPivot = current;
        lastPivotType = 'high';
      }
    }
  }
  
  return zigZagData;
};
export const calculateVolumeProfile = (data, bucketSize = 20) => {
  if (!data || !data.length) return [];

  // Get min/max price
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  // Divide into buckets
  const bucketCount = bucketSize;
  const step = priceRange / bucketCount;

  const profile = Array(bucketCount)
    .fill(0)
    .map((_, i) => ({
      price: minPrice + i * step,
      volume: 0,
    }));

  // Distribute volume across buckets based on candle price
  data.forEach(candle => {
    const avgPrice = (candle.high + candle.low + candle.close) / 3;
    const idx = Math.floor((avgPrice - minPrice) / step);
    if (idx >= 0 && idx < bucketCount) {
      profile[idx].volume += candle.volume || 0;
    }
  });

  return profile;
};


