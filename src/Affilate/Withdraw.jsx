import React, { useState } from "react";
import { securePostData } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/features/userSlice";
import { toast } from "react-toastify";

const Withdraw = () => {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("USDT");
    const [account, setAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const userId = JSON.parse(localStorage.getItem("userId"));
    const dispatch=useDispatch()
    const [withdrawForm, setWithdrawForm] = useState({ userId, method: 'bank', amount: undefined, holderName: '', upiId: '', accountNumber: undefined, ifscCode: '' })

    const { userData, userTrade, totalUserTrade, totalUserOrder, userOrder } = useSelector((state) => state.user);



    const availableBalance = 250; // 🔥 API se replace kar sakte ho

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!withdrawForm?.amount || withdrawForm?.amount <= 0) {
            return setMessage("Enter valid amount");
        }

        if (withdrawForm?.amount > userData?.commissionAmount) {
            return setMessage("Amount exceeds available balance");
        }


        try {
            setLoading(true);


            const result = await securePostData('affiliate/withdraw-amount', withdrawForm);
            if (result.success) {
                setWithdrawForm({ userId, type: 'bank', amount: 0, holderName: '', upiId: '', accountNumber: undefined, ifscCode: '' });
                dispatch(fetchUserData());
                toast.success("Your withdraw request has been sent!");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            setMessage("Error submitting request");
        } finally {
            setLoading(false);
        }
    };
    function withdrawChange(e) {
        const { name, value } = e.target
        setWithdrawForm({
            ...withdrawForm,
            [name]: value
        })
    }

    return (
       <section>
        <div className="container-fluid">
             <div className="row justify-content-center">
            <div className="col-lg-12">

                <div className="deposit-main-section">
            <h4 className="text-white">Withdraw Funds</h4>

            <div className="alert alert-info">
                Available Balance: <strong>{userData?.currency == "usd" ? "$" : "₹"} {userData?.commissionAmount.toFixed(2)}</strong>
            </div>

                <div className="">
            <form onSubmit={handleSubmit}>
                <div className="custom-frm-bx">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control new-form-control"
                        placeholder="Enter amount"
                        name="amount"
                        required
                        value={withdrawForm?.amount}
                        onChange={withdrawChange}
                    />
                </div>

                <div className="custom-frm-bx">
                    <label className="form-label">Payment Method</label>
                    <select
                        className="form-select new-form-control"
                        required
                        name="method"
                        value={withdrawForm?.method}
                        onChange={withdrawChange}
                    >
                        <option value="bank">Net Banking</option>
                        <option value="upi">UPI</option>
                        {/* <option value="PayPal">PayPal</option> */}
                    </select>
                </div>
                {withdrawForm?.method == "bank" &&
                    <>
                        <div className="custom-frm-bx">
                            <label className="form-label">Account Holder Name</label>
                            <input
                                type="number"
                                className="form-control new-form-control" 
                                placeholder="Enter account holder name"
                                name="holderName"
                                required={withdrawForm?.method=="bank"}
                                value={withdrawForm?.holderName}
                                onChange={withdrawChange}
                            />
                        </div>
                        <div className="custom-frm-bx">
                            <label className="form-label">Account Number</label>
                            <input
                                type="number"
                                className="form-control new-form-control"
                                placeholder="Enter account holder name"
                                name="accountNumber"
                                required={withdrawForm?.method=="bank"}
                                value={withdrawForm?.accountNumber}
                                onChange={withdrawChange}
                            />
                        </div>
                        <div className="custom-frm-bx">
                            <label className="form-label">IFSC Code</label>
                            <input
                                type="number"
                                className="form-control new-form-control"
                                placeholder="Enter account holder name"
                                name="ifscCode"
                                required={withdrawForm?.method=="bank"}
                                value={withdrawForm?.ifscCode}
                                onChange={withdrawChange}
                            />
                        </div>
                    </>}
                {withdrawForm?.method == "upi" &&
                    <div className="custom-frm-bx">
                        <label className="form-label">Upi Id</label>
                        <input
                            type="text"
                            className="form-control new-form-control"
                            placeholder="Enter upi id"
                            name="upiId"
                            required={withdrawForm?.method=="upi"}
                            value={withdrawForm?.upiId}
                            onChange={withdrawChange}
                        />
                    </div>}


                {/* Message */}
                {message && (
                    <div className="alert alert-warning">{message}</div>
                )}

               <div className="text-center">
                 <button
                    type="submit"
                    className="thm-btn"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Submit Withdrawal"}
                </button>
               </div>
            </form>
             </div>
        </div>

            </div>

        </div>
        </div>
       </section>
    );
};

export default Withdraw;