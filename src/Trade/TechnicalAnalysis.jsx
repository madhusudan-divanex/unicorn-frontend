import React, { useState } from "react";


function TechnicalAnalysis({ openAnalysis, handleAnalysis }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (name) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  return (
    <>
      <div>
        {/* Open Button */}
        {/* <button
        className="btn btn-primary m-3"
        onClick={() => setOpenSidebar(true)}
      >
        Open Technical Analysis
      </button> */}

        {/* Sidebar */}
        {openAnalysis && <div className={`ts-sidebar ${openAnalysis ? "ts-open" : ""}`}>
          <div className="ts-header">
            <h6>Technical Analysis</h6>
            <button className="ts-close" type="button" onClick={handleAnalysis}>
              ×
            </button>
          </div>

          {/* Indicators */}
          <div className="ts-section">
            <div
              className="ts-section-header"
              onClick={() => toggleMenu("indicators")}
            >
              <span>📈 Indicators</span>
              {/* <span>{activeMenu === "indicators" ? "<i className="fa-solid fa-chevron-up"></i>" : "<i className="fa-solid fa-chevron-down"></i>"}</span> */}
              <span>
                {activeMenu === "indicators" ? (
                  <i className="fa-solid fa-chevron-up"></i>
                ) : (
                  <i className="fa-solid fa-chevron-down"></i>
                )}
              </span>

            </div>
            {activeMenu === "indicators" && (
              <ul className="ts-list">
                <li>SMA</li>
                <li>EMA</li>
                <li>Parabolic SAR</li>
                <li>Zig Zag</li>
                <li>Ichimoku Cloud</li>
              </ul>
            )}
          </div>

          {/* Drawing */}
          <div className="ts-section">
            <div
              className="ts-section-header"
              onClick={() => toggleMenu("drawing")}
            >
              <span><i className="fa-solid fa-pencil"></i> Drawing</span>
              <span>{activeMenu === "drawing" ? (
                <i className="fa-solid fa-chevron-up"></i>
              ) : (
                <i className="fa-solid fa-chevron-down"></i>
              )}</span>
            </div>
            {activeMenu === "drawing" && (
              <ul className="ts-list">
                <li>Trend Line</li>
                <li>Fib Retracement</li>
              </ul>
            )}
          </div>

          {/* Oscillators */}
          <div className="ts-section">
            <div
              className="ts-section-header"
              onClick={() => toggleMenu("oscillators")}
            >
              <span><i className="fa-solid fa-chart-simple"></i> Oscillators</span>
              <span>{activeMenu === "oscillators" ? (
                <i className="fa-solid fa-chevron-up"></i>
              ) : (
                <i className="fa-solid fa-chevron-down"></i>
              )}</span>
            </div>
            {activeMenu === "oscillators" && (
              <ul className="ts-list">
                <li>RSI</li>
                <li>MACD</li>
              </ul>
            )}
          </div>

          {/* Strategies */}
          <div className="ts-section">
            <div
              className="ts-section-header"
              onClick={() => toggleMenu("strategies")}
            >
              <span>⚡ Strategies</span>
              <span>{activeMenu === "strategies" ? (
                <i className="fa-solid fa-chevron-up"></i>
              ) : (
                <i className="fa-solid fa-chevron-down"></i>
              )}</span>
            </div>
            {activeMenu === "strategies" && (
              <ul className="ts-list">
                <li>Golden Cross</li>
                <li>Death Cross</li>
              </ul>
            )}
          </div>
        </div>}
      </div>
    </>


  );
}

export default TechnicalAnalysis;
