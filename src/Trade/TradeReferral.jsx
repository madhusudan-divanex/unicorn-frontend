import React, { useEffect, useState } from 'react'
import { getApiData } from '../services/api'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

function TradeReferral() {
    const userId=JSON.parse(localStorage.getItem('userId'))
    const [contactInfo, setContactInfo] = useState({})
    const inviteLink = `https://www.unicornoptions.com/register?invite=${userId}`;
    const { userData, loading, error, joinedTournament ,userSetting} = useSelector((state) => state.user);
    async function getSocialData() {
        const data = await getApiData(`get-general-data`)
        setContactInfo(data?.generalData?.socialNetwork)

    }
    useEffect(() => {
        getSocialData()
    }, [])
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (userSetting && userSetting.language) {
            
            changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
        }
    }, [userSetting]);
    const handleCopy = () => {
        const text = inviteLink;
        if (navigator.clipboard && window.isSecureContext) {
            // Modern clipboard API
            navigator.clipboard
                .writeText(text)
                .then(() => toast.success("Copied to clipboard!"))
                .catch(() => toast.error("Copy failed"));
        } else {
            // Fallback for HTTP / older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                toast.success("Copied to clipboard!");
            } catch (err) {
                toast.error("Copy failed");
            }
            document.body.removeChild(textArea);
        }

    };
    return (
        <>
            {/* Refferal Modal */}
            <div className="container ">
                <div
                    className="modal fade"
                    id="addSalesModals"
                    tabIndex="-1"
                    aria-labelledby="addSalesModalLabels"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered  refferal-main-crd">
                        <div className="modal-content modal-coupan-content refferal-main-popup-bx">
                            <div className="modal-header modal-coupan-header ">
                                <div>
                                    <h5 className="modal-title title-heading" id="addSalesModalLabels">
                                        {t('contactWithUs')}
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className=" me-3 text-white"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <FontAwesomeIcon icon={faClose} className='text-white'/>
                                </button>
                            </div>
                            <div className="modal-body  ">
                                <div className="referral-banner-pic">
                                    <img src="/assets/images/contact-frm.png" alt="" className="referral-bnner-logo" />
                                </div>

                                <div className="contct-frm-sec d-flex flex-column align-items-center justify-content-center">
                                    <a target='_blank' href={contactInfo?.facebook} className="social-btn social-facebook">
                                        {t('facebook')} <i className="fab fa-facebook-f" />
                                    </a>
                                    <a target='_blank' href={contactInfo?.facebook} className="social-btn social-instagram">
                                        {t('instagram')} <i className="fab fa-instagram" />
                                    </a>
                                    <a target='_blank' href={contactInfo?.facebook} className="social-btn social-twitter">
                                        {t('twitter')} <i className="fab fa-twitter" />
                                    </a>
                                    <button onClick={handleCopy} className="social-btn social-twitter">
                                        Copy Link <i className="fab fa-twitter" />
                                    </button>
                                </div>

                            </div>

                            <div className="modal-footer modal-coupan-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TradeReferral