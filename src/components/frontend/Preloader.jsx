import React from 'react'

function Preloader() {
  return (
   <>
   <div id="preloader">
        <div className="preloader-wrap">
            <img src="/public/assets/images/chart-nw-logo.png" alt="logo" className="img-fluid preloader-icon" />
            <div className="loading-bar"></div>
        </div>
    </div>
   </>
  )
}

export default Preloader