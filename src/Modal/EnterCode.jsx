import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {  faClose, faGift } from "@fortawesome/free-solid-svg-icons";

import {  Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function EnterCode() {
    return (
        <div >
            <div
                className="modal fade"
                id="firstModal"
                tabIndex="-1"
                aria-labelledby="addSalesModalLabels"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content modal-coupan-content">
                        <div className="modal-header modal-coupan-header">
                            <div>
                                <h5 className="modal-title title-heading" id="addSalesModalLabels">
                                    <FontAwesomeIcon icon={faGift} style={{ color: "#FF7A00" }} /> Cashback
                                </h5>
                            </div>
                            <button
                                type="button"
                                className=" ms-auto text-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <FontAwesomeIcon icon={faClose}/>
                            </button>
                        </div>
                        <div className="modal-body login-section py-0">
                            <div className="modal-coupan-bx">
                                <div className="">
                                    <p className="mb-0 text-center">Enter your promo code now and activate it. You can use it at any time.</p>
                                </div>
                            </div>
                            <div>
                                <Form.Group className="mt-3">
                                    <div className="custom-frm-bx">
                                        <input type="text" className="form-control" id="cpass" placeholder=" " required />
                                        <label for="cpass">Promo code</label>
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="d-flex gap-4">
                                <a href="" className="modal-active-btn" data-bs-dismiss="modal">Yes, activate</a>
                                <a  href="" className="modal-active-btn modal-cancel-btn" data-bs-dismiss="modal">Cancel</a>
                            </div>
                        </div>
                        <div className="modal-footer modal-coupan-footer">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnterCode
