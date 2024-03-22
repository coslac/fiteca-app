import React from "react";
import {useTranslation} from "react-i18next";

import "./vsl-welcome.scss";

// ** Utils
import {isUserLoggedIn} from "@utils";

const VslWelcome = ({children}) => {
  // ** Hooks
  const { t } = useTranslation();

  // ** State
  const [userData, setUserData] = React.useState(null);

  //** ComponentDidMount
  React.useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  return (
    <div className="welcome-text mb-5">
   {children}
    </div>
  );
};

export default VslWelcome;
