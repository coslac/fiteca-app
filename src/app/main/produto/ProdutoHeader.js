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

function ProdutoHeader({props, isEditParam, isChangeForm, produtoAddParam, handleSave}) {
    const dispatch = useDispatch();
    const featuredImageId = '';
    const images = [];
    const name = 'SambaTech';
    const theme = useTheme();
    const navigate = useNavigate();
    const [produto, setProduto] = useState(null);
    const [produtoAdd, setProdutoAdd] = useState(null);
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
                if (props && props?.artigo) {
                    setTitleEdit(`${props?.artigo} | Editar Produto`);
                    setProduto(props);
                }
            } else {
                setTitleAdd('Novo Produto');
            }
    }, [isEditParam, props]);

    useEffect(() => {
        if (produtoAddParam) {
            setProdutoAdd(produtoAddParam);
            setTitleAdd('Novo Produto');
        }
    }, [produtoAddParam]);

    function validaFormAdd(formValues) {
        console.log('formValues para validar', formValues);
        if(!formValues) {
            return false;
        }

        if(!formValues?.artigo || formValues?.artigo === '') {
            return false;
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

    async function handleExcluir() {
        try {
            setOpen(false);
            const res = await axios.delete(`${apiURL}/produto/${produto.id}`);
            if (res && res.status === 200) {
                dispatch(
                    showMessage({
                        message: 'Produto excluído com sucesso!',
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate('/produtos')
            } else {
                dispatch(
                    showMessage({
                        message: 'Erro ao excluir Produto!',
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
                    message: 'Erro ao excluir Produto!',
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

    async function handleCriarProduto() {
        try {
            const res = await axios.post(`${apiURL}/produto`, {
                data : produtoAdd
            });

            if (res && res.status === 201) {
                dispatch(
                    showMessage({
                        message: `Produto cadastrado com sucesso!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate('/produtos')
            } else {
                dispatch(
                    showMessage({
                        message: `Erro ao Cadastrar Produto!`,
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
                    message: `Erro ao Cadastrar Produto!`,
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

    async function handleSalvarProduto() {
        try {
            const data = produto;
            const res = await axios.put(`${apiURL}/produto/${data.id}`, {
                data
            });
            if (res && res.status === 200) navigate('/produtos');
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
                        to="/produtos"
                        color="inherit"
                    >
                        <FuseSvgIcon size={20}>
                            {theme.direction === 'ltr'
                                ? 'heroicons-outline:arrow-sm-left'
                                : 'heroicons-outline:arrow-sm-right'}
                        </FuseSvgIcon>
                        <span className="flex mx-4 font-medium">Produtos</span>
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
                            src={ produto?.logo ? produto.logo : "assets/images/produtos/page-produto-icon.png" }
                            alt={name}
                        />
                    </motion.div> */}
                    <motion.div
                        className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.3 } }}
                    >
                        {produto ? (
                            <Typography className="text-16 sm:text-20 truncate font-semibold">
                                {titleEdit}
                            </Typography>
                        ) : (
                            <Typography className="text-16 sm:text-20 truncate font-semibold">
                                Novo Produto
                            </Typography>
                        )}
                        <Typography variant="caption" className="font-medium">
                            {`${produto?.dominio ? produto?.dominio : ''}`}
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
                            //disabled={!isChange}
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
                            disabled={!validaFormAdd(produtoAdd)}
                            startIcon={!isLoading ? <Add /> : <CircularProgress size={20} />}
                            onClick={handleCriarProduto}
                        >
                            Cadastrar
                        </Button>
                        {/* <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color={produtoAdd?.formulario !== '' ? "info" : "success"}
                            startIcon={produtoAdd?.formulario !== '' ? <Edit /> : <Add />}
                            onClick={handleClickEditarPagina}
                        >
                            {produtoAdd?.formulario !== '' ? 'Editar Formulário de Solicitação' : 'Criar Formulário de Solicitação'}
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
                <DialogTitle>Tem certeza que deseja excluir o produto?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Ao excluir o produto, você não poderá mais recuperá-lo.
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

export default ProdutoHeader;
