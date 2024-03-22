import React from "react";
import {useTranslation} from "react-i18next";
import {ReactComponent as NoProject} from '../../../views/pages/vsl-client/components/scriptPreview/assets/noProject.svg'

import "./vsl-project-empty-card.scss";

const VslProjectEmptyCard = ({ setShow }) => {
  // ** Hooks
  const { t } = useTranslation();

  return (
    <div className="vsl-card-dashed">
      <div className="icone">
        <NoProject />
      </div>
      <div>
        <div className="paragraph-lead text-offwhite">
          Você não possui nenhum projeto!
        </div>
        <div className="subtitle">
          <a onClick={setShow} className="empty-link-vsl">
            {t("Click here")}{" "}
          </a>{" "}
          {t("and create your project now.")}
        </div>
      </div>
    </div>
  );
};

export default VslProjectEmptyCard;
