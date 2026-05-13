import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Error404 = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/');
    }, [navigate]);
    return null
};

export default Error404;
