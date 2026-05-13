// import React from "react";
// import './css/style.css'
// import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const navigate=useNavigate()
//   const { userData, loading, userTrade, totalUserTrade, totalUserOrder, userOrder } = useSelector((state) => state.user);
//   async function handleLogout() {
//     localStorage.clear()
//     sessionStorage.clear()
//     navigate('/')
//   }

//   return (
//     <div className="header d-flex justify-content-between align-items-center px-4">
//       <div>
//         <h5 className="mb-0">{userData?.currency=='usd'?'$':'₹'} {userData?.commissionAmount || 0}</h5>
//       </div>

//       <div className="d-flex align-items-center gap-3">
//         <div className="user-box px-3 py-2">
//           {userData?.email}
//         </div>
//         <button className="btn" onClick={()=>handleLogout()}>Logout<FontAwesomeIcon icon={faDoorOpen}/></button>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { useEffect, useRef, useState } from "react";
import './css/style.css'
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faBars, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header = ({sidebarOpen,setSidebarOpen}) => {
  const navigate=useNavigate()
  const { userData } = useSelector((state) => state.user);
  async function handleLogout() {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/')
  }
  
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    const showHandler = () => setOpen(true);
    const hideHandler = () => setOpen(false);
    dropdown.addEventListener("shown.bs.dropdown", showHandler);
    dropdown.addEventListener("hidden.bs.dropdown", hideHandler);
    return () => {
      dropdown.removeEventListener("shown.bs.dropdown", showHandler);
      dropdown.removeEventListener("hidden.bs.dropdown", hideHandler);
    };
  }, []);

  return (

<div className="affiliate-header">
<div className="d-flex align-items-center gap-2">
<button
className="affiliate-mobile-menu-btn"
onClick={()=>setSidebarOpen(!sidebarOpen)} >
<FontAwesomeIcon icon={faBars}/>
</button>
  <h5 className="mb-0 fs-16 fw-600">
      {userData?.currency=='usd'?'$':'₹'} {userData?.commissionAmount?.toFixed(2) || 0}
 </h5>

 </div>
  <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn d-flex align-items-center gap-2 border-0 px-0"
        type="button"
        data-bs-toggle="dropdown"
        onClick={() => setOpen(!open)}
      >
        <img
          src="/assets/images/chat-user.png"
          alt="user"
          width="40"
          height="40"
          className="rounded-circle"
        />
        <div className="text-start">
          <div style={{ fontSize: "14px", color: "#777" }}>Welcome</div>
          <div style={{ fontWeight: "600" }}>
            {userData?.name}
          </div>
        </div>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <li className="dropdown-item text-black fz-16 fw-500">
          {userData?.email}
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            Logout <FontAwesomeIcon icon={faDoorOpen} />
          </button>
        </li>
      </ul>

  </div>

</div>

  );
};

export default Header;