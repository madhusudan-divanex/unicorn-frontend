import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getApiData, getSecureApiData, securePostData } from '../services/api';
import { base_url } from '../baseUrl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import './PlatFormStatus.css';

const PlatFormStatus = () => {
    const userId=JSON.parse(localStorage.getItem('userId'))
    const [siteLang,setSiteLang]=useState('en')
    const [platformData,setPlatformData]=useState()
    const { userRead } = useSelector(state => state.user)
    async function getNotificationData() {
        try {
            const result = await getSecureApiData(`platform-status`);
            if (result.success) {
                setPlatformData(result.data)
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.message || 'An error occurred');
        }
    }

    useEffect(() => {
        getNotificationData();
    }, []);
    async function markAsRead(type = 'single', id) {
    let notificationIds = [];

    if (type === 'all') {
        // Collect all notification IDs from the current list
        notificationIds = notificationData.map(n => n._id);
    } else if (id) {
        // Only add the specific notification ID if provided
        notificationIds.push(id);
    }
    const data = { notificationIds, userId };

    try {
        const result = await securePostData('read-notification', data);
        if (result.success) {
            getNotificationData()
        } else {
            toast.error(result.message || 'Failed to mark as read');
        }
    } catch (error) {
        console.error(error);
        toast.error(error?.message || 'An error occurred');
    }
}
 const { t, i18n } = useTranslation();
  const { userSetting, } = useSelector((state) => state.user);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    if (userSetting && userSetting.language) {
      
      changeLanguage(userSetting.language == 'english' ? 'en' : 'hi');
      setSiteLang(userSetting.language == 'english' ? 'en' : 'hi')
    }
  }, [userSetting]);
    return (
        <div className="modal fade "
            id="platFormModal"
            tabIndex="-1"
            aria-labelledby="platFormModal"
            aria-hidden="true">
            <div className="modal-dialog notification-panel modal-md modal-dialog-end">
                <div className="modal-content bx-modal-popup-trade-search-section text-white">
                    <div className=" text-white p-3 rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-2">{t('PlatForm Status')}</h5>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <span>Total Payout:</span>
                                <span className='fw-600'>{platformData?.totalPayout || 0}</span>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <span>Today Trades:</span>
                                <span className='fw-600'>{platformData?.totalTrades || 0}</span>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <span>Win Trades:</span>
                                <span className='fw-600'>{platformData?.winTrades || 0}</span>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <span>Loss Trades:</span>
                                <span className='fw-600'>{platformData?.lossTrades || 0}</span>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatFormStatus;
