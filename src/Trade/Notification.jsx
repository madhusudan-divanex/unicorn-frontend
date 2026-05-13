import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getApiData, getSecureApiData, securePostData } from '../services/api';
import { base_url } from '../baseUrl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import './NotificationPanel.css';

const NotificationPanel = () => {
    const userId=JSON.parse(localStorage.getItem('userId'))
    const [siteLang,setSiteLang]=useState('en')
    const [notificationData, setNotificationData] = useState([])
    const { userRead } = useSelector(state => state.user)
    async function getNotificationData() {
        try {
            const result = await getSecureApiData(`get-user-notification/${userId}`);
            if (result.success) {
                const filterData = result?.notificationData?.filter(item => new Date(item.releaseDate) <= new Date())
                setNotificationData(filterData)
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
            id="notificationModal"
            tabIndex="-1"
            aria-labelledby="notificationModal"
            aria-hidden="true">
            <div className="modal-dialog notification-panel modal-md modal-dialog-end">
                <div className="modal-content bx-modal-popup-trade-search-section text-white">
                    <div className=" text-white p-3 rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{t('notification')}</h5>
                            {notificationData?.length >0 && <Button variant="link" className="text-light p-0" style={{ fontSize: '0.9rem' }}
                                onClick={()=>markAsRead('all')}>
                                {t('markAllRead')}
                            </Button>}
                        </div>
                        {notificationData?.length > 0 && <Card className="notif-data text-white mb-3 border-0 ">
                            <Card.Body>
                                { notificationData?.map((item, key) =>
                                    <div className="d-flex flex-column mt-4 position-relative" key={key} style={{cursor:'pointer'}} onClick={()=>markAsRead('single',item._id)}>
                                        <span className='trade-dot'></span>
                                        <img
                                            src={`${base_url}/${item?.photo}`}
                                            alt=""
                                            className="me-3"
                                        />
                                        <div>
                                            <p className="small mt-2 mb-0">
                                                <strong>{siteLang=='en' ? item?.title : item?.hindiTitle}</strong><br />
                                                {siteLang=='en' ? item?.description : item?.hindiDescription}
                                            </p>
                                            <small className="text-muted d-block mt-2">{new Date(item?.createdAt)?.toDateString() || '31/08/2025 19:39'}</small>
                                        </div>
                                    </div>)}
                            </Card.Body>
                        </Card>}
                        {notificationData?.length ==0 && 'No notification found'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
