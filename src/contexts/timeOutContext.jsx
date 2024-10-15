/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from "react";

const TimeOutContext = createContext();

// eslint-disable-next-line react/prop-types
export const TimeOutProvider = ({children}) => {
    const [isAuthSuccess, setIsAuthSuccess] = useState(() => !!sessionStorage.getItem("userData"));
    const login = (userData) =>{
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthSuccess(true);
    }
    const logout = () =>{
        sessionStorage.removeItem('userData');
        setIsAuthSuccess(false);
        window.location.href = '/';
    }
    useEffect(() => {
        if (!isAuthSuccess) return;
        const handleInactivity = () => {
            if(inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(
                    logout, 300000);
            }
        }
        let inactivityTimer = setTimeout(
            logout, 300000);

        window.addEventListener('mousemove', handleInactivity);
        window.addEventListener('keydown', handleInactivity);
        window.addEventListener('click', handleInactivity);

        return ()=> {
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', handleInactivity);
            window.removeEventListener('keydown', handleInactivity);
            window.removeEventListener('click', handleInactivity);
        }
    },[isAuthSuccess]);

    return (
        <TimeOutContext.Provider value={{isAuthSuccess, login, logout}}>
            {children}
        </TimeOutContext.Provider>
    );
}
export const useTimeOutContext = () => {
    return useContext(TimeOutContext);
};