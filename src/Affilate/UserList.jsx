import React, { useEffect, useState } from "react";
import { getSecureApiData } from "../services/api";
import { base_url } from "../baseUrl";
import Loader from "../components/frontend/Loader";

const UsersList = () => {
    const [myUsers, setMyUsers] = useState([]);
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
                `refferal-user/${userId}?page=${page}&limit=10`
            );
            console.log("calling")
            if (res.success) {
                setMyUsers(res.data);
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
        fetchMyUsers(currentPage);
    }, [userId, currentPage]);

    return (
        <>
            {loading?<Loader/>
            :
            
            <div className="">
                <h5 className="text-black fz-20 fw-600">Users List</h5>
                <div className="affiliate-section">
                    <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Photo</th>
                                <th>Nickname</th>
                                <th>Email</th>
                                <th>Account Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                myUsers?.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
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
                                            
                                            />
                                        </td>
                                        <td>{user?.nickName}</td>
                                        <td>{user?.email}</td>
                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                </div>

                {/* Pagination */}
                {/* <nav>
                    <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() =>
                                    currentPage > 1 && setCurrentPage((prev) => prev - 1)
                                }
                            >
                                Previous
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, i) => (
                            <li
                                key={i}
                                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() =>
                                    currentPage < totalPages &&
                                    setCurrentPage((prev) => prev + 1)
                                }
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav> */}

                <nav>
      <ul className="pagination affiliate-pagination justify-content-end">

        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() =>
              currentPage > 1 && setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </button>
        </li>
        {[...Array(totalPages)].map((_, i) => (
          <li
            key={i}
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() =>
              currentPage < totalPages &&
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>
        </li>

      </ul>
    </nav>


            </div>
            
            }
        </>
    );
};

export default UsersList;