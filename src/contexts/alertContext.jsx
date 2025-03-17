import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Alert } from "../components/Settings/alert";

const AlertContext = createContext();

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const hideAlert = () => {
    setAlertMessage("");
    setAlertType("");
  };

  return (
    <AlertContext.Provider value={{ alertMessage, alertType, showAlert }}>
      {children}
      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={hideAlert}
          className="z-50"
        />
      )}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
