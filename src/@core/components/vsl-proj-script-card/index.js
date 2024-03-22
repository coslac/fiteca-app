import "../vsl-script-card/vsl-script-card.scss";
import "./vsl-proj-script-card.scss";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  UncontrolledTooltip,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { AlertCircle } from "react-feather";
import { deleteSctCopy } from "@src/views/pages/vsl-client/home/store";
import VslAddScript from "../vsl-add-script";
import { useHistory } from "react-router-dom"

import { useDispatch } from "react-redux";
import moment from 'moment';
import { toast } from 'react-toastify';
import { categoryOptions } from '@vslAdminViews/scripts/create/utils';
import VSLModal from './../vsl-modal/index';
import { getSlideInfos } from './../../../utility/helpers/script-helper';
import { axiosDb } from '@configs/appConfig';
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png";
import { getProjectById } from "../../../views/pages/vsl-client/home/store";

const ConfirmationDelete = ({ id, isOpen, handleOpen, projectId, slidesInfo }) => {

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);

    let slidesResult;

    if (slidesInfo.slideTotal > 0) {
      slidesResult = slidesInfo.slides.map(async slide => {
        try {
          await axiosDb.delete(`_table/sct_copy_slide/${slide.id}`)
          return true;
        } catch (err) {
          return false;
        }
      })
    }

    if (slidesResult?.find(el => el === false)) {
      return false;
    }

    const deletedId = await dispatch(deleteSctCopy(id));
    if (deletedId.payload === id) {
      dispatch(getProjectById(projectId))
      toast.success("Script deletado com sucesso!");
    } else {
      toast.error("Falha ao deletar seu script!");
    }
    setLoading(false);
    return handleOpen(!isOpen);
  }

  return (
    <VSLModal
      isOpen={isOpen}
      toggle={() => handleOpen(!isOpen)}
      onClose={() => handleOpen(!isOpen)}
      className="modal-dialog-centered modal-sm"
      title="Deletar projeto?"
      onConfirm={confirmDelete}
      loading={loading}
    >
      {t("Are you sure that you want to delete this?")}
      {" "}
      {t("You won't be able to revert this!")}
    </VSLModal>
  );
}

const VslProjScriptCard = ({ data }) => {
  
  const { t } = useTranslation();
  
  const history = useHistory();

  const { nome, alterado_em } = data;
  const categoria = categoryOptions.find(el => el.value === data?.script.le_lista_categoria)?.label || '';

  const PlaceHolder = require("@src/assets/images/banner/OutCopy.svg").default;
  const backgroundImg = !data?.script.foto_capa_url ? PlaceHolder : data?.script.foto_capa_url;

  const [deleteScript, setDeleteScript] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState();

  const [percentage, setPercentage] = useState(0);
  const [slidesInfo, setSlidesInfo] = useState()

  const avatarImg = !userAvatar ? defaultAvatar : userAvatar;

  const getSlides = async () => {
    const result = await getSlideInfos(data?.id, data?.ppm);
    setSlidesInfo(result)
  }

  const getUser = async () => {
    const response = await axiosDb.get('_table/gbl_usuario', {
      params: {
        filter: `id=${data?.script.usu_id_criacao}`,
        fields: 'avatar'
      }
    })

    setUserAvatar(response?.data?.resource[0]?.avatar)
  }

  useEffect(() => {
    getSlides()
  }, [data])

  useEffect(() => {
    if (data?.script.usu_id_criacao) {
      getUser()
    }
  }, [data?.script.usu_id_criacao])


  return (
    <div className="vsl-card-script-container">
      <div className="absolute-class">
        <UncontrolledDropdown>
          <DropdownToggle tag="span">
            <button
              className="card-button-edit"
            >
              <img
                src={require('../../../assets/icons/svg/edit-icon.svg').default}
                alt="�cone de editar card"
                width={14}
              />
            </button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={"span"}
              onClick={() => {
                history.push(`/script-generator/${data.id}`)
              }}
            >
              <span>{t("Open")}</span>
            </DropdownItem>
            <DropdownItem
              tag={"span"}
              onClick={(e) => {
                e.preventDefault();
                setModal(!modal);
              }}
            >
              <span>{t("Edit")}</span>
            </DropdownItem>
            <DropdownItem
              tag={"span"}
              onClick={(e) => {
                e.preventDefault();
                setDuplicateModal(!duplicateModal);
              }}
            >
              <span className="align-middle">{t("Duplicate")}</span>
            </DropdownItem>
            <DropdownItem
              tag={"span"}
              onClick={(e) => {
                e.preventDefault();
                setDeleteScript(!deleteScript);
              }}
            >
              <span className="align-middle">{t("Delete")}</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div>
        <VslAddScript modal={modal} setModal={setModal} edit={true} data={data}/>
        <VslAddScript modal={duplicateModal} setModal={setDuplicateModal} duplicate={true} data={data} />
        <ConfirmationDelete slidesInfo={slidesInfo} id={data.id} projectId={data.proj_id} handleOpen={setDeleteScript} isOpen={deleteScript} />
        <div className="vsl-script-img">
          <img src={backgroundImg} alt={nome} width={202} height={39} className="vsl-image" />
          <img src={avatarImg} width="48px" height="48px" className="card-avatar-alt" />
        </div>
        <div className="mt-12">
          <div className="paragraph-small text-lighter">
            {categoria}
          </div>
          <div className="paragraph-lead text-offwhite mt-8">
            {nome}
          </div>
          <div className="paragraph-small-semi-bold text-darker mt-12">
            {'�ltima edi��o'}: {moment(alterado_em).format("DD/MM/YYYY")}
          </div>
        </div>
      </div>
      <Row className="proj-card-footer">
        <Col xl={4} className="d-flex flex-column text-center">
          <span className="paragraph-small text-lighter">Conclus�o</span>
          <span className="paragraph-lead-semi-bold">{percentage}%</span>
          <div />
        </Col>
        <Col xl={4} className="d-flex flex-column text-center mx-auto side-lines">
          <div className="flex-center">
            <div>
              <span className="mr-8 paragraph-small text-lighter">Tempo VSL</span>
              <UncontrolledTooltip
                key={`${data.id}-tooltip`}
                placement="bottom"
                target={`tooltip${data.id}`}
                className="tooltip-card"
              >
                {`Tempo previsto da VSL Final com base na m�dia de ${data.ppm}ppm.`}
              </UncontrolledTooltip>
            </div>
            <AlertCircle
              color="#8B61FF"
              size={12}
              className="my-auto"
              id={`tooltip${data.id}`}
            />
          </div>
          <span className="paragraph-lead-semi-bold">{slidesInfo?.vslTimeByWords}</span>
        </Col>
        <Col xl={4} className="d-flex flex-column text-center">
          <span className="paragraph-small text-lighter">{t("Slides")}</span>
          <span className="paragraph-lead-semi-bold">{slidesInfo?.slideTotal}</span>
        </Col>
      </Row>
    </div>
  );
};

export default VslProjScriptCard;