import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { forwardRef, useEffect, useState } from 'react';
import { Add, Create, Edit, EditNoteOutlined, PlusOneRounded, SaveAltOutlined } from '@mui/icons-material';
import axios from 'axios';
import getConfigAPI from 'src/config';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CircularProgress, Dialog } from '@mui/material';
import { showMessage } from 'app/store/fuse/messageSlice';

const apiURL = getConfigAPI().API_URL;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ClienteHeader({props, isEditParam, isChangeForm, clienteAddParam, handleSave, isValid}) {
    const dispatch = useDispatch();
    const featuredImageId = '';
    const images = [];
    const name = 'SambaTech';
    const theme = useTheme();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [clienteAdd, setClienteAdd] = useState(null);
    const [titleEdit, setTitleEdit] = useState('');
    const [titleAdd, setTitleAdd] = useState('');
    const [isEdit, setIsEdit] = useState(true);
    const [isChange, setIsChange] = useState(isChangeForm);
    const [formAddIsValid, setFormAddIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setIsChange(isChangeForm);
    }, [isChangeForm]);

    useEffect(() => {
            setIsEdit(isEditParam);
            if (isEditParam) {
                if (props && props?.nome) {
                    setTitleEdit(`${props?.nome} | Editar Cliente`);
                    setCliente(props);
                }
            } else {
                if (clienteAdd && clienteAdd?.tipo === 'Conjunto de Clientes') {
                    setTitleAdd('Novo Conjunto de Clientes');
                } else {
                    setTitleAdd('Novo Cliente');
                }
            }
    }, [isEditParam, props]);

    useEffect(() => {
        if (clienteAddParam) {
            setClienteAdd(clienteAddParam);
            setTitleAdd('Novo Cliente');
        }
    }, [clienteAddParam]);

    function validaFormAdd(formValues) {
        console.log('formValues para validar', formValues);
        if(!formValues) {
            return false;
        }

        if(!formValues?.nome || formValues?.nome === '') {
            return false;
        }

        if(!formValues?.tipo || formValues?.tipo === '') {
            return false;
        } else if(formValues?.tipo === 'Conjunto de Clientes' && (!formValues?.conjunto_pacientes || formValues?.conjunto_pacientes.length < 2)) {
            return false;
        } else if(formValues?.tipo === 'Conjunto de Clientes' && (!formValues?.conjunto_pacientes || formValues?.conjunto_pacientes.length >= 2)) {
            let temNomeIgual = false;

            for(let i = 0; i < formValues?.conjunto_pacientes.length; i++) {
                const item = formValues?.conjunto_pacientes[i];
                const cjClienteNomeIgual = formValues?.conjunto_pacientes.filter((item2, index) => {
                    return item2.nome === item.nome;
                });
                console.log('cjClienteNomeIgual', cjClienteNomeIgual);
                if(cjClienteNomeIgual.length > 1) {
                    temNomeIgual = true;
                    break;
                }
            }
            
            if(temNomeIgual) {
                return false;
            }

            const cjClienteSemNome = formValues?.conjunto_pacientes.filter((item, index) => {
                return item.nome === '';
            });
            console.log('cjClienteSemNome', cjClienteSemNome);
            if(cjClienteSemNome.length > 0) {
                return false;
            }
        }

        return true;
    }
    
    function handleSaveProduct() {
        // dispatch(saveProduct(getValues()));
    }

    function handleRemoveProduct() {
        // dispatch(removeProduct()).then(() => {
        //     navigate('/apps/e-commerce/products');
        // });
    }

    function handleClickEditarPagina() {
        navigate(`/cliente/${cliente.id}/pagina/${cliente.pagina_principal}`);
    }

    const formatClienteObj = (clienteObj) => {
        const clienteData = clienteObj;
        delete clienteData.statusIcon;
        delete clienteData.statusColor;
        delete clienteData.endereco;
        delete clienteData.bairro;
        delete clienteData.cidade;
        delete clienteData.uf;
        delete clienteData.cep;
        delete clienteData.telefoneCelular;
        delete clienteData.telefoneFixo;
        delete clienteData.email;
        delete clienteData.cnpj;
        delete clienteData.razaoSocial;

        return clienteData;
    }

    async function handleExcluir() {
        try {
            setOpen(false);
            const res = await axios.delete(`${apiURL}/cliente/${cliente.id}`);
            if (res && res.status === 200) {
                dispatch(
                    showMessage({
                        message: 'Cliente excluído com sucesso!',
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate('/pacientes')
            } else {
                dispatch(
                    showMessage({
                        message: 'Erro ao excluir Cliente!',
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'error'
                    })
                );
            }
        } catch (err) {
            console.log(err);
            dispatch(
                showMessage({
                    message: 'Erro ao excluir Cliente!',
                    autoHideDuration: 6000,
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                    },
                    variant: 'error'
                })
            );
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleCriarCliente() {
        try {
            const res = await axios.post(`${apiURL}/cliente`, {
                data : clienteAdd
            });
            let tipoCliente = 'Cliente';
            if(clienteAdd?.tipo !== 'Individual') {
                tipoCliente = 'Conjunto de Clientes';
            }
            if (res && res.status === 200) {
                dispatch(
                    showMessage({
                        message: `${tipoCliente} cadastrado com sucesso!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate('/pacientes')
            } else {
                dispatch(
                    showMessage({
                        message: `Erro ao Cadastrar ${tipoCliente}!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'error'
                    })
                );
            }
        } catch (err) {
            console.log(err);
            let tipoCliente = 'Cliente'
            if(clienteAdd?.tipo !== 'Individual') {
                tipoCliente = 'Conjunto de Clientes'
            }
            dispatch(
                showMessage({
                    message: `Erro ao Cadastrar ${tipoCliente}!`,
                    autoHideDuration: 6000,
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                    },
                    variant: 'error'
                })
            );
        }
    }

    async function handleSalvarCliente() {
        try {
            const data = formatClienteObj(cliente);
            const res = await axios.put(`${apiURL}/cliente/${data.id}`, {
                data
            });
            if (res && res.status === 200) navigate('/pacientes');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="mb-32 flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 px-24 md:px-32">
            <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
                >
                    <Typography
                        className="flex items-center sm:mb-12"
                        component={Link}
                        role="button"
                        to="/pacientes"
                        color="inherit"
                    >
                        <FuseSvgIcon size={20}>
                            {theme.direction === 'ltr'
                                ? 'heroicons-outline:arrow-sm-left'
                                : 'heroicons-outline:arrow-sm-right'}
                        </FuseSvgIcon>
                        <span className="flex mx-4 font-medium">Clientes</span>
                    </Typography>
                </motion.div>

                <div className="flex items-center max-w-full">
                    {/* <motion.div
                        className="hidden sm:flex"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { delay: 0.3 } }}
                    >
                        <img
                            className="w-32 sm:w-48 rounded"
                            src={ cliente?.logo ? cliente.logo : "assets/images/pacientes/page-cliente-icon.png" }
                            alt={name}
                        />
                    </motion.div> */}
                    <motion.div
                        className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.3 } }}
                    >
                        {cliente ? (
                            <Typography className="text-16 sm:text-20 truncate font-semibold">
                                {titleEdit}
                            </Typography>
                        ) : (
                            <Typography className="text-16 sm:text-20 truncate font-semibold">
                                {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                            </Typography>
                        )}
                        <Typography variant="caption" className="font-medium">
                            {`${cliente?.dominio ? cliente?.dominio : ''}`}
                        </Typography>
                    </motion.div>
                </div>
            </div>
            <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
                {isEdit ? (
                    <>
                        {/* <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="success"
                            startIcon={<EditNoteOutlined />}
                            onClick={handleClickEditarPagina}
                        >
                            Editar Página
                        </Button> */}
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            disabled={!isChange}
                            startIcon={<SaveAltOutlined />}
                            onClick={handleSave}
                        >
                            Salvar
                        </Button>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="error"
                            onClick={handleClickOpen}
                            startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
                        >
                            Excluir
                        </Button>
                    </>
                ) : (
                        <>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="success"
                            disabled={!isValid}
                            startIcon={!isLoading ? <Add /> : <CircularProgress size={20} />}
                            onClick={handleCriarCliente}
                        >
                            Cadastrar Cliente
                        </Button>
                        {/* <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color={clienteAdd?.formulario !== '' ? "info" : "success"}
                            startIcon={clienteAdd?.formulario !== '' ? <Edit /> : <Add />}
                            onClick={handleClickEditarPagina}
                        >
                            {clienteAdd?.formulario !== '' ? 'Editar Formulário de Solicitação' : 'Criar Formulário de Solicitação'}
                            </Button> */}
                        </>
                )}
            </motion.div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Tem certeza que deseja excluir o cliente?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Ao excluir o cliente, você não poderá mais recuperá-lo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleExcluir}>Ok, excluir</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClienteHeader;
