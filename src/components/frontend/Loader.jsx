import React from 'react'
import './loader.css'

function Loader() {
  return (
    <div className="loader">
      <div className="loader-content">
        {/* Logo */}
        <div className="loader-logo">
          <img src="/assets/images/chart-nw-logo.png" alt="logo"
            onError={(e) => { e.target.style.display = 'none' }} />
          <span className="loader-logo-text">Trading</span>
        </div>

        {/* Sliding progress bar */}
        <div className="loader-bar-wrap">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
