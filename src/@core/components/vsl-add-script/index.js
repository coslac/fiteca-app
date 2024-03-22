import { Fragment, useState, useEffect, useMemo } from "react";
// ** Store & Actions
import {
  newSctCopy,
  getMyScripts,
  updateSctCopy,
} from "@src/views/pages/vsl-client/home/store";
import { useDispatch, useSelector } from "react-redux";

import "@styles/react/libs/noui-slider/noui-slider.scss";
import { useTranslation } from "react-i18next";
// ** Reactstrap Imports
import {
  Row,
  Label,
  Input,
  Form,
} from "reactstrap";
// ** Third Party Components
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

import { toast } from "react-toastify";
// ** Utils
import { selectThemeColors, todayDate } from "@utils";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import VSLModal from './../vsl-modal/index';

import './styles.scss';
import ReactSlider from "react-slider";
import { categoryOptions } from '@vslAdminViews/scripts/create/utils';
import { duplicateSctCopy } from "../../../views/pages/vsl-client/home/store";

const AddNewScript = ({ modal, setModal, id, data, edit, duplicate: duplicated, onFinish }) => {

  const { handleSubmit } = useForm();

  const { t } = useTranslation();
  const [itemOptions, setItemOptions] = useState([]);
  const [category, setCategory] = useState([]);
  const [sliderNumber, setSliderNumber] = useState(150);
  const [myScript, setMyScript] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [errorsForm, setErrosForm] = useState({
    nome: false,
    myScript: false
  })
  // ** Hooks
  const [scripts, setScripts] = useState([]);
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dataHome);

  useEffect(() => {
    if (myScript?.value) return setErrosForm(values => ({ ...values, myScript: false }))
  }, [myScript])

  const getLabel = (script) => {
    return `${script.gbl_usuario_by_usu_id_criacao ? script.gbl_usuario_by_usu_id_criacao.nome + "    -    " : ""}  ${script.nome}`
  }

  const handleItemOptions = list => {
    const videoVendas = list.filter(l => l.tipo === categoryOptions[0].value.toString()).map(l => ({ label: getLabel(l), value: l.id }))
    const cartaVendas = list.filter(l => l.tipo === categoryOptions[1].value.toString()).map(l => ({ label: getLabel(l), value: l.id }))
    const cartaVendasHigh = list.filter(l => l.tipo === categoryOptions[2].value.toString()).map(l => ({ label: getLabel(l), value: l.id }))
    const scriptUpsell = list.filter(l => l.tipo === categoryOptions[3].value.toString()).map(l => ({ label: getLabel(l), value: l.id }))
    const scriptDownsell = list.filter(l => l.tipo === categoryOptions[4].value.toString()).map(l => ({ label: getLabel(l), value: l.id }))

    const scriptOptions = [
      {
        label: categoryOptions[0].label,
        options: videoVendas,
      },
      {
        label: categoryOptions[1].label,
        options: cartaVendas,
      },
      {
        label: categoryOptions[2].label,
        options: cartaVendasHigh,
      },
      {
        label: categoryOptions[3].label,
        options: scriptUpsell,
      },
      {
        label: categoryOptions[4].label,
        options: scriptDownsell,
      },
    ];

    setItemOptions(scriptOptions);
  }

  const requestScripts = async () => {
    const result = await dispatch(getMyScripts());

    setScripts(result?.payload?.scripts);

    handleItemOptions(result?.payload?.scripts)
  }

  useEffect(() => {
    if (modal) {
      requestScripts()
    }
  }, [modal])

  useEffect(() => {
    if (errorsForm.nome) {
      setErrosForm(v => ({ ...v, nome: false }))
    }

    if (errorsForm.myScript) {
      setErrosForm(v => ({ ...v, myScript: false }))
    }
  }, [name, myScript])

  const {
    control,
    reset,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: useMemo(() => {
      if (!edit && !duplicated) {
        return { nome: "" };
      }
      setSliderNumber(data.ppm);

      setName(data.nome)

      const scpt = data.script;

      setCategory({
        value: scpt.id,
        label: scpt.nome
      })

      return { ...data, scripts: category };
    }, [data, store?.scripts?.length, category.length]),
  });

  function onSubmit() {

    if (!name) return setErrosForm(values => ({ ...values, nome: true }))

    if (!edit && !duplicated && !myScript?.value) return setErrosForm(values => ({ ...values, myScript: true }))


    setLoading(true)
    const resource = {
      nome: name,
      scpt_id: myScript.value || category.value,
      proj_id: id || data.proj_id,
      ppm: sliderNumber,
    };

    if (duplicated) {
      dispatch(duplicateSctCopy(resource))
    } else {
      if (!edit) {
        dispatch(newSctCopy(resource))
      } else {
        dispatch(updateSctCopy({
          ...resource,
          id: data.id,
        }));
      }

    }
    setModal(false);
    setLoading(false)
    reset();
  }

  const onDiscard = () => {
    clearErrors();
    setModal(false);
    reset();
  };

  const onChangeSlide = value => {
    setSliderNumber(value)
  }

  function controlStylesHasError(invalid) {
    return invalid ? "is-invalid" : "";
  }
  const condicional = edit || duplicated

  const colourStyles = {
    option: (provided) => ({
      ...provided,
      color: "#EEF5F8",
      fontWeight: "500",
      fontSize: "14px",
      lineHeight: "16px",
      letterSpacing: "0.4px",
    })
  }

  const formatGroupLabel = (data) => (
    <div className="group-styles">
      <div>{data.label}</div>
      <div className="group-badge-styles">{data.options.length}</div>
    </div>
  );

  return (
    <Fragment>
      <VSLModal
        isOpen={modal}
        toggle={() => setModal(!modal)}
        onClose={onDiscard}
        className="modal-dialog-centered modal-sm"
        title={duplicated ? 'Duplicar Script' : edit ? 'Editar Script' : t("Add script")}
        onConfirm={handleSubmit(onSubmit)}
        loading={loading}
      >
        <Form className="mb-40">
          <h6 className="text-neutral-white">{t("Basic information")}</h6>
          <div>
            <Label for="nome" className="paragraph-small-semi-bold text-lighter">
              {t("Nome") + ":*"}
            </Label>
            <Controller
              id="nome"
              name="nome"
              control={control}
              {...register("nome", {
                required: true,
                onChange: (e) => setName(e.target.value),
              })}
              render={({ field }) => (
                <Input
                  type="text"
                  name="nome"
                  placeholder={t("Type here...")}
                  invalid={errors.nome && true}
                  {...field}
                />
              )}
            />
            {errorsForm.nome && (
              <div className="text-error" for="scripts">{t("Name is required")}</div>
            )}
          </div>
          <Label className="paragraph-small-semi-bold text-lighter mt-9" for="scripts">
            {t("My scripts")}*
          </Label>
          {itemOptions && category && (
            <Controller
              id="scripts"
              name="scripts"
              control={control}
              {...register("scripts", { required: !condicional })}
              render={({ field: { onChange, value } }) => (
                <Select
                  id="scripts"
                  name="scripts"
                  theme={selectThemeColors}
                  className={`react-select react-script-select ${controlStylesHasError(
                    errors.scripts
                  )}`}
                  isDisabled={edit || duplicated}
                  classNamePrefix="select"
                  placeholder="Selecione..."
                  defaultValue={category}
                  options={itemOptions}
                  formatGroupLabel={formatGroupLabel}
                  styles={colourStyles}
                  onChange={(e) => {
                    setMyScript(e)
                  }}
                />
              )}
            />
          )}
          {errorsForm.myScript && (
            <div className="text-error" for="scripts">{t("Select is required")}</div>
          )}
          <Row>
            <h6 className="text-neutral-white vsl-subtitle-script me-4">
              {t("Aditional configuration")}
            </h6>
          </Row>
          <div>
            <Label className="paragraph-semi-bold text-lighter" for="scripts">
              {t("Words per minute")}
            </Label>
            <ReactSlider
              className="vsl-slider"
              step={10}
              value={sliderNumber}
              markClassName="vsl-mark"
              defaultValue={150}
              min={100}
              max={200}
              onChange={onChangeSlide}
              thumbClassName="vsl-thumb"
              trackClassName="vsl-track"
              renderThumb={(props, state) => (
                <div {...props}>
                  <div className="out-value">
                    {state.valueNow}
                  </div>
                  <div className="out-circle">
                    <div className="internal-circle" />
                  </div>
                </div>
              )}
            />
          </div>
        </Form>
      </VSLModal>
    </Fragment>
  );
};

export default AddNewScript;