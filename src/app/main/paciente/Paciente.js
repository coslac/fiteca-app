import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTheme } from '@mui/material/styles';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import SwipeableViews from 'react-swipeable-views';
import { Backdrop, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon, Step, StepContent, StepLabel, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Logo from 'app/theme-layouts/shared-components/Logo';
import Logo2 from 'app/theme-layouts/shared-components/Logo2';
import DadosPessoais from './Steps/DadosPessoais';
import { FormProvider, useForm } from 'react-hook-form';
import { selectFuseCurrentLayoutConfig, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import _ from 'lodash';
import { navbarToggle } from 'app/store/fuse/navbarSlice';
import CondicoesAtuaisHist from './Steps/CondicoesAtuaisHist';
import HabitosVidaDiaria from './Steps/HabitosVidaDiaria';
import AntSistemicosPat from './Steps/AntSistemicosPat';
import TipoCabelo from './Steps/TipoCabelo';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import axios from 'axios';
import getConfigAPI from 'src/config';
import Delete from '@mui/icons-material/Delete';
import { Add, Close, MedicalInformation, Save } from '@mui/icons-material';
import FuseSuspense from '@fuse/core/FuseSuspense';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAuth0 } from '@auth0/auth0-react';

const steps = [
    {
        title: 'DADOS PESSOAIS *',
        subtitle: 'Informações pessoais do paciente. Esta seção é obrigatória.',
        order: 1,
        content: <DadosPessoais />
    },
    {
        title: 'CONDIÇÕES ATUAIS E HISTÓRICO',
        subtitle: 'Informações sobre a condição atual do paciente e seu histórico.',
        order: 2,
        content: <CondicoesAtuaisHist />
    },
    {
        title: 'HÁBITOS DE VIDA DIÁRIA',
        subtitle: 'Informações sobre os hábitos da vida diária do paciente.',
        order: 3,
        content: <HabitosVidaDiaria />
    },
    {
        title: 'ANTECEDENTES SISTÊMICOS E PATOLÓGICOS',
        subtitle: 'Informações sobre os antecedentes sistêmicos e patológicos do paciente.',
        order: 4,
        content: <AntSistemicosPat />
    },
    {
        title: 'TIPO DE CABELO',
        subtitle: 'Informações sobre o tipo de cabelo do paciente.',
        order: 5,
        content: <TipoCabelo />
    },
    {
        title: 'ALOPECIAS E SEUS MÉTODOS DE AVALIAÇÃO',
        subtitle: 'Dive deep into Google Assistant apps using Firebase',
        order: 6,
        content: <DadosPessoais />
    }
]


const schema = yup.object().shape({
  nome: yup.string().required('Campo Obrigatório'),
});

const apiURL = getConfigAPI().API_URL;

function Paciente(props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const theme = useTheme();
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const routeParams = useParams();
  const { courseId } = routeParams;
  const pageLayout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch(); 
  const [paciente, setPaciente] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [actions, setActions] = useState([]);
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth0();

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
        nome: '',
        data_nascimento: '',
        cpf: '',
        rg: '',
        sexo: '',
        email: '',
        telefone: '',
        celular: '',
        profissao: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        ficha_anamnese: {
          condicoesAtuaisHistorico: {
            queixaPrincipal: '',
            historicoAfeccaoAtual: '',
            antecedentesPessoaisSaude: '',
            historicoFamiliarSaude: '',
          },
          habitosVidaDiaria: {
            estiloVida: '',
            estiloVidaTipoFrequencia: '',
            fumante: null,
            etilista: null,
            trabalho: '',
            qualidadeSono: '',
            funcionamentoIntestinal: '',
            gestante: null,
            periodoGestacional: '',
            gravidezAnterior: null,
            filhos: null,
            partos: null,
            cicloMenstrual: '',
            dum: '',
            usoAnticoncepcional: null,
            tipoAnticoncepcional: '',
            ingestaoAgua: '',
            medicamentos: '',
            exposicaoSol: '',
          },
          antecedentesSistemicosPat: {
            values: [],
            observacoes: '',
            proteseMetalica: null,
            proteseMetalicaDesc: '',
            cirurgias: null,
            cirurgiasDesc: '',
            cirurgiaPlastica: null,
            cirurgiaPlasticaDesc: '',
            antecedenteOncologico: null,
            antecedenteOncologicoDesc: '',
            outros: null,
            outrosDesc: '',
          },
          tipoCabelo: {
            curvatura: '',
            diametroFio: '',
            densidade: '',
            qualidadeHasteCapilar: '',
            couroCabeludo: '',
            processosQuimicosExistentes: [],
            outrosProcessosQuimicos: null,
            outrosProcessosQuimicosDesc: '',
            usoAparelhos: '',
            sinaisClinicos: '',
            sintomas: '',
            biotipoCutaneo: '',
            achadosDermatoscopia: '',
            alopecia: '',
            forma: '',
            diagnostico: '',
            usoSecadores: null,
            usoSecadoresFrequencia: '',
            usoPranchas: null,
            usoPranchasFrequencia: '',
            usoModeladores: null,
            usoModeladoresFrequencia: '',
            usoCosmeticosFrequencia: '',
            observacoesGerais: '',
          }
        }
    }
});

  const { id } = useParams();

  const { formState, watch, control } = methods;

  const { isValid, isDirty } = formState;

  useEffect(() => {
    async function getPaciente() {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiURL}/paciente/${id}`, {
          headers: {
            UserAuth0Id: user.sub
          }
        });
        console.log('paciente: ', res)
        if(res.status === 200) {
          setPaciente(res.data);
          methods.setValue('nome', res.data.nome);
          methods.setValue('data_nascimento', res.data.data_nascimento);
          methods.setValue('cpf', res.data.cpf || '');
          methods.setValue('rg', res.data.rg);
          methods.setValue('sexo', res.data.sexo);
          methods.setValue('email', res.data.email);
          methods.setValue('telefone', res.data.telefone);
          methods.setValue('celular', res.data.celular);
          methods.setValue('profissao', res.data.profissao);
          methods.setValue('endereco', res.data.endereco);
          methods.setValue('numero', res.data.numero);
          methods.setValue('complemento', res.data.complemento);
          methods.setValue('bairro', res.data.bairro);
          methods.setValue('cidade', res.data.cidade);
          methods.setValue('estado', res.data.estado);
          methods.setValue('cep', res.data.cep);
          methods.setValue('ficha_anamnese.condicoesAtuaisHistorico.queixaPrincipal', res.data.fichas_anamnese[0].condicoesAtuaisHistorico.queixaPrincipal);
          methods.setValue('ficha_anamnese.condicoesAtuaisHistorico.historicoAfeccaoAtual', res.data.fichas_anamnese[0].condicoesAtuaisHistorico.historicoAfeccaoAtual);
          methods.setValue('ficha_anamnese.condicoesAtuaisHistorico.antecedentesPessoaisSaude', res.data.fichas_anamnese[0].condicoesAtuaisHistorico.antecedentesPessoaisSaude);
          methods.setValue('ficha_anamnese.condicoesAtuaisHistorico.historicoFamiliarSaude', res.data.fichas_anamnese[0].condicoesAtuaisHistorico.historicoFamiliarSaude);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.estiloVida', res.data.fichas_anamnese[0].habitosVidaDiaria.estiloVida);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.estiloVidaTipoFrequencia', res.data.fichas_anamnese[0].habitosVidaDiaria.estiloVidaTipoFrequencia);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.fumante', res.data.fichas_anamnese[0].habitosVidaDiaria.fumante);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.etilista', res.data.fichas_anamnese[0].habitosVidaDiaria.etilista);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.trabalho', res.data.fichas_anamnese[0].habitosVidaDiaria.trabalho);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.qualidadeSono', res.data.fichas_anamnese[0].habitosVidaDiaria.qualidadeSono);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.funcionamentoIntestinal', res.data.fichas_anamnese[0].habitosVidaDiaria.funcionamentoIntestinal);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.gestante', res.data.fichas_anamnese[0].habitosVidaDiaria.gestante);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.periodoGestacional', res.data.fichas_anamnese[0].habitosVidaDiaria.periodoGestacional);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.gravidezAnterior', res.data.fichas_anamnese[0].habitosVidaDiaria.gravidezAnterior);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.filhos', res.data.fichas_anamnese[0].habitosVidaDiaria.filhos);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.partos', res.data.fichas_anamnese[0].habitosVidaDiaria.partos);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.cicloMenstrual', res.data.fichas_anamnese[0].habitosVidaDiaria.cicloMenstrual);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.dum', res.data.fichas_anamnese[0].habitosVidaDiaria.dum);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.usoAnticoncepcional', res.data.fichas_anamnese[0].habitosVidaDiaria.usoAnticoncepcional);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.tipoAnticoncepcional', res.data.fichas_anamnese[0].habitosVidaDiaria.tipoAnticoncepcional);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.ingestaoAgua', res.data.fichas_anamnese[0].habitosVidaDiaria.ingestaoAgua);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.medicamentos', res.data.fichas_anamnese[0].habitosVidaDiaria.medicamentos);
          methods.setValue('ficha_anamnese.habitosVidaDiaria.exposicaoSol', res.data.fichas_anamnese[0].habitosVidaDiaria.exposicaoSol);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.values', res.data.fichas_anamnese[0].antecedentesSistemicosPat.values);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.observacoes', res.data.fichas_anamnese[0].antecedentesSistemicosPat.observacoes);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.proteseMetalica', res.data.fichas_anamnese[0].antecedentesSistemicosPat.proteseMetalica);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.proteseMetalicaDesc', res.data.fichas_anamnese[0].antecedentesSistemicosPat.proteseMetalicaDesc);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.cirurgias', res.data.fichas_anamnese[0].antecedentesSistemicosPat.cirurgias);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.cirurgiasDesc', res.data.fichas_anamnese[0].antecedentesSistemicosPat.cirurgiasDesc);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.cirurgiaPlastica', res.data.fichas_anamnese[0].antecedentesSistemicosPat.cirurgiaPlastica);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.cirurgiaPlasticaDesc', res.data.fichas_anamnese[0].antecedentesSistemicosPat.cirurgiaPlasticaDesc);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.antecedenteOncologico', res.data.fichas_anamnese[0].antecedentesSistemicosPat.antecedenteOncologico);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.antecedenteOncologicoDesc', res.data.fichas_anamnese[0].antecedentesSistemicosPat.antecedenteOncologicoDesc);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.outros', res.data.fichas_anamnese[0].antecedentesSistemicosPat.outros);
          methods.setValue('ficha_anamnese.antecedentesSistemicosPat.outrosDesc', res.data.fichas_anamnese[0].antecedentesSistemicosPat.outrosDesc);
          methods.setValue('ficha_anamnese.tipoCabelo.curvatura', res.data.fichas_anamnese[0].tipoCabelo.curvatura);
          methods.setValue('ficha_anamnese.tipoCabelo.diametroFio', res.data.fichas_anamnese[0].tipoCabelo.diametroFio);
          methods.setValue('ficha_anamnese.tipoCabelo.densidade', res.data.fichas_anamnese[0].tipoCabelo.densidade);
          methods.setValue('ficha_anamnese.tipoCabelo.qualidadeHasteCapilar', res.data.fichas_anamnese[0].tipoCabelo.qualidadeHasteCapilar);
          methods.setValue('ficha_anamnese.tipoCabelo.couroCabeludo', res.data.fichas_anamnese[0].tipoCabelo.couroCabeludo);
          methods.setValue('ficha_anamnese.tipoCabelo.processosQuimicosExistentes', res.data.fichas_anamnese[0].tipoCabelo.processosQuimicosExistentes);
          methods.setValue('ficha_anamnese.tipoCabelo.outrosProcessosQuimicos', res.data.fichas_anamnese[0].tipoCabelo.outrosProcessosQuimicos);
          methods.setValue('ficha_anamnese.tipoCabelo.outrosProcessosQuimicosDesc', res.data.fichas_anamnese[0].tipoCabelo.outrosProcessosQuimicosDesc);
          methods.setValue('ficha_anamnese.tipoCabelo.usoAparelhos', res.data.fichas_anamnese[0].tipoCabelo.usoAparelhos);
          methods.setValue('ficha_anamnese.tipoCabelo.sinaisClinicos', res.data.fichas_anamnese[0].tipoCabelo.sinaisClinicos);
          methods.setValue('ficha_anamnese.tipoCabelo.sintomas', res.data.fichas_anamnese[0].tipoCabelo.sintomas);
          methods.setValue('ficha_anamnese.tipoCabelo.biotipoCutaneo', res.data.fichas_anamnese[0].tipoCabelo.biotipoCutaneo);
          methods.setValue('ficha_anamnese.tipoCabelo.achadosDermatoscopia', res.data.fichas_anamnese[0].tipoCabelo.achadosDermatoscopia);
          methods.setValue('ficha_anamnese.tipoCabelo.alopecia', res.data.fichas_anamnese[0].tipoCabelo.alopecia);
          methods.setValue('ficha_anamnese.tipoCabelo.forma', res.data.fichas_anamnese[0].tipoCabelo.forma);
          methods.setValue('ficha_anamnese.tipoCabelo.diagnostico', res.data.fichas_anamnese[0].tipoCabelo.diagnostico);
          methods.setValue('ficha_anamnese.tipoCabelo.usoSecadores', res.data.fichas_anamnese[0].tipoCabelo.usoSecadores);
          methods.setValue('ficha_anamnese.tipoCabelo.usoSecadoresFrequencia', res.data.fichas_anamnese[0].tipoCabelo.usoSecadoresFrequencia);
          methods.setValue('ficha_anamnese.tipoCabelo.usoPranchas', res.data.fichas_anamnese[0].tipoCabelo.usoPranchas);
          methods.setValue('ficha_anamnese.tipoCabelo.usoPranchasFrequencia', res.data.fichas_anamnese[0].tipoCabelo.usoPranchasFrequencia);
          methods.setValue('ficha_anamnese.tipoCabelo.usoModeladores', res.data.fichas_anamnese[0].tipoCabelo.usoModeladores);
          methods.setValue('ficha_anamnese.tipoCabelo.usoModeladoresFrequencia', res.data.fichas_anamnese[0].tipoCabelo.usoModeladoresFrequencia);
          methods.setValue('ficha_anamnese.tipoCabelo.usoCosmeticosFrequencia', res.data.fichas_anamnese[0].tipoCabelo.usoCosmeticosFrequencia);
          methods.setValue('ficha_anamnese.tipoCabelo.observacoesGerais', res.data.fichas_anamnese[0].tipoCabelo.observacoesGerais);          
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    console.log('id: ', id)
    if(id) {
      getPaciente();
      setActions([
        { icon: <Save color="success" />, name: 'Salvar', click: handleSave },
        { icon: <MedicalInformation color="primary" />, name: 'Exames', click: handleClose },
        { icon: <Delete color="error" />, name: 'Excluir', click: handleDelete },
      ]);
    } else {
      setActions([
        { icon: <Add color="success" />, name: 'Cadastrar Paciente' },
        { icon: <Close color="primary" />, name: 'Cancelar' },
      ]);
    }
  }, []);

console.log('isDirty: ', isDirty)

const handleSave = async () => {
  try {
    console.log('control: ', control?._formValues)
    console.log('isDirtyyyy: ', isDirty)
    const formValues = control?._formValues;
      const data = {
        nome: formValues?.nome,
        data_nascimento: formValues?.data_nascimento,
        cpf: formValues?.cpf === '' ? null : formValues?.cpf,
        rg: formValues.rg,
        sexo: formValues.sexo,
        email: formValues.email,
        telefone: formValues.telefone,
        celular: formValues.celular,
        profissao: formValues.profissao,
        endereco: formValues.endereco,
        numero: formValues.numero,
        complemento: formValues.complemento,
        bairro: formValues.bairro,
        cidade: formValues.cidade,
        estado: formValues.estado,
        cep: formValues.cep,
      }
  
      const ficha = formValues.ficha_anamnese;

      const res = await axios.put(`${apiURL}/paciente/${id}`, {data, ficha});
      console.log('res saveee: ', res)
      if(res.status === 200) {
        alert('Paciente atualizado com sucesso!');
        window.location.href = '/pacientes';
      }
  } catch(e) {
    console.log('erroooor: ', e);
  }
}

const handleDelete = async () => {
  console.log('delete click')
}


useEffect(() => {
  if(id) {
    setBtnEnabled(isDirty);
  } else {
    setBtnEnabled(isValid);
  }
}, [isDirty, isValid]);

//   useEffect(() => {
//     /**
//      * If the course is opened for the first time
//      * Change ActiveStep to 1
//      */
//     if (course && course.progress.currentStep === 0) {
//       dispatch(updateCourse({ progress: { currentStep: 1 } }));
//     }
//   }, [dispatch, course]);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleAdd = async () => {
    try {
      const form = control?._formValues;
      const data = {
        nome: form.nome,
          data_nascimento: form.data_nascimento,
          cpf: form.cpf === '' ? null : form.cpf,
          rg: form.rg,
          sexo: form.sexo,
          email: form.email,
          telefone: form.telefone,
          celular: form.celular,
          profissao: form.profissao,
          endereco: form.endereco,
          numero: form.numero,
          complemento: form.complemento,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep,
      }
  
      const ficha = form.ficha_anamnese;
      ficha.data_avaliacao = new Date().toLocaleString();
  
      const res = await axios.post(`${apiURL}/paciente`, {data, ficha}, {
        headers: {
          UserAuth0Id: user.sub
        }
      });

      if(res.status === 201) {
        alert('Paciente cadastrado com sucesso!');
        window.location.href = '/pacientes';
      }
    } catch (e) {
      console.log(e);
    }
  }

  const hideMenu = () => {
    dispatch(navbarToggle());  
  }

  useEffect(() => {
    hideMenu();
  }, []);


  function updateCurrentStep(index) {
    if (index > steps.length || index < 0) {
      return;
    }
    setCurrentStep(index);
    
    // dispatch(updateCourse({ progress: { currentStep: index } }));
  }

  function handleNext() {
    updateCurrentStep(currentStep + 1);
  }

  function handleBack() {
    updateCurrentStep(currentStep - 1);
  }

  function handleStepChange(index, bln) {
    console.log("veio: ", bln)
    updateCurrentStep(index);
  }

  const activeStep = currentStep !== 0 ? currentStep : 1;

  console.log('currentStep: ', currentStep)
  return (
    <>
      {isLoading ? (
        <FuseLoading />
      ):(

        <FusePageSimple
          content={
              <Box className="w-full" sx={{ flexGrow: 1 }}>
                <Hidden lgDown>
                  {/* <CourseProgress className="sticky top-0 z-10" course={course} /> */}
                </Hidden>

                <Hidden lgUp>
                  <Paper
                    className="flex sticky top-0 z-10 items-center w-full px-16 py-8 border-b-1 shadow-0"
                    square
                  >
                    <IconButton to="/pacientes" component={Link} className="">
                      <FuseSvgIcon>
                        {theme.direction === 'ltr'
                          ? 'heroicons-outline:arrow-sm-left'
                          : 'heroicons-outline:arrow-sm-right'}
                      </FuseSvgIcon>
                    </IconButton>

                    <Typography className="text-13 font-medium tracking-tight mx-10">
                      Lista de Pacientes
                    </Typography>
                  </Paper>
                </Hidden>
                
                      <Box sx={{ position: 'fixed', zIndex: 1, right: '0.5rem', mt: 2, height: 320 }}>
                      <Backdrop open={open} />
                      <SpeedDial
                        ariaLabel="Button Actions"
                        FabProps={{ size: 'medium'}}
                        sx={{ position: 'fixed', right: '0.5rem' }}
                        icon={<SpeedDialIcon />}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={open}
                        direction='down'
                      >
                        {actions.map((action) => (
                          <SpeedDialAction
                            key={action.name}
                            icon={action.name === 'Salvar' ? isDirty ? action.icon : <Save /> : action.icon }
                            className={action.name === 'Salvar' ? isDirty ? '' : 'disable-hover' : ''}
                            disableTouchListener={action.name === 'Salvar' ? isDirty : false}
                            disableHoverListener={action.name === 'Salvar' ? isDirty : false}
                            disableFocusListener={action.name === 'Salvar' ? isDirty : false}
                            disableInteractive={action.name === 'Salvar' ? isDirty : false}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={action.click}
                          />
                        ))}
                      </SpeedDial>
                      </Box>
                <SwipeableViews index={activeStep - 1} enableMouseEvents >
                  {steps.map((step, index) => (
                    <div
                      className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64"
                      key={index}
                    >
                      <Paper className="w-full max-w-lg mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow overflow-hidden">
                          <Grid container spacing={2} className='mb-4'>
                              <Grid item xs={12} className='flex flex-col justify-content-center align-items-center'>
                                <Typography variant="h5" fontWeight={'bold'} className='p-0 m-0'>{id ? 'Editar Paciente' : 'Novo Paciente'}</Typography>
                              </Grid>
                              <Grid item xs={12} className='flex flex-col justify-content-center align-items-center'>
                                  <div className='flex flex-row' style={{justifyContent: 'space-between', width: '100%'}}>
                                  <div className='mt-4 flex flex-col'>
                                      <Typography variant="h5" className='p-0 m-0'>Ficha de Anamnese</Typography>
                                      <Typography sx={{fontWeight: 'bold'}} variant="h6">Dermoterapia Capilar</Typography>
                                  </div>
                                      <Logo2 />
                                  </div>
                              </Grid>
                              <Grid item xs={12}>
                                  <Typography className='mt-10' style={{textAlign: 'center', fontWeight: 'bold'}} variant="h6">{step.title}</Typography>
                              </Grid>
                          </Grid>
                          <FormProvider {...methods}>
                              {step.content}
                          </FormProvider>
                      </Paper>
                    </div>
                  ))}
                </SwipeableViews>

                <Hidden lgDown>
                  <div className="flex justify-center w-full sticky bottom-0 p-16 pb-32 z-10">
                    <ButtonGroup
                      variant="contained"
                      aria-label=""
                      className="rounded-full"
                      color="secondary"
                    >
                      <Button
                        className="min-h-56 rounded-full"
                        size="large"
                        startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
                        onClick={handleBack}
                      >
                        Anterior
                      </Button>
                      <Button
                        className="pointer-events-none min-h-56"
                        size="large"
                      >{`${activeStep}/${steps.length}`}</Button>
                      <Button
                        className="min-h-56 rounded-full"
                        size="large"
                        endIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>}
                        onClick={handleNext}
                      >
                        Próximo
                      </Button>
                    </ButtonGroup>
                  </div>
                </Hidden>

                <Hidden lgUp>
                  <Box
                    sx={{ backgroundColor: 'background.paper' }}
                    className="flex sticky bottom-0 z-10 items-center w-full p-16 border-t-1"
                  >
                    <IconButton
                      onClick={(ev) => setLeftSidebarOpen(true)}
                      aria-label="open left sidebar"
                      size="large"
                    >
                      <FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
                    </IconButton>

                    <Typography className="mx-8">{`${activeStep}/${steps.length}`}</Typography>

                    {/* <CourseProgress className="flex flex-1 mx-8" course={course} /> */}

                    <IconButton onClick={handleBack}>
                      <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
                    </IconButton>

                    <IconButton onClick={handleNext}>
                      <FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
                    </IconButton>
                  </Box>
                </Hidden>
              </Box>
          }
          leftSidebarOpen={leftSidebarOpen}
          leftSidebarOnClose={() => {
            setLeftSidebarOpen(false);
          }}
          leftSidebarWidth={300}
          leftSidebarContent={
            <>
              <div className="p-24" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                  to="/pacientes"
                  component={Link}
                  color="secondary"
                  variant="text"
                  startIcon={
                    <FuseSvgIcon size={20}>
                      {theme.direction === 'ltr'
                        ? 'heroicons-outline:arrow-sm-left'
                        : 'heroicons-outline:arrow-sm-right'}
                    </FuseSvgIcon>
                  }
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    size='small'
                    disabled={id ? !isDirty : !isValid}
                    onClick={id ? handleSave : handleAdd}
                  >
                    {id ? 'Salvar' : 'Cadastrar'}
                  </Button>
                  {/* {id && (
                    <Box sx={{ height: open ? 330 : '6rem', transform: 'translateZ(0px)', flexGrow: 1, marginLeft: '10px'}}>
                    <Backdrop color='#ff6c02' open={open} />
                    <SpeedDial
                      ariaLabel="Button Actions"
                      sx={{ position: 'relative', bottom: 0, right: 0 }}
                      icon={<SpeedDialIcon />}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      open={open}
                      direction='down'
                    >
                      {actions.map((action) => (
                        <SpeedDialAction
                          key={action.name}
                          icon={action.icon}
                          tooltipTitle={action.name}
                          tooltipOpen
                          onClick={handleClose}
                        />
                      ))}
                    </SpeedDial>
                    </Box>
                  )} */}
                </Box>
                <Divider className="mb-10 mt-10" />
              </div>
              <Divider />
              <Stepper classes={{ root: 'p-32' }} activeStep={activeStep - 1} orientation="vertical">
                {steps.map((step, index) => {
                  return (
                    <Step
                      key={index}
                      sx={{
                        '& .MuiStepLabel-root, & .MuiStepContent-root': {
                          cursor: 'pointer!important',
                        },
                        '& .MuiStepContent-root': {
                          color: 'text.secondary',
                          fontSize: 13,
                        },
                      }}
                      onClick={() => handleStepChange(step.order)}
                      expanded
                    >
                      <StepLabel
                        className="font-medium"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'background.default',
                            '& .MuiStepIcon-text': {
                              fill: (_theme) => _theme.palette.text.secondary,
                            },
                            '&.Mui-completed': {
                              color: 'secondary.main',
                              '& .MuiStepIcon-text ': {
                                fill: (_theme) => _theme.palette.secondary.contrastText,
                              },
                            },
                            '&.Mui-active': {
                              color: 'secondary.main',
                              '& .MuiStepIcon-text ': {
                                fill: (_theme) => _theme.palette.secondary.contrastText,
                              },
                            },
                          },
                        }}
                      >
                        {step.title}
                      </StepLabel>
                      <StepContent>{step.subtitle}</StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </>
          }
          ref={pageLayout}
        />
      )}
    </>
  );
}

export default Paciente;
