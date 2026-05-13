import React, { useEffect, useState } from 'react'
import { getApiData } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

function PrivacyPolicy() {
    const [cmsData, setCmsData] = useState({})
    async function fetchCmsData() {
        try {
            const result = await getApiData('get-cms-data?page=privacy-policy');
            if (result.success) {
                const data = result.cmsData
                setCmsData(data);
            }
        } catch (error) {
            console.error('Error fetching CMS data:', error);
        }
    }
    useEffect(() => {
        fetchCmsData()
    }, [])
    const {defaultLang}=useSelector(state=> state.wallet)
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    useEffect(() => {
        if (defaultLang) {
            changeLanguage(defaultLang);
        }
    }, [defaultLang]);

    return (

        <>

          <section className="about-section all-hm-banner" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7  col-sm-12 ">
              <div className='contact-content text-center' >
                 <h2 className='text-center'>{t('privacyPolicy')}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>


        <section className="about-section">
            <div className=' container'>
                <div className='row'>
                    <div className='col-lg-12'>
                       <div className='privacy-content'>
                          <div
                        dangerouslySetInnerHTML={{ __html: defaultLang=='en'? cmsData?.content :cmsData?.hindiContent }} />
                </div>
                       </div>

                    </div>

                </div>
              
        </section>

        
        </>

        
    )
}

export default PrivacyPolicy
