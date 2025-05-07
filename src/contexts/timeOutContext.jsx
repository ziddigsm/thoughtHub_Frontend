import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

const TimeOutContext = createContext();

const TimeOutProvider = ({ children }) => {
  const [isAuthSuccess, setIsAuthSuccess] = useState(
    () => !!localStorage.getItem("userData")
  );

  const login = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsAuthSuccess(true);
  };
  const logout = () => {
    localStorage.clear();
    setIsAuthSuccess(false);
    window.location.href = "/";
  };
  useEffect(() => {
    const activityChannel = new BroadcastChannel("user-active"); // to sync activity across tabs
    if (!isAuthSuccess) return;
    let inactivityTimer = null;
    const handleInactivity = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      inactivityTimer = setTimeout(logout, 300000);
    };

    const handleActivity = () => {
      handleInactivity();
      activityChannel.postMessage({ type: "activity", timestamp: Date.now() });
    };

    const syncActivity = (event) => {
      if (event.data.type === "activity") {
        handleInactivity();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    activityChannel.onmessage = syncActivity;

    handleInactivity();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      activityChannel.close();
    };
  }, [isAuthSuccess]);

  return (
    <TimeOutContext.Provider value={{ isAuthSuccess, login, logout }}>
      {children}
    </TimeOutContext.Provider>
  );
};

TimeOutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTimeOutContext = () => {
  return useContext(TimeOutContext);
};

export { TimeOutProvider, useTimeOutContext };
