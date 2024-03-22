import "./vsl-script-card.scss";

import { useTranslation } from "react-i18next";
import VslInitials from './../vsl-initials/index';
import { categoryOptions } from '@vslAdminViews/scripts/create/utils';

// ** Reactstrap Imports

const VslScriptCard = ({ data }) => {
  // ** Hooks
  const { t } = useTranslation();

  const { nome, foto_capa_url, link_checkout, le_lista_categoria } = data;
  const autor = data.gbl_usuario_by_usu_id_criacao?.nome || "Autor";
  const avatar = data.gbl_usuario_by_usu_id_criacao?.avatar

  const categoria = categoryOptions.find(el => el.value === le_lista_categoria)?.label || '';

  return (
    <a href={`${link_checkout}`} target="_blank">
      <div className="vsl-card-script-main">
        {
          !foto_capa_url ? (
            <img
              alt="preview"
              className="vsl-image-bg"
              height={100}
              src={require('../../../assets/images/banner/vsl-bg-default.png').default}
            />
          ) : <img className="vsl-image-bg" src={foto_capa_url} alt={nome} height={100} />
        }
        <div className="vsl-image-container-card">
          {
            avatar ? (
              <img
                className='vsl-user-circle'
                alt="preview padrão"
                src={avatar}
              />
            ) : (<VslInitials name={autor} />)
          }
        </div>
        <div className="paragraph-small text-lighter">{autor}</div>
        <div className="paragraph-lead text-offwhite vsl-name-script-card">{nome}</div>
        <div className="vsl-category-on-fire">
          <div className="paragraph-small text-lighter">
            {categoria}
          </div>
          <div className="vsl-hr" />
          <div className="vsl-d-flex">
            <span className="fire-color">
              {'150º'}
            </span>
            <img
              className="fire-icon"
              width={10} height={10}
              src={require('../../../assets/icons/svg/fire-red.svg').default}
            />
          </div>
        </div>
      </div>
    </a>
  );
};

export default VslScriptCard;
