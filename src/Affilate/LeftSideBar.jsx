// import React from "react";
// import './css/style.css'
// import { NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUsers } from "@fortawesome/free-solid-svg-icons";

// const LeftSidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="logo p-3 mt-2 text-center">
//         <div className="text-center" style={{cursor:"pointer"}} onClick={()=>{
//             navigate('/affiliate/dashboard')
//           }}>
//             <img src="/assets/images/chart-nw-logo.png" className="chart-logo" />
//           </div>
//         <small className="text-white text-center">Affiliate Center</small>
//       </div>
 
//       <ul className="nav flex-column mt-4">
//         <li className="nav-item"><NavLink to="/affiliate/dashboard" className="nav-link">Dashboard</NavLink></li>
//         <li className="nav-item"><NavLink to='/affiliate/user-list' className="nav-link">Users</NavLink></li>
//         <li className="nav-item"><NavLink to='/affiliate/commission-list' className="nav-link">Commission List</NavLink></li>
//         <li className="nav-item"><NavLink to='/affiliate/refferal-link' className="nav-link">Refferal Link</NavLink></li>
//         <li className="nav-item"><NavLink to="/affiliate/top-affiliate" className="nav-link">TOP10 Partners</NavLink></li>
//         <li className="nav-item"><NavLink to='/affiliate/support' className="nav-link">Support</NavLink></li>
//       </ul>
//     </div>
//   );
// };

// export default LeftSidebar;

import React from "react";
import './css/style.css'
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const LeftSidebar = ({sidebarOpen,setSidebarOpen}) => {

  const navigate = useNavigate()

  return (
    <div className={`affiliate-sidebar ${sidebarOpen ? "active" : ""}`}>

      <button className="close-btn" onClick={()=>setSidebarOpen(false)}>
        <FontAwesomeIcon icon={faClose}/>
      </button>

      <div className="logo p-3 mt-2 text-center">
        <div 
        className="text-center"
        style={{cursor:"pointer"}}
        onClick={()=>navigate('/affiliate/dashboard')}
        >
          <img src="/assets/images/chart-nw-logo.png" className="chart-logo" />
        </div>
        <h5 className="text-white fz-16">Affiliate Center</h5>
      </div>

      <ul className="nav flex-column mt-4 px-3">

        <li className="nav-item">
          <NavLink to="/affiliate/dashboard" className="nav-link">Dashboard</NavLink>
        </li>

        <li className="nav-item">
          <NavLink to='/affiliate/user-list' className="nav-link">Users</NavLink>
        </li>

        <li className="nav-item">
          <NavLink to='/affiliate/commission-list' className="nav-link">Commission List</NavLink>
        </li>

        <li className="nav-item">
          <NavLink to='/affiliate/refferal-link' className="nav-link">Refferal Link</NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/affiliate/top-affiliate" className="nav-link">TOP10 Partners</NavLink>
        </li>

        <li className="nav-item">
          <NavLink to='/affiliate/support' className="nav-link">Support</NavLink>
        </li>

      </ul>

    </div>
  );
};

export default LeftSidebar;