const calculateZigZag = (data, threshold = 0.0001) => { // threshold can be a percentage (e.g., 0.01 for 1%)
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
const calculateSMA = (data, period) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      // Not enough data yet to calculate the average
      result.push({ time: data[i].time, value: null });
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += Number(data[i - j].close);
      }
      const average = sum / period;
      result.push({ time: data[i].time, value: average });
    }
  }
  return result;
};
const calculateEMA = (data, period) => {
  if (!data || data.length === 0) return [];
  
  const smoothingFactor = 2 / (period + 1);
  const emaData = [];
  
  let emaValue = 0;
  
  // Use SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += Number(data[i].close);
  }
  emaValue = sum / period;
  
  // Push null values for the initial period where EMA is not yet calculated
  for (let i = 0; i < period; i++) {
    emaData.push({ time: data[i].time, value: null });
  }

  // Calculate EMA for the rest of the data
  for (let i = period; i < data.length; i++) {
    const currentPrice = Number(data[i].close);
    emaValue = (currentPrice * smoothingFactor) + (emaValue * (1 - smoothingFactor));
    emaData.push({ time: data[i].time, value: emaValue });
  }
  
  return emaData;
};
const calculateParabolicSAR = (data, initialAF = 0.02, maxAF = 0.2) => {
  if (!data || data.length === 0) return [];

  const sarData = [];
  let isUptrend = true;
  let ep = data[0].low;
  let af = initialAF;
  let sar = data[0].high;

  // Initial null values
  sarData.push({ time: data[0].time, value: null });

  for (let i = 1; i < data.length; i++) {
    const currentHigh = Number(data[i].high);
    const currentLow = Number(data[i].low);
    const prevSAR = sar;

    if (isUptrend) {
      sar = prevSAR + af * (ep - prevSAR);
      if (currentHigh > ep) {
        ep = currentHigh;
        af = Math.min(af + initialAF, maxAF);
      }
      if (currentLow < sar) {
        isUptrend = false;
        sar = ep;
        ep = currentLow;
        af = initialAF;
      }
    } else {
      sar = prevSAR - af * (prevSAR - ep);
      if (currentLow < ep) {
        ep = currentLow;
        af = Math.min(af + initialAF, maxAF);
      }
      if (currentHigh > sar) {
        isUptrend = true;
        sar = ep;
        ep = currentHigh;
        af = initialAF;
      }
    }
    sarData.push({ time: data[i].time, value: sar });
  }

  return sarData;
};
const calculateIchimoku = (data, tenkanPeriod = 9, kijunPeriod = 26, senkouPeriod = 52, plotAhead = 26) => {
  if (!data || data.length === 0) return [];
  
  const ichimokuData = [];
  
  for (let i = 0; i < data.length; i++) {
    const time = data[i].time;
    
    // Tenkan-sen (9 periods)
    const tenkanSlice = data.slice(Math.max(0, i - tenkanPeriod + 1), i + 1);
    const tenkanHigh = Math.max(...tenkanSlice.map(d => d.high));
    const tenkanLow = Math.min(...tenkanSlice.map(d => d.low));
    const tenkan = (tenkanHigh + tenkanLow) / 2;
    
    // Kijun-sen (26 periods)
    const kijunSlice = data.slice(Math.max(0, i - kijunPeriod + 1), i + 1);
    const kijunHigh = Math.max(...kijunSlice.map(d => d.high));
    const kijunLow = Math.min(...kijunSlice.map(d => d.low));
    const kijun = (kijunHigh + kijunLow) / 2;
    
    // Senkou Span A (plots ahead)
    let senkouA = null;
    if (i >= kijunPeriod) {
      senkouA = (tenkan + kijun) / 2;
    }
    
    // Senkou Span B (plots ahead)
    let senkouB = null;
    const senkouSlice = data.slice(Math.max(0, i - senkouPeriod + 1), i + 1);
    const senkouHigh = Math.max(...senkouSlice.map(d => d.high));
    const senkouLow = Math.min(...senkouSlice.map(d => d.low));
    senkouB = (senkouHigh + senkouLow) / 2;
    
    // Chikou Span (plots behind)
    const chikou = data[i].close;
    
    ichimokuData.push({
      time,
      tenkan,
      kijun,
      senkouA,
      senkouB,
      chikou
    });
  }
  
  return ichimokuData;
};
function calculateRSI(data, period = 14) {
  if (data.length < period) return [];

  const rsiData = [];
  let gain = 0;
  let loss = 0;

  // Initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) gain += change;
    else loss -= change;
  }

  gain /= period;
  loss /= period;
  let rs = gain / loss;
  rsiData[period] = { time: data[period].time, value: 100 - 100 / (1 + rs) };

  // Remaining points
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const currentGain = change > 0 ? change : 0;
    const currentLoss = change < 0 ? -change : 0;

    gain = (gain * (period - 1) + currentGain) / period;
    loss = (loss * (period - 1) + currentLoss) / period;

    rs = gain / (loss || 1e-10); // avoid division by zero
    const rsi = 100 - 100 / (1 + rs);

    rsiData.push({ time: data[i].time, value: rsi });
  }

  return rsiData;
}

const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!data || data.length < slowPeriod) return { macd: [], signal: [], histogram: [] };

  const fastEMAData = calculateEMA(data, fastPeriod);
  const slowEMAData = calculateEMA(data, slowPeriod);
  
  const macdData = [];
  
  // Calculate the MACD line
  for (let i = 0; i < data.length; i++) {
    const fastValue = fastEMAData[i]?.value;
    const slowValue = slowEMAData[i]?.value;
    
    if (fastValue !== null && slowValue !== null) {
      const macdValue = fastValue - slowValue;
      macdData.push({ time: data[i].time, value: macdValue });
    } else {
      macdData.push({ time: data[i].time, value: null });
    }
  }

  // Calculate the Signal line (EMA of the MACD line)
  const signalData = calculateEMA(macdData, signalPeriod);
  
  const histogramData = [];
  
  // Calculate the Histogram
  for (let i = 0; i < macdData.length; i++) {
    const macdValue = macdData[i]?.value;
    const signalValue = signalData[i]?.value;
    
    if (macdValue !== null && signalValue !== null) {
      const histogramValue = macdValue - signalValue;
      histogramData.push({ time: data[i].time, value: histogramValue });
    } else {
      histogramData.push({ time: data[i].time, value: null });
    }
  }

  return { macd: macdData, signal: signalData, histogram: histogramData };
};

function aggregateTo1Min(data) {
      const result = [];
      for (let i = 0; i < data.length; i += 4) { // 4 × 15s = 1 min
        const slice = data.slice(i, i + 4);
        if (slice.length < 4) continue; // skip incomplete minute
        const open = slice[0].open;
        const close = slice[slice.length - 1].close;
        const high = Math.max(...slice.map(c => c.high));
        const low = Math.min(...slice.map(c => c.low));
        const time = slice[0].time - (slice[0].time % 60); // round to minute
        result.push({ time, open, high, low, close });
      }
      return result;
    }
export default calculateZigZag;
export {aggregateTo1Min, calculateSMA ,calculateEMA,calculateParabolicSAR,calculateIchimoku,calculateRSI,calculateMACD};