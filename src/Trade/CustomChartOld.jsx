import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChartLoader } from "./ChartLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPause, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CustomChart({ convertAmount, loading, data, pair, bidMarkers = [], TIMEFRAME_SEC = 60, chartType = "candle", userSetting, onLoadMore }) {
    const yZoomRef = useRef(1);
    const canvasRef = useRef(null);
    const smoothPriceRef = useRef(null);
    const lastFrameTimeRef = useRef(performance.now());
    const smoothHighRef = useRef(null);
    const smoothLowRef = useRef(null);
    const slideOffsetRef = useRef(0);
    const prevCandleCount = useRef(0);
    const mouseRef = useRef({ x: null, y: null, inside: false });
    const isFetchingRef = useRef(false);
    const hasRequestedRef = useRef(false);
    const { userData, userTrade, totalUserTrade, totalUserOrder, userOrder } = useSelector((state) => state.user);

    const panRef = useRef({
        dragging: false,
        startX: 0,
        offset: 0,
        userInteracted: false,
    });

    const stepWRef = useRef(20);

    const zoomRef = useRef({
        visibleCount: 50,
        min: 10,
        max: 300,
        userZoomed: false,
    });

    const sizeRef = useRef({ w: 0, h: 0, dpr: 0 });
    const dataRef = useRef(data);

    const pairRef = useRef(pair);
    const timeframRef = useRef(TIMEFRAME_SEC);
    const chartTypeRef = useRef(chartType);
    const userSettingRef = useRef(userSetting);
    const bidMarkersRef = useRef(bidMarkers);
    const convertAmountRef = useRef(convertAmount);

    useEffect(() => { pairRef.current = pair; }, [pair]);
    useEffect(() => { timeframRef.current = TIMEFRAME_SEC; }, [TIMEFRAME_SEC]);
    useEffect(() => { chartTypeRef.current = chartType; }, [chartType]);
    useEffect(() => { userSettingRef.current = userSetting; }, [userSetting]);
    useEffect(() => { bidMarkersRef.current = bidMarkers; }, [bidMarkers]);
    useEffect(() => { convertAmountRef.current = convertAmount; }, [convertAmount]);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    const pendingResetRef = useRef(false);

    useEffect(() => {
        pendingResetRef.current = true;
    }, [pair, TIMEFRAME_SEC]);

    useEffect(() => {
        hasRequestedRef.current = false;
    }, [data.length]);

    const isMobileCheck = () => window.innerWidth < 768;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let rafId;

        const draw = () => {
            if (pendingResetRef.current) {
                pendingResetRef.current = false;

                panRef.current.offset = 0;
                panRef.current.dragging = false;
                panRef.current.userInteracted = false;

                smoothPriceRef.current = null;
                smoothHighRef.current = null;
                smoothLowRef.current = null;

                prevCandleCount.current = 0;
                slideOffsetRef.current = 0;
                lastFrameTimeRef.current = performance.now();
                yZoomRef.current = 1;

                const TF = timeframRef.current;
                if (!zoomRef.current.userZoomed) {
                    const mob = isMobileCheck();
                    if (TF <= 5) zoomRef.current.visibleCount = mob ? 40 : 80;
                    else if (TF <= 15) zoomRef.current.visibleCount = mob ? 35 : 70;
                    else if (TF <= 30) zoomRef.current.visibleCount = mob ? 30 : 60;
                    else if (TF <= 60) zoomRef.current.visibleCount = mob ? 25 : 50;
                    else if (TF <= 300) zoomRef.current.visibleCount = mob ? 20 : 40;
                    else if (TF <= 600) zoomRef.current.visibleCount = mob ? 18 : 30;
                    else if (TF <= 900) zoomRef.current.visibleCount = mob ? 15 : 25;
                    else zoomRef.current.visibleCount = mob ? 12 : 20;
                }
                zoomRef.current.userZoomed = false;
            }

            const frameNow = performance.now();
            const dt = Math.min((frameNow - lastFrameTimeRef.current) / 1000, 0.1);
            lastFrameTimeRef.current = frameNow;
            const lerpFactor = 1 - Math.exp(-dt * 8);

            const candles = dataRef.current;
            const currentPair = pairRef.current;
            const currentTF = timeframRef.current;
            const currentChartType = chartTypeRef.current;
            const currentUserSetting = userSettingRef.current;
            const currentBidMarkers = bidMarkersRef.current;

            if (!Array.isArray(candles) || candles.length === 0) {
                rafId = requestAnimationFrame(draw);
                return;
            }

            const isMobile = isMobileCheck();
            // const FUTURE = isMobile ? 0 : 5;
            const FUTURE = (panRef.current.offset === 0) ? (isMobile ? 4 : 5) : 0;

            const dpr = window.devicePixelRatio || 1;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            if (width === 0 || height === 0) {
                rafId = requestAnimationFrame(draw);
                return;
            }

            if (sizeRef.current.w !== width || sizeRef.current.h !== height || sizeRef.current.dpr !== dpr) {
                sizeRef.current = { w: width, h: height, dpr };
                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            const padding = {
                left: isMobile ? 12 : 20,
                right: isMobile ? 4 : 6,
                top: isMobile ? 12 : 20,
                bottom: isMobile ? 30 : 40,
            };

            const chartW = width - padding.left - padding.right;
            const chartH = height - padding.top - padding.bottom;

            ctx.fillStyle = "#121a2e";
            ctx.fillRect(0, 0, width, height);

            // Grid
            const majorCols = isMobile ? 10 : 20;
            const subCols = isMobile ? 3 : 4;
            const totalCols = majorCols * subCols;
            const colW = chartW / totalCols;

            for (let i = 0; i <= totalCols; i++) {
                const x = Math.floor(padding.left + i * colW);
                const isMajor = i % subCols === 0;
                ctx.beginPath();
                ctx.moveTo(x, padding.top);
                ctx.lineTo(x, padding.top + chartH);
                ctx.strokeStyle = isMajor ? "rgba(148,163,184,0.14)" : "rgba(148,163,184,0.06)";
                ctx.lineWidth = isMajor ? 1 : 0.5;
                ctx.stroke();
            }

            const majorRows = isMobile ? 3 : 4;
            const subRows = isMobile ? 4 : 5;
            const totalRows = majorRows * subRows;
            const rowH = chartH / totalRows;

            for (let i = 0; i <= totalRows; i++) {
                const y = Math.floor(padding.top + i * rowH);
                const isMajor = i % subRows === 0;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(width - padding.right, y);
                ctx.strokeStyle = isMajor ? "#1f2937" : "#111827";
                ctx.lineWidth = isMajor ? 1 : 0.5;
                ctx.stroke();
            }

            // const visibleCount = isMobile ? 30 : Math.floor(zoomRef.current.visibleCount);
            const visibleCount = Math.floor(zoomRef.current.visibleCount);

            const maxOffset = Math.max(0, candles.length - visibleCount);
            // Agar user ne manually pan nahi kiya → hamesha live (latest) candle dikhao
            if (!panRef.current.userInteracted) {
                panRef.current.offset = 0;
            } else {
                panRef.current.offset = Math.max(0, Math.min(panRef.current.offset, maxOffset));
            }

            // const startIdx = Math.max(0, candles.length - visibleCount - Math.floor(panRef.current.offset));
            const rawStart = candles.length - visibleCount - panRef.current.offset;
            const startIdx = Math.max(0, Math.floor(rawStart));
            const endIdx = Math.min(candles.length, startIdx + visibleCount);
            const visible = candles.slice(startIdx, endIdx);

            if (
                onLoadMore && !currentPair.startsWith('OTC') &&
                !isFetchingRef.current &&
                !hasRequestedRef.current &&
                panRef.current.offset >= (candles.length - visibleCount - 5)
            ) {
                isFetchingRef.current = true;
                hasRequestedRef.current = true;
                const firstCandle = candles[0];
                if (firstCandle) {
                    onLoadMore(firstCandle.time).finally(() => {
                        isFetchingRef.current = false;
                    });
                }
            }

            // const subCandleOffset = panRef.current.offset - Math.floor(panRef.current.offset);
            const subCandleOffset = rawStart - startIdx;
            const gap = isMobile ? 2 : 6;
            const totalSlots = Math.max(visible.length, 1) + FUTURE;
            const minCandleWidth = isMobile ? 6 : 6;
            const candleW = Math.max(minCandleWidth, chartW / totalSlots - gap);
            const stepW = candleW + gap;
            stepWRef.current = stepW;

            // Y Scale
            let yMin = Infinity;
            let yMax = -Infinity;

            visible.forEach(c => {
                if (c.low != null && isFinite(c.low)) yMin = Math.min(yMin, c.low);
                if (c.high != null && isFinite(c.high)) yMax = Math.max(yMax, c.high);
            });

            const livePriceCurrent = candles[candles.length - 1]?.close;
            if (livePriceCurrent != null && isFinite(livePriceCurrent)) {
                yMin = Math.min(yMin, livePriceCurrent);
                yMax = Math.max(yMax, livePriceCurrent);
            }

            // ── Bid marker entry prices ko Y scale mein include karo ──
            // Isse jab bid lagti hai tab chart jump nahi karta — smoothing gradually adjust karti hai
            {
                const nowSecY = Math.floor(Date.now() / 1000);
                currentBidMarkers.forEach(m => {
                    if (m.pair !== currentPair) return;
                    const timeLeft = Number(m.duration) - (nowSecY - Number(m.startTime));
                    if (timeLeft <= 0) return;
                    const ep = Number(m.price);
                    if (isFinite(ep)) {
                        yMin = Math.min(yMin, ep);
                        yMax = Math.max(yMax, ep);
                    }
                });
            }

            if (!isFinite(yMin) || !isFinite(yMax) || yMin === yMax) {
                yMin = (isFinite(yMin) ? yMin : 0) - 1;
                yMax = (isFinite(yMax) ? yMax : 1) + 1;
            }

            const rawRange = yMax - yMin;

            const isFirstFrame = smoothHighRef.current === null || isNaN(smoothHighRef.current);
            const isFarOff = !isFirstFrame &&
                (Math.abs(smoothHighRef.current - yMax) > rawRange * 8 ||
                    Math.abs(smoothLowRef.current - yMin) > rawRange * 8);

            if (isFirstFrame || isFarOff) {
                smoothHighRef.current = yMax;
                smoothLowRef.current = yMin;
            } else {
                const speed = Math.min(lerpFactor * 3, 0.15);  // slower = smoother transition
                smoothHighRef.current += (yMax - smoothHighRef.current) * speed;
                smoothLowRef.current += (yMin - smoothLowRef.current) * speed;
            }

            const sMin = smoothLowRef.current;
            const sMax = smoothHighRef.current;
            const smoothedRange = (sMax - sMin) || rawRange || 1;
            const padFrac = 0.12;
            const paddedMin = sMin - smoothedRange * padFrac;
            const paddedMax = sMax + smoothedRange * padFrac;
            const paddedRange = paddedMax - paddedMin;
            const zoomedRange = paddedRange * yZoomRef.current;
            const mid = (paddedMax + paddedMin) / 2;
            const scaledMin = mid - zoomedRange / 2;
            const scaledMax = mid + zoomedRange / 2;

            const yToPx = v => padding.top + (1 - (v - scaledMin) / (scaledMax - scaledMin)) * chartH;

            // Y Labels
            ctx.font = isMobile ? "10px sans-serif" : "11px sans-serif";
            ctx.textAlign = "right";
            const yLabelCount = isMobile ? 5 : 8;
            const LABEL_RIGHT_MARGIN = isMobile ? 48 : 60;

            for (let i = 0; i <= yLabelCount; i++) {
                const price = scaledMin + ((scaledMax - scaledMin) / yLabelCount) * i;
                const y = yToPx(price);
                if (y > padding.top + 10 && y < padding.top + chartH - 10) {
                    const labelText = price.toFixed(3);
                    const textW = ctx.measureText(labelText).width;
                    const lx = width - padding.right - 4;
                    const labelX = lx - LABEL_RIGHT_MARGIN + textW + 4;

                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(148,163,184,0.15)";
                    ctx.lineWidth = 0.5;
                    ctx.setLineDash([2, 4]);
                    ctx.moveTo(padding.left, y);
                    ctx.lineTo(width - padding.right, y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    const pillX = lx - textW - 8;
                    const pillY = y - 9;
                    const pillW = textW + 10;
                    const pillH = 17;
                    ctx.fillStyle = "rgba(12,20,40,0.72)";
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(pillX, pillY, pillW, pillH, 3);
                    } else {
                        ctx.rect(pillX, pillY, pillW, pillH);
                    }
                    ctx.fill();

                    ctx.fillStyle = "rgba(148,163,184,0.9)";
                    ctx.fillText(labelText, lx, y + 4);
                }
            }

            // Slide animation
            if (candles.length !== prevCandleCount.current) {
                slideOffsetRef.current = 1;
                prevCandleCount.current = candles.length;
            }
            slideOffsetRef.current += (0 - slideOffsetRef.current) * lerpFactor;

            // Smooth live price
            const liveCandle = candles[candles.length - 1];
            if (liveCandle?.close != null && isFinite(liveCandle.close)) {
                if (smoothPriceRef.current === null || isNaN(smoothPriceRef.current)) {
                    smoothPriceRef.current = liveCandle.close;
                } else {
                    smoothPriceRef.current += (liveCandle.close - smoothPriceRef.current) * lerpFactor;
                }
            }

            const slideW = panRef.current.offset === 0 ? slideOffsetRef.current * stepW : 0;
            const panPixelOffset = subCandleOffset * stepW;
            const candleX = i => padding.left + i * stepW + candleW / 2 - slideW - panPixelOffset;

            // Clip region
            ctx.save();
            ctx.beginPath();
            ctx.rect(padding.left, padding.top, chartW, chartH);
            ctx.clip();

            const FADE_ZONE = isMobile ? 40 : 60;

            if (currentChartType === "candle") {
                visible.forEach((c, i) => {
                    const x = candleX(i);

                    let alpha = 1;
                    const distLeft = x - padding.left;
                    const distRight = (padding.left + chartW) - x;
                    if (distLeft < FADE_ZONE) alpha = Math.max(0, distLeft / FADE_ZONE);
                    if (distRight < FADE_ZONE) alpha = Math.min(alpha, Math.max(0, distRight / FADE_ZONE));
                    ctx.globalAlpha = alpha;

                    const isForming = i === visible.length - 1 && panRef.current.offset === 0;
                    const drawClose = isForming ? (smoothPriceRef.current ?? c.close) : c.close;
                    const openY = yToPx(c.open);
                    const closeY = yToPx(drawClose);
                    const highY = yToPx(c.high);
                    const lowY = yToPx(c.low);
                    const isBull = drawClose >= c.open;
                    const color = isBull ? "#26A69A" : "#EF5350";
                    const bodyTop = Math.min(openY, closeY);
                    const bodyBottom = Math.max(openY, closeY);
                    const bodyH = Math.max(1, bodyBottom - bodyTop);

                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    if (highY < bodyTop) { ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, bodyTop); ctx.stroke(); }
                    if (lowY > bodyBottom) { ctx.beginPath(); ctx.moveTo(x, bodyBottom); ctx.lineTo(x, lowY); ctx.stroke(); }
                    ctx.fillStyle = color;
                    ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
                });

            } else if (currentChartType === "bar") {
                ctx.setLineDash([]);
                ctx.lineCap = "butt";
                const barWidth = isMobile ? 3 : 5;
                visible.forEach((c, i) => {
                    const x = candleX(i);

                    let alpha = 1;
                    const distLeft = x - padding.left;
                    const distRight = (padding.left + chartW) - x;
                    if (distLeft < FADE_ZONE) alpha = Math.max(0, distLeft / FADE_ZONE);
                    if (distRight < FADE_ZONE) alpha = Math.min(alpha, Math.max(0, distRight / FADE_ZONE));
                    ctx.globalAlpha = alpha;

                    const openY = yToPx(c.open);
                    const closeY = yToPx(c.close);
                    const highY = yToPx(c.high);
                    const lowY = yToPx(c.low);
                    const color = c.close >= c.open ? "#10b981" : "#ef4444";
                    ctx.strokeStyle = color;
                    ctx.lineWidth = barWidth;
                    ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x - (isMobile ? 4 : 6), openY); ctx.lineTo(x, openY); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x, closeY); ctx.lineTo(x + (isMobile ? 4 : 6), closeY); ctx.stroke();
                });

            } else if (currentChartType === "area") {
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.lineWidth = isMobile ? 1.5 : 2;
                visible.forEach((c, i) => {
                    const x = candleX(i);
                    const y = yToPx(c.close);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                });
                const lastX = candleX(visible.length - 1);
                ctx.lineTo(lastX, padding.top + chartH);
                ctx.lineTo(padding.left, padding.top + chartH);
                ctx.closePath();
                ctx.fillStyle = "rgba(59,130,246,0.25)";
                ctx.fill();
                ctx.strokeStyle = "#3b82f6";
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            ctx.restore(); // restore clip

            // X Axis line
            ctx.strokeStyle = "#1f2937";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding.left, height - padding.bottom);
            ctx.lineTo(width - padding.right, height - padding.bottom);
            ctx.stroke();

            // X Axis Time Labels
            ctx.fillStyle = "#9ca3af";
            ctx.font = isMobile ? "9px sans-serif" : "11px sans-serif";
            ctx.textAlign = "center";
            const minLabelSpacing = isMobile ? 80 : 60;
            const labelEvery = Math.max(1, Math.ceil(minLabelSpacing / stepW));
            const userTimeZone = currentUserSetting?.timezone || "Asia/Kolkata";

            visible.forEach((c, i) => {
                if (i % labelEvery !== 0) return;
                const x = candleX(i);
                if (x < padding.left || x > width - padding.right) return;
                const date = new Date(c.time * 1000);
                const label = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: userTimeZone,
                });
                ctx.fillText(label, x, height - padding.bottom + (isMobile ? 4 : 6));
            });

            // Live Price dashed line + label
            if (liveCandle && smoothPriceRef.current != null) {
                const priceY = yToPx(smoothPriceRef.current);
                const crisp = v => Math.round(v) + 0.5;

                ctx.strokeStyle = "#ffffff";
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(crisp(padding.left), crisp(priceY));
                ctx.lineTo(crisp(width - padding.right), crisp(priceY));
                ctx.stroke();
                ctx.setLineDash([]);

                const priceText = smoothPriceRef.current.toFixed(3);
                const boxW = isMobile ? 50 : 58;
                const boxH = isMobile ? 18 : 22;
                const boxX = width - padding.right - boxW - 2;
                const boxY = priceY - boxH / 2;

                ctx.fillStyle = "#1d4ed8";
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(boxX, boxY, boxW, boxH, 3);
                    ctx.fill();
                } else {
                    ctx.fillRect(boxX, boxY, boxW, boxH);
                }
                ctx.fillStyle = "#ffffff";
                ctx.font = isMobile ? "10px sans-serif" : "12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(priceText, boxX + boxW / 2, boxY + boxH / 2);
            }

            // Expiry Timer
            if (liveCandle && panRef.current.offset === 0) {
                const nowSec = Math.floor(Date.now() / 1000);
                const nextCandleAt = liveCandle.time + currentTF;
                const remaining = Math.max(0, nextCandleAt - nowSec);
                const expiryX = candleX(visible.length - 1);

                ctx.strokeStyle = "rgba(255,255,255,0.4)";
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(expiryX, padding.top);
                ctx.lineTo(expiryX, height - padding.bottom);
                ctx.stroke();
                ctx.setLineDash([]);

                const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
                const ss = String(remaining % 60).padStart(2, "0");
                const timerText = `${mm}:${ss}`;

                // FIXED POSITION (top-right corner)
                const boxW = isMobile ? 40 : 48;
                const boxH = isMobile ? 18 : 22;

                // right corner me fix
                const boxX = width - padding.right - boxW - 8;
                const boxY = padding.top + 8;

                ctx.fillStyle = "#2563eb";
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(boxX, boxY, boxW, boxH, 3);
                    ctx.fill();
                } else {
                    ctx.fillRect(boxX, boxY, boxW, boxH);
                }
                ctx.fillStyle = "#ffffff";
                ctx.font = isMobile ? "10px sans-serif" : "12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(timerText, boxX + boxW / 2, boxY + boxH / 2);
            }

            // Crosshair
            if (mouseRef.current.inside) {
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                if (mx > padding.left && mx < width - padding.right &&
                    my > padding.top && my < height - padding.bottom) {

                    ctx.strokeStyle = "#6b7280";
                    ctx.setLineDash([3, 3]);
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(mx, padding.top); ctx.lineTo(mx, height - padding.bottom); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(padding.left, my); ctx.lineTo(width - padding.right, my); ctx.stroke();
                    ctx.setLineDash([]);

                    const price = scaledMax - ((my - padding.top) / chartH) * (scaledMax - scaledMin);

                    const lw = isMobile ? 50 : 60;
                    const lh = isMobile ? 18 : 22;
                    const lx = width - padding.right - lw - 2;

                    ctx.fillStyle = "#111827";
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(lx, my - lh / 2, lw, lh, 3);
                        ctx.fill();
                    } else {
                        ctx.fillRect(lx, my - lh / 2, lw, lh);
                    }
                    ctx.fillStyle = "#fff";
                    ctx.font = isMobile ? "10px sans-serif" : "12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(price.toFixed(3), lx + lw / 2, my);

                    const idx = Math.max(0, Math.min(Math.floor(((mx - padding.left) / chartW) * visible.length), visible.length - 1));
                    const hoverCandle = visible[idx];
                    if (hoverCandle) {
                        const date = new Date(hoverCandle.time * 1000);
                        const label = date.toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                            second: isMobile ? undefined : "2-digit",
                            hour12: false, timeZone: userTimeZone,
                        });
                        const tw = isMobile ? 60 : 70;
                        const th = isMobile ? 18 : 22;
                        ctx.fillStyle = "#111827";
                        ctx.fillRect(mx - tw / 2, height - padding.bottom + 6, tw, th);
                        ctx.fillStyle = "#fff";
                        ctx.fillText(label, mx, height - padding.bottom + 6 + th / 2);
                    }
                }
            }

            // OHLC Info top-left
            {
                const ohlcCandle = (() => {
                    if (mouseRef.current.inside) {
                        const mx = mouseRef.current.x;
                        if (mx > padding.left && mx < width - padding.right) {
                            const idx = Math.floor(((mx - padding.left) / chartW) * visible.length);
                            return visible[Math.max(0, Math.min(idx, visible.length - 1))];
                        }
                    }
                    return candles[candles.length - 1];
                })();

                if (ohlcCandle) {
                    const isBull = ohlcCandle.close >= ohlcCandle.open;
                    const ohlcColor = isBull ? "#10b981" : "#ef4444";
                    const dp = 3;
                    const fx = padding.left + (isMobile ? 4 : 8);
                    const fy = padding.top + (isMobile ? 4 : 6);
                    const fSize = isMobile ? 10 : 12;
                    const gap2 = isMobile ? 52 : 70;

                    ctx.font = `${fSize}px sans-serif`;
                    ctx.textBaseline = "top";
                    ctx.textAlign = "left";

                    [
                        { label: "O", value: ohlcCandle.open.toFixed(dp) },
                        { label: "H", value: ohlcCandle.high.toFixed(dp) },
                        { label: "L", value: ohlcCandle.low.toFixed(dp) },
                        { label: "C", value: ohlcCandle.close.toFixed(dp) },
                    ].forEach(({ label, value }, i) => {
                        const x = fx + i * gap2;
                        ctx.fillStyle = "#9ca3af";
                        ctx.fillText(label, x, fy);
                        ctx.fillStyle = ohlcColor;
                        ctx.fillText(value, x + (isMobile ? 10 : 12), fy);
                    });
                }
            }

            // ── BID MARKERS ──────────────────────────────────────────────────────
            {
                const nowSec2 = Math.floor(Date.now() / 1000);
                const activeMarkers = currentBidMarkers.filter(
                    (m) => m.pair === currentPair &&
                        Number(m.duration) - (nowSec2 - Number(m.startTime)) > 0
                );

                if (activeMarkers.length > 0) {
                    const selectedCurrency = userData?.currency || "inr";
                    const sym = selectedCurrency === "usd" ? "$" : "₹";

                    const PILL_H = isMobile ? 18 : 20;
                    const DOT_R = isMobile ? 3 : 4;
                    const FS = isMobile ? 9 : 10;

                    ctx.font = `600 ${FS}px sans-serif`;

                   
                    // slideW bhi include karo — warna naya candle aane pe marker jump karta hai
                    const markerCandleX = (visIdx) =>
                        padding.left + visIdx * stepW + candleW / 2 - slideW - panPixelOffset;
               

                    // O(1) lookup: candle time → global index
                    const timeIndexMap = new Map();
                    candles.forEach((c, i) => timeIndexMap.set(Number(c.time), i));

                    // Live candle anchor (future end-line ke liye)
                    const liveCandle2 = candles[candles.length - 1];
                    const liveTime = liveCandle2 ? Number(liveCandle2.time) : 0;
                    const liveVisibleIdx = (candles.length - 1) - startIdx;
                    const rawLiveX = markerCandleX(liveVisibleIdx);

                    const timeToX = (t) => {
                        const tNum = Number(t);

                        // Exact match in candle array → perfectly stable pixel
                        if (timeIndexMap.has(tNum)) {
                            const globalIdx = timeIndexMap.get(tNum);
                            const visIdx = globalIdx - startIdx;
                            return markerCandleX(visIdx);
                        }

                        // Not in array (future or very old past) → extrapolate from live candle
                        const deltaCandles = (tNum - liveTime) / Math.max(1, currentTF);
                        return rawLiveX + deltaCandles * stepW;
                    };

                    const marks = activeMarkers.map((m) => {
                        const remaining = Math.max(0, Number(m.duration) - (nowSec2 - Number(m.startTime)));
                        const isUp = m.direction === "UP";
                        const color = isUp ? "#10b981" : "#ef4444";
                        const entryPrice = Number(m.price);
                        const trueLineY = yToPx(entryPrice);

                        // entry X — stable time-based lookup
                        const rawEntryX = timeToX(Number(m.time));

                        const secsLeft = Math.max(0, Number(m.startTime) + Number(m.duration) - nowSec2);
                        const futureC = secsLeft / Math.max(1, currentTF);
                        const rawEndX = rawLiveX + futureC * stepW;

                        const amt = convertAmountRef.current(
                            Number(m?.amount), m?.currency || "inr", selectedCurrency
                        );
                        const mm = String(Math.floor(remaining / 60)).padStart(1, "0");
                        const ss = String(remaining % 60).padStart(2, "0");
                        const txt = `${amt.toFixed(0)} ${sym} ${mm}:${ss}`;
                        const pillW = ctx.measureText(txt).width + (isMobile ? 22 : 26);

                        return { m, isUp, color, trueLineY, rawEntryX, rawEndX, txt, pillW, remaining };
                    });

                    const sorted = [...marks].sort((a, b) => Number(b.m.startTime) - Number(a.m.startTime));

                    const PILL_GAP_H = isMobile ? 4 : 6;
                    const pillXOffsets = new Array(sorted.length).fill(0);

                    for (let i = 0; i < sorted.length; i++) {
                        pillXOffsets[i] = -(sorted[i].pillW + 10);
                        for (let j = 0; j < i; j++) {
                            if (Math.abs(sorted[i].rawEntryX - sorted[j].rawEntryX) < 15) {
                                pillXOffsets[i] = pillXOffsets[j] - sorted[i].pillW - PILL_GAP_H;
                            }
                        }
                    }

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(padding.left, padding.top, chartW, chartH);
                    ctx.clip();

                    sorted.forEach((d, si) => {
                        const { m, isUp, color, trueLineY, rawEntryX, rawEndX, txt, pillW } = d;

                 
                        const dotX = rawEntryX;
                        const dotOnScreen = dotX >= padding.left && dotX <= padding.left + chartW;
                        if (dotOnScreen) {
                            const livePrice = smoothPriceRef.current ?? candles[candles.length - 1]?.close;
                            const winning = livePrice != null && (
                                isUp ? livePrice > Number(m.price) : livePrice < Number(m.price)
                            );
                            const dotColor = winning ? "#10b981" : "#ef4444";
                            ctx.save();
                            // Glow ring
                            ctx.beginPath();
                            ctx.arc(dotX, trueLineY, DOT_R + 4, 0, Math.PI * 2);
                            ctx.fillStyle = `${dotColor}25`;
                            ctx.fill();
                            // Solid dot
                            ctx.beginPath();
                            ctx.arc(dotX, trueLineY, DOT_R, 0, Math.PI * 2);
                            ctx.fillStyle = dotColor;
                            ctx.fill();
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth = 1.5;
                            ctx.stroke();
                            ctx.restore();
                        }

                        if (rawEntryX > padding.left + chartW + 2) return;

                        let basePillX = rawEntryX + pillXOffsets[si];
                        let pillX = Math.max(
                            padding.left + 2,
                            Math.min(basePillX, padding.left + chartW - pillW - 4)
                        );
                        const pillY = trueLineY - PILL_H - 6;
                        const pillCY = pillY + PILL_H / 2;

                        const lineStartX = rawEntryX + DOT_R + 2;
                        const lineEndX = padding.left + chartW;

                        if (lineEndX > lineStartX) {
                            ctx.save();
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([]);
                            ctx.globalAlpha = 0.7;
                            ctx.beginPath();
                            ctx.moveTo(lineStartX, trueLineY);  // ✅ trueLineY — dot ka exact price level
                            ctx.lineTo(lineEndX, trueLineY);    // ✅
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                            ctx.restore();
                        }

                        const pillR = PILL_H / 2;
                        ctx.save();
                        ctx.shadowColor = `${color}40`;
                        ctx.shadowBlur = 5;
                        ctx.fillStyle = color;
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(pillX, pillY, pillW, PILL_H, pillR);
                        } else {
                            ctx.moveTo(pillX + pillR, pillY);
                            ctx.lineTo(pillX + pillW - pillR, pillY);
                            ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + PILL_H, pillR);
                            ctx.lineTo(pillX + pillW, pillY + PILL_H - pillR);
                            ctx.arcTo(pillX + pillW, pillY + PILL_H, pillX + pillW - pillR, pillY + PILL_H, pillR);
                            ctx.lineTo(pillX + pillR, pillY + PILL_H);
                            ctx.arcTo(pillX, pillY + PILL_H, pillX, pillY + PILL_H - pillR, pillR);
                            ctx.lineTo(pillX, pillY + pillR);
                            ctx.arcTo(pillX, pillY, pillX + pillR, pillY, pillR);
                        }
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        const bulR = isMobile ? 3 : 3.5;
                        const bulX = pillX + (isMobile ? 8 : 10);
                        ctx.beginPath();
                        ctx.arc(bulX, pillCY, bulR, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(255,255,255,0.75)";
                        ctx.fill();

                        ctx.fillStyle = "#ffffff";
                        ctx.font = `600 ${FS}px sans-serif`;
                        ctx.textAlign = "left";
                        ctx.textBaseline = "middle";
                        ctx.fillText(txt, bulX + bulR + (isMobile ? 4 : 5), pillCY);
                        ctx.restore();
                    });

                    // "Beginning of trade" + "End of trade"
                    const newestMark = marks.reduce((latest, d) =>
                        Number(d.m.startTime) > Number(latest.m.startTime) ? d : latest
                    );
                    const showBeginX = newestMark.rawEntryX;
                    const showEndX = newestMark.rawEndX;
                    const minLabelDist = 60;

                    const beginVisible = showBeginX >= padding.left && showBeginX <= padding.left + chartW;
                    const endVisible = showEndX >= padding.left && showEndX <= padding.left + chartW;
                    const tooClose = Math.abs(showEndX - showBeginX) < minLabelDist;

                    if (beginVisible) {
                        ctx.save();
                        ctx.strokeStyle = "rgba(200,210,255,0.5)";
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 3]);
                        ctx.beginPath();
                        ctx.moveTo(showBeginX, padding.top);
                        ctx.lineTo(showBeginX, height - padding.bottom);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        if (!isMobile && !tooClose) {
                            ctx.fillStyle = "rgba(200,210,255,0.55)";
                            ctx.font = "10px sans-serif";
                            ctx.textBaseline = "top";
                            ctx.textAlign = "left";
                            const bLabel = "Beginning of trade";
                            const bLW = ctx.measureText(bLabel).width;
                            ctx.fillText(bLabel,
                                Math.min(showBeginX + 4, padding.left + chartW - bLW - 2),
                                padding.top + 2
                            );
                        }
                        ctx.restore();
                    }

                    if (endVisible) {
                        ctx.save();
                        ctx.strokeStyle = "rgba(200,210,255,0.5)";
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 3]);
                        ctx.beginPath();
                        ctx.moveTo(showEndX, padding.top);
                        ctx.lineTo(showEndX, height - padding.bottom);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        if (!isMobile) {
                            ctx.fillStyle = "rgba(200,210,255,0.55)";
                            ctx.font = "10px sans-serif";
                            ctx.textBaseline = "top";
                            ctx.textAlign = "right";
                            ctx.fillText("End of trade", showEndX - 4, padding.top + 2);
                        }
                        ctx.restore();
                    }

                    ctx.restore();
                }
            }

            rafId = requestAnimationFrame(draw);
        };

        const onVisibility = () => {
            if (!document.hidden) {
                smoothPriceRef.current = null;
                smoothHighRef.current = null;
                smoothLowRef.current = null;
                lastFrameTimeRef.current = performance.now();
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        // ResizeObserver: DevTools me mobile toggle karne pe ya window resize pe
        // canvas ka size aur mobile layout fresh ho jaye
        const resizeObserver = new ResizeObserver(() => {
            // sizeRef reset karo taaki canvas dimensions recalculate hon
            sizeRef.current = { w: 0, h: 0, dpr: 0 };
            // zoom bhi reset karo agar user ne manually zoom nahi kiya
            if (!zoomRef.current.userZoomed) {
                pendingResetRef.current = true;
            }
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        draw();

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener("visibilitychange", onVisibility);
            resizeObserver.disconnect();
        };
    }, []); // ✅ empty — loop sirf mount/unmount pe restart hoga, bid ya re-render pe nahi

    // ── Event Listeners ──
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onWheel = (e) => {
            e.preventDefault();
            const zoom = zoomRef.current;
            const candles = dataRef.current;
            if (!candles.length) return;

            const oldCount = zoom.visibleCount;
            const delta = e.deltaY > 0 ? 1 : -1;   // -1 = zoom in, +1 = zoom out
            const step = 5;
            let newCount = oldCount + (delta * step);
            newCount = Math.min(zoom.max, Math.max(zoom.min, newCount));
            if (newCount === oldCount) return;

            // Current visible range
            // const oldStartIdx = Math.max(0, candles.length - oldCount - Math.floor(panRef.current.offset));
            const oldStartIdx = Math.max(  0, candles.length - oldCount - panRef.current.offset );
            const centerIdx = oldStartIdx + oldCount / 2;

            let newStartIdx = Math.max(0, Math.min(candles.length - newCount, centerIdx - newCount / 2));
            newStartIdx = Math.floor(newStartIdx);

            const newOffset = (candles.length - newCount) - newStartIdx;
            panRef.current.offset = Math.max(0, Math.min(newOffset, candles.length - newCount));

            zoom.visibleCount = newCount;
            zoom.userZoomed = true;
            panRef.current.userInteracted = true;   // <-- critical
        };

        const handleTouchStart = (e) => {
            if (e.target !== canvas) return;
            e.preventDefault();
            const touch = e.touches[0];
            mouseRef.current = {
                x: touch.clientX, y: touch.clientY, inside: true, down: true,
                startX: touch.clientX, startY: touch.clientY,
                startOffset: panRef.current.offset,
            };
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            if (!mouseRef.current.down) return;
            const touch = e.touches[0];
            const totalDx = touch.clientX - mouseRef.current.startX;
            const sw = stepWRef.current > 0 ? stepWRef.current : (isMobileCheck() ? 12 : 20);
            const newOffset = mouseRef.current.startOffset + (totalDx / sw);
            const candles = dataRef.current;
            const vc = Math.floor(zoomRef.current.visibleCount);
            panRef.current.offset = Math.max(0, Math.min(newOffset, Math.max(0, candles.length - vc)));
            panRef.current.dragging = true;
            panRef.current.userInteracted = true;
            mouseRef.current.x = touch.clientX;
            mouseRef.current.y = touch.clientY;
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            mouseRef.current.down = false;
            panRef.current.dragging = false;
        };

        const handleTouchCancel = (e) => {
            e.preventDefault();
            mouseRef.current.down = false;
            mouseRef.current.inside = false;
            panRef.current.dragging = false;
        };

        let initialDistance = 0;
        let initialVisibleCount = 0;

        const handleTouchStartMulti = (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialDistance = Math.sqrt(dx * dx + dy * dy);
                initialVisibleCount = zoomRef.current.visibleCount;
            }
        };

        const handleTouchMoveMulti = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const currentDistance = Math.sqrt(dx * dx + dy * dy);
                const zoomFactor = initialDistance / currentDistance;
                zoomRef.current.visibleCount = Math.max(10, Math.min(300, initialVisibleCount * zoomFactor));
                zoomRef.current.userZoomed = true;
            }
        };

        const handleMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const yAxisStart = canvas.clientWidth - 70;
            mouseRef.current = {
                x, y, inside: true, down: true,
                startX: x, startY: y, prevX: x,
                startOffset: panRef.current.offset,
                yAxisDrag: x > yAxisStart,
            };
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (mouseRef.current.down) {
                if (mouseRef.current.yAxisDrag) {
                    const dy = y - mouseRef.current.startY;
                    yZoomRef.current = Math.max(0.2, Math.min(5, yZoomRef.current + dy * 0.005));
                    mouseRef.current.startY = y;
                } else {
                    const totalDx = x - mouseRef.current.startX;
                    const sw = stepWRef.current > 0 ? stepWRef.current : 20;
                    const newOffset = mouseRef.current.startOffset + (totalDx / sw);
                    const candles = dataRef.current;
                    const vc = Math.floor(zoomRef.current.visibleCount);
                    // panRef.current.offset = Math.max(0, Math.min(newOffset, Math.max(0, candles.length - vc)));
                    const targetOffset = Math.max(  0, Math.min(newOffset, Math.max(0, candles.length - vc)));
                    panRef.current.offset +=  (targetOffset - panRef.current.offset) * 0.35;
                    panRef.current.dragging = true;
                    panRef.current.userInteracted = true;
                }
            }
            mouseRef.current.x = x;
            mouseRef.current.y = y;
            mouseRef.current.inside = true;
        };

        const handleMouseUp = () => { mouseRef.current.down = false; panRef.current.dragging = false; };
        const handleMouseLeave = () => { mouseRef.current.inside = false; mouseRef.current.down = false; panRef.current.dragging = false; };
        const handleDblClick = () => { panRef.current.offset = 0; panRef.current.userInteracted = false; zoomRef.current.userZoomed = false; };

        canvas.addEventListener("wheel", onWheel, { passive: false });
        canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
        canvas.addEventListener("touchcancel", handleTouchCancel, { passive: false });
        canvas.addEventListener("touchstart", handleTouchStartMulti, { passive: false });
        canvas.addEventListener("touchmove", handleTouchMoveMulti, { passive: false });
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("dblclick", handleDblClick);

        return () => {
            canvas.removeEventListener("wheel", onWheel);
            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
            canvas.removeEventListener("touchcancel", handleTouchCancel);
            canvas.removeEventListener("touchstart", handleTouchStartMulti);
            canvas.removeEventListener("touchmove", handleTouchMoveMulti);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            canvas.removeEventListener("dblclick", handleDblClick);
        };
    }, []);

    // ── Zoom helpers (center-anchored) ──
    const handleZoomIn = () => {
        const zoom = zoomRef.current;
        const candles = dataRef.current;
        if (!candles.length) return;

        const oldCount = zoom.visibleCount;
        const newCount = Math.max(zoom.min, oldCount - 5);
        if (newCount === oldCount) return;

        // Current visible range
        const oldStartIdx = Math.max(0, candles.length - oldCount - Math.floor(panRef.current.offset));
        const centerIdx = oldStartIdx + oldCount / 2;

        // New start index to keep same center
        let newStartIdx = Math.max(0, Math.min(candles.length - newCount, centerIdx - newCount / 2));
        newStartIdx = Math.floor(newStartIdx);

        // Convert to offset (offset = (total - visible) - startIdx)
        const newOffset = (candles.length - newCount) - newStartIdx;
        panRef.current.offset = Math.max(0, Math.min(newOffset, candles.length - newCount));

        zoom.visibleCount = newCount;
        zoom.userZoomed = true;
        panRef.current.userInteracted = true;   // <-- critical: prevent reset to live
    };

    const handleZoomOut = () => {
        const zoom = zoomRef.current;
        const candles = dataRef.current;
        if (!candles.length) return;

        const oldCount = zoom.visibleCount;
        const newCount = Math.min(zoom.max, oldCount + 5);
        if (newCount === oldCount) return;

        const oldStartIdx = Math.max(0, candles.length - oldCount - Math.floor(panRef.current.offset));
        const centerIdx = oldStartIdx + oldCount / 2;

        let newStartIdx = Math.max(0, Math.min(candles.length - newCount, centerIdx - newCount / 2));
        newStartIdx = Math.floor(newStartIdx);

        const newOffset = (candles.length - newCount) - newStartIdx;
        panRef.current.offset = Math.max(0, Math.min(newOffset, candles.length - newCount));

        zoom.visibleCount = newCount;
        zoom.userZoomed = true;
        panRef.current.userInteracted = true;   // <-- critical
    };

    // ── Go Live: latest candle pe wapas jaao ──
    const handleGoLive = () => {
        const zoom = zoomRef.current;
        const candles = dataRef.current;
        if (!candles.length) return;

        panRef.current.offset = 0;

    };

    return (
        <div className="chart-container">
            <canvas
                ref={canvasRef}
                className="trade-chart-container"
            />
            <div className="zoom-controls flex-row justify-content-center w-100">
                <button
                    onClick={handleZoomIn}
                    onTouchEnd={(e) => { e.stopPropagation(); handleZoomIn(); }}
                > <FontAwesomeIcon icon={faPlus}/> </button>
                <button
                    onClick={handleZoomOut}
                    onTouchEnd={(e) => { e.stopPropagation(); handleZoomOut(); }}
                > <FontAwesomeIcon icon={faMinus}/> </button>
                {panRef.current.offset !== 0 && <button
                    onClick={handleGoLive}
                    onTouchEnd={(e) => { e.stopPropagation(); handleGoLive(); }}
                    title="Go to live candle"
                > <FontAwesomeIcon icon={faPlay}/>  </button>}
            </div>


            {loading && <ChartLoader />}
        </div>
    );
}