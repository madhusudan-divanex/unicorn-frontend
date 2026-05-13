import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import SideBar from './SideBar';

function MainLayout() {
    const [bidData,setBidData]=useState()

    return (
      
        <div className="layout-container">
            <aside className="left-sidebar">
            <div className="left-navigation">
              <SideBar bidData={bidData}/>
            </div>
          </aside>
          <div className="right-section">

            <Header /> 
            <Outlet />
          </div>
        </div>
    )
}

export default MainLayout
