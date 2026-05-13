// public/custom-datafeed.js
export const customDatafeed = {
  onReady: (callback) => {
    setTimeout(() => callback({
      supported_resolutions: ['1', '5', '15', '30', '60', '1D'],
      supports_marks: false,
      supports_time: true,
      supports_group_request: false,
    }), 0);
  },

  resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
    onSymbolResolvedCallback({
      name: symbolName,
      type: 'crypto',
      session: '24x7',
      ticker: symbolName,
      timezone: 'Etc/UTC',
      exchange: 'Custom',
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      supported_resolutions: ['1', '5', '15', '30', '60', '1D'],
      volume_precision: 2,
      data_status: 'streaming',
    });
  },

  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) => {
    try {
      const url = `${YOUR_BACKEND_API}/history?pair=${symbolInfo.name}&resolution=${resolution}&from=${from}&to=${to}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!result || !result.length) {
        onHistoryCallback([], { noData: true });
        return;
      }

      const bars = result.map((bar) => ({
        time: bar.time * 1000, // milliseconds
        low: bar.low,
        high: bar.high,
        open: bar.open,
        close: bar.close,
        volume: bar.volume,
      }));

      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.error("Error fetching bars:", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    const socket = io(YOUR_SOCKET_URL);

    socket.emit("subscribeTicker", symbolInfo.name);

    socket.on("candle", (candle) => {
      if (candle.symbol !== symbolInfo.name) return;

      const bar = {
        time: candle.time * 1000,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      };

      onRealtimeCallback(bar);
    });

    // Store socket reference by UID so it can be unsubscribed
    window.tvSockets = window.tvSockets || {};
    window.tvSockets[subscribeUID] = socket;
  },

  unsubscribeBars: (subscriberUID) => {
    if (window.tvSockets && window.tvSockets[subscriberUID]) {
      window.tvSockets[subscriberUID].disconnect();
      delete window.tvSockets[subscriberUID];
    }
  },
};
