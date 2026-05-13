import React, { useEffect, useState } from "react";
import { getSecureApiData } from "../services/api";
import { base_url } from "../baseUrl";
import Loader from "../components/frontend/Loader";

const TopAffiliate = () => {
    const [loading,setLoading]=useState(false)
    const [affiliates, setAffiliates] = useState([]);
    async function fetchTopAffiliate() {
        try {
            setLoading(true);
            const res = await getSecureApiData('top-affiliate');
            if (res.success) {
                setAffiliates(res.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTopAffiliate();
    }, []);

    return (
        <>
            {loading ? <Loader />
                : <div className="">
                    <h5 className="fz-20 fw-600">Top Affiliates</h5>

                    <div className="affiliate-section">
                        <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Photo</th>
                                    <th>Nickname</th>
                                    <th>Email</th>
                                    <th>Total Refferals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {affiliates?.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    affiliates?.filter(item=>item?.referralCount>0)?.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{ index + 1}</td>
                                            <td>
                                                <img
                                                    src={
                                                        user?.photo
                                                            ? user?.photo?.startsWith("http")
                                                                ? user?.photo
                                                                : `${base_url}/${user?.photo}`
                                                            : "/public/assets/images/chat-user.png"
                                                    }
                                                    alt="avatar"
                                                    className="rounded-circle"
                                                    width="40"
                                                    height="40"
                                                // onError={(e) => {
                                                //     e.target.onerror = null;
                                                //     e.target.src = "/chat-user.png";
                                                // }}
                                                />
                                            </td>
                                            <td>{user?.nickName}</td>
                                            <td>{user?.email}</td>
                                            <td>
                                                {user?.referralCount}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    </div>

                </div>}
        </>
    );
};

export default TopAffiliate;