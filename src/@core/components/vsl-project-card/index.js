import "./vsl-project-card.scss";
import PropTypes from "prop-types";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {todayDate} from "@utils"
// ** Reactstrap Imports
// ** Reactstrap Imports
import {Card} from "reactstrap";


const VslProjectCard = ({ data, containerClassName, files, nomeProjeto, preview, urlImage }) => {
  // ** Hooks
  const { t } = useTranslation();

  const PlaceHolder = require("@src/assets/images/banner/clickmax-default.png").default
 // VERIFICACAO DA IMAGEM DE PREVIEW OU DE PROJETO
  const imagem = !data?.foto_capa_url ? PlaceHolder : data?.foto_capa_url;
  const fileList = files?.length <= 0 ?  PlaceHolder : files?.map((file, index) => URL.createObjectURL(file))
  const imageUrl = urlImage || fileList || imagem
// FIM VERIFICACAO IMAGEM
// VERIFICACAO NOME

  const nome = preview ? nomeProjeto : data?.nome
  const changedDate = preview ? todayDate() : data?.alterado_em
  /* APAGAR DEPOIS*/
  const qtde_scripts = data?.sct_copy_by_proj_id?.length || "0";

  return (
    <Card className={`mb-3 card-projeto-container ${containerClassName}`}>
      <div className="card-projeto-content">
        <div className="card-image">
          <img src={imageUrl} alt={data?.nome} width={100} height={100} className="image-front" />
          <img
            src={imageUrl}
            className="blur"
            alt={data?.nome}
            width={100}
            height={100}
          />
        </div>
        <div className="card-projeto-text">
          <div>
            <div className="paragraph-small text-lighter">{t("Project")}</div>
            <h5 className="text-offwhite">{nome}</h5>
          </div>
          <div>
            <div className="paragraph-small-semi-bold text-darker">
            </div>
            <div className="paragraph-small-semi-bold text-darker">
              {t("Last edited:")} {moment(changedDate).format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VslProjectCard;

VslProjectCard.propTypes = {
  containerClassName: PropTypes.string,
  nome: PropTypes.string,
  numScript: PropTypes.number,
  date: PropTypes.string,
};
