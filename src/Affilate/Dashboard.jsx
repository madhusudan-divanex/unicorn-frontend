import React, { useEffect, useState } from "react";
import './css/style.css'
import { useSelector } from "react-redux";
import { getSecureApiData } from "../services/api";
import { Link, NavLink } from "react-router-dom";

const Dashboard = () => {
    const { userData, loading, userTrade, totalUserTrade, totalUserOrder, userOrder } = useSelector((state) => state.user);
    const [cardData, setCardData] = useState({})
    const userId = JSON.parse(localStorage.getItem('userId'))
    async function fetchAffiliateDashboard() {
        try {
            const res = await getSecureApiData(`affiliate-dashboard/${userId}`)
            if (res.success) {
                setCardData(res.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        if (userId) {
            fetchAffiliateDashboard()
        }
    }, [userId])
    return (
        <section className="pt-3">
            <div className="container-fluid">
            <div className="row"> 
                <div className="col-lg-4  mb-4 mb-lg-0">
                    <div className="balance-card">
                        <h6>Your balance</h6>
                        <h2>{userData?.currency == "usd" ? '$' : "₹"} {userData?.commissionAmount.toFixed(2)}</h2>
                        <Link to={'/affiliate/withdraw'} className="thm-btn w-100">
                            Go to Withdrawal →
                        </Link>
                        <div className="earnings-box mt-3">
                           <p className="mb-0"> Earnings for all time <br />
                            <strong className="text-white">{userData?.currency == "usd" ? "$" : "₹"}{"  "}{cardData?.totalCommission}</strong></p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="balance-card">
                                <h3>{cardData?.totalTrades || 0}</h3>
                                <p className="mb-0">Commission Trade</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="balance-card">
                                <h3>{cardData?.inactiveUser || 0}</h3>
                                <p className="mb-0">Inactive User</p>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="balance-card">
                                <h3>{cardData?.activeUser || 0}</h3>
                                <p className="mb-0">Active User</p>
                            </div>
                        </div>


                        <div className="col-md-6 mb-3">
                            <div className="balance-card">
                                <h3>{cardData?.totalUsers || 0}</h3>
                                <p className="mb-0">Registrations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        </section>
    );
};

export default Dashboard;