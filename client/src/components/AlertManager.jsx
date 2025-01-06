import { Fragment, createContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export const AlertManagerContext = createContext();

export const AlertManagerProvider = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const setAlert = (newAlertInfo) => {
    if (alertInfo.show) {
      setTimeout(() => {
        setAlertInfo(newAlertInfo)
      }, 3000);
    }
    else {
      setAlertInfo(newAlertInfo)
    }
  }

  return (
    <AlertManagerContext.Provider value={{
      setAlert
    }}>
      <Fragment>
        <Snackbar
          open={alertInfo.show}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        >
          <Alert severity={alertInfo.type}>
            {alertInfo.message}
          </Alert>
        </Snackbar>
        {children}
      </Fragment>
    </AlertManagerContext.Provider>
  );
}