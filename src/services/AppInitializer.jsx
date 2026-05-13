import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/features/userSlice";
import { Outlet, useNavigate } from 'react-router-dom';

export const AppInitializer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (!userData) {
            dispatch(fetchUserData());
        }
    }, [dispatch, userData]);

    return <Outlet />;
};
