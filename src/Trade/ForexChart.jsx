import React, { useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'

const ForexChart = ({ data }) => {
  const containerRef = useRef()
  const chartRef = useRef()
  const seriesRef = useRef()

  useEffect(() => {
    const container = containerRef.current
    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: '#0f172a' },
        textColor: '#cbd5e1'
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' }
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { borderColor: '#1f2937', secondsVisible: false },
      rightPriceScale: { borderColor: '#1f2937' }
    })

    const series = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444'
    })

    chartRef.current = chart
    seriesRef.current = series

    const observer = new ResizeObserver(() => chart.applyOptions({}))
    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current) return
    seriesRef.current.setData(data || [])
  }, [data])

  return <div ref={containerRef} style={{ height: '400px', width: '100%' }} />
}

export default ForexChart
