import React, { useEffect, useState } from "react";
import { getSecureApiData } from "../services/api";
import Loader from "../components/frontend/Loader";

const UserTradesList = () => {
    // Dummy Trade Data (API se replace kar sakte ho)
    const [commissionList, setCommissionList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedId = JSON.parse(localStorage.getItem("userId"));
        setUserId(storedId);
    }, []);


    async function fetchMyUsers(page = 1) {
        if (!userId) return;

        try {
            setLoading(true);

            const res = await getSecureApiData(
                `commision-list/${userId}?page=${page}&limit=10`
            );
            if (res.success) {
                setCommissionList(res.data);
                setTotalPages(res.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    // ✅ FIX: Added currentPage dependency
    useEffect(() => {
        if (userId) fetchMyUsers(currentPage);
    }, [userId, currentPage]);

    return (
        <>
        {loading?<Loader/>
        :
        
        <div className="">
            <h5 className="fz-20 fw-600">Users Trade History</h5>

           <div className="affiliate-section">
             <div className="table-responsive">
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Trade Pair</th>
                            <th>User Name</th>
                            <th>Bid Date & Time</th>
                            <th>My Commission </th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionList.map((trade, index) => (
                            <tr key={trade.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <span className="pair-title">
                                        {trade?.tradeId?.tradePair}
                                    </span>
                                </td>
                                <td>{trade?.userId?.nickName}</td>
                                <td>
                                    {new Date(trade?.tradeId?.createdAt).toLocaleString('en-GB')}
                                </td>
                                <td className="fw-semibold text-success">
                                    {trade?.currency == "usd" ? "$" : "₹"}{"  "}{trade?.amount?.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
           </div>

            {/* Pagination */}
            <nav>
                <ul className="pagination affiliate-pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                        <button
                            className="page-link"
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                        <li
                            key={i}
                            className={`page-item ${currentPage === i + 1 && "active"}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li
                        className={`page-item ${currentPage === totalPages && "disabled"
                            }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>}
        </>
    );
};

export default UserTradesList;