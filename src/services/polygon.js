import axios from 'axios'

// Polygon.io uses 'C:' prefix for forex tickers (e.g., C:EURUSD)
function tickerFor(pair) {
  return `C:${pair.toUpperCase()}`
}

// Returns candlesticks acceptable for lightweight-charts
export async function getLastNDaysAggs({ apiKey, pair='EURUSD', minutes=1, days=1 }) {
  const now = new Date()
  const from = new Date(now.getTime() - days*24*60*60*1000)
  const fmt = (d) => d.toISOString().split('.')[0]+'Z'
  const url = `https://api.polygon.io/v2/aggs/ticker/${tickerFor(pair)}/range/${minutes}/minute/${from.toISOString().slice(0,10)}/${now.toISOString().slice(0,10)}?adjusted=true&sort=asc&limit=50000&apiKey=${apiKey}`
  const { data } = await axios.get(url)
  if (!data.results) return []
  return data.results.map(r => ({
    time: Math.floor(r.t/1000),
    open: r.o,
    high: r.h,
    low: r.l,
    close: r.c,
    volume: r.v,
  }))
}

export async function listPairs() {
  // Hard-coded common pairs; Polygon has a full listing endpoint under /v3/reference/tickers?market=fx
  return [
    'EURUSD','GBPUSD','USDJPY','AUDUSD','USDCHF','USDCAD','NZDUSD','USDINR'
  ]
}

// Optional: live updates via Polygon WebSocket
export function makeForexSocket({ apiKey, pairs=['EURUSD'], onAgg }) {
  const ws = new WebSocket('wss://socket.polygon.io/forex')
  ws.onopen = () => {
    ws.send(JSON.stringify({ action:'auth', params: apiKey }))
    const subs = pairs.map(p => `C.${p.toUpperCase()}`).join(',')
    ws.send(JSON.stringify({ action:'subscribe', params: subs }))
  }
  ws.onmessage = (evt) => {
    const msgs = JSON.parse(evt.data)
    for (const m of msgs) {
      // 'C' message is forex NBBO/aggregate. Here we convert to a candle-ish update if available.
      if (m.ev === 'C' && onAgg) {
        // m is a quote/trade; you might bucket into 1m yourself. Left as an exercise.
      }
    }
  }
  return ws
}
