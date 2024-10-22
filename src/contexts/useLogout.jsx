import { useTimeOutContext } from "./timeOutContext";
import { useCallback } from "react";

export function useLogout() {
    const {logout} = useTimeOutContext();
    const handleLogout = useCallback(() => {
        logout();
        window.location.href = "/";
    }, [logout]);
    return {handleLogout};
}