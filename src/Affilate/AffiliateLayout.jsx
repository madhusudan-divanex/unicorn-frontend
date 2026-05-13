// import React, { useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import LeftSidebar from "./LeftSideBar";
// import Header from "./Header";
// import "./css/style.css";
// import { useDispatch } from "react-redux";
// import { fetchUserData } from "../redux/features/userSlice";

// const AffiliateLayout = () => {
//     const dispatch = useDispatch()
//     useEffect(()=>{
//         dispatch(fetchUserData())
//     },[])

//     return (
//         <div className="main-wrapper">
//             <LeftSidebar />
//             <div className="content-wrapper">
//                 <Header />
//                 <div className="page-content p-4">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AffiliateLayout;


// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import LeftSidebar from "./LeftSideBar";
// import Header from "./Header";
// import "./css/style.css";
// import { useDispatch } from "react-redux";
// import { fetchUserData } from "../redux/features/userSlice";

// const AffiliateLayout = () => {

//   const dispatch = useDispatch()
//   const [sidebarOpen,setSidebarOpen] = useState(false)

//   useEffect(()=>{
//       dispatch(fetchUserData())
//   },[])

//   return (
//     <div className="main-wrapper">

//       <LeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

//       <div className="content-wrapper">

//         <Header setSidebarOpen={setSidebarOpen}/>

//         <div className="page-content p-3">
//             <Outlet/>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default AffiliateLayout;


import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSideBar";
import Header from "./Header";
import "./css/style.css";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../redux/features/userSlice";

const AffiliateLayout = () => {

  const dispatch = useDispatch()
  const [sidebarOpen,setSidebarOpen] = useState(window.innerWidth > 991);

  useEffect(()=>{
      dispatch(fetchUserData())
  },[])

  useEffect(()=>{
  const handleResize = () => {
    if(window.innerWidth <= 991){
      setSidebarOpen(false)
    }else{
      setSidebarOpen(true)
    }
  }

  handleResize()
  window.addEventListener("resize", handleResize)

  return () => window.removeEventListener("resize", handleResize)
},[])

  return (
    <div className={`main-wrapper ${sidebarOpen ? "sidebar-open" : "sidebar-close"}`}>

      <LeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      <div className="content-wrapper">

        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <div className="page-content p-3">
            <Outlet/>
        </div>

      </div>

    </div>
  );
};

export default AffiliateLayout;