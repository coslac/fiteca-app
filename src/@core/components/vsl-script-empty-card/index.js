import React from "react";
import {useTranslation} from "react-i18next";

import "./vsl-script-empty-card.scss";

const VslScriptEmptyCard = ({ openModal, show }) => {
  // ** Hooks
  const { t } = useTranslation();

  return (
    <div className="vsl-card-script d-flex flex-column align-items-center justify-content-center">
      <div className="icone">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M37.8018 43.8372V43.8372C37.8018 38.6804 41.9822 34.5 47.139 34.5V34.5C52.2958 34.5 56.4762 38.6804 56.4762 43.8372V43.8372C56.4762 48.994 52.2958 53.1744 47.139 53.1744V53.1744C41.9822 53.1744 37.8018 48.994 37.8018 43.8372Z" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M43.3018 40L51.3018 48" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M43.3018 48L51.3018 40" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.6219 20.2062H37.3781" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.6219 30.0002H30" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5548 10.3252H39.8374C42.554 10.3252 44.7561 12.5274 44.7561 15.2439V29" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.9328 49.6749H31.5M18.9328 49.6749C20.9702 49.6749 22.6219 48.0233 22.6219 45.9859V42.2968C22.6219 40.9386 23.723 39.8375 25.0812 39.8375H31.5M18.9328 49.6749C16.8954 49.6749 15.2438 48.0233 15.2438 45.9859V14.0142C15.2438 11.9768 13.5922 10.3252 11.5548 10.3252C9.51736 10.3252 7.86572 11.9768 7.86572 14.0142V20.1626C7.86572 21.5209 8.96681 22.622 10.3251 22.622H15.2438" stroke="#3E4859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="text-center">
        <div className="paragraph-lead text-offwhite">
          O projeto não possui scripts.
        </div>
        <div className="subtitle paragraph-small-semi-bold">
          <a onClick={openModal} className="empty-link-vsl">
            {t("Click here")}{" "}
          </a>{" "}
          e adicione.
        </div>
      </div>
    </div>
  );
};

export default VslScriptEmptyCard;
