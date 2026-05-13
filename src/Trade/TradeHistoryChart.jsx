import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getSecureApiData } from '../services/api';


const TradeHistoryChart = ({ tradeData, handleClose }) => {
    const chartRef = useRef();
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState()


    //   useEffect(() => {
    //     const chart = createChart(chartContainerRef.current, {
    //       width: 600,
    //       height: 300,
    //       layout: {
    //         background: { color: '#0e1621' },
    //         textColor: '#d1d4dc',
    //       },
    //       grid: {
    //         vertLines: { color: '#334158' },
    //         horzLines: { color: '#334158' },
    //       },
    //       timeScale: {
    //         timeVisible: true,
    //         secondsVisible: true,
    //       },
    //     });

    //     const areaSeries = chart.addAreaSeries({
    //       topColor: 'rgba(38, 166, 154, 0.5)',
    //       bottomColor: 'rgba(38, 166, 154, 0.1)',
    //       lineColor: 'rgba(38, 166, 154, 1)',
    //       lineWidth: 2,
    //     });

    //     // Add chart data
    //     const formattedData = tradeData.pricePoints.map(p => ({
    //       time: Math.floor(new Date(p.time).getTime() / 1000), // UNIX timestamp in seconds
    //       value: p.value,
    //     }));

    //     areaSeries.setData(formattedData);

    //     // Add entry & exit price markers
    //     const markers = [
    //       {
    //         time: Math.floor(new Date(tradeData.pricePoints[0].time).getTime() / 1000),
    //         position: 'aboveBar',
    //         color: '#2196f3',
    //         shape: 'arrowDown',
    //         text: `Entry ₹${tradeData.entryPrice}`,
    //       },
    //       {
    //         time: Math.floor(new Date(tradeData.pricePoints[tradeData.pricePoints.length - 1].time).getTime() / 1000),
    //         position: 'belowBar',
    //         color: tradeData.result === 'WIN' ? 'green' : 'red',
    //         shape: 'arrowUp',
    //         text: `Exit ₹${tradeData.exitPrice}`,
    //       },
    //     ];

    //     areaSeries.setMarkers(markers);

    //     // Cleanup on unmount
    //     return () => chart.remove();
    //   }, [tradeData]);

    const { t, i18n } = useTranslation();
    const { userSetting } = useSelector((state) => state.user);
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };
    async function fetchTradeData() {
        const result = await getSecureApiData(`get-trade-data/${tradeData._id}`)
        if (result.success) {
            setChartData(result.chartData)
            setLoading(false)
        }
    }
    useEffect(() => {
        if (!chartData || chartData.length === 0) return;

        const chart = createChart(chartRef.current, {
            layout: {
                background: { color: '#1E1E2F' },
                textColor: '#d1d4dc',
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                tickMarkFormatter: (time) => {
                    const date = new Date((time + 5.5 * 60 * 60) * 1000);

                    // Format hours and minutes
                    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                },
            },
            grid: {
                vertLines: { color: '#334158' },
                horzLines: { color: '#334158' },
            },
            handleScale: false,
            handleScroll: false,
        });

        const areaSeries = chart.addAreaSeries({
            topColor: 'rgba(38, 166, 154, 0.5)',
            bottomColor: 'rgba(38, 166, 154, 0.05)',
            lineColor: 'rgba(38, 166, 154, 1)',
            lineWidth: 2,
        });

        areaSeries.setData(chartData);

        chart.timeScale().applyOptions({
            barSpacing: 30,
        });

        chart.timeScale().fitContent(); 

        // Add Entry/Exit markers
        const entryTime = chartData[0].time;
        const exitTime = chartData[chartData.length - 1].time;

        areaSeries.setMarkers([{
            time: entryTime,
            position: 'aboveBar',
            color: '#2196f3',
            shape: 'arrowDown',
            text: `Entry ₹${tradeData.openPrice}`,
        },
        {
            time: exitTime,
            position: 'belowBar',
            color: tradeData.status === 'win' ? 'green' : 'red',
            shape: 'arrowUp',
            text: `Exit ₹${tradeData.close}`,
        },
        ]);

        return () => chart.remove();
    }, [chartData]);


    useEffect(() => {
        if (!tradeData) return
        fetchTradeData()
    }, [tradeData])
    return (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="autoTime modal-content text-white ">
                    <div className="modal-header border-0 px-3 ">
                        <div className='px-2 '>
                            <h5 className="modal-title">{t('trade')} {t('id')}</h5>
                            <small>{tradeData?._id}</small>
                        </div>
                        <button type="button" className="btn-close btn-close-white me-3" onClick={handleClose} ></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3 d-flex align-items-center justify-content-between px-2 ">
                            <p className='d-flex gap-2 flex-column align-items-center justify-content-center'><strong className='text-white'>Asset:</strong> {tradeData?.tradePair}</p>
                            <p className='d-flex gap-2 flex-column align-items-center justify-content-center'><strong className='text-white'>{t('amount')}:</strong>
                                <span>
                                    <a href="" className="trade-inr-btn trade-inr-btn-dwn"><FontAwesomeIcon icon={tradeData?.type == 'UP' ? faArrowUp : faArrowDown} className="fa-arrow-up" /></a> 
                                    {tradeData?.currency?.toUpperCase()} {tradeData?.amount}
                                </span>
                            </p>
                            <p className='d-flex gap-2 flex-column align-items-center justify-content-center'><strong className='text-white'>{t('time')}:</strong> {formatTime(tradeData?.time)}</p>
                            <p className='d-flex gap-2 flex-column align-items-center justify-content-center'>
                                <strong className='text-white'>{t('profit')}:</strong> {tradeData?.currency?.toUpperCase()} {tradeData?.profit}</p>
                        </div>

                        <div className="bg-secondary rounded  text-center mb-3" ref={chartRef} style={{ height: '150px' }} />
                        {loading && 'Loading ...'}

                        <div className="px-2 pt-2 small text-muted d-flex align-items-start justify-content-between">
                            {(() => {
                                const openPrice = parseFloat(tradeData?.openPrice);
                                const closePrice = parseFloat(tradeData?.closingData?.open);
                                const difference = (closePrice - openPrice).toFixed(4);
                                return (
                                    <>
                                        <p className='d-flex flex-column align-items-start justify-content-center'>
                                            <strong className='text-white'>{t('openingQuote')}:</strong>
                                            <span className='fs-6'> {openPrice}  </span>
                                            <span className='fs-6'>{new Date(tradeData?.createdAt).toLocaleString()} </span></p>
                                        <p className='d-flex flex-column align-items-start justify-content-center'>
                                            <strong className='text-white'>{t('closingQuote')}:</strong>
                                            <span className='fs-6'> {closePrice} </span>
                                            <span className='fs-6'>{new Date(tradeData?.updatedAt).toLocaleString()} </span></p>
                                        <p className='d-flex flex-column align-items-start justify-content-center'>
                                            <strong className='text-white'>{t('differnce')}:</strong>
                                            <span className='fs-6'>{difference}</span></p>
                                    </>
                                );
                            })()}

                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div>
        //   <h3>{tradeData.symbol} Trade Result: {tradeData.result}</h3>
        //   <div ref={chartContainerRef} />
        // </div>
    );
};

export default TradeHistoryChart;
